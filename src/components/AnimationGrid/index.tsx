import React from 'react';
import { GridProps } from '@material-ui/core';

import { AnimetedGrid } from './styles';

export interface AnimatedGridProps extends GridProps {
    animationDirection?: 'top' | 'bottom' | 'right' | 'left';

    children?: React.ReactNode;

}

const AnimationGrid: React.FC<AnimatedGridProps> = ({animationDirection = 'bottom', children, ...rest}: AnimatedGridProps) => {
    return (
        <AnimetedGrid animationDirection={animationDirection} {...rest} >
            <>
                {children}
            </>
        </AnimetedGrid>
    )
}

export default AnimationGrid;