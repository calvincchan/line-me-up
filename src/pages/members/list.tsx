import { EditButton, List, useDataGrid } from "@refinedev/mui";
import React from "react";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import dayjs from "dayjs";
import type { IMember } from "../../interfaces";

export const MemberList: React.FC = () => {
  const { dataGridProps } = useDataGrid<IMember>();

  const columns = React.useMemo<GridColDef<IMember>[]>(
    () => [
      { field: "name", headerName: "Name", minWidth: 200, flex: 1 },
      { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
      { field: "role", headerName: "Role" },
      {
        field: "last_sign_in_at",
        headerName: "Last Sign In",
        minWidth: 300,
        renderCell: ({ value }) => (value ? dayjs(value).format("LLL") : "---"),
      },
      {
        field: "id",
        headerName: "ID",
        type: "string",
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: function render({ row }) {
          return <EditButton hideText recordItemId={row.id} />;
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
};
