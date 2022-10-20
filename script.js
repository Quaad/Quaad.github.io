// Select the canvas
const canvas = document.querySelector('#myCanvas')

// get the canvas context
let ctx = canvas.getContext('2d')

// User Text display
let points = document.getElementById('points')
let health = document.getElementById('health')
let goal = document.getElementById('goal')

// global variables
let playerX = 0
let playerY = 0
let score = 0
let playerMovement = 0

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

function gameStart() {

    // setting player starting variables and text variables
    playerX=100
    playerY=0
    score=0
    playerMovement = 50
    points.innerText = "Score: " + score
    health.innerText = "Health: " + 3

    // Maze generator
    for (let r = 0; r < map.length; r++) {
        for(let c = 0; c < map[0].length; c++) {
            ctx.fillStyle = 'blue'
            if(map[r][c]==1) {
                ctx.fillRect((c*50), (r*50), 50, 50);
            } else if (map[r][c]==2) {
                ctx.fillStyle = 'Yellow';
                ctx.fillRect((c*50), (r*50), 50, 50);
            }
        }
    }

    drawPlayer()
}

// Drawing the player and checking if they've reached the end
function drawPlayer() {
    // set fill for blocks
    ctx.fillStyle = 'green'
    // draw a rectangle with fill 
    ctx.fillRect(playerX, playerY, 50, 50)

    // Reaching end coordinates
    if (playerX==400 && playerY==550) {
        goal.innerText = "Goal Reached!"
        playerMovement = 0
    }
}

// Reset tile back to white
function removePlayer() {
    // set fill for blocks back to default white
    ctx.fillStyle = 'white'
    // draw a rectangle with fill 
    ctx.fillRect(playerX, playerY, 50, 50)
}

// Check for key input
document.onkeydown = function (e) {
    keyPressed(e)
};

// key input translated for movement
function keyPressed(event) {
    event.preventDefault(); 
    if (event.keyCode < 37 || event.keyCode > 40) {
        return
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
    if(playerMovement == 0) {
        return
    }
    // set variables 
    let colour = 0
    if(direction == "up") {
        let colour = checkMaze(25, direction)
        if (playerY>0 && !colourCheck(colour)) {
            removePlayer()
            playerY=playerY-playerMovement
            drawPlayer()
        } 
    } else if(direction == "down"){
        let colour = checkMaze(75, direction)
        if (playerY<550 && !colourCheck(colour)) {
            removePlayer()
            playerY=playerY+playerMovement
            drawPlayer()
        } 
    } else if(direction == "left") {
        let colour = checkMaze(25, direction)
        if (playerY>0 && !colourCheck(colour)) {
            removePlayer()
            playerX=playerX-playerMovement
            drawPlayer()
        } 
    } else if(direction == "right") {
        let colour = checkMaze(75, direction)
        if (playerY<550 && !colourCheck(colour)) {
            removePlayer()
            playerX=playerX+playerMovement
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

gameStart()