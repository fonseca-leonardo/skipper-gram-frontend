import React from 'react'
import {  useTheme } from '@material-ui/core/styles';

import IconProps from '../IconProps'

export default function HashTag({ color, htmlColor,height, width }: IconProps) {
    const { palette, } = useTheme();
    const fill = htmlColor || (color ? palette[color].main : palette.text.primary);
    return (
        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height={height} viewBox="0 0 24 24" width={width} fill={fill}><path d="M20 10V8h-4V4h-2v4h-4V4H8v4H4v2h4v4H4v2h4v4h2v-4h4v4h2v-4h4v-2h-4v-4h4zm-6 4h-4v-4h4v4z"/></svg>
    )
}
