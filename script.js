const dust = document.getElementById("dust");
const intro = document.getElementById("intro");
const cv = document.getElementById("cv");
const status = document.getElementById("status");
const enableMotion = document.getElementById("enableMotion");
const fallback = document.getElementById("fallback");

let revealed = false;

function reveal() {
    if (revealed) return;
    revealed = true;
    dust.classList.add("fade");
    intro.classList.add("hidden");
    cv.classList.remove("hidden");
    if (navigator.vibrate) navigator.vibrate([60,40,60]);
}

fallback.onclick = reveal;

// iOS permission
if (typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function") {
    enableMotion.classList.remove("hidden");
    enableMotion.onclick = () => {
        DeviceMotionEvent.requestPermission().then(res => {
            if (res === "granted") {
                initShake();
                enableMotion.classList.add("hidden");
                status.textContent = "Capteurs activés.";
            } else {
                status.textContent = "Permission refusée.";
            }
        });
    };
} else {
    initShake();
}

function initShake() {
    const shaker = new Shake({ threshold: 10, timeout: 700 });
    shaker.start();
    window.addEventListener("shake", reveal);
    status.textContent = "Secouez votre téléphone.";
}
