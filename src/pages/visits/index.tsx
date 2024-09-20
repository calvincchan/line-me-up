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
import React, { useEffect, useMemo, useState } from "react";
import { IVisit, IVisitor } from "../../interfaces";
import { visitorCancelVisit } from "../../utilities/app-sdk";
import { supabaseClient } from "../../utilities/supabase-client";
import { KioskWrapper } from "../kiosk/wrapper";
import DetailsDialog from "./details-dialog";
import WaitlistDialog from "./waitlist-dialog";

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
  const { query } = useShow<IVisit>({
    liveMode: "auto",
  });
  const { data, isFetching, isError, refetch } = query;
  const visit = data?.data;
  const [openDetails, setOpenDetails] = useState(false);
  const [openWaitlist, setOpenWaitlist] = useState(false);
  const [visitor, setVisitor] = useState<IVisitor | null>(null);
  const [refetchVisitor, setRefetchVisitor] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  /** Load additional visitor details */
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
  }, [visit, refetchVisitor]);

  const displayMode = useMemo(() => {
    if (isCancelled) return "Cancelled";
    if (isFetching) return "Loading";
    if (!visit) return "NotFound";
    return visit.status;
  }, [isCancelled, isFetching, visit]);

  async function onEditDetails() {
    if (!visit) return;
    setOpenDetails(true);
  }

  async function onShowWaitlist() {
    setOpenWaitlist(true);
  }

  async function onLeaveWaitlist() {
    if (!visit) return;
    try {
      const value = confirm("Are you sure you want to leave the waitlist?");
      if (!value) return;
      await visitorCancelVisit(visit.id);
      setIsCancelled(true);
    } catch (error) {
      alert(error);
    }
  }

  return (
    <KioskWrapper>
      <Card>
        <CardContent>
          <Stack spacing={4} sx={{ textAlign: "center" }}>
            <Typography variant="body1">
              {import.meta.env.VITE_LOCATION_NAME}
            </Typography>
            {displayMode === "Loading" ? (
              <Typography variant="h4" color="text.secondary">
                Loading...
              </Typography>
            ) : displayMode === "Cancelled" ? (
              <Typography variant="h4">You have left the waitlist.</Typography>
            ) : displayMode === "Waiting" ? (
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
                  <Button onClick={onEditDetails}>Edit details</Button>
                  <Button onClick={onShowWaitlist}>View waitlist</Button>
                  <Button onClick={onLeaveWaitlist} color="secondary">
                    Leave waitlist
                  </Button>
                </Stack>
              </>
            ) : displayMode === "Calling" ? (
              <>
                <Typography variant="h1">🔔</Typography>
                <Typography variant="h4">It's your turn!</Typography>
                <Typography variant="h6">
                  Please proceed to the {visit?.station_name}.
                </Typography>
              </>
            ) : displayMode === "Serving" ? (
              <>
                <Typography variant="h1">🚀</Typography>
                <Typography variant="h4">You are being served.</Typography>
                <Typography variant="h6">
                  Your are being served at {visit?.station_name}.
                </Typography>
              </>
            ) : displayMode === "NotFound" ? (
              <>
                <Typography variant="h1">👋</Typography>
                <Typography variant="h4">
                  You are not in the waitlist.
                </Typography>
              </>
            ) : (
              <Typography variant="h4">Unknown status</Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
      {visit && (
        <DetailsDialog
          open={openDetails}
          onClose={() => {
            setOpenDetails(false);
            setRefetchVisitor((v) => v + 1);
          }}
          visitorId={visit.visitor}
        />
      )}
      <WaitlistDialog
        open={openWaitlist}
        onClose={() => setOpenWaitlist(false)}
      />
    </KioskWrapper>
  );
};
