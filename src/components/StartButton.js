import React from 'react';
import { StyledStartButton } from './styles/StyledStartButton'

const StartButton = ({ callback }) => (
    <StyledStartButton onClick={callback}>start button</StyledStartButton>
);

export default StartButton;