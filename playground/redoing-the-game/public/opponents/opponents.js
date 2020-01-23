
import { InimigoObj } from '../objects.js' 

export default function opponents (game) {
    //inimigos-----------------------------------
	for(let ç = 0; ç < 3; ç++){ 
		let inimigo = new InimigoObj(750,game.tiposDeInimigosSourceY[ç],50,50,game.posicoesIniciaisInimigosX[ç],game.posicoesIniciaisInimigosY[ç]);
		game.sprites.push(inimigo);
		game.inimigos.push(inimigo);
	}
}
   