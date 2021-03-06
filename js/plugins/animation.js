define(function () {

  return {
    requestAnimFrame: window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame,
    
    lastTime: 0,
    elapsedTime: function(){
      var timeNow = new Date().getTime(),
        elapsed = timeNow - this.lastTime;

      if (lastTime === 0) elapsed = 0;

      this.lastTime = timeNow;
      return elapsed;
    }
  };
});
