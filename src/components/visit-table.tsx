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
  const fullSpan = showStatus ? 4 : 3;
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell width="60%">Name</TableCell>
            {showStatus && <TableCell>Status</TableCell>}
            <TableCell align="right">Waited</TableCell>
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
              <TableRow key={record.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <strong>{record.visitor_name}</strong>
                </TableCell>
                {showStatus && <TableCell>{record.status}</TableCell>}
                <TableCell align="right">
                  {dayjs(record.entered_at).fromNow(true)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={fullSpan} sx={{ textAlign: "center" }}>
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
