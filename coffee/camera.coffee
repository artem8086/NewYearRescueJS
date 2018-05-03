class Camera
	@MASK_UP:    1
	@MASK_DOWN:  2
	@MASK_LEFT:  4
	@MASK_RIGHT: 8
	
	background: '\#000000'

	gravity: 0.98
	flipGravity: false
	
	envirFrictionX: 0.95
	envirFrictionY: 0.999
	
	moveX_border: 0.16
	moveY_border: 0.16
	
	block_mask: 0

	lock: off

	init: ->
		@statusLock = @lock
	
	@contain: (data, cenX, cenY, objX, objY, x1, y1, mask) ->
		if (mask & Camera.MASK_UP) != 0
			if objY - cenY + data.height < y1 then return false
		if (mask & Camera.MASK_LEFT) != 0
			if objX - cenX + data.width < x1 then return false
		if (mask & Camera.MASK_DOWN) != 0
			y2 = Game.height + y1
			if objY - cenY > y2 then return false
		if (mask & Camera.MASK_RIGHT) != 0
			x2 = Game.width + x1
			if objX - cenX > x2 then return false
		true

	containXY: (x, y) ->
		x >= @x and x <= @x + @w and y >= @y and y <= @y + @h

	setCenter: (x, y) ->
		engine = Game.getGame().engine
		unless @statusLock
			if @next?
				if @next.containXY(x, y) then engine.setCamera @next
			else
				do engine.nextLevel
		#
		if x < @x then x = @x else
		if x > @x + @w then x = @x + @w
		#
		if y < @y then y = @y else
		if y > @y + @h then y = @y + @h
		#
		mask = @block_mask;
		if mask != 0
			camX = engine.camX
			camY = engine.camY
			if (mask & Camera.MASK_UP) != 0 and y < camY then y = camY
			if (mask & Camera.MASK_DOWN) != 0 and y > camY then y = camY
			if (mask & Camera.MASK_LEFT) != 0 and x < camX then x = camX
			if (mask & Camera.MASK_RIGHT) != 0 and x > camX then x = camX
		engine.camX = x
		engine.camY = y