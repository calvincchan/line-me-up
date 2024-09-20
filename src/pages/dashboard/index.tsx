import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useGetIdentity, useList } from "@refinedev/core";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { VisitTable } from "../../components/visit-table";
import { IMember, IStation, IVisit } from "../../interfaces";
import {
  callNextVisitor,
  cancelCall,
  checkInStation,
  checkOutStation,
  completeService,
  startService,
} from "../../utilities/app-sdk";

export const Dashboard: React.FC = () => {
  const { data: user } = useGetIdentity<IMember>();

  const { data: stationList, isLoading: stationLoading } = useList<IStation>({
    resource: "station",
    liveMode: "auto",
    sorters: [
      {
        field: "id",
        order: "asc",
      },
    ],
  });

  const myStation = useMemo(() => {
    if (!user || !stationList) return null;
    return (
      stationList?.data.find((station) => station.opened_by === user.id) || null
    );
  }, [stationList, user]);

  /* check if user can open a station */
  const canOpenStation = useMemo(() => {
    return myStation === null;
  }, [myStation]);

  /* get the list of visits */
  const { data: visitList, isLoading: visitLoading } = useList<IVisit>({
    resource: "visit",
    liveMode: "auto",
    sorters: [
      {
        field: "entered_at",
        order: "asc",
      },
    ],
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

  const [counter, setCounter] = useState(0);
  /* force re-render wait time every 10 seconds */
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  const onCallNextVisitor = async () => {
    if (!myStation) return;
    try {
      await callNextVisitor(myStation.id);
    } catch (error) {
      alert(error);
    }
  };

  const onCheckOut = async () => {
    if (!myStation || !user?.id) return;
    try {
      await checkOutStation(user.id, myStation.id);
    } catch (error) {
      alert(error);
    }
  };

  const onStartService = async () => {
    if (!myStation) return;
    try {
      await startService(myStation.id);
    } catch (error) {
      alert(error);
    }
  };

  const onCancelCall = async () => {
    if (!myStation) return;
    try {
      await cancelCall(myStation.id);
    } catch (error) {
      alert(error);
    }
  };

  const onCompleteService = async () => {
    if (!myStation) return;
    try {
      await completeService(myStation.id);
    } catch (error) {
      alert(error);
    }
  };

  const onCheckIn = async (stationId: number) => {
    if (!user?.id) return;
    try {
      await checkInStation(user.id, user.name, stationId);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" color="text.secondary">
            {import.meta.env.VITE_LOCATION_NAME} Dashboard
          </Typography>
          <Typography variant="h4">Welcome, {user?.name || "--"}</Typography>
        </Box>
        <Card variant="outlined">
          <CardHeader
            title={
              myStation ? `My Station: ${myStation.name}` : "Not Checked In"
            }
            subheader={`Status: ${myStation?.status || "--"}, Checked In: ${
              myStation?.opened_at
                ? dayjs(myStation?.opened_at).format("LLL")
                : "--"
            }`}
          />
          <CardContent>
            {canOpenStation && (
              <Alert severity="info">
                You are not checked in to any station. Please check in to start
                serving.
              </Alert>
            )}
            {myStation && myStation.status === "Calling" && (
              <>
                <Typography variant="h4">
                  🔔 Calling Visitor: {myStation.visitor_name}{" "}
                </Typography>
                <Typography variant="h6" key={`calling-timestamp-${counter}`}>
                  Called: {dayjs(myStation.called_at).format("h:mm A")} (
                  {dayjs(myStation.called_at).fromNow()})
                </Typography>
              </>
            )}
            {myStation && myStation.status === "Serving" && (
              <>
                <Typography variant="h4">
                  🚀 Serving: {myStation.visitor_name}
                </Typography>
                <Typography variant="h6" key={`serving-timestamp-${counter}`}>
                  Started: {dayjs(myStation.served_at).format("h:mm A")} (
                  {dayjs(myStation.served_at).fromNow()})
                </Typography>
              </>
            )}
          </CardContent>
          <CardActions>
            {myStation && myStation.status === "Open" && (
              <>
                <Button variant="contained" onClick={onCallNextVisitor}>
                  Call Next Visitor
                </Button>
                <Button onClick={onCheckOut}>Check Out</Button>
              </>
            )}
            {myStation && myStation.status === "Calling" && (
              <>
                <Button variant="contained" onClick={onStartService}>
                  Start Service
                </Button>
                <Button onClick={onCancelCall}>Cancel Call</Button>
              </>
            )}
            {myStation && myStation.status === "Serving" && (
              <>
                <Button variant="contained" onClick={onCompleteService}>
                  Complete Service
                </Button>
              </>
            )}
          </CardActions>
        </Card>
        <Card variant="outlined">
          <CardHeader title="All Stations" />
          {stationLoading ? (
            <CircularProgress />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Served By</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stationList?.data.map((station) => (
                  <TableRow key={station.id}>
                    <TableCell>{station.name}</TableCell>
                    <TableCell>{station.status}</TableCell>
                    <TableCell>{station.opened_by_name || "--"}</TableCell>
                    <TableCell>
                      {canOpenStation && station.status === "Closed" && (
                        <Button onClick={() => onCheckIn(station.id)}>
                          Check In
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
        <Card variant="outlined">
          <CardHeader
            title="Waitlist"
            subheader={`People waiting: ${waiting}`}
          />
          <VisitTable
            data={visitList?.data || []}
            showStatus
            loading={visitLoading}
          />
        </Card>
      </Stack>
    </Container>
  );
};
