// astar.js
function heuristic(node, finishNode) {
    // Using Manhattan distance as heuristic
    return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
  }
  
  export function astar(grid, startNode, finishNode) {
    const openSet = [];
    startNode.distance = 0;
    startNode.totalDistance = heuristic(startNode, finishNode);
    openSet.push(startNode);
  
    const visitedNodesInOrder = [];
    while (openSet.length > 0) {
      openSet.sort((a, b) => a.totalDistance - b.totalDistance);
      const currentNode = openSet.shift();
  
      if (currentNode.isWall) continue;
      if (currentNode.distance === Infinity) return visitedNodesInOrder;
  
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
  
      if (currentNode === finishNode) return visitedNodesInOrder;
  
      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        const tempDistance = currentNode.distance + 1;
        const pathIsShorter = tempDistance < neighbor.distance;
  
        if (pathIsShorter) {
          neighbor.distance = tempDistance;
          neighbor.totalDistance = neighbor.distance + heuristic(neighbor, finishNode);
          neighbor.previousNode = currentNode;
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }
    return visitedNodesInOrder;
  }
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }
  