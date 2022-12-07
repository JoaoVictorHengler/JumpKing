let width = 0;
let height = 0;
let canvas = null;

let player = null;
let lines = [];
let backgroundImage = null;


let creatingLines = false;

let idleImage = null;
let squatImage = null;
let jumpImage = null;
let oofImage = null;
let run1Image = null;
let run2Image = null;
let run3Image = null;
let fallenImage = null;
let fallImage = null;
let showingLines = false;
let showingCoins = false;
let levelImages = [];

let placingPlayer = false;
let placingCoins = false;
let playerPlaced = false;

let testingSinglePlayer = true;


let fallSound = null;
let jumpSound = null;
let bumpSound = null;
let landSound = null;

let snowImage = null;


let population = null;
let levelDrawn = false;


let startingPlayerActions = 5;
let increaseActionsByAmount = 5;
let increaseActionsEveryXGenerations = 10;
let evolationSpeed = 1;
var connection = new WebSocket('ws://localhost:8000');

connection.onopen = () => {
    console.log("Conexão Feita")
}
connection.onerror = () => {
    console.log("Houve um erro com a conexão")
}

// Verificar replayingBestPlayer
// Pré-Carregamento
async function preload() {
    //'https://raw.githubusercontent.com/Ola351/Jk/main/src/images/levelImages/1.png
    backgroundImage = loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/levelImages/1.png');
    idleImage = loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/idle.png');
    squatImage = loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/squat.png');
    jumpImage = loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/jump.png');
    oofImage = loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/oof.png');
    run1Image = loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/run1.png');
    run2Image = loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/run2.png');
    run3Image = loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/run3.png');
    fallenImage = loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/fallen.png');
    fallImage = loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/fall.png');


    snowImage = loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/snow3.png');

    for (let i = 1; i <= 43; i++) {
        levelImages.push(loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/levelImages/' + i + '.png'));
    }
    jumpSound = await loadSound("https://raw.githubusercontent.com/Ola351/Jk/main/src/sounds/jump.mp3");
    fallSound = await loadSound("https://raw.githubusercontent.com/Ola351/Jk/main/src/sounds/fall.mp3");
    bumpSound = await loadSound("https://raw.githubusercontent.com/Ola351/Jk/main/src/sounds/bump.mp3");
    landSound = await loadSound("https://raw.githubusercontent.com/Ola351/Jk/main/src/sounds/land.mp3");


}

// Inicia o Canvas, Instancia o Player e cria a população as linhas dos levels
async function setup() {
    setupCanvas();
    player = new Player();
    let playerInfo = JSON.stringify({
        'type': 'appendPlayer',
        'data': {
            'x': player.currentPos.x,
            'y': player.currentPos.y,
            'level': 0,
            'state': {
                'jumpHeld': player.jumpHeld,
                'isOnGround': player.isOnGround,
                'hasFallen': player.hasFallen,
                'hasBumped': player.hasBumped,
                'currentSpeedY': player.currentSpeed.y,
                'isRunning': player.isRunning,
                'rightHeld': player.rightHeld,
                'leftHeld': player.leftHeld
            }
        }
    });

    connection.send(playerInfo)
    population = new Population(player);
    setupLevels();
    jumpSound.playMode('sustain');
    fallSound.playMode('sustain');
    bumpSound.playMode('sustain');
    landSound.playMode('sustain');
    connection.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        if (data.type == 'getMyNum') {
            console.log('Obtive o meu numero')
            player.num = data.data.playerNum;

        } else if (data.type == 'getPlayers') {
            console.log('Estou obtendo os players')
            for (let i = 0; i < data.data.players.length; i++) {
                if (data.data.players[i].numPlayer != player.num) {
                    let newPlayer = new Player();
                    newPlayer.currentPos = createVector(data.data.players[i].x, data.data.players[i].y);
                    newPlayer.num = data.data.players[i].numPlayer;
                    newPlayer.currentLevelNo = data.data.players[i].level;
                    newPlayer.isClone = true;
                    newPlayer.state = data.data.players[i].state;
                    population.players.push(newPlayer)
                }
            }


        } else if (data.type == 'updatePlayer') {
            /* console.log('Estou atualizando os players') */
            /* console.log('Server Players: ')
            console.log(data.data.players)
            console.log('Local Players: ')
            console.log(population.players) */
            for (let i = 0; i < data.data.players.length; i++) {
                let found = false;
                if (data.data.players.length > 1 && data.data.players[i].numPlayer != player.num) {
                    for (let j = 0; j < population.players.length; j++) {
                        if (data.data.players[i].numPlayer == population.players[j].num && population.players[j]) {
                            population.players[j].currentPos = createVector(data.data.players[i].x, data.data.players[i].y);
                            population.players[j].currentLevelNo = data.data.players[i].level;
                            population.players[j].state = data.data.players[i].state;
                            // 
                            
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        let newPlayer = new Player();
                        newPlayer.currentPos = createVector(data.data.players[i].x, data.data.players[i].y);
                        newPlayer.num = data.data.players[i].numPlayer;
                        newPlayer.currentLevelNo = data.data.players[i].level;
                        newPlayer.isClone = true;
                        newPlayer.state = data.data.players[i].state;
                        population.players.push(newPlayer);
                        console.log(`Jogador num: ${data.data.players[i].numPlayer} adicionado.`);
                    }
                }
            }
        }
    };


}
// Desenhar posição do mouse
function drawMousePosition() {
    let snappedX = mouseX - mouseX % 20;
    let snappedY = mouseY - mouseY % 20;
    push();


    fill(255, 0, 0)
    noStroke();
    ellipse(snappedX, snappedY, 5);

    if (mousePos1 != null) {
        stroke(255, 0, 0)
        strokeWeight(5)
        line(mousePos1.x, mousePos1.y, snappedX, snappedY)
    }

    pop();
}
// número do level
let levelNumber = 0;
// Desenhar
function draw() {
    background(10);


    // if(frameCount % 5==0 ){
    //
    //     levelNumber  = (levelNumber +1)%43;
    // }
    /* image(backgroundImage,0,0); */
    // if (!creatingLines) {

    //     if (!placingPlayer || playerPlaced) {
    //
    //         player.Update();
    //         player.Show();
    //     }
    // } else {
    //     image(levelImages[levelNumber], 0, 0)
    // }
    push()
    translate(0, 50);
    if (!player.isClone) {
        image(levels[player.currentLevelNo].levelImage, 0, 0)
        levels[player.currentLevelNo].show();
        let playerInfo = JSON.stringify({
            'type': 'updatePlayer',
            'data': {
                'numPlayer': player.num,
                'x': player.currentPos.x,
                'y': player.currentPos.y,
                'level': player.currentLevelNo,
                'state': {
                    'jumpHeld': player.jumpHeld,
                    'isOnGround': player.isOnGround,
                    'hasFallen': player.hasFallen,
                    'hasBumped': player.hasBumped,
                    'currentSpeedY': player.currentSpeed.y,
                    'isRunning': player.isRunning,
                    'rightHeld': player.rightHeld,
                    'leftHeld': player.leftHeld
                }
            }
        });

        connection.send(playerInfo)
        player.Update();
        player.Show();
        for (let i = 0; i < population.players.length; i++) {
            if (population.players[i].num != player.num && population.players[i].currentLevelNo == player.currentLevelNo) {
                /* console.log(population.players[i].currentPos); */

                population.players[i].Update();
                population.players[i].Show();
            }
        }


    } /* else if (replayingBestPlayer) {
        if (!cloneOfBestPlayer.hasFinishedInstructions) {
            for (let i = 0; i < evolationSpeed; i++) {
                cloneOfBestPlayer.Update()
            }

            showLevel(cloneOfBestPlayer.currentLevelNo);
            alreadyShowingSnow = false;
            cloneOfBestPlayer.Show();
        } else {
            replayingBestPlayer = false;
            mutePlayers = true;
        }

    } */


    if (showingLines || creatingLines)
        showLines();

    if (creatingLines)
        drawMousePosition();


    if (frameCount % 15 === 0) {
        previousFrameRate = floor(getFrameRate())
    }


    pop();

    fill(0);
    noStroke();
    rect(0, 0, width, 50);
    /* if (!player.isClone) {
        textSize(32);
        fill(255, 255, 255);
        text('FPS: ' + previousFrameRate, width - 160, 35);
        population.SetCurrentHighestPlayer()
        population.SetBestPlayer()
         console.log(player.bestLevelReached) 
         text('Moves: ' + population.players[0].brain.instructions.length, 200, 35);
        text('Best Level: ' + player.currentLevelNo, 0, 35);
        text('Best Height: ' + population.bestHeight, 400, 35);

    } */


}

let previousFrameRate = 60;
// Mostrar Level
function showLevel(levelNumberToShow) {
    // print(levelNumberToShow)
    // image(levels[levelNumberToShow].levelImage, 0, 0)
    levels[levelNumberToShow].show();
}
// Mostrar Linhas
function showLines() {
    if (creatingLines) {
        for (let l of lines) {
            l.Show();
        }
    } else {

        for (let l of levels[player.currentLevelNo].lines) {
            l.Show();
        }

    }
}

// Iniciar Canvas
function setupCanvas() {
    canvas = createCanvas(1200, 950);
    canvas.parent('canvas');
    width = canvas.width;
    height = canvas.height - 50;
}

// Botão pressionado
function keyPressed() {
    switch (key) {
        case ' ':
            player.jumpHeld = true
            break;
        case 'S':
            bumpSound.stop();
            jumpSound.stop();
            landSound.stop();
            fallSound.stop();
            break;
    }

    switch (keyCode) {
        case LEFT_ARROW:
            player.leftHeld = true;
            break;
        case RIGHT_ARROW:
            player.rightHeld = true;
            break;
    }

}
replayingBestPlayer = false;
cloneOfBestPlayer = null;


// Botão soltado
function keyReleased() {

    switch (key) {
        /*         case 'B':
                    replayingBestPlayer = true;
                    cloneOfBestPlayer = population.cloneOfBestPlayerFromPreviousGeneration.clone();
                    evolationSpeed = 1;
                    mutePlayers = false;
                    break;
        
         */
        case ' ':

            if (!creatingLines) {
                player.jumpHeld = false
                player.Jump()
            }
            break;
        /*         case 'R':
                    if (creatingLines) {
                        lines = [];
                        linesString = "";
                        mousePos1 = null;
                        mousePos2 = null;
                    }
                    break; */
        case 'N':
            if (creatingLines) {
                levelNumber += 1;
                linesString += '\nlevels.push(tempLevel);';
                linesString += '\ntempLevel = new Level();';
                print(linesString);
                lines = [];
                linesString = '';
                mousePos1 = null;
                mousePos2 = null;
            } else {
                player.currentLevelNo += 1;
                print(player.currentLevelNo);
            }
            break;
        case 'D':
            if (creatingLines) {

                mousePos1 = null;
                mousePos2 = null;
            }
    }

    switch (keyCode) {
        case LEFT_ARROW:
            player.leftHeld = false;
            break;
        case RIGHT_ARROW:
            player.rightHeld = false;
            break;
        case DOWN_ARROW:
            evolationSpeed = constrain(evolationSpeed - 1, 0, 50);
            print(evolationSpeed)

            break;
        case UP_ARROW:
            evolationSpeed = constrain(evolationSpeed + 1, 0, 50);
            print(evolationSpeed)
            break;
    }
}


let mousePos1 = null;
let mousePos2 = null;
let linesString = "";

// Botao Mouse clicado
function mouseClicked() {
    if (creatingLines) {
        let snappedX = mouseX - mouseX % 20;
        let snappedY = mouseY - mouseY % 20;
        if (mousePos1 == null) {
            mousePos1 = createVector(snappedX, snappedY);
        } else {
            mousePos2 = createVector(snappedX, snappedY);
            // print('tempLevel.lines.push(new Line(' + mousePos1.x + ',' + mousePos1.y + ',' + mousePos2.x + ',' + mousePos2.y + '));');
            lines.push(new Line(mousePos1.x, mousePos1.y, mousePos2.x, mousePos2.y));
            linesString += '\ntempLevel.lines.push(new Line(' + mousePos1.x + ',' + mousePos1.y + ',' + mousePos2.x + ',' + mousePos2.y + '));';
            mousePos1 = null;
            mousePos2 = null;
        }
    } else if (placingPlayer && !playerPlaced) {
        playerPlaced = true;
        player.currentPos = createVector(mouseX, mouseY);


    } else if (placingCoins) {


    }
    print("levels[" + player.currentLevelNo + "].coins.push(new Coin( " + floor(mouseX) + "," + floor(mouseY - 50) + ' , "progress" ));');
}

