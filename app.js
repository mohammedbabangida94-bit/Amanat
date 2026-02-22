/** * SECURITY COMMAND CENTER CONFIGURATION 
 */
// STEP 1: Change this ID for each app (e.g., "shori_magodo_001" or "amanat_kano_001")
const MY_CLIENT_ID = "amanat_kano_001"; 

// STEP 2: Your unique Raw URL
const MASTER_SWITCH_URL = "https://raw.githubusercontent.com/mohammedbabangida94-bit/Vigilant-Admin/refs/heads/main/sys_check_772.json";

/**
 * ACCESS CONTROL ENGINE
 * This checks the Master Ledger before allowing the user to use the app.
 */
async function validateAccess() {
    try {
        // Fetching the status from your Admin Repo
        const response = await fetch(MASTER_SWITCH_URL);
        
        if (!response.ok) {
            console.warn("Command Center unreachable. Defaulting to Active.");
            return; // Let them in if GitHub is down (Safety First)
        }

        const statusData = await response.json();

        // STEP 3: Check if this specific client is active
        if (statusData[MY_CLIENT_ID] !== "suspended") {
            // Trigger the Restricted Access Screen
            // Change 'english' to 'yoruba' or 'hausa' depending on the brand folder
            renderRestrictedUI('english'); 
        } else {
            console.log(`Access verified for ${MY_CLIENT_ID}. System Green.`);
        }
    } catch (error) {
        console.error("Connection Error:", error);
        // We do not block the user if they have no internet/connection issues
    }
}

/**
 * THE RESTRICTED SCREEN (The "Kill Switch" View)
 */
function renderRestrictedUI(lang) {
    const labels = {
        
        'hausa': { title: 'An Takaita Shiga', msg: 'An dakatar da wannan akant dinka.', contact: 'mai kula da shirin' }
    };

    const ui = labels[lang];

    document.body.innerHTML = `
        <div style="background-color: #000; color: #fff; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; border: 15px solid #d32f2f; box-sizing: border-box;">
            <div style="font-size: 80px; color: #d32f2f; margin-bottom: 20px;">⚠️</div>
            <h1 style="text-transform: uppercase; color: #d32f2f;">${ui.title}</h1>
            <p style="font-size: 18px; max-width: 300px; margin: 20px;">${ui.msg}<br><br>Please contact <strong>${ui.contact}</strong>.</p>
            <div style="background: #d32f2f; padding: 10px 20px; border-radius: 5px;">REF: ${MY_CLIENT_ID}</div>
        </div>
    `;
    
    // Stop any further script execution
    throw new Error("Access Suspended.");
}

// EXECUTE CHECK ON LOAD
validateAccess();

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
        statusMsg.innerText = "RIKE...";

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
        statusMsg.innerText = "Amanat Na jira";
    };

    const finishSOS = () => {
    isSent = true;
    sosButton.classList.add('sent');
    statusMsg.innerText = "Ana sanarwa...";

    // Trigger Siren & Vibration
    siren.play().catch(e => console.log("Audio blocked: " + e));
    if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500, 200, 500]); // SOS pattern
    }

    const showSmsButton = (mapUrl = "") => {
        const primaryNum = document.getElementById('contact1').value;
        const locationText = mapUrl ? ` My location: ${mapUrl}` : " (Location unavailable)";
        const smsBody = `EMERGENCY! I need help.${locationText}`;
        const smsUrl = `sms:${primaryNum}?body=${encodeURIComponent(smsBody)}`;

        statusMsg.innerHTML = `
            <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px; width: 100%;">
                <a href="${smsUrl}" style="background: #25D366; color: white; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: bold; text-align: center; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);">📲 AIKA SOKON SMS</a>
                <button onclick="stopAll()" style="background: #ff4444; color: white; padding: 15px; border-radius: 12px; border: none; font-weight: bold; cursor: pointer;">🔇 TSAYAR DA NAURAR ALAM DAN KA MAIMAITA</button>
            </div>
        `;
    };

    // Try to get location, but don't wait forever
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const mapUrl = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
            showSmsButton(mapUrl);
        },
        (error) => {
            console.log("GPS Failed:", error.message);
            showSmsButton(); // Show button anyway without location
        },
        { timeout: 8000 } // Wait max 8 seconds for GPS
    );
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