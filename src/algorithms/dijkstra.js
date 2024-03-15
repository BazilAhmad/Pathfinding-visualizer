// Exporting the dijkstra function to perform Dijkstra's algorithm. 
// This function identifies the shortest path from a start node to a finish node in a grid.
export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = []; // Tracks the order in which nodes are visited.
  startNode.distance = 0; // Initializing start node distance to 0.
  const unvisitedNodes = getAllNodes(grid); // Getting all nodes from the grid as unvisited initially.

  // Looping until all nodes are visited.
  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes); // Sorting unvisited nodes by their distance from the start node.
    const closestNode = unvisitedNodes.shift(); // Getting the closest node.

    if (closestNode.isWall) continue; // Skipping walls.

    if (closestNode.distance === Infinity) return visitedNodesInOrder; // If trapped, return the visited nodes so far.

    closestNode.isVisited = true; // Marking the closest node as visited.
    visitedNodesInOrder.push(closestNode); // Adding the closest node to the visited list.

    if (closestNode === finishNode) return visitedNodesInOrder; // If the finish node is reached, return the path.

    updateUnvisitedNeighbors(closestNode, grid); // Updating the distances of unvisited neighbors.
  }
}

// Sorts nodes by distance for efficient closest node selection.
function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

// Updates unvisited neighbors with the new shortest distance and backtracks the previous node.
function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
  }
}

// Retrieves all unvisited neighbors of a given node.
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Compiles all nodes from the grid into a single array.
function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
      for (const node of row) {
          nodes.push(node);
      }
  }
  return nodes;
}

// Backtracks from the finish node to find the shortest path. Must be called after dijkstra function.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
