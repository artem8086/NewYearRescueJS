settings =
	KEY: 'settings'
	load: ->
		params = localStorage.getItem settings.KEY
		if params?
			params = JSON.parse params
		else
			params = {}
			settings.reset params
		params
	
	save: (params) ->
		localStorage.setItem settings.KEY, JSON.stringify params

	reset: (params) ->
		params.fullscreen = off
		params.keys = []
		params.keys[0] =
			up: 0
			down: 0
			left: 0
			right: 0
			fire: 0
			jump: 0
			take: 0
		params.keys[1] =
			up: 0
			down: 0
			left: 0
			right: 0
			fire: 0
			jump: 0
			take: 0
	