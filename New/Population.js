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
    Show() {
        this.players.forEach(
            player => {
                if (player.isClone && player.currentLevelNo == screen.player.currentLevelNo) {
                    player.Update(screen.levels);
                    player.Show(screen.levels);
                }

            }
        );

    }

    update(playersInfo) {
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

    removePlayer(num) {
        let player = this.players.find(player => player.numMultiplayer == num);
        if (player != null) {
            this.players.splice(this.players.indexOf(player), 1);
        }
    }

}