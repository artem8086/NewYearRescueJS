var Bullet, Decor, Dynamic, ItemData, PolyModel, Static, UnitData;

Engine.objectData['Decor'] = Decor = (function() {
  class Decor extends ObjData {
    init() {
      return this.animData = animation.anims[this.animation];
    }

  };

  Decor.prototype.anim = 0;

  Decor.prototype.type = 'Decoration';

  return Decor;

}).call(this);

Engine.objectData['PolyModel'] = PolyModel = (function() {
  class PolyModel extends ObjData {
    init() {
      return this.model = animation.models[this.modelPath];
    }

  };

  PolyModel.prototype.type = 'ModelObj';

  PolyModel.prototype.zoom = 1;

  return PolyModel;

}).call(this);

Engine.objectData['Static'] = Static = (function() {
  class Static extends Decor {};

  Static.FLIP_X_MASK = 1;

  Static.FLIP_Y_MASK = 2;

  Static.prototype.deathAnim = 0;

  Static.prototype.hp = -1;

  Static.prototype.friction = 0;

  Static.prototype.collision = 0;

  Static.prototype.flip = 0;

  Static.prototype.type = 'StaticObj';

  return Static;

}).call(this);

Engine.objectData['Dynamic'] = Dynamic = (function() {
  class Dynamic extends Static {};

  Dynamic.prototype.min_damage = 0;

  Dynamic.prototype.damageX_reduct = 1;

  Dynamic.prototype.damageY_reduct = 1;

  Dynamic.prototype.max_speedX = 0;

  Dynamic.prototype.max_speedY = 0;

  Dynamic.prototype.mass = 1;

  Dynamic.prototype.coll_mask = 0;

  Dynamic.prototype.type = 'DynamicObj';

  return Dynamic;

}).call(this);

Engine.objectData['ItemData'] = ItemData = (function() {
  class ItemData extends Dynamic {
    init() {
      super.init();
      return this.icon = animation.anims[this.iconName];
    }

  };

  ItemData.prototype.ammo = 0;

  ItemData.prototype.iconAnim = 0;

  ItemData.prototype.type = 'Item';

  ItemData.prototype.isItem = true;

  return ItemData;

}).call(this);

Engine.objectData['UnitData'] = UnitData = (function() {
  class UnitData extends ObjData {
    init() {
      var anim, form, frame, i, j, key, len, ref, ref1, ref2, ref3;
      ref = this.frames;
      for (i in ref) {
        frame = ref[i];
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
      ref1 = this.forms;
      for (j = 0, len = ref1.length; j < len; j++) {
        form = ref1[j];
        form.__proto__ = Engine.objectData[(ref2 = form.class) != null ? ref2 : 'Dynamic'].prototype;
        form.init();
      }
      this.animsData = [];
      ref3 = this.anims;
      for (key in ref3) {
        anim = ref3[key];
        this.animsData[key] = animation.anims[anim];
      }
      return null;
    }

  };

  UnitData.prototype.inAirStatus = 13;

  UnitData.prototype.startFrame = 0;

  UnitData.prototype.startStatus = 0;

  UnitData.prototype.deathStatus = 0;

  UnitData.prototype.jumpX = 0;

  UnitData.prototype.jumpY = 0;

  UnitData.prototype.type = 'UnitObj';

  return UnitData;

}).call(this);

Engine.objectData['Bullet'] = Bullet = (function() {
  class Bullet extends Static {};

  Bullet.prototype.damage = 0;

  Bullet.prototype.range = -1;

  Bullet.prototype.coll_mask = 0;

  Bullet.prototype.velX = 0;

  Bullet.prototype.velY = 0;

  Bullet.prototype.forceX = 0;

  Bullet.prototype.forceT = 0;

  Bullet.prototype.type = 'BulletObj';

  return Bullet;

}).call(this);
