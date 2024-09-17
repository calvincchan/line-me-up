import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect } from "react";
import { IVisit } from "../../interfaces";
import { supabaseClient } from "../../utilities/supabase-client";
import { BigscreenWrapper } from "./wrapper";

dayjs.extend(relativeTime);

export const PublicScreen: React.FC = () => {
  const [records, setRecords] = React.useState<IVisit[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const { data } = await supabaseClient
        .from("visit")
        .select<"*", IVisit>("*")
        .eq("status", "Waiting");
      setRecords(data ?? []);
    };
    fetchRecords();
  }, []);

  return (
    <BigscreenWrapper>
      <Typography variant="h3" sx={{ textAlign: "center" }}>
        {import.meta.env.VITE_LOCATION_NAME} Waitlist
      </Typography>
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        2 waiting
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell width="60%">Name</TableCell>
              <TableCell align="right">Waited</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={record.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <strong>{record.visitor_name}</strong>
                </TableCell>
                <TableCell align="right">
                  {dayjs(record.entered_at).fromNow(true)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </BigscreenWrapper>
  );
};
