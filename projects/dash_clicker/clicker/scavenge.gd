extends CheckButton

var wood = 0

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	visible = false

func _on_scavange_timer_timeout():
	if button_down:
		wood += 1

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	%Label.text=str(wood)+" Wood"
	if %PrestigeProgress.value >= 1:
		visible = true
	if %PrestigeProgress.value < 1:
		wood = 0
		
