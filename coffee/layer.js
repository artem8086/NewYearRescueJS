(function() {
  var Layer;

  Layer = (function() {
    function Layer() {}

    Layer.prototype.paralaxX = 1;

    Layer.prototype.paralaxY = 1;

    Layer.prototype.autoParalax = true;

    Layer.prototype.laod = function() {
      var engine, object, _i, _len, _ref, _results;
      engine = Game.getGame().engine;
      _ref = this.object;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        object.data = engine.objects[object.name];
        if (this.autoParalax) {
          object.x *= this.paralaxX;
          _results.push(object.y *= this.paralaxY);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Layer.prototype.init = function() {
      var objs;
      this.xOffs = this.yOffs = 0;
      this.curObj = this.objects.lenght - 1;
      return objs = [];
    };

    Layer.prototype.act = function() {
      var engine;
      if ((this.curObj != null) || objs.lenght !== 0) {
        engine = Game.getGame().engine;
        this.x = (engine.camX + this.xOffs) * this.paralaxX - Game.width / 2;
        return this.x = (engine.camY + this.yOffs) * this.paralaxY - Game.height / 2;
      }
    };

    Layer.prototype.draw = function(g) {
      var object, _i, _len, _ref;
      g.save();
      g.translate(-this.x, -this.y);
      _ref = this.objs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        object.draw(g);
      }
      return g.restore();
    };

    return Layer;

  })();

}).call(this);
