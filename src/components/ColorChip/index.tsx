import React from 'react';
import { ChipProps } from '@material-ui/core';

import { StyledColorChip } from './styles';

export interface ColorChipProps extends ChipProps {
    htmlColor?: string;
}

export default function ColorChip({ htmlColor = '', ...props }: ColorChipProps) {
    return (
        <StyledColorChip htmlColor={htmlColor} {...props}  />
    )
}
