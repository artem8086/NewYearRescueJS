(function() {
  var Animation, Model, animation;

  animation = {
    anims: [],
    models: []
  };

  Animation = (function() {
    function Animation(animSet) {
      this.animSet = animSet;
    }

    Animation.load = function() {
      var anim, img, name, _ref;
      _ref = animation.anims;
      for (name in _ref) {
        anim = _ref[name];
        img = document.createElement('img');
        img.src = 'images/' + name + '.png';
        anim.img = img;
      }
      return null;
    };

    Animation.prototype.setAnimation = function(num) {
      var anim;
      anim = this.animSet.sets[num];
      if (anim !== this.current) {
        this.current = anim;
        this.time = anim.frameTime;
        return this.nFrame = 0;
      }
    };

    Animation.prototype.reset = function() {
      this.time = this.current.frameTime;
      return this.nFrame = 0;
    };

    Animation.prototype.incAnim = function(cycle) {
      if (cycle == null) {
        cycle = true;
      }
      this.time--;
      if (this.time <= 0) {
        this.time = this.current.frameTime;
        this.nFrame++;
        if (this.nFrame >= this.current.frames.length) {
          this.nFrame = cycle ? 0 : this.current.frames.length - 1;
          return !cycle;
        }
      }
      return false;
    };

    Animation.prototype.play = function(g, x, y, flipX, flipY) {
      var frame;
      if (flipX == null) {
        flipX = false;
      }
      if (flipY == null) {
        flipY = false;
      }
      frame = this.current.frames[this.nFrame];
      if (frame != null) {
        x = flipX ? -x + frame.centerX - frame.width : x - frame.centerX;
        y = flipY ? -y - frame.centerY : y + frame.centerY - frame.height;
        g.save();
        g.scale((flipX ? -1 : 1), (flipY ? -1 : 1));
        g.drawImage(this.animSet.img, frame.x1, frame.y1, frame.x2, frame.y2, x, y, frame.width, frame.height);
        g.restore();
      }
      return this;
    };

    return Animation;

  })();

  Model = (function() {
    Model.x = [];

    Model.y = [];

    function Model(animSet) {
      var key, set, _ref, _ref1;
      this.animSet = animSet;
      if (animSet.anims != null) {
        this.sets = [];
        _ref = animSet.anims;
        for (key in _ref) {
          set = _ref[key];
          (this.sets[key] = new Animation(animation.anims[set.name])).setAnimation((_ref1 = set.anim) != null ? _ref1 : 0);
        }
      }
    }

    Model.prototype.incAnim = function(cycle) {
      var anim, ret, _i, _len, _ref;
      if (cycle == null) {
        cycle = true;
      }
      ret = false;
      if (this.sets != null) {
        _ref = this.sets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          anim = _ref[_i];
          ret |= anim.incAnim(cycle);
        }
      }
      return ret;
    };

    Model.prototype.play = function(g, x, y, zoom) {
      var i, indx, layer, n, poly, vert, verts, xL, yL, z, _i, _j, _len, _len1, _ref, _ref1;
      if (zoom == null) {
        zoom = 1;
      }
      layer = Game.getGame().engine.layer;
      xL = layer.x;
      yL = layer.y;
      x -= xL;
      y -= yL;
      z = .0;
      verts = this.animSet.verts;
      i = 0;
      for (_i = 0, _len = verts.length; _i < _len; _i++) {
        vert = verts[_i];
        z = vert.z * zoom;
        Model.x[i] = (vert.x + x) * z + xL;
        Model.y[i] = (vert.y + y) * z + yL;
        i++;
      }
      _ref = this.animSet.faces;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        poly = _ref[_j];
        if (poly.anim != null) {
          this.sets[poly.anim].play(g, Model.x[poly.vert], Model.y[poly.vert]);
        } else {
          g.fillStyle = (_ref1 = poly.col) != null ? _ref1 : '#000000';
          n = poly.verts.length;
          if (n > 2) {
            i = n - 1;
            g.beginPath();
            indx = poly.verts[i];
            g.moveTo(Model.x[indx], Model.y[indx]);
            i--;
            while (i >= 0) {
              indx = poly.verts[i];
              g.lineTo(Model.x[indx], Model.y[indx]);
              i--;
            }
            g.closePath();
            g.fill();
          } else {
            g.beginPath();
            indx = poly.verts[0];
            g.moveTo(Model.x[indx], Model.y[indx]);
            indx = poly.verts[1];
            g.lineTo(Model.x[indx], Model.y[indx]);
            g.closePath();
            g.stroke();
          }
        }
      }
      return null;
    };

    return Model;

  })();

}).call(this);
