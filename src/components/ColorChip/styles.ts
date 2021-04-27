import styled from "styled-components";
import { Chip } from "@material-ui/core";

import { readableColor } from "polished";

import { ColorChipProps } from "./index";

export const StyledColorChip = styled(Chip)`
  background: ${({ htmlColor }: ColorChipProps) => htmlColor};

  font-weight: bold;

  span {
    color: ${({ htmlColor }: ColorChipProps) => readableColor(htmlColor || "")};
  }
`;
