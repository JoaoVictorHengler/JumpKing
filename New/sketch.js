
var screen = new Screen();
var canvas = null;
let previousFrameRate = 60;
async function setup() {
    await screen.loadScreenResources();
    canvas = await screen.setupCanvas(1200, 950);
    await screen.setupLevels();
    await screen.createPlayer();
    await screen.createPopulation();
    await screen.player.ResetPlayer(screen.width, screen.height); 

    await screen.setPlayModeSounds();
}

function draw() {
    screen.draw();
   /*  mouseClicked(); */
}

function keyPressed() {
    screen.keyPressed(key);
}

function keyReleased() {
    screen.keyReleased(key, keyCode);
}


/* let mousePos1 = null;
let mousePos2 = null; */
function mouseClicked() {

    let snappedX = mouseX - mouseX % 20;
    let snappedY = mouseY - mouseY % 20;
    /* if (mousePos1 == null) {
        mousePos1 = createVector(snappedX, snappedY);
    } else {
        mousePos2 = createVector(snappedX, snappedY);
        // print('tempLevel.lines.push(new Line(' + mousePos1.x + ',' + mousePos1.y + ',' + mousePos2.x + ',' + mousePos2.y + '));');
        screen.levels[0].lines.push(new Line(mousePos1.x, mousePos1.y, mousePos2.x, mousePos2.y));
        mousePos1 = null;
        mousePos2 = null;
    } */
        screen.player.currentPos = createVector(mouseX, mouseY);

}
