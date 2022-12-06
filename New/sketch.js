
var screen = new Screen();
var canvas = null;
let previousFrameRate = 60;
async function setup() {
    await screen.loadScreenResources();
    canvas = await screen.setupCanvas(1200, 950);
    await screen.setupLevels();
    await screen.createPlayer();
    await screen.createPopulation();
    
    await screen.setPlayModeSounds();
}

function draw() {
    screen.draw();
}

function keyPressed() {
    screen.keyPressed(key);
}

function keyReleased() {
    screen.keyReleased(key, keyCode);
}
