class Player
	@STATUS_STAND: 0
	@STATUS_UP:    1
	@STATUS_DOWN:  2
	@STATUS_FIRE:  3
	@STATUS_RUN:   6

	@MASK_UP:   1
	@MASK_DOWN: 2
	@MASK_RUN:  4
	@MASK_FIRE: 8

	@MASK_KEYS:
		up:    Player.MASK_UP,
		down:  Player.MASK_DOWN,
		left:  Player.MASK_RUN,
		right: Player.MASK_RUN,
		fire:  Player.MASK_FIRE

	shiftHP: 1
	active: false
	canControl: false

	init: (layers, @keys) ->
		@unitLayer = layers[@layer]
		#
		@dataSets = []
		for i, set of @sets
			@dataSets[i] = Engine.objects[set]
		#
		@iconAnim = new Animation animation.anims[@icon]
		#
		@canControl = @control
		@curMask = 0
		do @activatePlayer if @active

	activatePlayer: ->
		###
		hero.setAnimSet(iconAnim);
		hero.setPos(iconX, iconY);
		hero.setAnimNum(iconNum);
		hero.setPlayer(this);
		loader.level.add(hero);
		###
		set = null
		if @item?
			set = @dataSets[@item.getSetName()]
		set ?= @dataSets[0]
		@unit = set.createObj @unitLayer, @unitX, @unitY
		@unit.owner = this
		@active = on

	setCanControl: (control) ->
		@canControl = control
		@curMask = 0
		@unit?.setStatus Player.STATUS_STAND

	setStdSet: ->
		@unit.setStdSet @dataSets[0]

	getSet: (name) ->
		for set in @dataSets
			if name == set.setName
				return set

	setSet: (name) ->
		@unit.setData @getSet name

	setSetIndx: (indx) ->
		@unit.setData @dataSets[indx]

	act: ->
		if @unit.getHP() == 0
			@canControl = off
			if not @enemy and not @unit.data?
				do Game.getGame().engine.restertAfterDead
		else
			do @item.act if @item?
	
	getStatus: ->
		@mask2status @curMask

	mask2status: (mask) ->
		status = Player.STATUS_STAND;
		if (mask & Player.MASK_FIRE) != 0 then status += Player.STATUS_FIRE
		if (mask & Player.MASK_RUN) != 0 then status += Player.STATUS_RUN
		if (mask & Player.MASK_DOWN) != 0 then status += Player.STATUS_DOWN
		else if (mask & Player.MASK_UP) != 0 then status += Player.STATUS_UP
		status

	keyPressed: (key) ->
		if @canControl
			newMask = @curMask;
			for i, mask of Player.MASK_KEYS
				if key == @keys[i]
					newMask |= mask
					break

			if newMask != @curMask
				if key == @keys.left then @unit.setFlipX on
				else if key == @keys.right then @unit.setFlipX off
				@curMask = newMask
				@unit.setStatus @mask2status newMask
			if key == @keys.jump then @unit.setJump on
		null
	
	keyReleased: (key) ->
		if @canControl
			newMask = @curMask;
			for i, mask of Player.MASK_KEYS
				if key == @keys[i]
					newMask &= ~ mask;
					break

			if newMask != @curMask
				@curMask = newMask;
				@unit.setStatus @mask2status newMask
			if key == @keys.jump then @unit.setJump off
			if key == @keys.take then do @getItem
		null
	
	getItem: ->
		pred = null
		nextObj = null
		obj = @unitLayer.objs;
		x = @unit.getX()
		y = @unit.getY()
		w = @unit.data.width
		h = @unit.data.height
		drop = on
		while obj?
			nextObj = obj.next
			if obj != @unit and obj.data.isItem and
					obj.contain(x, y, w, h)
				#
				drop = off
				if obj.playerGet this
					unless pred? then @unitLayer.objs = nextObj
					else pred.next = nextObj;
					obj.next = null
					break
			else
				pred = obj
			obj = nextObj
		do @dropItem if drop

	removeItem: ->
		if @item?
			@item.setPos @unit.x, @unit.y
			@item.setFlipX unit.isFlipX()
			@unitLayer.add @item
			do @setStdSet
			@item = null
	
	dropItem: ->
		if @item?
			@item.setPos @unit.x, @unit.y
			@item.setFlipX @unit.isFlipX()
			@unitLayer.add @item
			do @setStdSet
			@item = null