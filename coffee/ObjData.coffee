class ObjData
	isItem: false
	cenX: 0
	cenY: 0
	width: 0
	height: 0

	init: ->

	createObj: (layer, x, y, drop) ->
		obj = new Engine.objectTypes[@type]
		obj.init this, drop
		obj.setPos x, y
		layer.add obj
		obj

	getCenterX: -> @cenX

	getCenterY: -> @cenY
