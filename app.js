document.addEventListener('DOMContentLoaded', () => {
    const sosButton = document.getElementById('sos-btn');
    const statusMsg = document.getElementById('statusMsg');
    const timerDisplay = document.getElementById('timer');
    
    // THE SIREN: Create an audio object
    const siren = new Audio('siren.mp3'); 
    siren.loop = true;

    let countdown;
    let timeLeft = 3;
    let isSent = false; 

    const startSOS = () => {
        if (isSent) return; 
        timeLeft = 3;
        timerDisplay.innerText = timeLeft;
        sosButton.classList.add('active');
        statusMsg.innerText = "CONFIRMING...";
        
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
        if (isSent) return; 
        clearInterval(countdown);
        sosButton.classList.remove('active');
        timerDisplay.innerText = "";
        statusMsg.innerText = "VigilantNG Ready";
    };

    const finishSOS = () => {
        isSent = true; 
        sosButton.classList.replace('active', 'sent');
        statusMsg.innerText = "BROADCASTING...";

        // START THE SIREN
        siren.play().catch(e => console.log("Audio play blocked until user interaction"));

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
            
            // CONTACT LIST (Add your test numbers here)
            const contacts = ["+234XXXXXXXXXX", "+234YYYYYYYYYY"]; 
            const smsBody = `EMERGENCY! I need help. My location: ${mapUrl}`;
            
            // We use the first contact for the quick-action button
            const smsUrl = `sms:${contacts[0]}?body=${encodeURIComponent(smsBody)}`;

            statusMsg.innerHTML = `
                <div class="action-box">
                    <a href="${smsUrl}" class="btn-sms">📲 SEND SMS ALERT</a>
                    <a href="${mapUrl}" target="_blank" class="btn-map">🗺️ VIEW MAP</a>
                    <button onclick="stopSiren()" class="btn-stop">🔇 STOP SIREN</button>
                    <button onclick="location.reload()" class="btn-reset">Reset System</button>
                </div>
            `;
        }, (error) => {
            statusMsg.innerText = "GPS Error: " + error.message;
            isSent = false;
        });
    };

    // Global function to stop the noise
    window.stopSiren = () => {
        siren.pause();
        siren.currentTime = 0;
    };

    sosButton.addEventListener('mousedown', startSOS);
    sosButton.addEventListener('mouseup', cancelSOS);
    sosButton.addEventListener('touchstart', (e) => { e.preventDefault(); startSOS(); });
    sosButton.addEventListener('touchend', cancelSOS);
});