class Game
	instance = null

	keyHandlers = []

	@width: 1024
	@height: 640
	@TIME_FRAME: 33
	
	constructor: ->
		@canvas = $$ '#game-canvas'
		@canvas.width = Game.width
		@canvas.height = Game.height
		@canvas.lineWidth = 2
		@context = @canvas.getContext '2d'
		#
		document.addEventListener 'keyup', (e) ->
			if e.keyCode == 70
				gw = $$('.game-wrapper')
				gw.requestFullscreen?()
				gw.mozRequestFullScreen?()
				gw.webkitRequestFullscreen?()
			else
				for name, handler of keyHandlers
					handler.keyUp.call handler.obj, e.keyCode
				do e.stopPropagation

		document.addEventListener 'keydown', (e) ->
			for name, handler of keyHandlers
				handler.keyDown.call handler.obj, e.keyCode
			do e.stopPropagation
	
	load: (load_callback) ->
		# Settings load
		@settings = do Settings.load
		# Animation load
		do Animation.load
		
		@engine = new Engine()
		do Engine.initObjects
		do @engine.init
		
		do load_callback
		this

	setKeyHandler: (name, handler) ->
		keyHandlers[name] = handler
		

	run: (proc) ->
		if @interval? then clearInterval @interval
		@interval = setInterval((->
				game = Game.getGame()
				proc.act game
				proc.draw game.context
			), Game.TIME_FRAME)

	@getGame = ->
		instance ?= new Game()