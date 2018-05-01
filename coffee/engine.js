(function() {
  var Engine;

  Engine = (function() {
    function Engine() {}

    Engine.START_LEVEL = 'start';

    Engine.objectsClasses = [];

    Engine.objects = [];

    Engine.levels = [];

    Engine.prototype.layer = {
      x: 0,
      y: 0
    };

    Engine.prototype.loadLevel = function(level) {
      if (level == null) {
        level = Engine.START_LEVEL;
      }

      /*level = Engine.levels[level]
      		if @level != level
      			@level = level
      			 * Init layers
      			for key, layer of level.layers
      				layer = level.layers[key] = Object.create Layer, layer
      				do layer.load
      		level
       */
      this.anim = new Model(animation.models['models/house0back']);
      return this.anim2 = new Model(animation.models['models/house0front']);
    };

    Engine.prototype.act = function(game) {
      this.anim.incAnim();
      return this.anim.incAnim();
    };

    Engine.prototype.draw = function(g) {
      g.save();
      g.translate(512, 320);
      this.anim.play(g, -480, 280);
      this.anim2.play(g, -480, 280);
      return g.restore();
    };

    return Engine;

  })();

}).call(this);
