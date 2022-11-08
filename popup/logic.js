//extension dev links:
//https://developer.chrome.com/docs/extensions/reference/action/
//https://developer.chrome.com/docs/extensions/reference/#stable_apis

"use strict";

let nextCounter = 0;
let headingChanged = false;
let breathingCycleOn = false;
let breathingCounter = 0;
let breathingTimer;
let paused = false;
let currentAudio;

const contentContainer = document.getElementsByClassName("slidingContainer")[0];
const options = new Map();
options.set("eyeClose", document.getElementById("eyeClose"));
options.set("eyeDistance", document.getElementById("eyeDistance"));
options.set("breathingCycle", document.getElementById("breathingCycle"));
options.set("wirstShake", document.getElementById("wristShake"));
let optionsCount = options.size;

const nextButton = document.getElementById("nextBtn");
const closeBtn = document.getElementById("cancelBtn");
const breahtingIndicator = document.getElementsByClassName("breathingIndicatorBar")[0];
const pauseExtensionPanel = document.getElementById("pauseExtensionPanel");

//TODO: READ localStorage
let exerciseSelectionTest = [{eyeClose: true}, {eyeDistance: true}, {breathingCycle: true}, {wristShake: true}];
let exerciseSelection = JSON.parse(localStorage.getItem("exerciseSelection"));

if(exerciseSelection == null){
    showSetupPanel(true);
} 
else {
    showSetupPanel(false);
    for(let i = 0; i < exerciseSelectionTest.length; i++){
        if(Object.values(exerciseSelectionTest[i])[0] == false){
            options.get(Object.keys(exerciseSelectionTest[i])[0]).style.display = "none";
            optionsCount--;
        }
    }
}

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

        //TODO: replace with stop for now because it causes too much trouble syncing the css animation with the sound after a pause
        //Use houdini animation worklet
        this.innerText = "Pause"; // TODO: replace with icons 
        breahtingIndicator.style.animationPlayState = "running";
        paused = false;
    } else {
        this.innerText = "Go";
        breahtingIndicator.style.animationPlayState = "paused";
        currentAudio.pause();
        paused = true;
    }
});

function pauseExtension(){
    let durationToClose = new FormData(document.getElementById("pauseExtensionForm")).get("pauseExtension");
    switch(durationToClose){
        case "60": 
            console.log("60 min");
            break;
        case "90": 
            console.log("120 min");
            break;
        default: console.log("whole day");
    }
    closeWindow();
}

function resetBreathing(button){
    button.innerText = "again";
    clearInterval(breathingTimer);
    breathingCounter = 0;
    //TODO: figure out how to repeat the cycle. Remove animation and add it again?
}

function changeHeading() {
    document.getElementById("heading").innerHTML = "🌿<span>Health</span> break";
    headingChanged = true;
}

function showPauseExtensionPanel(show){
    if(show){
        pauseExtensionPanel.classList.add("showPanel");
    }
    else {
        pauseExtensionPanel.classList.remove("showPanel");
    } 
}

function closeWindow(){
    nextCounter = 0;
    headingChanged = false;
    window.close();
    //TODO: check which API call to use to close the popup again 
    //maybe the following? : chrome.tabs.update({ active: true }); 
}

//TODO: check if really needed. Maybe it's loading a whole new instance on opening the extension again
window.addEventListener("close", () => { 
    nextCounter = 0;
    headingChanged = false;
});