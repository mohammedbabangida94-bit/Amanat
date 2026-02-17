document.addEventListener('DOMContentLoaded', () => {
    const sosButton = document.getElementById('sos-btn');
    const statusMsg = document.getElementById('statusMsg');
    const timerDisplay = document.getElementById('timer');
    const siren = document.getElementById('sirenAudio');

    let countdown;
    let timeLeft = 3;
    let isSent = false;

    // AUDIO PRIMING: Mobile browsers need one "legal" touch to allow sound
    const primeAudio = () => {
        siren.play().then(() => {
            siren.pause(); // Start and immediately pause to "unlock" it
            siren.currentTime = 0;
        }).catch(e => console.log("Waiting for user interaction..."));
        // Remove this listener after first touch
        document.removeEventListener('touchstart', primeAudio);
    };
    document.addEventListener('touchstart', primeAudio);

    const startSOS = () => {
        if (isSent) return;
        timeLeft = 3;
        timerDisplay.innerText = timeLeft;
        sosButton.classList.add('active');
        statusMsg.innerText = "HOLDING...";

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
        sosButton.classList.add('sent');
        statusMsg.innerText = "BROADCASTING...";

        // Trigger Siren
        siren.play().catch(e => console.log("Audio play blocked: " + e));

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
            
            const primaryNum = document.getElementById('contact1').value;
            const smsBody = `EMERGENCY! I need help. My location: ${mapUrl}`;
            const smsUrl = `sms:${primaryNum}?body=${encodeURIComponent(smsBody)}`;

            statusMsg.innerHTML = `
                <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px; width: 100%;">
                    <a href="${smsUrl}" style="background: #25D366; color: white; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: bold; text-align: center; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);">📲 SEND SMS ALERT</a>
                    <button onclick="stopAll()" style="background: #ff4444; color: white; padding: 15px; border-radius: 12px; border: none; font-weight: bold; cursor: pointer;">🔇 STOP SIREN & RESET</button>
                </div>
            `;
        }, (error) => {
            statusMsg.innerText = "GPS Error: " + error.message;
            isSent = false;
        });
    };
    window.stopAll = () => {
        siren.pause();
        siren.currentTime = 0;
        location.reload(); // Hard reset for safety
    };

    sosButton.addEventListener('mousedown', startSOS);
    sosButton.addEventListener('mouseup', cancelSOS);
    sosButton.addEventListener('touchstart', (e) => { e.preventDefault(); startSOS(); });
    sosButton.addEventListener('touchend', cancelSOS);
});