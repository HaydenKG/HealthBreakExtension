//Handles the alarm listener
//TODO: Make popup open automatically when listener is triggered
//TODO: add notification
//add notification point to setup: Only in browser, system notification
//send message to pause listener

'use strict';

chrome.alarms.onAlarm.addListener(() => {
  console.log("alarm listener triggered")
  /*chrome.notifications.create({
    type: 'basic',
    iconUrl: 'stay_hydrated.png',
    title: 'Time to Hydrate',
    message: 'Everyday I\'m Guzzlin\'!',
    buttons: [
      { title: 'Keep it Flowing.' }
    ],
    priority: 0
  });*/
});

chrome.notifications.onButtonClicked.addListener(async () => {
  const item = await chrome.storage.sync.get(['minutes']);
  chrome.action.setBadgeText({ text: 'ON' });
  chrome.alarms.create({ delayInMinutes: item.minutes });
});