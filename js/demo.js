// Get canvas context & DOM elements
const canvas = document.getElementById("simulation-canvas");    //画布
const ctx = canvas.getContext("2d");    //画笔

const needleLengthInput = document.getElementById("needle-length");
const gridWidthInput = document.getElementById("grid-width");
const gridHeightInput = document.getElementById("grid-height");
const trialCountInput = document.getElementById("trial-count");

const dropOneButton = document.getElementById("drop-one");
const runManyButton = document.getElementById("run-many");
const resetButton = document.getElementById("reset-demo");

const statusMessage = document.getElementById("status-message");



// Read input values
function readInputs() {
    const l = Number(needleLengthInput.value);
    const a = Number(gridWidthInput.value);
    const b = Number(gridHeightInput.value);
    const n = Number(trialCountInput.value);

    return { l, a, b, n };
}

const MARGIN = 40; //边距
const SCALE = 80; //1数学单位 = 80像素




// Draw grid


// Bind events


// Initial render

