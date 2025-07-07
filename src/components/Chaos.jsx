import { Checkbox, FormControl, Icon, Input, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import React from 'react';

class Chaos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      top: 0,
      left: 0,
      selectedX: [],
      selectedY: [],
      showSelectX: false,
      showSelectY: false,
    };

    this.mouseDown = false;


  }





  _onMouseDown(e) {
    window.mouseDown = true;
    this.setState({ top: e.nativeEvent.offsetY, left: e.nativeEvent.offsetX });
    console.log('------------ mouse down called')
  }
  _onMouseUp(e) {
    console.log('------------ mouse up called')
    window.mouseDown = false;
  }
  _onMouseOut(e) {
    this.mouseDown = false;
  }





  _onMouseMove(e) {
    // this.setState({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });

    console.log(window.mouseDown)
    if (window.mouseDown) {
      // console.log(e.nativeEvent.offsetX);

      this.props.setChaos(e.nativeEvent.offsetX, (-1 * (e.nativeEvent.offsetY - 255)));
      this.setState({ top: e.nativeEvent.offsetY, left: e.nativeEvent.offsetX });






      // this.top = e.nativeEvent.offsetY;
      // this.left = e.nativeEvent.offsetX;
      // console.log(e.nativeEvent)
    }
    // else{
    //   console.log("mouse is not down")
    // }

  }

  pointStyle = {

  };



  handleChange2 = (event) => {
    console.log('handleChange called', event.target.value);
    const { target: { value }, } = event;
    // On autofill we get a stringified value.  
    const valueArray = typeof value === 'string' ? value.split(',') : value;

    console.log('valueArray: ' + valueArray);

    this.setState({
      selectedX: valueArray,
    });

    console.log('selectedX: ' + this.state.selectedX);
  };



  handleChange = (event) => {
    console.log('handleChange called', event.target.value);
    const { target: { value }, } = event;
    // On autofill we get a stringified value.  
    const valueArray = typeof value === 'string' ? value.split(',') : value;

    console.log('valueArray: ' + valueArray);

    this.setState({
      selectedX: valueArray,
    });

    console.log('selectedX: ' + this.state.selectedX);
  };











  render() {

    let that = this;

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };

    const optionsX = [
      { id: 'modAmount', name: 'Mod Amount' },
      { id: 'modFrequency', name: 'Mod Frequency' },
    ];

    const optionsY = [
      { id: 'modAmount', name: 'Mod Amount' },
      { id: 'modFrequency', name: 'Mod Frequency' },
    ];



    // const selectX = (
    //   <FormControl sx={{ m: 1, width: 300 }} className='chaos-select choas-select-x'>
    //     <InputLabel id="select-x"><MoreHoriz /></InputLabel>
    //     <Select
    //       id="select-x"
    //       multiple
    //       value={this.state.selectedX}
    //       onChange={this.handleChange}
    //       input={<Input label="Tag" />}
    //       renderValue={(selectedX) => selectedX.join(', ')}
    //       MenuProps={MenuProps}
    //     >
    //       {optionsX.map((name) => (
    //         <MenuItem key={name.id} value={name.id}>
    //           <Checkbox checked={this.state.selectedX.includes(name.id)} />
    //           <ListItemText primary={name.name} />
    //         </MenuItem>
    //       ))}
    //     </Select>
    //   </FormControl>
    // )

    const selectX = (
      <>
      <button
        className='select-x-button'
        onClick={() => this.setState({ showSelectX: !this.state.showSelectX })}
      >
        <MoreHoriz />
      </button>
      {this.state.showSelectX && (
        <div className='select-x-container' visible={this.state.showSelectX}>
        {optionsX.map((name) => (
          <MenuItem key={name.id} value={name.id}>
          <Checkbox checked={this.state.selectedX.includes(name.id)} />
          <ListItemText primary={name.name} />
          </MenuItem>
        ))}
        </div>
      )}
      </>
    )


    return (
      <>
        <div style={{ color: 'red' }}>
          {that.top !== undefined ? that.top.toString() : 'bob'}, {this.left}
          {this.state.top.toString() + ", " + this.state.left.toString()}
        </div>




        {selectX}

        <hr />
        asdf


        <hr />




        <div className="chaos-pad"
          onMouseMove={this._onMouseMove.bind(this)}
          onMouseDown={this._onMouseDown.bind(this)}
          onMouseUp={this._onMouseUp.bind(this)}
          onMouseOut={this._onMouseOut.bind(this)}
        >
          <div className="chaos-point" style={{ top: `${this.state.top}px`, left: `${this.state.left}px` }}></div>

        </div>
      </>

    );
  }


}

export default Chaos;