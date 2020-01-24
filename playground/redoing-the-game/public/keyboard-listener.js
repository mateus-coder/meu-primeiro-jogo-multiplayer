export default function createKeyboardListener () {
    this.observers = [];
    this.playerId = null;
}
createKeyboardListener.prototype.initHandleKeys = function (document){
    console.log(this.observers);
    document.addEventListener('keyup', (e) => {
        this.handleKeyup({
            event : e,
            objeto : this
        })
    })
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

createKeyboardListener.prototype.handleKeyup = function (params) {
    let { event, objeto } = params
    const keyPressed = event.key

    const command = {
        type: 'move-player',
        playerId: objeto.playerId,
        keyPressed,
    }

    objeto.notifyAll(command)
}