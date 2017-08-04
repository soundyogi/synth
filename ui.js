

// I generated some nice pallette colors
Nexus.colors.accent = "#9679EE"
Nexus.colors.fill = "#243"
Nexus.colors.dark = '#fff'
Nexus.colors.light = "#fff"
Nexus.colors.mediumDark = '#333'
Nexus.colors.mediumLight = "#B5B7C6"


function ui_init(){

	sequencer = new Nexus.Sequencer('#sequencer',{
	 'size': [700,350],
	 'mode': 'toggle',
	 'rows':    7,
	 'columns': 16
	})

	STATE.sequencer = sequencer

	sequencer.on('step',function(row) {

    row.reverse().forEach(function( data,id ){
      if(data){
				var frequency = getNote(BASE_NOTE, MAJOR_SCALE, STATE.chords_progression[STATE.currentChordIndex], id);
				PaulsInstrument(frequency)
			}
		})

	})

}
