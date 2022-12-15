var width, height;

class Screen {

    constructor() {
        this.player = null;

        /* Levels */

        this.showLines = false;

        this.activateCoins = false;
        this.showCoins = false;

        /* Sobre o jogo */

        this.isSinglePlayer = false;
        this.alreadyShowingSnow = false;
        this.images = {
            idleImage: null,
            squatImage: null,
            jumpImage: null,
            oofImage: null,
            run1Image: null,
            run2Image: null,
            run3Image: null,
            fallenImage: null,
            fallImage: null,
            snowImage: null,
            backgroundImage: null,
            levelImages: [],
            run1Image: null,
            run2Image: null,
            run3Image: null,
        };

        this.sounds = {
            fallSound: null,
            jumpSound: null,
            bumpSound: null,
            landSound: null,
        }

        this.population = null;
        this.levels = [];

        this.previousFrameRate = 60;
        this.showFPS = false;
        /* Multiplayer */

        this.connection;
        this.ranking;
        this.checkPoint = null;
    }

    async loadScreenResources() {
        try {
            this.images.backgroundImage = await loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/levelImages/1.png');
            this.images.idleImage = await loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/idle.png');
            this.images.squatImage = await loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/squat.png');
            this.images.jumpImage = await loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/jump.png');
            this.images.oofImage = await loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/oof.png');
            this.images.run1Image = await loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/run1.png');
            this.images.run2Image = await loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/run2.png');
            this.images.run3Image = await loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/run3.png');
            this.images.fallenImage = await loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/fallen.png');
            this.images.fallImage = await loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/poses/fall.png');


            this.images.snowImage = await loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/snow3.png');

            for (let i = 1; i <= 43; i++) {
                this.images.levelImages.push(await loadImage('https://raw.githubusercontent.com/Ola351/Jk/main/src/images/levelImages/' + i + '.png'));
            }
            this.sounds.jumpSound = await loadSound("https://raw.githubusercontent.com/Ola351/Jk/main/src/sounds/jump.mp3");
            this.sounds.fallSound = await loadSound("https://raw.githubusercontent.com/Ola351/Jk/main/src/sounds/fall.mp3");
            this.sounds.bumpSound = await loadSound("https://raw.githubusercontent.com/Ola351/Jk/main/src/sounds/bump.mp3");
            this.sounds.landSound = await loadSound("https://raw.githubusercontent.com/Ola351/Jk/main/src/sounds/land.mp3");

        } catch (e) {
            console.log(e);
            alert("Erro ao carregar os recursos do jogo. Por favor, recarregue a página.");
        }


    }

    setupCanvas(w, h) {
        canvas = createCanvas(w, h);
        canvas.parent('canvas');
        width = canvas.width;
        height = canvas.height - 50;

    }

    async createPlayer(nickPlayer = "Desconhecido") {
        this.player = new Player(nickPlayer, {
            idleImage: this.images.idleImage,
            squatImage: this.images.squatImage,
            jumpImage: this.images.jumpImage,
            oofImage: this.images.oofImage,
            run1Image: this.images.run1Image,
            run2Image: this.images.run2Image,
            run3Image: this.images.run3Image,
            fallImage: this.images.fallImage,
            fallenImage: this.images.fallenImage,
            snowImage: this.images.snowImage,
        }, {
            fallSound: this.sounds.fallSound,
            jumpSound: this.sounds.jumpSound,
            bumpSound: this.sounds.bumpSound,
            landSound: this.sounds.landSound,
        }, this.isSinglePlayer);
        console.log("Jogador Criado.");
        if (!this.isSinglePlayer) {
            await this.sendInformation("createPlayer", {
                nick: this.player.nick,
                x: this.player.currentPos.x,
                y: this.player.currentPos.y,
                level: this.player.currentLevelNo,
                state: this.player.state,
                currentSpeedY: this.player.currentSpeed.y,
                facingRight: this.player.facingRight,
                hasBumped: this.player.hasBumped,
            });
        }



    }

    createPopulation() {
        this.population = new Population();
    }

    setupLevels() {
        for (let i = 0; i < levelMatrix.length; i++) {
            let tempLevel = new Level();

            levelMatrix[i].forEach(
                (line) => {
                    tempLevel.lines.push(new Line(line[0], line[1], line[2], line[3]))
                }
            )
            this.levels.push(tempLevel);
        }

        this.levels.forEach(
            (level, i) => {
                this.levels[i].levelImage = this.images.levelImages[i];
                if ((i >= 25 && i <= 31)) {
                    this.levels[i].isBlizzardLevel = true;
                }
                if ((i >= 36 && i <= 38)) {
                    this.levels[i].isIceLevel = true;
                }
            }
        )

        // levels[0],.coins.push(new Coin( 1061,653],


        coinsLevel.forEach(
            (level) => {
                /* console.log("Level: " + level.level); */
                level.coins.forEach(
                    (coin) => {
                        this.levels[level.level].coins.push(new Coin(coin[0], coin[1]));
                        /* console.log("Moeda Criada"); */
                    }
                )
            }
        )

    }

    setPlayModeSounds() {
        Object.keys(this.sounds).forEach(
            (sound) => {
                this.sounds[sound].playMode('sustain');
            }
        )
    }

    async draw() {
        if (this.levels[this.player.currentLevelNo].isBlizzardLevel) {
            this.alreadyShowingSnow = true;
        } else {
            this.alreadyShowingSnow = false;
        }

        background(10);

        push()


        image(this.levels[this.player.currentLevelNo].levelImage, 0, 0)
        this.levels[this.player.currentLevelNo].show(this.showLines, this.showCoins);
        this.player.Update(this.levels);
        this.player.Show(this.levels);

        if (!this.isSinglePlayer) this.population.Show();

        if (frameCount % 15 === 0) {
            this.previousFrameRate = floor(getFrameRate())
        }
        pop();
        if (this.showFPS) {
            fill(255, 255, 255);
            textSize(32);
            text('FPS: ' + this.previousFrameRate, width - 160, 35);
        }

    }

    /* Criar Movimentação f:keyPressed() e f:keyReleased() */
    keyPressed() {
        switch (key) {
            case ' ':
                this.player.jumpHeld = true
                break;
            case 'S':
                this.player.stopSounds = !this.player.stopSounds;
                break;
            case 'F':
                this.showFPS = !this.showFPS;
                break;
            case 'L':
                this.showLines = !this.showLines;
                break;
            case 'C':
                this.saveCheckPoint();
                break;
            case 'D':
                this.loadCheckPoint();
                break;

        }

        switch (keyCode) {
            case LEFT_ARROW:
                this.player.leftHeld = true;
                break;
            case RIGHT_ARROW:
                this.player.rightHeld = true;
                break;
        }

    }

    keyReleased() {

        switch (key) {

            case ' ':

                this.player.jumpHeld = false
                this.player.Jump()
                break;

            /* case 'N':
                this.player.currentLevelNo += 1;

                break; */

        }

        switch (keyCode) {
            case LEFT_ARROW:
                this.player.leftHeld = false;
                break;
            case RIGHT_ARROW:
                this.player.rightHeld = false;
                break;
        }
    }

    /* Multiplayer */

    async connectWs(link = `ws:/${ip}/8000`) {

        try {
            this.connection = await new WebSocket(link);

            this.connection.onerror = () => {
                console.log("Houve um erro com a conexão")
            }
            return true;
        } catch (e) {
            console.log(e);
            swal.fire({
                text: "Erro ao conectar com o servidor. Por favor, recarregue a página.",
                icon: "error",
                showConfirmButton: true,
                allowOutsideClick: false
            })
        };
    }

    async sendInformation(type, data) {
        await this.connection.send(JSON.stringify({
            "type": type,
            "data": data
        }));
    }

    async setupConnection() {
        let nickPlayer;
        swal.fire({
            text: "Digite o seu nick:",
            input: 'text',
            inputPlaceholder: 'Nick do usuário',
            confirmButtonText: 'Multiplayer',
            cancelButtonText: 'Singleplayer',
            showConfirmButton: true,
            showCancelButton: true,
            allowOutsideClick: false
        }).then(
            async (result) => {
                if (!result.isConfirmed) {
                    this.isSinglePlayer = true;
                }

                if (result.value === "") nickPlayer = "Desconhecido";
                else nickPlayer = result.value;


                if (this.isSinglePlayer) {
                    await this.createPlayer(nickPlayer);
                    await this.setupLevels();
                    await this.setPlayModeSounds();

                    canStart = true
                } else {
                    document.getElementById("scores").style.display = "flex";
                    await this.connectWs();
                    this.connection.onopen = async () => {
                        this.multiplayerReceiver();
                        await this.createPlayer(nickPlayer);
                        await this.createPopulation();
                        await this.setupLevels();
                        await this.setPlayModeSounds();
                        this.updateRankingBoard();
                        canStart = true;
                    }
                }

            }
        );



    }

    updateInformationServer() {
        this.sendInformation(
            "updatePlayer",
            {
                level: this.player.currentLevelNo,
                x: this.player.currentPos.x,
                y: this.player.currentPos.y,
                state: this.player.state,
                currentSpeedY: this.player.currentSpeed.y,
                facingRight: this.player.facingRight,
                hasBumped: this.player.hasBumped,

            }
        )
    }

    multiplayerReceiver() {
        this.connection.onmessage = (message) => {
            let msg = JSON.parse(message.data);
            if (msg.type != "updatePlayer") {
                console.log("Mensagem recebida: " + msg.type);
                console.log(msg);
            }

            switch (msg.type) {
                case "createPlayer":
                    this.population.appendPlayer(msg.data);
                    break;
                case "createAllPlayers":
                    this.player.numMultiplayer = msg.yourNum;
                    this.population.appendAllPlayers(msg.data);
                    break;
                case "updatePlayer":
                    this.population.update(msg.data);
                    this.ranking = msg.scoreBoard;
                    break;
                case "removePlayer":
                    this.population.removePlayer(msg.data.playerNum);
                    break;

            }
        }
    }

    updateRankingBoard() {
        var rankingInterval = setInterval(
            () => {
                if (canStart && !this.isSinglePlayer) {

                    this.ranking.forEach(
                        (playerInfo, i) => {
                            if (document.getElementById(`score-${playerInfo.num}`) == null) {
                                let scoresElement = document.getElementById("scores");
                                let scoreElement = document.createElement("div");
                                scoreElement.innerHTML = `
                                            <p class="score__pos">${i + 1}</p>
                                            <p class="score__nick">${playerInfo.nick}</p>
                                            <p class="score__level">${playerInfo.level}</p>
                                        `;
                                scoreElement.id = `score-${playerInfo.num}`;
                                scoreElement.className = "score";
                                scoreElement.style.order = i + 1;
                                scoreElement.classList.add("w-100", "score", "h5", "fw-light", "m-0");
                                scoresElement.appendChild(scoreElement);
                                setTimeout(() => {
                                    scoreElement.style.transform = `translateY(${40 * (i + 1)}px)`;
                                }, 1000);

                            } else {
                                let scoreElement = document.getElementById(`score-${playerInfo.num}`);
                                scoreElement.style.order = i + 1;
                                scoreElement.children[0].innerHTML = i + 1;
                                scoreElement.children[1].innerHTML = playerInfo.nick;
                                scoreElement.children[2].innerHTML = playerInfo.level;
                                setTimeout(() => {
                                    scoreElement.style.transform = `translateY(${40 * (i + 1)}px)`;
                                }, 1000);
                            }
                        });

                } else if (this.isSinglePlayer) {

                    clearInterval(rankingInterval);
                }
            }, 1000
        )
    }

    saveCheckPoint() {
        if (!this.player.isOnGround) return;
        console.log("Salvando checkpoint")
        this.checkPoint = {
            level: this.player.currentLevelNo,
            x: this.player.currentPos.x,
            y: this.player.currentPos.y,
            state: this.player.state,
            currentSpeedY: this.player.currentSpeed.y,
            facingRight: this.player.facingRight,
            hasBumped: this.player.hasBumped,
        }
    }

    loadCheckPoint() {
        if (this.checkPoint == null) return;
        console.log("Carregando checkpoint")
        this.player.currentLevelNo = this.checkPoint.level;
        this.player.currentPos.x = this.checkPoint.x;
        this.player.currentPos.y = this.checkPoint.y;
        this.player.state = this.checkPoint.state;
        this.player.currentSpeed.y = this.checkPoint.currentSpeedY;
        this.player.facingRight = this.checkPoint.facingRight;
        this.player.hasBumped = this.checkPoint.hasBumped;
    }

    /* Criar Edit Coins f:mouseClicked() */
}