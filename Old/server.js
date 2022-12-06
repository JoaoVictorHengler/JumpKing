const express = require('express')
const app = express()

app.use(express.static("public"))

const http = require('http').Server(app)
const porta = process.env.PORT || 8000

const host = process.env.HEROKU_APP_NAME ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : "http://localhost"

const server = http.listen(porta, function(){
    const portaStr = porta === 80 ? '' :  ':' + porta

    if (process.env.HEROKU_APP_NAME) 
        console.log('Servidor iniciado. Abra o navegador em ' + host)
    else console.log('Servidor iniciado. Abra o navegador em ' + host + portaStr)
})

app.get('/', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/code-bullet.github.io.html');
})
app.get('/style.css', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/style.css');
})
app.get('/Coin.js', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/Coin.js');
})
app.get('/Level.js', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/Level.js');
    /*resposta.sendFile(__dirname + '/LevelSetupFunction.js');
    resposta.sendFile(__dirname + '/Line.js');
    resposta.sendFile(__dirname + '/p5.dom.js');
    resposta.sendFile(__dirname + '/p5.js');
    resposta.sendFile(__dirname + '/p5.sound.js');
    resposta.sendFile(__dirname + '/Player.js');
    resposta.sendFile(__dirname + '/Population.js');
    resposta.sendFile(__dirname + '/sketch.js'); */
})
app.get('/LevelSetupFunction.js', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/LevelSetupFunction.js');
})
app.get('/Line.js', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/Line.js');
})
app.get('/p5.dom.js', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/p5.dom.js');
})
app.get('/p5.js', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/p5.js');
})
app.get('/p5.sound.js', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/p5.sound.js');
})
app.get('/Player.js', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/Player.js');
})
app.get('/Population.js', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/Population.js');
})
app.get('/sketch.js', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/sketch.js');
})


const WebSocketServer = require('ws');
 
// Creating a new websocket server
const wss = new WebSocketServer.Server({server})
var players = [];
var connections = [];
// Creating connection using websocket
wss.on("connection", ws => {
    console.log("Nova Conexão.");
    connections.push(ws);

    // sending message
    ws.on("message", data => {
        let msg = JSON.parse(data.toString());
        if (msg.type == 'appendPlayer') {
            let playerNum = Math.floor(Math.random() * 50);
            for (let i = 0; i < players.length;i++) {
                if (playerNum == players[i].numPlayer) {
                    playerNum = Math.floor(Math.random() * 50);
                    break;
                }
            }
            players.push({
                'numPlayer': playerNum,
                'x': msg.data.x,
                'y': msg.data.y,
                'level': msg.data.level,
                'state': msg.data.state
            });

            ws.send(JSON.stringify({
                'type': 'getMyNum',
                'data': {'playerNum': playerNum}
            }));
            ws.send(JSON.stringify({
                'type': 'getPlayers',
                'data': {'players': players}
            }));

        } else if (msg.type == 'updatePlayer') {
            for (let i = 0; i< players.length; i++) {
                if (players[i].numPlayer == msg.data.numPlayer) {
                    players[i].x = msg.data.x;
                    players[i].y = msg.data.y;
                    players[i].level = msg.data.level;
                    players[i].state = msg.data.state;
                }
            }
            for (let i = 0; i < connections.length; i ++) {
                connections[i].send(JSON.stringify({
                    'type': 'updatePlayer',
                    'data': {'players': players}
                }));
            }
        }
    }); 
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has connected");
        console.log("Conexão Fechada.");
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Ocorreu algum erro")
    }
});
console.log("The WebSocket server is running on port 8080");