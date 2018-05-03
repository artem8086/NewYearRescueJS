class Layer
	visible: true
	paralaxX: 1
	paralaxY: 1
	autoParalax: on
	xOffs: 0
	yOffs: 0

	load: ->
		last = null
		for i, obj of @objects
			obj = new ObjPos(
				obj.x, obj.y,
				Engine.objects[obj.name],
				obj.drop ? Engine.objects[obj.drop])
			if last?
				last.next = last = obj
				last = obj
			else
				@objsPos = last = obj
			@curObj = @objsPos

			if @autoParalax
				obj.x *= @paralaxX
				obj.y *= @paralaxY

	init: ->
		@xOffs = @yOffs = 0;
		@curObj = @objsPos
		@objs = null

	act: ->
		if @curObj? or @objs?
			engine = Game.getGame().engine
			@x = (engine.camX + @xOffs) * @paralaxX - Game.width / 2
			@y = (engine.camY + @yOffs) * @paralaxY - Game.height / 2
			#
			camera = engine.curCamera
			while @curObj? and Camera.contain(@curObj.data,
					@curObj.data.getCenterX(), @curObj.data.getCenterY(),
					@curObj.x, @curObj.y, @x, @y, camera.add_mask)
				@curObj.addObj this
				@curObj = @curObj.next
			#
			pred = null
			nextObj = null
			obj = @objs
			while obj?
				nextObj = obj.next
				if not Camera.contain(
						obj.data, obj.getCenterX(), obj.getCenterY(),
						obj.x, obj.y, @x, @y, camera.del_mask) or obj.act this
					unless pred? then @objs = nextObj
					else pred.next = nextObj
					do obj.pool
				else
					pred = obj
				obj = nextObj
			#
			false

	draw: (g) ->
		if @visible
			do g.save
			g.translate(-@x, -@y);
			#
			obj = @objs
			while obj?
				obj.draw g
				obj = obj.next
			#
			do g.restore
	
	add: (obj) ->
		obj.next = @objs
		@objs = obj
	
	removeAll: ->
		@objs = null


class ObjPos
	constructor: (@x, @y, @data, @drop) ->

	addObj: (layer) ->
		@data.createObj layer, @x, @y, @drop