const createKeyboardListener = function () {
    this.observers = [];
    this.playerId = null;
}
createKeyboardListener.prototype.initHandleKeys = function (document){
    document.addEventListener('keydown', this.handleKeydown)
}

createKeyboardListener.prototype.registerPlayerId = function (playerId){
    this.playerId = playerId
}

createKeyboardListener.prototype.subscribe = function (observerFunction) {
    this.observers.push(observerFunction)
}

createKeyboardListener.prototype.notifyAll = function (command) {
    for (const observerFunction of this.observers) {
        observerFunction(command)
    }
}

createKeyboardListener.prototype.handleKeydown = function (event) {
    const keyPressed = event.key

    const command = {
        type: 'move-player',
        playerId: this.playerId,
        keyPressed
    }

    this.notifyAll(command)
}