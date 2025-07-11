import React from 'react';
import './App.css';
import PlayArrowIcon from '@material-ui/icons/PlayArrowOutlined';
import StopIcon from '@material-ui/icons/StopOutlined';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import ClearIcon from '@material-ui/icons/Clear';
import Slider from '@material-ui/lab/Slider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import KeyHandler, { KEYUP, KEYDOWN } from 'react-key-handler';
import { Beep } from './Beep';
import Chaos from './components/Chaos';


// pentatonic scale, from: http://www.angelfire.com/in2/yala/t4scales.htm
const scale = [
  932.33,
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
  116.54
];

const keyboardMapping = [
  'p',
  'o',
  'i',
  'u',
  ';',
  'l',
  'k',
  'j',
  'r',
  'e',
  'w',
  'q',
  'f',
  'd',
  's',
  'a'
];


// const scale = [
//   200.0,
//   200.0,
//   200.0,
//   200.0,
//   200.0,
//   200.0,
//   200.0,
//   200.0,
//   200.0,
//   200.0,
//   200.0,
//   200.0,
//   200.0,
//   200.0,
// ];


const styles = {
  body: {
    font: 'IBM Plex Mono'
  },
  Typography: {
    color: 'orange',
    fontFamily: 'IBM Plex Mono'
  },
  text: {
    color: 'orange',
  },
  sliderWrap: {
    width: 250,
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

/*
===================================================================================================
===================================================================================================
.d8888. d888888b db    db db      d88888b .d8888. 
88'  YP `~~88~~' `8b  d8' 88      88'     88'  YP 
`8bo.      88     `8bd8'  88      88ooooo `8bo.   
  `Y8b.    88       88    88      88~~~~~   `Y8b. 
db   8D    88       88    88booo. 88.     db   8D 
`8888Y'    YP       YP    Y88888P Y88888P `8888Y' 
===================================================================================================
===================================================================================================                               
*/
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

  constructor(props) {
    super(props);


    this.state = {
      rhythm: createEmptyRhythm(16, 16),
      curBeat: 0,
      isPlaying: false,
      amplitude: 50,
      showControls: false,
      windowHeight: undefined,
      windowWidth: undefined,
      mainWidth: undefined,
      tick: true
    };

    this.mouseIsDown = false;

    this.timerId = null;
    // this.curBeat = 0;
    // this.isPlayer = false;

    this.config = {
      attack: 10,
      attackRange: [0, 2000, 10],
      decay: 1100,
      decayRange: [0, 2000, 10],
      frequency: 440,
      waveType: "sine",
      types: ["sine", "square", "sawtooth", "triangle"],
      amplitude: .15,
      amplitudeRange: [0, .35, .01],
      modType: "sine",
      modTypes: ["sine", "square", "sawtooth", "triangle"],
      modFrequency: 22,
      modFrequencyRange: [0, 200, 1],
      modAmount: 7.2,
      modAmountRange: [0, 600, 1],
      tempo: 75,
      chaos: [0.25, 0.25],
      tempoRange: [1, 300, 1],
    };

    this.configKeys = {
      attack: 10,
      attackRange: [0, 2000, 10],
      decay: 1100,
      decayRange: [0, 2000, 10],
      frequency: 440,
      waveType: "sine",
      types: ["sine", "square", "sawtooth", "triangle"],
      amplitude: .15,
      amplitudeRange: [0, .35, .01],
      modType: "sine",
      modTypes: ["sine", "square", "sawtooth", "triangle"],
      modFrequency: 22,
      modFrequencyRange: [0, 200, 1],
      modAmount: 7.2,
      modAmountRange: [0, 600, 1],
      tempo: 75,
      chaos: [0.25, 0.25],
      tempoRange: [1, 300, 1],
    };



    //init 50 157a

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

  setOsc1 = (v) => {
    this.config.waveType = v.target.name;
    this.tock();
  };

  setMod1 = (v) => {
    this.config.modType = v.target.name;
    this.tock();
  };

  //arbitrarily updates state
  tock = () => {
    this.setState({ tick: !this.state.tick });
  };


  setAmplitude = (v) => {
    this.config.amplitude = v;
  };

  setModRate = (v) => {
    this.config.modFrequency = (v * (.005 * v)); // initial values grow slowly
    // console.log(v);
  };

  setTempo = (v) => {
    this.config.tempo = v;
    // console.log(this.config.tempo);
  };

  setModAmount = (v) => {
    this.config.modAmount = (v * (.001 * v)); // initial values grow slowly
    // console.log(v);
  };

  //todo: eventually this should have such redundant code:
  setKeysKeysAmplitude = (v) => {
    this.configKeys.amplitude = v;
  };



  setKeysAttack = (v) => {
    this.configKeys.attack = v;
  };

  setKeysDecay = (v) => {
    this.configKeys.decay = v;
  };

  setKeysOsc1 = (v) => {
    this.configKeys.waveType = v.target.name;
    this.tock();
  };

  setKeysMod1 = (v) => {
    this.configKeys.modType = v.target.name;
    this.tock();
  };

  setKeysAmplitude = (v) => {
    this.configKeys.amplitude = v;
  };

  setKeysModRate = (v) => {
    this.configKeys.modFrequency = (v * (.005 * v)); // initial values grow slowly
    // console.log(v);
  };

  setKeysTempo = (v) => {
    this.configKeys.tempo = v;
    // console.log(this.config.tempo);
  };

  setKeysModAmount = (v) => {
    this.configKeys.modAmount = (v * (.001 * v)); // initial values grow slowly
    // console.log(v);
  };

  setChaos = (x, y) => {

    // assume max of 256
    x = x / 256;
    y = y / 256;
    this.config.chaos = [x, y];
    this.configKeys.chaos = [x, y];
  }

  startRhythm() {
    // this.timerId = setInterval(()=>{beep(),2000});
    if (!this.state.isPlaying) {
      this.timerId = setTimeout(() => this.playBeat(), convertTempo(this.config.tempo));
    }
    this.setState({ isPlaying: true });
  }

  stopRhythm() {
    clearInterval(this.timerId);
    // this.setState({isPlaying:false});
    // this.curBeat = 0;
    this.setState({
      curBeat: 0,
      isPlaying: false,
    });
  }

  playBeat() {
    // console.log("curbeat");
    // console.log(this.curBeat);
    this.state.rhythm[this.state.curBeat].forEach((i, e) => {
      if (i) {
        this.beep(scale[e]);
      }
    });
    if (this.state.curBeat < 15) {
      let i = this.state.curBeat + 1;
      this.setState({
        curBeat: i,
      });
    }
    else {
      this.setState({
        curBeat: 0,
      });
    }

    this.timerId = setTimeout(() => this.playBeat(), convertTempo(this.config.tempo));

  }

  handleResize = () => {
    let mainWidth = window.innerWidth;
    if (this.state.showControls) {
      mainWidth -= 250;
    }
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      mainWidth: mainWidth,
    })
  };

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

  settingsToggle() {
    this.setState({
      showControls: !this.state.showControls,
    })
  }

  setBeat(col, row) {
    let myRhythm = this.state.rhythm.slice();
    myRhythm[col][row] = !this.state.rhythm[col][row];
    this.setState({ myRhythm });

  };

  handleMouseDown(col, row) {
    this.mouseIsDown = true;
    this.setBeat(col, row);
  }

  handleMouseUp() {
    this.mouseIsDown = false;
  }

  handleMouseEnter(col, row) {
    if (this.mouseIsDown) {
      this.setBeat(col, row);
    }
  }

  handleMouseOut() {
    this.mouseIsDown = false;
  }

  beep = (freq) => {
    let config = {
      attack: this.config.attack,
      decay: this.config.decay,
      frequency: freq,
      waveType: this.config.waveType,
      amplitude: this.config.amplitude,
      modType: this.config.modType,
      modFrequency: this.config.modFrequency,
      modFrequencyRange: this.config.modFrequencyRange,
      modAmountRange: this.config.modAmountRange,
      modAmount: this.config.modAmount,
      chaos: this.config.chaos,
    }

    let b = new Beep(config, config.frequency);
    // console.log("beeped");

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
  render() {
    let that = this;

    const { classes } = this.props;
    //slider
    // const { amplitude } = this.state.amplitude;

    //handle open/closed state for controls and main sections
    const controlsClassName = (() => {
      let classname = (this.state.showControls ? 'open ' : 'closed ');
      classname += 'controls';
      return classname;
    })();

    const mainClassName = (() => {
      let classname = (this.state.showControls ? 'show-controls ' : '');
      classname += 'main';
      return classname;
    })();

    const keyClassName = (() => {
      let classname = (this.state.showControls ? 'show-controls ' : '');
      classname += 'main';
      return classname;
    })();

    const beepSize = ((this.state.windowWidth / 16) - 2).toString() + 'px';
    // console.log("beep size was rendered");

    const beeps = this.state.rhythm.map((col, i) => {

      return (
        <div className={(Math.ceil((i + 1) / 4) % 2 === 0) ? 'beep-col even' : 'beep-col odd'} key={i} >
          {/*<div className={(Math.ceil((i + 1)/4)%2===0) ? 'beep-col even' : 'beep-col odd'} key={i} style={{width: beepSize  }}>*/}
          {
            col.map((row, e) => {
              let cn = (i === this.state.curBeat && this.state.isPlaying) ? 'active' : 'inactive';
              cn += (this.state.rhythm[i][e] ? ' on' : ' off')
              return (
                <div className={'beep'}
                  onMouseDown={() => that.handleMouseDown(i, e)}
                  onMouseEnter={() => that.handleMouseEnter(i, e)}
                  onMouseUp={() => that.handleMouseUp(i, e)}

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

              <span hidden={this.state.isPlaying} className={'play-icon icon'}>
                <PlayArrowIcon
                  onClick={() => { this.startRhythm() }}

                />
              </span>
              <span hidden={!this.state.isPlaying} className={'stop-icon icon'}>
                <StopIcon
                  onClick={() => { this.stopRhythm() }}

                  hidden={!this.state.isPlaying}
                />
              </span>
              <span className={'settings-icon icon'}>
                <SettingsIcon
                  onClick={() => { this.settingsToggle() }}
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

          </Toolbar>

        </AppBar>

        <div className={controlsClassName}>
          <div className={'toolbar'}>
            <ClearIcon className={'pull-right'}
              onClick={() => { this.settingsToggle() }}

            />
          </div>

          <Controls
            classes={classes}
            config={this.config}
            setAmplitude={this.setAmplitude}
            setAttack={this.setAttack}
            setDecay={this.setDecay}
            setModAmount={this.setModAmount}
            setOsc1={this.setOsc1}
            setMod1={this.setMod1}
            setModRate={this.setModRate}
            title='grid'
          />

          <Controls
            classes={classes}
            config={this.configKeys}
            setAmplitude={this.setKeysAmplitude}
            setAttack={this.setKeysAttack}
            setDecay={this.setKeysDecay}
            setModAmount={this.setKeysModAmount}
            setOsc1={this.setKeysOsc1}
            setMod1={this.setKeysMod1}
            setModRate={this.setKeysModRate}
            title='keyboard'
          />
          
          <Chaos setChaos={this.setChaos} />
        </div>

        <main className={mainClassName}>
          {beeps}
        </main>
        <p className={'ptest'}>
          {this.state.windowWidth} x {this.state.windowHeight}
        </p>

        <div id={"keyboard-wrapper"} className={this.state.showControls ? 'show-controls ' : ''}>
          <Keyboard
            config={this.configKeys}
          />
        </div>

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
class SimpleSlider extends React.Component {

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
        <p className={"slider-label"}>{this.props.name}</p>
        <StyledSlider
          className={"slider"}
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




/* ----------------------------------------------------------------------------------------------------------------------
_        _______           _______ 
| \    /\(  ____ \|\     /|(  ____ \
|  \  / /| (    \/( \   / )| (    \/
|  (_/ / | (__     \ (_) / | (_____ 
|   _ (  |  __)     \   /  (_____  )
|  ( \ \ | (         ) (         ) |
|  /  \ \| (____/\   | |   /\____) |
|_/    \/(_______/   \_/   \_______)
/* ---------------------------------------------------------------------------------------------------------------------- */

class Key extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.handleDown = this.handleDown.bind(this);
    this.handleUp = this.handleUp.bind(this);
    this.handleOut = this.handleOut.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.beep = undefined;
  }


  handleDown() {
    if (!this.state.active) {
      let config = JSON.parse(JSON.stringify(this.props.config));
      config.freq = scale[this.props.freq];
      this.beep = new Beep(config, scale[this.props.freq], true);
      this.setState({ active: true });
    }
  }

  handleUp() {
    if (this.state.active) {
      // this.beep.kill();
      this.beep.fadeOut();
      this.setState({ active: false });
    }
  }

  handleOut() {
    if (this.state.active) {
      this.beep.fadeOut();
      this.setState({ active: false });
    }
  }

  handleEnter() {
    if (!this.state.active && mouseDown) {
      this.beep = new Beep(this.props.config, this.props.freq, true);
      this.setState({ active: true });
    }

  }

  render() {
    return (
      <>
        <KeyHandler
          keyEventName={KEYDOWN}
          keyValue={keyboardMapping[this.props.freq]}
          onKeyHandle={this.handleDown}
        />
        <KeyHandler
          keyEventName={KEYUP}
          keyValue={keyboardMapping[this.props.freq]}
          onKeyHandle={this.handleUp}
        />
        <div className={"beep key beep-col"}
          onMouseDown={this.handleDown} onMouseUp={this.handleUp} onMouseLeave={this.handleOut} onMouseEnter={this.handleEnter}
        >
          <div className={this.state.active ? "beep-inner active" : "beep-inner"}>
            <div className={"key-label"}>{keyboardMapping[this.props.freq]}</div>
          </div>

        </div>
      </>
    );
  }


}

class Keyboard extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id={"keyboard"}>
        <Key config={this.props.config} freq={15} />
        <Key config={this.props.config} freq={14} />
        <Key config={this.props.config} freq={13} />
        <Key config={this.props.config} freq={12} />
        <Key config={this.props.config} freq={11} />
        <Key config={this.props.config} freq={10} />
        <Key config={this.props.config} freq={9} />
        <Key config={this.props.config} freq={8} />
        <Key config={this.props.config} freq={7} />
        <Key config={this.props.config} freq={6} />
        <Key config={this.props.config} freq={5} />
        <Key config={this.props.config} freq={4} />
        <Key config={this.props.config} freq={3} />
        <Key config={this.props.config} freq={2} />
        <Key config={this.props.config} freq={1} />
        <Key config={this.props.config} freq={0} />
      </div>
    );
  }
}


// Defines a slider control
class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  toggleCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    let osc1 = this.props.config.types.map((t) => {
      return (
        <li onClick={this.props.setOsc1} className={this.props.config.waveType === t ? 'active' : 'inactive'}>
          <img src={"images/icon-" + t + ".png"} name={t} />
        </li>
      );
    });
    let mod1 = this.props.config.types.map((t) => {
      return (
        <li onClick={this.props.setMod1} className={this.props.config.modType === t ? 'active' : 'inactive'}>
          <img src={"images/icon-" + t + ".png"} name={t} />
        </li>
      );
    });

    return (
      <div className={this.props.classes.sliderWrap + ' slider controls-wrapper ' + (this.state.collapsed ? 'collapsed' : '')}>
        <div className={'controls-title'}>
          {this.props.title}
          <div className='fix-right' onClick={this.toggleCollapse}>
            {this.state.collapsed ? <ExpandMore /> : <ExpandLess />}
          </div>
        </div>
        <p className={'slider-label'}>waveform</p>
        <ul className={'wave-buttons'}>
          {osc1}
        </ul>


        <SimpleSlider
          name={'amplitude'}
          init={this.props.config.amplitude}
          handleChange={this.props.setAmplitude}
          min={0}
          max={this.props.config.amplitudeRange[1]}
          step={this.props.config.amplitudeRange[2]}
        />

        <SimpleSlider
          name={'attack'}
          init={this.props.config.attack}
          handleChange={this.props.setAttack}
          min={0}
          max={this.props.config.attackRange[1]}
          step={this.props.config.attackRange[2]}
        />

        <SimpleSlider
          name={'decay'}
          init={this.props.config.decay}
          handleChange={this.props.setDecay}
          min={0}

          max={this.props.config.decayRange[1]}
          step={this.props.config.decayRange[2]}
        />
        <p className={'slider-label'}>modulation waveform</p>
        <ul className={'wave-buttons'}>
          {mod1}
        </ul>


        <SimpleSlider
          name={'modulation amount'}
          init={131}
          handleChange={this.props.setModAmount}
          min={0}
          max={this.props.config.modAmountRange[1]}
          step={this.props.config.modAmountRange[2]}
        />

        <SimpleSlider
          name={'modulation rate'}
          init={50}
          handleChange={this.props.setModRate}
          min={0}
          max={this.props.config.modFrequencyRange[1]}
          step={this.props.config.modFrequencyRange[2]}
        />

      </div>
    );
  }
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
 * Creates an empty 2 dimensional array representing the rhythm
 * In the UI, beats are the columns, notes the rows
 */
function createEmptyRhythm(numberBeats, numberNotes) {
  let arr = []
  for (let i = 0; i < numberBeats; i++) {
    let column = [];
    for (let e = 0; e < numberNotes; e++) {
      column.push(false);
    }
    arr.push(column);
  }
  return arr;
}

function calculateModFrequency(v) {
  return (v * (.001 * v));
}
function calculateModAmount(v) {
  return (v * (.001 * v));
}

function convertTempo(t) {
  return 15000 / t;
}

export default withStyles(styles)(App);



let mouseDown = false;
document.body.onmousedown = function () {
  mouseDown = true;
  // console.log(mouseDown);
};
document.body.onmouseup = function () {
  mouseDown = false;
  // console.log(mouseDown);
};