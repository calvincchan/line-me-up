import { IStation } from "../interfaces";
import { supabaseClient } from "./supabase-client";

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
  console.log("🚀 ~ checkInStation ~ servingStation:", servingStation);
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
