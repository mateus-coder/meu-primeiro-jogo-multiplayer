import { Sprite } from '../objects.js'
import { Classification, playerPosition, lookPodium } from '../classification.js'

export const createSceneWin = (info) => {
    let { game, char } = info;
    let tableList = Classification(info);
    tableList["position"] = playerPosition(tableList);
    tableList["game"] = game;
	lookPodium(tableList);
	let backgroundWin = new Sprite(4806,162,500,550,0,0);
	game.sprites.push(backgroundWin); 
}


export const createSceneLose = (info) => {
    let { char } = info;
	let backgroundLose = new Sprite(2306,163,500,550,0,0);
	char.sprites.push(backgroundLose);
	char.sceneLose.push(backgroundLose);
}


export const createScenePause = (info) => {
    let { pause, char } = info;
	let backgroundPause;
	pause ? backgroundPause = new Sprite(1803,161,500, 550, 0, 0) : backgroundPause = new Sprite(1000,161,500, 550, 0, 0);
	char.sprites.push(backgroundPause);
	char.scenePause.push(backgroundPause);
	for(let alimento = 0; alimento < 6; alimento++){
		let alimentoEspec = new Sprite(char.alimentosPausedX[alimento],0,50,55,char.alimentosPausedPositionX[alimento], char.alimentosPausedPositionY[alimento]);
		char.sprites.push(alimentoEspec);
		char.alimentosPaused.push(alimentoEspec);
	}
	let playButton = new Sprite(1500,161,300,116,Math.trunc((500) / 2) - Math.trunc( (300 / 2) ), Math.trunc((550) / 2) - Math.trunc( (116 / 2) )  );
	char.sprites.push(playButton);
	char.scenePause.push(playButton);
}