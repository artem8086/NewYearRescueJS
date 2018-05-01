'use strikt'
$$ = (selector, node = document) ->
	node.querySelector selector

anim = null
anim2 = null

window.addEventListener 'load', ->
	game = Game.getGame()

	game.load ->
		setTimeout (->
			$$('.preloader').classList.add 'done'
			engine = game.engine
			do engine.loadLevel
			setTimeout (-> game.run engine), 0
		), 1000
	
	
