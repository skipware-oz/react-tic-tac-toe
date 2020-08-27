import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import { render } from '@testing-library/react';

// class Square extends React.Component {
//   // constructor(props) {
//   //   super(props);
//   //   this.state={
//   //     value:null,
//   //   };
//   // }
  
//   render() {
//     return (
//       <button className="square" 
//         // onClick={() => this.setState({value: 'X'})}  // setState causes React to re-render and update child components as well
//         onClick={() => this.props.onClick()}
//       >
//       {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state={
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   }
  // }
  // handleClick(i){  // move to Games component
  //   const squares=this.state.squares.slice(); // create a copy of squares
  //   if (calculateWinner(squares) || squares[i] ) return;
  //   squares[i]=this.state.xIsNext ? 'X':'O';
  //   this.setState({
  //     squares: squares, 
  //     xIsNext: !this.state.xIsNext
  //   }); // setState will rerender the children Squares. (controlled component)
  // }
  renderSquare(i) {
    return <Square 
              value={this.props.squares[i]} 
              // onClick={() => this.handleClick(i)}  // this points Square class back to Board class handleClick()
              onClick={() => this.props.onClick(i)}  // this points Square class back to Game class handleClick()
            />;
  }

  render() {
    /* moved to Game component:
    const winner = calculateWinner(this.state.squares)
    let status ;
    if (winner){
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X':'O');
    }
    */

    return (
      <div>
        {/* This is how you add comments into html in JSX */}
        {/* <div className="status">{status}</div> */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state={
      history: [{
        squares:Array(9).fill(null),
        lastMove:null,
      }],
      stepNumber: 0,
      xIsNext: true,
      listOrder: true,
    };
  }

  handleClick(i){  // move to Games component
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();  // no mutation of original array.
    // const lastMove = current.lastMove;

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{  // concat does not mutate the original array.
        squares: squares,
        lastMove: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    }); // setState will rerender the children Squares. (controlled component)
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2)  === 0
    })
  }

  listSort(){
    // Todo
    this.setState({
      listOrder: !this.state.listOrder,
    })
  }

  render() {
    const history=this.state.history;
    const current=history[this.state.stepNumber];
    const winner=calculateWinner(current.squares);
    const listOrder=this.state.listOrder;

    let moves=history.map((step,move) => {
      // const rowCol = {(step.lastMove)=>/*mm*/}
      // alert(`lastMove=${move?Math.floor(step.lastMove/3)+', '+step.lastMove%3:'n/a'}`);
      const desc = move ?
      // using template string format (back tick execution :
        `Go to move #${move} (${Math.floor(step.lastMove/3)}, ${step.lastMove%3})` :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })
    if (!this.state.listOrder) moves=moves.reverse();

    let status
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
  
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br></br>
          <button onClick={() => this.listSort()}>step order {listOrder?'(desc)':'(asc)'}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
