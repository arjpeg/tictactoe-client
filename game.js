const ws = new WebSocket(getServerURI());
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
const gamePin = document.getElementById('gamePin')
const curPlayerElement = document.getElementById('curPlayer')

const cells = [...document.getElementsByClassName('cell')]
const board = document.getElementById('board')

const playerSymbolElement = document.getElementById('playerSymbol')

function getServerURI() {
    if (window.location.hostname == 'localhost')
        return 'ws://localhost:8003'
    else
        return 'wss://tic-tac-toe-arjpeg.herokuapp.com'
}

function playMove(row, col) {
    ws.send(JSON.stringify({
        type: 'play',
        row: row,
        col: col
    }))
}

function gameReady() {
    curPlayerElement.innerText = "Current player: X"
    board.classList.remove('blur')

    let curCell = 0;

    // Add all the event listeners
    cells.forEach((cell) => {
        let row = Math.floor(curCell / 3)
        let col = curCell % 3;

        cell.addEventListener('click', (e) => {
            playMove(row, col);
        })

        curCell++
    })
}

ws.addEventListener('message', (e) => {
    let msg = JSON.parse(e.data)

    if (msg.type === "init") {
        gamePin.innerText = msg.join
    } else if (msg.type === "gameReady") {
        gameReady()
    } else if (msg.type === "error") {
        alert(msg.message)
        if (msg.message === "Game not found") {
            window.location.href = './'
        }
    } else if (msg.type === "move") {
        board
            .children.item(msg.row)
            .children.item(msg.col)
            .innerText = msg.player;

        curPlayer =
            curPlayerElement.innerText = `Current player: ${msg.player === "X" ? "O" : "X"}`
    } else if (msg.type === 'win') {
        setTimeout(() => alert(msg.player + " won the game!"), 300)
    } else if (msg.type === 'reset') {
        cells.forEach((cell) => {
            cell.innerText = ''
        })

        curPlayerElement.innerText = "Current player: X"
    } else if (msg.type === 'draw') {
        alert("The game ended in a draw!")
    }

    console.log(msg);
})

ws.addEventListener('open', () => {
    if (urlParams.has('createNewGame')) {
        ws.send(JSON.stringify({ "type": "init" }))
        playerSymbolElement.innerText = 'X'
    } else {
        // Join an existing game
        let savedGamePin = sessionStorage.getItem('pin')

        gamePin.innerText = savedGamePin
        ws.send(JSON.stringify({
            "type": "init",
            "join": savedGamePin
        }))

        playerSymbolElement.innerText = 'O'
    }
})