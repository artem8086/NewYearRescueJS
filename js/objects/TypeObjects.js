var BulletObj, Decoration, DynamicObj, ItemObj, ModelObj, ShovelElf, SkinObj, StaticObj, UnitObj;

Engine.objectTypes['Decoration'] = Decoration = class Decoration {
  init(data, drop) {
    this.data = data;
    if (data.animData != null) {
      this.anim = new Animation(data.animData);
      return this.anim.setAnimation(data.anim);
    }
  }

  draw(g) {
    var ref;
    return (ref = this.anim) != null ? ref.play(g, this.x, this.y) : void 0;
  }

  act() {
    if (typeof anim !== "undefined" && anim !== null) {
      anim.incAnim(false);
    }
    return false;
  }

  getCenterX() {
    return this.data.cenX;
  }

  getCenterY() {
    return this.data.cenY;
  }

  setPos(x2, y2) {
    this.x = x2;
    this.y = y2;
  }

  pool() {}

};

Engine.objectTypes['ModelObj'] = ModelObj = class ModelObj extends Decoration {
  init(data, drop) {
    this.data = data;
    if (data.model != null) {
      return this.anim = new Model(data.model);
    }
  }

  draw(g) {
    return this.anim.play(g, this.x, this.y, this.data.zoom);
  }

};

Engine.objectTypes['StaticObj'] = StaticObj = (function() {
  class StaticObj extends Decoration {
    init(data, drop) {
      super.init(data, drop);
      this.drop = drop;
      this.setFlipX((data.flip & Static.FLIP_X_MASK) !== 0);
      this.setFlipY((data.flip & Static.FLIP_Y_MASK) !== 0);
      this.hp = data.hp;
      return this.vx = this.vy = 0;
    }

    setFlipX(flipX) {
      this.cenX = this.flipX ? this.data.width - this.data.cenX : this.data.cenX;
      return this.flipX = flipX;
    }

    setFlipY(flipY) {
      this.cenY = this.flipY ? this.data.height - this.data.cenY : this.data.cenY;
      return this.flipY = flipY;
    }

    isFlipX() {
      return this.flipX;
    }

    isFlipY() {
      return this.flipY;
    }

    isAlive() {
      return this.hp !== 0;
    }

    getX() {
      return this.x - this.cenX;
    }

    getY() {
      return this.x - this.cenY;
    }

    getHP() {
      return this.hp;
    }

    getMaxHP() {
      return this.data.hp;
    }

    addHP(dmg) {
      var max;
      if (this.hp >= 0) {
        this.hp += dmg;
        max = this.data.hp;
        if (this.hp > max) {
          return this.hp = max;
        } else if (this.hp <= 0) {
          this.setDeathAnim();
          return this.hp = 0;
        }
      }
    }

    contain(x, y) {
      var tx, ty;
      tx = this.x - this.cenY;
      ty = this.y - this.cenY;
      return x >= tx && x <= tx + this.data.width && y >= ty && y <= ty + this.data.height;
    }

    containWH(tx, ty, w, h) {
      var rx, ry;
      rx = this.x - this.cenY;
      ry = this.y - this.cenY;
      return rx + this.data.width > tx && ry + this.data.height > ty && tx + w > rx && ty + h > ry;
    }

    setDeathAnim() {
      return this.anim.setAnimation(this.data.deathAnim);
    }

    getColision() {
      if (this.hp === 0) {
        return 0;
      } else {
        return this.data.collision;
      }
    }

    addForce() {}

    setForce(vx, vy) {
      this.vx = vx;
      this.vy = vy;
    }

    getVX() {
      return this.vx;
    }

    getVY() {
      return this.vy;
    }

    getImpulseX() {
      return this.vx;
    }

    getCenterX() {
      return this.cenX;
    }

    getCenterY() {
      return this.cenY;
    }

    act() {
      if (this.anim != null) {
        return this.anim.incAnim(this.hp !== 0);
      } else {
        return false;
      }
    }

    pool() {
      var ref;
      if (this.hp === 0) {
        return (ref = this.drop) != null ? ref.createObj(Game.getGame().curLayer, this.x, this.y) : void 0;
      }
    }

  };

  StaticObj.prototype.hp = 0;

  StaticObj.prototype.vx = 0;

  StaticObj.prototype.vy = 0;

  StaticObj.prototype.cenX = 0;

  StaticObj.prototype.cenY = 0;

  StaticObj.prototype.flipX = false;

  StaticObj.prototype.flipY = false;

  return StaticObj;

}).call(this);

Engine.objectTypes['DynamicObj'] = DynamicObj = (function() {
  class DynamicObj extends StaticObj {
    act(layer) {
      var del, engine, max, obj, old_x, old_y;
      del = super.act(layer);
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
      max = this.data.max_speedX;
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
      // Обнаружение коллизий
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
      // Обработка столкновения
      if (DynamicObj.hCollObj != null) {
        this.collisonProcessing(DynamicObj.hCollObj, true);
      }
      if (DynamicObj.vCollObj != null) {
        this.collisonProcessing(DynamicObj.vCollObj, false);
      }
      return del;
    }

    dealsDamage() {}

    modifyForce() {}

    getImpulseX() {
      return this.impulseX;
    }

    addForce(x, y) {
      this.vx += x;
      return this.vy += y;
    }

    draw(g) {
      var ref;
      return (ref = this.anim) != null ? ref.play(g, this.x, this.y, this.flipX, this.flipY) : void 0;
    }

    collisonProcessing(collObj, collX) {
      var damage, x, y;
      // Просчёт урона
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
    }

    collisionDetect(old_x, old_y, x, y, obj, vert) {
      var rh, rw, rx, ry, t, th, tw, tx, ty;
      rx = old_x - this.cenX;
      ry = old_y - this.cenY;
      rw = rx + this.data.width;
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
    }

  };

  DynamicObj.prototype.onGround = false;

  DynamicObj.prototype.friction = 1;

  DynamicObj.prototype.impulseX = 0;

  return DynamicObj;

}).call(this);

Engine.objectTypes['BulletObj'] = BulletObj = class BulletObj extends StaticObj {
  init(data, drop) {
    super.init(data, drop);
    return this.range = data.range;
  }

  act(layer) {
    var del, h, obj, w, xt, yt;
    del = super.act(layer);
    if (this.range === 0) {
      return true;
    }
    if (this.range > 0) {
      this.range--;
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
          obj.addHP(this.data.damage);
          return true;
        }
      }
      obj = obj.next;
    }
    return del;
  }

  static addObj(owner, layer) {
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
  }

};

Engine.objectTypes['UnitObj'] = UnitObj = (function() {
  class UnitObj extends DynamicObj {
    init(data, drop) {
      this.status = data.startStatus;
      this.mData = data;
      this.frame = data.frames[data.startFrame];
      super.init(data.forms[this.frame.form], drop);
      this.anim = new Animation();
      return this.setFrame(this.mData.startFrame);
    }

    setData(mData) {
      this.mData = mData;
      if (this.owner != null) {
        this.status = this.owner.getStatus();
      } else {
        this.status = 0;
      }
      return this.setStatusImm(status);
    }

    setStatus(status) {
      if (!this.onGround) {
        status += this.mData.inAirStatus;
      }
      if (this.status !== status) {
        this.setFrame(this.mData.frameStatus[status]);
        return this.status = status;
      }
    }

    setStatusImm(status) {
      if (!this.onGround) {
        status += this.mData.inAirStatus;
      }
      this.setFrame(this.mData, frameStatus[status]);
      return this.status = status;
    }

    setFrame(frameNum) {
      var frame;
      frame = this.mData.frames[frameNum];
      if ((this.curFrame == null) || frame !== this.curFrame) {
        this.curFrame = frame;
        this.data = this.mData.forms[frame.form];
        if (frame.anims != null) {
          this.setAnim(frame.anims);
        }
      }
      return this.count = frame.count;
    }

    setAnim(anims) {
      var a, anim, i, len, results;
      anim = this.anim;
      len = anims.length - 1;
      i = 0;
      results = [];
      while (i <= len) {
        a = anims[i];
        anim.setAnimAndSet(this.mData.animsData[a >> 8], a & 0xFF);
        if (i !== len) {
          if (anim.next == null) {
            anim.next = new Animation();
          }
          anim = anim.next;
        } else {
          anim.next = null;
          break;
        }
        results.push(i++);
      }
      return results;
    }

    setDeathAnim() {
      if (this.owner != null) {
        this.owner.setStdSet();
      }
      return this.setStatus(this.mData.deathStatus);
    }

    modifyForce() {
      var forceX, forceY;
      if (this.jump && this.onGround && this.hp !== 0) {
        this.addForce(this.flipX ? -this.mData.jumpX : this.mData.jumpX, this.mData.jumpY);
      }
      forceX = this.mData.forceX[this.status];
      forceY = this.mData.forceY[this.status];
      return this.addForce(this.flipX ? -forceX : forceX, Game.getGame().engine.flipGravity ? -forceY : forceY);
    }

    act(layer) {
      var bullet, j, len1, ref, ref1, ref2;
      super.act(layer);
      
      if (this.curFrame.bullets != null) {
        ref = this.curFrame.bullets;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          bullet = ref[j];
          BulletObj.addObj.call(bullet(this, layer));
        }
        if ((ref1 = this.owner) != null) {
          if ((ref2 = ref1.item) != null) {
            ref2.rangeFire(this.curFrame.bullets.length);
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
      this.setStatus(this.status % this.mData.inAirStatus);
      return false;
    }

    dealsDamage(obj) {
      var h, j, len1, ref, ref1, ref2, region, w, x1, y1;
      if (this.curFrame.dmgRegs != null) {
        ref = this.curFrame.dmgRegs;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          region = ref[j];
          if ((obj.getColision() & region.mask) !== 0) {
            w = region.w;
            h = region.h;
            x1 = this.flipX ? this.x - region.x - w : this.x + region.x;
            y1 = this.flipY ? this.y - region.y - h : this.y + region.y;
            if (obj.contain(x1, y1, w, h)) {
              obj.addForce(this.flipX ? -region.forceX : region.forceX, this.flipY ? -region.forceY : region.forceY);
              obj.addHP(region.damage);
            }
          }
        }
        return (ref1 = this.owner) != null ? (ref2 = ref1.item) != null ? ref2.meleeFire(this.curFrame.dmgRegs.length) : void 0 : void 0;
      }
    }

    setJump(jump) {
      this.jump = jump;
    }

  };

  UnitObj.prototype.jump = false;

  UnitObj.prototype.count = 0;

  return UnitObj;

}).call(this);

Engine.objectTypes['items.Item'] = ItemObj = (function() {
  class ItemObj extends DynamicObj {
    init(data, drop) {
      super.init(data, drop);
      return this.ammo = this.data.ammo;
    }

    playerGet(player) {
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
    }

    getAmmo() {
      return ammo;
    }

    decAmmp(ammo) {
      if (this.ammo >= 0) {
        this.ammo -= ammo;
        if (this.ammo <= 0) {
          this.ammo = 0;
          return this.player.removeItem();
        }
      }
    }

    addAmmo(ammo) {
      if (this.ammo >= 0) {
        return this.ammo += ammo;
      }
    }

    rangeFire(amount) {
      if (amount > 0) {
        return this.decAmmo(1);
      }
    }

    meleeFire(amount) {
      if (amount > 1) {
        return this.decAmmo(1);
      }
    }

    getSetName() {
      return data.setName;
    }

  };

  ItemObj.prototype.ammo = 0;

  return ItemObj;

}).call(this);

Engine.objectTypes['items.Skin'] = SkinObj = class SkinObj extends ItemObj {
  playerGet(player) {
    var sets;
    sets = player.unit.mData;
    sets.animsData[ammo].remove();
    sets.animsData[ammo] = this.data.animData;
    this.data.animData.loadIndx++;
    player.setSet(sets);
    return false;
  }

};

Engine.objectTypes['AI.ShovelElf'] = Engine.objectTypes['AI.ShovelElf'] = ShovelElf = class ShovelElf extends UnitObj {
  act(layer) {
    var attack, del, flip, h, j, len1, player, players, unit, w, xt, yt;
    del = super.act(layer);
    if (this.hp !== 0) {
      flip = this.isFlipX();
      players = Game.getGame().engine.players;
      xt = this.getX() - 40;
      w = this.data.width + 80;
      yt = this.getY();
      h = this.data.height;
      attack = false;
      for (j = 0, len1 = players.length; j < len1; j++) {
        player = players[j];
        if (player.active && !player.enemy) {
          unit = player.unit;
          if (unit.isAlive()) {
            attack |= unit.containWH(xt, yt, w, h);
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
        if (DynamicObj.hCollObj != null) {
          this.setFlipX(!flip);
        }
      }
    }
    return del;
  }

};
