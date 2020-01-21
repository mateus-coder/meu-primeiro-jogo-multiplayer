import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import socketio from 'socket.io'
import Game from './public/objects.js'
import initScene from './public/scenes/initScene.js'
import opponents from './public/opponents/opponents.js'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const initGame = {
	createGame : () => {
		return new Game();
    },
    createInitScene : (game) => {
        initScene(game);
    },
    createOpponents : (game) => {
        opponents(game);
    }
}
const game = initGame["createGame"]();
initGame["createInitScene"](game);
initGame["createOpponents"](game);

game.subscribe((command) => {
    console.log(`> Emitting ${command.type}`)
    sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`> Player connected: ${playerId}`)

    game.addPlayer({ playerId: playerId })

    socket.emit('setup', game)

    socket.on('disconnect', () => {
        game.removePlayer({
                            playerId: playerId ,
                            objetoChar : game.searchThing( {   playerId : playerId,
                                                                arranjoEspec : game.players 
                                                            } )
        })
        console.log(`> Player disconnected: ${playerId}`)
    })

    socket.on('move-player', (command) => {
        command.playerId = playerId
        command.type = 'move-player'
        
        game.movePlayer(command)
    })
})

server.listen(3000, () => {
    console.log(`> Server listening on port: 3000`)
})