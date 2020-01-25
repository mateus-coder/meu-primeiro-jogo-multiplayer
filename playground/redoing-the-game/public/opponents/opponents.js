
import { InimigoObj } from '../objects.js' 

export default function opponents (game) {
    //inimigos-----------------------------------
	for(let ç = 0; ç < 3; ç++){ 
		let inimigo = new InimigoObj( {
										sourceX : 750,
										sourceY : game.tiposDeInimigosSourceY[ç],
										width : 50,
										height : 50,
										x : game.posicoesIniciaisInimigosX[ç], 		y:game.posicoesIniciaisInimigosY[ç]
									} );
		game.sprites.push(inimigo);
		game.inimigos.push(inimigo);
	}
}