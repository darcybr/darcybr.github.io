extends Button


# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	visible = false

var my_array = [1,2,3,4]
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	%Cost.text=str(Global.cost)+" current cost multiplier"
	Global.cost=snapped(Global.cost, 0.1)
	%Stone.text=str(Global.stone)+" Stone"
	%Dirt.text=str(Global.dirt)+" Dirt"
	%Gold.text=str(Global.gold)+" Gold"
	%Iron.text=str(Global.iron)+" Iron"
	if Global.wood >= 50:
		if Global.flint >= 5:
			visible = true
		
func _pressed():
	var rand_value = my_array.pick_random()
	if Global.wood >= Global.cost:
		Global.wood -= Global.cost
		Global.cost *= 1.2
		Global.wood = snapped(Global.wood, 0.01)
		if rand_value == 1:
			Global.dirt += randf() + Global.presti + Global.lvl / 50
			Global.dirt = snapped(Global.dirt, 0.01)
		if rand_value == 2:
			Global.stone += randf() + Global.presti
			Global.stone = snapped(Global.stone, 0.01)
		if rand_value == 3:
			Global.iron += randf() / 5
			Global.iron = snapped(Global.iron, 0.01)
		if rand_value == 4:
			Global.gold += randf() / 10
			Global.gold = snapped(Global.gold, 0.01)
