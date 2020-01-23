import { createSceneLose, createScenePause, createSceneWin } from './scenes/otherScenes.js'
import { Sprite, LifeIcons } from './objects.js'
//game
export default function Game (sprites, players, frutas, cenario, inimigos) {
    //estados do game//
	this.LOADING = 0;
	this.PLAYING = 1;
	this.PAUSED = 2;
	this.OVER = 3;
    this.gameState = this.PLAYING;
    this.init = false;
	//arranjos de objetos do game
	this.sprites = sprites;
	this.players = players;
	this.assetsToLoad = [];
	this.tiposDeInimigosSourceY = [212,       312,      362 ];
	this.posicoesIniciaisInimigosY = [350,    200,      425];
	this.posicoesIniciaisInimigosX = [280,    280,      30];
	this.frutas = frutas;
	this.inimigos = inimigos;
	this.cenario = cenario;
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

Game.prototype.leaveBorder = function (info){
    let { inimigoType1, paused } = info;
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
Game.prototype.removeObjects = function(info){
    let { objectOnRemove, array } = info;
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

export var setState = function(sprites, players, frutas, cenario, inimigos) {
    Game.call(this, sprites, players, frutas, cenario, inimigos);
    this.normal = "";
}
setState.prototype = Object.create(Game.prototype);

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
    this.removeObjects({
                            objectOnRemove : char,
                            array : this.sprites
                        })
    this.removeObjects({
                            objectOnRemove : char,
                            array : this.players
                        })
    this.contPlayers --

    this.notifyAll({
        type: 'remove-player',
        playerId: playerId,
        objetoChar : this.searchThing( { 
                                            playerId : playerId,
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
				//this.gameState !== this.PLAYING ? this.gameState = this.PLAYING : 
				//this.gameState = this.PAUSED;
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
                                    desconto : 5,
                                    cenario : this.cenario
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

Game.prototype.removeInvisibleObjects = function (info){
    let { objetos, sprites } = info;
    for(let espec in objetos){
		let objetoEspecifico = objetos[espec];
		if(objetoEspecifico.status === "INVISIBLE"){
			this.removeObjects({ 
                                objectOnRemove : objetoEspecifico,
                                array : objetos
                            });
			this.removeObjects({
                                    objectOnRemove : objetoEspecifico,
                                    array : sprites
                                });
			espec--;
		}
	}
}

Game.prototype.clearObjectsModePause = function (char) {
    for(let sce in char.scenePause){
		this.removeObjects({
                                objectOnRemove : char.scenePause[sce],
                                array : char.sprites
                            });
		this.removeObjects({
                                objectOnRemove : char.scenePause[sce],
                                array : char.scenePause
                            });
		sce--;
	}
	for(let ali in char.alimentosPaused){
		this.removeObjects({
                                objectOnRemove : char.alimentosPaused[ali],
                                array : char.sprites
                            });
		this.removeObjects({
                                objectOnRemove : char.alimentosPaused[ali],
                                array : char.alimentosPaused
                            });
		ali--;
	}
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
	this.leaveBorder({ 
                        inimigoType1 : char,
                        paused : 0
     });
	
	char.collideWallChar(this.cenario);
	char.collideCharFruit({
                                frutas : this.frutas,
                                game : this
                        });
	char.collideCharInimigos({
                                inimigos : this.inimigos,
                                game : this
                            });
	this.removeInvisibleObjects({
                                    objetos : this.frutas,
                                    sprites : this.sprites
                                });
    this.removeInvisibleObjects({
                                    objetos : this.inimigos,
                                    sprites : this.sprites
                                });
    this.removeInvisibleObjects({
                                    objetos : char.lifeIcons,
                                    sprites : char.sprites
                                });
	
	//atualiza a posição do personagem
	!char.collideTrueOrFalse ? this.setMove(char) : this.setPosition(char);
	//------------------------seta o movimento/ seta o recoy caso o inimigo venha a colida com o cenário;
	
	//Animação do modo pause 
	char.gameState !== "PAUSED" ? this.clearObjectsModePause(char) :char.gameState = "PAUSED";
}

Game.prototype.setNewPosition = function (sprite){
    sprite.sourceX >= 825 ? sprite.moreOrLess = -1 : sprite.sourceX <= 525 ? sprite.moreOrLess = 1 : sprite.moreOrLess = sprite.moreOrLess;
	sprite.sourceX += (75 * sprite.moreOrLess);
} 

Game.prototype.ChangeBackground = function () {
    this.delayMudancaDeCor = 0;
	for(let i in this.sprites){
		let sprite = this.sprites[i];
		sprite.type === "DYNAMICBACKGROUND" ? this.setNewPosition(sprite) : this.delayMudancaDeCor++;
	}
}

Game.prototype.Animations = function (char) {
    this.ChangeBackground();
	char.ChangeChar();
	char.ChangeLife();
}

Game.prototype.setAnimationWin = function () {
    //animation win
}

Game.prototype.updateWin = function () {
    this.setAnimationWin();
}

Game.prototype.verifyStateGame = function (char) {
    this.contadorDeTempo === this.delayMudancaDeCor ? this.Animations(char) : this.delayMudancaDeCor++;
	//define as ações com base no estado do jogo
	switch(this.gameState){
		case this.LOADING:
			console.log('LOADING...');
			break;
		case this.PLAYING:
			
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
            this.update(char);
			char.contadorDePausa = 0;
		},
		WIN : () => {
			char.status = "INVISIBLE";
			//removeInvisibleObjects(game.sprites, game.players);
			this.gameState = this.OVER;
			char.contadorDeWin += 1;
			char.contadorDeWin === 1 ? createSceneWin({
                game : this,
                char : char               
            })
             : this.updateWin();
		},
		LOSE : () => {
			char.status = "INVISIBLE";
			//removeInvisibleObjects(game.sprites, game.players);
			this.gameState = this.OVER;
			char.contadorDeLose += 1;
			char.contadorDeLose === 1 ? createSceneLose({
                char : char
            })
             : char.updateLose();
		},
		INIT : () => {
			char.contadorDePausa += 1;
			char.contadorDePausa === 1 ? createScenePause({
                pause : false,
                char : char
            })
             : char.updatePause(this);
			
		}
	}
	playerGameState[`${char.gameState}`]();
}