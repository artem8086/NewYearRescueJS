class Settings
	@KEY: 'settings'
	@NUM_PLAYERS: 2
	@load: ->
		params = localStorage.getItem Settings.KEY
		if params?
			params = JSON.parse params
		else
			params = []
			Settings::reset.call params
		params.__proto__ = Settings::
		params
	save: ->
		localStorage.setItem Settings.KEY, JSON.stringify this

	reset: ->
		@fullscreen = off
		@keys = []
		@keys[0] =
			up:    0x26
			down:  0x28
			left:  0x25
			right: 0x27
			fire:  90
			jump:  88
			take:  67
		@keys[1] =
			up: 0
			down: 0
			left: 0
			right: 0
			fire: 0
			jump: 0
			take: 0
	