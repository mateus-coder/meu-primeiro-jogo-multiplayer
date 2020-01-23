import { collide } from './collide.js'

export const colliding = {
	collideTop : (info) => {
        let { player, desconto } = info;
		player.y -= desconto;
		colliding["collideAllScene"](info);
		player.collideTrueOrFalseAllScene ? colliding["collideDown"](info) : player.positionY = -desconto;
		player.y += desconto;
	},
	collideDown : (info) => {
        let { player, desconto } = info;
		player.y += desconto;
		colliding["collideAllScene"](info);
		player.collideTrueOrFalseAllScene ? colliding["collideLeft"](info) : player.positionY = desconto;
		player.y -= desconto;
	},
	collideLeft : (info) => {
        let { player, desconto } = info;
		player.x -= desconto;
		colliding["collideAllScene"](info);
		player.collideTrueOrFalseAllScene ? colliding["collideRight"](info) : player.positionX = -desconto;
		player.x += desconto;
	},
	collideRight : (info) => {
        let { desconto, player, cenario } = info;

 		player.x += desconto;
        colliding["collideAllScene"](info);

        info = {
            player : player,
            desconto : desconto--,
            cenario : cenario
        }

		player.collideTrueOrFalseAllScene ? colliding["collideTop"](info) : player.positionX = desconto; 
		player.x -= desconto;
	},
	collideAllScene : (info) => {
        let { player, cenario } = info
		//colisoes char x cenário 
		player.colisoes = 0;
		player.collideTrueOrFalseAllScene = false;
		for(let j = 0; j < cenario.length; j++){
			let thisCenario = cenario[j];
			if(collide(player, thisCenario)){
				player.colisoes += 1;
				if(player.colisoes == 1){
					player.collideTrueOrFalseAllScene = true;
				}
			}
		}
	}
}


export const collidingInimigo = {
    RIGHT : (info) => {
        let { player } = info
		player["x"] += 5;
		colliding["collideAllScene"](info);
		player["vy"] = 0;
		player["vx"] = 5;
		player["x"] -= 5;
		player.setSourceX(player, 750);
	},
	LEFT : (info) => {
        let { player } = info
		player["x"] -= 5;
		colliding["collideAllScene"](info);
		player["vy"] = 0;
		player["vx"] = -5;
		player["x"] += 5;
		player.setSourceX(objeto, 900);
	},
	DOWN : (info) => {
        let { player } = info
		player["y"] += 5;
		colliding["collideAllScene"](info);
		player["vy"] = 5;
		player["vx"] = 0;
		player["y"] -= 5;
		player.setSourceX(player, 850);
	},
	TOP : (info) => {
        let { player } = info
		player["y"] -= 5;
		colliding["collideAllScene"](info);
		player["vy"] = -5;
		player["vx"] = 0;
		player["y"] += 5;
		player.setSourceX(player, 800);
	}
}