import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { astar } from '../algorithms/astar';
import './Pathfindingvisualizer.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      selectingStartNode: false,
      selectingFinishNode: false,
      startNodeRow: 10,
      startNodeCol: 15,
      finishNodeRow: 10,
      finishNodeCol: 35,
    };
    // Binding all necessary methods
    this.visualizeDijkstra = this.visualizeDijkstra.bind(this);
    this.visualizeAstar = this.visualizeAstar.bind(this);
    this.animateAlgorithm = this.animateAlgorithm.bind(this);
    this.animateShortestPath = this.animateShortestPath.bind(this);
    this.getInitialGrid = this.getInitialGrid.bind(this);
    this.createNode = this.createNode.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.resetGrid = this.resetGrid.bind(this);
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  visualizeDijkstra() {
    const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAstar() {
    const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = astar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
        if(nodeElement) {
          nodeElement.className = 'node node-shortest-path';
        }
      }, 50 * i);
    }
  }

  getInitialGrid() {
    const { startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(this.createNode(col, row, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  createNode(col, row, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol) {
    return {
      col,
      row,
      isStart: row === startNodeRow && col === startNodeCol,
      isFinish: row === finishNodeRow && col === finishNodeCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

  handleMouseDown(row, col) {
    if (this.state.selectingStartNode) {
      this.setState({ startNodeRow: row, startNodeCol: col, selectingStartNode: false }, this.resetGrid);
    } else if (this.state.selectingFinishNode) {
      this.setState({ finishNodeRow: row, finishNodeCol: col, selectingFinishNode: false }, this.resetGrid);
    } else {
      const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = { ...node, isWall: !node.isWall };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  resetGrid() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <>
        <button onClick={() => this.setState({ selectingStartNode: true })}>Select Start Node</button>
        <button onClick={() => this.setState({ selectingFinishNode: true })}>Select Finish Node</button>
        <button onClick={this.visualizeDijkstra}>Visualize Dijkstra's Algorithm</button>
        <button onClick={this.visualizeAstar}>Visualize A*</button>
        <div className="grid">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="gridRow">
              {row.map((node, nodeIdx) => {
                const { row, col, isFinish, isStart, isWall } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                    onMouseUp={() => this.handleMouseUp()}
                    row={row}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </>
    );
  }
}
