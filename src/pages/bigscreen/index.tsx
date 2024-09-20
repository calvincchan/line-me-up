import { Typography } from "@mui/material";
import { useList } from "@refinedev/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useMemo } from "react";
import { VisitTable } from "../../components/visit-table";
import { IVisit } from "../../interfaces";
import { BigscreenWrapper } from "./wrapper";

dayjs.extend(relativeTime);

interface Props {
  startContent?: React.ReactNode;
}

export const PublicScreen: React.FC<Props> = ({ startContent }) => {
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
    <BigscreenWrapper>
      {startContent}
      <Typography variant="h3" sx={{ textAlign: "center" }}>
        {import.meta.env.VITE_LOCATION_NAME} Waitlist
      </Typography>
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        {waiting} waiting
        <br />
        Estimated time: (TODO)
      </Typography>
      <VisitTable data={visitList?.data ?? []} loading={visitLoading} />
    </BigscreenWrapper>
  );
};
