// Minimal local shake.js
(function (window, document) {
    function Shake(opts){this.hasDeviceMotion='ondevicemotion'in window;this.options={threshold:12,timeout:800};if(typeof opts==='object'){for(var k in opts){this.options[k]=opts[k];}}this.lastTime=new Date();this.lastX=null;this.lastY=null;this.lastZ=null;this.event=document.createEvent('Event');this.event.initEvent('shake',true,true);}
    Shake.prototype.reset=function(){this.lastTime=new Date();this.lastX=this.lastY=this.lastZ=null;}
    Shake.prototype.start=function(){this.reset();if(this.hasDeviceMotion){window.addEventListener('devicemotion',this,false);}}
    Shake.prototype.stop=function(){if(this.hasDeviceMotion){window.removeEventListener('devicemotion',this,false);}this.reset();}
    Shake.prototype.handleEvent=function(e){if(e.type==='devicemotion'){this.devicemotion(e);}}
    Shake.prototype.devicemotion=function(e){var c=e.accelerationIncludingGravity;if(!c)return;var ct=new Date();var diff=ct-this.lastTime;if(diff>this.options.timeout){if(this.lastX!==null){var dx=Math.abs(c.x-this.lastX),dy=Math.abs(c.y-this.lastY),dz=Math.abs(c.z-this.lastZ);if((dx>this.options.threshold&&dy>this.options.threshold)||(dx>this.options.threshold&&dz>this.options.threshold)||(dy>this.options.threshold&&dz>this.options.threshold)){window.dispatchEvent(this.event);this.lastTime=new Date();}}
        this.lastX=c.x;this.lastY=c.y;this.lastZ=c.z;}
    }
    window.Shake=Shake;
})(window,document);
