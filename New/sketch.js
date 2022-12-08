var canStart = false;
var screen = new Screen();
var canvas = null;
var ip = window.location.href.split("/")[2];

async function setup() {
    await screen.loadScreenResources();
    canvas = await screen.setupCanvas(1200, 900);
    await screen.setupConnection();
}

function draw() {
    if (canStart) {
        screen.draw();
        if (!screen.isSinglePlayer) {
            screen.updateInformationServer();
        }
    }
   /*  mouseClicked(); */
}

function keyPressed() {
    screen.keyPressed();
}

function keyReleased() {
    screen.keyReleased();
}

