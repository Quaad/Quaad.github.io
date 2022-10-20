// Select the canvas
const canvas = document.querySelector('#myCanvas')

// get the canvas context
let ctx = canvas.getContext('2d')

// User Text display
let points = document.getElementById('points')
let health = document.getElementById('health')
let goal = document.getElementById('goal')
let item = document.getElementById('item')

// global variables
let playerX = 0
let playerY = 0
let score = 0
let playerMovement = 0
let hp = 0
let weapon = 0

// intial end goal set
let goalX = 0
let goalY = 0

// intial variable to store maze arrays
let maze
// initialize the fetchdata function 
fetchData()

// Button onclick press trigger map select
function fetchMap(mapName) {
    fetchData(mapName)
}

// async function to ensure data loads first before generating the maze and starting the game
async function fetchData(mazeMap) {
    let myPromise = new Promise(function(resolve, reject) {
        resolve(fetch("./configs/configs.json")
        .then(function(resp){
            return resp.json()
        }));
      });
      maze = await myPromise
    
    //   maze configurations stored
    let maze1 = maze.config1.maze1
    let maze2 = maze.config2.maze2

    if(mazeMap == null) {
        // Default set to maze1 otherwise select map based on chosen
        mazeMap = "map1"
    }

    // chosen map
    if(mazeMap == "map1") {
        map = maze1
        goalX = maze.config1.goalX
        goalY = maze.config1.goalY
        
    } else if(mazeMap == "map2") {
        map = maze2
        goalX = maze.config2.goalX
        goalY = maze.config2.goalY
    } 

    function gameStart() {
        // setting player starting variables and text variables
        removePlayer()
        goal.innerText = ""
        score=0
        weapon = 0
        hp = 3
        playerMovement = 50
        pointsCheck()
        hpCheck()
        weaponCheck()
        // Maze generator
        for (let r = 0; r < map.length; r++) {
            for(let c = 0; c < map[0].length; c++) {
                ctx.fillStyle = 'blue'
                if(map[r][c]==1) {
                    ctx.fillRect((c*50), (r*50), 50, 50);
                } else if (map[r][c]==2) {
                    ctx.fillStyle = 'Yellow';
                    ctx.fillRect((c*50), (r*50), 50, 50);
                } else if(map[r][c]==3) {
                    ctx.fillStyle = 'orange';
                    ctx.fillRect((c*50), (r*50), 50, 50);
                } else if(map[r][c]==4) {
                    ctx.fillStyle = 'red';
                    ctx.fillRect((c*50), (r*50), 50, 50);
                } else if(map[r][c]==5) {
                    ctx.fillStyle = 'pink';
                    ctx.fillRect((c*50), (r*50), 50, 50);
                } else {
                    ctx.fillStyle = 'white';
                    ctx.fillRect((c*50), (r*50), 50, 50);
                }
            }
        }
        playerstart()
        drawPlayer()
    }

    // Player Coordinates start in a white space
    function playerstart() {
        notWhite = true
        while(notWhite) {
            playerX = Math.floor(Math.random() * 12) * 50
            playerY = Math.floor(Math.random() * 12) * 50
            var imgd = ctx.getImageData(playerX, playerY, 25, 25)
            var pix = imgd.data
            if(pix[0] == 255 && pix[1] == 255 && pix[2] == 255) {
                console.log("success")
                notWhite = false
            } else {
                console.log("failure")
            }
        }
    }

    // Drawing the player and checking if they've reached the end
    function drawPlayer() {
        // set fill for blocks
        ctx.fillStyle = 'black'
        // draw a rectangle with fill 
        ctx.fillRect(playerX, playerY, 50, 50)

        // Reaching end coordinates
        if (playerX==goalX && playerY==goalY) {
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

    function hpCheck() {
        health.innerText = "Health: " + hp
        // Hp check
        if(hp == 0) {
            goal.innerText = "You have died"
            playerMovement = 0
        }
    }

    function pointsCheck() {
        points.innerText = "Score: " + score
    }

    function weaponCheck() {
        item.innerText = "items: " + weapon
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
        // set colour variable 
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
            if (playerX>0 && !colourCheck(colour)) {
                removePlayer()
                playerX=playerX-playerMovement
                drawPlayer()
            } 
        } else if(direction == "right") {
            let colour = checkMaze(75, direction)
            if (playerX<550 && !colourCheck(colour)) {
                removePlayer()
                playerX=playerX+playerMovement
                drawPlayer()
            } 
        }
    }

    // Check what location the player is attempting to move into
    // if it's a wall, then they will be unable to move
    function checkMaze(coordinate, direction) {
        if(direction == "up") {
            var imgd = ctx.getImageData(playerX, playerY-coordinate, 25, 25)
        } else if(direction == "down") {
            var imgd = ctx.getImageData(playerX, playerY+coordinate, 25, 25)
        } else if(direction == "left") {
            var imgd = ctx.getImageData(playerX-coordinate, playerY, 25, 25)
        } else if(direction == "right") {
            var imgd = ctx.getImageData(playerX+coordinate, playerY, 25, 25)
        }
        var pix = imgd.data
        if(pix[0] == 0 && pix[1] == 0 && pix[2] == 255) {
            console.log("checkmaze: that's blue")
            return 1
        } else if(pix[0] == 255 && pix[1] == 255 && pix[2] == 0) {
            console.log("checkmaze: that's yellow")
            return 2
        } else if(pix[0] == 255 && pix[1] == 0 && pix[2] == 0) {
            console.log("checkmaze: that's red")
            return 3
        } else if(pix[0] == 255 && pix[1] == 165 && pix[2] == 0) {
            console.log("checkmaze: that's orange")
            return 4
        }
        return 0
    }

    // Check colour to determine if player should move or gain points
    function colourCheck(colour) {
        // Check for blue, yellow and red
        if(colour == 1) {
            return 1
        } else if(colour == 2) {
            // increment points if colour was yellow
            score+= 1
            pointsCheck()
            return 0
        } else if(colour == 3) {
            if(weapon) {
                weapon = weapon-1
                weaponCheck()
                return 0
            } else { 
                hp = hp-1
                hpCheck()
            }
            return 1
        } else if(colour == 4) {
                weapon = weapon + 1
                weaponCheck()
        }
        return 0
    }
    // Start game
    gameStart()
    
}