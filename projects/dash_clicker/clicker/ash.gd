extends Label

var Ash = 0
var AshAm = 0

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	%AshTime.paused = true
	visible = false


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	%AshTime.wait_time = snapped(%AshTime.wait_time, 0.01)
	if %PrestigeProgress.value >= 1:
		visible = true
	self.text=str(Ash)+" Ash"
	%TimeAshLeft.text=str(%AshTime.time_left)+" : "
	if AshAm == 1:
		%TimeOver.text=str(%AshTime.wait_time)+" ("+str(AshAm)+ " Campfire)"
	if AshAm == 0:
		%TimeOver.text=str(%AshTime.wait_time)+" ("+str(AshAm)+ " Campfires)"
	if AshAm > 1:
		%TimeOver.text=str(%AshTime.wait_time)+" ("+str(AshAm)+ " Campfires)"

func _on_fire_buy_pressed() -> void:
	if Global.wood >= 10:
		if Global.flint >= 5:
			Global.wood -= 10
			Global.flint -= 5
			%AshTime.paused = false
			AshAm += 1
			%AshTime.wait_time -= 0.01


func _on_ash_time_timeout() -> void:
	if Global.wood >= 1:
		Global.wood -= 1
		Ash += AshAm
