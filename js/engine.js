var Engine;

Engine = (function() {
  class Engine {
    loadLevel(level = Engine.START_LEVEL) {
      /*level = Engine.levels[level]
      if @level != level
      	@level = level
       * Init layers
      	for key, layer of level.layers
      		layer = level.layers[key] = Object.create Layer, layer
      		do layer.load
      level */
      this.anim = new Model(animation.models['models/house0back']);
      return this.anim2 = new Model(animation.models['models/house0front']);
    }

    act(game) {
      this.anim.incAnim();
      return this.anim.incAnim();
    }

    draw(g) {
      g.save();
      g.translate(512, 320);
      this.anim.play(g, -480, 280);
      this.anim2.play(g, -480, 280);
      return g.restore();
    }

  };

  Engine.START_LEVEL = 'start';

  Engine.objectsClasses = [];

  Engine.objects = [];

  Engine.levels = [];

  Engine.prototype.layer = {
    x: 0,
    y: 0
  };

  return Engine;

}).call(this);
