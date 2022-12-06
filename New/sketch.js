
function main() {
    let screen = new Screen();
    screen.loadScreenResources();
    screen.setupCanvas(1200, 950);
    screen.createPlayer();
    screen.createPopulation();
    screen.setupLevels();
    screen.playSounds();
}

main();