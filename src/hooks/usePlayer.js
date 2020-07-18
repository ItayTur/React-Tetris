import { useState, useCallback } from 'react';

import { randomTentromino, TETROMINOS } from '../tetrominos';

import { STAGE_WIDTH, checkCollision } from '../gameHelpers';

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS[0].shape,
        collided: false
    });

    const rotate = (matrix, dir) => {
        const rotatedMatrix = matrix.map((_, index) =>
            matrix.map(row => row[index])
        );
        if (dir > 0) return rotatedMatrix.map(row => row.reverse());
        return rotatedMatrix.reverse();
    }

    const rotatePlayer = (dir, stage) => {
        const mutablePlayer = JSON.parse(JSON.stringify(player));
        mutablePlayer.tetromino = rotate(mutablePlayer.tetromino, dir);

        let offset = 1;
        while (checkCollision(mutablePlayer, stage, { x: 0, y: 0 })) {
            mutablePlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > mutablePlayer.tetromino[0].length) {
                return;
            }
        }
        setPlayer(mutablePlayer);
    }

    const updatePlayerPos = ({ x, y, collided }) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: prev.pos.x + x, y: prev.pos.y + y },
            collided
        }))
    }

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
            tetromino: randomTentromino().shape,
            collided: false
        })
    }, [])

    return [player, updatePlayerPos, resetPlayer, rotatePlayer];
}