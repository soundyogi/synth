
var grid = {};
var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 

var frequencies = [];
var MAJOR_SCALE = [0,2,4,5,7,9,11];
var MINOR_SCALE = [0,2,3,5,7,8,10];
var CHORD_PROGRESSION = [0, 4, 5, 3];
var BASE_NOTE = 60;
var BPM = 120;
var currentTick = 0;
var currentTab = 0;

function generateFrequencies()
{
	for(var i = 0; i < 127; ++i)
	{
		a = Math.pow(2,1.0/12.0);
		frequencies[i] = 440 * Math.pow(a, i - 81);
	}
}

function init()
{
	generateFrequencies();
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

function getNote(base, scale, chord, id)
{
	var scaleId = (7-id) + chord;
	var note = base + scale[scaleId%7]+(Math.floor(scaleId/7)*12);
	return frequencies[note];
}

function onTick()
{
	++currentTick;
	if(currentTick >= WIDTH)
	{
		currentTick = 0;
		++currentTab;
		if(currentTab >= 4)
		{
			currentTab = 0;
		}
	}
	
    var now = audioCtx.currentTime;
	for(var j = 0; j < HEIGHT; ++j)
	{
		flashGridButton(currentTick,j,"#FFF", 200);
		var g = grid[currentTick][j];
		if(g.active)
		{
			var frequency = getNote(BASE_NOTE, MAJOR_SCALE, CHORD_PROGRESSION[currentTab], j);
			var gain = audioCtx.createGain();
			gain.connect(audioCtx.destination);
			gain.gain.setValueAtTime(0, now);
			gain.gain.linearRampToValueAtTime(0.333, now + 0.1);
			gain.gain.linearRampToValueAtTime(0.0, now + 0.5);
			var oscillator = audioCtx.createOscillator();
			oscillator.type = "square";
			oscillator.frequency.value = frequency;
			oscillator.start();
			oscillator.stop(now + 0.5);
			oscillator.connect(gain);
			var oscillator2 = audioCtx.createOscillator();
			oscillator2.type = "square";
			oscillator2.frequency.value = frequency+2;
			oscillator2.start();
			oscillator2.stop(now + 0.5);
			oscillator2.connect(gain);
			var oscillator3 = audioCtx.createOscillator();
			oscillator3.type = "square";
			oscillator3.frequency.value = frequency-2;
			oscillator3.start();
			oscillator3.stop(now + 0.5);
			oscillator3.connect(gain);
		}
	}
}

init();
var ticks = setInterval(onTick, (60/(BPM*2))*1000);