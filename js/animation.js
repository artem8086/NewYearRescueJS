var Animation, Model, animation;

animation = {
  anims: [],
  models: []
};

Animation = class Animation {
  constructor(animSet1) {
    this.animSet = animSet1;
  }

  static load() {
    var anim, img, name, ref;
    ref = animation.anims;
    for (name in ref) {
      anim = ref[name];
      img = document.createElement('img');
      img.src = 'images/' + name + '.png';
      anim.img = img;
    }
    return null;
  }

  setAnimation(num) {
    var anim;
    anim = this.animSet.sets[num];
    if (anim !== this.current) {
      this.current = anim;
      this.time = anim.frameTime;
      return this.nFrame = 0;
    }
  }

  reset() {
    this.time = this.current.frameTime;
    return this.nFrame = 0;
  }

  incAnim(cycle = true) {
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
  }

  play(g, x, y, flipX = false, flipY = false) {
    var frame;
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
  }

};

Model = (function() {
  class Model {
    constructor(animSet) {
      var key, ref, ref1, set;
      this.animSet = animSet;
      if (animSet.anims != null) {
        this.sets = [];
        ref = animSet.anims;
        for (key in ref) {
          set = ref[key];
          (this.sets[key] = new Animation(animation.anims[set.name])).setAnimation((ref1 = set.anim) != null ? ref1 : 0);
        }
      }
    }

    incAnim(cycle = true) {
      var anim, j, len, ref, ret;
      ret = false;
      if (this.sets != null) {
        ref = this.sets;
        for (j = 0, len = ref.length; j < len; j++) {
          anim = ref[j];
          ret |= anim.incAnim(cycle);
        }
      }
      return ret;
    }

    play(g, x, y, zoom = 1) {
      var i, indx, j, k, layer, len, len1, n, poly, ref, ref1, vert, verts, xL, yL, z;
      layer = Game.getGame().engine.layer;
      xL = layer.x;
      yL = layer.y;
      x -= xL;
      y -= yL;
      z = .0;
      verts = this.animSet.verts;
      i = 0;
      for (j = 0, len = verts.length; j < len; j++) {
        vert = verts[j];
        z = vert.z * zoom;
        Model.x[i] = (vert.x + x) * z + xL;
        Model.y[i] = (vert.y + y) * z + yL;
        i++;
      }
      ref = this.animSet.faces;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        poly = ref[k];
        if (poly.anim != null) {
          this.sets[poly.anim].play(g, Model.x[poly.vert], Model.y[poly.vert]);
        } else {
          g.fillStyle = (ref1 = poly.col) != null ? ref1 : '#000000';
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
    }

  };

  Model.x = [];

  Model.y = [];

  return Model;

}).call(this);
