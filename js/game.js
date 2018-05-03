var Game;

Game = (function() {
  var instance, keyHandlers;

  class Game {
    constructor() {
      this.canvas = $$('#game-canvas');
      this.canvas.width = Game.width;
      this.canvas.height = Game.height;
      this.canvas.lineWidth = 2;
      this.context = this.canvas.getContext('2d');
      
      document.addEventListener('keyup', function(e) {
        var gw, handler, name;
        if (e.keyCode === 70) {
          gw = $$('.game-wrapper');
          if (typeof gw.requestFullscreen === "function") {
            gw.requestFullscreen();
          }
          if (typeof gw.mozRequestFullScreen === "function") {
            gw.mozRequestFullScreen();
          }
          return typeof gw.webkitRequestFullscreen === "function" ? gw.webkitRequestFullscreen() : void 0;
        } else {
          for (name in keyHandlers) {
            handler = keyHandlers[name];
            handler.keyUp.call(handler.obj, e.keyCode);
          }
          return e.stopPropagation();
        }
      });
      document.addEventListener('keydown', function(e) {
        var handler, name;
        for (name in keyHandlers) {
          handler = keyHandlers[name];
          handler.keyDown.call(handler.obj, e.keyCode);
        }
        return e.stopPropagation();
      });
    }

    load(load_callback) {
      // Settings load
      this.settings = Settings.load();
      // Animation load
      Animation.load();
      this.engine = new Engine();
      Engine.initObjects();
      this.engine.init();
      load_callback();
      return this;
    }

    setKeyHandler(name, handler) {
      return keyHandlers[name] = handler;
    }

    run(proc) {
      if (this.interval != null) {
        clearInterval(this.interval);
      }
      return this.interval = setInterval((function() {
        var game;
        game = Game.getGame();
        proc.act(game);
        return proc.draw(game.context);
      }), Game.TIME_FRAME);
    }

    static getGame() {
      return instance != null ? instance : instance = new Game();
    }

  };

  instance = null;

  keyHandlers = [];

  Game.width = 1024;

  Game.height = 640;

  Game.TIME_FRAME = 33;

  return Game;

}).call(this);
