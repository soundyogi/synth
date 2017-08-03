
var WIDTH = 8;
var HEIGHT = 8;

var buttons = {};
var currentTick = 0;


function buildGrid(table)
{
	for(var i = 0; i < WIDTH; ++i)
	{
		buttons[i] = {};
	}
	
	for(var j = 0; j < HEIGHT; ++j)
	{
		var tr = document.createElement('tr');
		table.appendChild(tr);
		for(var i = 0; i < WIDTH; ++i)
		{
			var th = document.createElement('th');
			tr.appendChild(th);
			var button = document.createElement('button');
			button.id = "grid_" + i + "_" + j;
			button.className = "grid_button";
			button.active = false;
			button.flash = false;
			buttons[i][j] = button;
			th.appendChild(button);
		}
	}
}

function flashGridButton(x, y, color, duration = 200)
{
	var button = buttons[x][y];
	var oldColor = button.style.backgroundColor;
	button.flashTimeout = setTimeout(
		function(button, color){
			button.style.backgroundColor = color;
			button.flashTimeout = null;
		},
		duration, button,oldColor);
	button.style.backgroundColor = color;
}

function setGridButtonColor(x,y,color)
{
	var button = buttons[x][y];
	if(button.flashTimeout != null)
	{
		clearTimeout(button.flashTimeout);
	}
	button.style.backgroundColor = color;
}

var table = document.getElementById("buttons");
buildGrid(table);

