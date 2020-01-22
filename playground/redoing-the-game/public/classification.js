import { Sprite } from "./objects";

export default Classification = (info) => {
    let { game, char } = info;
    let vencedor = segundo = terceiro = maiorPontuador = char;
	let classification = [];
	let cont = posicaoJDoMaior = 0;
	for(let player in game.players){
		classification.push(game.players[player]);
		game.players[player].indiceReal = player;
	}
	for(let i = 0; i < classification.length - 1; i++){//última posição não precisa ser considerada;
		cont = 0;
		for(let j = i; j < classification.length - 1; j++){
			cont++;
			if(cont === 1){
				maiorPontuador = classification[j];
				posicaoJDoMaior = j;
			}
			else{
				if(classification[j].points > maiorPontuador.points){
					maiorPontuador = classification[j];
					posicaoJDoMaior = j;
				}
			}
		}
		classification[posicaoJDoMaior] = classification[i];
		classification[i] = maiorPontuador;
    }
    return {
                classification : classification,
                char : char
            };
}

export default playerPosition = (info) => {
    let { classification, char } = info;
    let positionClassificationUser = 0;
    for(let play in classification){
		classification[play].indiceReal === char.indiceReal ? positionClassificationUser = play : positionClassificationUser *= 1;
    }
    return positionClassificationUser + 1;
}

export default lookClassification  = (info) => {

}

export default lookPodium = (info) => {
    let { classification, position, game } = info;
    let positionPodiumY = [200, 300, 400];
    let positionPodiumX = [50, 200, 350];
    //---------------------1º---2º--3º---------
    for(let i = 0; i < 3; i++){
        let topPlayers = new Sprite(500,162,50,50,positionPodiumX[i], positionPodiumY[i]);
        game.push(topPlayers);
    }
}