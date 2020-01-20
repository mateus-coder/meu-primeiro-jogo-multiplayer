var Sprite = function(sourceX,sourceY,width,height,x,y){
	this.sourceX = sourceX;
	this.sourceY = sourceY;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.vx = 5;
    this.vy = 0;
    this.playerId = "";
	this.status = "VISIBLE";
	this.type = "STATIC";
	this.quantCollide = 0;
	this.move = "STOP";
	this.positionX = x;
	this.positionY = y;
	this.collideTrueOrFalse = false;
	this.collideTrueOrFalseAllScene = false;
	this.points = 0;
	this.keyPressed = "mvNone";
	this.loser = 7;
	this.colisoes = 0;
	this.gameState = "INIT";
	this.optionsRoutes = ["LEFT", "RIGHT", "DOWN", "TOP"];
	this.lifeIcons = []; //vidas
	this.lifePositionX = [0,50,100,150,200, 250];
	this.sprites = []; //itens que devem ser exibidos especificamente para cada usuário
	this.alimentosPaused = [];
	this.scenePause = [];
	this.sceneLose = [];
	this.alimentosPausedX = [0,50,100,150,211,260];
	this.alimentosPausedPositionY = [0,50,100,150,211,260];
	this.alimentosPausedPositionX = [0,100,200,300,400,500];
	this.contadorDePausa = 0;
	this.contadorDeLose = 0;
	this.contadorDeWin = 0;
    this.indiceReal = 0;
}

Sprite.prototype.centerX = function(){
	return this.x + (this.width/2);
}

Sprite.prototype.centerY = function(){
	return this.y + (this.height/2);
}

Sprite.prototype.halfWidth = function(){
	return this.width/2;
}

Sprite.prototype.halfHeight = function(){
	return this.height/2;
}
//classe alien(inimigo);
var Alien = function(sourceX,sourceY,width,height,x,y){
	//comando que significa que eu estou passando para esta classe as variáveis de instância da classe Sprite
	Sprite.call(this, sourceX,sourceY,width,height,x,y);
	this.NORMAL = 1;
	this.EXPLODED = 2;
	this.CRAZY = 3;
	this.state = this.NORMAL;
	this.mvStyle = this.NORMAL;
}
//passando todos os métodos da classe Sprite para esta classe
Alien.prototype = Object.create(Sprite.prototype);

Alien.prototype.explode = function(){
	this.sourceX = 110;
	this.width = 70;
	this.height = 55;
}

//classe muro

var SpriteDynamic =  function(sourceX ,sourceY ,width ,height ,x ,y) {
	Sprite.call( this, sourceX ,sourceY ,width ,height ,x ,y );
	this.type = "DYNAMICBACKGROUND";
	this.moreOrLess = 1;
	this.animation = false;
}
SpriteDynamic.prototype = Object.create(Sprite.prototype);


var InimigoObj = function(sourceX ,sourceY ,width ,height ,x ,y){
	Sprite.call(this, sourceX ,sourceY ,width ,height ,x ,y );
	this.state = "NORMAL";
	this.status = "VISIBLE";
}
InimigoObj.prototype = Object.create(Sprite.prototype);
//lifeIcons 
const LifeIcons = function(sourceX, sourceY, width, height, x, y){
	Sprite.call(this, sourceX, sourceY, width, height, x, y);
}
LifeIcons.prototype = Object.create(Sprite.prototype);

//game
const Game = function () {
    //estados do game
	this.LOADING = 0;
	this.PLAYING = 1;
	this.PAUSED = 2;
	this.OVER = 3;
	this.gameState = this.LOADING;
	//arranjos de objetos do game
	this.sprites = [];
	this.players = [];
	this.assetsToLoad = [];
	this.tiposDeInimigosSourceY = [212,       312,      362 ];
	this.posicoesIniciaisInimigosY = [350,    200,      425];
	this.posicoesIniciaisInimigosX = [280,    280,      30];
	this.frutas = [];
	this.inimigos = [];
	this.cenario = [];
	//estado do jogo finalizado ? 
	this.end = false;
	//contador de recursos
	this.loadedAssets = 0;
	this.acceptKeys = {
		LEFT : 37,
		RIGHT : 39,
		ENTER : 13,
		TOP : 38,
		DOWN : 40,
	};
	this.contadorDeTempo = 60;
    this.delayMudancaDeCor = 0;
    //funções observadoras
    this.observers = [];
    //quantidade de jogadores 
    this.contPlayers = 0;
}

//remove os objetos do jogo 
Game.prototype.removeObjects = function(objectOnRemove, array){
	let i = array.indexOf(objectOnRemove);
	if(i !== -1){
		array.splice(i, 1);
	}
}
Game.prototype.searchThing = function(command){
    const playerId = command.playerId;
    const arranjo = command.arranjoEspec;
    for(let i in arranjo){
        if(this.players[i].playerId === playerId){
            return this.players[i]
        }
    }
}
Game.prototype.subscribe = function(observerFunction) {
    this.observers.push(observerFunction)
}

Game.prototype.notifyAll = function(command) {
    for (const observerFunction of this.observers) {
        observerFunction(command)
    }
}

Game.prototype.getState = function(newState) {
    return newState;
}

Game.prototype.addPlayer = function (command) {
    const playerId = command.playerId
    //personagem---------------------------------
    let char = new Sprite(500,162,50,50,180,425);
    char.playerId = playerId;
    this.contPlayers ++;
	this.sprites.push(char);
    this.players.push(char);
    
    this.notifyAll({
        type: 'add-player',
        playerId: playerId,
    })
}

Game.prototype.removePlayer = function(command) {
    const playerId = command.playerId
    
    let char = command.objetoChar
    this.removeObjects(char, this.sprites)
    this.removeObjects(char, this.players)
    this.contPlayers --

    this.notifyAll({
        type: 'remove-player',
        playerId: playerId,
        objetoChar : this.searchThing( { playerId : playerId,
                                          arranjoEspec : this.players 
                                      } )
    })
}

Game.prototype.movePlayer = function() {
    notifyAll(command)

    const acceptedMoves = {
        ArrowUp(player) {
            if (player.y - 1 >= 0) {
                player.y = player.y - 1
            }
        },
        ArrowRight(player) {
            if (player.x + 1 < state.screen.width) {
                player.x = player.x + 1
            }
        },
        ArrowDown(player) {
            if (player.y + 1 < state.screen.height) {
                player.y = player.y + 1
            }
        },
        ArrowLeft(player) {
            if (player.x - 1 >= 0) {
                player.x = player.x - 1
            }
        }
    }

    const keyPressed = command.keyPressed
    const playerId = command.playerId
    const player = this.searchThing( { playerId : playerId,
                                        arranjoEspec : this.players 
                                    } )
    const moveFunction = acceptedMoves[keyPressed]

    if (player && moveFunction) {
        moveFunction(player)
        this.checkForFruitCollision(playerId)
    }
}

