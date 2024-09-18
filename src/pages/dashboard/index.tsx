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
import React, { useMemo } from "react";
import { VisitTable } from "../../components/visit-table";
import { IMember, IStation, IVisit } from "../../interfaces";
import {
  callNextVisitor,
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

  const { data: visitList, isLoading: visitLoading } = useList<IVisit>({
    resource: "visit",
    liveMode: "auto",
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
  });

  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" color="text.secondary">
            {import.meta.env.VITE_LOCATION_NAME} Dashboard
          </Typography>
          <Typography variant="h4">Welcome, {user?.name}</Typography>
        </Box>
        <Card variant="outlined">
          <CardHeader
            sx={{
              backgroundColor: myStation ? "lightgray" : "",
            }}
            title={
              myStation
                ? `My Station: ${myStation.name}`
                : "No Station Checked In"
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
                You are not serving any station. Please check in to start
                serving.
              </Alert>
            )}
            {myStation && myStation.status === "Calling" && (
              <>
                <Typography variant="h4">
                  ⏳ Calling: {myStation.visitor_name}{" "}
                </Typography>
                <Typography variant="h6">
                  Called: {dayjs(myStation.called_at).format("h:mm A")}
                </Typography>
              </>
            )}
            {myStation && myStation.status === "Serving" && (
              <>
                <Typography variant="h4">
                  🚀 Serving: {myStation.visitor_name}
                </Typography>
                <Typography variant="h6">
                  Started: {dayjs(myStation.served_at).format("h:mm A")}
                </Typography>
              </>
            )}
          </CardContent>
          <CardActions>
            {myStation && myStation.status === "Open" && (
              <>
                <Button
                  variant="contained"
                  onClick={() => callNextVisitor(myStation.id)}
                >
                  Call Next Visitor
                </Button>
                <Button>Close</Button>
              </>
            )}
            {myStation && myStation.status === "Calling" && (
              <>
                <Button
                  variant="contained"
                  onClick={() => startService(myStation.id)}
                >
                  Start Service
                </Button>
                <Button>Skip Visitor</Button>
              </>
            )}
            {myStation && myStation.status === "Serving" && (
              <>
                <Button
                  variant="contained"
                  onClick={() => completeService(myStation.id)}
                >
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
                        <Button
                          onClick={async () => {
                            try {
                              user?.id &&
                                station?.id &&
                                (await checkInStation(
                                  user.id,
                                  user.name,
                                  station.id
                                ));
                            } catch (error) {
                              alert(error);
                            }
                          }}
                        >
                          Check In
                        </Button>
                      )}
                      {myStation?.id === station.id && (
                        <Button
                          onClick={async () => {
                            try {
                              user?.id &&
                                station?.id &&
                                (await checkOutStation(user.id, station.id));
                            } catch (error) {
                              alert(error);
                            }
                          }}
                        >
                          Check Out
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
            subheader={`People waiting: ${visitList?.total || "--"}`}
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
