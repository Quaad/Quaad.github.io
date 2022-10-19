// Select the canvas
const canvas = document.querySelector('#myCanvas');
// get the canvas context
let ctx = canvas.getContext('2d');

let count = document.getElementById('counter');
let health = document.getElementById('health')

// starting coordinates
let playerX=100
let playerY=0
let counter=1
count.innerText = "Score: " + counter
health.innerText = "Health: " + 3

// maze data 
let row = [
    [1,1,0,1,1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,2,1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,1],
    [1,0,1,1,0,1,0,0,0,0,0,1],
    [1,0,1,0,1,1,0,1,1,1,1,1],
    [1,0,1,0,0,0,0,0,1,0,0,1],
    [1,0,1,0,1,1,1,0,0,0,1,1],
    [1,0,1,0,1,1,1,1,1,0,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,0,1,1,1,1,1,0,1,0,1],
    [1,1,1,1,1,1,1,1,0,1,1,1]
]

// Maze generator
for (let r = 0; r < row.length; r++) {
    for(let c = 0; c < row[0].length; c++) {
        ctx.fillStyle = 'blue';
        if(row[r][c]==1) {
            ctx.fillRect((c*50), (r*50), 50, 50);
        } else if (row[r][c]==2) {
            ctx.fillStyle = 'Yellow';
            ctx.fillRect((c*50), (r*50), 50, 50);
        }
    }
}

// Drawing the player and checking if they've reached the end
function drawPlayer() {
    // set fill for blocks
    ctx.fillStyle = 'red';
    // draw a rectangle with fill 
    ctx.fillRect(playerX, playerY, 50, 50);
    // ctx.strokeRect(50, 50, 150, 100);
    if (playerX==400 && playerY==550) {
        console.log("GOAL")
    }
}

function removePlayer() {
    // set fill for blocks back to default white
    ctx.fillStyle = 'white';
    // draw a rectangle with fill 
    ctx.fillRect(playerX, playerY, 50, 50);
    // ctx.strokeRect(50, 50, 150, 100);
}

// Check for key input
document.onkeydown = function (e) {
    keyPressed(e)
};

// key input translated for movement
function keyPressed(event) {
    event.preventDefault(); 
    if (event.keyCode < 37 || event.keyCode > 40) {
    return;
    }

    switch (event.keyCode) {
        case 37:
        moveLeft()
        break;
        
        case 38:
        moveUp()
        // move player up
        break;
        
        case 39:
        // move player right
        moveRight()
        break;
        
        case 40:
        // move player down
        moveDown()
        break;
    }
}

function moveUp() {
    var imgd = ctx.getImageData(playerX, playerY-25, 25, 25);
    var pix = imgd.data;
    let blue = 0;
    if(pix[0] == 0 && pix[1] == 0 && pix[2] == 255) {
        console.log("that's blue")
        blue = 1;
    }
    if (playerY>0 && !blue) {
        removePlayer()
        playerY=playerY-50
        drawPlayer()
    } 
 
}

function moveDown() {
    var imgd = ctx.getImageData(playerX, playerY+75, 25, 25);
    var pix = imgd.data;
    let blue = 0;
    if(pix[0] == 0 && pix[1] == 0 && pix[2] == 255) {
        console.log("that's blue")
        blue = 1;
    }
    if (playerY<550  && !blue) {
        removePlayer()
        playerY=playerY+50
        drawPlayer()
    } 
}

function moveLeft() {
    var imgd = ctx.getImageData(playerX-25, playerY, 25, 25);
    var pix = imgd.data;
    let blue = 0;
    if(pix[0] == 0 && pix[1] == 0 && pix[2] == 255) {
        console.log("that's blue")
        blue = 1;
    }
    if (playerX>0  && !blue) {
        removePlayer()
        playerX=playerX-50
        drawPlayer()
    } 
}

function moveRight() {
    var imgd = ctx.getImageData(playerX+75, playerY, 25, 25);
    var pix = imgd.data;
    let blue = 0;
    if(pix[0] == 0 && pix[1] == 0 && pix[2] == 255) {
        console.log("that's blue")
        blue = 1;
    }
    if (playerX<550  && !blue) {
        removePlayer()
        playerX=playerX+50
        drawPlayer()
    } 
}

drawPlayer()