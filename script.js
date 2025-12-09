document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const cv = document.getElementById("cv");
  const fallbackBtn = document.getElementById("fallback");

  let revealed = false;
  let shakeInstance = null;

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

  // shake support
  shakeInstance = new Shake({ threshold: 10, timeout: 700 });
  shakeInstance.start();
  window.addEventListener("shake", revealCV);

  // click anywhere to reveal
  document.body.addEventListener("click", revealCV);
  fallbackBtn.addEventListener("click", revealCV);
});
