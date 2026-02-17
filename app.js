document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT ELEMENTS (Check these IDs against your HTML!)
    const sosButton = document.getElementById('sos-btn');
    const statusMsg = document.getElementById('statusMsg');
    const timerDisplay = document.getElementById('timer');

    let countdown;
    let timeLeft = 3;

    // 2. THE FUNCTIONS
    const startSOS = () => {
        if (!sosButton || !statusMsg || !timerDisplay) return; // Safety check
        timeLeft = 3;
        timerDisplay.innerText = timeLeft;
        sosButton.classList.add('active');
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

    const cancelSOS = () => {
        clearInterval(countdown);
        if (sosButton) sosButton.classList.remove('active');
        if (timerDisplay) timerDisplay.innerText = "";
        if (statusMsg) statusMsg.innerText = "Alert Cancelled";
        
        setTimeout(() => {
            if (statusMsg) statusMsg.innerText = "Ready";
        }, 2000);
    };

    const finishSOS = () => {
    // 1. Change Button Appearance
    sosButton.classList.remove('active');
    sosButton.classList.add('sent');
    statusMsg.innerText = "Attempting to locate...";

    // 2. Immediate Feedback (Vibration)
    if ("vibrate" in navigator) {
        navigator.vibrate([500, 100, 500]);
    }

    // 3. Trigger GPS
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // This is the line we've been perfecting!
        const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
        
        // Render the real link to the UI
        statusMsg.innerHTML = `🚨 ALERT SENT!<br><a href="${mapUrl}" target="_blank" style="color: white; background: blue; padding: 10px; border-radius: 5px; text-decoration: none;">TAP TO VIEW MAP</a>`;
        
        console.log("Map URL generated:", mapUrl);
    }, (error) => {
        statusMsg.innerText = "GPS Error: " + error.message;
        console.error(error);
    });

    // 4. Reset the app after 10 seconds
    setTimeout(() => {
        sosButton.classList.remove('sent');
        statusMsg.innerText = "Ready";
        timerDisplay.innerText = "";
    }, 10000);
};

    // 3. LISTENERS
    sosButton.addEventListener('mousedown', startSOS);
    sosButton.addEventListener('mouseup', cancelSOS);
    sosButton.addEventListener('touchstart', (e) => { e.preventDefault(); startSOS(); });
    sosButton.addEventListener('touchend', cancelSOS);
});