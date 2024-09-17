import LoadingButton from "@mui/lab/LoadingButton";
import { Card, CardContent, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { PostgrestError } from "@supabase/postgrest-js";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { IVisit, IVisitor, IVisitorDetailsForm } from "../../interfaces";
import { cleanNumber } from "../../utilities/clean-number";
import { supabaseClient } from "../../utilities/supabase-client";
import { KioskWrapper } from "./wrapper";

export const KioskDetails: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IVisitorDetailsForm>();

  const [submitting, setSubmitting] = React.useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data: IVisitorDetailsForm) => {
    setSubmitting(true);
    const cleanPhone = cleanNumber(data.phone);

    /* check if the phone number is already registered */
    const { count: countVisitor } = await supabaseClient
      .from("visitor")
      .select("*", { count: "exact", head: true })
      .eq("phone", cleanPhone)
      .single();
    const isRegistered = countVisitor && countVisitor > 0;

    /* Insert or update the visitor data */
    let visitorData: IVisitor | null = null;
    let visitorError: PostgrestError | null = null;
    if (isRegistered) {
      const { error, data: result } = await supabaseClient
        .from("visitor")
        .update({
          name: String(data.name).trim(),
        })
        .eq("phone", cleanPhone)
        .select<"*", IVisitor>("*")
        .single();
      visitorError = error;
      visitorData = result;
    } else {
      const { error, data: result } = await supabaseClient
        .from("visitor")
        .insert({
          name: String(data.name).trim(),
          phone: cleanPhone,
        })
        .select<"*", IVisitor>("*")
        .single();
      visitorError;
      visitorData = result;
    }
    if (visitorError) {
      alert("An error occurred:\n" + visitorError.message);
      setSubmitting(false);
      return;
    }
    if (!visitorData) {
      alert("An error occurred: Visitor data is missing");
      setSubmitting(false);
      return;
    }

    /* Any active visit? */
    const { data: existingVisitData } = await supabaseClient
      .from("visit")
      .select<"id", IVisit>("id")
      .eq("visitor", visitorData.id)
      .single();
    if (existingVisitData) {
      alert("You are already in the line.");
      setSubmitting(false);
      navigate("/kiosk/submitted", {
        state: { visitId: existingVisitData.id },
      });
      return;
    }

    /* Create a visit */
    const { data: visitData } = await supabaseClient
      .from("visit")
      .insert({
        visitor: visitorData.id,
        visitor_name: visitorData.name,
        status: "Waiting",
        entered_at: new Date().toISOString(),
      })
      .select<"id", IVisit>("id")
      .single();
    if (!visitData) {
      alert("An error occurred: unable to create a visit");
      setSubmitting(false);
      return;
    }

    /* Process to status screen */
    setSubmitting(false);
    navigate("/kiosk/submitted", { state: { visitId: visitData.id } });
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
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <LoadingButton
                variant="contained"
                sx={{ width: "60%" }}
                type="submit"
                loading={submitting}
              >
                Join the Line
              </LoadingButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </KioskWrapper>
  );
};
