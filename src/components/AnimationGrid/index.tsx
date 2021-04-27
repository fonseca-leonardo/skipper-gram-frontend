import React from 'react';
import { GridProps } from '@material-ui/core';

import { AnimetedGrid } from './styles';

export interface AnimetedGridProps extends GridProps {
    animationDirection?: 'top' | 'bottom' | 'right' | 'left';

    children?: React.ReactNode;

}

const AnimationGrid: React.FC<AnimetedGridProps> = ({animationDirection = 'bottom', children, ...rest}: AnimetedGridProps) => {
    return (
        <AnimetedGrid animationDirection={animationDirection} {...rest}>
            <>
                {children}
            </>
        </AnimetedGrid>
    )
}

export default AnimationGrid;