document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const cv = document.getElementById("cv");
  const fallbackBtn = document.getElementById("fallback");
  const activateBtn = document.getElementById("activate");

  let revealed = false;
  let shakeInstance = null;

  function initShake() {
    shakeInstance = new Shake({ threshold: 10, timeout: 700 });
    shakeInstance.start();
    window.addEventListener("shake", revealCV);
  }

  async function requestPermission() {
    if (typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const res = await DeviceMotionEvent.requestPermission();
        if (res === "granted") initShake();
      } catch (e) {}
    } else {
      initShake();
    }
  }

  function revealCV() {
    if (revealed) return;
    revealed = true;

    intro.classList.add("slide-up-fade");

    setTimeout(() => {
      intro.classList.add("hidden");
      cv.classList.remove("hidden");
    }, 450);

    if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
  }

  activateBtn.addEventListener("click", async () => {
    await requestPermission();
  });

  fallbackBtn.addEventListener("click", async () => {
    await requestPermission();
    revealCV();
  });

});
