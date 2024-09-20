import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IVisitorDetailsForm } from "../../interfaces";
import { createVisit } from "../../utilities/app-sdk";
import { KioskWrapper } from "./wrapper";

export const KioskDetails: React.FC = () => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<IVisitorDetailsForm, HttpError, IVisitorDetailsForm>();

  const navigate = useNavigate();

  const onSubmit = async (data: IVisitorDetailsForm) => {
    try {
      const result = await createVisit(data);
      if (result.status === "existing") {
        alert("You are already in the waitlist.");
      }
      if (result.visitId) {
        navigate("/kiosk/submitted", { state: { visitId: result.visitId } });
      } else {
        console.log(result);
        alert("Unknown error");
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <KioskWrapper>
      <Card>
        <CardContent>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            {import.meta.env.VITE_LOCATION_NAME}
          </Typography>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Enter your details
          </Typography>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column" }}
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 5,
                gap: 2,
              }}
            >
              <LoadingButton
                variant="contained"
                sx={{ width: "60%" }}
                type="submit"
                loading={isSubmitting}
              >
                Join the Line
              </LoadingButton>
              <Link to="/kiosk">
                <Button>Cancel</Button>
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </KioskWrapper>
  );
};
