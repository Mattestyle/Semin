document.addEventListener("DOMContentLoaded", () => {
  const dust = document.getElementById("dust");
  const intro = document.getElementById("intro");
  const cv = document.getElementById("cv");
  const statusEl = document.getElementById("status");
  const enableMotionBtn = document.getElementById("enableMotion");
  const fallbackBtn = document.getElementById("fallback");

  let revealed = false;
  let shakeInstance = null;

  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  function parseIOSVersion() {
    const match = ua.match(/OS (\d+)_?(\d+)?/);
    if (!match) return 0;
    return parseInt(match[1], 10) + (parseInt(match[2] || "0", 10) / 10);
  }

  const iosVersion = isIOS ? parseIOSVersion() : 0;
  const isModernIOS = isIOS && iosVersion >= 17;

  function setStatus(msg) { statusEl.textContent = msg; }

  function vibrate() {
    if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
  }

  function revealCV() {
    if (revealed) return;
    revealed = true;

    dust.classList.add("animate-out");
    setTimeout(() => { dust.style.display = "none"; }, 900);

    intro.classList.add("hidden");
    cv.classList.remove("hidden");
    vibrate();
  }

  function initShake() {
    shakeInstance = new Shake({ threshold: 10, timeout: 700 });
    shakeInstance.start();
    window.addEventListener("shake", revealCV);
    setStatus("Secouez doucement votre iPhone.");
  }

  fallbackBtn.addEventListener("click", revealCV);

  const hasRequestPermission =
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function";

  if (isModernIOS && hasRequestPermission) {
    enableMotionBtn.classList.remove("hidden");
    setStatus("Appuyez sur « Activer les capteurs » puis autorisez l’accès.");
    enableMotionBtn.addEventListener("click", () => {
      DeviceMotionEvent.requestPermission().then(res => {
        if (res === "granted") {
          enableMotionBtn.classList.add("hidden");
          initShake();
        } else setStatus("Permission refusée. Utilisez le bouton pour afficher le CV.");
      }).catch(() => setStatus("Impossible d’accéder aux capteurs."));
    });
  } else if (!isIOS) {
    initShake();
  } else {
    initShake();
    setStatus("Secouez votre iPhone. Si rien ne se passe, utilisez le bouton pour afficher le CV.");
  }
});
