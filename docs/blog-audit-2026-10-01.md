# Blog post quality audit

The three posts contain careful explanations and useful examples, but the learning experience is uneven. **Data Visualization is the strongest article. Data Cleaning has the strongest treatment of practical decisions. Regression needs the most work before it fulfils its title.** The biggest improvements are to finish the regression evaluation, demonstrate a clean training workflow, and make the examples easier to reproduce.

Reviewed on 1 October 2026. No article, notebook or application code was changed during this audit.

## Scope and evidence

I read all three articles, inspected their notebook source and saved outputs, checked local figure and download references, and visually inspected six representative figures. I also checked relevant scikit-learn documentation, the Ames source paper and the hotel data dictionary. I did not rerun the notebooks or independently reproduce every reported statistic.

The browser connector exposes no available browser, despite the local preview being open. Assessment of the website itself is therefore based on its implementation and figure files. Mobile rendering, screen-reader behaviour, keyboard interaction and actual page speed remain unverified. The technical scores below are provisional.

## Editorial assessment

Scores are editorial judgments on clarity, technical care, usefulness and how completely each article teaches its stated subject. They are not measured benchmarks.

| Post | Score | Main strength | Main gap |
| --- | --- | --- | --- |
| Data Cleaning Fundamentals | **7.5/10** | Explains the meaning and consequences of cleaning decisions | Too much notebook narration and advanced checking for the core lesson |
| Data Visualization Exploring Hotel Cancellations | **8/10** | Builds a coherent investigation and teaches denominators, subgroups and sensitivity | Explains how to read its charts much more than how to create or choose them |
| The Basics of Regression | **6.5/10** | Accurate distinctions about coefficients, penalties and classification | No regression performance comparison, residual diagnosis or complete fitting example |

Overall editorial judgment: **about 7.3/10**. The articles already demonstrate sound analytical judgment. To become strong teaching posts, they need clearer learning goals, more complete examples and fewer interruptions.

## Data Cleaning Fundamentals

### What works

The article distinguishes missing measurements from absent amenities, treats numeric category codes as categories, and makes the equal-spacing assumptions in ordinal encoding explicit. Its train-only imputation and scaling explanation is particularly useful. The example that turns frontage into filled and standardized values gives the reader a concrete transformation to follow.

The revised log-price discussion is substantially better: it explains compression, proportional error and why symmetry alone does not establish a better model. Keep those distinctions. The source paper supports the distinction between three suspect large partial sales and two unusually large but plausibly priced houses. Your choice to retain the latter is a documented decision; the paper itself recommends removing all five for its teaching exercise. [Ames source paper](https://jse.amstat.org/v19n3/decock.pdf).

### What is lacking

**[P1] The demonstrated workflow still makes data-dependent choices before the split.** The warning is honest, and the transformations themselves are fitted on training rows. However, readers can copy the sequence and carry the same evaluation weakness into their own projects. Put the split before learned feature pruning and other choices informed by the dataset; distinguish fixed validity rules from choices learned from the data. The article should demonstrate its own recommended workflow. Locations: [posts.js:45](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:45), [posts.js:448](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:448). Scikit-learn explicitly recommends keeping test rows out of feature selection and fitting transformations only on training data. [Data leakage guidance](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage).

**[P2] The article buries the central pipeline beneath too many diagnostics.** It has approximately 2,581 words, 12 sections and 11 figures. Adversarial validation, unseen categories across folds and stored-imputer inspection are useful extensions, but introduce another classifier and AUC before the series has taught modelling. Keep the core checks in the article and move the advanced checks into an optional notebook subsection. Show one complete, compact `ColumnTransformer` example: the present snippets reference a `preprocessor` whose construction the article never supplies. Locations: [posts.js:574](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:574), [posts.js:590](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:590), [posts.js:618](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:618).

**[P2] There is no compact set of reusable cleaning decisions.** Readers can follow what happened to Ames, but must extract the general procedure themselves. Add a short decision guide: invalid value → correct from evidence or mark missing; missing value → identify its meaning; unusual row → inspect before exclusion; learned transformation → fit within training data. Put a small before-and-after schema beside it. This would make the article useful when a reader opens a different dataset.

### Highest value revision

Reorder the example around a clean split, show the full preprocessing pipeline, and reduce the advanced diagnostics. Preserve the outlier and missingness reasoning: that is the most distinctive material.

## Data Visualization Exploring Hotel Cancellations

### What works

The investigation has a real sequence: inspect the records, compare rates, compare distributions, separate hotels, then test filtering choices. Counts stay beside percentages. The article distinguishes percentage points from relative changes and distinguishes a distribution conditional on cancellation from cancellation probability conditional on lead time.

The grouped ADR comparison and filtering analysis teach useful habits without claiming causation. The recap now gives a reader something to retain. The hotel dictionary supports the variable definitions; ADR describes a recorded daily-rate measure, so retaining the distinction from realised revenue is appropriate. [Hotel data dictionary](https://github.com/rfordatascience/tidytuesday/blob/main/data/2020/2020-02-11/readme.md).

### What is lacking

**[P1] The downloadable notebook needs an unprovided local data file.** Its loading cell uses `Path("data/hotels.csv")`, but that file is not included in the published downloads and the article does not explain the required local folder. A fresh notebook download cannot run without discovering and supplying this dependency. Add an exact data download and folder instruction, or load the documented source directly with an optional local fallback. Also give the required packages. Location: [Hotel_Booking_EDA.ipynb:190](/Users/floydbenedikter/Code/Sandbox/personal_webpage/public/posts/notebooks/Hotel_Booking_EDA.ipynb:190).

**[P2] It is a good visual analysis, but an incomplete visualization lesson.** There are two pandas aggregation snippets and no plotting example. Add one complete, reusable example for a rate chart or cumulative distribution. Briefly explain chart choice: a dot plot for group rates, a distribution plot for spread, and separate groups before relying on a pooled average. Show how to label units, denominators and uncertainty. That would fulfil the revised title without expanding into an exhaustive chart catalogue.

**[P2] The reversed lead-time axis adds avoidable learning effort.** The chart is internally consistent and the explanation is correct. However, its reversed x-axis and accumulation of bookings made at least a given number of days ahead require several paragraphs plus two nearby asides. A conventional ascending lead-time ECDF would simplify the lesson. If the countdown view is retained, explicitly identify it as the share booked at least that far ahead and give one annotated point on the figure. Location: [posts.js:880](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:880). This is a teaching recommendation, not a numerical error.

### Highest value revision

Make the notebook runnable from its downloads, add one plotting recipe, and simplify the distribution explanation. Keep the within-hotel comparison and sensitivity analysis.

## The Basics of Regression

### What works

The change from an area-only slope to a coefficient conditional on quality is explained carefully. The article correctly describes polynomial regression as linear in its coefficients, distinguishes MSE from SSE and RMSE, and explains why a lasso zero does not prove a feature has no relationship with price.

The ridge example is unusually useful: an individual coefficient grows while the overall norm shrinks. The text does not confuse one set of coefficient sizes with coefficient variance across repeated samples. The classifier metrics also distinguish class predictions from probabilities and disclose the exploratory preparation limitation.

### What is lacking

**[P1] The post never answers whether its price models make useful predictions.** There is no constant-price baseline, train/validation error comparison, dollar MAE or RMSE table, or residual plot. The only evaluation table belongs to classification. Add a baseline and compare a small number of price models using a consistent validation procedure. Use cross-validation within training data for selection, with preprocessing fitted inside each fold. Reserve the final test evaluation until choices are fixed. Location: [posts.js:1736](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:1736). The available regression metrics support this directly. [Scikit-learn regression metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics).

**[P2] Its scope is too broad for the foundation it supplies.** The article introduces several regressors, then a sigmoid, likelihood, log loss and six classification metrics. Yet the reader sees only one fitting snippet and no worked prediction/residual calculation. Teach fit → predict → calculate error → diagnose residuals first. Keep logistic regression as a short bridge and move its derivation and evaluation into the planned classification post. Location: [posts.js:1117](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:1117).

**[P2] The polynomial example is a poor demonstration of overfitting.** `Overall Qual` has only ten distinct training values, 1–10. A degree-ten polynomial with an intercept has eleven parameters, so those observations cannot identify all coefficients uniquely. Its bends between integer grades concern input values that this variable cannot take. The article correctly warns that a training curve does not establish generalisation, but should explain this limitation rather than use the shape as the intuitive evidence for fitting noise. Use a continuous input or simulated data and show validation error as degree rises. Locations: [posts.js:1268](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:1268), [regression-survey.ipynb:10756](/Users/floydbenedikter/Code/Sandbox/personal_webpage/public/posts/notebooks/regression-survey.ipynb:10756). The rank conclusion follows from the supplied training data and model construction; it is an audit inference.

**[P2] Regularization lacks the practical decisions needed to use it.** Explain why feature units change the coefficient penalty, show a minimal scaling-and-model pipeline, state the plotted settings, and explain how to choose `alpha` through validation. The notebook uses Ridge 100, Lasso 30,000 and ElasticNet 1 with `l1_ratio=0.5`; the article calls them illustrative but does not show them beside the chart. Tighten the normalization sentence: Ridge uses SSE; Lasso and ElasticNet both use SSE divided by `2n`. Their penalties differ. Locations: [posts.js:1550](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:1550), [posts.js:1559](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:1559). [Ridge objective](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html), [Lasso objective](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Lasso.html), [ElasticNet objective](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.ElasticNet.html).

### Highest value revision

Build the article around one complete price-prediction experiment with a baseline, errors and residuals. Then introduce extra features and regularization as responses to what that experiment reveals. Leave classification as the next article.

## Shared editorial issues

**[P2] Repetition interrupts the reading sequence.** Regression has ten asides; eight repeat a notebook-reference pattern. Its opening paragraph repeats the lede. Important warnings compete visually with routine source pointers. Keep animal asides for useful conceptual notes, misconceptions and recaps; consolidate notebook navigation into a compact reference list. Add the author's actual choices and observations where they explain a decision. Locations: [posts.js:1053](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:1053), [posts.js:1162](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:1162).

**[P2] The series changes datasets without explaining the transition.** Cleaning prepares Ames, Visualization switches to hotels, and Regression returns to Ames. The reading order works programmatically, but beginners need one sentence explaining that the visualization techniques are transferable and that the next model uses the earlier Ames exports. Add a clear learning outcome and prerequisite to each post.

## Website technical assessment

### Anti pattern verdict

The implementation passes the major structural checks: no generic card grid, gratuitous gradients or decorative hero statistics in the post template. Numbered headings, palette tokens and restrained animal markers provide an identifiable direction. The main presentation weaknesses are inconsistent figure styling and repeated reference callouts. These are specific style observations, not an inference about authorship.

| Dimension | Provisional score | Evidence |
| --- | --- | --- |
| Accessibility | **2/4** | Heading structure, alt text and focus styles are present, but tabular outputs are images and some regression alt text conveys little of the result |
| Performance | **3/4** | Figures have intrinsic dimensions, lazy loading and asynchronous decoding; all post content is imported into the shared application bundle |
| Responsive design | **3/4** | Flexible columns, mobile spacing and locally scrollable equations/tables; multi-panel image labels shrink with the image |
| Theming | **4/4** | Notes use existing palette tokens; calculated note-label contrast remains above 6:1 in all three themes |
| Presentation anti patterns | **3/4** | Intentional reading template, but figure designs and repetitive asides reduce consistency |
| **Total** | **15/20** | **Good implementation with material reading improvements remaining** |

Contrast was calculated from the configured OKLCH colours and 5% note wash, with conversion into the sRGB range. The lowest calculated category-label ratio is approximately **6.25:1**; note-body ratios remain above **7.8:1**. This checks those tokens, not full-site accessibility conformance.

**[P2] Table screenshots impede reading and reuse.** The frontage transformation and hotel summaries are rendered as PNGs even though they contain ordinary tabular text. Font size shrinks with image width, readers cannot select values, and assistive technology receives only the image description. Use native tables for these outputs; keep actual plots as graphics. For dense multi-panel plots, offer a stacked mobile version or simplify labels. Locations: [posts.js:527](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:527), [posts.js:739](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/content/posts.js:739), [posts.css:538](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/components/posts.css:538). Relevant standard: WCAG 1.4.5 for replaceable images of text; charts have separate considerations. A live conformance assessment is still needed. [W3C guidance](https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html). Suggested work: `/adapt`, `/typeset`.

**[P2] Articles lack individual page metadata.** The document title and description are portfolio-wide, and the post component does not set article-specific equivalents. Searches and shared links therefore lack an intentionally authored article identity. Add per-post titles, descriptions and share metadata, with static rendering or prerendering where required by the intended crawlers. Locations: [index.html:11](/Users/floydbenedikter/Code/Sandbox/personal_webpage/index.html:11), [Post.jsx:79](/Users/floydbenedikter/Code/Sandbox/personal_webpage/src/pages/Post.jsx:79). Suggested work: `/harden`.

The shared issues are systemic: reference notes are treated as teaching callouts, notebook tables are published as images, and the series follows notebook structure more closely than the reader's learning sequence.

### Positive implementation findings

All embedded figures and local download links exist. Post navigation advances through the array and wraps from the last post to the first. The template supplies figure dimensions, accessible table headers, visible link focus, a contents list and plain-text labels alongside coloured icons. Keep these practices.

## Priorities

There are **14 substantive findings: 0 P0, 3 P1 and 11 P2**. No P3 polish items are counted.

1. **[P1] Repair reproducibility and demonstrate a clean split.** Supply the hotel data dependency and package requirements; reorder the Ames example so readers can copy an evaluation-safe workflow. `/harden` for the download experience; `/clarify` for the teaching sequence.
2. **[P1] Complete the regression experiment.** Add baseline predictions, validation errors and residual diagnosis, then reduce the classification material. `/clarify` for the revised article structure.
3. **[P2] Strengthen practical teaching.** Supply the complete preprocessing and plotting recipes; revise the polynomial illustration and explain regularization settings. `/clarify`.
4. **[P2] Improve reading and discoverability.** Replace table images, give dense charts a mobile treatment, consolidate routine references and add article metadata. `/adapt`, `/typeset`, `/harden`.
5. **[P2] Finish the presentation pass.** Align plot typography and captions, check the live layouts and retain only asides that help the reader. `/polish`.

You can ask me to address these individually, together, or in another order. Re-run `/audit` after changes to compare the findings and provisional score.
