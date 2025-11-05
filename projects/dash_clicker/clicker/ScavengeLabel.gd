extends Label


var wood = Global.wood

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	visible = true



# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	self.text=str(Global.wood)+" Wood"
		
