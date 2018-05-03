class Engine
	@START_LEVEL: 'start'

	@objectTypes: []
	@objectData: []
	@objects: []
	@levels: []
	
	@initObjects: ->
		# Init objData
		for name, object of Engine.objects
			object.__proto__ = Engine.objectData[object.class]::
			do object.init
		null

	init: ->
		Game.getGame().setKeyHandler 'engine',
			obj: this
			keyDown: @keyPressed
			keyUp: @keyReleased
		null

	loadLevel: (level = Engine.START_LEVEL) ->
		level = Engine.levels[level]
		if @level != level
			@level = level
			# Init cameras
			lastCam = null
			for camera in @level.cameras
				camera.__proto__ = Camera::
				do camera.init
				if lastCam?
					lastCam.next = camera
					lastCam = camera
				else
					lastCam = @cameras = camera
			# Init layers
			layerEnd = null
			@layersArray = []
			for key, layer of level.layers
				layer.__proto__ = Layer::
				@layersArray.push layer
				do layer.load
				if layerEnd?
					layerEnd.next = layer
					layerEnd = layer
				else
					layerEnd = @layers = layer
			# Init players
			@players = level.players
			if @players?
				i = 0
				while i < @numPlayers
					@players[i].__proto__ = Player::
					@players[i].active = on
					@players[i].init @layersArray, Game.getGame().settings.keys[i]
					i++
				while i < Settings.NUM_PLAYERS
					@players[i].__proto__ = Player::
					@players[i].active = off
					@players[i].init @layersArray
					@players[i].setCanControl off
					i++
				while i < @
					@players[i].__proto__ = Player::
					@players[i].active = off
					@players[i].init @layersArray
					@players[i].setCanControl off
					i++
			@camX = @camY = 0
			@setCamera @cameras
		level

	playersItemReset: ->
		if @players?
			for player in players
				do player.removeItem

	restartLevel: ->
		console.log 'restart level'
		@loadLevel @level.restartLevel
		do @playerItemResret

	nextLevel: ->
		console.log 'next level'
		@loadLevel @level.nextLevel

	restartAfterDead: ->
		console.log 'death!'
		@loadLevel @level.deadLevel
		do @playerItemResret

	setCamera: (camera) ->
		@curCamera = camera
		@gravity = camera.gravity
		@flipGravity = camera.flipGravity
		@envirFrictionX = camera.envirFrictionX
		@envirFrictionY = camera.envirFrictionY


	act: (game) ->
		game = Game.getGame()
		#
		layer = @curLayer = @layers
		while layer?
			do layer.act
			@curLayer = layer = layer.next
		#
		qw = Game.width / 2
		qh = Game.height / 2
		#
		cenX = cenY = 0
		numP = 0
		for player in @players
			if player.active
				do player.act
				unless player.enemy
					px = player.unit.x
					py = player.unit.y
					#
					if px > @camX + qw then px = @camX + qw else
					if px < @camX - qw then px = @camX - qw

					if py > @camY + qh then py = @camY + qh else
					if py < @camY - qh then py = @camY - qh
					#
					player.unit.x = px
					player.unit.y = py
				cenX += player.unit.x
				cenY += player.unit.y
				numP++
		cenX /= numP
		cenY /= numP
		#
		deltaX = @camX - cenX
		if deltaX < 0 then deltaX = - deltaX
		deltaY = @camY - cenY
		if deltaY < 0 then deltaY = - deltaY
		#
		qw = Game.width * @curCamera.moveX_border;
		qh = Game.height * @curCamera.moveY_border;
		@curCamera.setCenter(
				if deltaX >= qw then (if cenX > @camX then cenX - qw else cenX + qw) else @camX,
				if deltaY >= qh then (if cenY > @camY then cenY - qh else cenY + qh) else @camY)
		false

	draw: (g) ->
		g.fillStyle = @curCamera.background
		g.fillRect 0, 0, Game.width, Game.height
		layer = @curLayer = @layers
		while layer?
			layer.draw g
			layer = @curLayer = layer.next
		null

	keyPressed: (keyCode) ->
		if @players?
			for player in @players
				player.keyPressed keyCode

	keyReleased: (keyCode) ->
		if @players?
			for player in @players
				player.keyReleased keyCode