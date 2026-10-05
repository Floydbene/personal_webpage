import { pcaSvmResults } from './pcaSvmResults.js';

const p = (text) => ({ kind: 'p', text });
const h = (id, text, navLabel) => ({ kind: 'h', id, text, navLabel });
const note = (type, title, text) => ({ kind: 'note', type, title, text });
const link = (text, href) => ({ kind: 'link', text, href });
const equation = (text, mathml) => ({ kind: 'equation', text, mathml });
const figure = (name, alt, caption) => ({
  kind: 'figure', src: `/posts/figures/${name}`, alt, caption,
  ...pcaSvmResults.figures[name],
});
const percent = (value) => `${(100 * value).toFixed(1)}%`;
const rows = pcaSvmResults.results;
const two = rows.find((row) => row.features === 2);
const nine = rows.find((row) => row.features === 9);
const full = rows.find((row) => row.features === 200);
const selected = rows.find((row) => row.representation === pcaSvmResults.selected_representation);

export const pcaSvmPost = {
  ref: '04', section: 'machine-learning', slug: 'dimensionality-reduction-and-support-vector-machines',
  status: 'review', draftVersion: 1, title: 'Dimensionality Reduction and Support Vector Machines',
  span: '2026', minutes: 16, level: 'Applied foundations',
  summary: 'Compare two PCs, nine PCs and all 200 spectral bands to see what compression costs a land-cover classifier.',
  prerequisites: 'Python, NumPy arrays and a basic understanding of training and validation splits.',
  learningGoals: [
    'Explain what PCA preserves and what explained variance leaves unanswered.',
    'Read linear and curved SVM boundaries in the same feature space.',
    'Compare compression, classification performance and fitting cost using training validation.',
  ],
  tags: ['PCA', 'SVM', 'Classification', 'Model Evaluation'],
  body: [
    { kind: 'lede', text: 'One pixel, 200 measurements, one land-cover label. I want to know how much of that spectrum we can compress before classification suffers. We will first make the geometry visible, then compare the practical trade-off on the same pixels.' },
    p(['The ', link('regression post', '/posts/basics-of-regression'), ' ended by changing a house-price target into a class. Here the classes are crops and other land cover. The same habits carry over: define the task, fit transformations on training data, and compare candidates on consistent validation folds.']),
    note('note', 'Calculations as illustrations', 'The manual PCA and SVM sections explain the geometry, objective and updates. The final experiment uses scikit-learn; its comparison measures what the fitted models can do.'),
    p(['Open the ', link('PCA/SVM notebook in Colab', 'https://colab.research.google.com/drive/1NwD08gEXxpaU_wM9DK5HltQlCohJ9BbV'), ' for the full calculations, executed outputs and plotting code. Its first code cell downloads both Indian Pines data files from the LearningHyperspectral GitHub repository when needed; run the cells in order. It uses NumPy, SciPy, Matplotlib and scikit-learn, without a GPU. The final comparison performs 60 validation fits and three refits.']),

    h('one-pixel-many-measurements', 'What does one row represent?', 'Data and split'),
    p(['The ', link('Indian Pines dataset', 'https://www.ehu.eus/ccwintco/index.php?title=Hyperspectral_Remote_Sensing_Scenes#Indian_Pines'), ' is a 145 × 145 image with 200 spectral bands in the corrected file. A band is a measurement at a wavelength range. Flattening the labelled pixels gives 10,249 rows, each with 200 measurements and one of 16 land-cover labels. Unlabelled pixels are excluded from fitting.']),
    p('The notebook keeps image coordinates separately. X contains spectra, y contains class IDs, and Z will contain PCA scores. A point’s location in a PCA scatter plot describes its spectrum, not its position in the field.'),
    p('We reserve 2,050 test pixels and use 8,199 for training, stratifying by the 16 classes. Band means, standard deviations and PCA directions are learned from training pixels only. The same fitted transformation then handles test pixels.'),
    note('danger', 'What this split can tell us', 'Neighbouring pixels from the same field can appear in both sets. This measures classification within one scene; it does not establish performance on unseen fields. Oats has only four test pixels, so one changed prediction moves its recall by 25 percentage points.'),

    h('where-pc1-and-pc2-come-from', 'Where do PC1 and PC2 come from?', 'PCA geometry'),
    p('Start with two bands so we can draw the directions. We centre each using its training mean, then divide by its training standard deviation. This gives each band equal starting variance. The cloud still has a shape: the two measurements often rise and fall together.'),
    p('PC1 points along the largest spread of that cloud. PC2 is perpendicular and captures the remaining spread. Projecting a pixel onto either direction gives its coordinate on that axis. Keeping only PC1 would discard the perpendicular displacement.'),
    figure('pca-two-band-geometry.png', 'Two standardised spectral bands with principal-direction arrows and projections, beside the same pixels in rotated coordinates', 'Bands 41 and 81, training pixels only. The colours identify the same sampled points across panels, not crop classes. These are the PCs of this two-band illustration, not the first two PCs of the full dataset. Arrows show one standard deviation along each direction.'),
    p('For all 200 bands, let A be the standardised training matrix with n rows. The covariance matrix is:'),
    equation('C = AᵀA / (n − 1)', '<mrow><mi>C</mi><mo>=</mo><mfrac><mrow><msup><mi>A</mi><mi>T</mi></msup><mi>A</mi></mrow><mrow><mi>n</mi><mo>−</mo><mn>1</mn></mrow></mfrac></mrow>'),
    p('C has shape 200 × 200. Its diagonal contains band variances; the other entries describe how bands vary together. Because these columns were standardised, C is also their correlation matrix. For a unit direction w, projected variance is wᵀCw. Maximising it gives the leading eigenvector.'),
    equation('Cvᵢ = λᵢvᵢ; Z = AW', '<mrow><mi>C</mi><msub><mi>v</mi><mi>i</mi></msub><mo>=</mo><msub><mi>λ</mi><mi>i</mi></msub><msub><mi>v</mi><mi>i</mi></msub><mo>,</mo><mspace width="1em"/><mi>Z</mi><mo>=</mo><mi>A</mi><mi>W</mi></mrow>'),
    p('Each eigenvector vᵢ is a direction; its eigenvalue λᵢ is the variance along it. Sort eigenvalues from largest to smallest, keeping their matching eigenvector columns together. W contains the first k directions, so multiplying A by W gives k coordinates per pixel. Neither the covariance calculation nor these directions uses the crop labels.'),
    { kind: 'code', lang: 'python', text: 'covariance_matrix = (\n    X_train_scaled.T @ X_train_scaled\n    / (len(X_train_scaled) - 1)\n)\neigenvalues, eigenvectors = np.linalg.eigh(covariance_matrix)\norder = np.argsort(eigenvalues)[::-1]\neigenvalues = eigenvalues[order]\neigenvectors = eigenvectors[:, order]\npca_basis = eigenvectors[:, :2]\nZ_train = X_train_scaled @ pca_basis\nZ_test = X_test_scaled @ pca_basis' },
    p('The manual notebook uses sample standard deviations, with denominator n − 1. The later StandardScaler uses n. For this complete matrix the difference is one common scale factor, so the PCA directions and variance ratios agree apart from numerical precision and arbitrary axis signs.'),

    h('variance-and-class-information', 'How much information have we kept?', 'Variance and class information'),
    p(`Divide each eigenvalue by their total to find its explained-variance ratio. Two PCs retain ${percent(pcaSvmResults.pca_two_variance)} of the standardised training variance; nine retain ${percent(pcaSvmResults.pca_nine_variance)}. That tells us how well the representation preserves variation in the inputs.`),
    figure('pca-explained-variance.png', 'Cumulative explained variance rises sharply for the first two components and passes 95 percent at nine', 'Training variance only. The vertical axis starts at 60% to show the smaller gains after PC1.'),
    note('misconception', 'Variance retained is not accuracy retained', 'PCA does not know the labels. A small-variance direction can distinguish classes, while a large-variance direction can describe differences that do not help classification. A 95% variance threshold is a candidate representation to evaluate, not a guarantee of 95% predictive information.'),
    figure('pca-numpy-projection.png', 'Training pixels projected onto the first two full-spectrum principal components and coloured by land-cover class', 'PC1 and PC2 are new spectral coordinates. Colours are added after fitting PCA. Overlap shows why two components useful for plotting may not be enough for classification.'),
    p('We can also return the scores to the landscape: place each pixel at its original image coordinates and use its first three PC scores as red, green and blue. This is a false-colour display of the representation, not a classifier output.'),
    figure('pca-landscape.png', 'PCA false-colour landscape beside the ground-truth land-cover map', 'The directions and colour stretches use training pixels. The separate ground-truth map supplies the labels; PCA has not predicted them.'),

    h('one-coordinate-one-question', 'Can one coordinate separate corn and soybean?', 'Linear SVM and margin'),
    p('Suppose we are asked whether a pixel is corn or soybean. We group the three corn labels into −1 and the three soybean labels into +1, then try PC1 alone. A linear SVM gives a score f(x) = wx + b; its sign supplies the class. The boundary is where f(x) = 0.'),
    p('The margin boundaries are f(x) = −1 and f(x) = +1. Their separation is 2/|w| for nonzero w. A hard margin demands that every training point be correctly classified beyond its margin boundary. These overlapping crops need a soft margin, which allows violations and charges for them:'),
    equation('J(w,b) = ½w² + C ∑ᵢ max(0, 1 − yᵢ(wxᵢ + b))', '<mrow><mi>J</mi><mo>(</mo><mi>w</mi><mo>,</mo><mi>b</mi><mo>)</mo><mo>=</mo><mfrac><mn>1</mn><mn>2</mn></mfrac><msup><mi>w</mi><mn>2</mn></msup><mo>+</mo><mi>C</mi><munder><mo>∑</mo><mi>i</mi></munder><mi>max</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>−</mo><msub><mi>y</mi><mi>i</mi></msub><mo>(</mo><mi>w</mi><msub><mi>x</mi><mi>i</mi></msub><mo>+</mo><mi>b</mi><mo>)</mo><mo>)</mo></mrow>'),
    p('The first term favours a wider margin. The second sums hinge losses. A point can be correctly classified yet still incur loss if it lies inside the margin. C controls the relative cost of violations; it does not directly specify a threshold or an allowed error count.'),
    p('The manual notebook calculates scores, selects margin violations, computes subgradients and updates w and b. Its objective falls from 5,212 to about 4,239, but the constant-Soybean solution achieves 3,992. The loop has made progress without converging. We use separate converged reference fits to distinguish optimisation progress from what the input feature can represent.'),
    note('note', 'Read the loop as an illustration', 'The manual updates expose the loss and the direction of learning. The reference comparisons and final experiment use scikit-learn’s solver. A limited hand-written optimisation loop is not evidence that an SVM cannot fit the data.'),

    h('change-the-question', 'Would one coordinate answer a different question?', 'Change the class question'),
    p('Say we are instead asked to distinguish wheat from corn. Their PC1 values occupy more distinct regions. Compare that with corn versus soybean using the same feature and unweighted linear objective: the latter overlap heavily, and the reference fit predicts the more common soybean class throughout the observed range.'),
    figure('svm-pc1-crop-comparison.png', 'A one-feature SVM largely separates wheat and corn but predicts soybean across the observed corn-soybean range', 'Training pixels and training balanced accuracy. Vertical jitter is only for visibility. This comparison changes the class question to illustrate geometry; it is not a held-out comparison of model quality.'),

    h('when-a-curve-helps', 'Can a curved boundary help on a fixed task?', 'Curved boundaries'),
    p('Now suppose we are asked to distinguish grass/pasture from grass/trees. We keep PC1 and PC2, and hold the classes, training pixels and test pixels fixed while comparing a linear boundary with a radial basis function (RBF) kernel.'),
    equation('K(x,xᵢ) = exp(−γ‖x − xᵢ‖²)', '<mrow><mi>K</mi><mo>(</mo><mi>x</mi><mo>,</mo><msub><mi>x</mi><mi>i</mi></msub><mo>)</mo><mo>=</mo><mi>exp</mi><mo>(</mo><mo>−</mo><mi>γ</mi><msup><mrow><mo>‖</mo><mi>x</mi><mo>−</mo><msub><mi>x</mi><mi>i</mi></msub><mo>‖</mo></mrow><mn>2</mn></msup><mo>)</mo></mrow>'),
    p('The kernel measures similarity to training examples without explicitly constructing a larger feature space. The fitted score combines similarities to support vectors. Larger gamma makes similarity fade more quickly with distance, allowing more local boundaries. Support vectors can lie on or inside the margin, including misclassified points.'),
    p('Each model standardises the two PC inputs using the pair’s training pixels and uses balanced class weights. The pair and settings were selected in a separate training-only search over 66 eligible class pairs, with preprocessing refitted inside validation folds. This deliberately selects an illustrative example; its best validation score is optimistic. The notebook records the search settings and audit-file location.'),
    figure('svm-linear-vs-rbf-grass.png', 'Linear and curved RBF boundaries for the same grass classes, with held-out mistakes circled', 'The same 243 held-out pixels: balanced accuracy is 83.7% for linear and 94.7% for RBF. Black rings mark mistakes. The pairwise models use these two inputs only, so the plot shows their entire boundary.'),
    p('This supports a narrow conclusion: a curved boundary helps this pair under these settings. It does not tell us whether two PCs are enough for all 16 classes.'),

    h('compare-compression', 'How much compression can we afford for all 16 classes?', 'Model comparison'),
    p('We now return to the full task. Compare two PCs, nine PCs and all 200 standardised bands with the same five stratified training folds. Each gets four RBF settings: C in {1, 10}, gamma in {scale, auto}. Band scaling and PCA are fitted inside each fold; the all-band pipeline skips PCA.'),
    p(['The ', link('SVC parameter reference', 'https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html'), ' defines auto as 1/d and scale as 1/(d × Var(X)) for the matrix entering SVC. These common search rules adapt to the representation. The PC outputs retain their variances; we do not standardise them again in this experiment.']),
    p('Choose each representation’s setting by mean CV balanced accuracy, then choose the representation by that same training score. Balanced accuracy gives each class’s recall equal weight; macro F1 averages the class F1 scores equally. We report both for the setting selected by balanced accuracy. An exact tie prefers fewer inputs.'),
    { kind: 'table', caption: 'Training-only representation comparison; all candidates use the same five folds and four-setting RBF search', headers: ['Inputs', 'CV balanced accuracy', 'CV macro F1', 'Mean fit / fold'], rows: rows.map((row) => [row.representation, percent(row.cv_balanced_accuracy), row.cv_macro_f1.toFixed(3), `${row.mean_fold_fit_seconds.toFixed(2)} s`]) },
    p(`Training cross-validation selects ${selected.representation}, with mean balanced accuracy ${percent(selected.cv_balanced_accuracy)} and fold standard deviation ${percent(selected.cv_balanced_accuracy_sd)}. These selected scores are optimistic; the fold spread is not a confidence interval.`),
    p(`Timing includes scaling, PCA where present and SVM fitting, but excludes scoring. It is specific to this machine and sequential execution.`),
    { kind: 'table', caption: 'Fixed model settings selected separately within training cross-validation', headers: ['Inputs', 'C', 'Gamma rule'], rows: rows.map((row) => [row.representation, String(row.settings.svc__C), row.settings.svc__gamma]) },
    p('Each candidate is then refitted on all training pixels and evaluated on the same 2,050 test pixels. We keep the training-selected winner even if the test ranking differs. The majority-class baseline has 6.25% balanced accuracy across the 16 represented classes.'),
    { kind: 'table', caption: 'Exploratory test evaluation of the three fixed candidates; no selection from test scores', headers: ['Inputs', 'Test accuracy', 'Test balanced accuracy', 'Test macro F1'], rows: rows.map((row) => [row.representation, percent(row.test_accuracy), percent(row.test_balanced_accuracy), row.test_macro_f1.toFixed(3)]) },
    figure('representation-comparison.png', 'Balanced accuracy and measured fitting time compared for two PCs, nine PCs and 200 bands', 'Identical folds and search budgets. Mean fold fit time is measured for each selected setting. The test set was previously inspected during development; these are exploratory within-scene results.'),

    h('what-to-take-away', 'What would I take into the next project?', 'Decisions and limits'),
    p(`Nine PCs reduce the SVM input width by 95.5%, from 200 values to nine. Their CV balanced accuracy is ${percent(nine.cv_balanced_accuracy)}, compared with ${percent(two.cv_balanced_accuracy)} for two PCs and ${percent(full.cv_balanced_accuracy)} for all bands. The nine-PC pipeline takes ${nine.mean_fold_fit_seconds.toFixed(2)} seconds per fold fit here, versus ${full.mean_fold_fit_seconds.toFixed(2)} seconds for all bands. That is the observed compression–classification–fitting-cost trade-off under this search budget.`),
    p('A decision needs a tolerance: how much recall can each land-cover class lose, and what fitting or storage constraint matters? The notebook includes the per-class test report for the training-selected candidate. A small change in an aggregate score may hide a large change for a rare class. Broader tuning, inference timings and repeated timing measurements would answer questions this small experiment leaves open.'),
    note('misconception', 'Nine PCs still require 200 input measurements', 'Each component combines the original bands. A deployed nine-PC pipeline still receives all 200 bands, then applies the stored scaler and PCA before classification. This reduces the representation supplied to the SVM; it does not show that the sensor can collect fewer bands.'),
    p('For a reusable data pipeline, preserve feature order, fitted scaling, fitted PCA and the classifier together. Fit once on training data and reuse those objects for new pixels. Choose compression by validation performance and measured cost, rather than explained variance alone.'),
    figure('svm-train-test-errors.png', 'Training and test misclassification maps at original image coordinates for the training-selected model', `The CV-selected ${selected.representation} model, at original image locations. Red marks mistakes. These maps help locate errors; they do not establish performance on unseen fields.`),
    note('recap', 'The practical answer', `Under this fixed comparison, training validation chooses ${selected.representation}. PCA gives us a controllable representation; the classifier comparison tells us which candidate supports this task. The next experiment is a predefined spatial holdout, with model selection confined to its training region.`),
    p(['For implementation details, see the ', link('PCA reference', 'https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html'), ' and ', link('SVM guide', 'https://scikit-learn.org/stable/modules/svm.html'), '. The companion notebook retains the manual calculations so the final pipeline’s transformations remain inspectable.']),
  ],
};
