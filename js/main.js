

// Grab the div where we will put our Raphael paper
var preparationArea = document.getElementById("preparationArea");


// Create the Raphael paper that we will use for drawing and creating graphical objects
var paper = new Raphael(preparationArea);


// put the width and heigth of the canvas into variables for our own convenience
var pWidth = paper.width;
var pHeight = paper.height;
//console.log("paper dimension is: " + pWidth, pHeight);

paper.put=function(gobj){paper.canvas.appendChild(gobj.node)}


 var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if(!isChrome){
      $('#iframeAudio').remove()
    }
  else{
     $('#playAudio').remove() //just to make sure that it will not have 2x audio in the background 
  }



//-------------------------------------------------------FUNCTIONS-------------------------------------------------//
//function to randomize
var randInt = function( m, n ) {
    let range = n-m;
    let frand = Math.random()*range;
    return m+Math.floor(frand);
}

//revert HTML scores/recipes number to 0, also and re-install original raphael elements     
var restart = function(){
    sugar_recipe_player.innerHTML = 0;
    pearl_recipe_player.innerHTML = 0;
    tea_recipe_player.innerHTML = 0; //Player chooses to restart round, so player recipe is reset to 0

    level = 0.1;
    numberOfPearls = 0;
    numberOfTea = 0;
    numberOfSugar = 0;//re-inititalise recipe count
 

    paper.clear() //remove previously added ingredient
    paper.put(preparationPaper);
    paper.put(cup);
    paper.put(teaLevel);
    paper.put(highestScore)
    //paper.put(backgroundImage)
    restartStatus = "yes"
}

//-----------------------------------------DOM Objects-----------------------------------------//

//INFORMATION SECTION
var startGame = document.getElementById("startGame")
var countdown = document.getElementById("duration")
var scorePoint = document.getElementById("score")
var recipeRecord = document.getElementById("recipeRecord")

//INGREDIENT SECTION
var pearlSelect = document.getElementById("pearl");
var teaLevelSelect = document.getElementById("tealevel");
var sugarLevelSelect = document.getElementById("sugar");
var sendOrder = document.getElementById("sendOrder");
var restartRound = document.getElementById("restartRound");

//RECIPE SECTION - System generated
var pearl_recipe = document.getElementById("pearl_recipe");
var tea_recipe = document.getElementById("tea_recipe");
var sugar_recipe = document.getElementById("sugar_recipe")

//RECIPE SECTION - User's Progress
var pearl_recipe_player = document.getElementById("pearl_recipe_player");
var tea_recipe_player = document.getElementById("tea_recipe_player");
var sugar_recipe_player = document.getElementById("sugar_recipe_player")

var mute = document.getElementById("mute")

//---------------------------------AUDIO-----------------------------------------------------//
var teaSound = new Audio ("sounds/teaSound.wav");
var bubbleSound = new Audio ("sounds/bubbleSound.wav");
var sugarSound = new Audio ("sounds/sugarSound.flac");
var sendOrderSuccess = new Audio ("sounds/sendOrderSuccess.wav");
var wrongOrder = new Audio("sounds/wrong.wav")
var startGameSound = new Audio("sounds/startGame.ogg")
var bgSound = new Audio("sounds/testBG2.mp3")
var countdownSound = new Audio("sounds/countdown.wav")
var gameOverSound = new Audio("sounds/gameover.mp3")


var onSound = new Image(20,20);
onSound.src = "img/onSound.png";
var offSound = new Image(20,20);
offSound.src = "img/offSound.png"

var soundState = "on"
soundicon.addEventListener("click", function(){//control background music
    if(soundState=="on"){
    bgSound.pause();
    gameOverSound.pause()
    soundicon.src = onSound.src
    soundState="off"
    }else{
        bgSound.play();
        soundicon.src = offSound.src;
        soundState="on"

    }
})

//----------------------------------PAPER ELEMENTS----------------------------------------------//


// Tea Preparation Area
var preparationPaper = paper.rect(0,0,pWidth, pHeight);
preparationPaper.attr({
    "fill": "white",
    "stroke":"black"});

//Creating Cup
var cup = paper.rect(pWidth/2-75, 100 ,150, 200,10) //rounded corner of 10


//Creating Tea Level
var level = 0.1;
var teaLevel = paper.rect(pWidth/2-75, 100+200-level*200 ,150, level*200,10).attr({ //(start x, start y, width, height of tea)
    "fill": "#E9967A"
})


//Initializing key variables:
var numberOfPearls = 0;
var numberOfTea = 0;
var numberOfSugar = 0;

//For High Score System:
var numberOfGames = 1;
var listOfScores = [];
listOfScores[numberOfGames-1] = 0; //original, initial score before game starts
var counter2 =0;

var highestScore = paper.text(70,10,"Highest Score: "+ Math.max(listOfScores)).attr({"font-size":15, "fill": "black"})

//For Gameover Only:
var gameOverLabel;
var scoringLabel;


//----------------------------------------------STATE VARIABLE--------------------------------------------------//
var gameStatus = "off"
//console.log(gameStatus)

//Duration of game
var timeGiven = 20; //in seconds


var timeSystem //to trigger setInterval later


//------------------------------------------------RECIPE-------------------------------------------------------//
var recipe = [];

var numberOfCompletedRecipes = 0;
recipeRecord.innerHTML = numberOfCompletedRecipes;

var numberOfIngredientsGenerated = 7; //maximum number of pearl/sugar/tea generated
var n = 0;

while(n<numberOfIngredientsGenerated){
    recipe[n]= {
        "pearls": randInt(1,numberOfIngredientsGenerated-1),
        "sugar": randInt(1,numberOfIngredientsGenerated-1),
        "tea": randInt(2,numberOfIngredientsGenerated-1)
    };
    n++;
}

//console.log(recipe)

    

//------------------------------------------SCORE SYSTEM----------------------------------------------------//

var scoreOfRound = 0;
scorePoint.innerHTML = scoreOfRound;

var score = function(timeTaken, recipeCompleted){
    if(timeTaken<=7){ //satisfactory duration of completion
        scoreOfRound += (10-timeTaken)*recipeCompleted*(numberOfTea+numberOfPearls+numberOfSugar);
        scorePoint.innerHTML = Math.round(scoreOfRound);
        console.log("score of round is "+scoreOfRound);
        console.log(numberOfTea, numberOfPearls, numberOfSugar, timeTaken)
    }else{
        scoreOfRound += recipeCompleted*(numberOfTea+numberOfPearls+numberOfSugar); //no bonus time mutiplier
        scorePoint.innerHTML = Math.round(scoreOfRound);
        console.log("score of round is "+scoreOfRound);
        console.log(numberOfTea, numberOfPearls, numberOfSugar, timeTaken)
    }

}


//--------------------------------------------------------------------LISTENERS-----------------------------------------------------------//



teaLevelSelect.addEventListener("click", function(){

    if(level<=1 && gameStatus=="on"){ //ensure no overflow
    teaLevel.attr({ 
    "fill": "#E9967A",
    "opacity": "0.8",
    "y": 300-level*200, //original height-level change
    "height": level*200
    })

    level +=0.1

    numberOfTea++
    tea_recipe_player.innerHTML = numberOfTea; //update table for user
    //console.log("The level of Tea now is "+ numberOfTea);

    teaSound.play();

    return numberOfTea;
    }

});


var count = 0;
var pearlCount = 5  ; //number of pearls added per click

pearlSelect.addEventListener("click",function(){
    if(gameStatus=="on"){ 
    while(count<pearlCount){ //add many pearls at once
    var pearl = paper.image("img/pearl2.png", pWidth/2-75-10+randInt(1,150-10), 100+200-level*200+randInt(0,level*200-20) ,25,25)
    count++
    } //"-20" to prevent out of cup

    numberOfPearls++
    pearl_recipe_player.innerHTML = numberOfPearls; //update table for user
    //console.log("The number of pearls now is "+ numberOfPearls);
    count = 0;

    bubbleSound.play()

    return numberOfPearls;

    } 
})

sugarLevelSelect.addEventListener("click", function(){
     if(gameStatus=="on"){
    //var sugarCube = paper.image("img/sugarcube.jpg", pWidth/2-75-10+randInt(1,150-10), 100+200-level*200+randInt(0,level*200-20),30,30)

    var sugarcube = paper.image("img/sugarcube.jpg",pWidth*(3/4)+randInt(1,100),100+randInt(0,150) ,30,30  )

    numberOfSugar++
    sugar_recipe_player.innerHTML = numberOfSugar; //update table for user
    //console.log("The number of pearls now is "+ numberOfSugar);

    sugarSound.play()
    return numberOfSugar;
    }  
})



//TIMER
var durationLeft; //countdown timer

var timer =  function(){
    var actualTime = Date.now()
    var timeLapsed = actualTime/1000-loadTime/1000 //how much time has passed since start, actualTime defined in line 177
    durationLeft = timeGiven - timeLapsed;
    //console.log(durationLeft);

        if(durationLeft>=0){
        //console.log(durationLeft + "seconds Left")
        countdown.innerHTML = (Math.round(durationLeft*10)/10) + " seconds left"
        gameOverSound.pause()
        
        }else{
            clearInterval(timer) //restart option
            
            countdownSound.pause()//stop countdown sound, play gameover sound if unmuted
            if(soundState=="on"){
            gameOverSound.play()
            bgSound.volume = 0;
            }

            durationLeft = 0; //gameover
            countdown.innerHTML = 0 + " seconds left"

            gameStatus = "off" //switch game to off
            console.log("The game is "+gameStatus)

            startGame.value = "RESTART GAME"; //change button value 
            
            var gameOverLabel = paper.image("img/gameover.png", 0/2, 0/2,pWidth,pHeight) //display gameover title
            var scoringLabel = paper.text(pWidth/2,pHeight/5,"Your score is "+Math.round(scoreOfRound)+"!").attr({"font-size":30, "fill": "white"}) //display score on top of image

            listOfScores[numberOfGames-1] = scoreOfRound; //update new score to array
            //console.log(listOfScores)
            highestScore = paper.text(70 ,10,"Highest Score: "+ Math.round(Math.max(...listOfScores))).attr({"font-size":15, "fill":"white"}) //update top left
            }


        //USE FOR THE 3-2-1 COUNTDOWN DISPLAY WHEN durationLeft< 3seconds
        if(durationLeft<=3.01&&durationLeft>=2.99){//activate visual countdown from 3   
        var three = paper.image("img/three.png",pWidth*(1/7),130,100,100 )
        countdownSound.play();
        countdownSound.loop = true; 
        }
        if(durationLeft<=2.01&&durationLeft>=1.99){
        var three = paper.image("img/two.png",pWidth*(1/7),130,100,100 )
        }
        if(durationLeft<=1.01&&durationLeft>=0.99){
        var three = paper.image("img/one.png",pWidth*(1/7),130,100,100 )
        }

       
}


          
//START GAME/RESTART GAME
startGame.addEventListener("click", function(){

        startGameSound.play()
        if(soundState=="on"){ //only play sound if unmuted
        bgSound.play()} 
        bgSound.volume = 1 //full volume
        bgSound.loop = true; //to replay sound when it ends

        scoreOfRound = 0; //reset score to 0
        scorePoint.innerHTML = scoreOfRound;
        numberOfCompletedRecipes = 0; //reset recipe to 0
        recipeRecord.innerHTML = numberOfCompletedRecipes

        durationBefore = timeGiven;//initial reference to calculate round duration later

        highestScore = paper.text(70,10,"Highest Score: "+ Math.round(Math.max(...listOfScores))).attr({"font-size":15, "fill": "black"}) //displays Highest Score upon start/restart

    //FIRST GAME
    if(gameStatus==="off"){
        restart()//revert HTML scores/recipes number to 0, also and re-install original raphael elements       

        gameStatus="on" //if condition prevents users from changing recipe during game
        var  i = randInt(0,numberOfIngredientsGenerated); //randomise first recipe to be shown, up to 5 pearls/tea/sugar
        pearl_recipe.innerHTML = recipe[i].pearls;
        sugar_recipe.innerHTML = recipe[i].sugar;
        tea_recipe.innerHTML = recipe[(i)].tea;
        console.log("The game is "+gameStatus);

        startGame.value = "RESTART GAME" //restart game (goes to next if condition) if player clicks during gameplay

        loadTime =Date.now();

        timeSystem = setInterval(timer,100)//starts the Countdown timer

        numberOfGames ++
        console.log("Number of Games Played = "+numberOfGames)
        return numberOfGames;

    }

    //RESTART GAME
    if(gameStatus=="on"||durationLeft==0){//allow restart midway in game OR when game ends
        restart();
        timeSystem = setInterval(timer,100)
        console.log("GAME IS RESTARTED. NEW ROUND BEGINS!");

        durationOfRound = 0;
        score(durationOfRound,numberOfCompletedRecipes);
        listOfScores[numberOfGames-1] = scoreOfRound

        loadTime =Date.now();

        numberOfGames ++; //increase array size to compare highest scores later
        //console.log("Number of Games Played = "+numberOfGames)
        return numberOfGames; 
    }
})

var durationOfRound //equal to the difference between end time of the current round and the end time of round before
var durationBefore //time when the round ends

//next-round:
sendOrder.addEventListener("click", function(){
    if(gameStatus==="on"){//if condition prevents users from changing recipe during game
        if(pearl_recipe.innerHTML == pearl_recipe_player.innerHTML && 
            tea_recipe.innerHTML == tea_recipe_player.innerHTML &&
            sugar_recipe.innerHTML == sugar_recipe_player.innerHTML
            ){ //Compare system vs player recipes

                sendOrderSuccess.play()
          
                //Shows next recipe to be followed, randomised
                pearl_recipe.innerHTML = recipe[randInt(0,numberOfIngredientsGenerated-1)].pearls;
                sugar_recipe.innerHTML = recipe[randInt(0,numberOfIngredientsGenerated-1)].sugar;
                tea_recipe.innerHTML = recipe[randInt(0,numberOfIngredientsGenerated-1)].tea;

                //records duration of round
               
                durationOfRound = durationBefore - durationLeft; //console.log("XXX"+ durationOfRound);
                console.log("the duration of the round is "+durationOfRound);
                durationBefore = durationLeft; //set reference to be the time the previous round ends

                numberOfCompletedRecipes ++ ; //update number of completed Recipes for the game
                recipeRecord.innerHTML = numberOfCompletedRecipes; //update to HTML

                score(durationOfRound,numberOfCompletedRecipes); //call score function to update score in HTML;
                //score.innerHTML = scoreOfRound;

                console.log(numberOfCompletedRecipes)


                restart()//Reset player recipe to 0
    }
        else{
            wrongOrder.play()
            var alertMessage = confirm("Incorrect! Do you wish to restart round?");
            if (alertMessage==true){
              restart()
              wrongOrder.pause()


            }
            else{console.log("Gameover")} //player chooses to end game
        
        }
    }


})



//allows player to restart the Round by clearing all the old Raphael elements
restartRound.addEventListener("click", function(){//when user clicks Restart Round
    if(gameStatus==="on"){
    restart()//Reset player recipe to 0
    }
        
})




//---------------------MODAL INSTRUCTION (RIPPED AND BASHED)---------------------//
// Get the modal
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

img.addEventListener("click", function(){
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
})

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.addEventListener("click", function() {
  modal.style.display = "none";
})

