(function() {
  var BulletObj, Decoration, DynamicObj, ItemObj, ModelObj, ShovelElf, SkinObj, StaticObj, UnitObj,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Engine.objectTypes['Decoration'] = Decoration = (function() {
    function Decoration() {}

    Decoration.prototype.init = function(data, drop) {
      this.data = data;
      if (data.animData != null) {
        this.anim = new Animation(data.animData);
        return this.anim.setAnimation(data.anim);
      }
    };

    Decoration.prototype.draw = function(g) {
      var _ref;
      return (_ref = this.anim) != null ? _ref.play(g, this.x, this.y) : void 0;
    };

    Decoration.prototype.act = function() {
      if (typeof anim !== "undefined" && anim !== null) {
        anim.incAnim(false);
      }
      return false;
    };

    Decoration.prototype.getCenterX = function() {
      return this.data.cenX;
    };

    Decoration.prototype.getCenterY = function() {
      return this.data.cenY;
    };

    Decoration.prototype.setPos = function(x, y) {
      this.x = x;
      this.y = y;
    };

    Decoration.prototype.pool = function() {};

    return Decoration;

  })();

  Engine.objectTypes['ModelObj'] = ModelObj = (function(_super) {
    __extends(ModelObj, _super);

    function ModelObj() {
      return ModelObj.__super__.constructor.apply(this, arguments);
    }

    ModelObj.prototype.init = function(data, drop) {
      this.data = data;
      if (data.model != null) {
        return this.anim = new Model(data.model);
      }
    };

    ModelObj.prototype.draw = function(g) {
      return this.anim.play(g, this.x, this.y, this.data.zoom);
    };

    return ModelObj;

  })(Decoration);

  Engine.objectTypes['StaticObj'] = StaticObj = (function(_super) {
    __extends(StaticObj, _super);

    function StaticObj() {
      return StaticObj.__super__.constructor.apply(this, arguments);
    }

    StaticObj.prototype.hp = 0;

    StaticObj.prototype.vx = 0;

    StaticObj.prototype.vy = 0;

    StaticObj.prototype.cenX = 0;

    StaticObj.prototype.cenY = 0;

    StaticObj.prototype.flipX = false;

    StaticObj.prototype.flipY = false;

    StaticObj.prototype.init = function(data, drop) {
      StaticObj.__super__.init.call(this, data, drop);
      this.drop = drop;
      this.setFlipX((data.flip & Static.FLIP_X_MASK) !== 0);
      this.setFlipY((data.flip & Static.FLIP_Y_MASK) !== 0);
      this.hp = data.hp;
      return this.vx = this.vy = 0;
    };

    StaticObj.prototype.setFlipX = function(flipX) {
      this.cenX = this.flipX ? this.data.width - this.data.cenX : this.data.cenX;
      return this.flipX = flipX;
    };

    StaticObj.prototype.setFlipY = function(flipY) {
      this.cenY = this.flipY ? this.data.height - this.data.cenY : this.data.cenY;
      return this.flipY = flipY;
    };

    StaticObj.prototype.isFlipX = function() {
      return this.flipX;
    };

    StaticObj.prototype.isFlipY = function() {
      return this.flipY;
    };

    StaticObj.prototype.isAlive = function() {
      return this.hp !== 0;
    };

    StaticObj.prototype.getX = function() {
      return this.x - this.cenX;
    };

    StaticObj.prototype.getY = function() {
      return this.x - this.cenY;
    };

    StaticObj.prototype.getHP = function() {
      return this.hp;
    };

    StaticObj.prototype.getMaxHP = function() {
      return this.data.hp;
    };

    StaticObj.prototype.addHP = function(dmg) {
      if (this.hp >= 0) {
        this.hp += this.dmg;
        this.max = this.data.hp;
        if (this.hp > this.max) {
          return this.hd = this.max;
        } else if (this.hp <= 0) {
          this.setDeathAnim();
          return this.hp = 0;
        }
      }
    };

    StaticObj.prototype.contain = function(x, y) {
      var tx, ty;
      tx = this.x - this.cenY;
      ty = this.y - this.cenY;
      return x >= tx && x <= tx + this.data.width && y >= ty && y <= ty + this.data.height;
    };

    StaticObj.prototype.containWH = function(tx, ty, w, h) {
      var rx, ry;
      rx = this.x - this.cenY;
      ry = this.y - this.cenY;
      return rx + this.data.width > tx && ry + this.data.height > ty && tx + w > rx && ty + h > ry;
    };

    StaticObj.prototype.setDeathAnim = function() {
      return this.anim.setAnimation(this.data.deathAnim);
    };

    StaticObj.prototype.getColision = function() {
      if (this.hp === 0) {
        return 0;
      } else {
        return this.data.colision;
      }
    };

    StaticObj.prototype.addForce = function() {};

    StaticObj.prototype.setForce = function(vx, vy) {
      this.vx = vx;
      this.vy = vy;
    };

    StaticObj.prototype.getVX = function() {
      return this.vx;
    };

    StaticObj.prototype.getVY = function() {
      return this.vy;
    };

    StaticObj.prototype.getImpulseX = function() {
      return this.vx;
    };

    StaticObj.prototype.getCenterX = function() {
      return this.cenX;
    };

    StaticObj.prototype.getCenterY = function() {
      return this.cenY;
    };

    StaticObj.prototype.act = function() {
      if (this.anim != null) {
        return this.anim.incAnim(this.hp !== 0);
      } else {
        return false;
      }
    };

    StaticObj.prototype.pool = function() {
      var _ref;
      if (this.hp === 0) {
        return (_ref = this.drop) != null ? _ref.createObj(Game.getGame().curLayer, this.x, this.y) : void 0;
      }
    };

    return StaticObj;

  })(Decoration);

  Engine.objectTypes['DynamicObj'] = DynamicObj = (function(_super) {
    __extends(DynamicObj, _super);

    function DynamicObj() {
      return DynamicObj.__super__.constructor.apply(this, arguments);
    }

    DynamicObj.prototype.onGround = false;

    DynamicObj.prototype.friction = 1;

    DynamicObj.prototype.impulseX = 0;

    DynamicObj.prototype.act = function(layer) {
      var del, engine, max, obj, old_x, old_y;
      del = DynamicObj.__super__.act.call(this, layer);
      engine = Game.getGame().engine;
      if (this.onGround) {
        this.vx *= this.friction;
      }
      this.modifyForce();
      if (!this.onGround) {
        this.vx *= engine.envirFrictionX;
        this.vy *= engine.envirFrictionY;
      }
      this.vy += engine.gravity * this.data.mass;
      if (this.vx > max) {
        this.vx = max;
      } else if (this.vx < -max) {
        this.vx = -max;
      }
      max = this.data.max_speedY;
      if (this.vy > max) {
        this.vy = max;
      } else if (this.vy < -max) {
        this.vy = -max;
      }
      old_x = this.x;
      old_y = this.y;
      this.x += this.vx;
      if (engine.flipGravity) {
        this.setFlipY(true);
        this.y -= this.vy;
      } else {
        this.setFlipY(false);
        this.y += this.vy;
      }
      obj = layer.objs;
      DynamicObj.hCollObj = DynamicObj.vCollObj = null;
      this.onGround = false;
      while (obj != null) {
        if (obj !== this) {
          this.dealsDamage(obj);
          if ((obj.getColision() & this.data.coll_mask) !== 0) {
            if (this.vy !== 0 && this.collisionDetect(old_x, old_y, old_x, this.y, obj, true)) {
              DynamicObj.vCollObj = obj;
            } else {

            }
            if (this.vx !== 0 && this.collisionDetect(old_x, old_y, this.x, old_y, obj, false)) {
              DynamicObj.hCollObj = obj;
            }
          }
        }
        obj = obj.next;
      }
      if (DynamicObj.hCollObj != null) {
        this.collisonProcessing(DynamicObj.hCollObj, true);
      }
      if (DynamicObj.vCollObj != null) {
        this.collisonProcessing(DynamicObj.vCollObj, false);
      }
      return del;
    };

    DynamicObj.prototype.dealsDamage = function() {};

    DynamicObj.prototype.modifyForce = function() {};

    DynamicObj.prototype.getImpulseX = function() {
      return this.impulseX;
    };

    DynamicObj.prototype.addForce = function(x, y) {
      this.vx += x;
      return this.vy += y;
    };

    DynamicObj.prototype.collisonProcessing = function(collObj, collX) {
      var damage, x, y;
      x = this.vx * this.data.damageX_reduct;
      y = this.vy * this.data.damageY_reduct;
      damage = Math.sqrt(x * x + y * y) - this.data.min_damage;
      if (damage > 0) {
        damage *= this.data.mass;
        collObj.addHP(-damage);
        this.addHP(-damage);
      }
      collObj.addForce(collX ? this.vx : 0, collX ? 0 : this.vy > 0 ? this.vy : this.vy / this.data.mass);
      if (collX) {
        return this.impulseX = this.vx = 0;
      } else {
        this.vx += collObj.getImpulseX();
        this.impulseX = this.vx;
        this.friction = collObj.data.friction + this.data.friction;
        this.friction /= this.data.mass * 2;
        return this.vy = 0;
      }
    };

    DynamicObj.prototype.collisionDetect = function(old_x, old_y, x, y, obj, vert) {
      var rh, rw, rx, ry, t, th, tw, tx, ty;
      rx = old_x - this.cenX;
      ry = old_y - this.cenY;
      rw = rx + this.dat.width;
      rh = ry + this.data.height;
      t = old_x - x;
      if (t >= 0) {
        rx -= t;
      } else {
        rw -= t;
      }
      t = old_y - y;
      if (t < 0) {
        rh -= t;
      } else {
        ry -= t;
      }
      tx = obj.x - obj.cenX;
      ty = obj.y - obj.cenY;
      tw = tx + obj.data.width;
      th = ty + obj.data.height;
      if (rw > tx && rh > ty && tw > rx && th > ry) {
        if (vert) {
          if (Game.getGame().engine.flipGravity) {
            if (rh < th) {
              if (this.vy <= 0) {
                this.y = ty - this.data.height + this.cenY;
              }
            } else {
              if (this.vy >= 0) {
                this.y = th + this.cenY;
                this.onGround = true;
              }
            }
          } else {

          }
          if (ry < ty) {
            if (this.vy >= 0) {
              this.y = ty - this.data.height + this.cenY;
              this.onGround = true;
            }
          } else {
            if (this.vy <= 0) {
              this.y = th + this.cenY;
            }
          }
        } else {
          if (rx < tx) {
            if (this.vx >= 0) {
              this.x = tx - this.data.width + this.cenX;
            }
          } else {
            if (this.vx <= 0) {
              this.x = tw + this.cenX;
            }
          }
        }
        return true;
      }
      return false;
    };

    return DynamicObj;

  })(StaticObj);

  Engine.objectTypes['BulletObj'] = BulletObj = (function(_super) {
    __extends(BulletObj, _super);

    function BulletObj() {
      return BulletObj.__super__.constructor.apply(this, arguments);
    }

    BulletObj.prototype.init = function(data, drop) {
      BulletObj.__super__.init.call(this, data, drop);
      return this.range = data.range;
    };

    BulletObj.prototype.act = function(layer) {
      var del, h, obj, w, xt, yt;
      del = BulletObj.__super__.act.call(this, layer);
      if (range === 0) {
        return true;
      }
      if (range > 0) {
        range--;
      }
      this.x += this.flipX ? -this.data.velX : this.data.velX;
      this.y += this.flipY ? -this.data.velY : this.data.velY;
      obj = layer.objs;
      xt = this.x - this.cenX;
      yt = this.y - this.cenY;
      w = this.data.width;
      h = this.data.height;
      while (obj != null) {
        if (obj !== this) {
          if ((obj.getColision() & this.data.coll_mask) !== 0 && obj.containWH(xt, yt, w, h)) {
            obj.addForce(this.flipX ? -this.data.forceX : this.data.forceX, this.flipY ? -this.data.forceY : this.data.forceY);
            obj.addHP(this.dara.damage);
            return true;
          }
        }
        obj = obj.next;
      }
      return del;
    };

    BulletObj.addObj = function(owner, layer) {
      var obj;
      obj = Engine.objects[data.typeObj];
      if (obj != null) {
        obj.init(data, null);
        obj.setFlipY(this.flipY);
        obj.setPos(owner.x + (owner.isFlipX() ? -x : x), owner.y + (owner.isFlipY() ? -y : y));
        if (owner.isFlipX()) {
          obj.setFlipX(!obj.isFlipX());
        }
        if (owner.isFlipY()) {
          obj.setFlipY(!obj.isFlipY());
        }
        layer.add(obj);
      }
      return obj;
    };

    return BulletObj;

  })(StaticObj);

  Engine.objectTypes['UnitObj'] = UnitObj = (function(_super) {
    __extends(UnitObj, _super);

    function UnitObj() {
      return UnitObj.__super__.constructor.apply(this, arguments);
    }

    UnitObj.prototype.jump = false;

    UnitObj.prototype.count = 0;

    UnitObj.prototype.init = function(data, drop) {
      var anim;
      this.status = data.startStatus;
      this.mData = data;
      this.frame = data.frames[data.startFrame];
      UnitObj.__super__.init.call(this, data.forms[this.frame.form], drop);
      anim = new Animation();
      return this.setFrame(this.mData.startFrame);
    };

    UnitObj.prototype.setData = function(mData) {
      this.mData = mData;
      if (this.owner != null) {
        this.status = this.owner.getStatus();
      } else {
        this.status = 0;
      }
      return this.setStatusImm(status);
    };

    UnitObj.prototype.setStatus = function(status) {
      if (!this.onGround) {
        status += this.mData.inAirStatus;
      }
      if (this.status !== status) {
        this.setFrame(this.mData.frameStatus[status]);
        return this.status = status;
      }
    };

    UnitObj.prototype.setStatusImm = function(status) {
      if (!this.onGround) {
        status += this.mData.inAirStatus;
      }
      this.setFrame(this.mData, frameStatus[status]);
      return this.status = status;
    };

    UnitObj.prototype.setFrame = function(frameNum) {
      var frame;
      frame = this.mData.frames[frameNum];
      if (frame !== this.curFrame) {
        this.curFrame = frame;
        this.data = this.mData.forms[frame.form];
        if (frame.ainms != null) {
          this.setAnim(frame.anims);
        }
      }
      return this.count = frame.count;
    };

    UnitObj.prototype.setAnim = function(anims) {
      var a, anim, i, len, _results;
      anim = this.anim;
      len = this.anims.length - 1;
      i = 0;
      _results = [];
      while (i <= len) {
        int(a = anims[i]);
        anim.setAnimAndSet(mData.animsData[(a >> 8) & 0xFF], a & 0xFF);
        if (i !== len) {
          if (anim.next == null) {
            anim.next = new Animation();
          }
          anim = anim.next;
        } else {
          if (anim.next != null) {
            anim.next = null;
          }
        }
        _results.push(i++);
      }
      return _results;
    };

    UnitObj.prototype.setDeathAnim = function() {
      if (this.owner != null) {
        this.owner.setStdSet();
      }
      return this.setStatus(this.mData.deathStatus);
    };

    UnitObj.prototype.modifyForce = function() {
      var forceX, forceY;
      if (this.jump && this.onGround && this.hp !== 0) {
        this.addForce(this.flipX ? -this.mData.jumpX : this.mData.jumpX, this.mData.jumpY);
      }
      forceX = this.mData.forceX[this.status];
      forceY = this.mData.forceY[this.status];
      return this.addForce(this.flipX ? -forceX : forceX, Game.getGame().engine.flipGravity ? -forceY : forceY);
    };

    UnitObj.prototype.act = function(layer) {
      var bullet, stat, _i, _len, _ref, _ref1, _ref2;
      UnitObj.__super__.act.call(this, layer);
      if (this.curFrame.bullets != null) {
        _ref = this.curFrame.bullets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          bullet = _ref[_i];
          BulletObj.addObj.call(bullet(this, layer));
        }
        if ((_ref1 = this.owner) != null) {
          if ((_ref2 = _ref1.item) != null) {
            _ref2.rangeFire(this.curFrame.bullets.length);
          }
        }
      }
      if (this.count > 0) {
        this.count--;
      } else {
        this.setFrame(this.curFrame.next);
      }
      if (this.hp === 0) {
        this.setStatus(this.mData.deathStatus);
        return this.curFrame === this.mData.frames[this.curFrame.next];
      }
      stat = this.status % this.mData.inAirStatus;
      this.setStatus(stat);
      return false;
    };

    UnitObj.prototype.dealsDamage = function(obj) {
      var h, region, w, x1, y1, _i, _len, _ref, _ref1, _ref2;
      if (this.curFrame.dmgRegs != null) {
        _ref = this.curFrame.dmgRegs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          region = _ref[_i];
          if ((obj.getColision() & this.region.mask) !== 0) {
            w = region.w;
            h = region.h;
            x1 = this.flipX ? this.x(-region.x - w) : this.x + region.x;
            y1 = this.flipY ? this.y(-region.y - h) : this.y + region.y;
            if (obj.contain(x1, y1, w, h)) {
              obj.addForce(this.flipX ? -region.forceX : region.forceX, this.flipY ? -region.forceY : region.forceY);
              obj.addHP(region.damage);
            }
          }
        }
        return (_ref1 = this.owner) != null ? (_ref2 = _ref1.item) != null ? _ref2.meleeFire(this.curFrame.dmgRegs.length) : void 0 : void 0;
      }
    };

    return UnitObj;

  })(DynamicObj);

  Engine.objectTypes['items.Item'] = ItemObj = (function(_super) {
    __extends(ItemObj, _super);

    function ItemObj() {
      return ItemObj.__super__.constructor.apply(this, arguments);
    }

    ItemObj.prototype.ammo = 0;

    ItemObj.prototype.init = function(data, drop) {
      ItemObj.__super__.init.call(this, data, drop);
      return this.ammo = this.data.ammo;
    };

    ItemObj.prototype.playerGet = function(player) {
      var uData;
      if ((player.item != null) && player.item.data === this.data) {
        player.item.addAmmo(this.ammo);
        this.pool();
        return true;
      } else {
        uData = this.player.getSet(this.data.setName);
        if (uData != null) {
          this.player = player;
          player.dropItem();
          player.item = this;
          player.setSet(uData);
          return true;
        }
      }
      return false;
    };

    ItemObj.prototype.getAmmo = function() {
      return ammo;
    };

    ItemObj.prototype.decAmmp = function(ammo) {
      if (this.ammo >= 0) {
        this.ammo -= ammo;
        if (this.ammo <= 0) {
          this.ammo = 0;
          return this.player.removeItem();
        }
      }
    };

    ItemObj.prototype.addAmmo = function(ammo) {
      if (this.ammo >= 0) {
        return this.ammo += ammo;
      }
    };

    ItemObj.prototype.rangeFire = function(amount) {
      if (amount > 0) {
        return this.decAmmo(1);
      }
    };

    ItemObj.prototype.meleeFire = function(amount) {
      if (amount > 1) {
        return this.decAmmo(1);
      }
    };

    ItemObj.prototype.getSetName = function() {
      return data.setName;
    };

    return ItemObj;

  })(DynamicObj);

  Engine.objectTypes['items.Skin'] = SkinObj = (function(_super) {
    __extends(SkinObj, _super);

    function SkinObj() {
      return SkinObj.__super__.constructor.apply(this, arguments);
    }

    SkinObj.prototype.playerGet = function(player) {
      var sets;
      sets = player.unit.mData;
      sets.animsData[ammo].remove();
      sets.animsData[ammo] = this.data.animData;
      this.data.animData.loadIndx++;
      player.setSet(sets);
      return false;
    };

    return SkinObj;

  })(ItemObj);

  Engine.objectTypes['AI.ShovelElf'] = Engine.objectTypes['AI.ShovelElf'] = ShovelElf = (function(_super) {
    __extends(ShovelElf, _super);

    function ShovelElf() {
      return ShovelElf.__super__.constructor.apply(this, arguments);
    }

    ShovelElf.prototype.act = function(layer) {
      var attack, del, flip, h, player, players, unit, w, xt, yt, _i, _len;
      del = ShovelElf.__super__.act.call(this, layer);
      if (hp !== 0) {
        flip = isFlipX();
        players = Game.getGame().engine.players;
        xt = this.getX() - 40;
        w = this.data.width + 80;
        yt = this.getY();
        h = this.data.height;
        attack = false;
        for (_i = 0, _len = players.length; _i < _len; _i++) {
          player = players[_i];
          if (player.active && !player.enemy) {
            unit = player.unit;
            if (unit.isAlive()) {
              attack |= unit.contain(xt, yt, w, h);
              if (attack) {
                flip = this.x > unit.x;
              }
            }
          }
        }
        if (attack) {
          this.setStatus(Player.STATUS_FIRE);
          this.setFlipX(flip);
        } else {
          this.setStatus(Player.STATUS_RUN);
          if (typeof hCollObj !== "undefined" && hCollObj !== null) {
            this.setFlipX(!flip);
          }
        }
      }
      return del;
    };

    return ShovelElf;

  })(UnitObj);

}).call(this);
