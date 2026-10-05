// Generated from the executed PCA_SVM.ipynb comparison on 5 October 2026.
export const pcaSvmResults = {
  "selected_representation": "200 bands",
  "training_pixels": 8199,
  "test_pixels": 2050,
  "folds": 5,
  "settings_per_representation": 4,
  "pca_two_variance": 0.8756743624646864,
  "pca_nine_variance": 0.953404963277956,
  "results": [
    {
      "representation": "2 PCs",
      "features": 2,
      "settings": {
        "svc__C": 10,
        "svc__gamma": "scale"
      },
      "cv_balanced_accuracy": 0.5843690746025543,
      "cv_balanced_accuracy_sd": 0.004169654052389369,
      "cv_macro_f1": 0.42895638211188414,
      "mean_fold_fit_seconds": 0.32083640098571775,
      "refit_seconds": 0.4895040988922119,
      "search_seconds": 16.372678291983902,
      "test_accuracy": 0.4721951219512195,
      "test_balanced_accuracy": 0.5987363087014355,
      "test_macro_f1": 0.439266593465123
    },
    {
      "representation": "9 PCs",
      "features": 9,
      "settings": {
        "svc__C": 10,
        "svc__gamma": "scale"
      },
      "cv_balanced_accuracy": 0.8348018372493137,
      "cv_balanced_accuracy_sd": 0.011132404519553846,
      "cv_macro_f1": 0.7720265128235952,
      "mean_fold_fit_seconds": 0.24340519905090333,
      "refit_seconds": 0.35700392723083496,
      "search_seconds": 12.626329208025709,
      "test_accuracy": 0.7531707317073171,
      "test_balanced_accuracy": 0.8286264744665242,
      "test_macro_f1": 0.7622388682763176
    },
    {
      "representation": "200 bands",
      "features": 200,
      "settings": {
        "svc__C": 10,
        "svc__gamma": "scale"
      },
      "cv_balanced_accuracy": 0.8976189882028842,
      "cv_balanced_accuracy_sd": 0.016401694043441377,
      "cv_macro_f1": 0.882935487209423,
      "mean_fold_fit_seconds": 0.598677682876587,
      "refit_seconds": 0.8717739582061768,
      "search_seconds": 27.98593920795247,
      "test_accuracy": 0.8765853658536585,
      "test_balanced_accuracy": 0.9299524070782335,
      "test_macro_f1": 0.8958680462161511
    }
  ],
  "scope": "Exploratory within-scene random-pixel split; test set previously inspected.",
  "figures": {
    "pca-two-band-geometry.png": {
      "width": 1938,
      "height": 898
    },
    "pca-numpy-projection.png": {
      "width": 2098,
      "height": 1138
    },
    "representation-comparison.png": {
      "width": 1938,
      "height": 898
    },
    "pca-landscape.png": {
      "width": 2418,
      "height": 1010
    },
    "pca-explained-variance.png": {
      "width": 1458,
      "height": 850
    },
    "svm-linear-vs-rbf-grass.png": {
      "width": 1967,
      "height": 1037
    },
    "svm-train-test-errors.png": {
      "width": 1813,
      "height": 1093
    },
    "svm-pc1-crop-comparison.png": {
      "width": 2418,
      "height": 1058
    }
  }
};
