var Player;

Player = (function() {
  class Player {
    init(layers, keys) {
      var i, ref, set;
      this.keys = keys;
      this.unitLayer = layers[this.layer];
      
      this.dataSets = [];
      ref = this.sets;
      for (i in ref) {
        set = ref[i];
        this.dataSets[i] = Engine.objects[set];
      }
      
      this.iconAnim = new Animation(animation.anims[this.icon]);
      
      this.canControl = this.control;
      this.curMask = 0;
      if (this.active) {
        return this.activatePlayer();
      }
    }

    activatePlayer() {
      /*
      hero.setAnimSet(iconAnim);
      hero.setPos(iconX, iconY);
      hero.setAnimNum(iconNum);
      hero.setPlayer(this);
      loader.level.add(hero);
      */
      var set;
      set = null;
      if (this.item != null) {
        set = this.dataSets[this.item.getSetName()];
      }
      if (set == null) {
        set = this.dataSets[0];
      }
      this.unit = set.createObj(this.unitLayer, this.unitX, this.unitY);
      this.unit.owner = this;
      return this.active = true;
    }

    setCanControl(control) {
      var ref;
      this.canControl = control;
      this.curMask = 0;
      return (ref = this.unit) != null ? ref.setStatus(Player.STATUS_STAND) : void 0;
    }

    setStdSet() {
      return this.unit.setStdSet(this.dataSets[0]);
    }

    getSet(name) {
      var j, len, ref, set;
      ref = this.dataSets;
      for (j = 0, len = ref.length; j < len; j++) {
        set = ref[j];
        if (name === set.setName) {
          return set;
        }
      }
    }

    setSet(name) {
      return this.unit.setData(this.getSet(name));
    }

    setSetIndx(indx) {
      return this.unit.setData(this.dataSets[indx]);
    }

    act() {
      if (this.unit.getHP() === 0) {
        this.canControl = false;
        if (!this.enemy && (this.unit.data == null)) {
          return Game.getGame().engine.restertAfterDead();
        }
      } else {
        if (this.item != null) {
          return this.item.act();
        }
      }
    }

    getStatus() {
      return this.mask2status(this.curMask);
    }

    mask2status(mask) {
      var status;
      status = Player.STATUS_STAND;
      if ((mask & Player.MASK_FIRE) !== 0) {
        status += Player.STATUS_FIRE;
      }
      if ((mask & Player.MASK_RUN) !== 0) {
        status += Player.STATUS_RUN;
      }
      if ((mask & Player.MASK_DOWN) !== 0) {
        status += Player.STATUS_DOWN;
      } else if ((mask & Player.MASK_UP) !== 0) {
        status += Player.STATUS_UP;
      }
      return status;
    }

    keyPressed(key) {
      var i, mask, newMask, ref;
      if (this.canControl) {
        newMask = this.curMask;
        ref = Player.MASK_KEYS;
        for (i in ref) {
          mask = ref[i];
          if (key === this.keys[i]) {
            newMask |= mask;
            break;
          }
        }
        if (newMask !== this.curMask) {
          if (key === this.keys.left) {
            this.unit.setFlipX(true);
          } else if (key === this.keys.right) {
            this.unit.setFlipX(false);
          }
          this.curMask = newMask;
          this.unit.setStatus(this.mask2status(newMask));
        }
        if (key === this.keys.jump) {
          this.unit.setJump(true);
        }
      }
      return null;
    }

    keyReleased(key) {
      var i, mask, newMask, ref;
      if (this.canControl) {
        newMask = this.curMask;
        ref = Player.MASK_KEYS;
        for (i in ref) {
          mask = ref[i];
          if (key === this.keys[i]) {
            newMask &= ~mask;
            break;
          }
        }
        if (newMask !== this.curMask) {
          this.curMask = newMask;
          this.unit.setStatus(this.mask2status(newMask));
        }
        if (key === this.keys.jump) {
          this.unit.setJump(false);
        }
        if (key === this.keys.take) {
          this.getItem();
        }
      }
      return null;
    }

    getItem() {
      var drop, h, nextObj, obj, pred, w, x, y;
      pred = null;
      nextObj = null;
      obj = this.unitLayer.objs;
      x = this.unit.getX();
      y = this.unit.getY();
      w = this.unit.data.width;
      h = this.unit.data.height;
      drop = true;
      while (obj != null) {
        nextObj = obj.next;
        if (obj !== this.unit && obj.data.isItem && obj.contain(x, y, w, h)) {
          
          drop = false;
          if (obj.playerGet(this)) {
            if (pred == null) {
              this.unitLayer.objs = nextObj;
            } else {
              pred.next = nextObj;
            }
            obj.next = null;
            break;
          }
        } else {
          pred = obj;
        }
        obj = nextObj;
      }
      if (drop) {
        return this.dropItem();
      }
    }

    removeItem() {
      if (this.item != null) {
        this.item.setPos(this.unit.x, this.unit.y);
        this.item.setFlipX(unit.isFlipX());
        this.unitLayer.add(this.item);
        this.setStdSet();
        return this.item = null;
      }
    }

    dropItem() {
      if (this.item != null) {
        this.item.setPos(this.unit.x, this.unit.y);
        this.item.setFlipX(this.unit.isFlipX());
        this.unitLayer.add(this.item);
        this.setStdSet();
        return this.item = null;
      }
    }

  };

  Player.STATUS_STAND = 0;

  Player.STATUS_UP = 1;

  Player.STATUS_DOWN = 2;

  Player.STATUS_FIRE = 3;

  Player.STATUS_RUN = 6;

  Player.MASK_UP = 1;

  Player.MASK_DOWN = 2;

  Player.MASK_RUN = 4;

  Player.MASK_FIRE = 8;

  Player.MASK_KEYS = {
    up: Player.MASK_UP,
    down: Player.MASK_DOWN,
    left: Player.MASK_RUN,
    right: Player.MASK_RUN,
    fire: Player.MASK_FIRE
  };

  Player.prototype.shiftHP = 1;

  Player.prototype.active = false;

  Player.prototype.canControl = false;

  return Player;

}).call(this);
