import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useList } from "@refinedev/core";
import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import { IVisit } from "../../interfaces";
import { KioskWrapper } from "./wrapper";

export const KioskWelcome: React.FC = () => {
  const navigate = useNavigate();

  const { data: visitList } = useList<IVisit>({
    resource: "visit",
    liveMode: "auto",
  });

  const waiting = useMemo(() => {
    if (!visitList?.data) return 0;
    return visitList?.data.reduce((acc, visit) => {
      if (visit.status === "Waiting") {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [visitList?.data]);

  return (
    <KioskWrapper>
      <Card>
        <CardContent>
          <Stack spacing={4} sx={{ textAlign: "center" }}>
            <Box>
              <Typography variant="h4">
                Welcome to {import.meta.env.VITE_LOCATION_NAME}
              </Typography>
              <Typography variant="h6">
                Address: {import.meta.env.VITE_LOCATION_ADDRESS}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5">People waiting: {waiting}</Typography>
              <Typography variant="h5">Estimated time: (TODO)</Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("./details")}
                sx={{ width: "60%" }}
              >
                Join Line
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </KioskWrapper>
  );
};
