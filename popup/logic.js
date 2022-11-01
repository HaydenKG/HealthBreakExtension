//extension dev links:
//https://developer.chrome.com/docs/extensions/reference/action/
//https://developer.chrome.com/docs/extensions/reference/#stable_apis

"use strict";

//get list of selected exercises
// and disable the ones we don't use
let nextCounter = 0;
let headingChanged = false;
let breathingCycleOn = false;
let breathingCounter = 0;
let breathingTimer;
let paused = false;
let currentAudio;

const contentContainer = document.getElementById("content");
const options = new Map();
options.set("eyeClose", document.getElementById("eyeClose"));
options.set("eyeDistance", document.getElementById("eyeDistance"));
options.set("breathingCycle", document.getElementById("breathingCycle"));
options.set("wirstShake", document.getElementById("wirstShake"));
let optionsCount = options.size;

//options.get("eyeDistance").style.display = "none";

const nextButton = document.getElementById("nextBtn");
const closeBtn = document.getElementById("cancelBtn");
const breahtingIndicator = document.getElementsByClassName("breathingIndicatorBar")[0];
const pauseExtensionPanel = document.getElementsByClassName("pauseExtensionPanel")[0];

nextButton.addEventListener("click", () => {
    if(nextCounter < optionsCount) nextCounter++;
    if(nextCounter > 0 && !headingChanged) changeHeading(); 

    contentContainer.scrollTo(nextCounter * contentContainer.clientWidth, 0);
    if(nextCounter == optionsCount) {
        nextButton.style.display = "none";
        closeBtn.innerText = "close";
    }
});

document.getElementById("lookDistanceTimerBtn").addEventListener("click", function(){
    setTimeout(() => {
        this.previousElementSibling.innerText += "\n\n Perfect 😊";
        this.style.display = "none";
        new Audio("./sounds/ShadowSoft.wav").play();
    }, 2000);
    this.setAttribute('disabled', '');
});


//replace with stop because it causes too much trouble syncing the css animation with the sound again
document.getElementById("breathingCycleBtn").addEventListener("click", function(){
    breathingCycleOn = !breathingCycleOn;
    if(breathingCycleOn){
        breathingTimer = setInterval(() => {
            if(paused) return;
            
            breathingCounter++;
            if(breathingCounter == 1 || breathingCounter == 9 || breathingCounter == 18){
                currentAudio = new Audio("./sounds/InhaleLofiPiano.wav");
                currentAudio.play();
            }
            if(breathingCounter == 3 || breathingCounter == 12 || breathingCounter == 21){
                currentAudio = new Audio("./sounds/ExhaleLofiPiano.wav")
                currentAudio.play();
            }
            if(breathingCounter >= 9 * 5)
                resetBreathing(this);
        }, 1000);
        this.innerText = "Pause"; // replace with icons 
        breahtingIndicator.style.animationPlayState = "running";
        paused = false;
    } else {
        this.innerText = "Go";
        breahtingIndicator.style.animationPlayState = "paused";
        paused = true;
        currentAudio.pause();
    }
});

function pauseExtension(){
    let durationToClose = new FormData(document.getElementById("pauseExtensionForm")).get("pauseExtension");
    switch(durationToClose){
        case "60": 
            console.log("60 min");
            break;
        case "90": 
            console.log("90 min");
            break;
        default: console.log("whole day");
    }
    closeWindow();
}

function resetBreathing(button){
    button.innerText = "again";
    clearInterval(breathingTimer);
    breathingCounter = 0;
    //figure out how to repeat the cycle. Remove animation and add it again?
}

function changeHeading() {
    document.getElementById("heading").innerHTML = "🌿<span>Health</span> break";
    headingChanged = true;
}

function showPauseExtensionPanel(show){
    if(show){
        pauseExtensionPanel.classList.add("showPauseExtensionPanel");
    }
    else {
        pauseExtensionPanel.classList.remove("showPauseExtensionPanel");
    } 
}

function closeWindow(){
    nextCounter = 0;
    headingChanged = false;
    window.close();
}

window.addEventListener("close", () => { //check if really needed. Maybe it's loading a whole new instance on opening the extension again
    nextCounter = 0;
    headingChanged = false;
});