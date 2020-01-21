import { Sprite, SpriteDynamic }  from '../objects.js'
import Scene from './sceneModels.js'

export default initScene = function(game) {
    //fundo -----------------------------------
    let background = new Sprite(0, 162,500, 550, 0, 0);
    game.sprites.push(background);
        
    for(let x = 0; x < 20; x++){
        for(let y = 0; y < 20; y++){
            switch(Scene.mapa[x][y]){
                case 3:
                    if((Math.floor(Math.random()*10)) > 7){
                        let fruta = new Sprite(84, 131, 25,25,Scene.muro[x][y], x*25);
                        game.sprites.push(fruta);
                        game.frutas.push(fruta);
                    }
                    break;
                case 1:
                    let paredeSprite = new SpriteDynamic(500,112,25,50,25*y,Scene.parede[x][y]);
                    game.sprites.push(paredeSprite);
                    game.cenario.push(paredeSprite);
                    break;
                case 2:
                    let muroSprite = new SpriteDynamic(450,137,50,25,Scene.muro[x][y], 25*x);
                    game.sprites.push(muroSprite);
                    game.cenario.push(muroSprite);
                    break;
            }
        }
    }
}
