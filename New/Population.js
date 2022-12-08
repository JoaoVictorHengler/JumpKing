let alreadyShowingSnow = false;



class Population {

    constructor() {
        this.players = [];

        this.bestPlayerIndex = 0;
        this.currentHighestPlayerIndex = 0;

        this.bestHeight = 0;
        this.showingLevelNo = 0;
        this.currentBestLevelReached = 0;
        this.reachedBestLevelAtActionNo = 0;
        this.newLevelReached = false;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    appendPlayer(playerInfo) {
        if (playerInfo.num != screen.player.numMultiplayer) {
            let player = new Player(playerInfo.nick, screen.player.images, screen.player.sounds, false);
            player.currentPos = createVector(playerInfo.x, playerInfo.y);
            player.currentLevelNo = playerInfo.level;
            player.numMultiplayer = playerInfo.num;
            player.isClone = true;
            player.state = playerInfo.state;
            player.currentSpeedY = playerInfo.currentSpeedY;
            player.facingRight = playerInfo.facingRight;
            player.hasBumped = playerInfo.hasBumped;
            this.players.push(player);
        }
    }

    appendAllPlayers(players) {
        players.forEach(
            player => {
                if (player.numMultiplayer != screen.player.numMultiplayer) {
                    this.appendPlayer(player);
                }
                
            }
        )
    }
    // Atualizar todos os jogadores
    Update() {
        this.players.forEach(
            player => {
                if (player.isClone && player.currentLevelNo == screen.player.currentLevelNo) {
                    player.Update(screen.levels);
                    player.Show(screen.levels);
                }

            }
        );

    }

    updatePlayers(playersInfo) {
        playersInfo.forEach(
            playerInfo => {
                if (playerInfo.num != screen.player.numMultiplayer) {
                    let player = this.players.find(player => player.numMultiplayer == playerInfo.num);

                    if (player != null) {
                        player.currentPos = createVector(playerInfo.x, playerInfo.y);
                        player.currentLevelNo = playerInfo.level;
                        player.state = playerInfo.state;
                        player.currentSpeedY = playerInfo.currentSpeedY;
                        player.facingRight = playerInfo.facingRight;
                        player.hasBumped = playerInfo.hasBumped;
                    }
                }
                
            }
        )
    }

    SetBestPlayer() {
        this.bestPlayerIndex = 0;
        this.newLevelReached = false;

        if (this.players[this.bestPlayerIndex].bestLevelReached > this.currentBestLevelReached) {
            this.currentBestLevelReached = this.players[this.bestPlayerIndex].bestLevelReached;
            this.newLevelReached = true;
            this.reachedBestLevelAtActionNo = this.players[this.bestPlayerIndex].bestLevelReachedOnActionNo;
            print("NEW LEVEL, action number", this.reachedBestLevelAtActionNo)
            //this.showingLevelNo++;
        }
        /* console.log(this.players[this.bestPlayerIndex].currentPos.y) */
    }
    // Setar maior player
    SetCurrentHighestPlayer() {
        this.currentHighestPlayerIndex = 0;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].GetGlobalHeight() > this.players[this.currentHighestPlayerIndex].GetGlobalHeight()) {
                this.currentHighestPlayerIndex = i;
            }
        }
    }

    Show() {

        this.SetCurrentHighestPlayer()
        let highestPlayer = this.players[this.currentHighestPlayerIndex];
        let highestLevelNo = this.players[this.currentHighestPlayerIndex].currentLevelNo;

        if(highestPlayer.currentLevelNo > highestPlayer.bestLevelReached && !highestPlayer.progressionCoinPickedUp){
            highestLevelNo -=1;
        }
        showLevel(highestLevelNo);
        alreadyShowingSnow = false;
        this.showingLevelNo = highestLevelNo;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].currentLevelNo >= highestLevelNo - 1 && this.players[i].currentLevelNo <=highestLevelNo ) {
                this.players[i].Show();
            }
        }

        // this.ShowPopulationInfo();

    }


}