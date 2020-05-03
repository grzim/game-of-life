class Living {
    ruleToLiveInNextIteration(livingNeighbours) {
        return [2,3].includes(livingNeighbours);
    }
}

class Dead {
    ruleToLiveInNextIteration(livingNeighbours) {
        return livingNeighbours === 3;
    }
}

const creatures = [Dead, Living];
const creatureFactory = isLiving => new creatures[Number(isLiving)];
const drawCreature = (creature, node) => (node.classList.remove(Living.name.toLowerCase(), Dead.name.toLowerCase()), node.classList.add(creature.constructor.name.toLowerCase()));
const getAdjacent = (colRowIndex, targetCellIndex) => targetCellIndex >= colRowIndex - 1 && targetCellIndex <= colRowIndex + 1;
const neighbourList = (rowIndex, colIndex, matrix) => matrix.filter((_, innerRowIndex) => getAdjacent(innerRowIndex, rowIndex))
    .map((goodRows, rowIndex) => goodRows.filter((_, innerColIndex) => getAdjacent(innerColIndex, colIndex)));
const isLiving = creature => creature instanceof Living;

const countLivingNeighbours = (rowIndex, colIndex, matrix) => neighbourList(rowIndex, colIndex, matrix)
    .flat()
    .filter(isLiving).length - isLiving(matrix[rowIndex][colIndex]);

const countNextStep = matrix => matrix.map((row, rowIndex) => row.map((creature, colIndex) => creatureFactory(creature.ruleToLiveInNextIteration(countLivingNeighbours(rowIndex, colIndex, matrix)))));
const spawnCreature = liveSpawnPossibility => creatureFactory(Math.random() < liveSpawnPossibility);
const drawBoard = (board, matrix) => board.forEach((row, rowIndex) => row.forEach((cell, colIndex) => drawCreature(matrix[rowIndex][colIndex], cell)));
const startNewIteration = (matrix, board, iterations, speed) => {
    const newMatrix = countNextStep(matrix);
    drawBoard(board, newMatrix);
    if(iterations === 0) return;
    setTimeout(() => startNewIteration(newMatrix, board,iterations - 1, speed), speed);
};

const generateMatrixWith = (size, callback) =>
    Array.from({length: size}).map(row => Array.from({length: size}).map(callback));

const buildHTML = (parent, size) =>
    Array.from({length: size}).map(row => {
        const tr = document.createElement('tr');
        parent.append(tr);
        return Array.from({length: size}).map(() => {
            const td = document.createElement('td');
            td.classList.add('creature');
            tr.append(td);
            return td;
        });
    });

const game = (parent = document.querySelector('.game'), iterations = 100, size = 100, speed = 50, liveSpawnPossibility = 0.3) => {
    const board = buildHTML(parent, size);
    const matrix = generateMatrixWith(size, spawnCreature.bind(null, liveSpawnPossibility));
    drawBoard(board, matrix);
    setTimeout(() => startNewIteration(matrix, board, iterations, speed));
};

game();
