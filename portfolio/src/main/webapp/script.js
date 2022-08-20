// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


const soundEffects = {
  beeping: new Audio('sounds/beeping.mp3'),
  bell: new Audio('sounds/bell.mp3'),
  musicBox: new Audio('sounds/musicBox.wav'),
  orchestra: new Audio('sounds/orchestra.wav'),
  trumpet: new Audio('sounds/trumpet.mp3')
}

const settings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  notification: true,
  sound: true,
  effect: soundEffects.bell
};

let userData = {
  sessions: 0
}

// Updates the timer lengths, state for notifications, sound, and type of sound effect
function updateSettings() {
  settings.pomodoro = document.getElementById("pomodoro-length").value;
  settings.shortBreak = document.getElementById("short-break-length").value;
  settings.longBreak = document.getElementById("long-break-length").value;
  settings.notification = document.getElementById("notif-switch").checked;
  settings.sound = document.getElementById("sound-switch").checked;
  const e = document.getElementById("sound-effect")
  const text = e.options[e.selectedIndex].text;
  switch (text) {
    case 'Bell':
      settings.effect = soundEffects.bell;
      break;
    case 'Beeping':
      settings.effect = soundEffects.beeping;
      break;
    case 'Music Box':
      settings.effect = soundEffects.musicBox;
      break;
    case 'Orchestra':
      settings.effect = soundEffects.orchestra;
      break;
    case 'Trumpet':
      settings.effect = soundEffects.trumpet;
      break;
  }
}

let interval;

// Once the play-pause button is clicked, the value of the data-action attribute on the button is stored in an action variable
// and checked to see if it’s equal to “start”. If so, the startTimer() function is invoked and the countdown begins.
const playPauseBtn = document.getElementById("play-pause-btn");


function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date().toString());
  const difference = endTime - currentTime;

  const total = Math.round(difference / 1000);
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    total,
    minutes,
    seconds,
  };
}

// Creates new timer with amount of time
function setNewTimer(mode) {
  let {total} = userData.remainingTime;
  const endTime = new Date().getTime() + total * 1000;
}

// Countdown function
function startTimer() {
  let {total} = settings.remainingTime;
  const endTime = new Date().getTime() + total * 1000;

  if (settings.mode === 'pomodoro') userData.sessions++;

  interval = setInterval(function() {
    settings.remainingTime = getRemainingTime(endTime);
    updateClock();

    total = settings.remainingTime.total;

    if (total <= 0) {
      clearInterval(interval);
      next(); // advance to next mode

      if (Notification.permission === 'granted') {
        const text =
          settings.mode === 'pomodoro' ? 'Get to work!' : 'Take a break!';
        new Notification(text);
      }

      document.querySelector(`[data-sound="${settings.mode}"]`).play();

      startTimer();
    }
  }, 1000);
}

// Stops the timer
function stopTimer() {
  clearInterval(interval);
}

// Resets the timer
function resetTimer() {
  if (settings.mode === 'pomodoro') userData.sessions--;
  if (playPauseBtn.className==='pause') togglePlay();
  updateClock();
}

// Toggles play and pause button image and starts and stops timer
function togglePlay() {
  if (playPauseBtn.className!=='pause') {
    startTimer();
    disableModeSwitching();
    playPauseBtn.src='images/pause-solid.svg';
    playPauseBtn.className='pause';

  } else if (playPauseBtn.className==='pause') {
    stopTimer();
    enableModeSwitching();
    playPauseBtn.src='images/play-solid.svg';
    playPauseBtn.className='play';
  }
  return false;
}
// Helper function called from togglePlay: disables mode switching.
function disableModeSwitching() {
  document.querySelectorAll('.mode-button').forEach(btn => {
    if (!btn.classList.contains('current')) btn.disabled = true;
  });
}
// Helper function called from togglePlay: enables mode switching.
function enableModeSwitching() {
  document.querySelectorAll('.mode-button').forEach(btn => {
    if (!btn.classList.contains('current')) btn.disabled = false;
  });
}

// This function is how the countdown portion of the application is updated.
// The updateClock() function extracts the value of the minutes and seconds properties on the
// remainingTime object and pads them with zeros where necessary so that the seconds number always has a width of two.
function updateClock() {
  const { remainingTime } = settings;
  const minutes = `${remainingTime.minutes}`;
  const seconds = `${remainingTime.seconds}`.padStart(2, '0');

  const min = document.getElementById('js-minutes');
  const sec = document.getElementById('js-seconds');
  min.textContent = minutes;
  sec.textContent = seconds;

  const text =
    settings.mode === 'pomodoro' ? 'Get to work!' : 'Take a break!';
  document.title = `${minutes}:${seconds} — ${text}`;
}

// Advances the timer to the next mode
function next(){
  switch (settings.mode) {
    case 'pomodoro':
      if (userData.sessions % settings.longBreakInterval === 0 && userData.sessions !== 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
      break;
    default:
      switchMode('pomodoro');
  }
}
/* The switchMode() function adds two new properties to the timer object.
First, a mode property is set to the current mode which could be pomodoro, shortBreak or longBreak.
Next, a remainingTime property is set on the timer. This is an object which contains three properties of its own: */
function switchMode(mode) {
  settings.mode = mode;
  settings.remainingTime = {
    total: settings[mode] * 60,
    minutes: settings[mode],
    seconds: 0,
  };
  document.querySelector('.mode-button.current').classList.remove('current');
  document.querySelector(`[data-mode="${mode}"]`).classList.add('current');
  updateColors(mode);
}
// Helper function to update the colors. Called when switching mode.
function updateColors(mode) {
  document.body.style.backgroundColor = `var(--${mode})`;
  document.getElementById('clock').style.textShadow = `0 4px 4px var(--${mode}-shadow)`;
  document.querySelectorAll('.mode-button').forEach(btn => {
    btn.style.color = `var(--${mode}-shadow)`;
    if (btn.classList.contains('current')) {
      btn.style.borderColor = `var(--${mode}-shadow)`;
    }
  })
}

/* This ensures that the default mode for the timer is pomodoro and the contents of timer.
remainingTime is set to the appropriate values for a pomodoro session
In addition, this functions ask permission to the user whether they want notifications on their web browser */
document.addEventListener('DOMContentLoaded', () => {
  if ('Notification' in window) {
    if (
      Notification.permission !== 'granted' &&
      Notification.permission !== 'denied'
    ) {
      Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
          new Notification(
            'Awesome! You will be notified at the start of each session'
          );
        }
      });
    }
  }

  switchMode('pomodoro');
});

