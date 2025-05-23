extends Button


func _pressed():
	%ExploreProgress.value += Global.lvl + 10

	
func _process(delta: float) -> void:
	%PrestigeProgress.value = Global.presti
	%LvlExplore.text=str(Global.lvl)+" Lvls"
	%PrestigeExplore.text=str(Global.presti)+" Prestiges"
	if %ExploreProgress.value >= %ExploreProgress.max_value:
		Global.flint += randf_range(0.1,1)
		Global.flint += Global.presti / 5
		Global.flint = snapped(Global.flint, 0.01)
		Global.wood += randf_range(0.8,2.5) + Global.presti
		Global.wood * Global.presti
		Global.wood = snapped(Global.wood, 0.01)
		%LvlProgress.value += 10
		%ExploreProgress.value = 0
		if Global.presti > 100:
			Global.lvl += Global.presti / 100
			Global.lvl -= 1
	if Global.lvl >= Global.PN:
		Global.lvl = Global.PN
	if %LvlProgress.value >= %LvlProgress.max_value:
		Global.lvl += 1
		%LvlProgress.value = 0


func _on_timer_timeout() -> void:
	if Global.presti >= 1:
		%ExploreProgress.value += Global.presti


func _on_prestige_pressed() -> void:
	if Global.lvl >= Global.PN:
		Global.cost = 1
		Global.presti += 1
		Global.PN += 10
		Global.wood = 0
		Global.flint = 0 
		%PrestigeProgress.value += 1
		%LvlProgress.value = 0
		Global.lvl = 1
