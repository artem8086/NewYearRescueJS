(function() {
  var Game;

  Game = (function() {
    var instance, keyHandlers;

    instance = null;

    keyHandlers = [];

    Game.width = 1024;

    Game.height = 640;

    Game.TIME_FRAME = 33;

    function Game() {
      this.canvas = $$('#game-canvas');
      this.canvas.width = Game.width;
      this.canvas.height = Game.height;
      this.canvas.lineWidth = 2;
      this.context = this.canvas.getContext('2d');
      this.canvas.addEventListener('keyup', function(e) {
        var handler, name, _results;
        _results = [];
        for (name in keyHandler) {
          handler = keyHandler[name];
          _results.push(handler.keyUp.call(handler.obj, e.keyCode));
        }
        return _results;
      });
      this.canvas.removeEventListener('keydown', function(e) {
        var handler, name, _results;
        _results = [];
        for (name in keyHandler) {
          handler = keyHandler[name];
          _results.push(handler.keyDown.call(handler.obj, e.keyCode));
        }
        return _results;
      });
    }

    Game.prototype.load = function(load_callback) {
      this.settings = Settings.load();
      Animation.load();
      this.engine = new Engine();
      Engine.initObjects();
      load_callback();
      return this;
    };

    Game.prototype.setKeyHandler = function(name, handler) {
      return keyHandlers[name] = handler;
    };

    Game.prototype.run = function(proc) {
      if (this.interval != null) {
        clearInterval(this.interval);
      }
      return this.interval = setInterval((function() {
        var game;
        game = Game.getGame();
        proc.act(game);
        return proc.draw(game.context);
      }), this.TIME_FRAME);
    };

    Game.getGame = function() {
      return instance != null ? instance : instance = new Game();
    };

    return Game;

  })();

}).call(this);
