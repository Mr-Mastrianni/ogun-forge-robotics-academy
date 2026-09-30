import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w6l11',
  number: 11,
  week: 6,
  track: 'ai',
  title: 'AI, Perception and State Estimation',
  subtitle: 'From pixels to a belief about the world, with honest uncertainty',
  duration: 85,
  difficulty: 'master',
  xp: 220,
  hook: 'A camera gives you pixels, a GNSS gives you a noisy guess, and neither tells you where the robot is. Estimation turns measurements into belief, and belief is what a controller can use.',
  objectives: [
    'Diagnose overfitting and underfitting and split data without leakage.',
    'Explain convolution arithmetic, receptive field and the anchor vs anchor-free detector trade.',
    'Derive the Kalman predict and update steps and read the gain as a trust ratio.',
    'Tell EKF, UKF, histogram and particle filters apart by representation and assumption.',
    'Fuse IMU, wheel, GNSS, LiDAR and camera into one pose inside a SLAM or VIO stack.',
  ],
  blocks: [
    { kind: 'prose', heading: 'Learning is compression with error bars',
      body: 'Supervised learning fits $f_\\theta: x \\to y$ by minimising a loss: cross-entropy for classes, L2 or GIoU for boxes, per-pixel cross-entropy for masks. Split **before** you touch the model into train (fit), validation (tune), test (report once). Split by scene, site or day, never by frame: 60 % of the frames from one corridor leak the answer and your test score is fiction.\n\n' +
        '**Bias** is error from a model too rigid for the data — a line through a curve. **Variance** is error from a model that memorises noise — 0.5 % train error and 18 % test error. Total error is bias² + variance + irreducible noise. Fix high bias with capacity or better features; fix high variance with more data, augmentation, weight decay, dropout and early stopping. Augmentation (flip, crop, colour jitter, blur, plus rain and glare layers) buys invariance before the robot meets it.\n\n' +
        '**Transfer learning** is the practitioner\'s default: fine-tune an ImageNet backbone. At 2,000 labelled frames, freezing the early layers and training the head at 10× the backbone learning rate typically buys 5-15 mAP over training from scratch, because edges and textures transfer and only the last decisions do not.' },
    { kind: 'prose', heading: 'From pixels to semantics',
      body: 'Classical vision is still the reliable part. **Otsu thresholding** separates retroreflective tape from a floor in 0.1 ms. **Canny** is Gaussian blur, Sobel gradients, non-maximum suppression, then hysteresis with two thresholds (50/150) so a weak edge survives only when it joins a strong one. **Hough** votes edge pixels into a $(\\rho,\\theta)$ accumulator to fit lines and circles. **SIFT** gives 128-D descriptors from difference-of-Gaussians extrema, scale- and rotation-invariant; **ORB** is a 256-bit binary BRIEF on FAST corners, 10-100× faster but not scale-invariant without a pyramid. **RANSAC** samples the minimum set and counts inliers: for a homography $s=4$ against 30 % outliers, $0.7^4=0.24$ success per sample, so 12 iterations give a 96 % chance of one clean set. **Lucas-Kanade** assumes brightness constancy and small motion, solving $I_xu+I_yv=-I_t$ per pixel in a window and re-warping; 2-3 pyramid levels cover 2-8 px/frame. LK reports no depth, and on a flat blank wall it honestly returns zero flow.\n\n' +
        'A **convolution** shares weights across the image: one 3×3 kernel over 224×224×3 with 64 filters is 1,728 parameters, not 9.6 M. Stacking 3×3 stride-1 layers grows the **receptive field** by 2 px per layer (1, 3, 5, 7 for four layers), so a 7×7 kernel or dilation is needed to see a whole vehicle. **ResNet** adds identity skips so a 50-layer net learns a residual $F(x)+x$ instead of the full map. A **ViT** cuts the image into 16×16 patches and lets self-attention mix every patch with every other — global from layer one, but data-hungry, which is why windowed and hybrid attention dominate small datasets.\n\n' +
        'Detectors: **YOLO** regresses boxes and classes in one pass. Anchored heads tile 3 scales × 3 aspect ratios; anchor-free heads (FCOS, CenterNet, YOLOv8+) predict a centre or distances to the edges and delete the anchor tuning. **NMS** sorts by score and removes boxes with IoU > 0.5 against a kept box. **mAP** is mean average precision at IoU 0.50:0.95 in 0.05 steps; a good YOLOv8-m reaches ~50 % COCO mAP, not 90 %. **U-Net** couples an encoder to a skip-connected decoder for dense masks; **Mask R-CNN** adds a mask branch to Faster R-CNN at ~5 FPS on a V100; **SAM** (ViT-H, 636 M parameters, 2.4 GB fp16) segments class-agnostically from a point prompt but needs a GPU, so on a 15 W Jetson Orin NX you distill it or run MobileSAM. **INT8** quantisation with per-channel scales costs about 1 % accuracy for 2-4× throughput; structured 50 % **pruning** removes whole channels; **distillation** trains a small student on a teacher\'s soft logits. Ship through **ONNX**, then **TensorRT** on Jetson, **OpenVINO** on Intel, **TFLite** on Cortex-A. Count joules, not FLOPs: YOLOv8-s INT8 at ~120 FPS draws ~15 W (~0.125 J/frame); a 480 MHz Cortex-M7 spends ~200 ms and ~0.1 J on a 96×96 patch.' },
    { kind: 'formula', title: 'Bayes filter: predict, then correct',
      tex: 'bel(x_t) = \\eta\\, p(z_t \\mid x_t) \\int p(x_t \\mid x_{t-1}, u_t)\\, bel(x_{t-1})\\, dx_{t-1}',
      explain: 'The motion model spreads belief forward; the measurement likelihood reweights each hypothesis; η normalises the sum to one. Kalman, histogram and particle filters are three representations of the same recursion — a Gaussian, a grid over cells, and a cloud of samples.' },
    { kind: 'formula', title: 'Kalman filter: predict and update',
      tex: '\\hat{x}_t^- = A\\hat{x}_{t-1} + Bu_t,\\quad P_t^- = AP_{t-1}A^\\top + Q \\\\ K_t = P_t^-H^\\top (HP_t^-H^\\top + R)^{-1},\\quad \\hat{x}_t = \\hat{x}_t^- + K_t(z_t - H\\hat{x}_t^-),\\quad P_t = (I - K_tH)P_t^-',
      explain: 'Predict moves the mean and inflates covariance by process noise Q. Update forms the gain K = predicted uncertainty / (predicted + measurement uncertainty): K→1 trusts the sensor, K→0 trusts the model. It is optimal only for linear models with Gaussian noise, so the **EKF** linearises f and h with Jacobians at the current mean and can diverge on strong nonlinearity. The **UKF** instead pushes 2n+1 sigma points through the true nonlinearity and recovers mean and covariance — 31 points for a 15-state system, no Jacobians.' },
    { kind: 'formula', title: 'CNN output size and receptive field',
      tex: 'W_{out} = \\left\\lfloor \\frac{W_{in} - K + 2P}{S} \\right\\rfloor + 1, \\qquad r_L = r_0 + 2L',
      explain: 'A 224 px input with a 7×7 kernel, padding 3 and stride 2 gives floor(224-7+6)/2+1 = 112. A stack of L stride-1 3×3 layers has receptive field 1+2L pixels, which is how you decide depth versus input resolution for a 150 px pedestrian at 20 m.' },
    { kind: 'chart', title: 'Position error over a 120 s GNSS-degraded traverse',
      caption: 'RMS horizontal error. 1 Hz standalone GNSS at 2 m 1σ, 50 Hz wheel odometry plus MEMS IMU, and the same sensors fused in a 15-state error-state EKF with GNSS updates.',
      chartType: 'line', xLabel: 'Time (s)', yLabel: 'Position error (m RMS)',
      x: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
      series: [
        { key: 'imu', label: 'IMU + wheel dead reckoning', color: '#ef4444', data: [0.02, 0.18, 0.70, 1.58, 2.80, 4.38, 6.30, 8.58, 11.20, 14.18, 17.50, 21.18, 25.20] },
        { key: 'gnss', label: 'Raw GNSS', color: '#f59e0b', data: [2.4, 1.8, 3.1, 2.2, 1.5, 2.9, 3.6, 2.0, 1.7, 2.6, 3.3, 2.1, 2.8] },
        { key: 'fused', label: 'Fused (EKF)', color: '#22c55e', data: [0.50, 0.34, 0.29, 0.27, 0.39, 0.31, 0.26, 0.30, 0.37, 0.28, 0.25, 0.32, 0.31] },
      ] },
    { kind: 'table', title: 'State-estimation methods: cost against assumptions',
      caption: 'Cost is per update on a 1 GHz ARM core unless stated. Every row fails for a reason you can predict from its assumption.',
      columns: ['Method', 'State', 'Update cost', 'Core assumption', 'Fails when'],
      rows: [
        ['Histogram filter', 'Discretised (x, y, θ)', '10⁵ bins × motion shifts, ~10 ms', 'Markov motion; state fits a coarse grid', 'Grid too fine, or more than 3 state dimensions'],
        ['Occupancy grid', 'Per-cell occupancy probability', '400 cells/m² at 0.05 m; 4 MB per 100 m²', 'Cells independent; world static', 'Crowds, glass, specular LiDAR returns'],
        ['EKF', 'Gaussian over n states', 'O(n³); a 15-state update is ~3 k FLOPs', 'Linear f and h, Gaussian noise, unimodal belief', 'Strong nonlinearity or multi-modal hypotheses'],
        ['UKF', 'Same n, sigma points', '2n+1 propagations, O(n³)', 'Gaussian belief, nonlinear but smooth', 'Discontinuous models; n above ~50'],
        ['Particle filter', 'Any belief, N samples', 'N=1,000 × 3 states at 30 Hz on CPU', 'Enough samples sit near the truth', 'Degeneracy: ESS < N/2 and no resampling'],
        ['EKF-SLAM', 'Robot pose + N landmarks', 'O(N²) covariance, 4 MB at N=1,000', 'Landmarks static; data association known', 'False loop closures; N beyond a few hundred'],
        ['Graph SLAM / pose graph', 'Poses + loop constraints', 'Sparse Cholesky, seconds for 10⁴ poses', 'Good initial guess; robust kernel on outliers', 'One wrong loop closure with no robust cost'],
        ['AMCL', 'Pose on a known occupancy grid', '500-5,000 particles, 30 Hz on CPU', 'Map is given and static; 2-D LiDAR', 'Map changed, or true 6-DoF motion'],
        ['VIO: MSCKF, VINS-Mono, ORB-SLAM3', 'Sliding window of 10-20 keyframes', 'Bundle adjustment, 10-50 ms/frame on ARM', 'Geometric/photometric consistency, enough texture', 'Rolling shutter, blank walls, fast-rotation blur'],
      ] },
    { kind: 'code', title: '2-D constant-velocity Kalman filter in Python', language: 'python',
      note: 'State [x, y, vx, vy], position-only measurement. 50 Hz prediction, 1 Hz GNSS update. Q is the discrete white-noise acceleration model for the stated q.',
      code: `import numpy as np

dt, q, r = 0.02, 0.5, 4.0              # s, accel PSD (m/s^2)^2, GNSS var m^2
F = np.array([[1, 0, dt, 0], [0, 1, 0, dt], [0, 0, 1, 0], [0, 0, 0, 1]], float)
Q = q * np.array([[dt**4/4, 0, dt**3/2, 0], [0, dt**4/4, 0, dt**3/2],
                  [dt**3/2, 0, dt**2, 0], [0, dt**3/2, 0, dt**2]])
H = np.array([[1, 0, 0, 0], [0, 1, 0, 0]], float)
R = r * np.eye(2)
I = np.eye(4)

def predict(x, P):
    return F @ x, F @ P @ F.T + Q

def update(x, P, z):
    S = H @ P @ H.T + R
    K = P @ H.T @ np.linalg.inv(S)     # gain = predicted / (predicted + measured)
    x = x + K @ (z - H @ x)            # innovation z - Hx
    return x, (I - K @ H) @ P

x, P = np.zeros(4), np.eye(4) * 100.0  # uninformative prior
for z in gnss_fixes:                   # each fix arrives after 50 predicts
    x, P = predict(x, P)
    x, P = update(x, P, z)` },
    { kind: 'steps', title: 'From wheel ticks to a map',
      steps: [
        { title: 'Synchronise time', detail: 'Camera 30 Hz, IMU 200 Hz, LiDAR 10 Hz, GNSS 1 Hz. Stamp at exposure, not on arrival, and discipline clocks with PTP/gPTP or a hardware trigger; 10 ms of offset at 15 m/s is 15 cm of smeared map.' },
        { title: 'Calibrate hand and eye', detail: 'Solve AX = XB over 15-20 varied arm poses to get camera-to-tool; accept the result only when mean reprojection error is under 0.5 px.' },
        { title: 'Fuse proprioception', detail: 'Wheel encoders at 50-200 Hz give planar velocity with slip; a MEMS IMU gives 200 Hz angular rate and acceleration with bias drift. Preintegrate IMU between keyframes in a 15-state error-state EKF.' },
        { title: 'Fold in absolute fixes', detail: 'Standalone GNSS is 2-5 m CEP at 1 Hz; RTK reaches 2 cm with a base station and a fixed integer ambiguity. Treat it as a low-rate measurement, not a replacement for odometry.' },
        { title: 'Run visual-inertial odometry', detail: 'ORB-SLAM3 and VINS-Mono track features, triangulate them, and optimise a 10-20 keyframe window with bundle adjustment on reprojection error; MSCKF marginalises old clones instead to hold cost down.' },
        { title: 'Close loops and optimise the graph', detail: 'Recognise a revisited place, add a pose-pose constraint, then minimise the pose graph with sparse Cholesky and a robust kernel so one bad match cannot bend the map.' },
        { title: 'Localise in the finished map', detail: 'AMCL spreads 500-5,000 particles over a known occupancy grid, moves them through the odometry model, weights them by the LiDAR scan, and resamples; NDT or ICP does the 3-D equivalent.' },
      ] },
    { kind: 'callout', tone: 'warning', title: 'The domain shift is the deployment',
      body: 'A detector that scores 50 mAP indoors can drop under 15 mAP in rain at dusk: lighting swings from 100,000 lux in sun to 50 lux under cloud, spray scatters LiDAR returns, wet asphalt mirrors them, and moving people violate every static-world assumption in the grid. Retrain with the camera, weather and site you will actually run — then monitor for silent drift, because a 99 % test mAP is a statement about your test set, not a success rate on the robot. Keep the classical fallback alive: a Hough line or an AprilTag still works when the network is unsure.' },
    { kind: 'lab', labId: 'kalman', title: 'Tune a filter until belief matches truth',
      brief: 'Drive a simulated robot through GNSS dropouts and watch the covariance ellipse breathe as you change Q and R.',
      tasks: ['Fuse 1 Hz noisy GNSS with IMU and hold position error under 0.5 m RMS over 120 s and one 20 s outage.', 'Set R 100× too small, log the estimate going jumpy, then set Q 100× too small and log it lagging a turn.', 'Compare EKF against a 1,000-particle filter through a symmetric corridor where the belief is genuinely two-peaked.'] },
    { kind: 'lab', labId: 'vision-grid', title: 'See what the pixels actually contain',
      brief: 'Drag thresholds and kernels over a real camera frame and watch features, lines and flow appear or vanish.',
      tasks: ['Tune Canny hysteresis until the lane edges survive while the floor texture does not, and record both thresholds.', 'Detect ORB keypoints on a low-texture wall, then on a textured one, and count inliers RANSAC needs to keep a stable homography.', 'Run Lucas-Kanade flow while panning the camera fast and find the speed where the small-motion assumption visibly breaks.'] },
  ],
  keyTerms: [
    { term: 'Bias-variance tradeoff', definition: 'Total error = bias² + variance + noise. High bias underfits with a rigid model; high variance overfits with a memorising one.' },
    { term: 'RANSAC', definition: 'Random sample consensus: fit from a minimal sample, count inliers within a threshold, repeat, keep the best-supported model.' },
    { term: 'Non-maximum suppression', definition: 'Sort detections by score and delete any box whose IoU with a kept box exceeds a threshold, typically 0.5.' },
    { term: 'mAP', definition: 'Mean average precision over classes and IoU thresholds, usually 0.50:0.95 in 0.05 steps for COCO.' },
    { term: 'Bayes filter', definition: 'Recursive belief update: predict with the motion model, correct with the measurement likelihood, normalise.' },
    { term: 'Extended Kalman filter', definition: 'Kalman filter on a first-order linearisation of f and h via Jacobians; fast, but can diverge on strong nonlinearity.' },
    { term: 'Particle degeneracy', definition: 'The weight collapse where one sample carries nearly all mass; measured by effective sample size and cured by resampling.' },
    { term: 'Loop closure', definition: 'Recognising a revisited place and adding a constraint that removes accumulated drift when the pose graph is optimised.' },
  ],
  quiz: [
    { id: 'w6l11q1', question: 'A model scores 0.5 % error on training data and 18 % on unseen data. This is...',
      choices: ['High bias, so add capacity', 'High variance, so add data and regularisation', 'Irreducible label noise only', 'A learning-rate problem'], answer: 1, level: 'recall',
      explanation: 'A large train-test gap is variance: the model memorised the training set. High bias shows as poor error on both.' },
    { id: 'w6l11q2', question: 'Why split image datasets by scene or recording day rather than by frame?',
      choices: ['Frames from one scene leak near-duplicates into test and inflate the score', 'It reduces training time', 'ONNX requires scene-level splits', 'Frame splits break class balance'], answer: 0, level: 'understand',
      explanation: 'Adjacent frames differ by a few pixels, so a frame split puts near-copies of training images in the test set and reports optimism, not accuracy.' },
    { id: 'w6l11q3', question: 'A 224×224 input meets a 7×7 convolution, stride 2, padding 3. What is the output spatial size?',
      choices: ['56', '110', '112', '224'], answer: 2, level: 'apply',
      explanation: 'floor((224 - 7 + 6)/2) + 1 = floor(223/2) + 1 = 111 + 1 = 112.' },
    { id: 'w6l11q4', question: 'A 1,000-particle filter collapses onto one particle after 8 s. What is the first correct fix?',
      choices: ['Add process noise until every particle survives', 'Resample when effective sample size falls below N/2', 'Switch to a Kalman filter even though the belief is multi-modal', 'Cut to 100 particles to reduce variance'], answer: 1, level: 'analyze',
      explanation: 'Degeneracy means weight mass concentrated on few samples; resampling when ESS drops redistributes particles onto the high-weight region.' },
    { id: 'w6l11q5', question: 'A warehouse AMR has a 2-D LiDAR and a trusted 0.05 m occupancy grid of the aisles. Which estimator fits?',
      choices: ['EKF-SLAM over 5,000 landmarks', 'Pose-graph optimisation built from scratch each shift', 'A 16-state UKF fused with GNSS', 'AMCL: a particle filter in the known occupancy grid'], answer: 3, level: 'design',
      explanation: 'Mapping is already solved and the state is 3-DoF, so localisation in a known map with a particle filter is the cheapest correct choice.' },
    { id: 'w6l11q6', question: 'Predicted position variance is 0.25 m² and the LiDAR measurement variance is 9 m². What does the Kalman gain tell you?',
      choices: ['The filter should reject the LiDAR', 'The gain is about 0.03, so the estimate moves 3 % toward the measurement', 'The gain is about 0.97, so trust the measurement', 'The filter is diverging'], answer: 1, level: 'apply',
      explanation: 'K = 0.25/(0.25 + 9) ≈ 0.027: the model is far more certain than the sensor, so the update barely moves the state.' },
    { id: 'w6l11q7', question: 'What does non-maximum suppression do in a one-stage detector?',
      choices: ['It merges duplicate detections by removing boxes that overlap a higher-scoring kept box', 'It raises recall by keeping every box above threshold', 'It converts anchored predictions into anchor-free ones', 'It normalises box coordinates to [0, 1]'], answer: 0, level: 'understand',
      explanation: 'One object produces many overlapping proposals; NMS keeps the best and suppresses neighbours with IoU above the threshold.' },
  ],
  flashcards: [
    { front: 'Bias vs variance', back: 'Bias: too rigid, fails on train and test. Variance: memorises noise, tiny train error and large test error.', tag: 'ml-core' },
    { front: 'Leakage-free split', back: 'Split by scene, site or day; a frame-level split puts near-duplicate images in the test set.', tag: 'ml-core' },
    { front: 'Canny hysteresis', back: 'Two thresholds: strong edges seed, weak edges survive only when connected to a strong one (e.g. 50/150).', tag: 'vision' },
    { front: 'ORB vs SIFT', back: 'ORB: 256-bit BRIEF on FAST corners, 10-100× faster, needs a pyramid for scale. SIFT: 128-D DoG, scale- and rotation-invariant, slower.', tag: 'vision' },
    { front: 'RANSAC', back: 'Minimal sample, count inliers, repeat. Homography needs s=4; 12 iterations beat 30 % outliers with 96 % confidence.', tag: 'vision' },
    { front: 'Kalman gain', back: 'K = predicted / (predicted + measured). K near 1 trusts the sensor, K near 0 trusts the model.', tag: 'estimation' },
    { front: 'EKF vs UKF', back: 'EKF linearises with Jacobians at the mean; UKF propagates 2n+1 sigma points through the true nonlinearity with no Jacobians.', tag: 'estimation' },
    { front: 'Particle degeneracy', back: 'Weight collapse onto few samples; watch effective sample size and resample below N/2.', tag: 'estimation' },
    { front: 'Loop closure', back: 'A recognised revisit adds a constraint that removes drift when the pose graph or bundle adjustment is re-optimised.', tag: 'slam' },
  ],
  forgePrompts: [
    'Build a 1/10-scale rover that fuses a $20 GNSS module with a phone IMU and logs fused versus raw error for one hour.',
    'Train a 96×96 INT8 lane detector with TFLite Micro on a Cortex-M7 and measure joules per frame against a Jetson Orin NX.',
    'Recreate ORB-SLAM3 loop closure in a corridor with AprilTags and show the pose-graph error before and after the closure.',
  ],
};
