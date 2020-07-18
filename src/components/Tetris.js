import React, { useState } from 'react';

import { createStage, checkCollision } from '../gameHelpers';

import Stage from './Stage';
import StartButton from './StartButton';
import Display from './Display';

import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris'

import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useInterval } from '../hooks/useInterval';
import { useGameStatus } from '../hooks/useGameStatus';

const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameover] = useState(false);

    const [player, updatePlayerPos, resetPlayer, rotatePlayer] = usePlayer();
    const [stage, setStage, clearedRows] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(clearedRows);

    const moveHorizonaly = dir => {
        if (!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 })
        }
    }

    const startGame = () => {
        // Reset everything
        setStage(createStage());
        resetPlayer();
        setGameover(false);
        setDropTime(1000);
        setScore(0);
        setRows(0);
        setLevel(0);
    }

    const calcDropTime = () => 1000 / (level + 1) + 200;

    const drop = () => {
        if (rows > (level +1) * 10) {
            setLevel(prev => ++prev);
            setDropTime(calcDropTime());
        }

        if (!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false })
        } else {
            if (player.pos.y < 1) {
                setGameover(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true })
        }
    }

    const dropPlayer = () => {
        setDropTime(null);
        drop();
    }

    const onKeyUp = ({ keyCode }) => !gameOver && keyCode === 40 && setDropTime(calcDropTime());

    const move = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 37) {
                moveHorizonaly(-1);
            } else if (keyCode === 39) {
                moveHorizonaly(1);
            } else if (keyCode === 40) {
                dropPlayer();
            } else if (keyCode === 38) {
                rotatePlayer(1, stage)
            }
        }
    }

    useInterval(drop, dropTime);


    return (
        <StyledTetrisWrapper roll="button" tabIndex="0" onKeyUp={onKeyUp} onKeyDown={move}>
            <StyledTetris>
                <Stage stage={stage} />
                <aside>
                    {gameOver ? (
                        <Display gameOver={gameOver} text="Game Over" />
                    ) :
                        <div>
                            <Display text={`Score: ${score}`} />
                            <Display text={`Rows: ${rows}`} />
                            <Display text={`Level: ${level}`} />
                        </div>
                    }
                    <StartButton callback={startGame} />
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    )
};

export default Tetris;