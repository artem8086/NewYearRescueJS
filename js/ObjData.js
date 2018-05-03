var ObjData;

ObjData = (function() {
  class ObjData {
    init() {}

    createObj(layer, x, y, drop) {
      var obj;
      obj = new Engine.objectTypes[this.type];
      obj.init(this, drop);
      obj.setPos(x, y);
      layer.add(obj);
      return obj;
    }

    getCenterX() {
      return this.cenX;
    }

    getCenterY() {
      return this.cenY;
    }

  };

  ObjData.prototype.isItem = false;

  ObjData.prototype.cenX = 0;

  ObjData.prototype.cenY = 0;

  ObjData.prototype.width = 0;

  ObjData.prototype.height = 0;

  return ObjData;

}).call(this);
