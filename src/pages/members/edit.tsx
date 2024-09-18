import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import type { HttpError } from "@refinedev/core";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

import { Controller } from "react-hook-form";

import type { IMember, IMemberRole, Nullable } from "../../interfaces";

export const MembertEdit: React.FC = () => {
  const {
    saveButtonProps,
    refineCore: { query: queryResult },
    register,
    control,
    formState: { errors },
  } = useForm<IMember, HttpError, Nullable<IMember>>();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("name", {
            required: "This field is required",
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
          margin="normal"
          fullWidth
          label="Name"
          name="name"
          autoFocus
        />
        <Controller
          control={control}
          name="role"
          rules={{ required: "This field is required" }}
          // eslint-disable-next-line
          defaultValue={null as any}
          render={({ field }) => (
            <Autocomplete<IMemberRole>
              options={["Admin", "Staff"]}
              {...field}
              onChange={(_, value) => {
                field.onChange(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Status"
                  margin="normal"
                  variant="outlined"
                  error={!!errors.role}
                  helperText={errors.role?.message}
                  required
                />
              )}
            />
          )}
        />
      </Box>
    </Edit>
  );
};
