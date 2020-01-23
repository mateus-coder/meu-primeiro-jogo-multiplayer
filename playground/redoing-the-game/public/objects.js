import { colliding, collidingInimigo } from './collisions/colliding.js'
import { collide } from './collisions/collide.js'

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

Sprite.prototype.collideWallChar = function (cenario) {
    //colisoes char x cenário 
	this.colisoes = 0;
	this.collideTrueOrFalse = false;
	
	for(let j = 0; j < cenario.length; j++){
		let thisCenario = cenario[j];
		if(collide(this, thisCenario)){
			this.colisoes += 1;
			if(this.colisoes == 1){
				this.collideTrueOrFalse = true;
				this.positionX = this.positionY = 0;
				const collideFunctions = colliding["collideTop"];
				collideFunctions({ 
                                    player : this,
                                    desconto : 5,
                                    cenario : cenario
                                });
				this.vx = 0;
				this.vy = 0;
				
			}
		}//fim do if
		
	}//fim do for j
}

Sprite.prototype.setSourceY = function (obj, value){
    obj.sourceY = value;
}

Sprite.prototype.setSourceX = function (obj, value) {
	obj.sourceX = value;
}

Sprite.prototype.changeSkin = function (typeChange) {
    const funcoesInternas = {
		"EMAGRECE" : () => {
			this.sourceY === 162 ? this.sourceY *= 1 : this.setSourceY(this, this.sourceY - 50);
		},
		"ENGORDA" : () => {
			this.sourceY === 462 ? this.sourceY *= 1 : this.setSourceY(this, this.sourceY + 50);
		}
	}
	const exec =  funcoesInternas[`${typeChange}`];
	exec();
}

Sprite.prototype.setPointsInScreen = function () {

}

Sprite.prototype.gameWin = function () {
    this.setPointsInScreen();
    this.gameState = "WIN";
}

Sprite.prototype.verifyGameWin = function () {
    this.points === 5 ? this.gameWin() : this.setPointsInScreen();	
}

Sprite.prototype.collideCharFruit = function (info) {
    let { frutas, game } = info
    for(let k in frutas){
		if( collide(this, frutas[k]) && frutas[k].status !== "INVISIBLE" ){
			this.points += 1;
			this.verifyGameWin();
			frutas[k].status = "INVISIBLE";
			this.changeSkin("EMAGRECE");
		}
	}
}

Sprite.prototype.gameLose = function (indice) {
    this.lifeIcons[indice].status = "INVISIBLE";
	this.gameState = "LOSE";
}

Sprite.prototype.verifyGameLose = function (indice) {
    indice === 0 ? this.gameLose(indice)  :
	this.lifeIcons[indice].status = "INVISIBLE";
}

Sprite.prototype.collideCharInimigos = function (info) {
    let { inimigos, game } = info;
    for(let ini in inimigos){
		if( collide(this, inimigos[ini]) && inimigos[ini].status !== "INVISIBLE" ){
			this.loser -= 1;
			this.verifyGameLose(this.loser);
			inimigos[ini].status = "INVISIBLE";
			this.changeSkin("ENGORDA");
			for(let ç = 0; ç < 1; ç++){
				let inimigo = new InimigoObj(750,game.tiposDeInimigosSourceY[ç],50,50,game.posicoesIniciaisInimigosX[ç],game.posicoesIniciaisInimigosY[ç]);
				game.sprites.push(inimigo);
				game.inimigos.push(inimigo);
			}
		}
	}
}

Sprite.prototype.ChangeChar = function () {
    this.sourceX === 700 ? this.setSourceX(this, 500) : this.setSourceX(this, this.sourceX + 50);
}

Sprite.prototype.ChangeLife = function () {
    for(let ic in this.lifeIcons){
		let icone = this.lifeIcons[ic];
		icone.sourceY === 111 ? this.setSourceY(icone, 61) : this.setSourceY(icone, 111);
	}
}

//updates 
Sprite.prototype.updatePause = function (game) {
	this.setAnimationPaused(game);
}
Sprite.prototype.updateLose =  function (){
	this.setAnimationLose();
}

//animations scenes

Sprite.prototype.setReverseAnimation = function (info) {
    let { alimento, veloX, positX } = info;
    alimento.vx = veloX * -1;
	alimento.x = positX;
}

Sprite.prototype.setAnimationPaused = function (game)  {
	for(let obj in this.alimentosPaused){
		let alimento = this.alimentosPaused[obj];
		alimento.vy = 2;
		const velocidadeX = alimento.vx;
		const positionX = alimento.x;
		this.contadorDePausa % 5 === 0 ?
		game.leaveBorder({
                            inimigoType1 : alimento,
                            paused : 50
                        }) ?
        this.setReverseAnimation({
            alimento : alimento,
            veloX : velocidadeX,
            positX : positionX
        }) :
        alimento.vy *= 1 :
        game.leaveBorder({
            inimigoType1 : alimento,
            paused : 50    
        });
	    game.setMove(alimento);
	}
}
Sprite.prototype.setAnimationLose = function ()  {
	this.contadorDeLose % 30 === 0 && this.sceneLose[0].sourceX < 4200 ? this.setSourceX(this.sceneLose[0], this.sceneLose[0].sourceX + 500 ) : this.contadorDeLose *= 1;
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
export var LifeIcons = function(sourceX, sourceY, width, height, x, y){
	Sprite.call(this, sourceX, sourceY, width, height, x, y);
}
LifeIcons.prototype = Object.create(Sprite.prototype);

