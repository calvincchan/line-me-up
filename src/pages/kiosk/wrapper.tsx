import { Box, Container } from "@mui/material";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export const KioskWrapper: React.FC<Props> = ({ children }) => {
  return (
    <Box sx={{ backgroundColor: "primary.main", height: "100vh" }}>
      <Container maxWidth="sm" sx={{ pt: 10 }}>
        {children}
      </Container>
    </Box>
  );
};
