import { Card, CardContent, Stack, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { KioskWrapper } from "./wrapper";

export const KioskSubmitted: React.FC = () => {
  const location = useLocation();
  const visitId = location.state?.visitId || null;

  return (
    <KioskWrapper>
      <Card>
        <CardContent>
          <Stack spacing={4} sx={{ textAlign: "center" }}>
            <Typography variant="body1">
              {import.meta.env.VITE_LOCATION_NAME}
            </Typography>
            <Typography variant="h5">Thank you for checking in!</Typography>
            {visitId && (
              <Typography variant="h5">
                You can continue to check your wait status at:
                <br />
                <Link to={`/visits/${visitId}`}>Your status page</Link>
              </Typography>
            )}
            <Typography>(QR Code)</Typography>
          </Stack>
        </CardContent>
      </Card>
    </KioskWrapper>
  );
};
