export const moviments = {
    setMove : char => {
        char.x += char.vx;
	    char.y += char.vy;
    }
}

export const restrictMoves = {
    leaveMargin : info => {
        let { inimigoType1, paused } = info;
        //condição se o inimigo sair da borda ele retornar na outra extremidade
        if(inimigoType1.x > 500 - inimigoType1.width){
            inimigoType1.x = 0;
            return true;
        }
        if(inimigoType1.x < 0){
            inimigoType1.x = 500 - inimigoType1.width; // 500(width do canvas) e 550(height do canvas);  
            return true;
        }
        if(inimigoType1.y > (550 - inimigoType1.height) + (- 50 + paused ) ){
            inimigoType1.y = 0;
            return false;
        }
        if(inimigoType1.y < 0 ){
            inimigoType1.y = (550 - inimigoType1.height) + (- 50 + paused );
            return false;
        }
    }
}