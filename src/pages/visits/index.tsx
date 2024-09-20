import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useShow } from "@refinedev/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IVisit, IVisitor } from "../../interfaces";
import { visitorCancelVisit } from "../../utilities/app-sdk";
import { supabaseClient } from "../../utilities/supabase-client";
import { KioskWrapper } from "../kiosk/wrapper";

const LabelledField: React.FC<{ label: string; value: string | undefined }> = ({
  label,
  value,
}) => (
  <Box>
    <Typography variant="caption">{label}</Typography>
    <Typography variant="h6">{value || "--"}</Typography>
  </Box>
);

export const VisitShow: React.FC = () => {
  const { query } = useShow<IVisit>();
  const { data, isFetching, isError, refetch } = query;
  const visit = data?.data;
  const [leftWaitlist, setLeftWaitlist] = useState(false);

  const [visitor, setVisitor] = React.useState<IVisitor | null>(null);
  useEffect(() => {
    async function run() {
      if (visit) {
        const { data: visitorData } = await supabaseClient
          .from("visitor")
          .select("*")
          .eq("id", visit.visitor)
          .single();
        setVisitor(visitorData);
      }
    }
    run();
  }, [visit]);

  async function onLeaveWaitlist() {
    if (!visit) return;
    await visitorCancelVisit(visit.id);
    setLeftWaitlist(true);
  }

  return (
    <KioskWrapper>
      <Card>
        <CardContent>
          <Stack spacing={4} sx={{ textAlign: "center" }}>
            <Typography variant="body1">
              {import.meta.env.VITE_LOCATION_NAME}
            </Typography>
            {isFetching && <Typography variant="h4">Loading...</Typography>}
            {leftWaitlist ? (
              <Typography variant="h4">You have left the waitlist.</Typography>
            ) : visit ? (
              <>
                <Typography variant="h4">Thanks for waiting!</Typography>
                <Box>
                  Stay on this page to get notified when it's your turn.
                </Box>
                <Box>
                  <small>Estimated wait</small>
                  <br />
                  <Typography variant="h6">10-15 mins</Typography>
                </Box>
                <Divider />
                <Stack spacing={2}>
                  <LabelledField label="Name" value={visitor?.name} />
                  <LabelledField label="Phone" value={visitor?.phone} />
                </Stack>
                <Divider />
                <Stack spacing={2}>
                  <Button>Edit details</Button>
                  <Button>Show QR code</Button>
                  <Link to="/bigscreen">
                    <Button>View waitlist</Button>
                  </Link>
                  <Button onClick={onLeaveWaitlist}>Leave waitlist</Button>
                </Stack>
              </>
            ) : (
              <Typography variant="h4">You are not in the waitlist.</Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </KioskWrapper>
  );
};
