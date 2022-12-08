var width, height;

class Screen {

    constructor() {
        this.player = null;

        /* Levels */

        this.showLines = true;

        this.activateCoins = false;
        this.showCoins = false;

        /* Sobre o jogo */

        this.isSinglePlayer = false;

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

        /* Multiplayer */

        this.connection;
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

    async createPlayer(nickPlayer="João") {
        this.player = new Player(nickPlayer, {
            idleImage: this.images.idleImage,
            squatImage: this.images.squatImage,
            jumpImage: this.images.jumpImage,
            oofImage: this.images.oofImage,
            run1Image: this.images.run1Image,
            run2Image: this.images.run2Image,
            run3Image: this.images.run3Image,
            fallImage: this.images.fallImage,

        }, {
            fallSound: this.sounds.fallSound,
            jumpSound: this.sounds.jumpSound,
            bumpSound: this.sounds.bumpSound,
            landSound: this.sounds.landSound,
        }, this.isSinglePlayer);
        console.log("Jogador Criado.");

        await this.sendInformation("createPlayer", {
            nick: this.player.nick,
            x: this.player.currentPos.x,
            y: this.player.currentPos.y,
            level: this.player.currentLevelNo,
            state: this.player.state,
            currentSpeedY: this.player.currentSpeed.y,
        });


    }

    createPopulation() {
        this.population = new Population();
        /* this.population.addPlayer(this.player); */
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
        background(10);

        fill(0);


        fill(255, 255, 255);
        textSize(32);
        text('FPS: ' + this.previousFrameRate, width - 160, 35);

        push()
        translate(0, 50);

        image(this.levels[this.player.currentLevelNo].levelImage, 0, 0)
        this.levels[this.player.currentLevelNo].show(this.showLines, this.showCoins);
        this.player.Update(this.levels);
        this.player.setImgPlayer(this.levels);
        /* this.population.Update(); Problema aqui */

        if (frameCount % 15 === 0) {
            this.previousFrameRate = floor(getFrameRate())
        }
        pop();
        
    }

    /* Criar Movimentação f:keyPressed() e f:keyReleased() */
    keyPressed(key) {
        switch (key) {
            case ' ':
                this.player.jumpHeld = true
                break;
            case 'S':
                this.player.bumpSound.stop();
                this.player.jumpSound.stop();
                this.player.landSound.stop();
                this.player.fallSound.stop();
                break;
        }

        switch (keyCode) {
            case LEFT_ARROW:
                console.log("Personagem andando para o lado esquerdo")

                this.player.leftHeld = true;
                break;
            case RIGHT_ARROW:
                console.log("Personagem andando para o lado direito")
                this.player.rightHeld = true;
                break;
        }

    }

    keyReleased(key, keyCode) {

        switch (key) {

            case ' ':

                this.player.jumpHeld = false
                this.player.Jump()
                break;

            case 'N':
                player.currentLevelNo += 1;

                break;
            case 'D':
                if (creatingLines) {

                    mousePos1 = null;
                    mousePos2 = null;
                }
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

    async connectWs(link = 'ws://localhost:8000') {

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
        }
    }

    async sendInformation(type, data) {
        await this.connection.send(JSON.stringify({
            "type": type,
            "data": data
        }));
    }

    async setupConnection() {
        let nickPlayer;
        /* swal.fire({
                text: "Digite o seu nick:",
                input: 'text',
                Colocar botão para selecionar o modo de jogo (single ou multi)
                inputPlaceholder: 'Nick do usuário',
                confirmButtonText: 'Multiplayer',
                cancelButtonText: 'Single Player',
                showConfirmButton: true,
                showCancelButton: true,
                allowOutsideClick:false
            }).then(
                (result) => {
                    if (result.isConfirmed & result.value != "") {
                        nickPlayer = result.value;
                    } else if (result.isCancelled) {
                        this.isSinglePlayer = true;
                    }
                }
        ); */
        await this.connectWs();
        this.connection.onopen = async () => {
            this.multiplayerReceiver();
            await screen.createPlayer(/* nickPlayer */);
            await screen.createPopulation();
            await screen.setupLevels();
            await screen.setPlayModeSounds();
            canStart = true;
        }
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
                    this.population.appendPlayer(msg.data)
                    break;
                case "createAllPlayers":
                    this.player.numMultiplayer = msg.yourNum;
                    this.population.appendAllPlayers(msg.data)
                    break;
                case "updatePlayer":
                    this.population.updatePlayers(msg.data)
            }
        }
    }

    /* Criar Edit Coins f:mouseClicked() */
}