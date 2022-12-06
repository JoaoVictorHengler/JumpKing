
var screen = new Screen();
let previousFrameRate = 60;
async function setup() {
    await screen.loadScreenResources();
    await screen.setupCanvas(1200, 950);
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
