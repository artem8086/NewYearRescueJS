var Engine;

Engine = (function() {
  class Engine {
    static initObjects() {
      var name, object, ref;
      ref = Engine.objects;
      // Init objData
      for (name in ref) {
        object = ref[name];
        object.__proto__ = Engine.objectData[object.class].prototype;
        object.init();
      }
      return null;
    }

    init() {
      Game.getGame().setKeyHandler('engine', {
        obj: this,
        keyDown: this.keyPressed,
        keyUp: this.keyReleased
      });
      return null;
    }

    loadLevel(level = Engine.START_LEVEL) {
      var camera, i, j, key, lastCam, layer, layerEnd, len, ref, ref1;
      level = Engine.levels[level];
      if (this.level !== level) {
        this.level = level;
        // Init cameras
        lastCam = null;
        ref = this.level.cameras;
        for (j = 0, len = ref.length; j < len; j++) {
          camera = ref[j];
          camera.__proto__ = Camera.prototype;
          camera.init();
          if (lastCam != null) {
            lastCam.next = camera;
            lastCam = camera;
          } else {
            lastCam = this.cameras = camera;
          }
        }
        // Init layers
        layerEnd = null;
        this.layersArray = [];
        ref1 = level.layers;
        for (key in ref1) {
          layer = ref1[key];
          layer.__proto__ = Layer.prototype;
          this.layersArray.push(layer);
          layer.load();
          if (layerEnd != null) {
            layerEnd.next = layer;
            layerEnd = layer;
          } else {
            layerEnd = this.layers = layer;
          }
        }
        // Init players
        this.players = level.players;
        if (this.players != null) {
          i = 0;
          while (i < this.numPlayers) {
            this.players[i].__proto__ = Player.prototype;
            this.players[i].active = true;
            this.players[i].init(this.layersArray, Game.getGame().settings.keys[i]);
            i++;
          }
          while (i < Settings.NUM_PLAYERS) {
            this.players[i].__proto__ = Player.prototype;
            this.players[i].active = false;
            this.players[i].init(this.layersArray);
            this.players[i].setCanControl(false);
            i++;
          }
          while (i < this) {
            this.players[i].__proto__ = Player.prototype;
            this.players[i].active = false;
            this.players[i].init(this.layersArray);
            this.players[i].setCanControl(false);
            i++;
          }
        }
        this.camX = this.camY = 0;
        this.setCamera(this.cameras);
      }
      return level;
    }

    playersItemReset() {
      var j, len, player, results;
      if (this.players != null) {
        results = [];
        for (j = 0, len = players.length; j < len; j++) {
          player = players[j];
          results.push(player.removeItem());
        }
        return results;
      }
    }

    restartLevel() {
      console.log('restart level');
      this.loadLevel(this.level.restartLevel);
      return this.playerItemResret();
    }

    nextLevel() {
      console.log('next level');
      return this.loadLevel(this.level.nextLevel);
    }

    restartAfterDead() {
      console.log('death!');
      this.loadLevel(this.level.deadLevel);
      return this.playerItemResret();
    }

    setCamera(camera) {
      this.curCamera = camera;
      this.gravity = camera.gravity;
      this.flipGravity = camera.flipGravity;
      this.envirFrictionX = camera.envirFrictionX;
      return this.envirFrictionY = camera.envirFrictionY;
    }

    act(game) {
      var cenX, cenY, deltaX, deltaY, j, layer, len, numP, player, px, py, qh, qw, ref;
      game = Game.getGame();
      
      layer = this.curLayer = this.layers;
      while (layer != null) {
        layer.act();
        this.curLayer = layer = layer.next;
      }
      
      qw = Game.width / 2;
      qh = Game.height / 2;
      
      cenX = cenY = 0;
      numP = 0;
      ref = this.players;
      for (j = 0, len = ref.length; j < len; j++) {
        player = ref[j];
        if (player.active) {
          player.act();
          if (!player.enemy) {
            px = player.unit.x;
            py = player.unit.y;
            
            if (px > this.camX + qw) {
              px = this.camX + qw;
            } else {

            }
            if (px < this.camX - qw) {
              px = this.camX - qw;
            }
            if (py > this.camY + qh) {
              py = this.camY + qh;
            } else {

            }
            if (py < this.camY - qh) {
              py = this.camY - qh;
            }
            
            player.unit.x = px;
            player.unit.y = py;
          }
          cenX += player.unit.x;
          cenY += player.unit.y;
          numP++;
        }
      }
      cenX /= numP;
      cenY /= numP;
      
      deltaX = this.camX - cenX;
      if (deltaX < 0) {
        deltaX = -deltaX;
      }
      deltaY = this.camY - cenY;
      if (deltaY < 0) {
        deltaY = -deltaY;
      }
      
      qw = Game.width * this.curCamera.moveX_border;
      qh = Game.height * this.curCamera.moveY_border;
      this.curCamera.setCenter(deltaX >= qw ? (cenX > this.camX ? cenX - qw : cenX + qw) : this.camX, deltaY >= qh ? (cenY > this.camY ? cenY - qh : cenY + qh) : this.camY);
      return false;
    }

    draw(g) {
      var layer;
      g.fillStyle = this.curCamera.background;
      g.fillRect(0, 0, Game.width, Game.height);
      layer = this.curLayer = this.layers;
      while (layer != null) {
        layer.draw(g);
        layer = this.curLayer = layer.next;
      }
      return null;
    }

    keyPressed(keyCode) {
      var j, len, player, ref, results;
      if (this.players != null) {
        ref = this.players;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          player = ref[j];
          results.push(player.keyPressed(keyCode));
        }
        return results;
      }
    }

    keyReleased(keyCode) {
      var j, len, player, ref, results;
      if (this.players != null) {
        ref = this.players;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          player = ref[j];
          results.push(player.keyReleased(keyCode));
        }
        return results;
      }
    }

  };

  Engine.START_LEVEL = 'start';

  Engine.objectTypes = [];

  Engine.objectData = [];

  Engine.objects = [];

  Engine.levels = [];

  return Engine;

}).call(this);
