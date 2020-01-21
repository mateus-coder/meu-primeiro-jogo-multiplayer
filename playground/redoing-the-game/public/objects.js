import { colliding, collidingInimigo } from './collisions/colliding'
import collide from './collisions/collide'

export var Sprite = function(sourceX,sourceY,width,height,x,y){
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
export var Alien = function(sourceX,sourceY,width,height,x,y){
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

export var SpriteDynamic =  function(sourceX ,sourceY ,width ,height ,x ,y) {
	Sprite.call( this, sourceX ,sourceY ,width ,height ,x ,y );
	this.type = "DYNAMICBACKGROUND";
	this.moreOrLess = 1;
	this.animation = false;
}
SpriteDynamic.prototype = Object.create(Sprite.prototype);


export var InimigoObj = function(sourceX ,sourceY ,width ,height ,x ,y){
	Sprite.call(this, sourceX ,sourceY ,width ,height ,x ,y );
	this.state = "NORMAL";
	this.status = "VISIBLE";
}
InimigoObj.prototype = Object.create(Sprite.prototype);

InimigoObj.prototype.getRandomInt = function (min , max) {
    min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

InimigoObj.prototype.moveInimigo = function (info) {
    let { player } = info
    collidingInimigo[player.optionsRoutes[getRandomInt(0, 4)]](info);
	while(player.collideTrueOrFalseAllScene){
		collidingInimigo[player.optionsRoutes[getRandomInt(0, 4)]](info);
	}
}
//lifeIcons 
const LifeIcons = function(sourceX, sourceY, width, height, x, y){
	Sprite.call(this, sourceX, sourceY, width, height, x, y);
}
LifeIcons.prototype = Object.create(Sprite.prototype);

//game
export const Game = function () {
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

Game.prototype.setPosition = function (char) {
    char.x += char.positionX;
	char.y += char.positionY;
}

Game.prototype.setMove = function (char) { 
    char.x += char.vx;
	char.y += char.vy;
}

Game.prototype.leaveBorder = function (inimigoType1, paused){
    //condição se o inimigo sair da borda ele retornar na outra extremidade
	if(inimigoType1.x > 500 - inimigoType1.width){
		inimigoType1.x = 0;
		return true;
	}
	if(inimigoType1.x < 0){
		inimigoType1.x = 500 - inimigoType1.width; // 500(width do canvas) e 550(height do canvas);  
		return true;
	}
	if(inimigoType1.y > (550 - inimigoType1.height) + (- 50 + paused ) ){
		inimigoType1.y = 0;
		return false;
	}
	if(inimigoType1.y < 0 ){
		inimigoType1.y = (550 - inimigoType1.height) + (- 50 + paused );
		return false;
	}
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
    for(let indice = 0; indice < 7; indice++){
		let lifeIcon = new LifeIcons(112, 111, 50, 50, char.lifePositionX[indice], 500);
		char.lifeIcons.push(lifeIcon);
		char.sprites.push(lifeIcon);
	}
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

Game.prototype.movePlayer = function(command) {
    notifyAll(command)
    
    const acceptedMoves = {
        ArrowUp(info) {
            let { player } = info;
            player.y -= 5;
			colliding["collideAllScene"](info);
			if(player.collideTrueOrFalseAllScene === false){
				player.vx = 0;
				player.vy = -5;
			}
			player.y += 5;
        },
        ArrowRight(info) {
            let { player } = info;
            player.x += 5;
			colliding["collideAllScene"](info);
			if(player.collideTrueOrFalseAllScene === false){
				player.vx = 5;
				player.vy = 0;
			}
			player.x -= 5;
        },
        ArrowDown(info) {
            let { player } = info;
            player.y += 5;
			colliding["collideAllScene"](info);
			if(player.collideTrueOrFalseAllScene === false){
				player.vx = 0;
				player.vy = 5;
			}
			player.y -= 5;
        },
        ArrowLeft(info) {
            let { player } = info;
            player.x -= 5;
			colliding["collideAllScene"](info);
				
			if(player.collideTrueOrFalseAllScene === false){
				player.vx = -5;
				player.vy = 0;
			}
				
			player.x += 5;
        },
        Enter(info) {
            let { player } = info;
            if(this.gameState !== this.OVER){
				this.gameState !== this.PLAYING ? this.gameState = this.PLAYING : 
				this.gameState = this.PAUSED;
				player.gameState !== "PLAYING" ? player.gameState = "PLAYING" : 
				player.gameState = "PAUSED";
			}
        }
    }

    const keyPressed = command.keyPressed
    const playerId = command.playerId
    const player = this.searchThing( { 
                                        playerId : playerId,
                                        arranjoEspec : this.players 
                                    } )
    const info = {
        player : player,
        cenario : this.cenario,
        desconto : 5
    }
    const moveFunction = acceptedMoves[keyPressed]

    if (player && moveFunction) {
        moveFunction(info)
        this.checkForFruitCollision(playerId)
    }
}

Game.prototype.collideWall = function (inimigoType1) {
    inimigoType1.collideTrueOrFalse = false;
	for(let i = 0; i < this.cenario.length; i++){
		let cenarioEspecifico = this.cenario[i];
		if(collide(inimigoType1, cenarioEspecifico)){
			inimigoType1.colisoes += 1;
			if(inimigoType1.colisoes == 1){
				inimigoType1.collideTrueOrFalse = true;
				//dando espaçamento para não bugar na parede
				inimigoType1.positionX = inimigoType1.positionY = 0;
				const collideFunctions = colliding["collideTop"];
                collideFunctions( { 
                                    player : inimigoType1, 
                                    desconto : 5
                                } );
				this.setPosition(inimigoType1);
                inimigoType1.moveInimigo( { 
                                            player : inimigoType1,
                                            cenario : this.cenario    
                                        } );
			}
		}
	}//final do for do cenario
}

Game.prototype.update = function (char) {
    for(let z in this.inimigos){
		let inimigoType1 = this.inimigos[z];
		inimigoType1.colisoes = 0;
		this.collideWall(inimigoType1);
		!inimigoType1.collideTrueOrFalse ? this.setMove(inimigoType1) : inimigoType1.colisoes *= 1;
		this.leaveBorder(inimigoType1, 0);
	}
	//verificar se o personagem ultrapassou o limite da arena 
	this.leaveBorder(char, 0);
	
	collideWallChar();
	collideCharFruit();
	collideCharInimigos();
	removeInvisibleObjects(this.frutas, this.sprites);
	removeInvisibleObjects(this.inimigos, this.sprites);
	removeInvisibleObjects(char.lifeIcons, char.sprites);
	
	//atualiza a posição do personagem
	!char.collideTrueOrFalse ? this.setMove(char) : this.setPosition(char);
	//------------------------seta o movimento/ seta o recoy caso o inimigo venha a colida com o cenário;
	
	//Animação do modo pause 
	char.gameState !== "PAUSED" ? char.clearObjectsModePause() :char.gameState = "PAUSED";
}

Game.prototype.verifyStateGame = function (char) {
    this.contadorDeTempo === this.delayMudancaDeCor ? this.Animations() : this.delayMudancaDeCor++;
	//define as ações com base no estado do jogo
	switch(this.gameState){
		case this.LOADING:
			console.log('LOADING...');
			break;
		case this.PLAYING:
			this.update(char);
			break;
		case this.OVER:
			break;
		case this.PAUSED:
			break;
	}
	const playerGameState = {
		PAUSED : () => {
			char.contadorDePausa += 1;
			char.contadorDePausa === 1 ? this.createScenePause(true) : this.updatePause();
		},
		PLAYING : () => {
			//update();
			char.contadorDePausa = 0;
			
		},
		WIN : () => {
			char.status = "INVISIBLE";
			//removeInvisibleObjects(game.sprites, game.players);
			this.gameState = this.OVER;
			char.contadorDeWin += 1;
			char.contadorDeWin === 1 ? this.createSceneWin() : this.updateWin();
		},
		LOSE : () => {
			char.status = "INVISIBLE";
			//removeInvisibleObjects(game.sprites, game.players);
			this.gameState = this.OVER;
			char.contadorDeLose += 1;
			char.contadorDeLose === 1 ? char.createSceneLose() : char.updateLose();
		},
		INIT : () => {
			char.contadorDePausa += 1;
			char.contadorDePausa === 1 ? char.createScenePause(false) : char.updatePause();
			
		}
	}
	playerGameState[`${char.gameState}`]();
}