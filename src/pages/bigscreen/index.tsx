import { Typography } from "@mui/material";
import React from "react";

export const PublicScreen: React.FC = () => {
  return (
    <div>
      <Typography variant="h3">
        Welcome to {import.meta.env.VITE_LOCATION_NAME}
      </Typography>
      <Typography variant="body1">
        This is a public screen component.
      </Typography>
    </div>
  );
};
