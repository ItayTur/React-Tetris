import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';

export const useStage = (player, resetPlayer) => {
    const [stage, setStage] = useState(createStage());
    const [clearedRows, setClearedRows] = useState(0);

    useEffect(() => {
        setClearedRows(0);

        const clearRows = newStage => {
            return newStage.reduce((ack, row) => {
                if ((row.findIndex(cell => cell[0] === 0)) === -1) {
                    setClearedRows(prev => --prev);
                    ack.unshift(new Array(newStage[0].length).fill([0, 'clear']))
                    return ack;
                }
                ack.push(row);
                return ack;
            }, [])
        }

        const updateStage = prevStage => {
            // first flush the stage
            const newStage = prevStage.map(row =>
                row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
            )

            // then drow the tetromino
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        newStage[y + player.pos.y][x + player.pos.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`
                        ]
                    }
                })
            })

            if (player.collided) {
                resetPlayer();
                return clearRows(newStage);
            }

            return newStage;
        }
        

        setStage(prev => updateStage(prev))
    }, [player, resetPlayer, clearedRows])

    return [stage, setStage, clearedRows];
}