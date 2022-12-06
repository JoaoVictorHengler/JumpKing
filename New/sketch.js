
var screen = new Screen();
let previousFrameRate = 60;
async function setup() {
    await screen.loadScreenResources();
    await screen.setupCanvas(1200, 950);
    await screen.createPlayer();
    await screen.createPopulation();
    await screen.setupLevels();
    await screen.playSounds();
}

function draw() {
    screen.draw();
}

function keyPressed() {
    screen.keyPressed();
}

function keyReleased() {
    screen.keyReleased();
}
