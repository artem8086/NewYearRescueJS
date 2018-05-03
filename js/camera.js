var Camera;

Camera = (function() {
  class Camera {
    init() {
      return this.statusLock = this.lock;
    }

    static contain(data, cenX, cenY, objX, objY, x1, y1, mask) {
      var x2, y2;
      if ((mask & Camera.MASK_UP) !== 0) {
        if (objY - cenY + data.height < y1) {
          return false;
        }
      }
      if ((mask & Camera.MASK_LEFT) !== 0) {
        if (objX - cenX + data.width < x1) {
          return false;
        }
      }
      if ((mask & Camera.MASK_DOWN) !== 0) {
        y2 = Game.height + y1;
        if (objY - cenY > y2) {
          return false;
        }
      }
      if ((mask & Camera.MASK_RIGHT) !== 0) {
        x2 = Game.width + x1;
        if (objX - cenX > x2) {
          return false;
        }
      }
      return true;
    }

    containXY(x, y) {
      return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
    }

    setCenter(x, y) {
      var camX, camY, engine, mask;
      engine = Game.getGame().engine;
      if (!this.statusLock) {
        if (this.next != null) {
          if (this.next.containXY(x, y)) {
            engine.setCamera(this.next);
          }
        } else {
          engine.nextLevel();
        }
      }
      
      if (x < this.x) {
        x = this.x;
      } else {

      }
      if (x > this.x + this.w) {
        x = this.x + this.w;
      }
      
      if (y < this.y) {
        y = this.y;
      } else {

      }
      if (y > this.y + this.h) {
        y = this.y + this.h;
      }
      
      mask = this.block_mask;
      if (mask !== 0) {
        camX = engine.camX;
        camY = engine.camY;
        if ((mask & Camera.MASK_UP) !== 0 && y < camY) {
          y = camY;
        }
        if ((mask & Camera.MASK_DOWN) !== 0 && y > camY) {
          y = camY;
        }
        if ((mask & Camera.MASK_LEFT) !== 0 && x < camX) {
          x = camX;
        }
        if ((mask & Camera.MASK_RIGHT) !== 0 && x > camX) {
          x = camX;
        }
      }
      engine.camX = x;
      return engine.camY = y;
    }

  };

  Camera.MASK_UP = 1;

  Camera.MASK_DOWN = 2;

  Camera.MASK_LEFT = 4;

  Camera.MASK_RIGHT = 8;

  Camera.prototype.background = '\#000000';

  Camera.prototype.gravity = 0.98;

  Camera.prototype.flipGravity = false;

  Camera.prototype.envirFrictionX = 0.95;

  Camera.prototype.envirFrictionY = 0.999;

  Camera.prototype.moveX_border = 0.16;

  Camera.prototype.moveY_border = 0.16;

  Camera.prototype.block_mask = 0;

  Camera.prototype.lock = false;

  return Camera;

}).call(this);
