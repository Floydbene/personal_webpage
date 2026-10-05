# Revision assessment — 1 October 2026

The revised **content and local notebooks rate 9/10 each**. This is an editorial assessment of correctness, explanations, practical examples, reproducibility and reading quality. It is not a measured performance benchmark or a live accessibility certification.

| Pair | Previous article score | Revised article | Revised notebook |
| --- | ---: | ---: | ---: |
| Data Cleaning Fundamentals | 7.5/10 | 9/10 | 9/10 |
| Data Visualization | 8/10 | 9/10 | 9/10 |
| The Basics of Regression | 6.5/10 | 9/10 | 9/10 |

## Iterations and evidence

1. Made targeted changes to the existing notebooks and pages. Reserved Ames row IDs before learned choices; added a complete preprocessing recipe, a visualization recipe, a baseline, dollar-error comparisons and residual diagnosis. Preserved the original numbered notebook sections and their order. Kept logistic regression as the segue, with its existing notebook metric cells labelled an optional preview. No classification draft was created.
2. Executed the notebooks in fresh IPython processes. The first run caught an undefined `living_area_test_metrics` in the existing logistic example. Fixed that missing calculation. Reviewed the generated figures, improved the countdown chart's annotations, removed redundant reference callouts and corrected the article's training-statistic wording. The second execution passed all three notebooks without saved warnings or errors.
3. Rechecked the isolated download and then adapted storage to the requested references. Notebooks now live in Colab/Drive; local working copies are ignored by Git. Removed website CSV, notebook and bundle assets, retaining the split record and package list. Both source datasets were successfully loaded from their online references. A cold regression run recreated the exports through the preparation notebook's source snapshot, with no source CSV in its test directory. Its cleaned data, prepared matrix, split metadata and regression metrics matched the local saved results.

The final notebook executions contain **29 cleaning, 18 visualization and 23 regression code cells**, with valid saved outputs. Every original numbered notebook section heading remains intact. Before the hosting adaptation, exact-line comparison retained approximately 86% of the existing cleaning code and 99% of the existing visualization and regression code; added cells supply the missing demonstrations rather than replacing the model examples.

The production build passes. All three pages render through the React template, with one title each, semantic tables and valid rich text. Figure files and dimensions, local retained references and the 1 → 2 → 3 → 1 reading cycle were checked. The built article URLs include individual titles, descriptions and sharing metadata. The built public notebook folder contains only the split record and package list.

## Why the scores improved

**Cleaning:** training-only category, correlation and target summaries now follow an early reserved split; fixed source-documented exclusions remain explicit. The original explanations of missingness and log prices remain, with actual training skewness updated to 1.59 → −0.13. The page supplies the complete pipeline, readable tables and a transferable decision guide. Test diagnostics remain in the notebook but are off by default. The revised protocol does not erase prior exploration of this public dataset.

**Visualization:** the original investigation and countdown axis remain. The 100-day annotations make the curve concrete: approximately 55% of cancelled and 31% of non-cancelled bookings were made at least that far ahead. A complete rate-chart recipe teaches units, counts and intervals; reusable chart-choice advice and an exercise make the methods transferable. Subgroup and sensitivity arguments are preserved.

**Regression:** the notebook now compares six candidates on five common training folds, fits preprocessing inside each fold, selects degree and alpha using those folds, and evaluates fixed candidates on the same 586 test houses. Degree five replaces the unidentified degree-ten example on ten possible quality grades. The page explains this limitation and shows actual validation errors rather than inferring overfitting from curve shape.

Training cross-validation selects all-feature Ridge with alpha=1. Its test MAE is **$19,656** and RMSE **$30,892**, compared with baseline errors **$62,306** and **$89,817**. OLS is slightly better on this test split; the selected model stays fixed. Ridge's approximately $11 CV advantage is small beside the roughly $1,605 fold spread. The article therefore makes a useful, limited conclusion about the fuller feature set. The residual plot exposes substantial expensive-house misses instead of hiding them behind one average.

## Remaining checks

- **Public sharing:** the three new Colab notebooks still require Anyone with the link → Viewer. The available connector cannot set anonymous permissions. Until that is done, public readers and the regression preparation download are not verified. [Notebook locations and storage](./blog-notebooks.md).
- **Colab execution:** execution was verified locally, including the fresh-runtime recreation path and actual online dataset reads. The live Colab service itself was not operated. Package/runtime differences may require the provided package versions.
- **Live layout:** the browser connector reports no available browser. Mobile rendering, keyboard interaction and screen-reader behaviour remain unverified; they are not included in the 9/10 content scores.
- **Further modelling:** richer missingness treatment, interaction experiments, repeated evaluation and an independent dataset would extend the series. They are later work, not gaps in the stated introductory lesson.

The earlier [audit](./blog-audit-2026-10-01.md) remains the unchanged baseline assessment.
