"use strict";

/* GLOBALS (actually everything is global but meh)
*/

window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

Nexus.context = audioCtx;

/* CONSTANTS
*/

const MAJOR_SCALE = [0,2,4,5,7,9,11];
const MINOR_SCALE = [0,2,3,5,7,8,10];
const BASE_NOTE = 60; //??
const BPM = 120;
const FREQUENCIES = []

// const means one time binding = cannot be re-assigned
// let means can be re-assigned
// var is deprecated

/* STATE
*/
const STATE = {
	chords_progression: [0, 4, 5, 3],
  totalBeats: 1,
	currentChordIndex: 0,
	now: 0,
	masterGain: audioCtx.createGain(),
	osci: new Nexus.Oscilloscope('#oscilloscope',{ 'size': [300,150] })
}

function onBeat()
{
	beat_indicator.classList.add("beat")
	setTimeout(function(){ beat_indicator.classList.remove("beat") }, 100)

	STATE.now = audioCtx.currentTime;

	STATE.totalBeats++;

	// teenage engineernig like chord looping
	// if one bar is over change to next chord
	// 4/4 takt
  if(STATE.totalBeats % 4 === 0 ) {

    if(STATE.currentChordIndex === STATE.chords_progression.length-1)
		  STATE.currentChordIndex = 0
    else
		  (++STATE.currentChordIndex)
	}

}

function onHalfBeat(){
	sequencer.next();
	half_beat_indicator.classList.add("beat")
	setTimeout(function(){ half_beat_indicator.classList.remove("beat") }, 100)
}

function init()
{
	window.ui_init();
	generateFrequencies();

 	STATE.osci.connect(STATE.masterGain);
	STATE.masterGain.connect(audioCtx.destination)
}
init();
// window.mainLoopId = setInterval(onTick, (60/(BPM*2))*1000);
// stop loop with clearInterval("loopId")

const BEAT =      new Nexus.Interval( 1000*60/BPM,   onBeat)
const HALF_BEAT = new Nexus.Interval( 1000*60/BPM/2, onHalfBeat)

BEAT.start()
HALF_BEAT.start()

// https://nexus-js.github.io/ui/api/#interval
// more accurate cause of web audio clock


/* Sound and Instruments
*/
function Oscillator(options)
{
	return new OscillatorNode(audioCtx, options)
}

function PaulsInstrument(freq)
{
	STATE.now = audioCtx.currentTime;
	var gain = audioCtx.createGain();
	gain.gain.setValueAtTime(0, STATE.now);
	gain.gain.linearRampToValueAtTime(0.333, STATE.now + 0.1);
	gain.gain.linearRampToValueAtTime(0.0, STATE.now + 0.5);


	gain.connect(STATE.masterGain);


	var oscillator = Oscillator({type: "square", frequency: freq});
	oscillator.connect(gain)
	oscillator.start()
	oscillator.stop(STATE.now + 0.5)

	var oscillator2 = Oscillator({type: "square", frequency: freq+2});
	oscillator2.connect(gain);
	oscillator2.start();
	oscillator2.stop(STATE.now + 0.5);

	var oscillator3 = Oscillator({type: "square", frequency: freq-2});
	oscillator3.connect(gain);
	oscillator3.start();
	oscillator3.stop(STATE.now + 0.5);


}

// generates all frequencie values, 440hz
function generateFrequencies()
{
	for(var note = 0; note < 127; ++note)
	{
		const a = Math.pow(2,1.0/12.0); // comments pls
		FREQUENCIES[note] = 440 * Math.pow(a, note - 81);
	}
}

// get note based on scale and chord info
function getNote(base, scale, chord, id)
{
	var scaleId = (7-id) + chord;
	var noteNumber = base + scale[scaleId%7]+(Math.floor(scaleId/7)*12);
	return FREQUENCIES[noteNumber];
}
