import { Sprite, SpriteDynamic, SceneClass }  from '../objects.js'
import { Scene } from './sceneModels.js'

export default function initScene (game) {
    //fundo -----------------------------------
    let background = new SceneClass( {
                                        sourceX : 0,
                                        sourceY : 162,
                                        width : 500,
                                        height : 550,
                                        x : 0,
                                        y : 0,
                                        status : "VISIBLE"
                                    } );
    game.sprites.push(background);
        
    for(let x = 0; x < 20; x++){
        for(let y = 0; y < 20; y++){
            switch(Scene.mapa[x][y]){
                case 3:
                    if((Math.floor(Math.random()*10)) > 7){
                        let fruta = new SceneClass( {
                                                    sourceX : 84,
                                                    sourceY : 131,
                                                    width : 25,
                                                    height : 25,
                                                    x : Scene.muro[x][y],
                                                    y : x*25,
                                                    status : "VISIBLE"
                                                } );
                        game.sprites.push(fruta);
                        game.frutas.push(fruta);
                    }
                    break;
                case 1:
                    let paredeSprite = new SpriteDynamic( {
                                                        sourceX : 500,
                                                        sourceY : 112,
                                                        width : 25,
                                                        height : 50,
                                                        x : 25*y,
                                                        y : Scene.parede[x][y],
                                                        status : "VISIBLE"
                                                    } );
                    game.cenario.push(paredeSprite);
                    break;
                case 2:
                    let muroSprite = new SpriteDynamic( {
                                                        sourceX : 450,
                                                        sourceY : 137,
                                                        width : 50,
                                                        height : 25,
                                                        x : Scene.muro[x][y],
                                                        y : 25*x,
                                                        status : "VISIBLE"
                                                    } );
                    game.cenario.push(muroSprite);
                    break;
            }
        }
    }
}
