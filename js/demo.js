/**
 * Canvas element used to render the rectangular grid and dropped needles.
 */
const canvas = document.getElementById("simulation-canvas");

/**
 * 2D rendering context for all drawing operations in the simulation.
 */
const ctx = canvas.getContext("2d");

/**
 * Input element for the needle length l in mathematical units.
 */
const needleLengthInput = document.getElementById("needle-length");

/**
 * Input element for the horizontal grid spacing a in mathematical units.
 */
const gridWidthInput = document.getElementById("grid-width");

/**
 * Input element for the vertical grid spacing b in mathematical units.
 */
const gridHeightInput = document.getElementById("grid-height");

/**
 * Input element for the number of Monte Carlo trials to run in batch mode.
 */
const trialCountInput = document.getElementById("trial-count");

/**
 * Button that drops exactly one random needle.
 */
const dropOneButton = document.getElementById("drop-one");

/**
 * Button that runs a batch of N random trials.
 */
const runManyButton = document.getElementById("run-many");

/**
 * Button that clears the canvas and resets all accumulated statistics.
 */
const resetButton = document.getElementById("reset-demo");

/**
 * Text element used to communicate validation errors and simulation status.
 */
const statusMessage = document.getElementById("status-message");

/**
 * Output element showing the cumulative number of simulated trials.
 */
const totalTrialsOutput = document.getElementById("total-trials");

/**
 * Output element showing the cumulative number of hit events.
 */
const totalHitsOutput = document.getElementById("total-hits");

/**
 * Output element showing the empirical hit probability from simulation.
 */
const empiricalProbabilityOutput = document.getElementById("empirical-probability");

/**
 * Output element showing the theoretical Buffon-Laplace probability.
 */
const theoreticalProbabilityOutput = document.getElementById("theoretical-probability");

/**
 * Output element showing the absolute error between empirical and theoretical probabilities.
 */
const probabilityErrorOutput = document.getElementById("probability-error");

/**
 * Output element describing whether the latest needle was a hit or a miss.
 */
const lastResultOutput = document.getElementById("last-result");

/**
 * Empty margin around the visible grid so the drawing is not flush with the canvas edge.
 */
const MARGIN = 40;

/**
 * Pixel-to-mathematical scaling factor used by both rendering and hit detection.
 */
const SCALE = 80;

/**
 * CSS color used for grid lines.
 */
const GRID_COLOR = getComputedStyle(document.documentElement)
    .getPropertyValue("--grid-line")
    .trim();

/**
 * CSS color used for needles that intersect at least one grid line.
 */
const HIT_COLOR = getComputedStyle(document.documentElement)
    .getPropertyValue("--needle-hit")
    .trim();

/**
 * CSS color used for needles that do not intersect any grid line.
 */
const MISS_COLOR = getComputedStyle(document.documentElement)
    .getPropertyValue("--needle-miss")
    .trim();

/**
 * Cumulative simulation state for the currently active parameter set.
 */
const state = {
    totalTrials: 0,
    totalHits: 0,
    lastHit: null
};

/**
 * Reads the current UI inputs and converts them to numeric values.
 *
 * @returns {{l: number, a: number, b: number, n: number}} Current parameter values.
 */
function readInputs() {
    return {
        l: Number(needleLengthInput.value),
        a: Number(gridWidthInput.value),
        b: Number(gridHeightInput.value),
        n: Number(trialCountInput.value)
    };
}

/**
 * Validates the current simulation parameters before rendering or running trials.
 *
 * @param {{l: number, a: number, b: number, n: number}} inputs - Parsed numeric inputs from the control panel.
 * @returns {{valid: boolean, message: string, normalizedN: number}} Validation result and normalized trial count.
 */
function validateInputs(inputs) {
    const { l, a, b, n } = inputs;

    if (![l, a, b, n].every(Number.isFinite)) {
        return { valid: false, message: "All inputs must be finite numbers.", normalizedN: 0 };
    }

    if (l <= 0 || a <= 0 || b <= 0) {
        return { valid: false, message: "Needle length and grid spacings must be greater than 0.", normalizedN: 0 };
    }

    if (n < 1) {
        return { valid: false, message: "Number of trials N must be at least 1.", normalizedN: 0 };
    }

    const normalizedN = Math.max(1, Math.floor(n));
    return { valid: true, message: "", normalizedN };
}

/**
 * Computes the visible grid geometry so sampling, hit detection, and rendering use the same domain.
 *
 * @param {number} a - Horizontal grid spacing in mathematical units.
 * @param {number} b - Vertical grid spacing in mathematical units.
 * @returns {{originX: number, originY: number, widthPx: number, heightPx: number, cols: number, rows: number}} Grid geometry in canvas pixels.
 */
function getGridMetrics(a, b) {
    const drawableWidth = canvas.width - 2 * MARGIN;
    const drawableHeight = canvas.height - 2 * MARGIN;

    const cols = Math.max(1, Math.floor(drawableWidth / (a * SCALE)));
    const rows = Math.max(1, Math.floor(drawableHeight / (b * SCALE)));

    const widthPx = cols * a * SCALE;
    const heightPx = rows * b * SCALE;

    const originX = (canvas.width - widthPx) / 2;
    const originY = (canvas.height - heightPx) / 2;

    return { originX, originY, widthPx, heightPx, cols, rows };
}

/**
 * Clears the entire canvas before the grid and needles are redrawn.
 *
 * @returns {void} No return value.
 */
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws the rectangular lattice used in the Buffon-Laplace experiment.
 *
 * @param {number} a - Horizontal grid spacing in mathematical units.
 * @param {number} b - Vertical grid spacing in mathematical units.
 * @returns {void} No return value.
 */
function drawGrid(a, b) {
    const metrics = getGridMetrics(a, b);

    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;

    for (let i = 0; i <= metrics.cols; i += 1) {
        const x = metrics.originX + i * a * SCALE;
        ctx.beginPath();
        ctx.moveTo(x, metrics.originY);
        ctx.lineTo(x, metrics.originY + metrics.heightPx);
        ctx.stroke();
    }

    for (let j = 0; j <= metrics.rows; j += 1) {
        const y = metrics.originY + j * b * SCALE;
        ctx.beginPath();
        ctx.moveTo(metrics.originX, y);
        ctx.lineTo(metrics.originX + metrics.widthPx, y);
        ctx.stroke();
    }
}

/**
 * Resets the canvas to an empty state and redraws the current grid.
 *
 * @param {number} a - Horizontal grid spacing in mathematical units.
 * @param {number} b - Vertical grid spacing in mathematical units.
 * @returns {void} No return value.
 */
function redrawScene(a, b) {
    clearCanvas();
    drawGrid(a, b);
}

/**
 * Generates one random needle center and orientation uniformly inside the visible grid domain.
 *
 * @param {number} l - Needle length in mathematical units.
 * @param {{originX: number, originY: number, widthPx: number, heightPx: number}} metrics - Current visible grid geometry.
 * @returns {{x: number, y: number, theta: number, l: number}} Random needle represented in mixed canvas/mathematical form.
 */
function generateRandomNeedle(l, metrics) {
    const x = metrics.originX + Math.random() * metrics.widthPx;
    const y = metrics.originY + Math.random() * metrics.heightPx;
    const theta = Math.random() * Math.PI;

    return { x, y, theta, l };
}

/**
 * Computes needle endpoints in canvas coordinates for drawing.
 *
 * @param {{x: number, y: number, theta: number, l: number}} needle - Needle center, orientation, and length.
 * @returns {{x1: number, y1: number, x2: number, y2: number}} Segment endpoints in canvas pixels.
 */
function getEndpoints(needle) {
    const { x, y, theta, l } = needle;
    const halfLengthPx = (l * SCALE) / 2;

    const dx = halfLengthPx * Math.cos(theta);
    const dy = halfLengthPx * Math.sin(theta);

    return {
        x1: x - dx,
        y1: y - dy,
        x2: x + dx,
        y2: y + dy
    };
}

/**
 * Determines whether a needle intersects any vertical or horizontal grid line.
 *
 * @param {{x: number, y: number, theta: number, l: number}} needle - Needle center, orientation, and length.
 * @param {number} a - Horizontal grid spacing in mathematical units.
 * @param {number} b - Vertical grid spacing in mathematical units.
 * @returns {boolean} True if the needle intersects at least one grid line; otherwise false.
 */
function checkHit(needle, a, b) {
    const metrics = getGridMetrics(a, b);

    /**
     * Convert the canvas center point back to mathematical coordinates measured from the grid origin.
     * The canvas y-axis points downward, but that does not affect hit detection because only interval overlap matters.
     */
    const centerX = (needle.x - metrics.originX) / SCALE;
    const centerY = (needle.y - metrics.originY) / SCALE;

    /**
     * The endpoint projections in mathematical coordinates define the x-interval and y-interval covered by the needle.
     * A hit occurs when either interval crosses at least one lattice boundary.
     */
    const halfX = (needle.l / 2) * Math.cos(needle.theta);
    const halfY = (needle.l / 2) * Math.sin(needle.theta);

    const minX = Math.min(centerX - halfX, centerX + halfX);
    const maxX = Math.max(centerX - halfX, centerX + halfX);
    const minY = Math.min(centerY - halfY, centerY + halfY);
    const maxY = Math.max(centerY - halfY, centerY + halfY);

    const hitVertical = Math.floor(minX / a) !== Math.floor(maxX / a);
    const hitHorizontal = Math.floor(minY / b) !== Math.floor(maxY / b);

    return hitVertical || hitHorizontal;
}

/**
 * Draws one needle using a different color for hits and misses.
 *
 * @param {{x: number, y: number, theta: number, l: number}} needle - Needle center, orientation, and length.
 * @param {boolean} isHit - Whether the needle intersects at least one grid line.
 * @returns {void} No return value.
 */
function drawNeedle(needle, isHit) {
    const { x1, y1, x2, y2 } = getEndpoints(needle);

    ctx.strokeStyle = isHit ? HIT_COLOR : MISS_COLOR;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

/**
 * Computes the Buffon-Laplace theoretical hit probability when the classical formula is applicable.
 *
 * @param {number} l - Needle length in mathematical units.
 * @param {number} a - Horizontal grid spacing in mathematical units.
 * @param {number} b - Vertical grid spacing in mathematical units.
 * @returns {number|null} Theoretical probability, or null when l > min(a, b) so the standard formula does not apply.
 */
function theoreticalProbability(l, a, b) {
    if (l > Math.min(a, b)) {
        return null;
    }

    return (2 * l * (a + b) - l * l) / (Math.PI * a * b);
}

/**
 * Computes the empirical hit probability from the current cumulative state.
 *
 * @param {number} totalTrials - Number of completed trials.
 * @param {number} totalHits - Number of hit events.
 * @returns {number} Empirical probability, or 0 when no trials have been run.
 */
function empiricalProbability(totalTrials, totalHits) {
    if (totalTrials === 0) {
        return 0;
    }

    return totalHits / totalTrials;
}

/**
 * Updates the statistics panel so the UI matches the current simulation state.
 *
 * @param {{l: number, a: number, b: number}} inputs - Current simulation parameters.
 * @returns {void} No return value.
 */
function updateStats(inputs) {
    const theory = theoreticalProbability(inputs.l, inputs.a, inputs.b);
    const empirical = empiricalProbability(state.totalTrials, state.totalHits);

    totalTrialsOutput.textContent = String(state.totalTrials);
    totalHitsOutput.textContent = String(state.totalHits);
    empiricalProbabilityOutput.textContent = empirical.toFixed(4);

    if (theory === null) {
        theoreticalProbabilityOutput.textContent = "N/A";
        probabilityErrorOutput.textContent = "N/A";
    } else {
        theoreticalProbabilityOutput.textContent = theory.toFixed(4);
        probabilityErrorOutput.textContent = Math.abs(empirical - theory).toFixed(4);
    }

    if (state.lastHit === null) {
        lastResultOutput.textContent = "No trial yet";
    } else {
        lastResultOutput.textContent = state.lastHit ? "Hit" : "Miss";
    }
}

/**
 * Resets the cumulative counters for the active parameter set.
 *
 * @returns {void} No return value.
 */
function resetState() {
    state.totalTrials = 0;
    state.totalHits = 0;
    state.lastHit = null;
}

/**
 * Updates the status message with either a validation error or contextual theory guidance.
 *
 * @param {{l: number, a: number, b: number}} inputs - Current simulation parameters.
 * @param {string} overrideMessage - Optional explicit status message to display.
 * @returns {void} No return value.
 */
function updateStatus(inputs, overrideMessage) {
    if (overrideMessage) {
        statusMessage.textContent = overrideMessage;
        return;
    }

    if (inputs.l > Math.min(inputs.a, inputs.b)) {
        statusMessage.textContent = "Simulation runs normally, but the classical formula is only valid when l ≤ min(a, b).";
        return;
    }

    statusMessage.textContent = "Parameters are valid. Run the simulation to compare empirical and theoretical probabilities.";
}

/**
 * Executes one Monte Carlo trial, draws the needle, and updates cumulative statistics.
 *
 * @param {{l: number, a: number, b: number}} inputs - Current simulation parameters.
 * @returns {boolean} True if the generated needle is a hit; otherwise false.
 */
function runSingleTrial(inputs) {
    const metrics = getGridMetrics(inputs.a, inputs.b);
    const needle = generateRandomNeedle(inputs.l, metrics);
    const isHit = checkHit(needle, inputs.a, inputs.b);

    drawNeedle(needle, isHit);

    state.totalTrials += 1;
    state.totalHits += isHit ? 1 : 0;
    state.lastHit = isHit;

    return isHit;
}

/**
 * Drops one needle using the current UI parameters.
 *
 * @param {Event} event - Click event from the "Drop One Needle" button.
 * @returns {void} No return value.
 */
function dropOne(event) {
    void event;

    const inputs = readInputs();
    const validation = validateInputs(inputs);

    if (!validation.valid) {
        updateStatus(inputs, validation.message);
        return;
    }

    runSingleTrial(inputs);
    updateStats(inputs);
    updateStatus(inputs, state.lastHit ? "Last trial: hit." : "Last trial: miss.");
}

/**
 * Runs N Monte Carlo trials in one batch and updates the UI once at the end.
 *
 * @param {Event} event - Click event from the "Run N times" button.
 * @returns {void} No return value.
 */
function runMany(event) {
    void event;

    const inputs = readInputs();
    const validation = validateInputs(inputs);

    if (!validation.valid) {
        updateStatus(inputs, validation.message);
        return;
    }

    const batchSize = validation.normalizedN;
    let batchHits = 0;

    for (let i = 0; i < batchSize; i += 1) {
        batchHits += runSingleTrial(inputs) ? 1 : 0;
    }

    updateStats(inputs);
    updateStatus(inputs, `Completed ${batchSize} trials. Batch hits: ${batchHits}.`);
}

/**
 * Clears the scene and resets the simulation for the current parameter set.
 *
 * @param {Event} event - Click event from the reset button, or undefined when reset is triggered programmatically.
 * @returns {void} No return value.
 */
function resetSimulation(event) {
    void event;

    const inputs = readInputs();
    const validation = validateInputs(inputs);

    resetState();

    if (validation.valid) {
        redrawScene(inputs.a, inputs.b);
        updateStats(inputs);
        updateStatus(inputs, "");
        return;
    }

    clearCanvas();
    updateStats(inputs);
    updateStatus(inputs, validation.message);
}

/**
 * Handles parameter edits by clearing incompatible old statistics and redrawing the grid immediately.
 *
 * @param {Event} event - Input/change event from one of the parameter controls.
 * @returns {void} No return value.
 */
function handleParameterChange(event) {
    void event;
    resetSimulation();
}

/**
 * Initializes the demo UI, draws the first grid, and attaches all event listeners.
 *
 * @returns {void} No return value.
 */
function init() {
    dropOneButton.addEventListener("click", dropOne);
    runManyButton.addEventListener("click", runMany);
    resetButton.addEventListener("click", resetSimulation);

    needleLengthInput.addEventListener("change", handleParameterChange);
    gridWidthInput.addEventListener("change", handleParameterChange);
    gridHeightInput.addEventListener("change", handleParameterChange);
    trialCountInput.addEventListener("change", handleParameterChange);

    resetSimulation();
}

init();
