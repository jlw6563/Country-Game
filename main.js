"use strict";
//Establishing const for link to rest countries and highScoreKey for local Saving
const url = "https://restcountries.com/v3.1/all"; 
const highScoreKey = "jlw6563-highScore";
let countryName;
let countriesList;
let answer;
let correctSound = new Audio('audio/ping.mp3');
let inncorrectSound = new Audio('audio/negative-beep.mp3');
let dataComplete = false;


//Gets the highscore from local storage
let highScore = localStorage.getItem(highScoreKey);
//If the highscore is null sets the highscore to 0 and sets the local storage to 0
if(highScore == null){
    highScore = 0;
    localStorage.setItem(highScoreKey, highScore);
}

//Sets playerScore
let playerScore = 0;


//Rests everything related to highscore and scoreing 
function reset(){

    //If the player score is higher than the highscore
    if(highScore <playerScore){
        //Sets new highscore and sets the localhighscore to the player score.
        highScore = playerScore;
        localStorage.setItem(highScoreKey, playerScore);
    }
    //Resets all the stats and sets them to what they should be at the start
    playerScore = 0;
    document.querySelector("#score").innerHTML = "Score: " + playerScore;
    document.querySelector("#highscore").innerHTML ="High Score: " + highScore
    document.querySelector("#textBox").value = "";
    document.querySelector("#answer").innerHTML = " ";
    let type = document.querySelector("#type").value;
    document.querySelector("#result").innerHTML = "Result: Fill in the Guess Box an click guess when you are ready | Game Type is: " + type;
    document.querySelector("#result").style.color = "rgba(165, 29, 29, 0.623)";
    //Calls the start function
    setData(countriesList);
}

//Has the data variable passed in GetData
function setData(dataSet){
    //This randomly picks a country by taking the floor of a random float between 0 and the data length
    countryName = dataSet[Math.floor(Math.random() * dataSet.length)];
    //The type of question
    let type = document.querySelector("#type").value;

    if(type == "capital"){
        //Some contries don't have capitals this is error checking for that
        if(countryName.capital ==null){
            setData(countriesList);
        }
        //Sets answer to the capital and sets the question to be specific for capital
        answer = countryName.capital[0];
        document.querySelector("#country").innerHTML ="Guess the <strong>Capital</strong> of <strong>\"" +  countryName.name.common + "\"</strong>";
    }
    if(type == "region"){
        //Sets the answer to the continent and then makes the question specific for it
        answer = countryName.continents[0];
        document.querySelector("#country").innerHTML ="What <strong>Continet</strong> is  <strong>\"" +  countryName.name.common + "\"</strong> on";
    }
    
}

//For tracking if guesses matches the answer
function playerGuess(){
    //Gets the guess and makes it lowercase and trim to account for errors
    let guess = document.querySelector("#textBox").value.toLocaleLowerCase().trim();
    //Gets the type
    let type = document.querySelector("#type").value;
    //Makes sure guess isn't empty
    if(guess != ""){
        //If guess === answer lowercased and trimed
        if(guess === answer.toLocaleLowerCase().trim()){
            //Prints for correct results and adds to the score
            document.querySelector("#result").innerHTML = "Result: Correct! | Game type: " + type;
            correctSound.play();
            document.querySelector("#result").style.color = "green";
            playerScore += 10;
        }else{
            //Prints for inncorrect
            document.querySelector("#result").innerHTML = "Result: Incorrect! | Game type: " + type;
            inncorrectSound.play();
            document.querySelector("#result").style.color = "red";
        }
        
        //Updates score
        document.querySelector("#score").innerHTML = "Score: " + playerScore;


        //Displays answer
        document.querySelector("#answer").innerHTML = "Previous Answer: " + answer;
        

        //Sets the textbox empty and calls start
        document.querySelector("#textBox").value = "";
        setData(countriesList);
    }
}
async function getData(){
        //await is used to make the program wait until fetch is complete to continue
        const response = await fetch(url);
        const data = await response.json();
        countriesList = data; 
}

getData();

//This is to make sure everything is loaded before anything happens
window.onload = function(){
    
    
    //Calls reset function to setup up everything bc of how I have the functions calling each other almost like a lie
    reset();

    //Sets up onclick for guess button so it calls the guess function
    document.querySelector("#guess").onclick = function(){
        playerGuess();
    };

    
    //I made this so hitting enter while in the guess box will make you guess as well, Because I set it up with not accepting
    //Blank answers I do not have to worry about people holding down the enter key.

    //Gets the text box adds an event listener
    document.querySelector("#textBox").addEventListener("keydown", (e) => {
        //If the key clicked is enter call the guess function.
        if(e.key == "Enter"){
            playerGuess();
        }
    });
    
    //Sets up the reset button to call the reset function
    document.querySelector("#reset").onclick = function(){
        reset();
    };

    //When the dropdown is changed, added this after someone got confused having to hit the reset button to switch game modes 
    //So I added this to make it more clear. The game type will update as well to make sure everything happens right away
    document.querySelector("#type").onchange = function(){
        setData(countriesList);

        //Sets the game type text to say the type everytime the page is loaded up.
        let type = document.querySelector("#type").value;
        document.querySelector("#result").innerHTML = "Result: Fill in the Guess Box an click guess when you are ready | Game Type is: " + type;
        document.querySelector("#result").style.color = "rgba(165, 29, 29, 0.623)";
    };
};


