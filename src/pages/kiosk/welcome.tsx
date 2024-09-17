import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { KioskWrapper } from "./wrapper";

export const KioskWelcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <KioskWrapper>
      <Card>
        <CardContent>
          <Stack spacing={4} sx={{ textAlign: "center" }}>
            <Typography variant="h4">
              Welcome to {import.meta.env.VITE_LOCATION_NAME}
            </Typography>
            <Typography variant="h5">People waiting: 5</Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("./details")}
                sx={{ width: "80%" }}
              >
                Join line
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </KioskWrapper>
  );
};
