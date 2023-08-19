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

const audio = new window.AudioContext();

function randomConfig(config) {
  /* settings: 
  amplitude: 0.15
  attack: 10
  decay: 1100
  frequency: 415.305
  modAmount: 7.2
  modFrequency: 22
  modType: "sine"
  waveType: "sine"


  this.config = {
    attack: 10,
    attackRange: [0,2000,10],
    decay: 1100,
    decayRange: [0,2000,10],
    frequency: 440,
    waveType: "sine",
    types: ["sine", "square", "sawtooth", "triangle"],
    amplitude: .15,
    amplitudeRange: [0,.35,.01],
    modType: "sine",
    modTypes: ["sine", "square", "sawtooth", "triangle"],
    modFrequency: 22,
    modFrequencyRange: [0,200,1],
    modAmount: 7.2,
    modAmountRange: [0,600,1],
    tempo: 75,
    tempoRange: [1, 300, 1],
  };

  attack: 0 - 2000
  */

  /*

  random algorithm: 
  minRange, maxRange, probability, amount, value
  random1 = random between 0 and 1
  if probability > random1
    sign: either -1 or 1
    amount = amount * ((maxRange - minRange) / 2) * sign
    value = value + amount
    value = value > maxRange ? maxRange : value
    value = value < minRange ? minRange : value

  return value



  */


  console.log(config.chaos)

  // random number between 0 and 1
  const r1 = Math.random()
  const prob = config.chaos[0]
  if (prob > r1) {

    // -1 or 1
    const sign = Math.random() > 0.5 ? 1 : -1

    const min = config.modFrequencyRange[0]
    const max = config.modFrequencyRange[1]

    let amount = config.chaos[1]
    amount = amount * ((max - min) / 2) * sign
    let value = config.modFrequency + amount
    value = value > max ? max : value
    value = value < min ? min : value
    config.modFrequency = value


  }





  // let randNum = (Math.random() * 2) - 1; // random between -1,1
  // let scalar = 0.5;
  // // let modFrequency = config.modFrequency * (1 + randNum*scalar);
  // config.modFrequency = config.modFrequency + 200 * (randNum * scalar);
  // console.log(config);
  return config;
}

/** 
 * makes a beep sound
 * 
 * config object has the following: 
 * attack, decay, frequency, type
 * 
 * @param {*} config - settings for this track
 * @param {*} freq - frequency adjustment for this beat
 * @param {boolean} keyboard - if this value isn't undefined and is true, this
 *                  beep will be sustained until kill is called on it.
 */

export class Beep {
  constructor(config, freq, keyboard) {
    // var keyboard = false;
    config = randomConfig(config);


    var attack = config.attack, decay = config.decay, gain = audio.createGain(), osc = audio.createOscillator(),
      // biquadFilter = audio.createBiquadFilter(),
      maxGain = config.amplitude, modAmount = config.modAmount, isKeyboard = false;

    if (keyboard !== undefined && keyboard) {
      // decay = 1000000;
      // console.log("config.decay");
      // console.log(config.decay);
      isKeyboard = true;
    }

    // biquadFilter.connect(gain);
    gain.connect(audio.destination);
    gain.gain.setValueAtTime(0, audio.currentTime);
    gain.gain.linearRampToValueAtTime(maxGain, audio.currentTime + attack / 1000);

    // only implement decay for beats, not keys. Keys are handled below
    if (keyboard === undefined || !keyboard) {
      gain.gain.linearRampToValueAtTime(0, audio.currentTime + decay / 1000);
    }


    // biquadFilter.type = "lowshelf";
    // biquadFilter.frequency.setValueAtTime(5000, audio.currentTime);
    // biquadFilter.gain.setValueAtTime(100, audio.currentTime);
    // console.log("config: " + config.frequency + ", freq: " + freq);
    osc.frequency.value = freq;
    osc.type = config.waveType;
    // console.log(osc.type);
    osc.connect(gain);
    osc.start(0);

    if (config.modType !== 'none') {
      var gain2 = audio.createGain();
      gain2.gain.value = modAmount;
      gain2.connect(osc.frequency);
      var osc2 = audio.createOscillator();
      osc2.type = config.modType;
      osc2.frequency.value = config.modFrequency;
      osc2.connect(gain2);
      osc2.start(0);

    }
    if (!isKeyboard) {
      setTimeout(function () {
        osc.stop(0);
        osc.disconnect(gain);
        gain.disconnect(audio.destination);
        if (config.modType !== 'none') {
          osc2.stop(0);
          gain2.disconnect(osc.frequency);
        }
      }, decay);
    }


    this.kill = () => {
      osc.stop(0);
      osc.disconnect(gain);
      gain.disconnect(audio.destination);
      if (config.modType !== 'none') {
        osc2.stop(0);
        gain2.disconnect(osc.frequency);
      }
      // console.log("kill called");
    };

    this.fadeOut = () => {
      gain.gain.linearRampToValueAtTime(0, audio.currentTime + config.decay / 1000);
      setTimeout(this.kill, config.decay);
      // gain.gain.linearRampToValueAtTime(0, audio.currentTime + decay / 1000);
    };


  }
}