import React from 'react';
import './App.css';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import { Typography } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


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
  sliderWrap: {
    width: 300,
  },
  slider: {
    padding: '22px 0px',
  },
};

class App extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      rythm : [
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false],

      ],
      curBeat: 0,
      isPlaying : false,
      amplitude : 50,
    };

    

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
      amplitude: .5,
      amplitudeRange: [0,.8,.01],
      modType: "sine",
      modFrequency: 30,
      modFrequencyRange: [0,200,1],
      modAmount: 50,
      modAmountRange: [0,600,1],
    };


    
  }



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
  };

  setModAmount = (v) => {
    this.config.modAmount = (v * (.001*v)); // initial values grow slowly
    console.log(this.config.modAmount);
  };

  startRythm(){
    // this.timerId = setInterval(()=>{beep(),2000});
    if(!this.state.isPlaying){
      this.timerId = setInterval(() => this.playBeat(), 200);
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
        // console.log("scale: ");
        // console.log(scale[e]);
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
    
  }

  setBeat(col, row){
    let myRythm = this.state.rythm.slice();
    myRythm[col][row] = !this.state.rythm[col][row];
    this.setState({myRythm});
  };

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

  render(){
    let that = this;

    const { classes } = this.props;
    //slider
    // const { amplitude } = this.state.amplitude;

    const beeps = this.state.rythm.map((col, i)=>{
      return (
        <div className={'beep-col'} key={i}>
          {
          col.map((row, e)=>{
            let cn = (i === this.state.curBeat && this.state.isPlaying) ? 'active' : 'inactive';
            return(
              <div className={'beep ' + cn} onClick={()=>that.setBeat(i,e)} key={e}>
                <Typography>{this.state.rythm[i][e] ? 'X' : 'O'}</Typography>
                
              </div>
            );
          })
        }
        </div>
      )
    });

    
    return (
      
      <div>
        <div>
          <PlayArrowIcon onClick={()=>{this.startRythm()}}/>
          <StopIcon onClick={()=>{this.stopRythm()}}/>
          {/* <span onClick={()=>{this.startRythm()}}>Play</span> */}
          {/* <span onClick={()=>{this.stopRythm()}}>Stop</span> */}
        </div>
        
        {beeps}
        <div className={'controls'}>
          <div className={classes.sliderWrap + ' slider'}>
            <Typography>amplitude</Typography>
            <SimpleSlider 
              init={this.config.amplitude}
              handleChange={this.setAmplitude} 
              min={0}
              max={this.config.amplitudeRange[1]}
              step={this.config.amplitudeRange[2]}
            />

            <Typography>attack</Typography>
            <SimpleSlider 
              init={this.config.attack}
              handleChange={this.setAttack} 
              min={0}
              max={this.config.attackRange[1]}
              step={this.config.attackRange[2]}
            />

            <Typography>decay</Typography>
            <SimpleSlider 
              init={this.config.decay}
              handleChange={this.setDecay} 
              min={0}
              
              max={this.config.decayRange[1]}
              step={this.config.decayRange[2]}
            />

            <Typography>modulation amount</Typography>
            <SimpleSlider 
              init={this.config.modAmount}
              handleChange={this.setModAmount} 
              min={0}
              max={this.config.modAmountRange[1]}
              step={this.config.modAmountRange[2]}
            />

            <Typography>modulation rate</Typography>
            <SimpleSlider 
              init={this.config.modFrequency}
              handleChange={this.setModRate} 
              min={0}
              max={this.config.modFrequencyRange[1]}
              step={this.config.modFrequencyRange[2]}
            />      
          </div>
        </div>

      </div>
      
    );
  }
    
  
}

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
    
        <Slider
          className = {"slider"}
          value={value}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          onChange={this.handleChange}
        />
      
    );
  }

}





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

export default withStyles(styles)(App);