class Layer
	paralaxX: 1
	paralaxY: 1
	autoParalax: on

	laod: ->
		engine = Game.getGame().engine
		for object in @object
			object.data = engine.objects[object.name]
			if @autoParalax
				object.x *= @paralaxX
				object.y *= @paralaxY

	init: ->
		@xOffs = @yOffs = 0;
		@curObj = @objects.lenght - 1
		objs = []
	
	act: ->
		if @curObj? or objs.lenght != 0
			engine = Game.getGame().engine
			@x = (engine.camX + @xOffs) * @paralaxX - Game.width / 2
			@x = (engine.camY + @yOffs) * @paralaxY - Game.height / 2

	draw: (g) ->
		do g.save
		g.translate(- @x, - @y);
		#
		for object in @objs
			object.draw g
		#
		do g.restore
