/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */
// global constants

const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
//Global variables
var pattern = [2, 5, 4, 3, 6, 1, 6, 4];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var strikes=0;


function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    clueHoldTime = 1000;
    if(document.getElementById("userLength").value>0)
      {
        //Custom pattern length of player choosing
        getRandomPattern(document.getElementById("userLength").value);
      }
    else{
      //Default length of 6
      getRandomPattern(6);
    }
    //Hide all the strikes before starting the next game
    document.getElementById("strike1").classList.add("hidden");
    document.getElementById("strike2").classList.add("hidden");
    document.getElementById("strike3").classList.add("hidden");
    strikes=0;
    playClueSequence();
}


function stopGame(){
  gamePlaying=false
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("You Won!")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  guessCounter = 0;
  clueHoldTime=clueHoldTime*0.8
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  //Check if the guess was correct
  if (btn==pattern[guessCounter]){
    //Are we at the end of the current pattern?
    if(progress==guessCounter)
      {
        //If this is the last pattern, then win the game
        if(progress==pattern.length-1)
          {
            winGame();
          }
        //Increase the progress by 1 and start the next pattern
        else
          {
            progress++;
            playClueSequence();
          }
      }
    //If we aren't at the end of the current pattern, continue on to the next guess.
    else{
      guessCounter++;
    }
    
  }
  //Wrong guess, lost the game
  else{
    if(strikes<2)
      {
        strikes++;
        alert("Strike "+strikes);
        playClueSequence();
        var currentstrike="strike"+strikes;
        document.getElementById(currentstrike).classList.remove("hidden");
      }
    else
      {
        strikes++;
        var currentstrike="strike"+strikes;
        document.getElementById(currentstrike).classList.remove("hidden");
        loseGame();
      }
    
  }
  
}

function getRandomInt(max) {
  return Math.floor(1+(Math.random() * (max-1)));
}

function getRandomPattern(size)
{
  pattern=[];
  for (let i=0;i<size;i++)
    {
      pattern[i]=getRandomInt(6);
    }
}

const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 500.0,
  6: 589
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)