
console.log("Yo, I am alive!");

// Grab the div where we will put our Raphael paper
var centerDiv = document.getElementById("centerDiv");

// Create the Raphael paper that we will use for drawing and creating graphical objects
var paper = new Raphael(centerDiv);

// put the width and heigth of the canvas into variables for our own convenience
var pWidth = paper.width;
var pHeight = paper.height;
console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);

paper.put=function(gobj){paper.canvas.appendChild(gobj.node)}


// Just create a nice black background
var bgRect = paper.rect(0,0,pWidth, pHeight);
bgRect.attr({"fill": "black"});

var speed = document.getElementById("speed"); //adjust speed of ball
var sizeBall = document.getElementById("sizeBall")



// A dot for us to play with
var dot = paper.circle(pWidth/2, pHeight/2, sizeBall.value);
dot.attr({"fill": "green"});


sizeBall.addEventListener("input", function(){
    dot.attr({"r": sizeBall.value});

})

//-------------------
// load time
//-------------------
var loadTime=Date.now()
//console.log("load time is " + loadTime/1000);

//HTML5 audio elements
var myFooter=document.getElementById("myFooter");

//HTML5 audio element
var aBackgroundSnd = new Audio ("resources/342566__inspectorj__sewer-soundscape-a.wav");


var aBumpSnd = new Audio ("resources/67408__noisecollector__vibrabonk.wav");




//-------------------
var toggle="off";
var timer;



// Add some properties to dot just to keep track of it's "state"
dot.xpos=pWidth/2;
dot.ypos=pHeight/2;
dot.xrate=5;
dot.yrate=5;
var clicks = 0;
var timeLeft 


dot.node.addEventListener("click", function(event){
    if (toggle=="on"){
    clicks += 1
    console.log(clicks)
    header.innerHTML = `<big><big><big><big><br>Counter: ${clicks}</big></big></big></big>`}
    else{header.innerHTML = "<br>Counter: " + clicks}

})



// our drawing routine, will use as a callback for the interval timer
var draw = function(){
    myFooter.innerHTML = `<big><big><big>Time Left: ${timeLeft} seconds</big></big></big>`

    
    timeLeft = Math.round(10+(loadTime-Date.now())/1000)
    

    if(timeLeft===0){
        timeLeft = 10
        clearInterval(timer);
        toggle="off"
        console.log(toggle)
        alert("You have captured the ball for " +clicks+" times!")
        document.getElementById("startButtonID").value = "RESTART GAME"
        return toggle="off"
    }


    

    // Update the position where we want our dot to be
    dot.xpos += dot.xrate;
    dot.ypos += dot.yrate;

    // Now actually move the dot using our 'state' variables
    dot.attr({'cx': dot.xpos, 'cy': dot.ypos});

    //---------------------------------------------
    // Set sound parameters based on the position of the moving dots



    // When dots hit the wall, reverse direction 
    if (dot.xpos > pWidth) {
        dot.xrate = -dot.xrate;
        aBumpSnd.pause();
        aBumpSnd.currentTime=0;
        aBumpSnd.play();
    }
    if (dot.ypos > pHeight) {
        dot.yrate = - dot.yrate;
        aBumpSnd.pause();
        aBumpSnd.currentTime=0;
        aBumpSnd.play();
    };
    if (dot.xpos < 0) {
        dot.xrate = -dot.xrate;
        aBumpSnd.pause();
        aBumpSnd.currentTime=0;
        aBumpSnd.play();
    }
    if (dot.ypos < 0) {
        dot.yrate = - dot.yrate;
        aBumpSnd.pause();
        aBumpSnd.currentTime=0;
        aBumpSnd.play();
    };
}

// call draw() periodically
// Start the timer with a button (instead of as program loads) so that sound models have time to load before we try play or set their parameters in the draw() function.

document.getElementById("startButtonID").addEventListener('click', function(ev){
    if (toggle=="off"){
        dot.xpos=pWidth/2;
        dot.ypos=pHeight/2;
       /* paper.clear()
        paper.put(bgRect)
        paper.put(dot)*/
        timer = setInterval(draw, speed.value);
        toggle="on";
        aBackgroundSnd.play();
        aBackgroundSnd.volume=.2;
        aBackgroundSnd.loop=true;
        loadTime = Date.now()
        clicks = 0;
        header.innerHTML = `<big><big><big><br>Counter: ${clicks}</big></big></big>`;
        endTime = 10


    } else {
        clearInterval(timer);
        toggle="off"
        aBackgroundSnd.pause();
    }
})


var header = document.getElementById("header")



