Engine.objectData['Decor'] =
	class Decor extends ObjData
		anim: 0
		type: 'Decoration'
		
		init: ->
			@animData = animation.anims[@animation]

Engine.objectData['PolyModel'] =
	class PolyModel extends ObjData
		type: 'ModelObj'
		zoom: 1
		
		init: ->
			@model = animation.models[@modelPath]

Engine.objectData['Static'] =
	class Static extends Decor
		@FLIP_X_MASK: 1
		@FLIP_Y_MASK: 2
		
		deathAnim: 0
		hp: -1
		friction: 0
		collision: 0
		flip: 0
		
		type: 'StaticObj'

Engine.objectData['Dynamic'] =
	class Dynamic extends Static
		min_damage: 0
		damageX_reduct: 1
		damageY_reduct: 1
		
		max_speedX: 0
		max_speedY: 0
		mass: 1
		coll_mask: 0
		type: 'DynamicObj'

Engine.objectData['ItemData'] =
	class ItemData extends Dynamic
		ammo: 0
		iconAnim: 0
		
		type: 'Item'
		isItem: true
		
		init: ->
			do super
			@icon = animation.anims[@iconName]
		
Engine.objectData['UnitData'] =
	class UnitData extends ObjData
		inAirStatus: 13
		startFrame: 0
		startStatus: 0
		deathStatus: 0
		jumpX: 0
		jumpY: 0
		
		type: 'UnitObj'
		
		init: ->
			for i, frame of @frames
				frame.form ?= 0
				frame.count ?= 0
				frame.next ?= + i + 1
			for form in @forms
				form.__proto__ = Engine.objectData[form.class ? 'Dynamic']::
				do form.init
			@animsData = []
			for key, anim of @anims
				@animsData[key] = animation.anims[anim]
			null

Engine.objectData['Bullet'] =
	class Bullet extends Static
		damage: 0
		range: -1
		coll_mask: 0
		velX: 0
		velY: 0
		forceX: 0
		forceT: 0
		
		type: 'BulletObj'