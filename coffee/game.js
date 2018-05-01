(function() {
  var Game;

  Game = (function() {
    var instance;

    instance = null;

    Game.width = 1024;

    Game.height = 640;

    Game.TIME_FRAME = 33;

    function Game() {
      this.canvas = $$('#game-canvas');
      this.canvas.width = Game.width;
      this.canvas.height = Game.height;
      this.canvas.lineWidth = 2;
      this.context = this.canvas.getContext('2d');
    }

    Game.prototype.load = function(load_callback) {
      this.settings = settings.load();
      Animation.load();
      this.engine = new Engine();
      load_callback();
      return this;
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
