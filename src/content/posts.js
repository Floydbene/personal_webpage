import { pcaSvmPost } from './pcaSvmPost.js';

export const postEntries = [
  {
    "ref": "01",
    "section": "machine-learning",
    "slug": "fundamentals-of-data-cleaning",
    "status": "review",
    "draftVersion": 3,
    "title": "Data Cleaning Fundamentals",
    "span": "2026",
    "minutes": 12,
    "level": "Foundations",
    "summary": "Clean Ames housing data, distinguish missing values from absent features, and build a repeatable preprocessing pipeline.",
    "prerequisites": "Python and pandas basics; no modelling experience required.",
    "learningGoals": [
      "Decide which fields are valid and available before a sale.",
      "Handle missing values according to what they mean.",
      "Fit preprocessing on training rows and reuse it for new data."
    ],
    "tags": [
      "Pandas",
      "Data Quality",
      "Preprocessing"
    ],
    "body": [
      {
        "kind": "lede",
        "text": "A useful model starts with data we can trust. Before predicting a house price, I check what each field means, which values are inconsistent, and whether a blank means “unknown” or “not present”. Those decisions shape both the patterns we see and the predictions we can make."
      },
      {
        "kind": "p",
        "text": "I use the Ames Housing dataset: 2,930 property sales in Ames, Iowa, and 82 columns, including identifiers and sale price. The other columns describe size, location, age, construction and condition."
      },
      {
        "kind": "p",
        "text": "The task is to estimate a property’s price before it sells. We will choose usable columns, represent their values, and handle missing entries, then put those choices into a pipeline that applies the same rules to training houses and future houses."
      },
      {
        "kind": "p",
        "text": [
          "This article follows ",
          {
            "kind": "link",
            "text": "Machine_Learning_Fundamentals.ipynb",
            "href": "https://colab.research.google.com/drive/1PKIWbdQkbr5fY5IdgD-4ZwHg-GcsMBfq"
          },
          " in the same order, with matching variable names. Open it alongside the post and run its cells from top to bottom; the tables and figures here show the corresponding outputs."
        ]
      },
      {
        "kind": "note",
        "text": "The notebook reserves training and test row IDs before inspecting category balance, correlations or price patterns. Those decisions use training rows; fixed source-documented validity rules apply to both sets. Learned transformations use training rows too. We will use the resulting inputs for regression after the visualization post.",
        "type": "danger",
        "title": "Keep the test set out of your decisions"
      },
      {
        "kind": "h",
        "id": "decide-when-the-prediction-happens",
        "text": "Load the data",
        "navLabel": "Load the data"
      },
      {
        "kind": "p",
        "text": [
          "The load cell first looks for ",
          {
            "kind": "code",
            "text": "data/ames.txt"
          },
          " in the ML-Blog project. If that file is unavailable, it reads the same tab-separated dataset from ",
          {
            "kind": "link",
            "text": "Sebastian Raschka’s repository",
            "href": "https://github.com/rasbt/machine-learning-book/blob/main/ch09/AmesHousing.txt"
          },
          ". The initial output should show 2,930 rows and 82 columns. Of those columns, 43 contain text; pandas may label them str or object depending on its version."
        ]
      },
      {
        "kind": "p",
        "text": [
          "Run the notebook in Colab from top to bottom. Source data loads by reference; generated Ames exports stay in your session. For local runs, the tested package versions are listed in ",
          {
            "kind": "link",
            "text": "requirements.txt",
            "href": "/posts/notebooks/requirements.txt",
            "download": true
          },
          "."
        ]
      },
      {
        "kind": "code",
        "lang": "shell",
        "text": "python -m pip install -r requirements.txt"
      },
      {
        "kind": "table",
        "caption": "Ames data preview",
        "headers": [
          "Row ID",
          "Living area (sq ft)",
          "Frontage (ft)",
          "Ms subclass",
          "Pool qc",
          "Sale price"
        ],
        "rows": [
          [
            "0",
            "1,656",
            "141.0",
            "20",
            "Missing",
            "$215,000"
          ],
          [
            "1",
            "896",
            "80.0",
            "20",
            "Missing",
            "$105,000"
          ],
          [
            "2",
            "1,329",
            "81.0",
            "20",
            "Missing",
            "$172,000"
          ],
          [
            "3",
            "2,110",
            "93.0",
            "20",
            "Missing",
            "$244,000"
          ],
          [
            "4",
            "1,629",
            "74.0",
            "60",
            "Missing",
            "$189,900"
          ]
        ]
      },
      {
        "kind": "p",
        "text": [
          "The next cell checks ",
          {
            "kind": "code",
            "text": "PID"
          },
          ", the parcel identifier. All 2,930 values are present and unique, so splitting these rows will also keep properties separate. If a property occurred more than once, we would need to keep its records together when splitting. ",
          {
            "kind": "code",
            "text": "SalePrice"
          },
          " is the target, and the identifier columns will stay out of the predictors."
        ]
      },
      {
        "kind": "h",
        "id": "read-the-meaning-behind-the-dtype",
        "text": "Choose features",
        "navLabel": "Choose features"
      },
      {
        "kind": "p",
        "text": [
          "The notebook builds ",
          {
            "kind": "code",
            "text": "housing_df"
          },
          " from 22 candidate predictors, two columns kept temporarily for an availability audit, and the target. The candidate list is a manageable starting point for a model. It covers property size, age, location and condition, while leaving many of the original columns unused."
        ]
      },
      {
        "kind": "table",
        "headers": [
          "Group",
          "Initial count",
          "Examples and intended treatment"
        ],
        "rows": [
          [
            "NUMERIC",
            "11",
            "Living area, lot frontage, construction years and room counts; impute and scale."
          ],
          [
            "ORDINAL",
            "5",
            "Exter Qual, Kitchen Qual, Bsmt Qual, Fireplace Qu and Pool QC; preserve the specified order."
          ],
          [
            "NOMINAL",
            "6",
            "Dwelling class, zoning, neighbourhood, building type, central air and street surface; create category indicators."
          ],
          [
            "AUDIT",
            "2",
            "Yr Sold and Sale Condition; retain for inspection, then remove before modelling."
          ]
        ],
        "caption": "The initial column groups in notebook section 3, before pruning"
      },
      {
        "kind": "p",
        "text": [
          "The lists ",
          {
            "kind": "code",
            "text": "NUMERIC"
          },
          ", ",
          {
            "kind": "code",
            "text": "ORDINAL"
          },
          " and ",
          {
            "kind": "code",
            "text": "NOMINAL"
          },
          " determine which branch of the later pipeline receives each column. ",
          {
            "kind": "code",
            "text": "Overall Qual"
          },
          " is an ordered 1–10 rating already stored numerically; the notebook keeps it in the numeric branch. In a linear model, that assumes equal effects for adjacent score increments, which we would assess during model comparison."
        ]
      },
      {
        "kind": "p",
        "text": "Before making data-dependent choices, I reserve the row IDs. The population rule comes from the published Ames documentation; the outlier section below explains it. The later split section restores these same IDs."
      },
      {
        "kind": "code",
        "lang": "python",
        "text": "# Fixed source-documented rule; apply consistently to both sets.\npopulation_exclusion = (\n    (housing_df[\"Gr Liv Area\"] > 4000)\n    & housing_df[\"Sale Condition\"].eq(\"Partial\")\n)\nreserved_train_ids, reserved_test_ids = train_test_split(\n    housing_df.index[~population_exclusion],\n    test_size=0.2,\n    random_state=42,\n)\nprint(\n    f\"Reserved {len(reserved_train_ids):,} training / \"\n    f\"{len(reserved_test_ids):,} test rows\"\n)"
      },
      {
        "kind": "h",
        "id": "check-types-and-values",
        "text": "Check types and values",
        "navLabel": "Types and values"
      },
      {
        "kind": "p",
        "text": [
          {
            "kind": "code",
            "text": "MS SubClass"
          },
          " contains integer codes for dwelling classes. I convert them to strings and keep the column in the nominal group so the model receives category indicators. Their numerical magnitudes do not describe a measured quantity."
        ]
      },
      {
        "kind": "table",
        "caption": "Ames invalid garage years",
        "headers": [
          "Row ID",
          "Garage year",
          "Sale year"
        ],
        "rows": [
          [
            "2180",
            "2008",
            "2007"
          ],
          [
            "2260",
            "2207",
            "2007"
          ]
        ]
      },
      {
        "kind": "p",
        "text": [
          "The same section compares ",
          {
            "kind": "code",
            "text": "Garage Yr Blt"
          },
          " with ",
          {
            "kind": "code",
            "text": "Yr Sold"
          },
          ". A garage construction year later than the recorded sale year is inconsistent with the property description used here. The two values above are replaced with missing values. We do not have enough information to guess the intended year, so the imputer will handle the uncertainty later."
        ]
      },
      {
        "kind": "code",
        "lang": "python",
        "text": "invalid_garage_year = (\n    housing_df[\"Garage Yr Blt\"] > housing_df[\"Yr Sold\"]\n)\nhousing_df.loc[invalid_garage_year, \"Garage Yr Blt\"] = np.nan"
      },
      {
        "kind": "p",
        "text": "This step keeps the rows and changes only the inconsistent measurements. The cell also checks that all sale prices are positive, which matters when inspecting a logarithmic target later."
      },
      {
        "kind": "h",
        "id": "prune-low-variation-and-correlated-features",
        "text": "Prune low-variation and correlated features",
        "navLabel": "Feature pruning"
      },
      {
        "kind": "p",
        "text": "Next, I examine the proportion occupied by the most common category in each nominal column of the reserved training rows. The notebook flags a column when one category accounts for more than 99% of its nonmissing entries. This is a simplifying rule for the baseline, rather than evidence that a rare category has no predictive value."
      },
      {
        "kind": "table",
        "caption": "Ames feature variation",
        "headers": [
          "Column",
          "Most common",
          "Share"
        ],
        "rows": [
          [
            "Street",
            "Pave",
            "99.62%"
          ],
          [
            "Central Air",
            "Y",
            "93.25%"
          ],
          [
            "Bldg Type",
            "1Fam",
            "83.00%"
          ],
          [
            "MS Zoning",
            "RL",
            "77.53%"
          ],
          [
            "MS SubClass",
            "20",
            "37.12%"
          ],
          [
            "Neighborhood",
            "NAmes",
            "15.04%"
          ]
        ]
      },
      {
        "kind": "p",
        "text": [
          "I remove ",
          {
            "kind": "code",
            "text": "Street"
          },
          " and update the nominal feature list. I then compare ",
          {
            "kind": "code",
            "text": "Garage Cars"
          },
          " with ",
          {
            "kind": "code",
            "text": "Garage Area"
          },
          ". Their correlation is about 0.89, so I retain area as one measure of garage size for this small baseline. Keeping both remains a modelling option. After these two removals, there are 20 predictors: ten numeric, five ordinal and five nominal."
        ]
      },
      {
        "kind": "h",
        "id": "inspect-unusual-sales",
        "text": "Handle outliers",
        "navLabel": "Outliers"
      },
      {
        "kind": "p",
        "text": "The notebook then selects the five properties with more than 4,000 square feet of above-ground living area. Their sizes alone do not tell us whether they should be removed, so I inspect the sale price and transaction condition beside the area."
      },
      {
        "kind": "table",
        "caption": "Ames large properties",
        "headers": [
          "Row ID",
          "Living area (sq ft)",
          "Sale price",
          "Sale condition"
        ],
        "rows": [
          [
            "1498",
            "5,642",
            "$160,000",
            "Partial"
          ],
          [
            "1760",
            "4,476",
            "$745,000",
            "Abnorml"
          ],
          [
            "1767",
            "4,316",
            "$755,000",
            "Normal"
          ],
          [
            "2180",
            "5,095",
            "$183,850",
            "Partial"
          ],
          [
            "2181",
            "4,676",
            "$184,750",
            "Partial"
          ]
        ]
      },
      {
        "kind": "p",
        "text": [
          "Three of these records have ",
          {
            "kind": "code",
            "text": "Sale Condition == \"Partial\""
          },
          ". Here, Partial means the home was unfinished when last assessed, which does not necessarily mean it was unfinished when sold. The ",
          {
            "kind": "link",
            "text": "original Ames paper",
            "href": "https://jse.amstat.org/v19n3/decock.pdf"
          },
          " identifies these three large partial sales as likely unrepresentative of market values, while describing the other two large properties as unusually large but relatively appropriately priced."
        ]
      },
      {
        "kind": "p",
        "text": "The notebook removes only the three records meeting both conditions: living area above 4,000 square feet and a Partial sale condition. That leaves 2,927 rows. It retains the other two large properties and the remaining partial sales. This is a dataset-specific exclusion, and subsequent results describe the retained population."
      },
      {
        "kind": "h",
        "id": "inspect-the-target-distribution",
        "text": "Inspect the target distribution",
        "navLabel": "Target distribution"
      },
      {
        "kind": "p",
        "text": [
          "Before removing the audit columns, I inspect the training ",
          {
            "kind": "code",
            "text": "SalePrice"
          },
          ". Its distribution has a long upper tail. The notebook compares its sample skewness with the skewness after ",
          {
            "kind": "code",
            "text": "log1p"
          },
          ", which takes the natural logarithm of one plus the price. The plot below shows the same training sales on both scales."
        ]
      },
      {
        "kind": "figure",
        "src": "/posts/figures/ames-target-distribution.png",
        "alt": "Training sale prices have skewness 1.59; log1p compresses the expensive tail and changes skewness to −0.13.",
        "width": 1600,
        "height": 768,
        "caption": "The same 2,341 training sales before and after log1p. The exported target stays in dollars."
      },
      {
        "kind": "p",
        "text": "The log scale compresses the expensive tail. Moving from $100,000 to $200,000 is the same doubling as moving from $200,000 to $400,000, so the two jumps have almost equal spacing on a log-price axis. In dollars, the second jump is twice as large. This makes differences among typical houses easier to see without letting a few expensive sales stretch the entire plot."
      },
      {
        "kind": "note",
        "type": "misconception",
        "title": "A neater histogram does not mean a better model",
        "text": "Skewness falls from about 1.59 to −0.13, but regression does not require the target itself to follow a normal distribution. Logging the target changes what the model is asked to predict. Whether that helps must be checked on unseen houses, using the error measure you care about."
      },
      {
        "kind": "p",
        "text": "For squared error in dollars, missing a $200,000 house by $10,000 contributes 100 million to the loss; missing a $500,000 house by $25,000 contributes 625 million. The second error therefore counts 6.25 times as much, even though both predictions are 5% low. On a log scale, those proportional misses contribute nearly equally. That can be useful when relative accuracy matters across cheap and expensive houses. If absolute dollar mistakes are the priority, the original scale may be the better choice."
      },
      {
        "kind": "note",
        "type": "note",
        "title": "The target stays in dollars here",
        "text": "This plot explores an alternative scale; it does not transform the target used by the later regression examples. If you do fit log prices, convert predictions back before reporting dollar errors. Simply exponentiating a fitted log prediction need not give the mean price in dollars."
      },
      {
        "kind": "h",
        "id": "audit-feature-availability",
        "text": "Audit feature availability",
        "navLabel": "Feature availability"
      },
      {
        "kind": "p",
        "text": [
          "We have kept ",
          {
            "kind": "code",
            "text": "Yr Sold"
          },
          " and ",
          {
            "kind": "code",
            "text": "Sale Condition"
          },
          " in ",
          {
            "kind": "code",
            "text": "AUDIT"
          },
          " until this point. The notebook now summarises training sale prices by each column before removing them. The reason for exclusion is the prediction setup: we assume the eventual transaction year and condition are unavailable when estimating a pre-sale price."
        ]
      },
      {
        "kind": "p",
        "text": "The yearly training means vary, and the shorter 2010 sample does not establish why its average is lower. The sale-condition summary also shows a price difference: the training median is $251,290 for retained partial sales and $159,950 for normal sales. Property mix and new construction could contribute to that association."
      },
      {
        "kind": "p",
        "text": "These summaries describe relationships in the table. They do not establish what will be known at prediction time. I remove the two audit columns under the stated pre-sale assumption; a known prediction date could be useful in a differently specified model."
      },
      {
        "kind": "h",
        "id": "separate-the-example-from-the-workflow-to-aim-for",
        "text": "Split the data",
        "navLabel": "Train/test split"
      },
      {
        "kind": "p",
        "text": [
          "The notebook now separates ",
          {
            "kind": "code",
            "text": "housing_df"
          },
          " into ",
          {
            "kind": "code",
            "text": "X"
          },
          " containing the 20 predictors and ",
          {
            "kind": "code",
            "text": "y"
          },
          " containing SalePrice. It restores the 80/20 row IDs reserved in section 3, giving 2,341 training rows and 586 test rows. It checks that the row sets are disjoint, cover all retained observations, and remain aligned with their targets."
        ]
      },
      {
        "kind": "p",
        "text": "This random split evaluates similarly sampled sales from the same historical period. Predicting sales in later years would need an evaluation that respects time. Reserve the split once: repeatedly reshuffling until results look better would undermine it."
      },
      {
        "kind": "p",
        "text": "Throughout, learned transformations use training rows only. For example, the training median will fill missing frontage in both training and test data. Computing a second median from the test set would change the procedure during evaluation. A fixed absence label such as \"None\" does not estimate a statistic, but the medians, scaling parameters and inferred categories do."
      },
      {
        "kind": "h",
        "id": "give-missingness-a-meaning",
        "text": "Inspect missingness",
        "navLabel": "Missing values"
      },
      {
        "kind": "p",
        "text": "The next output counts missing values in X_train. Garage Yr Blt now has 117 missing values: one of the two inconsistent-year records remains in the training set, while the other was among the three excluded large partial sales."
      },
      {
        "kind": "table",
        "caption": "Ames missing values",
        "headers": [
          "Column",
          "Missing",
          "Percent"
        ],
        "rows": [
          [
            "Pool QC",
            "2,331",
            "99.57%"
          ],
          [
            "Fireplace Qu",
            "1,125",
            "48.06%"
          ],
          [
            "Lot Frontage",
            "396",
            "16.92%"
          ],
          [
            "Garage Yr Blt",
            "117",
            "5.00%"
          ],
          [
            "Bsmt Qual",
            "62",
            "2.65%"
          ],
          [
            "Total Bsmt SF",
            "1",
            "0.04%"
          ]
        ]
      },
      {
        "kind": "p",
        "text": [
          "For ",
          {
            "kind": "code",
            "text": "Pool QC"
          },
          " and ",
          {
            "kind": "code",
            "text": "Fireplace Qu"
          },
          ", missing ratings correspond to absent amenities in these records, as confirmed by their area and count columns. I use the literal string ",
          {
            "kind": "code",
            "text": "\"None\""
          },
          " to preserve that information. Filling these entries with a typical rating would invent a quality for something the property does not have."
        ]
      },
      {
        "kind": "p",
        "text": [
          "The dictionary also uses missing ",
          {
            "kind": "code",
            "text": "Bsmt Qual"
          },
          " for no basement. One row lacks basement area as well, so its physical status is less certain. ",
          {
            "kind": "code",
            "text": "Lot Frontage"
          },
          " is an unrecorded measurement and receives the training median. Garage construction years combine several cases—no garage, unrecorded years and the inconsistent values we flagged—so median filling is only a baseline representation. Presence and missingness indicators would let a later model distinguish those cases."
        ]
      },
      {
        "kind": "h",
        "id": "make-the-choices-repeatable",
        "text": "Build the preprocessing pipeline",
        "navLabel": "Preprocessing pipeline"
      },
      {
        "kind": "figure",
        "src": "/posts/figures/ames-preprocessing.svg",
        "alt": "Training observations fit numeric imputation and scaling, ordered quality encoding, and nominal one-hot encoding. The fitted transformations are then applied to both training and test observations.",
        "width": 1100,
        "height": 660,
        "caption": "Each branch learns its parameters from X_train. X_test is transformed using the same fitted medians, scales and category mappings."
      },
      {
        "kind": "p",
        "text": "With the column groups and missing-value treatments decided, the notebook builds three pipelines. The numeric branch fills missing values with a median per column, then standardises using the mean and standard deviation of the filled training column. The output below traces this for four frontage measurements."
      },
      {
        "kind": "table",
        "caption": "Ames frontage transformation",
        "headers": [
          "Row ID",
          "Raw (ft)",
          "Filled (ft)",
          "Standardized"
        ],
        "rows": [
          [
            "1847",
            "Missing",
            "68.0",
            "-0.044"
          ],
          [
            "2793",
            "Missing",
            "68.0",
            "-0.044"
          ],
          [
            "2262",
            "89.0",
            "89.0",
            "0.980"
          ],
          [
            "1678",
            "24.0",
            "24.0",
            "-2.190"
          ]
        ]
      },
      {
        "kind": "p",
        "text": "The two missing frontages become the training median of 68 feet. The observed values of 89 and 24 feet pass through filling unchanged. Scaling then subtracts the training mean of about 68.91 and divides by the training standard deviation of about 20.50, putting the values on the scale used by the model. This changes units without removing skew or outliers."
      },
      {
        "kind": "p",
        "text": [
          "The ordinal branch first fills absence with \"None\", then uses the predefined ",
          {
            "kind": "code",
            "text": "SCALE = [\"None\", \"Po\", \"Fa\", \"TA\", \"Gd\", \"Ex\"]"
          },
          ". After absence, the labels stand for poor, fair, typical, good and excellent. This assigns TA the code 3 and Gd the code 4 before scaling. For a linear model, equal integer steps imply equal price effects between adjacent levels; putting absence below poor quality is also a modelling assumption. Bsmt Qual uses these labels for basement height, while the other columns describe quality."
        ]
      },
      {
        "kind": "p",
        "text": "A grade listed in SCALE keeps its assigned code even if it was absent from training. Only an unexpected label outside that list receives −1. That fallback lets transformation proceed, but the unexpected value still needs investigation."
      },
      {
        "kind": "p",
        "text": [
          "The nominal branch fills missing entries and uses ",
          {
            "kind": "code",
            "text": "OneHotEncoder"
          },
          " to create zero-or-one indicators. The configuration below groups categories observed fewer than ten times during fitting. A new category maps to that column’s infrequent bucket if one exists; otherwise its entire encoded block is zero."
        ]
      },
      {
        "kind": "code",
        "lang": "python",
        "text": "from sklearn.compose import ColumnTransformer\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import (\n    StandardScaler,\n    OrdinalEncoder,\n    OneHotEncoder,\n)\n\nNUMERIC = [\n    'Gr Liv Area', 'Lot Area', 'Total Bsmt SF', 'Lot Frontage',\n    'Year Built', 'Overall Qual', 'Full Bath', 'Bedroom AbvGr',\n    'Garage Area', 'Garage Yr Blt',\n]\nORDINAL = [\n    'Exter Qual', 'Kitchen Qual', 'Bsmt Qual',\n    'Fireplace Qu', 'Pool QC',\n]\nNOMINAL = [\n    'MS SubClass', 'MS Zoning', 'Neighborhood',\n    'Bldg Type', 'Central Air',\n]\nSCALE = ['None', 'Po', 'Fa', 'TA', 'Gd', 'Ex']\n\nnumeric_pipe = Pipeline([\n    (\"impute\", SimpleImputer(strategy=\"median\")),\n    (\"scale\", StandardScaler()),\n])\n\nordinal_pipe = Pipeline([\n    (\"impute\", SimpleImputer(\n        strategy=\"constant\", fill_value=\"None\",\n    )),\n    (\"encode\", OrdinalEncoder(\n        categories=[SCALE] * len(ORDINAL),\n        handle_unknown=\"use_encoded_value\",\n        unknown_value=-1,\n    )),\n    (\"scale\", StandardScaler()),\n])\n\nnominal_pipe = Pipeline([\n    (\"impute\", SimpleImputer(\n        strategy=\"constant\", fill_value=\"None\",\n    )),\n    (\"encode\", OneHotEncoder(\n        min_frequency=10,\n        handle_unknown=\"infrequent_if_exist\",\n        sparse_output=False,\n    )),\n])\n\npreprocessor = ColumnTransformer(\n    [\n        (\"num\", numeric_pipe, NUMERIC),\n        (\"ord\", ordinal_pipe, ORDINAL),\n        (\"nom\", nominal_pipe, NOMINAL),\n    ],\n    verbose_feature_names_out=False,\n).set_output(transform=\"pandas\")"
      },
      {
        "kind": "p",
        "text": [
          "The ",
          {
            "kind": "code",
            "text": "ColumnTransformer"
          },
          " combines all three branches and returns a dataframe with readable feature names. The key sequence in the notebook is to fit once on X_train, then reuse that fitted object for both sets:"
        ]
      },
      {
        "kind": "code",
        "lang": "python",
        "text": "preprocessor.fit(X_train)\nX_train_prep = preprocessor.transform(X_train)\nX_test_prep = preprocessor.transform(X_test)"
      },
      {
        "kind": "table",
        "caption": "Ames prepared features: scaled numeric and ordinal values, plus zero-or-one category indicators",
        "headers": [
          "Row ID",
          "Living area (standardized)",
          "Frontage (standardized)",
          "Exterior quality (standardized)",
          "Central air = Y",
          "MS SubClass = 20"
        ],
        "rows": [
          [
            "2262",
            "0.161",
            "0.980",
            "1.047",
            "1.000",
            "1.000"
          ],
          [
            "1678",
            "-0.389",
            "-2.190",
            "-0.693",
            "1.000",
            "0.000"
          ],
          [
            "2778",
            "0.755",
            "1.273",
            "1.047",
            "1.000",
            "0.000"
          ],
          [
            "2506",
            "-0.598",
            "-1.898",
            "-0.693",
            "1.000",
            "0.000"
          ]
        ]
      },
      {
        "kind": "h",
        "id": "check-split-and-preprocessing",
        "text": "Check the split and preprocessing",
        "navLabel": "Verify the pipeline"
      },
      {
        "kind": "p",
        "text": "Section 12 reads the numeric imputer’s stored replacement values and compares them with the training medians. They agree across all ten numeric columns; frontage uses 68 and garage year uses 1979. This checks the fitted values directly. The explicit training-only fit controls which observations the transformer sees."
      },
      {
        "kind": "p",
        "text": "The notebook also fits a fresh cloned preprocessor inside five training folds and checks that it can transform each validation portion, including unseen neighbourhoods. All five transformations succeed. This is the pattern we will reuse when comparing regression models."
      },
      {
        "kind": "p",
        "text": "The train/test distribution, test-category and adversarial checks remain optional in the notebook. RUN_TEST_DIAGNOSTICS is off by default; turn it on after the model choices are fixed. Comparing samples is useful, but it does not certify that a workflow is free of leakage."
      },
      {
        "kind": "note",
        "type": "tip",
        "text": "On another dataset: correct invalid measurements only from evidence; distinguish absence from unrecorded values; inspect unusual rows before exclusion; check what is available at prediction time; fit learned transformations on training data."
      },
      {
        "kind": "h",
        "id": "export-the-data",
        "text": "Export the data for the next steps",
        "navLabel": "Export and reuse"
      },
      {
        "kind": "p",
        "text": [
          "Notebook sections 13–14 record the split and export the cleaned and prepared data in your notebook session. The ",
          {
            "kind": "link",
            "text": "saved split record",
            "href": "/posts/notebooks/ames/split.json",
            "download": true
          },
          " keeps the same row IDs. The next posts look at how to visualize data and use the prepared Ames data to fit regression models."
        ]
      },
      {
        "kind": "note",
        "type": "recap",
        "title": "What we have prepared",
        "text": "We checked what each field means, corrected inconsistent measurements, reviewed unusual sales, handled missing values and fitted preprocessing on the training rows. We now have a recorded split and numeric features ready for modelling."
      },
      {
        "kind": "p",
        "text": [
          "The practical output is both cleaned columns and a fitted transformation, with row IDs tying the data to its split. Use the cleaned columns to refit preprocessing inside validation folds. In ",
          {
            "kind": "link",
            "text": "the PCA and SVM post",
            "href": "/posts/dimensionality-reduction-and-support-vector-machines"
          },
          ", that same rule extends to learned principal components: fit the representation on training rows, then reuse it."
        ]
      }
    ]
  },
  {
    "ref": "02",
    "section": "machine-learning",
    "slug": "exploratory-data-analysis",
    "status": "review",
    "draftVersion": 3,
    "title": "Data Visualization: Exploring Hotel Cancellations",
    "span": "2026",
    "minutes": 9,
    "level": "Foundations",
    "summary": "Investigate hotel cancellations with group rates, booking-time distributions and price comparisons that expose hidden differences.",
    "prerequisites": "Python and pandas basics; the cleaning post is useful but optional.",
    "learningGoals": [
      "Compare cancellation rates with their booking counts.",
      "Choose plots that answer the intended question.",
      "Check whether subgroups and filtering change a result."
    ],
    "tags": [
      "Data Visualization",
      "Pandas",
      "Exploratory Analysis"
    ],
    "body": [
      {
        "kind": "lede",
        "text": "Where should we investigate hotel cancellations first? I start with cancellation rates, then use booking times and recorded prices to ask more specific questions. Each plot earns its place by answering one of them."
      },
      {
        "kind": "p",
        "text": "The dataset contains 119,390 bookings for two hotels, labelled City Hotel and Resort Hotel. Each record includes the scheduled arrival, length of stay, customer and booking details, and whether the reservation was cancelled. I want to understand how cancellations are distributed through these records before choosing variables or assumptions for a model."
      },
      {
        "kind": "p",
        "text": "I use pandas to calculate the summaries and plots to examine their distributions. Hotel bookings show how the habits from the cleaning post transfer to another dataset; the regression post then returns to Ames."
      },
      {
        "kind": "h",
        "id": "first-what-does-a-row-mean",
        "text": "Load the data and inspect a few bookings",
        "navLabel": "Data and booking fields"
      },
      {
        "kind": "p",
        "text": [
          "I load the ",
          {
            "kind": "link",
            "text": "Hotel Booking Demand data distributed through TidyTuesday",
            "href": "https://github.com/rfordatascience/tidytuesday/tree/main/data/2020/2020-02-11"
          },
          " into a dataframe and keep an unchanged copy of the source. There are 32 source columns, with scheduled arrivals from July 2015 through August 2017. The preview shows the first three records for each hotel so we can see how the same fields are represented in both groups."
        ]
      },
      {
        "kind": "p",
        "text": [
          "Run the notebook in Colab from top to bottom. The source data loads by reference. For local runs, the tested package versions are listed in ",
          {
            "kind": "link",
            "text": "requirements.txt",
            "href": "/posts/notebooks/requirements.txt",
            "download": true
          },
          "."
        ]
      },
      {
        "kind": "table",
        "caption": "Hotel data preview",
        "headers": [
          "Row ID",
          "Hotel",
          "Cancelled (0/1)",
          "Lead time (days)",
          "Adr",
          "Total nights"
        ],
        "rows": [
          [
            "0",
            "Resort Hotel",
            "0",
            "342",
            "0.00",
            "0"
          ],
          [
            "1",
            "Resort Hotel",
            "0",
            "737",
            "0.00",
            "0"
          ],
          [
            "2",
            "Resort Hotel",
            "0",
            "7",
            "75.00",
            "1"
          ],
          [
            "40060",
            "City Hotel",
            "0",
            "6",
            "0.00",
            "2"
          ],
          [
            "40061",
            "City Hotel",
            "1",
            "88",
            "76.50",
            "4"
          ],
          [
            "40062",
            "City Hotel",
            "1",
            "65",
            "68.00",
            "4"
          ]
        ]
      },
      {
        "kind": "p",
        "text": [
          {
            "kind": "code",
            "text": "is_canceled"
          },
          " is the outcome: 1 means the booking was cancelled and 0 means it was not. I check that it has no missing values and contains only these two codes before calculating cancellation rates. ",
          {
            "kind": "code",
            "text": "lead_time"
          },
          " is the number of days between making the reservation and its scheduled arrival. ",
          {
            "kind": "code",
            "text": "adr"
          },
          " is the recorded average daily rate attached to the booking."
        ]
      },
      {
        "kind": "p",
        "text": [
          "I also derive ",
          {
            "kind": "code",
            "text": "total_nights"
          },
          " by adding the weekday and weekend stay lengths, and construct an arrival date from the year, month and day columns. These make later summaries easier to calculate. All counts here are counts of bookings; they do not measure occupied rooms or realised revenue."
        ]
      },
      {
        "kind": "h",
        "id": "inspect-missing-and-unusual-values",
        "text": "Check missing and unusual values",
        "navLabel": "Data quality"
      },
      {
        "kind": "p",
        "text": "Before comparing groups, I inspect missing values and records that may affect the summaries. Four source columns contain missing entries: company, agent, country and children. Company is missing in 112,593 records, so dropping every row with any missing value would remove most of the dataset. The cancellation, lead-time and ADR columns used below are complete, allowing these comparisons to use all bookings."
      },
      {
        "kind": "table",
        "caption": "Hotel quality checks",
        "headers": [
          "Check",
          "Bookings",
          "Share"
        ],
        "rows": [
          [
            "Negative ADR",
            "1",
            "0.00%"
          ],
          [
            "Zero ADR",
            "1,959",
            "1.64%"
          ],
          [
            "Zero-night booking",
            "715",
            "0.60%"
          ],
          [
            "No recorded guests",
            "180",
            "0.15%"
          ],
          [
            "Missing guest count",
            "4",
            "0.00%"
          ],
          [
            "Repeated row beyond first",
            "31,994",
            "26.80%"
          ]
        ]
      },
      {
        "kind": "p",
        "text": "The price checks identify one negative ADR and 1,959 zero ADRs. I keep these records in the main analysis and later repeat the price comparison with them excluded. This makes the effect of that choice visible. The 715 zero-night bookings and 180 records with no recorded guests also deserve inspection if we move on to analysing stays or occupancy."
      },
      {
        "kind": "p",
        "text": "There are 31,994 rows that exactly repeat an earlier row. The source has no unique booking identifier that would establish whether these are duplicate exports or separate reservations with identical recorded attributes. I retain them for this walkthrough and interpret the results as summaries of the supplied rows. Deduplication would be another sensitivity check before using the figures operationally."
      },
      {
        "kind": "h",
        "id": "compare-rates-with-their-denominators",
        "text": "Calculate cancellation rates for each hotel",
        "navLabel": "Cancellation rates"
      },
      {
        "kind": "p",
        "text": "There are 44,224 cancellations across the 119,390 records, giving an overall cancellation rate of 37.0%. To compare the hotels, I calculate the booking count, cancellation count and rate separately for each. Because the outcome is coded zero or one, its sum gives the number of cancellations and its mean gives the rate."
      },
      {
        "kind": "code",
        "lang": "python",
        "text": "hotel_df.groupby(\"hotel\")[\"is_canceled\"].agg(\n    bookings=\"count\", cancellations=\"sum\", rate=\"mean\",\n)"
      },
      {
        "kind": "table",
        "caption": "Hotel cancellation summary",
        "headers": [
          "Hotel",
          "Bookings",
          "Cancellations",
          "Rate"
        ],
        "rows": [
          [
            "City Hotel",
            "79,330",
            "33,102",
            "41.73%"
          ],
          [
            "Resort Hotel",
            "40,060",
            "11,122",
            "27.76%"
          ]
        ]
      },
      {
        "kind": "p",
        "text": "City has almost twice as many bookings as Resort, so the raw cancellation counts alone would be difficult to compare. Dividing by each hotel's booking count gives rates of 41.7% and 27.8%. The difference calculated before rounding is about 14.0 percentage points, or roughly 14 additional cancellations per 100 recorded bookings at City."
      },
      {
        "kind": "p",
        "text": "A dot with an interval makes these two rates easy to compare. Here is a compact plotting recipe: the point is the rate, the whisker is its 95% Wilson interval, and the label keeps the denominator visible. This version uses the full 0–100% scale; the notebook figure below explicitly zooms in."
      },
      {
        "kind": "code",
        "lang": "python",
        "text": "import matplotlib.pyplot as plt\nfrom matplotlib.ticker import PercentFormatter\nfrom statsmodels.stats.proportion import proportion_confint\n\nsummary = hotel_df.groupby(\"hotel\")[\"is_canceled\"].agg(\n    bookings=\"count\", cancellations=\"sum\", rate=\"mean\",\n)\nlow, high = proportion_confint(\n    summary[\"cancellations\"], summary[\"bookings\"], method=\"wilson\",\n)\nfig, ax = plt.subplots(figsize=(8, 4))\nax.errorbar(summary[\"rate\"], range(len(summary)),\n            xerr=[summary[\"rate\"] - low, high - summary[\"rate\"]],\n            fmt=\"o\", capsize=4)\nax.set_yticks(range(len(summary)), [\n    f\"{hotel} · n={row['bookings']:,.0f}\"\n    for hotel, row in summary.iterrows()\n])\nax.set(xlim=(0, 1), xlabel=\"Cancellation rate\",\n       title=\"Cancellation rates by hotel · 95% Wilson intervals\")\nax.xaxis.set_major_formatter(PercentFormatter(1))\nfig.tight_layout()\nplt.show()"
      },
      {
        "kind": "figure",
        "src": "/posts/figures/12-cancellation-rate-gap.png",
        "alt": "Cancellation rates of 41.7% at City Hotel and 27.8% at Resort Hotel, with narrow intervals.",
        "width": 2680,
        "height": 1226,
        "caption": "Cancellation rates with 95% Wilson intervals. City has 79,330 bookings; Resort has 40,060. The horizontal axis is zoomed. The interval for the difference uses the Newcombe method and assumes independent bookings."
      },
      {
        "kind": "note",
        "type": "tip",
        "title": "Put the denominator beside the rate",
        "text": "When comparing groups of different sizes, show a rate and its sample count together. Label the units, make a zoomed axis explicit, and say what any interval represents. A difference of 14 percentage points means about 14 more cancellations per 100 bookings; it is not a 14% relative increase."
      },
      {
        "kind": "p",
        "text": "The plot adds 95% intervals to the rates. They are narrow because the groups contain many records, under a model that treats bookings as independent. Group reservations and repeated customers could weaken that assumption. I use the observed gap to motivate further comparisons: these two hotels may receive different customer types, channels and booking lead times."
      },
      {
        "kind": "h",
        "id": "ask-when-the-bookings-were-made",
        "text": "Compare booking lead times",
        "navLabel": "Booking lead times"
      },
      {
        "kind": "p",
        "text": "Next, I group bookings by their eventual cancellation outcome and examine lead time. The 44,224 cancelled bookings have a median lead time of 113 days. The 75,166 bookings that did not cancel have a median of 45 days. This suggests a difference in booking timing, but the medians alone do not show how much the groups overlap."
      },
      {
        "kind": "p",
        "text": "The cumulative plot shows the full distributions without choosing histogram bins. The horizontal axis counts down from 500 days before arrival to zero, moving towards the arrival date from left to right. Each curve accumulates the share of its outcome group that had booked by that point."
      },
      {
        "kind": "figure",
        "src": "/posts/figures/06-booking-timing.png",
        "alt": "Countdown cumulative distribution: 55% of cancelled bookings and 31% of non-cancelled bookings were made at least 100 days ahead; median lead times are 113 and 45 days.",
        "width": 2679,
        "height": 1422,
        "caption": "Cumulative booking timing, grouped by eventual outcome. The visible range starts 500 days before arrival, but earlier bookings remain in the denominators. Same-day bookings are included."
      },
      {
        "kind": "note",
        "type": "tip",
        "title": "Use a cumulative curve to compare distributions",
        "text": "Choose a rate plot for group proportions, an ECDF for distribution shape without histogram bins, and a line for chronological change. Keep comparison scales consistent. In this countdown view, the curve means “booked at least this far ahead,” and the denominator is every booking in the eventual outcome group."
      },
      {
        "kind": "p",
        "text": "At 100 days before arrival, the annotated points show that about 55% of cancelled bookings and 31% of non-cancelled bookings were made at least 100 days in advance. The point where a curve reaches 50% corresponds to its median lead time. The cancelled group generally books further ahead, while both curves cover a wide range of timings."
      },
      {
        "kind": "p",
        "text": "This groups records using the outcome, so it describes booking timing among cancellations. To estimate the cancellation rate for a reservation made 100 days ahead, I would instead group bookings by lead-time bands and calculate the fraction cancelled within each band. The notebook extends this comparison across customer types and market segments, which helps check whether the overall pattern is shared by different groups."
      },
      {
        "kind": "note",
        "type": "misconception",
        "title": "A curve of cancelled bookings is not a cancellation probability",
        "text": "This chart describes lead time among bookings that eventually cancelled. To answer how likely a booking made 100 days ahead is to cancel, group all bookings by lead time and calculate cancellation rates within those groups. The denominator changes the question."
      },
      {
        "kind": "h",
        "id": "price-changes-the-interpretation",
        "text": "Compare recorded prices within each hotel",
        "navLabel": "Prices by hotel"
      },
      {
        "kind": "p",
        "text": "I then compare mean ADR between cancelled and non-cancelled bookings. Across both hotels, the means are about 104.96 and 99.99 respectively, a difference of +4.98 in the dataset's recorded units. Since we already know the hotels have different cancellation rates, I repeat the price calculation within each hotel."
      },
      {
        "kind": "code",
        "lang": "python",
        "text": "hotel_df.groupby([\"hotel\", \"is_canceled\"])[\"adr\"].mean().unstack()"
      },
      {
        "kind": "table",
        "caption": "Hotel adr summary",
        "headers": [
          "Hotel",
          "Not cancelled ADR",
          "Cancelled ADR",
          "Difference"
        ],
        "rows": [
          [
            "Both hotels",
            "99.99",
            "104.96",
            "+4.98"
          ],
          [
            "City Hotel",
            "105.75",
            "104.69",
            "-1.06"
          ],
          [
            "Resort Hotel",
            "90.79",
            "105.79",
            "+15.00"
          ]
        ]
      },
      {
        "kind": "note",
        "type": "tip",
        "title": "Check the groups behind an average",
        "text": "Show the overall result beside meaningful subgroups. An average can move because the mix of groups changes, even if the pattern within a group stays the same. Use a shared scale when comparing panels and keep the group counts available."
      },
      {
        "kind": "p",
        "text": "At City, cancelled bookings have a slightly lower mean ADR: about 104.69 compared with 105.75, a difference of −1.06. At Resort, the cancelled group has a higher mean: about 105.79 compared with 90.79, a difference of +15.00. The overall positive difference therefore does not describe the relationship at both hotels."
      },
      {
        "kind": "p",
        "text": "Each pooled mean is weighted by the number of bookings in its outcome group. Those groups contain different proportions of City and Resort bookings, so combining them mixes the within-hotel price differences with differences in hotel composition. I keep the grouped results alongside the overall average for that reason."
      },
      {
        "kind": "p",
        "text": "Season, customer type and booking conditions could also affect both ADR and cancellation, so this comparison does not isolate the effect of changing a price."
      },
      {
        "kind": "h",
        "id": "check-whether-unusual-prices-drive-the-result",
        "text": "Repeat the price comparison under different filters",
        "navLabel": "Filtering choices"
      },
      {
        "kind": "p",
        "text": "The initial checks found nonpositive ADR values, and very high prices could also influence a mean. I therefore repeat the same cancelled-minus-not-cancelled calculation for three samples: all records, records with positive ADR, and positive-ADR records at or below their pooled 99th percentile."
      },
      {
        "kind": "p",
        "text": "The first filter leaves 117,430 bookings. The 99th-percentile cutoff is 252.00; applying it leaves 116,262. I calculate this cutoff once across the positive ADR values from both hotels and outcomes, then apply the same threshold to every group. Each scenario still calculates the mean separately within its remaining hotel and outcome groups."
      },
      {
        "kind": "figure",
        "src": "/posts/figures/13-adr-sensitivity.png",
        "alt": "The mean ADR difference stays positive overall and at Resort, and negative at City, across three filtering choices.",
        "width": 2928,
        "height": 1471,
        "caption": "Mean ADR differences under three filters. The shared upper cutoff is 252.00, the pooled 99th percentile of positive ADR. The samples contain 119,390, 117,430 and 116,262 bookings respectively. Markers are point estimates without confidence intervals."
      },
      {
        "kind": "note",
        "type": "danger",
        "title": "A filter changes the population you describe",
        "text": "Keep an unfiltered result beside filtered versions. Record the rule, the cutoff and the number of remaining rows. A pattern that survives filtering is less dependent on that particular choice; it still does not establish causation or prove that removed values were errors."
      },
      {
        "kind": "p",
        "text": "The estimated differences change in size, but retain their direction across these filters: positive overall, slightly negative at City, and positive at Resort. The hotel-level contrast therefore persists when we remove nonpositive prices and the most expensive tail using this rule."
      },
      {
        "kind": "p",
        "text": "I treat this as a sensitivity analysis of the result. The filtered samples answer a narrower question about bookings in the retained price range; the analysis does not establish that the excluded reservations are incorrect. The unfiltered comparison remains available so the reader can see the effect of each choice."
      },
      {
        "kind": "h",
        "id": "leave-with-a-narrower-question",
        "text": "Use the results to plan the next comparison",
        "navLabel": "Next questions"
      },
      {
        "kind": "note",
        "type": "recap",
        "title": "What the plots taught us",
        "text": "City records have a higher cancellation rate. Cancelled bookings generally have longer lead times. The price comparison changes when we separate the hotels, and its direction survives the tested filters. The reusable habits are to show denominators, inspect distributions, compare subgroups and disclose filtering choices."
      },
      {
        "kind": "p",
        "text": "I would next compare cancellation rates within the same market segment, arrival period and lead-time band at each hotel, keeping the booking counts beside the rates. This would show whether the City–Resort difference remains among more comparable reservations and identify groups with too few bookings for a stable comparison."
      },
      {
        "kind": "note",
        "type": "tip",
        "text": "Try the same mean-ADR comparison within market segments. Keep the booking count beside each mean and check whether the sign matches the pooled result. Small groups need restraint even when their mean differences look large.",
        "disclosure": true,
        "title": "Try a market-segment comparison"
      },
      {
        "kind": "p",
        "text": [
          "The full ",
          {
            "kind": "link",
            "text": "Hotel_Booking_EDA.ipynb",
            "href": "https://colab.research.google.com/drive/1rndiaA_49JD2r-bOyw2S97FVHTiy23dx"
          },
          " includes the customer-type, market-segment and monthly breakdowns. The original dataset is described by Nuno António, Ana de Almeida and Luís Nunes in ",
          {
            "kind": "link",
            "text": "Hotel Booking Demand",
            "href": "https://doi.org/10.1016/j.dib.2018.11.126"
          },
          "; the ",
          {
            "kind": "link",
            "text": "TidyTuesday data dictionary",
            "href": "https://github.com/rfordatascience/tidytuesday/tree/main/data/2020/2020-02-11"
          },
          " documents the available fields."
        ]
      },
      {
        "kind": "p",
        "text": [
          "The deliverable is a narrower next question, supported by group counts and comparisons. Keep this distinction when moving to ",
          {
            "kind": "link",
            "text": "PCA scatter plots",
            "href": "/posts/dimensionality-reduction-and-support-vector-machines#variance-and-class-information"
          },
          ": a view can reveal overlap or structure without proving that a classifier will perform well. Prediction needs its own validation."
        ]
      }
    ]
  },
  {
    "ref": "03",
    "section": "machine-learning",
    "slug": "basics-of-regression",
    "status": "review",
    "draftVersion": 3,
    "title": "The Basics of Regression",
    "span": "2026",
    "minutes": 9,
    "level": "Foundations",
    "summary": "Predict house prices, compare model errors and learn when extra features, curves and regularization help.",
    "prerequisites": "Python and pandas basics, plus the Ames cleaning workflow from post 01.",
    "learningGoals": [
      "Read predictions, residuals and feature coefficients.",
      "Compare models against a baseline using consistent validation folds.",
      "Explain what changes when a price prediction becomes a classification task."
    ],
    "tags": [
      "Regression",
      "Scikit-learn",
      "Machine Learning"
    ],
    "body": [
      {
        "kind": "lede",
        "text": "How much does a model improve when we give it more information or flexibility? I use Ames house prices to fit a line, add features, allow curves and regularize coefficients. We then compare prediction errors to see which changes helped."
      },
      {
        "kind": "p",
        "text": "Changing the target to a yes-or-no question takes us into logistic regression, which we will use as the bridge to classification at the end."
      },
      {
        "kind": "p",
        "text": [
          "The ",
          {
            "kind": "link",
            "text": "preparation notebook",
            "href": "https://colab.research.google.com/drive/1PKIWbdQkbr5fY5IdgD-4ZwHg-GcsMBfq"
          },
          " works with residential sales in Ames, Iowa, from 2006–2010. The ",
          {
            "kind": "link",
            "text": "accompanying notebook",
            "href": "https://colab.research.google.com/drive/1Q9pXGJko1QY3TayhqtY-3GKSn9i2lLEX"
          },
          " uses 2,341 training houses and a saved test partition of 586 houses. ",
          {
            "kind": "code",
            "text": "SalePrice"
          },
          " is the target. Original units make the first plots readable; prepared, scaled features support the regularization examples."
        ]
      },
      {
        "kind": "p",
        "text": "Throughout, yᵢ is an observed outcome, ŷᵢ is a prediction, n is the number of observations, and d is the number of features. The intercept is b; the feature weights are βⱼ."
      },
      {
        "kind": "p",
        "text": [
          "Run the notebook in Colab from top to bottom. Source data loads by reference; generated Ames exports stay in your session. For local runs, the tested package versions are listed in ",
          {
            "kind": "link",
            "text": "requirements.txt",
            "href": "/posts/notebooks/requirements.txt",
            "download": true
          },
          "."
        ]
      },
      {
        "kind": "note",
        "type": "note",
        "title": "What the examples illustrate",
        "text": "The equations, small fits and coefficient plots show what changes when we alter the model. They are illustrations of model behaviour. The later comparison uses the same validation folds to decide which candidates predict better."
      },
      {
        "kind": "h",
        "id": "linear-regression",
        "text": "Linear regression",
        "navLabel": "Fit a line"
      },
      {
        "kind": "p",
        "text": "The starting point is familiar:"
      },
      {
        "kind": "equation",
        "text": "ŷ = mx + b",
        "mathml": "<mrow><mover accent=\"true\"><mi>y</mi><mo>^</mo></mover><mo>=</mo><mi>m</mi><mi>x</mi><mo>+</mo><mi>b</mi></mrow>"
      },
      {
        "kind": "p",
        "text": "For house prices, x is living area, m is the predicted price change per extra square foot, and b is the intercept. It is sometimes called a bias term; that usage differs from statistical bias, which we will meet when discussing regularization."
      },
      {
        "kind": "p",
        "text": [
          "Ordinary least squares chooses m and b to minimise squared prediction errors. Scikit-learn implements it with ",
          {
            "kind": "link",
            "text": "`LinearRegression`",
            "href": "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html"
          },
          ":"
        ]
      },
      {
        "kind": "code",
        "lang": "python",
        "text": "from sklearn.linear_model import LinearRegression\n\nliving_area_linear_model = LinearRegression().fit(\n    X_train_clean[[\"Gr Liv Area\"]], y_train\n)"
      },
      {
        "kind": "p",
        "text": "For one training house, fitting becomes a concrete prediction:"
      },
      {
        "kind": "table",
        "caption": "One training house and its area-only prediction",
        "headers": [
          "Living area",
          "Observed price",
          "Predicted price",
          "Residual"
        ],
        "rows": [
          [
            "1,571 sq ft",
            "$239,000",
            "$189,223",
            "+$49,777"
          ]
        ]
      },
      {
        "kind": "p",
        "text": "Its positive residual means the line underpredicts by about $49,777. Adding a feature is useful only if it improves the predictions, rather than just making the training fit look better."
      },
      {
        "kind": "p",
        "text": [
          "The notebook’s saved fit gives a slope of about ",
          {
            "kind": "strong",
            "text": "$114 per square foot"
          },
          ". That describes an association across these houses. The intercept predicts the price of a zero-area house, so its practical interpretation is limited."
        ]
      },
      {
        "kind": "h",
        "id": "multiple-linear-regression",
        "text": "Multiple linear regression",
        "navLabel": "Add features"
      },
      {
        "kind": "p",
        "text": "Living area leaves plenty of price variation unexplained. Adding exterior quality gives:"
      },
      {
        "kind": "equation",
        "text": "ŷ = b + β₁x₁ + β₂x₂",
        "mathml": "<mrow><mover accent=\"true\"><mi>y</mi><mo>^</mo></mover><mo>=</mo><mi>b</mi><mo>+</mo><msub><mi>β</mi><mn>1</mn></msub><msub><mi>x</mi><mn>1</mn></msub><mo>+</mo><msub><mi>β</mi><mn>2</mn></msub><msub><mi>x</mi><mn>2</mn></msub></mrow>"
      },
      {
        "kind": "p",
        "text": "or, with d features:"
      },
      {
        "kind": "equation",
        "text": "ŷ = b + ∑ⱼ₌₁ᵈ βⱼxⱼ",
        "mathml": "<mrow><mover accent=\"true\"><mi>y</mi><mo>^</mo></mover><mo>=</mo><mi>b</mi><mo>+</mo><munderover><mo>∑</mo><mrow><mi>j</mi><mo>=</mo><mn>1</mn></mrow><mi>d</mi></munderover><msub><mi>β</mi><mi>j</mi></msub><msub><mi>x</mi><mi>j</mi></msub></mrow>"
      },
      {
        "kind": "p",
        "text": [
          "Each coefficient describes a predicted change ",
          {
            "kind": "strong",
            "text": "holding the other included features fixed"
          },
          ". In the notebook’s saved output, the area slope becomes about ",
          {
            "kind": "strong",
            "text": "$83 per square foot"
          },
          " after including exterior quality. The coefficient’s interpretation changes with the model’s feature set. ",
          {
            "kind": "link",
            "text": "Scikit-learn’s coefficient interpretation example",
            "href": "https://scikit-learn.org/stable/auto_examples/inspection/plot_linear_model_coefficient_interpretation.html"
          },
          " explores this distinction."
        ]
      },
      {
        "kind": "figure",
        "src": "/posts/figures/regression-multiple-linear-regression.png",
        "alt": "Area-only regression and multiple regression with exterior quality",
        "width": 2360,
        "height": 920,
        "caption": "The left panel fits one line. The right panel shows parallel lines for different exterior-quality grades: quality changes the predicted price level, while the area slope stays constant."
      },
      {
        "kind": "p",
        "text": "With two features, the fitted relationship is a plane. Adding an interaction term, β₃x₁x₂, would let the area slope vary with quality. The current example uses the additive model."
      },
      {
        "kind": "p",
        "text": "Quality grades are encoded as ordered numbers, which assumes equal spacing between adjacent grades."
      },
      {
        "kind": "h",
        "id": "polynomial-regression",
        "text": "Polynomial regression",
        "navLabel": "Fit a curve"
      },
      {
        "kind": "p",
        "text": "Now suppose a constant price change per quality grade is too restrictive. We keep the price-prediction task and ask whether a curved relationship helps. This is a different change from adding another measurement: we are changing the shape the model can fit."
      },
      {
        "kind": "p",
        "text": "Polynomial regression adds powers of an input:"
      },
      {
        "kind": "equation",
        "text": "ŷ = b + β₁x + β₂x² + ⋯ + βₖxᵏ",
        "mathml": "<mrow><mover accent=\"true\"><mi>y</mi><mo>^</mo></mover><mo>=</mo><mi>b</mi><mo>+</mo><msub><mi>β</mi><mn>1</mn></msub><mi>x</mi><mo>+</mo><msub><mi>β</mi><mn>2</mn></msub><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><mo>⋯</mo><mo>+</mo><msub><mi>β</mi><mi>k</mi></msub><msup><mi>x</mi><mi>k</mi></msup></mrow>"
      },
      {
        "kind": "p",
        "text": [
          "The relationship curves in x, while remaining linear in the fitted coefficients. ",
          {
            "kind": "link",
            "text": "`PolynomialFeatures`",
            "href": "https://scikit-learn.org/stable/modules/preprocessing.html#generating-polynomial-features"
          },
          " constructs the extra inputs for a linear regressor."
        ]
      },
      {
        "kind": "figure",
        "src": "/posts/figures/regression-polynomial-regression.png",
        "alt": "Training price versus ordinal quality with degree-one, degree-two and degree-five fits; curved models follow the grade means more closely.",
        "caption": "The same training sales at their recorded quality grades. Jitter changes only the display. The curves compare degrees 1, 2 and 5.",
        "width": 1640,
        "height": 1010
      },
      {
        "kind": "p",
        "text": "More flexibility creates more opportunities to fit noise. A training plot illustrates the model’s shape; predictions on unseen houses are needed to assess generalisation. Polynomial curves also need care when extrapolating beyond observed inputs."
      },
      {
        "kind": "p",
        "text": "Overall quality takes only ten possible grades. A degree-ten polynomial plus intercept would have eleven coefficients and could not be identified uniquely here; I use degree five instead. Bends between integer grades are interpolation, so I judge predictions at observed grades using validation errors."
      },
      {
        "kind": "p",
        "text": "The table compares root mean squared error (RMSE), measured in dollars; lower is better. Each training fold fits the model, and its validation fold contains houses that fit did not use. The next section explains the error calculation."
      },
      {
        "kind": "table",
        "caption": "Polynomial degree compared inside the same five training folds",
        "headers": [
          "Degree",
          "Training-fold RMSE",
          "Validation-fold RMSE"
        ],
        "rows": [
          [
            "1",
            "$45,849",
            "$45,753"
          ],
          [
            "2",
            "$42,448",
            "$42,480"
          ],
          [
            "5",
            "$41,814",
            "$42,017"
          ]
        ]
      },
      {
        "kind": "p",
        "text": "Degree five has the lowest mean validation RMSE among these three settings. It improves on the straight line by about $3,736, while the gain over degree two is about $463. More flexibility did help here; this example does not demonstrate that a high-degree fit must overfit. We keep the same folds and compare errors rather than judging the curve alone."
      },
      {
        "kind": "h",
        "id": "measuring-squared-error",
        "text": "Measuring squared error",
        "navLabel": "Measure errors"
      },
      {
        "kind": "p",
        "text": "A residual is the observed value minus its prediction. Mean squared error averages the squared residuals:"
      },
      {
        "kind": "equation",
        "text": "MSE = (1/n) ∑ᵢ₌₁ⁿ (yᵢ − ŷᵢ)²",
        "mathml": "<mrow><mi>MSE</mi><mo>=</mo><mfrac><mn>1</mn><mi>n</mi></mfrac><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><msup><mrow><mo>(</mo><msub><mi>y</mi><mi>i</mi></msub><mo>−</mo><msub><mover accent=\"true\"><mi>y</mi><mo>^</mo></mover><mi>i</mi></msub><mo>)</mo></mrow><mn>2</mn></msup></mrow></mrow>"
      },
      {
        "kind": "p",
        "text": [
          "Without 1/n, this is the ",
          {
            "kind": "strong",
            "text": "sum of squared errors"
          },
          ". For a fixed dataset, minimising either gives the same unregularized fit. The normalisation matters once a penalty is added because it changes the penalty’s relative strength."
        ]
      },
      {
        "kind": "p",
        "text": [
          "Squaring makes large errors more costly. For dollar prices, MSE has units of dollars squared; its square root, RMSE, returns to dollars. See ",
          {
            "kind": "link",
            "text": "scikit-learn’s regression metrics",
            "href": "https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics"
          },
          "."
        ]
      },
      {
        "kind": "p",
        "text": "Mean absolute error (MAE) averages the absolute misses and also stays in dollars. RMSE gives larger misses more weight. I report both, because two models with similar average misses can differ on expensive mistakes."
      },
      {
        "kind": "code",
        "lang": "python",
        "text": "from sklearn.metrics import mean_absolute_error, mean_squared_error\n\npredicted_prices = living_area_linear_model.predict(\n    X_train_clean[[\"Gr Liv Area\"]]\n)\nmae = mean_absolute_error(y_train, predicted_prices)\nrmse = mean_squared_error(y_train, predicted_prices) ** 0.5\nprint(f\"MAE: ${mae:,.0f}; RMSE: ${rmse:,.0f}\")"
      },
      {
        "kind": "p",
        "text": "This training calculation demonstrates the metrics; the comparison below evaluates unseen rows after model selection."
      },
      {
        "kind": "h",
        "id": "ridge-regression",
        "text": "Ridge regression",
        "navLabel": "Ridge"
      },
      {
        "kind": "p",
        "text": "Ridge adds an L2 penalty to squared error:"
      },
      {
        "kind": "equation",
        "text": "min over β, b: ∑ᵢ₌₁ⁿ (yᵢ − ŷᵢ)² + α∑ⱼ₌₁ᵈ βⱼ²",
        "mathml": "<mrow><munder><mi>min</mi><mrow><mi>β</mi><mo>,</mo><mi>b</mi></mrow></munder><mo>[</mo><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><msup><mrow><mo>(</mo><msub><mi>y</mi><mi>i</mi></msub><mo>−</mo><msub><mover accent=\"true\"><mi>y</mi><mo>^</mo></mover><mi>i</mi></msub><mo>)</mo></mrow><mn>2</mn></msup></mrow><mo>+</mo><mi>α</mi><mrow><munderover><mo>∑</mo><mrow><mi>j</mi><mo>=</mo><mn>1</mn></mrow><mi>d</mi></munderover><msup><msub><mi>β</mi><mi>j</mi></msub><mn>2</mn></msup></mrow><mo>]</mo></mrow>"
      },
      {
        "kind": "p",
        "text": [
          "This matches ",
          {
            "kind": "link",
            "text": "`Ridge`",
            "href": "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html"
          },
          ". The penalty strength is often written λ; I’m using α to match the notebook."
        ]
      },
      {
        "kind": "p",
        "text": [
          "Large weights cost more. This can stabilise estimation when correlated features carry overlapping information, such as ",
          {
            "kind": "code",
            "text": "Year Built"
          },
          " and ",
          {
            "kind": "code",
            "text": "Garage Yr Blt"
          },
          ". Stronger regularization introduces bias while potentially reducing variance across fitted samples. Statistical bias here means systematic estimation error."
        ]
      },
      {
        "kind": "p",
        "text": "As α → ∞, the penalised weights approach zero. The intercept remains unpenalised in this setup."
      },
      {
        "kind": "p",
        "text": "Scale features before penalising coefficients: changing area from square feet to square metres changes its coefficient, and therefore its penalty, without changing the houses. Training-fitted standardisation makes numeric units comparable. The examples use scaled numeric features; nominal indicators retain their zero-or-one coding."
      },
      {
        "kind": "p",
        "text": [
          "An individual coefficient can grow while the overall coefficient norm shrinks. In the notebook’s saved fits, Ridge increases the garage-year weight from ",
          {
            "kind": "strong",
            "text": "5,669 to 7,536"
          },
          ", while reducing the other two weights. Reading every weight as independently shrinking would miss this redistribution."
        ]
      },
      {
        "kind": "h",
        "id": "lasso-regression",
        "text": "Lasso regression",
        "navLabel": "Lasso"
      },
      {
        "kind": "p",
        "text": [
          "Lasso uses an L1 penalty, based on absolute coefficient values. Scikit-learn’s ",
          {
            "kind": "link",
            "text": "`Lasso`",
            "href": "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Lasso.html"
          },
          " minimises:"
        ]
      },
      {
        "kind": "equation",
        "text": "min over β, b: (1/2n)∑ᵢ₌₁ⁿ (yᵢ − ŷᵢ)² + α∑ⱼ₌₁ᵈ |βⱼ|",
        "mathml": "<mrow><munder><mi>min</mi><mrow><mi>β</mi><mo>,</mo><mi>b</mi></mrow></munder><mo>[</mo><mfrac><mn>1</mn><mrow><mn>2</mn><mi>n</mi></mrow></mfrac><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><msup><mrow><mo>(</mo><msub><mi>y</mi><mi>i</mi></msub><mo>−</mo><msub><mover accent=\"true\"><mi>y</mi><mo>^</mo></mover><mi>i</mi></msub><mo>)</mo></mrow><mn>2</mn></msup></mrow><mo>+</mo><mi>α</mi><mrow><munderover><mo>∑</mo><mrow><mi>j</mi><mo>=</mo><mn>1</mn></mrow><mi>d</mi></munderover><mo>|</mo><msub><mi>β</mi><mi>j</mi></msub><mo>|</mo></mrow><mo>]</mo></mrow>"
      },
      {
        "kind": "p",
        "text": [
          "The penalty’s shape allows weights to become ",
          {
            "kind": "strong",
            "text": "exactly zero"
          },
          ". Lasso can turn a feature off: built-in feature selection, yeehaw."
        ]
      },
      {
        "kind": "p",
        "text": "That is useful when a smaller set of predictors can describe the outcome. With correlated features, the selected subset can change as the sample or penalty changes. A zero weight describes the chosen model and setting; it does not establish that the feature has no relationship with price."
      },
      {
        "kind": "p",
        "text": "In the notebook’s current example, Lasso sets the garage-year coefficient to zero."
      },
      {
        "kind": "h",
        "id": "elasticnet-regression",
        "text": "ElasticNet regression",
        "navLabel": "ElasticNet"
      },
      {
        "kind": "p",
        "text": [
          "ElasticNet combines both penalties. Scikit-learn’s ",
          {
            "kind": "link",
            "text": "`ElasticNet`",
            "href": "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.ElasticNet.html"
          },
          " uses:"
        ]
      },
      {
        "kind": "equation",
        "text": "min over β, b: (1/2n)∑ᵢ₌₁ⁿ (yᵢ − ŷᵢ)² + αr∑ⱼ₌₁ᵈ |βⱼ| + α(1−r)/2 ∑ⱼ₌₁ᵈ βⱼ²",
        "mathml": "<mrow><munder><mi>min</mi><mrow><mi>β</mi><mo>,</mo><mi>b</mi></mrow></munder><mo>[</mo><mfrac><mn>1</mn><mrow><mn>2</mn><mi>n</mi></mrow></mfrac><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><msup><mrow><mo>(</mo><msub><mi>y</mi><mi>i</mi></msub><mo>−</mo><msub><mover accent=\"true\"><mi>y</mi><mo>^</mo></mover><mi>i</mi></msub><mo>)</mo></mrow><mn>2</mn></msup></mrow><mo>+</mo><mi>α</mi><mi>r</mi><mrow><munderover><mo>∑</mo><mrow><mi>j</mi><mo>=</mo><mn>1</mn></mrow><mi>d</mi></munderover><mo>|</mo><msub><mi>β</mi><mi>j</mi></msub><mo>|</mo></mrow><mo>+</mo><mfrac><mrow><mi>α</mi><mo>(</mo><mn>1</mn><mo>−</mo><mi>r</mi><mo>)</mo></mrow><mn>2</mn></mfrac><mrow><munderover><mo>∑</mo><mrow><mi>j</mi><mo>=</mo><mn>1</mn></mrow><mi>d</mi></munderover><msup><msub><mi>β</mi><mi>j</mi></msub><mn>2</mn></msup></mrow><mo>]</mo></mrow>"
      },
      {
        "kind": "p",
        "text": [
          "Here, r is ",
          {
            "kind": "code",
            "text": "l1_ratio"
          },
          ". Setting it to 1 gives Lasso; values between 0 and 1 combine sparsity with L2 shrinkage. The L2 component can help stabilise selection when predictors overlap."
        ]
      },
      {
        "kind": "figure",
        "src": "/posts/figures/regression-regularization-coefficients.png",
        "alt": "OLS, Ridge, Lasso and ElasticNet coefficient comparison",
        "width": 1770,
        "height": 880,
        "caption": "Each bar is one fitted coefficient, measured in dollars per one standard deviation of its feature. Lasso zeros the garage-year weight; Ridge and ElasticNet redistribute the weights differently."
      },
      {
        "kind": "p",
        "text": [
          "The settings illustrate behaviour: Ridge α=100, Lasso α=30,000, ElasticNet α=1 with ",
          {
            "kind": "code",
            "text": "l1_ratio=0.5"
          },
          ". Ridge uses SSE; Lasso and ElasticNet both use SSE/(2n), with different penalties. Equal ",
          {
            "kind": "code",
            "text": "alpha"
          },
          " values do not imply equal penalty strength."
        ]
      },
      {
        "kind": "p",
        "text": [
          "These bars show coefficient ",
          {
            "kind": "strong",
            "text": "size"
          },
          " from one fit per model. Measuring coefficient ",
          {
            "kind": "strong",
            "text": "variance"
          },
          " requires repeated samples and refitting. Regularization’s effect on prediction error needs a separate evaluation."
        ]
      },
      {
        "kind": "h",
        "id": "compare-price-predictions",
        "text": "Compare price predictions",
        "navLabel": "Compare predictions"
      },
      {
        "kind": "p",
        "text": "A constant-price baseline predicts the mean training sale price for every house. I compare it with the models above using the same five shuffled training folds. Each fold fits its own imputer, scaler and encoder on cleaned training columns; cross-validating the already prepared matrix would let validation rows influence those fitted statistics."
      },
      {
        "kind": "p",
        "text": "Polynomial degree is chosen from 1, 2 and 5; Ridge alpha is chosen from 0.1, 1, 10, 100 and 1,000. The candidate with the lowest training-CV RMSE is selected before looking at test errors. These selection scores are not an independent estimate of the selected winner."
      },
      {
        "kind": "p",
        "text": "The notebook defines regression_preprocessor from the cleaning branches recorded in split.json, then refits it inside each pipeline. Its Ridge search is:"
      },
      {
        "kind": "code",
        "lang": "python",
        "text": "from sklearn.base import clone\nfrom sklearn.linear_model import Ridge\nfrom sklearn.model_selection import GridSearchCV, KFold\nfrom sklearn.pipeline import make_pipeline\n\nsearch = GridSearchCV(\n    make_pipeline(clone(regression_preprocessor), Ridge()),\n    {\"ridge__alpha\": [0.1, 1, 10, 100, 1000]},\n    cv=KFold(5, shuffle=True, random_state=42),\n    scoring=\"neg_root_mean_squared_error\",\n)\nsearch.fit(X_train_clean, y_train)"
      },
      {
        "kind": "table",
        "caption": "Price-model comparison: five training folds for selection, then the same 586 saved test houses",
        "headers": [
          "Model",
          "CV RMSE",
          "Training RMSE",
          "Test MAE",
          "Test RMSE"
        ],
        "rows": [
          [
            "Training-mean baseline",
            "$77,142",
            "$77,238",
            "$62,306",
            "$89,817"
          ],
          [
            "Living area",
            "$53,562",
            "$53,502",
            "$41,180",
            "$60,154"
          ],
          [
            "Area + exterior quality",
            "$42,049",
            "$41,981",
            "$32,355",
            "$45,181"
          ],
          [
            "Quality polynomial",
            "$42,017",
            "$41,856",
            "$31,768",
            "$45,824"
          ],
          [
            "All features OLS",
            "$27,609",
            "$26,292",
            "$19,624",
            "$30,865"
          ],
          [
            "All features Ridge",
            "$27,598",
            "$26,299",
            "$19,656",
            "$30,892"
          ]
        ]
      },
      {
        "kind": "p",
        "text": "Training cross-validation selects the all-feature Ridge model with alpha=1. On the 586 test houses, its MAE is $19,656 and RMSE is $30,892, compared with baseline errors of $62,306 and $89,817."
      },
      {
        "kind": "p",
        "text": "OLS is slightly better on this test split; we retain the candidate selected from training folds. Ridge’s CV advantage over OLS is only about $11, much smaller than its roughly $1,605 spread across fold RMSEs. These results support using the fuller feature set; they do not establish a meaningful Ridge advantage."
      },
      {
        "kind": "figure",
        "src": "/posts/figures/regression-residuals.png",
        "alt": "Residuals for the selected Ridge model on all 586 test houses: mostly near zero at lower prices, with wider spread and several large underpredictions at high predicted prices.",
        "caption": "Residual = actual minus predicted price. Each point is a saved test house. The dashed zero line marks a perfect prediction.",
        "width": 1640,
        "height": 920
      },
      {
        "kind": "p",
        "text": "The residuals spread out among higher predicted prices, with several large positive misses. The median residual is about −$663, while the 90th percentile of absolute errors is about $39,571. A near-zero median therefore does not mean every prediction is close. I would investigate the large misses and consider richer relationships or a different loss using training validation, rather than deleting difficult test houses."
      },
      {
        "kind": "note",
        "type": "danger",
        "text": "Keep the test result fixed after selection. This revised run reserves test rows before learned choices, but earlier versions explored this public dataset. The figures describe this retained Ames sample; a fresh external dataset is needed to establish wider performance."
      },
      {
        "kind": "note",
        "type": "tip",
        "text": "Try an area × exterior-quality interaction in the two-feature model. Create it inside the pipeline and compare its training-fold RMSE on the same folds. A lower training error alone does not show better predictions on unseen houses.",
        "disclosure": true,
        "title": "Try an interaction term"
      },
      {
        "kind": "h",
        "id": "logistic-regression",
        "text": "Logistic regression",
        "navLabel": "Logistic regression"
      },
      {
        "kind": "p",
        "text": "The features can stay familiar while the question changes from estimating a price to deciding whether it crosses a cutoff. That changes the target, loss and meaning of the output."
      },
      {
        "kind": "p",
        "text": [
          "Now change the outcome to ",
          {
            "kind": "strong",
            "text": "whether a house sells for at least $200,000"
          },
          ". The target is binary: 1 at or above the cutoff, 0 below it."
        ]
      },
      {
        "kind": "p",
        "text": "Logistic regression starts with a linear score:"
      },
      {
        "kind": "equation",
        "text": "zᵢ = b + βᵀxᵢ",
        "mathml": "<mrow><msub><mi>z</mi><mi>i</mi></msub><mo>=</mo><mi>b</mi><mo>+</mo><msup><mi>β</mi><mi>T</mi></msup><msub><mi>x</mi><mi>i</mi></msub></mrow>"
      },
      {
        "kind": "p",
        "text": "The sigmoid converts that score into a probability:"
      },
      {
        "kind": "equation",
        "text": "σ(z) = 1/(1 + e⁻ᶻ), pᵢ = P(yᵢ = 1 | xᵢ) = σ(zᵢ)",
        "mathml": "<mrow><mi>σ</mi><mo>(</mo><mi>z</mi><mo>)</mo><mo>=</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>+</mo><msup><mi>e</mi><mrow><mo>−</mo><mi>z</mi></mrow></msup></mrow></mfrac><mo>,</mo><msub><mi>p</mi><mi>i</mi></msub><mo>=</mo><mi>P</mi><mo>(</mo><msub><mi>y</mi><mi>i</mi></msub><mo>=</mo><mn>1</mn><mo>|</mo><msub><mi>x</mi><mi>i</mi></msub><mo>)</mo><mo>=</mo><mi>σ</mi><mo>(</mo><msub><mi>z</mi><mi>i</mi></msub><mo>)</mo></mrow>"
      },
      {
        "kind": "equation",
        "text": "P(yᵢ = 0 | xᵢ) = 1 − pᵢ",
        "mathml": "<mrow><mi>P</mi><mo>(</mo><msub><mi>y</mi><mi>i</mi></msub><mo>=</mo><mn>0</mn><mo>|</mo><msub><mi>x</mi><mi>i</mi></msub><mo>)</mo><mo>=</mo><mn>1</mn><mo>−</mo><msub><mi>p</mi><mi>i</mi></msub></mrow>"
      },
      {
        "kind": "p",
        "text": [
          {
            "kind": "link",
            "text": "LogisticRegression",
            "href": "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html",
            "download": false
          },
          " fits penalised log loss by default. Its C parameter controls inverse regularization strength: smaller values mean stronger regularization."
        ]
      },
      {
        "kind": "figure",
        "src": "/posts/figures/regression-logistic-regression.png",
        "alt": "Linear scores, sigmoid probabilities and sampled house classes",
        "width": 2220,
        "height": 1038,
        "caption": "Left: sampled houses sit on their computed linear scores. Right: the same houses sit at their observed classes, 0 or 1. The curve gives predicted probabilities. Circles are training houses; triangles are test houses."
      },
      {
        "kind": "p",
        "text": "A score of zero gives a probability of 50%. The default decision threshold converts probabilities into class predictions. The $200,000 price cutoff defines the outcome; the 50% threshold controls the decision."
      },
      {
        "kind": "h",
        "id": "choosing-the-model-structure",
        "text": "Choosing the model structure",
        "navLabel": "Decisions and next steps"
      },
      {
        "kind": "p",
        "text": "Each extension changes one decision: the features, their transformation, the penalty on their weights, or the outcome. Use validation to decide whether that change helps, and the plots to understand its behaviour."
      },
      {
        "kind": "p",
        "text": [
          "The ",
          {
            "kind": "link",
            "text": "complete notebook",
            "href": "https://colab.research.google.com/drive/1Q9pXGJko1QY3TayhqtY-3GKSn9i2lLEX"
          },
          " contains the preparation context, rotatable regression plane and reusable plotting code. Sections 2–5 follow the price models above; section 7 keeps the logistic example and optional metric preview together."
        ]
      },
      {
        "kind": "note",
        "type": "recap",
        "title": "From prices to classes",
        "text": "Regression estimates a numerical outcome. In this comparison, the fuller feature set delivers the substantial gain; Ridge’s small CV advantage over OLS is not evidence of a general win. Changing the target to a category brings us to classification, where we need to evaluate the resulting class decisions."
      },
      {
        "kind": "p",
        "text": [
          "Next, ",
          {
            "kind": "link",
            "text": "dimensionality reduction and support vector machines",
            "href": "/posts/dimensionality-reduction-and-support-vector-machines"
          },
          " takes that classification question to land-cover pixels: can we replace 200 spectral measurements with a few components and preserve useful predictions? We compare compact and full representations using the same validation folds."
        ]
      }
    ]
  },
  pcaSvmPost,
];

// Reading order lives in the catalogue: inserting a post updates every next link.
export const nextPost = (slug, entries = postEntries) => {
  const index = entries.findIndex((post) => post.slug === slug);
  return index < 0 || entries.length < 2 ? null : entries[(index + 1) % entries.length];
};
