(function() {
  var Engine;

  Engine = (function() {
    function Engine() {}

    Engine.START_LEVEL = 'start';

    Engine.objectTypes = [];

    Engine.objectData = [];

    Engine.objects = [];

    Engine.levels = [];

    Engine.initObjects = function() {
      var name, object, _ref;
      _ref = Engine.objects;
      for (name in _ref) {
        object = _ref[name];
        object.__proto__ = Engine.objectData[object["class"]].prototype;
        object.init();
      }
      return null;
    };

    Engine.prototype.init = function() {
      Game.getGame().setKeyHandler('engine', {
        obj: this,
        keyDown: keyPressed,
        keyUp: keyReleased
      });
      this.loadLevel(Engine.START_LEVEL);
      return this.playerItemReset();
    };

    Engine.prototype.loadLevel = function(level) {
      var camera, i, key, lastCam, layer, layerEnd, _i, _len, _ref, _ref1;
      if (level == null) {
        level = Engine.START_LEVEL;
      }
      level = Engine.levels[level];
      if (this.level !== level) {
        this.level = level;
        lastCam = null;
        _ref = this.level.cameras;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          camera = _ref[_i];
          camera.__proto__ = Camera.prototype;
          camera.init();
          if (lastCam != null) {
            lastCam.next = camera;
            lastCam = camera;
          } else {
            lastCam = this.cameras = camera;
          }
        }
        layerEnd = null;
        this.layersArray = [];
        _ref1 = level.layers;
        for (key in _ref1) {
          layer = _ref1[key];
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
            i++;
          }
          while (i < this) {
            this.players[i].__proto__ = Player.prototype;
            this.players[i].active = false;
            this.players[i].init(this.layersArray);
            i++;
          }
        }
        this.camX = this.camY = 0;
        this.setCamera(this.cameras);
      }
      return level;
    };

    Engine.prototype.playersItemReset = function() {
      var player, _i, _len, _results;
      if (this.players != null) {
        _results = [];
        for (_i = 0, _len = players.length; _i < _len; _i++) {
          player = players[_i];
          _results.push(player.removeItem());
        }
        return _results;
      }
    };

    Engine.prototype.restartLevel = function() {
      console.log('restart level');
      this.loadLevel(this.level.restartLevel);
      return this.playerItemResret();
    };

    Engine.prototype.nextLevel = function() {
      console.log('next level');
      return this.loadLevel(this.level.nextLevel);
    };

    Engine.prototype.restartAfterDead = function() {
      console.log('death!');
      this.loadLevel(this.level.deadLevel);
      return this.playerItemResret();
    };

    Engine.prototype.setCamera = function(camera) {
      this.curCamera = camera;
      this.gravity = camera.gravity;
      this.flipGravity = camera.flipGravity;
      this.envirFrictionX = camera.envirFrictionX;
      return this.envirFrictionY = camera.envirFrictionY;
    };

    Engine.prototype.act = function(game) {
      var cenX, cenY, deltaX, deltaY, layer, numP, player, px, py, qh, qw, _i, _len, _ref;
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
      _ref = this.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
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
    };

    Engine.prototype.draw = function(g) {
      var layer;
      g.fillStyle = this.curCamera.background;
      g.fillRect(0, 0, Game.width, Game.height);
      layer = this.curLayer = this.layers;
      while (layer != null) {
        layer.draw(g);
        layer = this.curLayer = layer.next;
      }
      return null;
    };

    Engine.prototype.keyPressed = function(keyCode) {
      var player, _i, _len, _ref, _results;
      if (this.players != null) {
        _ref = this.players;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          player = _ref[_i];
          _results.push(player.keyPressed(keyCode));
        }
        return _results;
      }
    };

    Engine.prototype.keyReleased = function(keyCode) {
      var player, _i, _len, _ref, _results;
      if (this.players != null) {
        _ref = this.players;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          player = _ref[_i];
          _results.push(player.keyReleased(keyCode));
        }
        return _results;
      }
    };

    return Engine;

  })();

}).call(this);
