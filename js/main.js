'use strikt';
var $$, anim, anim2;

$$ = function(selector, node = document) {
  return node.querySelector(selector);
};

anim = null;

anim2 = null;

window.addEventListener('load', function() {
  var game;
  game = Game.getGame();
  return game.load(function() {
    return setTimeout((function() {
      var engine;
      $$('.preloader').classList.add('done');
      engine = game.engine;
      engine.numPlayers = 1;
      engine.loadLevel();
      return setTimeout((function() {
        return game.run(engine);
      }), 0);
    }), 1000);
  });
});
