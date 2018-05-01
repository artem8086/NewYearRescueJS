(function() {
  var settings;

  settings = {
    KEY: 'settings',
    load: function() {
      var params;
      params = localStorage.getItem(settings.KEY);
      if (params != null) {
        params = JSON.parse(params);
      } else {
        params = {};
        settings.reset(params);
      }
      return params;
    },
    save: function(params) {
      return localStorage.setItem(settings.KEY, JSON.stringify(params));
    },
    reset: function(params) {
      params.fullscreen = false;
      params.keys = [];
      params.keys[0] = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        fire: 0,
        jump: 0,
        take: 0
      };
      return params.keys[1] = {
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

}).call(this);
