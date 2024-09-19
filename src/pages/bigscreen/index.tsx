import { Typography } from "@mui/material";
import { useList } from "@refinedev/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { VisitTable } from "../../components/visit-table";
import { IVisit } from "../../interfaces";
import { BigscreenWrapper } from "./wrapper";

dayjs.extend(relativeTime);

export const PublicScreen: React.FC = () => {
  const { data: visitList, isLoading: visitLoading } = useList<IVisit>({
    resource: "visit",
    sorters: [
      {
        field: "entered_at",
        order: "asc",
      },
    ],
    liveMode: "auto",
  });

  return (
    <BigscreenWrapper>
      <Typography variant="h3" sx={{ textAlign: "center" }}>
        {import.meta.env.VITE_LOCATION_NAME} Waitlist
      </Typography>
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        {visitList?.total} waiting
      </Typography>
      <VisitTable data={visitList?.data ?? []} loading={visitLoading} />
    </BigscreenWrapper>
  );
};
