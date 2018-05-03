(function() {
  var Bullet, Decor, Dynamic, ItemData, PolyModel, Static, UnitData,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Engine.objectData['Decor'] = Decor = (function(_super) {
    __extends(Decor, _super);

    function Decor() {
      return Decor.__super__.constructor.apply(this, arguments);
    }

    Decor.prototype.anim = 0;

    Decor.prototype.type = 'Decoration';

    Decor.prototype.init = function() {
      return this.animData = animation.anims[this.animation];
    };

    return Decor;

  })(ObjData);

  Engine.objectData['PolyModel'] = PolyModel = (function(_super) {
    __extends(PolyModel, _super);

    function PolyModel() {
      return PolyModel.__super__.constructor.apply(this, arguments);
    }

    PolyModel.prototype.type = 'ModelObj';

    PolyModel.prototype.zoom = 1;

    PolyModel.prototype.init = function() {
      return this.model = animation.models[this.modelPath];
    };

    return PolyModel;

  })(ObjData);

  Engine.objectData['Static'] = Static = (function(_super) {
    __extends(Static, _super);

    function Static() {
      return Static.__super__.constructor.apply(this, arguments);
    }

    Static.FLIP_X_MASK = 1;

    Static.FLIP_Y_MASK = 2;

    Static.prototype.deathAnim = 0;

    Static.prototype.hp = -1;

    Static.prototype.friction = 0;

    Static.prototype.collision = 0;

    Static.prototype.flip = 0;

    Static.prototype.type = 'StaticObj';

    return Static;

  })(Decor);

  Engine.objectData['Dynamic'] = Dynamic = (function(_super) {
    __extends(Dynamic, _super);

    function Dynamic() {
      return Dynamic.__super__.constructor.apply(this, arguments);
    }

    Dynamic.prototype.min_damage = 0;

    Dynamic.prototype.damageX_reduct = 1;

    Dynamic.prototype.damageY_reduct = 1;

    Dynamic.prototype.max_speedX = 0;

    Dynamic.prototype.max_speedY = 0;

    Dynamic.prototype.mass = 1;

    Dynamic.prototype.coll_mask = 0;

    Dynamic.prototype.type = 'DynamicObj';

    return Dynamic;

  })(Static);

  Engine.objectData['ItemData'] = ItemData = (function(_super) {
    __extends(ItemData, _super);

    function ItemData() {
      return ItemData.__super__.constructor.apply(this, arguments);
    }

    ItemData.prototype.ammo = 0;

    ItemData.prototype.iconAnim = 0;

    ItemData.prototype.type = 'Item';

    ItemData.prototype.isItem = true;

    ItemData.prototype.init = function() {
      ItemData.__super__.init.apply(this, arguments)();
      return this.icon = animation.anims[this.iconName];
    };

    return ItemData;

  })(Dynamic);

  Engine.objectData['UnitData'] = UnitData = (function(_super) {
    __extends(UnitData, _super);

    function UnitData() {
      return UnitData.__super__.constructor.apply(this, arguments);
    }

    UnitData.prototype.inAirStatus = 13;

    UnitData.prototype.startFrame = 0;

    UnitData.prototype.startStatus = 0;

    UnitData.prototype.deathStatus = 0;

    UnitData.prototype.jumpX = 0;

    UnitData.prototype.jumpY = 0;

    UnitData.prototype.type = 'UnitObj';

    UnitData.prototype.init = function() {
      var anim, form, frame, i, key, _i, _len, _ref, _ref1, _ref2, _ref3;
      _ref = this.frames;
      for (i in _ref) {
        frame = _ref[i];
        if (frame.form == null) {
          frame.form = 0;
        }
        if (frame.count == null) {
          frame.count = 0;
        }
        if (frame.next == null) {
          frame.next = +i + 1;
        }
      }
      _ref1 = this.forms;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        form = _ref1[_i];
        form.__proto__ = Engine.objectData[(_ref2 = form["class"]) != null ? _ref2 : 'Dynamic'].prototype;
        form.init();
      }
      this.animsData = [];
      _ref3 = this.anims;
      for (key in _ref3) {
        anim = _ref3[key];
        this.animsData[key] = animation.anims[anim];
      }
      return null;
    };

    return UnitData;

  })(ObjData);

  Engine.objectData['Bullet'] = Bullet = (function(_super) {
    __extends(Bullet, _super);

    function Bullet() {
      return Bullet.__super__.constructor.apply(this, arguments);
    }

    Bullet.prototype.damage = 0;

    Bullet.prototype.range = -1;

    Bullet.prototype.coll_mask = 0;

    Bullet.prototype.velX = 0;

    Bullet.prototype.velY = 0;

    Bullet.prototype.forceX = 0;

    Bullet.prototype.forceT = 0;

    Bullet.prototype.type = 'BulletObj';

    return Bullet;

  })(Static);

}).call(this);
