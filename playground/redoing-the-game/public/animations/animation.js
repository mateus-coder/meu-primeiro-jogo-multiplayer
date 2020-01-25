import { restrictMoves, moviments } from "../moviments/movimentsAndRestricts.js";

export const gameAnimations = {
    AnimationsInit : ctx => {
        gameAnimations["backgroundAnimation"](ctx);
        gameAnimations["charAnimation"](ctx);
        gameAnimations["lifeAnimation"](ctx);
    },
    backgroundAnimation : ctx => {
        let { char, game } = ctx
        let newSprites = new Array;
        for(let i in char.sprites){
            let sprite = char.sprites[i];
            if(sprite.type === "DYNAMICBACKGROUND"){
                game.setNewPosition(sprite)
                newSprites.push(sprite)
            }
            else{
                newSprites.push(sprite);
            }
        }
        return (newSprites)
    },
    charAnimation : ctx => {

    },
    lifeAnimation : ctx => {

    }
}

export const pauseAnimations = {
    setReverseAnimation : info => {
        let { alimento, veloX, positX } = info;
        alimento.vx = veloX * -1;
        alimento.x = positX;
    },
    setAnimationPaused : info => {
        let { char } = info
        let { leaveMargin } = restrictMoves
        let { setMove } = moviments
        let { setReverseAnimation } = pauseAnimations
        for(let obj in char.alimentosPaused){
            let alimento = char.alimentosPaused[obj];
            alimento.vy = 2;
            const velocidadeX = alimento.vx;
            const positionX = alimento.x;
            char.contadorDePausa % 5 === 0 ?
            leaveMargin({
                            inimigoType1 : alimento,
                            paused : 50
                        }) ?
            setReverseAnimation({
                alimento : alimento,
                veloX : velocidadeX,
                positX : positionX
            }) :
            alimento.vy *= 1 :
            leaveMargin({
                inimigoType1 : alimento,
                paused : 50    
            });
            setMove(alimento)
        }
    },
    updatePause : info => {
        let { setAnimationPaused } = pauseAnimations
        setAnimationPaused(info);
    }
}