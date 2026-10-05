"""Export readable data/output snapshots for the two posts.

Run with the notebook environment:
    python scripts/render-post-outputs.py --data-dir /path/to/ML-Blog/data
"""

import argparse
import hashlib
import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/posts/figures"
DATA_OUTPUT = ROOT / ".local/post-data/figures"
INK, MUTED, RULE = "#183047", "#64748B", "#DCE3EA"


def snapshot(name, title, subtitle, frame, headers, widths, footer, formats=None):
    """Render actual dataframe values; export their unrounded CSV alongside."""
    formats = formats or {}
    row_height, top, header_height = 47, 120, 66
    bottom = top + header_height + len(frame) * row_height
    height = bottom + 65
    fig, ax = plt.subplots(figsize=(10, height / 100), dpi=160)
    fig.subplots_adjust(0, 0, 1, 1)
    ax.set(xlim=(0, 1000), ylim=(height, 0))
    ax.axis("off")
    fig.patch.set_facecolor("white")
    ax.text(34, 38, title, fontsize=17, weight="bold", color=INK, va="center")
    ax.text(34, 76, subtitle, fontsize=11, color=MUTED, va="center")
    ax.add_patch(Rectangle((34, top), 932, header_height, color="#F1F5F9", lw=0))
    boundaries = [34]
    for width in widths:
        boundaries.append(boundaries[-1] + 932 * width)
    assert abs(boundaries[-1] - 966) < 0.01
    for j, header in enumerate(headers):
        ax.text(boundaries[j] + 12, top + header_height / 2, header,
                fontsize=10.5, weight="bold", fontfamily="DejaVu Sans Mono",
                color=INK, va="center", linespacing=1.5)
    for i, row in enumerate(frame.itertuples(index=False, name=None)):
        y = top + header_height + i * row_height
        if i % 2 == 1:
            ax.add_patch(Rectangle((34, y), 932, row_height, color="#F8FAFC", lw=0))
        for j, value in enumerate(row):
            missing = pd.isna(value)
            rendered = "NaN" if missing else (
                formats[frame.columns[j]].format(value)
                if frame.columns[j] in formats else str(value)
            )
            ax.text(boundaries[j] + 12, y + row_height / 2, rendered,
                    fontsize=11.5, fontfamily="DejaVu Sans Mono", va="center",
                    color="#A45423" if missing else INK)
        ax.plot([34, 966], [y + row_height, y + row_height], color=RULE, lw=0.65)
    ax.text(34, bottom + 35, footer, fontsize=10.5, color=MUTED, va="center")
    fig.savefig(OUTPUT / f"{name}.png", facecolor="white")
    plt.close(fig)
    DATA_OUTPUT.mkdir(parents=True, exist_ok=True)
    frame.to_csv(DATA_OUTPUT / f"{name}.csv", index=False)


def ames_outputs(data_dir):
    source = data_dir / "ames.txt"
    raw = pd.read_csv(source, sep="\t")
    split = json.loads((ROOT / "public/posts/notebooks/ames/split.json").read_text())
    assert hashlib.sha256(source.read_bytes()).hexdigest() == split["source_sha256"]
    numeric, ordinal, nominal = (split[k] for k in ("numeric", "ordinal", "nominal"))
    features = numeric + ordinal + nominal
    # Use the workbook's exported dataframes rather than maintaining a second pipeline.
    exports = ROOT / ".local/notebooks/ames"
    housing = pd.read_csv(exports / "cleaned_housing.csv", index_col="row_id",
                          dtype={"MS SubClass": str})
    prepared = pd.read_csv(exports / "prepared_housing.csv", index_col="row_id")
    train = housing.loc[split["train_idx"], features]
    test = housing.loc[split["test_idx"], features]
    train_prep = prepared.loc[train.index].drop(columns=split["target"])
    test_prep = prepared.loc[test.index].drop(columns=split["target"])
    assert raw.shape == (2930, 82)
    assert train_prep.shape == (2341, 68) and test_prep.shape == (586, 68)
    assert train_prep.columns.equals(test_prep.columns)
    assert not train_prep.isna().any().any() and not test_prep.isna().any().any()
    preview = raw[["Gr Liv Area", "Lot Frontage", "MS SubClass", "Pool QC", "SalePrice"]].head()
    preview = preview.rename_axis("row").reset_index()
    snapshot("ames-data-preview", "Ames Housing: a few rows from the source table",
             "Full dataset: 2,930 rows × 82 columns · selected columns shown",
             preview, ["row", "Gr Liv\nArea", "Lot\nFrontage", "MS\nSubClass", "Pool QC", "SalePrice"],
             [.08, .18, .20, .18, .16, .20],
             "Original row indices · area in square feet · frontage in feet · price in dollars",
             {"Gr Liv Area": "{:,.0f}", "Lot Frontage": "{:.1f}", "SalePrice": "{:,.0f}"})
    invalid = raw["Garage Yr Blt"] > raw["Yr Sold"]
    assert raw.index[invalid].tolist() == split["garage_years_marked_unknown"]
    invalid_years = raw.loc[invalid, ["Garage Yr Blt", "Yr Sold"]].rename_axis("row").reset_index()
    snapshot("ames-invalid-garage-years", "Garage years that conflict with the sale year",
             "Notebook §4 · both entries are marked unknown before the outlier check",
             invalid_years, ["row", "Garage Yr Blt", "Yr Sold"], [.16, .46, .38],
             "No replacement year is guessed · this step retains both rows",
             {"Garage Yr Blt": "{:.0f}", "Yr Sold": "{:.0f}"})
    candidate_nominal = nominal + split["dropped_nzv"]
    category_rows = []
    for column in candidate_nominal:
        shares = raw.loc[split["train_idx"], column].value_counts(normalize=True)
        category_rows.append([column, str(shares.index[0]), 100 * shares.iloc[0]])
    variation = pd.DataFrame(category_rows, columns=["column", "most common", "share"])
    variation = variation.sort_values("share", ascending=False)
    snapshot("ames-feature-variation", "The most common category in each candidate column",
             "Notebook §5 · training rows only; proportions exclude missing entries", variation,
             ["column", "most common", "share"], [.43, .32, .25],
             "The notebook removes Street using its >99% rule; Central Air stays",
             {"share": "{:.2f}%"})
    large = raw.loc[raw["Gr Liv Area"] > 4000, ["Gr Liv Area", "SalePrice", "Sale Condition"]]
    snapshot("ames-large-properties", "The five properties above 4,000 square feet",
             "Selected source rows before the notebook's three exclusions",
             large.rename_axis("row").reset_index(),
             ["row", "Gr Liv Area", "SalePrice", "Sale Condition"], [.12, .27, .25, .36],
             "Living area in square feet · recorded sale price in dollars",
             {"Gr Liv Area": "{:,.0f}", "SalePrice": "{:,.0f}"})
    target = housing.loc[split["train_idx"], split["target"]]
    fig, axes = plt.subplots(1, 2, figsize=(10, 4.8), dpi=160)
    fig.patch.set_facecolor("white")
    fig.suptitle("Sale prices before and after a log transformation", x=.04,
                 ha="left", fontsize=17, weight="bold", color=INK)
    for ax, values, label, color in zip(
        axes, [target, np.log1p(target)],
        ["SalePrice ($)", "log1p(SalePrice)"], ["#2878A8", "#168577"],
    ):
        ax.hist(values, bins=40, color=color, alpha=.9)
        ax.set(xlabel=label, ylabel="Properties")
        ax.set_title(f"Sample skewness: {values.skew():.2f}", loc="left", fontsize=12)
        ax.spines[["top", "right"]].set_visible(False)
        ax.tick_params(axis="both", labelsize=10)
        ax.set_axisbelow(True)
        ax.grid(axis="y", color=RULE, lw=.6)
    axes[0].xaxis.set_major_formatter(plt.FuncFormatter(lambda v, _: f"{v/1000:.0f}k"))
    fig.text(.04, .04, f"Notebook §7 · the same {len(target):,} training sales · the exported target stays in dollars",
             fontsize=10.5, color=MUTED)
    fig.tight_layout(rect=(.01, .10, .99, .89), w_pad=2.8)
    fig.savefig(OUTPUT / "ames-target-distribution.png", facecolor="white")
    plt.close(fig)
    pd.DataFrame({"SalePrice": target, "log1p(SalePrice)": np.log1p(target)}).to_csv(
        DATA_OUTPUT / "ames-target-distribution.csv", index_label="row_id")
    missing = train.isna().sum().loc[lambda s: s > 0].sort_values(ascending=False)
    missing_frame = pd.DataFrame({"column": missing.index, "missing": missing.values,
                                  "percent": 100 * missing.values / len(train)})
    snapshot("ames-missing-values", "Missing values in the training data",
             "2,341 training properties · counts before imputation", missing_frame,
             ["column", "missing", "percent"], [.51, .24, .25],
             "Only columns with missing values are shown · one missing value rounds to 0.04%",
             {"missing": "{:,.0f}", "percent": "{:.2f}%"})
    col = "Lot Frontage"
    selected = list(train.index[train[col].isna()][:2]) + list(train.index[train[col].notna()][:2])
    median = train[col].median()
    filled = train[col].fillna(median)
    mean, scale = filled.mean(), filled.std(ddof=0)
    np.testing.assert_allclose(train_prep[col], (filled - mean) / scale)
    example = pd.DataFrame({"row": selected, "raw frontage": train.loc[selected, col].values,
                            "filled frontage": train.loc[selected, col].fillna(median).values,
                            "scaled frontage": train_prep.loc[selected, col].values})
    snapshot("ames-frontage-transformation", "Lot frontage before and after preprocessing",
             "Two missing and two observed training measurements", example,
             ["row", "raw\nfrontage", "filled\nfrontage", "scaled\nfrontage"], [.12, .27, .29, .32],
             f"Training median: {median:.1f} ft · mean after filling: {mean:.2f} · scale: {scale:.2f}",
             {"raw frontage": "{:.1f}", "filled frontage": "{:.1f}", "scaled frontage": "{:.3f}"})
    shown = ["Gr Liv Area", "Lot Frontage", "Exter Qual", "Central Air_Y", "MS SubClass_20"]
    prepared = train_prep[shown].head(4).rename_axis("row").reset_index()
    snapshot("ames-prepared-features", "A sample of the model inputs",
             "Training: 2,341 × 68 · test: 586 × 68 · no missing output values",
             prepared, ["row", "Gr Liv\nArea", "Lot\nFrontage", "Exter\nQual", "Central\nAir_Y", "MS\nSubClass_20"],
             [.08, .18, .20, .16, .18, .20],
             "Five of 68 output columns · scaled numeric / quality values, then category indicators",
             {col: "{:.3f}" for col in shown})


def hotel_outputs(data_dir):
    raw = pd.read_csv(data_dir / "hotels.csv")
    data = raw.copy()
    assert data["is_canceled"].notna().all() and data["is_canceled"].isin([0, 1]).all()
    data["total_nights"] = data["stays_in_week_nights"] + data["stays_in_weekend_nights"]
    data["total_guests"] = data[["adults", "children", "babies"]].sum(axis=1, min_count=3)
    assert raw.shape == (119390, 32)
    preview = data.groupby("hotel").head(3)[["hotel", "is_canceled", "lead_time", "adr", "total_nights"]]
    snapshot("hotel-data-preview", "A few booking records from each hotel",
             "119,390 bookings · 32 source columns · first three rows per hotel",
             preview.rename_axis("row").reset_index(),
             ["row", "hotel", "is_\ncanceled", "lead_\ntime", "adr", "total_\nnights"],
             [.11, .27, .18, .15, .13, .16],
             "Original row indices · lead time in days · total_nights is derived from both stay columns",
             {"adr": "{:.2f}"})
    flags = pd.DataFrame({
        "Negative ADR": data["adr"].lt(0),
        "Zero ADR": data["adr"].eq(0),
        "Zero-night booking": data["total_nights"].eq(0),
        "No recorded guests": data["total_guests"].eq(0),
        "Missing guest count": data["total_guests"].isna(),
        "Repeated row beyond first": raw.duplicated(),
    })
    quality = pd.DataFrame({"check": flags.columns, "bookings": flags.sum().values,
                            "share": 100 * flags.mean().values})
    snapshot("hotel-quality-checks", "Records flagged for inspection",
             "All bookings are retained in the main analysis", quality,
             ["check", "bookings", "share"], [.59, .22, .19],
             "Flags can overlap · a matching row is not proof of a duplicated reservation",
             {"bookings": "{:,.0f}", "share": "{:.3f}%"})
    rates = data.groupby("hotel")["is_canceled"].agg(bookings="count", cancellations="sum", rate="mean")
    assert rates["bookings"].sum() == 119390 and rates["cancellations"].sum() == 44224
    rates["rate"] *= 100
    snapshot("hotel-cancellation-summary", "Cancellation counts and rates by hotel",
             "The denominator is all recorded bookings at each hotel", rates.reset_index(),
             ["hotel", "bookings", "cancellations", "rate"], [.31, .22, .27, .20],
             "Overall: 44,224 / 119,390 = 37.04% · City − Resort: 13.96 percentage points",
             {"bookings": "{:,.0f}", "cancellations": "{:,.0f}", "rate": "{:.2f}%"})
    means = data.groupby(["hotel", "is_canceled"])["adr"].mean().unstack()
    overall = data.groupby("is_canceled")["adr"].mean()
    means.loc["Both hotels"] = overall
    means = means.reindex(["Both hotels", "City Hotel", "Resort Hotel"])
    means.columns = ["not cancelled", "cancelled"]
    means["difference"] = means["cancelled"] - means["not cancelled"]
    snapshot("hotel-adr-summary", "Mean recorded ADR by hotel and booking outcome",
             "All recorded ADR values, including zero and negative entries", means.reset_index(),
             ["hotel", "not\ncancelled", "cancelled", "difference"], [.31, .24, .23, .22],
             "Difference = cancelled − not cancelled · values use the dataset's recorded ADR units",
             {"not cancelled": "{:.2f}", "cancelled": "{:.2f}", "difference": "{:+.2f}"})


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data-dir", type=Path, required=True)
    parser.add_argument("--post", choices=["ames", "hotels", "all"], default="all")
    args = parser.parse_args()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    if args.post in ("ames", "all"):
        ames_outputs(args.data_dir)
    if args.post in ("hotels", "all"):
        hotel_outputs(args.data_dir)
    print("Exported selected post outputs with matching CSV downloads.")
