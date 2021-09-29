window.onload = function () {

    let canvas = document.querySelector("canvas");

    canvas.height = window.innerHeight - 4;
    canvas.width = window.innerWidth;

    let c = canvas.getContext("2d");
    let s = 50
    let r = 20;
    let x = ((canvas.width / 2) - (s / 2));
    let y = canvas.height - s;
    let counter = 0;
    let timerID;
    let pressHoldDuration = 5000;
    let speed = 4;//squareSpeed
    let cspeed = 2;//circleSpeed
    let circles = [];
    let cn = 30;//circleNumber
    let clickX, clickY;
    let topreach = 0;
    let lives = 5;
    let win = 3;

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) {
        document.body.innerHTML = "<h1>This game cannot be played in laptop.Please visit this page in Mobile!</h1>"
    }

    if(isMobile)
    swal("This is a simple game you need to complete 3 laps without touching the circles. You will be given 5 lives.").then(() => {
        swal("How to play", "Press and hold right side to move the square up and left side to go down. Enjoy playing!");
    });

    function random(min, max) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        return num;
    }

    function Circle(cx, cy) {
        this.cx = cx;
        this.cy = cy;
        this.draw = function () {
            c.beginPath();
            c.arc(this.cx, this.cy, r, 0, Math.PI * 2, false);
            c.fillStyle = "red";
            c.fill();
            c.closePath();
        }
        this.moveRight = function () {
            if (this.cx >= canvas.width) {
                this.cx = 0;
                this.cy = random(r, canvas.height - 100);
            }
            this.cx += cspeed;
        }
        this.moveLeft = function () {
            if (this.cx <= 0) {
                this.cx = canvas.width;
                this.cy = random(r, canvas.height - 100);
            }
            this.cx -= cspeed;
        }
        this.collision = function () {
            let tx = this.cx;
            let ty = this.cy;

            if (this.cx < x) tx = x;
            if (this.cx >= x + s) tx = x + s;

            if (this.cy < y) ty = y;
            if (this.cy >= y + s) ty = y + s;

            let dx = this.cx - tx;
            let dy = this.cy - ty;

            let d = Math.sqrt((dx * dx) + (dy * dy));

            if (d <= r) {
                y = canvas.height - s;
                lives--;
            }

        }

    }

    for (let i = 0; i < cn; i++) {
        circles[i] = new Circle(
            random(r + 10, canvas.width - s),
            random(r + 10, canvas.height - 100));
    }

    function loop() {
        c.clearRect(0, 0, canvas.width, canvas.height);

        c.beginPath();
        c.globalAlpha = 0.2;
        c.fillStyle = "yellow";
        c.font = "400px Arial";
        c.textAlign = "center";
        c.fillText("↑", canvas.width * 0.75, canvas.height / 2);
        c.fillText("↓", canvas.width / 4, canvas.height / 2);
        c.closePath();

        c.globalAlpha = 1;
        c.beginPath();
        c.rect(x, y, s, s);
        c.fillStyle = "green";
        c.fill();
        c.closePath();

        for (let i = 0; i < cn; i++) {
            circles[i].draw();
            if (i % 2 == 0)
                circles[i].moveRight();
            else
                circles[i].moveLeft();
            circles[i].collision();
        }

        for (i = 0; i < lives; i++) {
            c.beginPath();
            c.globalAlpha = 0.6;
            c.font = "60px Arial";
            c.textAlign = "center";
            c.fillText("💚", (canvas.width - 60 - i * 70), 70);
            c.closePath();
        }

        if (y <= 0) {
            y = canvas.height - s;
            topreach++;
        }
        if (y > canvas.height - s) {
            y = canvas.height - s;
        }

        c.beginPath();
        c.font = "70px Arial";
        c.textAlign = "center";
        c.fillStyle = "#90ee90"
        c.fillText("Lap: " + topreach+ "/3", 130, 70);
        c.closePath();

        if (!(topreach == win || lives == 0)) {
            requestAnimationFrame(loop);
        } else if (topreach == win) {
            c.beginPath();
            c.globalAlpha = 1;
            let f = 50;
            c.font = f + "px Arial";
            c.fillStyle = "aqua";
            c.textAlign = "center";
            c.fillText("You won the Game",
                (canvas.width / 2), canvas.height / 2);
            c.fillText("Score: " + lives,
                canvas.width / 2, (canvas.height / 2) + f + 10);
            c.font = "40px Arial";
            c.fillText("Tap to play again",
                canvas.width / 2, (canvas.height / 2) + f + 50);
            c.closePath();
            canvas.addEventListener("click", replay);
        } else if (lives == 0) {
            c.beginPath();
            c.globalAlpha = 1;
            let f = 40;
            c.font = f + "px Arial";
            c.fillStyle = "white";
            c.textAlign = "center";
            c.fillText("Game Over",
                (canvas.width / 2), canvas.height / 2);
            c.fillText("Tap to play again",
                canvas.width / 2, (canvas.height / 2) + f);
            c.closePath();
            canvas.addEventListener("click", replay);
        }

    }

    loop();

    function replay() {
        y = canvas.height - s;
        lives = 5;
        topreach = 0;
        loop();
        canvas.removeEventListener("click", replay);
    }

    let pressHoldEvent = new CustomEvent("pressHold");

    function addEvent() {
        canvas.addEventListener("touchstart", pressingDown);
        canvas.addEventListener("touchend", notPressingDown);

    }
    canvas.addEventListener("pressHold", doSomething);

    function removeEvent() {
        canvas.removeEventListener("touchstart", pressingDown);
    }

    function timer() {
        if (clickX < canvas.width / 2) {
            y += speed;
        } else {
            y -= speed;
        }


        if (counter < pressHoldDuration) {
            timerID = requestAnimationFrame(timer);
            counter++;
        } else {
            //console.log("Press threshold reached!");
            canvas.dispatchEvent(pressHoldEvent);
        }
    }

    function pressingDown(e) {
        if (e.touches) {
            clickX = e.touches[0].clientX;
            clickY = e.touches[0].clientY;
        }
        // Start the timer
        requestAnimationFrame(timer);
        //e.preventDefault();
        //console.log("Pressing!");
        removeEvent();
    }

    function notPressingDown(e) {
        // Stop the timer
        cancelAnimationFrame(timerID);
        counter = 0;
        //console.log("Not pressing!");
        addEvent();
    }

    function doSomething(e) {
        //console.log("pressHold event fired!");
    }

    addEvent();


}

