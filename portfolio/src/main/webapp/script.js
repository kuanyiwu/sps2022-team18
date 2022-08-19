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

// Required properties
const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  sessions: 0,
};

let interval;

// Once the play-pause button is clicked, the value of the data-action attribute on the button is stored in an action variable
// and checked to see if it’s equal to “start”. If so, the startTimer() function is invoked and the countdown begins.
const buttonSound = new Audio('button-sound.mp3');
const playPauseButton = document.getElementById('play-pause-btn');

// Create an event listener that detects a click on the buttons and a function to switch the mode of the timer appropriately
const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date().toString());
  const difference = endTime - currentTime;

  const total = Math.round(difference / 1000);
  const minutes = Math.round((total / 60) % 60);
  const seconds = Math.round(total % 60);

  return {
    total,
    minutes,
    seconds,
  };
}

// Countdown function
function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date().toString()) + total * 1000;

  if (timer.mode === 'pomodoro') timer.sessions++;

  playPauseButton.dataset.action = 'stop';

  interval = setInterval(function() {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);
      next(); // advance to next mode

      if (Notification.permission === 'granted') {
        const text =
          timer.mode === 'pomodoro' ? 'Get to work!' : 'Take a break!';
        new Notification(text);
      }

      document.querySelector(`[data-sound="${timer.mode}"]`).play();

      startTimer();
    }
  }, 1000);
}

// Stop the timer when the stop button is clicked
function stopTimer() {
  clearInterval(interval);
}

// Toggles play and pause button image and starts and stops timer
function toggle(b) {
  if (b.className!=='pause') {
    startTimer()
    b.src='images/pause-solid.svg'
    b.className='pause';

  } else if (b.className==='pause') {
    stopTimer()
    b.src='images/play-solid.svg'
    b.className='play';
  }
  return false;
}

//This function is how the countdown portion of the application is updated.
//The updateClock() function extracts the value of the minutes and seconds properties on the 
//remainingTime object and pads them with zeros where necessary so that the number always has a width of two.
function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, '0');
  const seconds = `${remainingTime.seconds}`.padStart(2, '0');

  const min = document.getElementById('js-minutes');
  const sec = document.getElementById('js-seconds');
  min.textContent = minutes;
  sec.textContent = seconds;

  const text =
    timer.mode === 'pomodoro' ? 'Get to work!' : 'Take a break!';
  document.title = `${minutes}:${seconds} — ${text}`;
}

//The switchMode() function adds two new properties to the timer object. 
//First, a mode property is set to the current mode which could be pomodoro, shortBreak or longBreak. 
//Next, a remainingTime property is set on the timer. This is an object which contains three properties of its own:
function switchMode(mode) {
  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
  };

  document
    .querySelectorAll('button[data-mode]')
    .forEach(e => e.classList.remove('active'));
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
  document.body.style.backgroundColor = `var(--${mode})`;

  updateClock();
}

//Within the handleMode() function, the value of the data-mode attribute is retrieved from the target element.
function handleMode(event) {
  const { mode } = event.target.dataset;

  if (!mode) return;

  switchMode(mode);
  stopTimer();
}

//This ensures that the default mode for the timer is pomodoro and the contents of timer.
//remainingTime is set to the appropriate values for a pomodoro session
//In addition, this functions ask permission to the user whether they want notifications on their web browser
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

// Advances the timer to the next mode
function next(){
  if (timer.sessions !== 0) {
    switch (timer.mode) {
      case 'pomodoro':
        if (timer.sessions % timer.longBreakInterval === 0) {
          switchMode('longBreak');
        } else {
          switchMode('shortBreak');
        }
        break;
      default:
        switchMode('pomodoro');
    }
  }
}


// Set the width of the sidebar to 772px (show it) 
function openNav() {
  document.getElementById("mySidepanel").style.width = "772px";
}

//Set the width of the sidebar to 0 (hide it) 
function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
}
