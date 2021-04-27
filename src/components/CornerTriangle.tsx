import React from 'react';
import { useTheme } from '@material-ui/core'
import styled from 'styled-components';


interface IStyles {
    cornerColor: string;
}

const CornerTriangleStyled = styled.div<IStyles>`
    position: absolute;

    width: 0;
    height: 0;
    left: 0;
    top: 0;
    z-index: -1;

    border-right: 55vw solid transparent;
    border-top: 65vh solid ${({ cornerColor }) => cornerColor };

    overflow: hidden;    
`;

export default function CornerTriangle() {
    const theme = useTheme();
    
    return (
        <CornerTriangleStyled cornerColor={theme.palette.primary.main}/>
    )
}
