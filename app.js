// 1. Variable Declarations
let timer = null; 
let count = 3;    

const sosBtn = document.getElementById('sos-btn');
const statusMsg = document.getElementById('status-msg');

// 2. The Main Click Logic
sosBtn.addEventListener('click', () => {
    // Check if a countdown is already happening
    if (timer) {
        cancelSOS();
        return;
    }

    startCountdown();
});

// 3. The Countdown Function
function startCountdown() {
    count = 3;
    sosBtn.innerText = count;
    sosBtn.style.backgroundColor = "#ff9800"; // Orange
    statusMsg.innerText = "🚨 SOS initializing... Click to cancel.";
    statusMsg.style.color = "orange";

    timer = setInterval(() => {
        count--;
        sosBtn.innerText = count;

        if (count <= 0) {
            finishSOS();
        }
    }, 1000);
}

// 4. The Cancel Function
function cancelSOS() {
    clearInterval(timer);
    timer = null;
    sosBtn.innerText = "SOS";
    sosBtn.style.backgroundColor = "#d32f2f"; // Back to Red
    statusMsg.innerText = "Alert Cancelled.";
    statusMsg.style.color = "black";
}

// 5. The "Fire" Function
function finishSOS() {
    clearInterval(timer);
    timer = null;
    sosBtn.innerText = "SENT";
    sosBtn.style.backgroundColor = "#4caf50"; // Green

    getLocation();

    statusMsg.innerText = "🚨 Alert Sent to Estate Security!";
    statusMsg.style.color = "red";

    if ("vibrate" in navigator) {
        navigator.vibrate([500, 110, 500]); 
    }
    
    // --- NEW RESET LOGIC ---
    // After 5 seconds (5000ms), reset the button to its original state
    setTimeout(() => {
        if (!timer) { // Only reset if a new countdown hasn't started
            sosBtn.innerText = "SOS";
            sosBtn.style.backgroundColor = "#d32f2f"; // Back to Red
            statusMsg.innerText = "Ready";
            statusMsg.style.color = "black";
        }
    }, 5000);


    console.log("SOS triggered at: " + new Date().toLocaleTimeString());
}

function getLocation() {
    if ("geolocation" in navigator) {
        statusMsg.innerText = "🛰️ Locating you...";
        
        navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    
    // Create a Google Maps URL
    const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
    
    console.log(`Map Link: ${mapUrl}`);
    
    // Update the message so the user can see their coordinates are locked
    statusMsg.innerHTML = `🚨 Alert Sent!<br><a href="${mapUrl}" target="_blank" style="color: white;">View Location on Map</a>`;
            // This is where we will eventually send the data to the server
        }, (error) => {
            console.error("Error getting location: ", error);
            statusMsg.innerText = "🚨 Alert Sent (Location Denied)";
        });
    } else {
        statusMsg.innerText = "🚨 Alert Sent (GPS not supported)";
    }
}
