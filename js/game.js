var Game;

Game = (function() {
  var instance;

  class Game {
    constructor() {
      this.canvas = $$('#game-canvas');
      this.canvas.width = Game.width;
      this.canvas.height = Game.height;
      this.canvas.lineWidth = 2;
      this.context = this.canvas.getContext('2d');
    }

    load(load_callback) {
      // Settings load
      this.settings = settings.load();
      // Animation load
      Animation.load();
      this.engine = new Engine();
      load_callback();
      return this;
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
      }), this.TIME_FRAME);
    }

    static getGame() {
      return instance != null ? instance : instance = new Game();
    }

  };

  instance = null;

  Game.width = 1024;

  Game.height = 640;

  Game.TIME_FRAME = 33;

  return Game;

}).call(this);
