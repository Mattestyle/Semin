(function () {
    const dustOverlay = document.getElementById("dust-overlay");
    const statusText = document.getElementById("status-text");
    const cvContainer = document.getElementById("cv-container");
    const enableMotionBtn = document.getElementById("enable-motion");
    const revealManualBtn = document.getElementById("reveal-manual");

    let shakeEnabled = false;
    let hasRevealed = false;
    let shakeInstance = null;

    function setStatus(text, type) {
        statusText.textContent = text;
        statusText.classList.remove("status-idle", "status-active", "status-error");
        statusText.classList.add(type || "status-idle");
    }

    function vibratePattern() {
        if (navigator.vibrate) {
            try {
                navigator.vibrate([80, 60, 80]);
            } catch (e) {
                // ignore
            }
        }
    }

    function revealCV() {
        if (hasRevealed) return;
        hasRevealed = true;

        vibratePattern();
        dustOverlay.classList.add("dust-gone");

        setTimeout(() => {
            dustOverlay.classList.add("hidden");
        }, 900);

        cvContainer.classList.remove("hidden");
        requestAnimationFrame(() => {
            cvContainer.classList.add("visible");
        });

        if (shakeInstance && typeof shakeInstance.stop === "function") {
            shakeInstance.stop();
        }
        window.removeEventListener("shake", onShake, false);
        setStatus("CV déverrouillé ✅", "status-active");
    }

    function onShake() {
        if (!shakeEnabled || hasRevealed) return;
        setStatus("Mouvement détecté — déverrouillage...", "status-active");
        revealCV();
    }

    function setupShake() {
        if (typeof Shake === "undefined") {
            setStatus("Erreur : module de détection de mouvement indisponible.", "status-error");
            return;
        }
        shakeInstance = new Shake({
            threshold: 13,
            timeout: 1000
        });
        shakeInstance.start();
        window.addEventListener("shake", onShake, false);
        shakeEnabled = true;
        setStatus("Secoue ton téléphone pour révéler le CV.", "status-idle");
    }

    function requestIOSPermissionIfNeeded() {
        if (typeof DeviceMotionEvent !== "undefined" &&
            typeof DeviceMotionEvent.requestPermission === "function") {
            enableMotionBtn.classList.remove("hidden");
            enableMotionBtn.addEventListener("click", function () {
                DeviceMotionEvent.requestPermission()
                    .then(function (response) {
                        if (response === "granted") {
                            setStatus("Capteurs activés. Tu peux secouer ton téléphone.", "status-active");
                            setupShake();
                            enableMotionBtn.classList.add("hidden");
                        } else {
                            setStatus("Accès aux capteurs refusé. Utilise le bouton d'affichage manuel.", "status-error");
                        }
                    })
                    .catch(function () {
                        setStatus("Impossible d'activer les capteurs. Utilise le bouton d'affichage manuel.", "status-error");
                    });
            });
        } else {
            enableMotionBtn.classList.add("hidden");
            setupShake();
        }
    }

    revealManualBtn.addEventListener("click", function () {
        revealCV();
    });

    document.addEventListener("DOMContentLoaded", function () {
        setStatus("En attente de mouvement...", "status-idle");
        requestIOSPermissionIfNeeded();
    });
})();
