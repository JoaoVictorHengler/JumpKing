class Level{
    constructor() {
        this.levelImage = null;
        this.lines = [];
        this.levelNo =0;
        this.isBlizzardLevel = false;
        this.isIceLevel = false;
        this.coins = [];
    }

    show(showingLines, showingCoins){
        push();
        image(this.levelImage,0,0)
        if(showingLines){
            for(let l of lines){
                l.Show();
            }
        }
        if(showingCoins){
            for(let c of this.coins){
                c.show();
            }
        }

        pop();
    }

    appendCoin() {
        let coin = new Coin(x, y);
        this.coins.push(coin);
    }


}