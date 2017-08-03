
var grid = {};
var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 

var frequencies = [523.25, 493.88, 440.00, 392.00, 349.23, 329.63, 293.66, 261.63];
function init()
{
	for(var i = 0; i < WIDTH; ++i)
	{
		grid[i] = {};
	}
	for(var j = 0; j < HEIGHT; ++j)
	{
		for(var i = 0; i < WIDTH; ++i)
		{
			buttons[i][j].addEventListener("click",toggleGridButton);
			grid[i][j] = {};
			var g = grid[i][j];
			g.active = false;
		}
	}
	
}


function toggleGridButton(e)
{
	var button = e.target;
	var x = button.id.split("_")[1];
	var y = button.id.split("_")[2];
	var g = grid[x][y];
	if(g.active)
	{
		g.active = false;
		setGridButtonColor(x,y,"#243");
	}
	else
	{
		g.active = true;
		setGridButtonColor(x,y,"#0FF");
	}
}

function onTick()
{
	currentTick = (currentTick + 1)%WIDTH;
    var now = audioCtx.currentTime;
	for(var j = 0; j < HEIGHT; ++j)
	{
		flashGridButton(currentTick,j,"#FFF", 200);
		var g = grid[currentTick][j];
		if(g.active)
		{
			var gain = audioCtx.createGain();
			gain.connect(audioCtx.destination);
			gain.gain.setValueAtTime(0, now);
			gain.gain.linearRampToValueAtTime(0.5, now + 0.1);
			gain.gain.linearRampToValueAtTime(0.0, now + 0.5);
			var oscillator = audioCtx.createOscillator();
			oscillator.type = "sine";
			oscillator.frequency.value = frequencies[j];
			oscillator.start();
			oscillator.stop(now + 0.5);
			oscillator.connect(gain);
			var oscillator2 = audioCtx.createOscillator();
			oscillator2.type = "sine";
			oscillator2.frequency.value = frequencies[j]+2;
			oscillator2.start();
			oscillator2.stop(now + 0.5);
			oscillator2.connect(gain);
			var oscillator3 = audioCtx.createOscillator();
			oscillator3.type = "sine";
			oscillator3.frequency.value = frequencies[j]-2;
			oscillator3.start();
			oscillator3.stop(now + 0.5);
			oscillator3.connect(gain);
		}
	}
}



init();
var ticks = setInterval(onTick, 300);