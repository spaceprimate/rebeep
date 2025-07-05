import React from 'react';

class Chaos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      top: 0,
      left: 0,
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





  render() {

    let that = this;
    return (
      <>
        <div style={{ color: 'red' }}>
          {that.top !== undefined ? that.top.toString() : 'bob'}, {this.left}
          {this.state.top.toString() + ", " + this.state.left.toString()}
        </div>

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