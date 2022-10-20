// Select the canvas
const canvas = document.querySelector('#myCanvas');
// get the canvas context
let ctx = canvas.getContext('2d');

let points = document.getElementById('points');
let health = document.getElementById('health')

// starting coordinates
let playerX=100
let playerY=0
let score=0
points.innerText = "Score: " + score
health.innerText = "Health: " + 3

// maze data 
let map = [
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
for (let r = 0; r < map.length; r++) {
    for(let c = 0; c < map[0].length; c++) {
        ctx.fillStyle = 'blue';
        if(map[r][c]==1) {
            ctx.fillRect((c*50), (r*50), 50, 50);
        } else if (map[r][c]==2) {
            ctx.fillStyle = 'Yellow';
            ctx.fillRect((c*50), (r*50), 50, 50);
        }
    }
}

// Drawing the player and checking if they've reached the end
function drawPlayer() {
    // set fill for blocks
    ctx.fillStyle = 'green';
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
        movePlayer("left")
        break;
        
        case 38:
        movePlayer("up")
        // move player up
        break;
        
        case 39:
        // move player right
        movePlayer("right")
        break;
        
        case 40:
        // move player down
        movePlayer("down")
        break;
    }
}

// move player function
function movePlayer(direction) {
    // set variables 
    let colour = 0
    if(direction == "up") {
        let colour = checkMaze(25, direction)
        if (playerY>0 && !colourCheck(colour)) {
            removePlayer()
            playerY=playerY-50
            drawPlayer()
        } 
    } else if(direction == "down"){
        let colour = checkMaze(75, direction)
        if (playerY<550 && !colourCheck(colour)) {
            removePlayer()
            playerY=playerY+50
            drawPlayer()
        } 
    } else if(direction == "left") {
        let colour = checkMaze(25, direction)
        if (playerY>0 && !colourCheck(colour)) {
            removePlayer()
            playerX=playerX-50
            drawPlayer()
        } 
    } else if(direction == "right") {
        let colour = checkMaze(75, direction)
        if (playerY<550 && !colourCheck(colour)) {
            removePlayer()
            playerX=playerX+50
            drawPlayer()
        } 
    }
    if(colour == 2) {
        score+= 50
        points.innerText = "Score: " + score
    }
}

// Check colour to determine if player should move or gain points
function colourCheck(colour) {
    if(colour == 1) {
        return 1
    } if(colour == 2) {
        // increment points if colour was yellow
        score+= 50
        points.innerText = "Score: " + score
        return 0
    } else {
        return 0
    }
}

// Check what location the player is attempting to move into
// if it's a wall, then they will be unable to move
function checkMaze(coordinate, direction) {
    if(direction == "up") {
        var imgd = ctx.getImageData(playerX, playerY-coordinate, 25, 25);
    } else if(direction == "down") {
        var imgd = ctx.getImageData(playerX, playerY+coordinate, 25, 25);
    } else if(direction == "left") {
        var imgd = ctx.getImageData(playerX-coordinate, playerY, 25, 25);
    } else if(direction == "right") {
        var imgd = ctx.getImageData(playerX+coordinate, playerY, 25, 25);
    }
    var pix = imgd.data
    if(pix[0] == 0 && pix[1] == 0 && pix[2] == 255) {
        console.log("checkmaze: that's blue")
        return 1
    } else if(pix[0] == 255 && pix[1] == 255 && pix[2] == 0) {
        console.log("checkmaze: that's yellow")
        return 2
    }
    return 0;
}

// Old Move function was repeated multiple times
function moveDown() {
    var imgd = ctx.getImageData(playerX, playerY+75, 25, 25);
    var pix = imgd.data;
    let blue = 0;
    let yellow = 0;
    if(pix[0] == 0 && pix[1] == 0 && pix[2] == 255) {
        console.log("that's blue")
        blue = 1;
    } else if(pix[0] == 255 && pix[1] == 255 && pix[2] == 0) {
        console.log("that's yellow")
        yellow = 1
    }
    if(playerY<550 && yellow) {
        removePlayer()
        playerY=playerY+50
        drawPlayer()
        score+= 50
        points.innerText = "Score: " + score
        return
    }
    if (playerY<550  && !blue) {
        removePlayer()
        playerY=playerY+50
        drawPlayer()
    } 
}

drawPlayer()