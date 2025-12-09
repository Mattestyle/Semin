// Simplified local shake.js for iOS18/Android compatibility
(function (window, document) {
  function Shake(options) {
    this.hasDeviceMotion = 'ondevicemotion' in window;
    this.options = { threshold: 12, timeout: 800 };
    for (var key in options) this.options[key] = options[key];

    this.lastTime = new Date();
    this.lastX = this.lastY = this.lastZ = null;

    this.event = document.createEvent('Event');
    this.event.initEvent('shake', true, true);
  }

  Shake.prototype.reset = function () {
    this.lastTime = new Date();
    this.lastX = this.lastY = this.lastZ = null;
  };

  Shake.prototype.start = function () {
    this.reset();
    if (this.hasDeviceMotion) window.addEventListener('devicemotion', this, false);
  };

  Shake.prototype.stop = function () {
    if (this.hasDeviceMotion) window.removeEventListener('devicemotion', this, false);
    this.reset();
  };

  Shake.prototype.handleEvent = function (event) {
    if (event.type === 'devicemotion') this.devicemotion(event);
  };

  Shake.prototype.devicemotion = function (event) {
    var acc = event.accelerationIncludingGravity || {};
    var now = new Date();
    var diff = now - this.lastTime;

    if (diff > this.options.timeout) {
      if (this.lastX !== null) {
        var dx = Math.abs(acc.x - this.lastX);
        var dy = Math.abs(acc.y - this.lastY);
        var dz = Math.abs(acc.z - this.lastZ);
        if ((dx > this.options.threshold && dy > this.options.threshold) ||
            (dx > this.options.threshold && dz > this.options.threshold) ||
            (dy > this.options.threshold && dz > this.options.threshold)) {
          window.dispatchEvent(this.event);
          this.lastTime = now;
        }
      }
      this.lastX = acc.x;
      this.lastY = acc.y;
      this.lastZ = acc.z;
    }
  };

  window.Shake = Shake;
})(window, document);
