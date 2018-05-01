class Engine
	@START_LEVEL: 'start'
	
	@objectsClasses: []
	@objects: []
	@levels: []
	
	layer:
		x: 0
		y: 0
	
	loadLevel: (level = Engine.START_LEVEL) ->
		###level = Engine.levels[level]
		if @level != level
			@level = level
			# Init layers
			for key, layer of level.layers
				layer = level.layers[key] = Object.create Layer, layer
				do layer.load
		level###
		@anim = new Model animation.models['models/house0back']
		@anim2 = new Model animation.models['models/house0front']
	
	act: (game) ->
		do @anim.incAnim
		do @anim.incAnim

	draw: (g) ->
		do g.save
		g.translate 512, 320
		@anim.play g, -480, 280
		@anim2.play g, -480, 280
		do g.restore
