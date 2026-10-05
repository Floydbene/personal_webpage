# Notebook references

The blog links to Colab notebooks stored in Google Drive. Source datasets load from their existing public repositories. Notebook files, source datasets and generated CSVs do not belong in this website's Git repository.

| Post | Notebook |
| --- | --- |
| Data Cleaning Fundamentals | [Colab](https://colab.research.google.com/drive/1PKIWbdQkbr5fY5IdgD-4ZwHg-GcsMBfq) |
| Data Visualization | [Colab](https://colab.research.google.com/drive/1rndiaA_49JD2r-bOyw2S97FVHTiy23dx) |
| The Basics of Regression | [Colab](https://colab.research.google.com/drive/1Q9pXGJko1QY3TayhqtY-3GKSn9i2lLEX) |
| Dimensionality Reduction and Support Vector Machines | [Colab](https://colab.research.google.com/drive/1NwD08gEXxpaU_wM9DK5HltQlCohJ9BbV) |

The PCA/SVM revision adds a two-band geometry illustration, question-led transitions and an executed comparison of two PCs, nine PCs and all 200 bands. Its manual sections explain model behaviour; the final experiment uses scikit-learn. All three candidates share five training folds and a four-setting RBF search. The article's tables and figure dimensions are recorded in `src/content/pcaSvmResults.js`, from the notebook's `output/indian-pines/representation-comparison.json`. Timings include preprocessing and are specific to the recorded run. The test set was already inspected in earlier development; results remain exploratory within-scene comparisons.

Only `PCA_SVM.ipynb` is revised for this addition. Do not execute or regenerate the older notebooks as part of this workflow. Its first code cell downloads missing `.mat` inputs from `researcher111/LearningHyperspectral`, under `master/starter-Pines`, and reuses existing files. No manual runtime upload is required. New PCA/SVM publication figures are copied from that notebook's `output/indian-pines/` folder. The existing three Colab notebooks and their links stay unchanged.

The source notebook at `/Users/floydbenedikter/Code/Sandbox/ML-Blog/PCA_SVM.ipynb` rejected replacement with `EPERM`, including elevated execution, on 5 October 2026. The revised, executed copy is retained here in `.local/notebooks/PCA_SVM.ipynb`; the original was not changed. Use the revised copy for the new article. On 5 October 2026 the revised notebook was uploaded as a new Colab notebook (linked above), with existing outputs intact. The connected Drive account owns it and Floyd’s personal Google account has editing access. The first code cell now downloads both companion data files directly from GitHub. The earlier Drive copies remain available but are no longer required.

The new PCA/SVM notebook and its two companion data files are verified as **Anyone with the link → Viewer**. The older three notebooks' sharing settings remain unchanged; verify their reader access separately before publishing their links. The regression notebook's preparation reference also needs reader access.

Colab stores notebook contents in Drive, but does not share runtime files between notebooks. When Ames exports are absent, the regression notebook downloads and runs the referenced preparation notebook in its own runtime. The original preparation code recreates the split and CSVs there. These files are not hosted by the website. [Colab's storage and sharing documentation](https://research.google.com/colaboratory/faq.html).

For local editing, the revised working copies live in `.local/notebooks/`, which Git ignores. Use the notebook environment installed from `public/posts/notebooks/requirements.txt`. Run `scripts/execute-post-notebooks.py`; add `--in-process` if local Jupyter sockets are unavailable. `--directory` supports a different notebook folder. All three notebooks run in fresh interpreter processes in that mode.

`public/posts/notebooks/ames/split.json` is the small retained record of the actual split, feature lists and source fingerprint. It is included deliberately. The package list is also retained. Plots and small summary values in article tables remain normal website content.

Source data:

- [Ames Housing](https://raw.githubusercontent.com/rasbt/machine-learning-book/main/ch09/AmesHousing.txt)
- [Hotel bookings](https://raw.githubusercontent.com/rfordatascience/tidytuesday/main/data/2020/2020-02-11/hotels.csv)

To regenerate publication figures, execute the working notebooks, then copy their relevant figure outputs from `.local/notebooks/output/`. `scripts/render-post-outputs.py --data-dir /path/to/source-data` generates the cleaning illustrations and selected table summaries. Its CSVs stay in the ignored `.local/post-data/figures/` folder; the article itself renders semantic tables rather than CSV downloads or table screenshots.
