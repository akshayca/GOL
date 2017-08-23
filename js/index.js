"use strict";

// TODO: Remake OOP style with react classes

var boardLength = 40;
var boardWidth = 40;

var Board = React.createClass({
  displayName: "Board",

  updateBoard: function updateBoard(e) {
    this.props.updateBoard([e.target.getAttribute("data-row"), e.target.getAttribute("data-col")]);
  },
  configureRow: function configureRow(i) {
    var row = [];
    for (var j = 0; j < this.props.board[i].length; j++) {
      if (this.props.board[i][j] == 1) {
        row.push(React.createElement("div", { "data-row": i, "data-col": j, onClick: this.updateBoard, className: "cell live" }));
      } else {
        row.push(React.createElement("div", { "data-row": i, "data-col": j, onClick: this.updateBoard, className: "cell" }));
      }
    }
    return row;
  },
  configureRows: function configureRows() {
    var rows = [];
    for (var i = 0; i < this.props.board.length; i++) {
      var row = this.configureRow(i);
      rows.push(React.createElement(
        "div",
        { className: "row" },
        row
      ));
    }
    return rows;
  },
  render: function render() {
    var rows = this.configureRows();
    return React.createElement(
      "div",
      { className: "board" },
      rows
    );
  }
});

var ButtonGroup = React.createClass({
  displayName: "ButtonGroup",

  render: function render() {
    return React.createElement(
      "div",
      { id: "gen", className: "gen text-center" },
      React.createElement(
        "p",
        null,
        "Generation: ",
        this.props.gen
      ),
      React.createElement(
        "button",
        { onClick: this.props.start, id: "start", className: "btn btn-control" },
        "Start"
      ),
      React.createElement(
        "button",
        { onClick: this.props.pause, id: "pause", className: "btn btn-control" },
        "Pause"
      ),
      React.createElement(
        "button",
        { onClick: this.props.reset, id: "reset", className: "btn btn-control" },
        "Reset"
      ),
      React.createElement(
        "button",
        { onClick: this.props.clear, id: "clear", className: "btn btn-control" },
        "Clear"
      )
    );
  }
});

var Game = React.createClass({
  displayName: "Game",

  getInitialState: function getInitialState() {
    return {
      board: this.initializeBoard(boardLength, boardWidth, 1),
      gen: 0
    };
  },
  componentDidMount: function componentDidMount() {
    this.start();
  },
  initializeBoard: function initializeBoard(length, width, randomize) {
    var theBoard = [];
    for (var i = 0; i < length; i++) {
      theBoard.push([]);
      for (var j = 0; j < width; j++) {
        if (randomize == 0) {
          theBoard[i].push(0);
        } else if (randomize == 1) {
          var randomNum = Math.random();
          if (randomNum > 0.8) {
            theBoard[i].push(1);
          } else {
            theBoard[i].push(0);
          }
        }
      }
    }
    return theBoard;
  },
  nextGeneration: function nextGeneration(board) {
    var newBoard = [];
    for (var i = 0; i < board.length; i++) {
      newBoard.push([]);
      for (var j = 0; j < board[i].length; j++) {
        var cell = board[i][j];
        var topCoord = i == 0 ? board.length - 1 : i - 1;
        var botCoord = i == board.length - 1 ? 0 : i + 1;
        var leftCoord = j == 0 ? board[i].length - 1 : j - 1;
        var rightCoord = j == board[i].length - 1 ? 0 : j + 1;
        var neighbors = [board[topCoord][leftCoord], board[topCoord][j], board[topCoord][rightCoord], board[i][leftCoord], board[i][rightCoord], board[botCoord][leftCoord], board[botCoord][j], board[botCoord][rightCoord]];
        var neighborsAliveCount = neighbors.filter(function (neighbor) {
          return neighbor == 1;
        }).length;
        if (cell === 1) {
          if (neighborsAliveCount === 2 || neighborsAliveCount === 3) {
            newBoard[i].push(1);
          } else {
            newBoard[i].push(0);
          }
        } else {
          if (neighborsAliveCount === 3) {
            newBoard[i].push(1);
          } else {
            newBoard[i].push(0);
          }
        }
      }
    }
    return newBoard;
  },
  start: function start() {
    var _this = this;

    if (this.generationInterval == undefined) {
      (function () {
        var that = _this;
        that.generationInterval = setInterval(function () {
          that.setState({
            board: that.nextGeneration(that.state.board),
            gen: that.state.gen += 1
          });
        }, 1000);
      })();
    }
  },
  pause: function pause() {
    clearInterval(this.generationInterval);
    this.generationInterval = undefined;
  },
  reset: function reset() {
    clearInterval(this.generationInterval);
    this.generationInterval = undefined;
    this.setState({
      board: this.initializeBoard(boardLength, boardWidth, 1),
      gen: 0
    });
  },
  clear: function clear() {
    clearInterval(this.generationInterval);
    this.generationInterval = undefined;
    this.setState({
      board: this.initializeBoard(boardLength, boardWidth, 0),
      gen: 0
    });
  },
  updateBoard: function updateBoard(coords) {
    var theBoard = this.state.board;
    if (this.state.board[coords[0]][coords[1]] == 1) {
      theBoard[coords[0]][coords[1]] = 0;
      this.setState({
        board: theBoard
      });
    } else {
      theBoard[coords[0]][coords[1]] = 1;
      this.setState({
        board: theBoard
      });
    }
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "wrap" },
      React.createElement(Board, { board: this.state.board, updateBoard: this.updateBoard.bind(this) }),
      React.createElement(ButtonGroup, { gen: this.state.gen,
        start: this.start.bind(this),
        pause: this.pause.bind(this),
        reset: this.reset.bind(this),
        clear: this.clear.bind(this) })
    );
  }
});

ReactDOM.render(React.createElement(Game, null), document.getElementById("game"));