import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { IVisit } from "../interfaces";

interface Prop {
  data: IVisit[];
  showStatus?: boolean;
  loading?: boolean;
}

export const VisitTable: React.FC<Prop> = ({
  data,
  showStatus = false,
  loading = false,
}) => {
  const [counter, setCounter] = useState(0);
  /* force re-render wait time every 10 seconds */
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fullSpan = showStatus ? 4 : 3;

  function rowStyles(status: string) {
    return status === "Calling"
      ? { backgroundColor: "yellow" }
      : status === "Serving"
      ? { backgroundColor: "lightgreen" }
      : {};
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell width="70%">Name</TableCell>
            {showStatus && <TableCell>Status</TableCell>}
            <TableCell>Waited</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={fullSpan} sx={{ textAlign: "center" }}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : data.length ? (
            data.map((record, index) => (
              <TableRow key={record.id} sx={rowStyles(record.status)}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <strong>{record.visitor_name}</strong>
                  {record.status === "Calling" && (
                    <span>
                      {" "}
                      → 🔔 Proceed to <strong>{record.station_name}</strong>
                    </span>
                  )}
                  {record.status === "Serving" && (
                    <span> → 🚀 {record.station_name}</span>
                  )}
                </TableCell>
                {showStatus && <TableCell>{record.status}</TableCell>}
                <TableCell key={`visit-table-waited-${counter}`}>
                  {dayjs(record.entered_at).fromNow(true)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={fullSpan} sx={{ textAlign: "center" }}>
                Empty
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
