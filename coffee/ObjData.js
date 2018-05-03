(function() {
  var ObjData;

  ObjData = (function() {
    function ObjData() {}

    ObjData.prototype.isItem = false;

    ObjData.prototype.cenX = 0;

    ObjData.prototype.cenY = 0;

    ObjData.prototype.width = 0;

    ObjData.prototype.height = 0;

    ObjData.prototype.init = function() {};

    ObjData.prototype.createObj = function(layer, x, y, drop) {
      var obj;
      obj = new Engine.objectTypes[this.type];
      obj.init(this, drop);
      obj.setPos(x, y);
      layer.add(obj);
      return obj;
    };

    ObjData.prototype.getCenterX = function() {
      return this.cenX;
    };

    ObjData.prototype.getCenterY = function() {
      return this.cenY;
    };

    return ObjData;

  })();

}).call(this);
