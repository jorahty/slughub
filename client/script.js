let socket = io();

let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;

buttons = document.querySelectorAll('button');
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('touchstart', () => {
        buttons[i].style.backgroundColor = 'yellow';
        socket.emit('input', buttons[i].id);
    });
    buttons[i].addEventListener('mousedown', () => {
        buttons[i].style.backgroundColor = 'yellow';
        socket.emit('input', buttons[i].id);
    });
    buttons[i].addEventListener('touchend', () => {
        buttons[i].style.backgroundColor = '#f0f0f0';
        socket.emit('input', buttons[i].id);
    });
    buttons[i].addEventListener('mouseup', () => {
        buttons[i].style.backgroundColor = '#f0f0f0';
        socket.emit('input', buttons[i].id);
    });
}

socket.on('update', gamestate => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const player of Object.values(gamestate.players)) {
        let x = player.position.x;
        let y = player.position.y;
        context.fillStyle = player.color;
        context.fillRect(x, y, 50, 50);
    }
});