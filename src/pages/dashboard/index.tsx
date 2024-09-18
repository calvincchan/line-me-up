import {
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useGetIdentity, useList } from "@refinedev/core";
import React, { useMemo } from "react";
import { VisitTable } from "../../components/visit-table";
import { IMember, IStation, IVisit } from "../../interfaces";

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

  const { data: visitList, isLoading: visitLoading } = useList<IVisit>({
    resource: "visit",
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
    liveMode: "auto",
  });

  return (
    <Stack spacing={2}>
      <Typography variant="h4">
        <small>{import.meta.env.VITE_LOCATION_NAME} Dashboard</small>
        <br />
        Welcome, {user?.name}
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Stations</Typography>
          {stationLoading ? (
            <CircularProgress />
          ) : (
            stationList?.data.map((station) => (
              <div key={station.id}>
                <Typography variant="body1">
                  {station.name}: {station.status}
                </Typography>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <p>People waiting: {visitList?.total}</p>
      <Card>
        <VisitTable
          data={visitList?.data || []}
          showStatus
          loading={visitLoading}
        />
      </Card>
    </Stack>
  );
};
