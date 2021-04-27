import { createMuiTheme } from "@material-ui/core/styles";

import { ptBR } from "@material-ui/core/locale";

export const Theme = createMuiTheme(
  {
    palette: {
      type: "dark",
      primary: {
        main: "#835cfb",
      },
    },
  },
  ptBR
);
