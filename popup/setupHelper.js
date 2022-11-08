
class setupData {
    selection = [];
    notificationInterval = 60;
    notificationType = "Popup"
}

const setupExtensionPanel = document.getElementById("setupPanel");
const setupContainer = document.getElementsByClassName("slidingContainer")[1];
let setupCounter = setupContainer.childElementCount;
let nextSetupCounter = 0;
let setupDataInstance = new setupData();

function defaultSetup(){
    //TODO: implement saving of the default settings
    console.debug("Default setup selected")
    showSetupPanel(false);
}

function nextSetupPanel(){
    if(nextSetupCounter == 0) document.getElementById("setupNextButton").style.display = "block";
    nextSetupCounter++;
    if(nextSetupCounter == setupCounter-1){
        document.getElementById("setupNextButton").innerText = "Done";
    }
    if(nextSetupCounter == setupCounter){
        const selectionForm = document.getElementById("exerciseSelection")
        const formData = new FormData(selectionForm);
        setupDataInstance.selection = Array.from(formData);
        setupDataInstance.notificationInterval = new FormData(document.getElementById("intervalSetup")).get("interval");
        setupDataInstance.notificationType = new FormData(document.getElementById("notificationSetup")).get("notification");
        console.log(JSON.stringify(setupDataInstance));
        //TODO: Save stringified version and read it out in other script
        showSetupPanel(false);
    }
    if(nextSetupCounter < setupCounter) 
        setupContainer.scrollTo(nextSetupCounter * setupContainer.clientWidth, 0);
}

function showSetupPanel(show){
    if(show)
        setupExtensionPanel.classList.add("showPanel");
    else 
        setupExtensionPanel.classList.remove("showPanel");
}