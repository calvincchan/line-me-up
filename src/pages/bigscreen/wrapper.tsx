import { Box, Container } from "@mui/material";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export const BigscreenWrapper: React.FC<Props> = ({ children }) => {
  return (
    <Box sx={{ height: "100vh" }}>
      <Container maxWidth="sm" sx={{ pt: 5 }}>
        {children}
      </Container>
    </Box>
  );
};
