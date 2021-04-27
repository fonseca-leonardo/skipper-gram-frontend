import { Grid } from "@material-ui/core";
import styled, { keyframes, css } from "styled-components";

import { AnimetedGridProps } from "./index";

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
`;

const appearFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const appearFromTop = keyframes`
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
`;

export const AnimetedGrid = styled(Grid)`
  ${({ animationDirection }: AnimetedGridProps) =>
    animationDirection === "right" &&
    css`
      animation: ${appearFromRight} 1s;
    `};

  ${({ animationDirection }: AnimetedGridProps) =>
    animationDirection === "left" &&
    css`
      animation: ${appearFromLeft} 1s;
    `};

  ${({ animationDirection }: AnimetedGridProps) =>
    animationDirection === "bottom" &&
    css`
      animation: ${appearFromBottom} 1s;
    `};

  ${({ animationDirection }: AnimetedGridProps) =>
    animationDirection === "top" &&
    css`
      animation: ${appearFromTop} 1s;
    `};
`;
