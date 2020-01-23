export default function renderScreenLoop(screen, game, requestAnimationFrame, char, img) {
    const command = {
                        type : 'verify-state',
                        char : char
                    }
    game.notifyAll(command)
    const context = screen.getContext('2d')
    context.clearRect(0,0,screen.width,screen.height);
	//itens gerais para todos os players
	if(game.sprites.length !== 0){
		for(let i in game.sprites){
			let spr = game.sprites[i];
			if(spr.status === "VISIBLE"){
                //colocar sourcX diferente para o personagem que o usuário controla
                char === spr ? 
                context.drawImage(img,spr.sourceX,spr.sourceY,spr.width,spr.height,Math.floor(spr.x),Math.floor(spr.y),spr.width,spr.height) :
                context.drawImage(img,spr.sourceX,spr.sourceY,spr.width,spr.height,Math.floor(spr.x),Math.floor(spr.y),spr.width,spr.height)
			}
		}
    }
    console.log(char);
	//itens específicos de cada player
	if(char.sprites.length !== 0){
		for(let gameSprite in char.sprites){
			let sprEspecifico = char.sprites[gameSprite];
			if(sprEspecifico.status === "VISIBLE"){
				context.drawImage(img,sprEspecifico.sourceX,sprEspecifico.sourceY,sprEspecifico.width,sprEspecifico.height,Math.floor(sprEspecifico.x),Math.floor(sprEspecifico.y),sprEspecifico.width,sprEspecifico.height);
			}
		}
	}

    requestAnimationFrame(() => {
        renderScreenLoop(screen, game, requestAnimationFrame, char, img)
    })
}
