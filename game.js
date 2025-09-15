
var myGamePiece;
var myObstacles = [];
var myScore;
var gameInterval;

function startGame() {
    

    var music = document.getElementById("backgroundMusic");
    music.volume = 0.5; 
    music.play().catch(function(error) {
      console.log("Music play prevented:", error);
    });

    if (!myGameArea.canvas) {
        myGameArea.canvas = document.createElement("canvas");
        myGameArea.canvas.width = 480;
        myGameArea.canvas.height = 270;
        myGameArea.context = myGameArea.canvas.getContext("2d");
        document.body.insertBefore(myGameArea.canvas, document.body.childNodes[2]);
    }

    myGamePiece = new component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.05;

    myScore = new component("30px", "Consolas", "black", 380, 40, "text");

    myObstacles = [];
    myGameArea.frameNo = 0;

    clearInterval(gameInterval);
    gameInterval = setInterval(updateGameArea, 20);

    setupControls();
}

var myGameArea = {
    canvas: null,
    context: null,
    frameNo: 0,
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.text = "";
    this.update = function() {
        var ctx = myGameArea.context;
        if (this.type === "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        this.keepInsideCanvas();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.keepInsideCanvas = function() {
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > myGameArea.canvas.width) this.x = myGameArea.canvas.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > myGameArea.canvas.height) this.y = myGameArea.canvas.height - this.height;
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + this.width;
        var mytop = this.y;
        var mybottom = this.y + this.height;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + otherobj.width;
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + otherobj.height;
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) ||
            (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    for (var i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            clearInterval(gameInterval);
            alert("Game Over! Your score: " + myGameArea.frameNo);
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;

    if (myGameArea.frameNo === 1 || everyinterval(150)) {
        var x = myGameArea.canvas.width;
        var minHeight = 20;
        var maxHeight = 200;
        var height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        var minGap = 50;
        var maxGap = 200;
        var gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }

    for (var i = 0; i < myObstacles.length; i++) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }

    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();

    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    return (myGameArea.frameNo / n) % 1 === 0;
}

// Movement control functions
function moveUp() {
    myGamePiece.speedY = -4;
}
function moveDown() {
    myGamePiece.speedY = 4;
}
function moveLeft() {
    myGamePiece.speedX = -4;
}
function moveRight() {
    myGamePiece.speedX = 4;
}
function stopMove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}

function setupControls() {
    // Restart button
    document.getElementById("restartBtn").onclick = function() {
        startGame();
    };

    // Up button
    document.getElementById("upBtn").onmousedown = function() {
        moveUp();
    }
    document.getElementById("upBtn").onmouseup = function() {
        stopMove();
    }
    document.getElementById("upBtn").onmouseleave = function() {
        stopMove();
    }

    // Down button
    document.getElementById("downBtn").onmousedown = function() {
        moveDown();
    }
    document.getElementById("downBtn").onmouseup = function() {
        stopMove();
    }
    document.getElementById("downBtn").onmouseleave = function() {
        stopMove();
    }

    // Left button
    document.getElementById("leftBtn").onmousedown = function() {
        moveLeft();
    }
    document.getElementById("leftBtn").onmouseup = function() {
        stopMove();
    }
    document.getElementById("leftBtn").onmouseleave = function() {
        stopMove();
    }

    // Right button
    document.getElementById("rightBtn").onmousedown = function() {
        moveRight();
    }
    document.getElementById("rightBtn").onmouseup = function() {
        stopMove();
    }
    document.getElementById("rightBtn").onmouseleave = function() {
        stopMove();
    }
}
