"""Execute the local notebook working copies and refresh their saved outputs.

Run with a Python environment installed from public/posts/notebooks/requirements.txt:
    python scripts/execute-post-notebooks.py
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path

import nbformat
from jupyter_client import KernelManager
from nbclient import NotebookClient
from IPython.utils.capture import capture_output
from ipykernel.inprocess.manager import InProcessKernelManager

ROOT = Path(__file__).resolve().parents[1]
NOTEBOOKS = ROOT / ".local/notebooks"
NAMES = ["Machine_Learning_Fundamentals.ipynb", "Hotel_Booking_EDA.ipynb", "regression-survey.ipynb"]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--notebook", choices=NAMES)
    parser.add_argument("--directory", type=Path, default=NOTEBOOKS,
                        help="Notebook folder; use an extracted download to check reproducibility.")
    parser.add_argument("--in-process", action="store_true",
                        help="Run a fresh IPython kernel in this process when local sockets are unavailable.")
    args = parser.parse_args()
    if args.in_process and not args.notebook:
        # Isolate notebooks in fresh interpreters, including the IPython namespace.
        for name in NAMES:
            subprocess.run([sys.executable, __file__, "--in-process", "--notebook", name,
                            "--directory", str(args.directory.resolve())], check=True)
        return
    for name in ([args.notebook] if args.notebook else NAMES):
        path = args.directory / name
        notebook = nbformat.read(path, as_version=4)
        print(f"Executing {name}", flush=True)
        if args.in_process:
            execute_in_process(notebook, args.directory)
        else:
            manager = KernelManager(kernel_name="python3")
            # Use the invoking interpreter rather than an unrelated global kernel.
            manager.kernel_spec.argv = [sys.executable, "-m", "ipykernel_launcher", "-f", "{connection_file}"]
            client = NotebookClient(notebook, km=manager, timeout=300,
                                    resources={"metadata": {"path": str(args.directory)}})
            client.execute()
        assert not any(output.output_type == "error" for cell in notebook.cells
                       if cell.cell_type == "code" for output in cell.outputs)
        nbformat.write(notebook, path)
        print(f"Passed: {name}", flush=True)


def execute_in_process(notebook, directory):
    manager = InProcessKernelManager()
    manager.start_kernel()
    shell = manager.kernel.shell
    previous_directory = Path.cwd()
    os.chdir(directory)
    try:
        shell.run_line_magic("matplotlib", "inline")
        for cell in notebook.cells:
            if cell.cell_type != "code":
                continue
            with capture_output() as captured:
                result = shell.run_cell(cell.source, store_history=True)
            if result.error_before_exec or result.error_in_exec:
                raise RuntimeError(f"Cell failed: {result.error_before_exec or result.error_in_exec}\n{cell.source}\n{captured.stdout}\n{captured.stderr}")
            cell.execution_count = result.execution_count
            cell.outputs = []
            if captured.stdout:
                cell.outputs.append(nbformat.v4.new_output("stream", name="stdout", text=captured.stdout))
            if captured.stderr:
                cell.outputs.append(nbformat.v4.new_output("stream", name="stderr", text=captured.stderr))
            for output in captured.outputs:
                cell.outputs.append(nbformat.v4.new_output("display_data", data=output.data, metadata=output.metadata))
        nbformat.validate(notebook)
    finally:
        os.chdir(previous_directory)
        manager.shutdown_kernel()


if __name__ == "__main__":
    os.environ.setdefault("MPLCONFIGDIR", "/private/tmp/blog-matplotlib")
    os.environ.setdefault("IPYTHONDIR", "/private/tmp/blog-ipython")
    main()
