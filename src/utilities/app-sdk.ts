import { PostgrestError } from "@supabase/supabase-js";
import dayjs from "dayjs";
import { IStation, IVisit, IVisitor, IVisitorDetailsForm } from "../interfaces";
import { cleanNumber } from "./clean-number";
import { supabaseClient } from "./supabase-client";

/**
 * Create a new visit record at kiosk.
 */
export async function createVisit(formValues: IVisitorDetailsForm): Promise<{
  status: "existing" | "new";
  visitId: string;
}> {
  const cleanName = String(formValues.name).trim();
  const cleanPhone = cleanNumber(formValues.phone);

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
        name: cleanName,
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
        name: cleanName,
        phone: cleanPhone,
      })
      .select<"*", IVisitor>("*")
      .single();
    visitorError;
    visitorData = result;
  }
  if (visitorError) {
    throw new Error("An error occurred:\n" + visitorError.message);
  }
  if (!visitorData) {
    throw new Error("An error occurred: Visitor data is missing");
  }

  /* Any active visit? */
  const { data: existingVisitData } = await supabaseClient
    .from("visit")
    .select<"id", IVisit>("id")
    .eq("visitor", visitorData.id)
    .single();
  if (existingVisitData) {
    return {
      status: "existing",
      visitId: existingVisitData.id,
    };
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
    throw new Error("An error occurred: unable to create a visit");
  }

  /* Process to status screen */
  return {
    status: "new",
    visitId: visitData.id,
  };
}

/**
 * User checks in a closed station.
 */
export async function checkInStation(
  userId: string,
  userName: string,
  stationId: number
) {
  /* check if station is closed */
  const { data: station } = await supabaseClient
    .from("station")
    .select<"*", IStation>()
    .eq("id", stationId)
    .single();
  if (!station) {
    throw new Error("Station not found");
  }
  if (station.status !== "Closed") {
    throw new Error("Station is not closed");
  }

  /* make sure user is not already serving a station */
  const { count: servingStation } = await supabaseClient
    .from("station")
    .select("*", { count: "exact", head: true })
    .eq("opened_by", userId);
  if (servingStation === null || servingStation > 0) {
    throw new Error("User is already serving a station");
  }

  /* update station status to open */
  const { error: updateError } = await supabaseClient
    .from("station")
    .update({
      status: "Open",
      opened_by: userId,
      opened_at: new Date(),
      opened_by_name: userName,
    })
    .eq("id", stationId);
  if (updateError) {
    throw new Error("Failed to update station");
  }

  return true;
}

/**
 * User checks out an open station.
 */
export async function checkOutStation(userId: string, stationId: number) {
  /* check if station is open and not serving anyone */
  const { data: station } = await supabaseClient
    .from("station")
    .select<"*", IStation>()
    .eq("id", stationId)
    .single();
  if (!station) {
    throw new Error("Station not found");
  }
  if (station.status !== "Open") {
    throw new Error("Station is not open or current serving visitor");
  }

  /* check if user is the one who opened the station */
  if (station.opened_by !== userId) {
    throw new Error("User is not the one who opened the station");
  }

  /* update station status */
  const { error: updateError } = await supabaseClient
    .from("station")
    .update({
      status: "Closed",
      opened_by: null,
      opened_at: null,
      opened_by_name: null,
    })
    .eq("id", stationId);
  if (updateError) {
    throw new Error("Failed to update station");
  }

  return true;
}

/**
 * Call the next waiting visitor to a station.
 */
export async function callNextVisitor(stationId: number) {
  /* check if station is open and not serving anyone */
  const { data: station } = await supabaseClient
    .from("station")
    .select<"*", IStation>()
    .eq("id", stationId)
    .single();
  if (!station) {
    throw new Error("Station not found");
  }
  if (station.status !== "Open") {
    throw new Error("Station is not open or current serving visitor");
  }

  /* find the next waiting visitor */
  const { data: nextVisit } = await supabaseClient
    .from("visit")
    .select<"*", IVisit>()
    .eq("status", "Waiting")
    .order("entered_at", { ascending: true })
    .limit(1)
    .single();
  if (!nextVisit) {
    throw new Error("No waiting visitor");
  }

  /* update station and visit */
  const { error: updateError } = await supabaseClient
    .from("station")
    .update({
      status: "Calling",
      called_at: new Date(),
      visit: nextVisit.id,
      visitor_name: nextVisit.visitor_name,
    })
    .eq("id", stationId);
  if (updateError) {
    throw new Error("Failed to update station");
  }
  const { error: updateVisitError } = await supabaseClient
    .from("visit")
    .update({
      status: "Calling",
      station: stationId,
      station_name: station.name,
    })
    .eq("id", nextVisit.id);
  if (updateVisitError) {
    throw new Error("Failed to update visit");
  }

  return true;
}

export async function cancelCall(stationId: number) {
  /* check if station is calling */
  const { data: station } = await supabaseClient
    .from("station")
    .select<"*", IStation>()
    .eq("id", stationId)
    .single();
  if (!station) {
    throw new Error("Station not found");
  }
  if (station.status !== "Calling") {
    throw new Error("Station is not calling");
  }
  if (dayjs().diff(station.called_at, "minute") < 1) {
    throw new Error("Cannot cancel call within 1 minute");
  }
  const visitId = station.visit;

  /* update station status */
  const { error: updateError } = await supabaseClient
    .from("station")
    .update({
      status: "Open",
      visit: null,
      visitor_name: null,
      called_at: null,
      served_at: null,
    })
    .eq("id", stationId);
  if (updateError) {
    throw new Error("Failed to update station");
  }

  /* cancel visit and backup */
  const { data: visit, error: updateVisitError } = await supabaseClient
    .from("visit")
    .update({
      status: "Cancelled",
      station: null,
      station_name: null,
      cancelled_at: new Date(),
    })
    .eq("id", visitId)
    .select<"*", IVisit>("*")
    .single();
  if (updateVisitError) {
    throw new Error("Failed to update visit");
  }
  if (visit) {
    await supabaseClient.from("previous_visit").insert({
      visitor: visit.visitor,
      visitor_name: visit.visitor_name,
      station: stationId,
      station_name: station.name,
      entered_at: visit.entered_at,
      cancelled_at: visit.cancelled_at,
      status: "Cancelled",
      wait_minutes: dayjs(visit.cancelled_at).diff(
        dayjs(visit.entered_at),
        "minute"
      ),
    });
    await supabaseClient.from("visit").delete().eq("id", visit.id);
  }

  return true;
}

/**
 * Start serving a visitor at a station.
 */
export async function startService(stationId: number) {
  /* check if station is calling */
  const { data: station } = await supabaseClient
    .from("station")
    .select<"*", IStation>()
    .eq("id", stationId)
    .single();
  if (!station) {
    throw new Error("Station not found");
  }
  if (station.status !== "Calling") {
    throw new Error("Station is not calling");
  }

  /* update station status */
  const { error: updateError } = await supabaseClient
    .from("station")
    .update({
      status: "Serving",
      served_at: new Date(),
    })
    .eq("id", stationId);
  if (updateError) {
    throw new Error("Failed to update station");
  }

  /* update visit status */
  const { error: updateVisitError } = await supabaseClient
    .from("visit")
    .update({
      status: "Serving",
      station: stationId,
      station_name: station.name,
      served_at: new Date(),
      served_by_name: station.opened_by_name,
    })
    .eq("id", station.visit);
  if (updateVisitError) {
    throw new Error("Failed to update visit");
  }

  return true;
}

export async function completeService(stationId: number) {
  /* check if station is serving */
  const { data: station } = await supabaseClient
    .from("station")
    .select<"*", IStation>()
    .eq("id", stationId)
    .single();
  if (!station) {
    throw new Error("Station not found");
  }
  if (station.status !== "Serving") {
    throw new Error("Station is not serving");
  }

  /* update station status */
  const { error: updateError } = await supabaseClient
    .from("station")
    .update({
      status: "Open",
      called_at: null,
      served_at: null,
      visit: null,
      visitor_name: null,
    })
    .eq("id", stationId);
  if (updateError) {
    throw new Error("Failed to update station");
  }

  /* update visit status */
  const { data: visit, error: updateVisitError } = await supabaseClient
    .from("visit")
    .update({
      status: "Completed",
      completed_at: new Date(),
    })
    .eq("id", station.visit)
    .select<"*", IVisit>("*")
    .single();
  if (updateVisitError) {
    throw new Error("Failed to update visit");
  }

  /* save to history and delete original record */
  if (visit) {
    await supabaseClient.from("previous_visit").insert({
      visitor: visit.visitor,
      visitor_name: visit.visitor_name,
      station: stationId,
      station_name: station.name,
      entered_at: visit.entered_at,
      served_at: visit.served_at,
      served_by_name: visit.served_by_name,
      completed_at: visit.completed_at,
      wait_minutes: dayjs(visit.served_at).diff(
        dayjs(visit.entered_at),
        "minute"
      ),
      serve_minutes: dayjs(visit.completed_at).diff(
        dayjs(visit.served_at),
        "minute"
      ),
      status: "Completed",
    });
    await supabaseClient.from("visit").delete().eq("id", visit.id);
  }

  return true;
}

export async function visitorCancelVisit(visitId: string) {
  /* check if visit is waiting */
  const { data: visit } = await supabaseClient
    .from("visit")
    .select<"*", IVisit>()
    .eq("id", visitId)
    .single();
  if (!visit) {
    throw new Error("Visit not found");
  }
  if (visit.status === "Calling") {
    throw new Error("You cannot cancel a visit that is being called");
  }
  if (visit.status !== "Waiting") {
    throw new Error("Visit is not waiting");
  }

  /* update visit status */
  const { error: updateError } = await supabaseClient
    .from("visit")
    .update({
      status: "Cancelled",
      cancelled_at: new Date(),
    })
    .eq("id", visitId);
  if (updateError) {
    throw new Error("Failed to update visit");
  }

  /* save to history */
  await supabaseClient.from("previous_visit").insert({
    visitor: visit.visitor,
    visitor_name: visit.visitor_name,
    station: visit.station,
    station_name: visit.station_name,
    entered_at: visit.entered_at,
    cancelled_at: visit.cancelled_at,
    status: "Cancelled",
    wait_minutes: dayjs(visit.cancelled_at).diff(
      dayjs(visit.entered_at),
      "minute"
    ),
  });

  /* delete original visit */
  await supabaseClient.from("visit").delete().eq("id", visitId);

  return true;
}

export async function visitorEditDetails(
  visitorId: string,
  formValues: IVisitorDetailsForm
) {
  const cleanFormValues: IVisitorDetailsForm = {
    name: String(formValues.name).trim(),
    phone: cleanNumber(formValues.phone),
  };

  /* Update visitor */
  await supabaseClient
    .from("visitor")
    .update(cleanFormValues)
    .eq("id", visitorId);

  /* Update denormalized values in visit */
  const { data: visit } = await supabaseClient
    .from("visit")
    .update({
      visitor_name: cleanFormValues.name,
    })
    .eq("visitor", visitorId)
    .select<"*", IVisit>("*")
    .single();

  /* Update denormalized values in station */
  if (visit) {
    await supabaseClient
      .from("station")
      .update({
        visitor_name: cleanFormValues.name,
      })
      .eq("visit", visit.id);
  }
  return true;
}
