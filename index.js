const joinGameForm = document.getElementById('joinGameForm')
const createNewGameForm = document.getElementById('createGameForm')

joinGameForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let gamePin = joinGameForm.elements[0].value
    sessionStorage.setItem('pin', gamePin)

    window.location.href = './game.html'
})

createNewGameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simulate a mouse click:
    window.location.href = "./game.html?createNewGame=true"
})