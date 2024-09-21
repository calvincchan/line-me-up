import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import QRCode from "react-qr-code";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWaitTime } from "../../components/wait-time-context";
import { KioskWrapper } from "./wrapper";

export const KioskSubmitted: React.FC = () => {
  const location = useLocation();
  const visitId = location.state?.visitId || null;
  const navigate = useNavigate();
  const { waitTime } = useWaitTime();

  return (
    <KioskWrapper>
      <Card>
        <CardContent>
          <Stack spacing={4} sx={{ textAlign: "center" }}>
            <Typography variant="body1">
              {import.meta.env.VITE_LOCATION_NAME}
            </Typography>
            <Typography variant="h5">Thank you for checking in!</Typography>
            <Typography variant="h5">Estimated time: {waitTime}</Typography>
            {visitId && (
              <Typography variant="body1">
                You can continue to check your wait status at:
                <br />
                <Link to={`/visits/${visitId}`}>Your status page</Link>
              </Typography>
            )}
            <Box alignItems="center">
              <QRCode value={window.location.origin + `/visits/${visitId}`} />
            </Box>
            <Box>
              <Button
                variant="contained"
                sx={{ width: "60%" }}
                onClick={() => navigate("..")}
              >
                Finish
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </KioskWrapper>
  );
};
