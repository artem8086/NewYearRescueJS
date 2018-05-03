var Layer, ObjPos;

Layer = (function() {
  class Layer {
    load() {
      var i, last, obj, ref, ref1, results;
      last = null;
      ref = this.objects;
      results = [];
      for (i in ref) {
        obj = ref[i];
        obj = new ObjPos(obj.x, obj.y, Engine.objects[obj.name], (ref1 = obj.drop) != null ? ref1 : Engine.objects[obj.drop]);
        if (last != null) {
          last.next = last = obj;
          last = obj;
        } else {
          this.objsPos = last = obj;
        }
        this.curObj = this.objsPos;
        if (this.autoParalax) {
          obj.x *= this.paralaxX;
          results.push(obj.y *= this.paralaxY);
        } else {
          results.push(void 0);
        }
      }
      return results;
    }

    init() {
      this.xOffs = this.yOffs = 0;
      this.curObj = this.objsPos;
      return this.objs = null;
    }

    act() {
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
    }

    draw(g) {
      var obj;
      if (this.visible) {
        g.save();
        g.translate(-this.x, -this.y);
        obj = this.objs;
        while (obj != null) {
          obj.draw(g);
          obj = obj.next;
        }
        
        return g.restore();
      }
    }

    add(obj) {
      obj.next = this.objs;
      return this.objs = obj;
    }

    removeAll() {
      return this.objs = null;
    }

  };

  Layer.prototype.visible = true;

  Layer.prototype.paralaxX = 1;

  Layer.prototype.paralaxY = 1;

  Layer.prototype.autoParalax = true;

  Layer.prototype.xOffs = 0;

  Layer.prototype.yOffs = 0;

  return Layer;

}).call(this);

ObjPos = class ObjPos {
  constructor(x, y, data, drop) {
    this.x = x;
    this.y = y;
    this.data = data;
    this.drop = drop;
  }

  addObj(layer) {
    return this.data.createObj(layer, this.x, this.y, this.drop);
  }

};
