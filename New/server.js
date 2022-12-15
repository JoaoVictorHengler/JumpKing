const express = require('express')
const { networkInterfaces } = require('os');

const app = express()

app.use(express.static("public"))

const http = require('http').Server(app)
const porta = process.env.PORT || 8000


const nets = networkInterfaces();
var ip;
for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) ip = net.address;
    }
}


const server = http.listen(porta, ip, function () {
    const portaStr = porta === 80 ? '' : ':' + porta

    console.log('Servidor iniciado. Abra o navegador em ' + portaStr)
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/style.css');
})
app.get('/Coin.js', (req, res) => {
    res.sendFile(__dirname + '/Coin.js');
})
app.get('/Level.js', (req, res) => {
    res.sendFile(__dirname + '/Level.js');
})

app.get('/Line.js', (req, res) => {
    res.sendFile(__dirname + '/Line.js');
})
app.get('/p5.dom.js', (req, res) => {
    res.sendFile(__dirname + '/p5.dom.js');
})
app.get('/p5.js', (req, res) => {
    res.sendFile(__dirname + '/p5.js');
})
app.get('/p5.sound.js', (req, res) => {
    res.sendFile(__dirname + '/p5.sound.js');
})
app.get('/Player.js', (req, res) => {
    res.sendFile(__dirname + '/Player.js');
})
app.get('/Population.js', (req, res) => {
    res.sendFile(__dirname + '/Population.js');
})
app.get('/Screen.js', (req, res) => {
    res.sendFile(__dirname + '/Screen.js');
})
app.get('/sketch.js', (req, res) => {
    res.sendFile(__dirname + '/sketch.js');
})
app.get('/Coin.js', (req, res) => {
    res.sendFile(__dirname + '/Coin.js');
})


const WebSocketServer = require('ws');

// Creating a new websocket server
const wss = new WebSocketServer.Server({ server })

var players = [];

// Creating connection using websocket
wss.on("connection", ws => {
    console.log("Nova Conexão.");

    // sending message
    ws.on("message", data => {
        let msg = JSON.parse(data.toString());
        if (msg.type != "updatePlayer") {
            console.log("Mensagem recebida: " + msg.type)
            console.log(msg);
        }
        

        switch (msg.type) {
            case "createPlayer":
                createPlayer(msg.data, ws);
                break;
            case "updatePlayer":
                updatePlayer(ws, msg.data);
                break;
        }
    });
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("Conexão Fechada.");
        let player = players.find(player => player.connection == ws);
        let removedPlaver = player.player.num
        players.splice(players.indexOf(player), 1);
        
        players.forEach(
            (player, i) => {
                player.connection.send(JSON.stringify({
                    'type': 'removePlayer',
                    'data': {'playerNum': removedPlaver}
                }));
                    
            }
        )
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Ocorreu algum erro")
    }
});

function createPlayer(playerData, connection) {
    let playerNum
    while (true) {
        playerNum = Math.floor(Math.random() * 50)
        let player = players.find(player => player.num == playerNum)
        if (!player) {
            break;
        }
    }
    ;
    let playersList = [];
    players.forEach(
        player => {
            playersList.push(player.player);
        }
    )

    playerData.num = playerNum;
    players.push({
        player: playerData,
        connection: connection
    })

    
    players.forEach(
        player => {
            if (player.connection != connection) {
                player.connection.send(JSON.stringify({
                    type: "createPlayer",
                    data: playerData
                }));
            } else {
                player.connection.send(JSON.stringify({
                    type: "createAllPlayers",
                    yourNum: playerNum,
                    data: playersList
                }));
            }
            
        }
    )
    /* console.log("Enviado para todos os players");
    console.log(playerData) */
}

function updatePlayer(ws, data) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].connection == ws) {
            players[i].player.x = data.x;
            players[i].player.y = data.y;
            players[i].player.level = data.level;
            players[i].player.state = data.state;
            players[i].player.currentSpeedY = data.currentSpeedY;
            players[i].player.facingRight = data.facingRight;
            players[i].player.hasBumped = data.hasBumped;
            break;
        }
    }
}

function createScoreBoard() {
    let scoreBoard = [];
    players.forEach(
        player => {
            scoreBoard.push({
                nick: player.player.nick,
                num: player.player.num,
                level: player.player.level
            });
        }
    )
    scoreBoard.sort((a, b) => (a.level > b.level) ? -1 : 1)
    return scoreBoard;
}

function sendAllPlayers() {
    let allPlayers = [];
    players.forEach(
        player => {
            allPlayers.push(player.player);
        }
    )
    players.forEach(
        player => {
            player.connection.send(JSON.stringify({
                type: "updatePlayer",
                data: allPlayers,
                scoreBoard: createScoreBoard()
            }));
        }
    )
}

setInterval(
    () => {
        sendAllPlayers();
    }, 1
)