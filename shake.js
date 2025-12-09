// Version locale simplifiée de shake.js pour compatibilité GitHub Pages
(function (window, document) {
  function Shake(options) {
    this.hasDeviceMotion = 'ondevicemotion' in window;

    this.options = {
      threshold: 12,
      timeout: 800
    };

    if (typeof options === 'object') {
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          this.options[key] = options[key];
        }
      }
    }

    this.lastTime = new Date();
    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;

    this.event = document.createEvent('Event');
    this.event.initEvent('shake', true, true);
  }

  Shake.prototype.reset = function () {
    this.lastTime = new Date();
    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;
  };

  Shake.prototype.start = function () {
    this.reset();
    if (this.hasDeviceMotion) {
      window.addEventListener('devicemotion', this, false);
    }
  };

  Shake.prototype.stop = function () {
    if (this.hasDeviceMotion) {
      window.removeEventListener('devicemotion', this, false);
    }
    this.reset();
  };

  Shake.prototype.handleEvent = function (event) {
    if (event.type === 'devicemotion') {
      this.devicemotion(event);
    }
  };

  Shake.prototype.devicemotion = function (event) {
    var current = event.accelerationIncludingGravity;
    if (!current) return;

    var currentTime = new Date();
    var timeDifference = currentTime.getTime() - this.lastTime.getTime();

    if (timeDifference > this.options.timeout) {
      var deltaX = 0;
      var deltaY = 0;
      var deltaZ = 0;

      if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
        this.lastX = current.x;
        this.lastY = current.y;
        this.lastZ = current.z;
        return;
      }

      deltaX = Math.abs(this.lastX - current.x);
      deltaY = Math.abs(this.lastY - current.y);
      deltaZ = Math.abs(this.lastZ - current.z);

      if (((deltaX > this.options.threshold) && (deltaY > this.options.threshold)) ||
          ((deltaX > this.options.threshold) && (deltaZ > this.options.threshold)) ||
          ((deltaY > this.options.threshold) && (deltaZ > this.options.threshold))) {

        window.dispatchEvent(this.event);
        this.lastTime = new Date();
      }

      this.lastX = current.x;
      this.lastY = current.y;
      this.lastZ = current.z;
    }
  };

  window.Shake = Shake;
})(window, document);
