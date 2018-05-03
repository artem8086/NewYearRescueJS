Engine.objectTypes['Decoration'] =
	class Decoration
		init: (data, drop) ->
			@data = data
			if data.animData?
				@anim = new Animation data.animData
				@anim.setAnimation data.anim

		draw: (g) ->
			@anim?.play g, @x, @y
		
		act: ->
			anim?.incAnim false
			false
		
		getCenterX: -> @data.cenX
		
		getCenterY: -> @data.cenY

		setPos: (@x, @y) ->
	
		pool: ->

Engine.objectTypes['ModelObj'] =
	class ModelObj extends Decoration
		init: (data, drop) ->
			@data = data
			if data.model?
				@anim = new Model data.model

		draw: (g) ->
			@anim.play g, @x, @y, @data.zoom

Engine.objectTypes['StaticObj'] =
	class StaticObj extends Decoration
		hp: 0
		vx: 0
		vy: 0
		cenX: 0
		cenY: 0
		flipX: off
		flipY: off
		
		init: (data, drop) ->
			super data, drop
			@drop = drop
			@setFlipX (data.flip & Static.FLIP_X_MASK) != 0
			@setFlipY (data.flip & Static.FLIP_Y_MASK) != 0
			@hp = data.hp
			@vx = @vy = 0
		
		setFlipX: (flipX) ->
			@cenX = if @flipX then @data.width - @data.cenX else @data.cenX
			@flipX = flipX
		
		setFlipY: (flipY) ->
			@cenY = if @flipY then @data.height - @data.cenY else @data.cenY
			@flipY = flipY

		isFlipX: -> @flipX
		
		isFlipY: -> @flipY
		
		isAlive: -> @hp != 0
		
		getX: -> @x - @cenX
		
		getY: -> @x - @cenY

		getHP: -> @hp
	
		getMaxHP: -> @data.hp

		addHP: (dmg) ->
			if @hp >= 0
				@hp += dmg
				max = @data.hp
				if @hp > max then @hp = max
				else if @hp <= 0
					do @setDeathAnim
					@hp = 0

		contain: (x, y) ->
			tx = @x - @cenY
			ty = @y - @cenY
			x >= tx and x <= tx + @data.width and y >= ty and y <= ty + @data.height
		
		containWH: (tx, ty, w, h) ->
			rx = @x - @cenY
			ry = @y - @cenY
			rx + @data.width > tx and ry + @data.height > ty and tx + w > rx && ty + h > ry;
			
		setDeathAnim: ->
			@anim.setAnimation @data.deathAnim
		
		getColision: ->
			if @hp == 0 then 0 else @data.collision
		
		addForce: ->
		
		setForce: (@vx, @vy) ->
		
		getVX: -> @vx
		
		getVY: -> @vy
		
		getImpulseX: -> @vx
		
		getCenterX: -> @cenX
		
		getCenterY: -> @cenY
		
		act: ->
			if @anim? then @anim.incAnim @hp != 0 else false
		
		pool: ->
			if @hp == 0
				@drop?.createObj Game.getGame().curLayer, @x, @y

Engine.objectTypes['DynamicObj'] =
	class DynamicObj extends StaticObj
		onGround: false
		friction: 1
		impulseX: 0
		
		act: (layer) ->
			del = super layer
			engine = Game.getGame().engine
			@vx *= @friction if @onGround
			do @modifyForce
			unless @onGround
				@vx *= engine.envirFrictionX
				@vy *= engine.envirFrictionY
			@vy += engine.gravity * @data.mass
			max = @data.max_speedX
			if @vx > max then @vx = max else if @vx < -max then @vx = -max
			max = @data.max_speedY
			if @vy > max then @vy = max else if @vy < -max then @vy = -max
			old_x = @x
			old_y = @y
			@x += @vx
			if engine.flipGravity
				@setFlipY true
				@y -= @vy
			else
				@setFlipY false
				@y += @vy
			# Обнаружение коллизий
			obj = layer.objs;
			DynamicObj.hCollObj = DynamicObj.vCollObj = null
			@onGround = false
			while obj?
				if obj != this
					@dealsDamage obj
					if (obj.getColision() & @data.coll_mask) != 0
						if @vy != 0 and @collisionDetect(old_x, old_y, old_x, @y, obj, true)
							DynamicObj.vCollObj = obj
						else
						if @vx != 0 and @collisionDetect(old_x, old_y, @x, old_y, obj, false)
							DynamicObj.hCollObj = obj
				obj = obj.next
			# Обработка столкновения
			if DynamicObj.hCollObj? then @collisonProcessing DynamicObj.hCollObj, true
			if DynamicObj.vCollObj? then @collisonProcessing DynamicObj.vCollObj, false
			del
		
		dealsDamage: ->
		
		modifyForce: ->
	
		getImpulseX: -> @impulseX
		
		addForce: (x, y) ->
			@vx += x
			@vy += y
	
		draw: (g) ->
			@anim?.play g, @x, @y, @flipX, @flipY

		collisonProcessing: (collObj, collX) ->
			# Просчёт урона
			x = @vx * @data.damageX_reduct
			y = @vy * @data.damageY_reduct
			damage = Math.sqrt(x * x + y * y) - @data.min_damage;
			if damage > 0
				damage *= @data.mass;
				collObj.addHP -damage
				@addHP -damage
			collObj.addForce(
				if collX then @vx else 0,
				if collX then 0 else if @vy > 0 then @vy else @vy / @data.mass)
			if collX
				@impulseX = @vx = 0;
			else
				@vx += collObj.getImpulseX()
				@impulseX = @vx
				@friction = collObj.data.friction + @data.friction
				@friction /= @data.mass * 2
				@vy = 0
		
		collisionDetect: (old_x, old_y, x, y, obj, vert) ->
			rx = old_x - @cenX;
			ry = old_y - @cenY;
			rw = rx + @data.width;
			rh = ry + @data.height;
			t = old_x - x;
			if t >= 0 then rx -= t else rw -= t
			t = old_y - y
			if t < 0 then rh -= t else ry -= t
			tx = obj.x - obj.cenX
			ty = obj.y - obj.cenY
			tw = tx + obj.data.width
			th = ty + obj.data.height
			#
			if rw > tx and rh > ty and tw > rx and th > ry
				if vert
					if Game.getGame().engine.flipGravity
						if rh < th
							if @vy <= 0 then @y = ty - @data.height + @cenY
						else
							if @vy >= 0
								@y = th + @cenY
								@onGround = true
					else
					if ry < ty
						if @vy >= 0
							@y = ty - @data.height + @cenY
							@onGround = true
					else
						if @vy <= 0 then @y = th + @cenY
				else
					if rx < tx
						if @vx >= 0 then @x = tx - @data.width + @cenX
					else
						if @vx <= 0 then @x = tw + @cenX;
				return true
			false
	
Engine.objectTypes['BulletObj'] =
	class BulletObj extends StaticObj
		init: (data, drop) ->
			super data, drop
			@range = data.range
		
		act: (layer) ->
			del = super layer
			if @range == 0 then return true
			@range-- if @range > 0
			#
			@x += if @flipX then -@data.velX else @data.velX
			@y += if @flipY then -@data.velY else @data.velY
			obj = layer.objs
			xt = @x - @cenX
			yt = @y - @cenY
			w = @data.width;
			h = @data.height;
			while obj?
				if obj != this
					if (obj.getColision() & @data.coll_mask) != 0 and obj.containWH(xt, yt, w, h)
						obj.addForce(
							if @flipX then -@data.forceX else @data.forceX,
							if @flipY then -@data.forceY else @data.forceY)
						obj.addHP @data.damage
						return true
				obj = obj.next
			del
		
		@addObj: (owner, layer) ->
			obj = Engine.objects[data.typeObj]
			if obj?
				obj.init data, null
				obj.setFlipY @flipY
				obj.setPos(
					owner.x + (if owner.isFlipX() then -x else x),
					owner.y + (if owner.isFlipY() then -y else y))
				if owner.isFlipX() then obj.setFlipX not obj.isFlipX()
				if owner.isFlipY() then obj.setFlipY not obj.isFlipY()
				layer.add obj
			obj

Engine.objectTypes['UnitObj'] =
	class UnitObj extends DynamicObj
		jump: false
		count: 0

		init: (data, drop) ->
			@status = data.startStatus
			@mData = data
			@frame = data.frames[data.startFrame]
			super data.forms[@frame.form], drop
			@anim = new Animation()
			@setFrame @mData.startFrame

		setData: (mData) ->
			@mData = mData
			if @owner?
				@status = @owner.getStatus()
			else @status = 0
			@setStatusImm status
		
		setStatus: (status) ->
			unless @onGround then status += @mData.inAirStatus
			if @status != status
				@setFrame @mData.frameStatus[status]
				@status = status
		
		setStatusImm: (status) ->
			unless @onGround then status += @mData.inAirStatus
			@setFrame @mData,frameStatus[status]
			@status = status
		
		setFrame: (frameNum) ->
			frame = @mData.frames[frameNum]
			if not @curFrame? or frame != @curFrame
				@curFrame = frame
				@data = @mData.forms[frame.form]
				if frame.anims? then @setAnim frame.anims
			@count = frame.count

		setAnim: (anims) ->
			anim = @anim;
			len = anims.length - 1
			i = 0
			while i <= len
				a = anims[i];
				anim.setAnimAndSet @mData.animsData[a >> 8], a & 0xFF
				if i != len
					anim.next ?= new Animation()
					anim = anim.next
				else
					anim.next = null
					break
				i++
		
		setDeathAnim: ->
			if @owner? then do @owner.setStdSet
			@setStatus @mData.deathStatus
		
		modifyForce: ->
			if @jump and @onGround and @hp != 0
				@addForce(
					if @flipX then -@mData.jumpX else @mData.jumpX,
					@mData.jumpY)
			forceX = @mData.forceX[@status]
			forceY = @mData.forceY[@status]
			@addForce(
				if @flipX then -forceX else forceX,
				if Game.getGame().engine.flipGravity then -forceY else forceY)

		act: (layer) ->
			super layer
			#
			if @curFrame.bullets?
				for bullet in @curFrame.bullets
					BulletObj.addObj.call bullet this, layer
				@owner?.item?.rangeFire @curFrame.bullets.length
			#
			if @count > 0 then @count--
			else @setFrame @curFrame.next
			#
			if @hp == 0
				@setStatus @mData.deathStatus
				return @curFrame == @mData.frames[@curFrame.next]
			@setStatus @status % @mData.inAirStatus
			false

		dealsDamage: (obj) ->
			if @curFrame.dmgRegs?
				for region in @curFrame.dmgRegs
					if (obj.getColision() & region.mask) != 0
						w = region.w
						h = region.h
						x1 = if @flipX then @x - region.x - w else @x + region.x
						y1 = if @flipY then @y - region.y - h else @y + region.y
						if obj.contain(x1, y1, w, h)
							obj.addForce(
									if @flipX then -region.forceX else region.forceX,
									if @flipY then -region.forceY else region.forceY)
							obj.addHP region.damage
				@owner?.item?.meleeFire @curFrame.dmgRegs.length
		
		setJump: (@jump) ->

Engine.objectTypes['items.Item'] =
	class ItemObj extends DynamicObj
		ammo: 0
		
		init: (data, drop) ->
			super data, drop
			@ammo = @data.ammo
		
		playerGet: (player) ->
			if player.item? and player.item.data == @data
				player.item.addAmmo @ammo
				do @pool
				return true
			else
				uData = @player.getSet @data.setName
				if uData?
					@player = player
					do player.dropItem
					player.item = this
					player.setSet uData
					return true
			false
		
		getAmmo: -> ammo
		
		decAmmp: (ammo) ->
			if @ammo >= 0
				@ammo -= ammo
				if @ammo <= 0
					@ammo = 0
					do @player.removeItem
		
		addAmmo: (ammo) ->
			if @ammo >= 0
				@ammo += ammo
		
		rangeFire: (amount) ->
			if amount > 0 then @decAmmo 1
		
		meleeFire: (amount) ->
			if amount > 1 then @decAmmo 1
		
		getSetName: -> data.setName

Engine.objectTypes['items.Skin'] =
	class SkinObj extends ItemObj
		playerGet: (player) ->
			sets = player.unit.mData
			do sets.animsData[ammo].remove
			sets.animsData[ammo] = @data.animData
			@data.animData.loadIndx++
			player.setSet sets
			false

Engine.objectTypes['AI.ShovelElf'] =
Engine.objectTypes['AI.ShovelElf'] =
	class ShovelElf extends UnitObj
		act: (layer) ->
			del = super layer
			if @hp != 0
				flip = @isFlipX()
				players = Game.getGame().engine.players
				xt = @getX() - 40
				w = @data.width + 80
				yt = @getY()
				h = @data.height
				attack = false
				for player in players
					if player.active and not player.enemy
						unit = player.unit
						if unit.isAlive()
							attack |= unit.containWH xt, yt, w, h
							if attack then flip = @x > unit.x
				if attack
					@setStatus Player.STATUS_FIRE
					@setFlipX flip
				else
					@setStatus Player.STATUS_RUN
					if DynamicObj.hCollObj? then @setFlipX not flip
			del

