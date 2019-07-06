import React from 'react';
import './App.css';

import PlayArrowIcon from '@material-ui/icons/PlayArrowOutlined';
import StopIcon from '@material-ui/icons/StopOutlined';
import ExpandLess from '@material-ui/icons/ExpandLess';

import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import { Typography } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';


import { createMuiTheme } from '@material-ui/core/styles';


import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { fade } from '@material-ui/core/styles/colorManipulator';

// import MuiThemeProvider from '@material-ui/core/MuiThemeProvider';
// import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';



const audio = new window.AudioContext();




/**
 * to do: 
 *  - 
 * 
 * 
 * 
 */

// pentatonic scale, from: http://www.angelfire.com/in2/yala/t4scales.htm
const scale = [
  830.609,
  739.989,
  622.254,
  554.365,
  466.164,
  415.305,
  369.994,
  311.127,
  277.183,
  233.082,
  207.652,
  184.997,
  155.563,
  138.591,
];


const styles = {
  Typography: {
    color: 'orange',
  },
  text: {
    color: 'orange',
  },
  sliderWrap: {
    width: 300,
  },
  slider: {
    padding: '22px 0px',
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    // ...theme.mixins.toolbar,
  },
};


const StyledSlider = withStyles({
  thumb: {
    height: 18,
    width: 18,
    backgroundColor: '#000',
    boxShadow: 'orange 0px 0px 11px 1px',
    border: '1px solid #FFA500',
    '&$focused, &:hover': {
      boxShadow: `0px 0px 0px ${8}px ${fade('#FFA500', 0.16)}`,
    },
    '&$activated': {
      boxShadow: `0px 0px 0px ${8 * 1.5}px ${fade('#FFA500', 0.16)}`,
    },
    '&$jumped': {
      boxShadow: `0px 0px 0px ${8 * 1.5}px ${fade('#FFA500', 0.16)}`,
    },
  },
  track: {
    backgroundColor: '#FFA500',
    height: 3,
  },
  trackBefore: {
    boxShadow: 'orange -7px 0px 11px 1px',
  },
  trackAfter: {
    backgroundColor: '#d0d7dc',
  },
  focused: {},
  activated: {},
  jumped: {},
})(Slider);


/*
===================================================================================================
===================================================================================================
 .d8b.  d8888b. d8888b. 
d8' `8b 88  `8D 88  `8D 
88ooo88 88oodD' 88oodD' 
88~~~88 88~~~   88~~~   
88   88 88      88      
YP   YP 88      88      
===================================================================================================
===================================================================================================                               
*/
class App extends React.Component {

  constructor(props){
    super(props);
    

    this.state = {
      rythm : createEmptyRythm(16, 12),
      curBeat: 0,
      isPlaying : false,
      amplitude : 50,
      showControls: false,
      windowHeight: undefined,
      windowWidth: undefined
    };

    this.mouseIsDown = false;

    
    this.timerId = null;
    // this.curBeat = 0;
    // this.isPlayer = false;

    this.config = {
      attack: 10,
      attackRange: [0,2000,10],
      decay: 1100,
      decayRange: [0,2000,10],
      frequency: 440,
      type: "sine",
      amplitude: .15,
      amplitudeRange: [0,.35,.01],
      modType: "sine",
      modFrequency: 22,
      modFrequencyRange: [0,200,1],
      modAmount: 7.2,
      modAmountRange: [0,600,1],
      tempo: 75,
      tempoRange: [1, 300, 1],
    };

//init 50 157
    
  }

/*
===================================================================================================
===================================================================================================
 .d8b.  d8888b. d8888b.      .88b  d88. d88888b d888888b db   db  .d88b.  d8888b. .d8888. 
d8' `8b 88  `8D 88  `8D      88'YbdP`88 88'     `~~88~~' 88   88 .8P  Y8. 88  `8D 88'  YP 
88ooo88 88oodD' 88oodD'      88  88  88 88ooooo    88    88ooo88 88    88 88   88 `8bo.   
88~~~88 88~~~   88~~~        88  88  88 88~~~~~    88    88~~~88 88    88 88   88   `Y8b. 
88   88 88      88           88  88  88 88.        88    88   88 `8b  d8' 88  .8D db   8D 
YP   YP 88      88           YP  YP  YP Y88888P    YP    YP   YP  `Y88P'  Y8888D' `8888Y'
===================================================================================================
===================================================================================================                               
*/

  setAmplitude = (v) => {
    this.config.amplitude = v;
  };



  setAttack = (v) => {
    this.config.attack = v;
  };

  setDecay = (v) => {
    this.config.decay = v;
  };

  setAmplitude = (v) => {
    this.config.amplitude = v;
  };

  setModRate = (v) => {
    this.config.modFrequency = (v * (.005*v)); // initial values grow slowly
    console.log(v);
  };

  setTempo = (v) => {
    this.config.tempo = v;
    console.log(this.config.tempo);
  };

  setModAmount = (v) => {
    this.config.modAmount = (v * (.001*v)); // initial values grow slowly
    console.log(v);
  };

  startRythm(){
    // this.timerId = setInterval(()=>{beep(),2000});
    if(!this.state.isPlaying){
      this.timerId = setTimeout(() => this.playBeat(), convertTempo(this.config.tempo));
    }
    this.setState({isPlaying:true});
    

  }



  stopRythm(){
    clearInterval(this.timerId);
    // this.setState({isPlaying:false});
    // this.curBeat = 0;
    this.setState({
      curBeat : 0,
      isPlaying: false,
    });
  }

  playBeat(){
    // console.log("curbeat");
    // console.log(this.curBeat);
    this.state.rythm[this.state.curBeat].forEach((i,e)=>{
      if(i){
        this.beep(scale[e]);
      }
    });
    if(this.state.curBeat < 15){
      let i = this.state.curBeat + 1;
      this.setState({
        curBeat: i,
      });
    }
    else{
      this.setState({
        curBeat: 0,
      });
    }

    this.timerId = setTimeout(() => this.playBeat(), convertTempo(this.config.tempo));
    
  }

  handleResize = () => this.setState({
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
  });

  /**
   * Add event listener
   */
  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize)
  }

  /**
   * Remove event listener
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  settingsToggle(){
    this.setState({
      showControls: !this.state.showControls,
    })
  }

  setBeat(col, row){
    let myRythm = this.state.rythm.slice();
    myRythm[col][row] = !this.state.rythm[col][row];
    this.setState({myRythm});
    
  };

  handleMouseDown(col,row){
    this.mouseIsDown = true;
    this.setBeat(col,row);
  }

  handleMouseUp(){
    this.mouseIsDown = false;
  }

  handleMouseEnter(col,row){
    if(this.mouseIsDown){
      this.setBeat(col,row);
    }
  }

  handleMouseOut(){
    this.mouseIsDown = false;
  }

  beep = (freq) => {
    let config = {
      attack: this.config.attack,
      decay: this.config.decay,
      frequency: freq,
      type: "sine",
      amplitude: this.config.amplitude,
      modType: "sine",
      modFrequency: this.config.modFrequency,
      modAmount: this.config.modAmount
    }

    let b = new beep(config, config.frequency);
    console.log("beeped");

  };


/*
===================================================================================================
===================================================================================================
 .d8b.  d8888b. d8888b.                  d8888b. d88888b d8b   db d8888b. d88888b d8888b. 
d8' `8b 88  `8D 88  `8D                  88  `8D 88'     888o  88 88  `8D 88'     88  `8D 
88ooo88 88oodD' 88oodD'                  88oobY' 88ooooo 88V8o 88 88   88 88ooooo 88oobY' 
88~~~88 88~~~   88~~~        C8888D      88`8b   88~~~~~ 88 V8o88 88   88 88~~~~~ 88`8b   
88   88 88      88                       88 `88. 88.     88  V888 88  .8D 88.     88 `88. 
YP   YP 88      88                       88   YD Y88888P VP   V8P Y8888D' Y88888P 88   YD 
===================================================================================================
===================================================================================================                               
*/
  render(){
    let that = this;

    const { classes } = this.props;
    //slider
    // const { amplitude } = this.state.amplitude;

    const beeps = this.state.rythm.map((col, i)=>{
      
      return (
        <div className={(Math.ceil((i + 1)/4)%2===0) ? 'beep-col even' : 'beep-col odd'} key={i}>
          {
          col.map((row, e)=>{
            let cn = (i === this.state.curBeat && this.state.isPlaying) ? 'active' : 'inactive';
            cn += (this.state.rythm[i][e] ? ' on' : ' off')
            return(
              <div className={'beep'} 
                onMouseDown={()=>that.handleMouseDown(i,e)} 
                onMouseEnter={()=>that.handleMouseEnter(i,e)}
                onMouseUp={()=>that.handleMouseUp(i,e)}
                
                key={e}
              >
                <div className={'beep-inner ' + cn} />
              </div>
            );
          })
        }
        </div>
      )
    });

/*
===================================================================================================
===================================================================================================
 .d8b.  d8888b. d8888b.                  d8888b. d88888b d888888b db    db d8888b. d8b   db 
d8' `8b 88  `8D 88  `8D                  88  `8D 88'     `~~88~~' 88    88 88  `8D 888o  88 
88ooo88 88oodD' 88oodD'                  88oobY' 88ooooo    88    88    88 88oobY' 88V8o 88 
88~~~88 88~~~   88~~~        C8888D      88`8b   88~~~~~    88    88    88 88`8b   88 V8o88 
88   88 88      88                       88 `88. 88.        88    88b  d88 88 `88. 88  V888 
YP   YP 88      88                       88   YD Y88888P    YP    ~Y8888P' 88   YD VP   V8P 
===================================================================================================
===================================================================================================                               
*/
    return (
      
      <div >
        <AppBar className={'appbar'}>
          <Toolbar className={'toolbar'} >
          <div className="playstop">
            
            <span hidden={this.state.isPlaying}>
            <PlayArrowIcon 
              onClick={()=>{this.startRythm()}} 
              
            />
            </span>
            <span hidden={!this.state.isPlaying}>
              <StopIcon 
                onClick={()=>{this.stopRythm()}} 
                
                hidden={!this.state.isPlaying}
              />
            </span>
            <span hidden={this.state.showControls}>
              <SettingsIcon 
                onClick={()=>{this.settingsToggle()}}
                
              />
            </span>
            <span hidden={!this.state.showControls}>
              <ExpandLess
                onClick={()=>{this.settingsToggle()}}
                
              />
            </span>
            
            
            
            
          </div>

          <div className={'tempo-slider'}>
          <SimpleSlider 
              name={'BPM'}
              init={75}
              handleChange={this.setTempo} 
              min={this.config.tempoRange[0]}
              max={this.config.tempoRange[1]}
              step={this.config.tempoRange[2]}              
            />
          </div>
  
          
          {/* <span onClick={()=>{this.startRythm()}}>Play</span> */}
          {/* <span onClick={()=>{this.stopRythm()}}>Stop</span> */}
          </Toolbar>

          <div className={'controls'} hidden={!this.state.showControls}>
          <div className={classes.sliderWrap + ' slider'}>
              <SimpleSlider 
                name={'amplitude'}
                init={this.config.amplitude}
                handleChange={this.setAmplitude} 
                min={0}
                max={this.config.amplitudeRange[1]}
                step={this.config.amplitudeRange[2]}
              />

            <SimpleSlider 
              name={'attack'}
              init={this.config.attack}
              handleChange={this.setAttack} 
              min={0}
              max={this.config.attackRange[1]}
              step={this.config.attackRange[2]}
            />

            <SimpleSlider 
              name={'decay'}
              init={this.config.decay}
              handleChange={this.setDecay} 
              min={0}
              
              max={this.config.decayRange[1]}
              step={this.config.decayRange[2]}
            />

            <SimpleSlider 
              name={'modulation amount'}
              init={131}
              handleChange={this.setModAmount} 
              min={0}
              max={this.config.modAmountRange[1]}
              step={this.config.modAmountRange[2]}
            />

            <SimpleSlider 
              name={'modulation rate'}
              init={50}
              handleChange={this.setModRate} 
              min={0}
              max={this.config.modFrequencyRange[1]}
              step={this.config.modFrequencyRange[2]}
            />

            
          </div>
        </div>

        </AppBar>

        


        <main className={'main'} >
          {beeps}
        </main>
        <p className={'ptest'}>
          {this.state.windowWidth} x {this.state.windowHeight}
        </p>
        

      </div>
      
    );
  }
    
  
}

/*
===================================================================================================
===================================================================================================
.d8888. d888888b .88b  d88. d8888b. db      d88888b      .d8888. db      d888888b d8888b. d88888b d8888b. 
88'  YP   `88'   88'YbdP`88 88  `8D 88      88'          88'  YP 88        `88'   88  `8D 88'     88  `8D 
`8bo.      88    88  88  88 88oodD' 88      88ooooo      `8bo.   88         88    88   88 88ooooo 88oobY' 
  `Y8b.    88    88  88  88 88~~~   88      88~~~~~        `Y8b. 88         88    88   88 88~~~~~ 88`8b   
db   8D   .88.   88  88  88 88      88booo. 88.          db   8D 88booo.   .88.   88  .8D 88.     88 `88. 
`8888Y' Y888888P YP  YP  YP 88      Y88888P Y88888P      `8888Y' Y88888P Y888888P Y8888D' Y88888P 88   YD 
===================================================================================================
===================================================================================================                               
*/
class SimpleSlider extends React.Component{

  state = {
    value: this.props.init,
  };

  handleChange = (event, value) => {
    this.setState({ value });
    this.props.handleChange(value);
  };

  render() {
    // const { classes } = this.props;
    const { value } = this.state;

    return (
        <div>
            <Typography>{this.props.name}</Typography>
          <StyledSlider
            className = {"slider"}
            value={value}
            min={this.props.min}
            max={this.props.max}
            step={this.props.step}
            onChange={this.handleChange}
          />
        </div>
      
    );
  }

}



/*
===================================================================================================
===================================================================================================
d8888b. d88888b d88888b d8888b. 
88  `8D 88'     88'     88  `8D 
88oooY' 88ooooo 88ooooo 88oodD' 
88~~~b. 88~~~~~ 88~~~~~ 88~~~   
88   8D 88.     88.     88      
Y8888P' Y88888P Y88888P 88                                
===================================================================================================
===================================================================================================*/
/** 
 * makes a beep sound
 * 
 * config object has the following: 
 * attack, decay, frequency, type
 * 
 * @param {*} config - settings for this track
 * @param {*} freq - frequency adjustment for this beat
 */

function beep(config, freq) {
  var attack = config.attack,
      decay = config.decay,
      gain = audio.createGain(),
      osc = audio.createOscillator(),
      maxGain = config.amplitude,
      modAmount  = config.modAmount;

  gain.connect(audio.destination);
  gain.gain.setValueAtTime(0, audio.currentTime);
  gain.gain.linearRampToValueAtTime(maxGain, audio.currentTime + attack / 1000);
  gain.gain.linearRampToValueAtTime(0, audio.currentTime + decay / 1000);

  // console.log("config: " + config.frequency + ", freq: " + freq);
  osc.frequency.value = config.frequency + freq;
  osc.type = config.type;
  osc.connect(gain);
  osc.start(0);

  if (config.modType !== 'none'){
      var gain2 = audio.createGain();
      gain2.gain.value = modAmount;
      gain2.connect(osc.frequency);
      var osc2 = audio.createOscillator();
      osc2.type = config.modType;
      osc2.frequency.value = config.modFrequency;
      osc2.connect(gain2);
      osc2.start(0);

  }

  setTimeout(function() {
      osc.stop(0);
      osc.disconnect(gain);
      gain.disconnect(audio.destination);
      if (config.modType !== 'none'){
          osc2.stop(0);
          gain2.disconnect(osc.frequency);
      }
  }, decay);
}



App.propTypes = {
  classes: PropTypes.object.isRequired,
};


/*
===================================================================================================
===================================================================================================
db    db d888888b d888888b db      .d8888. 
88    88 `~~88~~'   `88'   88      88'  YP 
88    88    88       88    88      `8bo.   
88    88    88       88    88        `Y8b. 
88b  d88    88      .88.   88booo. db   8D 
~Y8888P'    YP    Y888888P Y88888P `8888Y' 
===================================================================================================
===================================================================================================                               
*/

/**
 * Creates an empty 2 dimensional array representing the rythm
 * In the UI, beats are the columns, notes the rows
 */
function createEmptyRythm(numberBeats, numberNotes){
  let arr = []
  for(let i = 0; i < numberBeats; i++){
    let column = [];
    for(let e = 0; e < numberNotes; e++){
      column.push(false);
    }
    arr.push(column);
  }
  return arr;
}

function calculateModFrequency(v){
  return (v * (.001*v));
}
function calculateModAmount(v){
  return (v * (.001*v));
}

function convertTempo(t){
  return 15000/t;
}

export default withStyles(styles)(App);