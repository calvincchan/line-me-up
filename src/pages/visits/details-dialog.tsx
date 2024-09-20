import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";
import { IVisit, IVisitorDetailsForm } from "../../interfaces";
import { visitorEditDetails } from "../../utilities/app-sdk";

interface Props {
  open: boolean;
  onClose: () => void;
  visitorId: string;
}

const DetailsDialog: React.FC<Props> = ({ open, onClose, visitorId }) => {
  const {
    refineCore: { onFinish, formLoading, query },
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    saveButtonProps,
  } = useForm<IVisit, HttpError, IVisitorDetailsForm>({
    refineCoreProps: {
      resource: "visitor",
      action: "edit",
      id: visitorId,
    },
  });

  const onSubmit = async (data: IVisitorDetailsForm) => {
    if (!visitorId) return;
    await visitorEditDetails(visitorId, data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Details</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column" }}
          autoComplete="off"
        >
          <TextField
            variant="filled"
            label="Name *"
            margin="normal"
            {...register("name", {
              required: "This field is required",
            })}
            error={!!errors?.name}
            helperText={errors.name?.message as string}
          />
          <TextField
            variant="filled"
            label="Phone number *"
            margin="normal"
            {...register("phone", {
              required: "This field is required",
            })}
            error={!!errors?.phone}
            helperText={errors.phone?.message as string}
          />
          <Typography variant="body2">
            For testing purpose, no real SMS will be sent.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <LoadingButton
          loading={formLoading || isSubmitting}
          variant="contained"
          onClick={handleSubmit(onSubmit)}
        >
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsDialog;
