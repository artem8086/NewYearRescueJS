var Settings;

Settings = (function() {
  class Settings {
    static load() {
      var params;
      params = localStorage.getItem(Settings.KEY);
      if (params != null) {
        params = JSON.parse(params);
      } else {
        params = [];
        Settings.prototype.reset.call(params);
      }
      params.__proto__ = Settings.prototype;
      return params;
    }

    save() {
      return localStorage.setItem(Settings.KEY, JSON.stringify(this));
    }

    reset() {
      this.fullscreen = false;
      this.keys = [];
      this.keys[0] = {
        up: 0x26,
        down: 0x28,
        left: 0x25,
        right: 0x27,
        fire: 90,
        jump: 88,
        take: 67
      };
      return this.keys[1] = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        fire: 0,
        jump: 0,
        take: 0
      };
    }

  };

  Settings.KEY = 'settings';

  Settings.NUM_PLAYERS = 2;

  return Settings;

}).call(this);
