import { SceneClass } from '../objects.js'
import { Classification, playerPosition, lookPodium } from '../classification.js'

export const createSceneWin = (info) => {
    let { game, char } = info;
    let tableList = Classification(info);
    tableList["position"] = playerPosition(tableList);
    tableList["game"] = game;
	lookPodium(tableList);
	let backgroundWin = new SceneClass( {
										sourceX : 4806,
										sourceY : 162,
										width : 500,
										height : 550,
										x : 0,
										y : 0,
										status : "VISIBLE"
									} );
	game.sprites.push(backgroundWin); 
}


export const createSceneLose = (info) => {
    let { char } = info;
	let backgroundLose = new SceneClass( {
										sourceX : 2306,
										sourceY : 163,
										width :  500,
										height : 550,
										x : 0,
										y : 0,
										status : "VISIBLE"
									} );
	char.sprites.push(backgroundLose);
	char.sceneLose.push(backgroundLose);
}


export const createScenePause = (info) => {
    let { pause, char, game } = info;
	let backgroundPause = 0;
	//for(let i in char.sprites){
	//	char.sprites[i].status = "INVISIBLE";
	//}
	//for(let f in game.sprites){
	//	game.sprites[f].status = "INVISIBLE";
	//}
	pause ? backgroundPause = new SceneClass( {
											sourceX : 1803,
											sourceY : 161,
											width :  500,
											height : 550,
											x : 0,
											y : 0,
											status : "VISIBLE"
										} ) :
			backgroundPause = new SceneClass( {
											sourceX : 1000,
											sourceY : 161,
											width : 500,
											height : 550,
											x : 0,
											y : 0,
											status : "VISIBLE"
										} );
	char.sprites.push(backgroundPause);
	char.scenePause.push(backgroundPause);
	for(let alimento = 0; alimento < 6; alimento++){
		let alimentoEspec = new SceneClass( {
											sourceX : char.alimentosPausedX[alimento],
											sourceY : 0,
											width : 50,
											height : 55,
											x : char.alimentosPausedPositionX[alimento], y : char.alimentosPausedPositionY[alimento],
											status : "VISIBLE"
										} );
		char.sprites.push(alimentoEspec);
		char.alimentosPaused.push(alimentoEspec);
	}
	let playButton = new SceneClass( {
									sourceX : 1500,
									sourceY : 161,
									width : 300,
									height : 116,
									x : Math.trunc((500) / 2) - Math.trunc( (300 / 2) ), y : Math.trunc((550) / 2) - Math.trunc( (116 / 2) ),
									status : "VISIBLE"
								} );
	char.sprites.push(playButton);
	char.scenePause.push(playButton);
}