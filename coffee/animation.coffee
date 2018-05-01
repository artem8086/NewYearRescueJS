animation =
	anims: []
	models: []
	

class Animation
	constructor: (@animSet) ->

	@load: ->
		for name, anim of animation.anims
			img = document.createElement 'img'
			img.src = 'images/' + name + '.png'
			anim.img = img
		null

	setAnimation: (num) ->
		anim = @animSet.sets[num]
		if anim != @current
			@current = anim;
			@time = anim.frameTime
			@nFrame = 0;
	
	reset: ->
		@time = @current.frameTime
		@nFrame = 0

	incAnim: (cycle = true) ->
		@time--
		if @time <= 0
			@time = @current.frameTime
			@nFrame++
			if @nFrame >= @current.frames.length
				@nFrame = if cycle then 0 else @current.frames.length - 1
				return not cycle
		false

	play: (g, x, y, flipX = off, flipY = off) ->
		frame = @current.frames[@nFrame]
		if frame?
			x = if flipX then - x + frame.centerX - frame.width else x - frame.centerX
			y = if flipY then - y - frame.centerY else y + frame.centerY - frame.height
			do g.save
			g.scale (if flipX then -1 else 1), (if flipY then -1 else 1)
			g.drawImage @animSet.img,
				frame.x1, frame.y1, frame.x2, frame.y2,
				x, y, frame.width, frame.height
			do g.restore
		this


class Model
	@x: []
	@y: []

	constructor: (animSet) ->
		@animSet = animSet
		if animSet.anims?
			@sets = []
			for key, set of animSet.anims
				(@sets[key] = new Animation animation.anims[set.name])
					.setAnimation set.anim ? 0
	
	incAnim: (cycle = true) ->
		ret = false
		if @sets?
			for anim in @sets
				ret |= anim.incAnim cycle
		ret

	play: (g, x, y, zoom = 1) ->
		layer = Game.getGame().engine.layer
		xL = layer.x
		yL = layer.y
		x -= xL
		y -= yL
		z = .0
		verts = @animSet.verts;
		i = 0
		for vert in verts
			z = vert.z * zoom
			Model.x[i] = (vert.x + x) * z + xL
			Model.y[i] = (vert.y + y) * z + yL
			i++
		for poly in @animSet.faces
			if poly.anim?
				@sets[poly.anim].play g, Model.x[poly.vert], Model.y[poly.vert]
			else
				g.fillStyle = poly.col ? '#000000'
				n = poly.verts.length
				if n > 2
					i = n - 1
					do g.beginPath
					indx = poly.verts[i];
					g.moveTo Model.x[indx], Model.y[indx]
					i--
					while i >= 0
						indx = poly.verts[i];
						g.lineTo Model.x[indx], Model.y[indx]
						i--
					do g.closePath
					do g.fill
				else
					do g.beginPath
					indx = poly.verts[0];
					g.moveTo Model.x[indx], Model.y[indx]
					indx = poly.verts[1];
					g.lineTo Model.x[indx], Model.y[indx]
					do g.closePath
					do g.stroke
		null
