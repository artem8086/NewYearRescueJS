var Layer;

Layer = (function() {
  class Layer {
    laod() {
      var engine, i, len, object, ref, results;
      engine = Game.getGame().engine;
      ref = this.object;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        object = ref[i];
        object.data = engine.objects[object.name];
        if (this.autoParalax) {
          object.x *= this.paralaxX;
          results.push(object.y *= this.paralaxY);
        } else {
          results.push(void 0);
        }
      }
      return results;
    }

    init() {
      var objs;
      this.xOffs = this.yOffs = 0;
      this.curObj = this.objects.lenght - 1;
      return objs = [];
    }

    act() {
      var engine;
      if ((this.curObj != null) || objs.lenght !== 0) {
        engine = Game.getGame().engine;
        this.x = (engine.camX + this.xOffs) * this.paralaxX - Game.width / 2;
        return this.x = (engine.camY + this.yOffs) * this.paralaxY - Game.height / 2;
      }
    }

    draw(g) {
      var i, len, object, ref;
      g.save();
      g.translate(-this.x, -this.y);
      ref = this.objs;
      for (i = 0, len = ref.length; i < len; i++) {
        object = ref[i];
        object.draw(g);
      }
      
      return g.restore();
    }

  };

  Layer.prototype.paralaxX = 1;

  Layer.prototype.paralaxY = 1;

  Layer.prototype.autoParalax = true;

  return Layer;

}).call(this);
