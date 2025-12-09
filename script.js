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
    const major = parseInt(match[1], 10) || 0;
    const minor = parseInt(match[2] || "0", 10) || 0;
    return major + minor / 10;
  }

  const iosVersion = isIOS ? parseIOSVersion() : 0;
  const isModernIOS = isIOS && iosVersion >= 17;

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function vibrate() {
    if (navigator.vibrate) {
      try {
        navigator.vibrate([60, 40, 60]);
      } catch (e) {
        // ignore
      }
    }
  }

  function revealCV() {
    if (revealed) return;
    revealed = true;

    dust.classList.add("fade-out");
    setTimeout(() => {
      dust.style.display = "none";
    }, 800);

    intro.classList.add("hidden");
    cv.classList.remove("hidden");
    vibrate();
    setStatus("CV affiché.");
    if (shakeInstance && typeof shakeInstance.stop === "function") {
      shakeInstance.stop();
    }
    window.removeEventListener("shake", onShake);
  }

  function onShake() {
    if (!revealed) {
      revealCV();
    }
  }

  function initShake() {
    if (typeof Shake === "undefined") {
      setStatus("Secouement non disponible sur cet appareil.");
      return;
    }
    shakeInstance = new Shake({ threshold: 10, timeout: 700 });
    shakeInstance.start();
    window.addEventListener("shake", onShake);
    setStatus("Secouez doucement votre téléphone pour dépoussiérer l’écran.");
  }

  // Fallback manuel
  fallbackBtn.addEventListener("click", revealCV);

  // Gestion des permissions iOS modernes
  const hasRequestPermission =
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function";

  if (isModernIOS && hasRequestPermission) {
    // Toujours montrer le bouton sur iOS 17+
    enableMotionBtn.classList.remove("hidden");
    setStatus("Sur iPhone, appuyez sur "Activer les capteurs" puis autorisez l'accès.");

    enableMotionBtn.addEventListener("click", () => {
      DeviceMotionEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            setStatus("Capteurs activés. Secouez votre iPhone.");
            enableMotionBtn.classList.add("hidden");
            initShake();
          } else {
            setStatus("Accès aux capteurs refusé. Utilisez le bouton pour afficher le CV.");
          }
        })
        .catch(() => {
          setStatus("Impossible d'accéder aux capteurs. Utilisez le bouton pour afficher le CV.");
        });
    });
  } else if (!isIOS) {
    // Android et autres appareils
    initShake();
  } else {
    // iOS plus ancien ou sans requestPermission : on tente quand même
    setStatus("Secouez votre iPhone. Si rien ne se passe, utilisez le bouton pour afficher le CV.");
    initShake();
  }
});
