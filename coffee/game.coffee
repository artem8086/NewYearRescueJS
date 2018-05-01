class Game
	instance = null

	@width: 1024
	@height: 640
	@TIME_FRAME: 33
	
	constructor: ->
		@canvas = $$ '#game-canvas'
		@canvas.width = Game.width
		@canvas.height = Game.height
		@canvas.lineWidth = 2
		@context = @canvas.getContext '2d'
	
	load: (load_callback) ->
		# Settings load
		@settings = do settings.load
		# Animation load
		do Animation.load
		
		@engine = new Engine()
		
		do load_callback
		this

	run: (proc) ->
		if @interval? then clearInterval @interval
		@interval = setInterval (->
			game = Game.getGame()
			proc.act game
			proc.draw game.context
		), @TIME_FRAME

	@getGame = ->
		instance ?= new Game()