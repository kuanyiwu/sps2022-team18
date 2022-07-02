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

// Required variables
var session_seconds = "00";
var session_minutes = 25;

var break_seconds = "00";
var break_minutes = 5;


// Audio file
var bell = new Audio("bell.mp3");

// Starting template for the timer
function template() {
  document.getElementById("minutes").innerHTML = session_minutes;
  document.getElementById("seconds").innerHTML = session_seconds;
  
  document.getElementById("breakminutes").innerHTML = break_minutes;
  document.getElementById("breakseconds").innerHTML = break_seconds;
}


function taskTimer() 
{
      // Change the minutes and seconds to starting time
      session_minutes = 24;
      session_seconds = 59;
     
      // Add the seconds and minutes to the page
      document.getElementById("minutes").innerHTML = session_minutes;
      document.getElementById("seconds").innerHTML = session_seconds;

      // Start the countdown
      var minutes_interval = setInterval(minutesTimer, 60000);
      var seconds_interval = setInterval(secondsTimer, 1000);

      // Function for minute counter
      function minutesTimer() {
        session_minutes = session_minutes - 1;
        document.getElementById("minutes").innerHTML = session_minutes;
      }

      // Function for second counter
      function secondsTimer() {
        session_seconds = session_seconds - 1;
        document.getElementById("seconds").innerHTML = session_seconds;

        // Check if the seconds and minutes counter has reached 0
        // If reached 0 then end the session
        if (session_seconds <= 0) { //do not forget to change back to 0!!!
          if (session_minutes <= 0) { // do not forget to change back to 0!!!
            // Clears the interval i.e. stops the counter
            clearInterval(minutes_interval);
            clearInterval(seconds_interval);

            // Add the message to the html
            document.getElementById("done").innerHTML =
              "Session Completed!! Take a Break";

            // Make the html message div visible
            document.getElementById("done").classList.add("show_message");

            // PLay the bell sound to tell the end of session
            bell.play();
          }
          // Reset the session seconds to 60
          session_seconds = 60;
        }
      }
}


function breakTimer() 
{
      // Change the minutes and seconds to starting time
      break_minutes = 4;
      break_seconds = 59;
      
      // Add the seconds and minutes to the page
      document.getElementById("breakminutes").innerHTML = break_minutes; 
      document.getElementById("breakseconds").innerHTML = break_seconds;

      // Start the countdown
      var minutes_interval = setInterval(minutesTimer, 60000);
      var seconds_interval = setInterval(secondsTimer, 1000);

      // Functions
      // Function for minute counter
      function minutesTimer() {
        break_minutes = break_minutes - 1;
        document.getElementById("breakminutes").innerHTML = break_minutes;
      }

      // Function for second counter
      function secondsTimer() {
        break_seconds = break_seconds - 1;
        document.getElementById("breakseconds").innerHTML = break_seconds;

        // Check if the seconds and minutes counter has reached 0
        // If reached 0 then end the session
        if (break_seconds <= 0) { //do not forget to change back to 0!!!
          if (break_minutes <= 0) { // do not forget to change back to 0!!!
            // Clears the interval i.e. stops the counter
            clearInterval(minutes_interval);
            clearInterval(seconds_interval);

            // Add the message to the html
            document.getElementById("done").innerHTML =
              "Break Completed. Back to Work!";

            // Make the html message div visible
            document.getElementById("done").classList.add("show_message");

            // PLay the bell sound to tell the end of session
            bell.play();
          }
          // Reset the session seconds to 60
          break_seconds = 60;
        }
      }
}
