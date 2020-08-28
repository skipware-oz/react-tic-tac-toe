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
  let className ="square";
  if (props.winner) className="square winnerSquare";
  return (
    <button className={className} onClick={props.onClick}>
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
    let winner=false;
    let vector=this.props.winVector;  // we inherit this prop from the Board class.
    if (vector && vector.indexOf(i) > -1) winner=true;
    return <Square 
              value={this.props.squares[i]} 
              // onClick={() => this.handleClick(i)}  // this points Square class back to Board class handleClick()
              onClick={() => this.props.onClick(i)}  // this points Square class back to Game class handleClick()
              winner={winner}
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

    let squares =[], row=[];
    let sq = 0;

    for (let i=0; i < 3; i++) {
      row=[];
      for (let j=0; j < 3; j++) {
        row.push(this.renderSquare(sq));
        sq++;
      }
      squares.push(<div key={sq} className="board-row">{row}</div>)
    }
    return (
      <div>
        {/* This is how you add comments into html in JSX */}
        {console.log("%cThis is how you add browser console logs in JSX html","color:#f0c002")}
        {/* <div className="status">{status}</div> */}

        {/*
        <div className="board-row">
          {this.renderSquare(0, this.props.winVector)}
          {this.renderSquare(1, this.props.winVector)}
          {this.renderSquare(2, this.props.winVector)}
        </div>
        <div className="board-row">
          {this.renderSquare(3, this.props.winVector)}
          {this.renderSquare(4, this.props.winVector)}
          {this.renderSquare(5, this.props.winVector)}
        </div>
        <div className="board-row">
          {this.renderSquare(6, this.props.winVector)}
          {this.renderSquare(7, this.props.winVector)}
          {this.renderSquare(8, this.props.winVector)}
        </div>
        */}
        {squares}
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
      ascMoveOrder: true,
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

  jumpTo = step => {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2)  === 0
    })
  }

  listSort(){
    // Todo
    this.setState({
      ascMoveOrder: !this.state.ascMoveOrder,
    })
  }


  render() {
    const history=this.state.history;
    const stepNumber=this.state.stepNumber;
    const current=history[stepNumber];
    const gameState=calculateWinner(current.squares);
    const ascMoveOrder=this.state.ascMoveOrder;
    

    let moves=history.map((game,move) => {
      // const rowCol = {(step.lastMove)=>/*mm*/}
      // alert(`lastMove=${move?Math.floor(step.lastMove/3)+', '+step.lastMove%3:'n/a'}`);
      let classOpt=(stepNumber===move?"selected":"");
      const desc = move ?
      // using template string format (back tick execution :
        `Go to move #${move} (${Math.floor(game.lastMove/3)}, ${game.lastMove%3})` :
        'Go to game start';
      return (
        <li key={move} className={classOpt}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })
    if (!this.state.ascMoveOrder) {
      // moves=moves.reverse(); // this works as well
      moves.sort((a,b) => {
        return b.key - a.key    // although docs say you can't access the element key, this works (<li key=..>)
      })
    }
    let status="";
    let vector=null;

    if (!gameState) {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    } else if (gameState.result==="win") {
      status = `Winner: player ${gameState.player}`;
      vector = gameState.vector;
    } else if (gameState.result==="draw") {
      status = "Game drawn";
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winVector={vector}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br></br>
          <button onClick={() => this.listSort()}>move order {ascMoveOrder?'(desc)':'(asc)'}</button>
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
      return {result: "win", vector: lines[i], player:squares[a]};
    }
  }
  let draw;
  draw=squares.filter(sq=>sq===null);
  if (draw.length === 0) {
    console.log("game drawn") // this is the web browser console !! :-)
    return {result:"draw",vector:null, player:null};
  }
  return null;
}
