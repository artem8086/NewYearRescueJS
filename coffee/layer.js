(function() {
  var Layer, ObjPos;

  Layer = (function() {
    function Layer() {}

    Layer.prototype.paralaxX = 1;

    Layer.prototype.paralaxY = 1;

    Layer.prototype.autoParalax = true;

    Layer.prototype.xOffs = 0;

    Layer.prototype.yOffs = 0;

    Layer.prototype.load = function() {
      var last, obj, _i, _len, _ref, _ref1, _results;
      last = null;
      _ref = this.objects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        obj = new ObjPos(obj.x, obj.y, Engine.objects[obj.name], (_ref1 = obj.drop) != null ? _ref1 : Engine.objects[obj.drop]);
        if (last != null) {
          last.next = last = obj;
          last = obj;
        } else {
          this.objsPos = last = obj;
        }
        this.curObj = this.objsPos;
        if (this.autoParalax) {
          obj.x *= this.paralaxX;
          _results.push(obj.y *= this.paralaxY);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Layer.prototype.init = function() {
      this.xOffs = this.yOffs = 0;
      this.curObj = this.objsPos;
      return this.objs = null;
    };

    Layer.prototype.act = function() {
      var camera, engine, nextObj, obj, pred;
      if ((this.curObj != null) || (this.objs != null)) {
        engine = Game.getGame().engine;
        this.x = (engine.camX + this.xOffs) * this.paralaxX - Game.width / 2;
        this.y = (engine.camY + this.yOffs) * this.paralaxY - Game.height / 2;
        camera = engine.curCamera;
        while ((this.curObj != null) && Camera.contain(this.curObj.data, this.curObj.data.getCenterX(), this.curObj.data.getCenterY(), this.curObj.x, this.curObj.y, this.x, this.y, camera.add_mask)) {
          this.curObj.addObj(this);
          this.curObj = this.curObj.next;
        }
        pred = null;
        nextObj = null;
        obj = this.objs;
        while (obj != null) {
          nextObj = obj.next;
          if (!Camera.contain(obj.data, obj.getCenterX(), obj.getCenterY(), obj.x, obj.y, this.x, this.y, camera.del_mask) || obj.act(this)) {
            if (pred == null) {
              this.objs = nextObj;
            } else {
              pred.next = nextObj;
            }
            obj.pool();
          } else {
            pred = obj;
          }
          obj = nextObj;
        }
        return false;
      }
    };

    Layer.prototype.draw = function(g) {
      var obj;
      g.save();
      g.translate(-this.x, -this.y);
      obj = this.objs;
      while (obj != null) {
        obj.draw(g);
        obj = obj.next;
      }
      return g.restore();
    };

    Layer.prototype.add = function(obj) {
      obj.next = this.objs;
      return this.objs = obj;
    };

    Layer.prototype.removeAll = function() {
      return this.objs = null;
    };

    return Layer;

  })();

  ObjPos = (function() {
    function ObjPos(x, y, data, drop) {
      this.x = x;
      this.y = y;
      this.data = data;
      this.drop = drop;
    }

    ObjPos.prototype.addObj = function(layer) {
      return this.data.createObj(layer, this.x, this.y, this.drop);
    };

    return ObjPos;

  })();

}).call(this);
