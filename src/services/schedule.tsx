"use server";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();
interface Schedule {
  id: number;
  location_id: number;
  team_a: number;
  team_b: number;
  status: string;
  date_and_time: string;
}

// Create (Insert Schedule)
export async function createSchedule(
  location_id: number,
  team_a: number,
  team_b: number,
  status: string,
  date_and_time: string
): Promise<Schedule | string> {
  try {
    const { data, error } = await supabase
      .from("schedule")
      .insert({
        location_id: location_id,
        team_a: team_a,
        team_b: team_b,
        status: status,
        date_and_time: date_and_time,
      })
      .select()
      .maybeSingle<Schedule>();

    if (error) {
      return `Error creating schedule: ${error.message}`;
    }
    return data as Schedule;
  } catch (error) {
    throw error;
  }
}

// Read (Fetch Records)
export async function getSchedules(schedule_id?: number) {
  try {
    const query = supabase.from("schedule").select("*");

    if (schedule_id) {
      query.eq("scheduleId", schedule_id);
    }

    const { data, error } = await query;
    if (error) {
      return `Error fetching schedules: ${error.message}`;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

// Update (Modify Record)
export async function updateSchedule(
  schedule_id: number,
  updates: {
    location_id?: number;
    team_a?: number;
    team_b?: number;
    status?: string;
    date_and_time?: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from("schedule")
      .update(updates)
      .match({ schedule_id: schedule_id })
      .select()
      .maybeSingle();

    if (error) {
      return `Error updating schedule: ${error.message}`;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

// Delete (Remove Record)
export async function deleteSchedule(schedule_id: number) {
  try {
    const { data, error } = await supabase
      .from("schedule")
      .delete()
      .match({ schedule_id: schedule_id });

    if (error) {
      return `Error deleting schedule: ${error.message}`;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
