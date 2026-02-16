// Selecting UI Elements
const sosButton = document.getElementById('sosButton');
const statusMsg = document.getElementById('statusMsg');
const timerDisplay = document.getElementById('timer');

let countdown;
let timeLeft = 3;

// 1. Start Countdown (Triggered by Press)
const startSOS = () => {
    timeLeft = 3;
    timerDisplay.innerText = timeLeft;
    sosButton.classList.add('active'); // Turns button orange
    statusMsg.innerText = "Hold for 3 seconds...";

    countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            finishSOS();
        }
    }, 1000);
};

// 2. Cancel SOS (Triggered if user lets go early)
const cancelSOS = () => {
    clearInterval(countdown);
    sosButton.classList.remove('active');
    timerDisplay.innerText = "";
    statusMsg.innerText = "Alert Cancelled";
    
    // Reset to original state after 2 seconds
    setTimeout(() => {
        statusMsg.innerText = "Ready";
    }, 2000);
};

// 3. Final Execution (The "Success" state)
const finishSOS = () => {
    sosButton.classList.remove('active');
    sosButton.classList.add('sent'); // Turns button green
    statusMsg.innerText = "Locating...";

    // Trigger Vibration (Heartbeat pattern)
    if ("vibrate" in navigator) {
        navigator.vibrate([500, 100, 500]);
    }

    // Get GPS Coordinates
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Corrected Map URL logic
        const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
        
        // UI Fix: Using innerHTML to render the clickable link
        statusMsg.innerHTML = `🚨 ALERT SENT!<br><a href="${mapUrl}" target="_blank" style="color: white; font-weight: bold; text-decoration: underline;">TAP TO VIEW MAP</a>`;
        
        console.log("Map URL:", mapUrl);

    }, (error) => {
        statusMsg.innerText = "GPS Error: " + error.message;
    });

    // Reset app to Red state after 10 seconds
    setTimeout(() => {
        sosButton.classList.remove('sent');
        statusMsg.innerText = "Ready";
        timerDisplay.innerText = "";
    }, 10000);
};

// Event Listeners for Mobile and Desktop
sosButton.addEventListener('mousedown', startSOS);
sosButton.addEventListener('mouseup', cancelSOS);
sosButton.addEventListener('touchstart', (e) => { e.preventDefault(); startSOS(); });
sosButton.addEventListener('touchend', cancelSOS);