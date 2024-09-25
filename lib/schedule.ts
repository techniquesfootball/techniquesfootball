"use server";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export type ScheduleDetails = {
  schedule_id: string;
  date_and_time: string;
  contact_person: string;
  team_a_id: string;
  team_a_defender_1_name: string;
  team_a_defender_2_name: string;
  team_a_defender_3_name: string;
  team_a_defender_4_name: string;
  team_a_mid_fielder_1_name: string;
  team_a_mid_fielder_2_name: string;
  team_a_mid_fielder_3_name: string;
  team_a_striker_1_name: string;
  team_a_striker_2_name: string;
  team_a_defender_1: string;
  team_a_defender_2: string;
  team_a_defender_3: string;
  team_a_defender_4: string;
  team_a_mid_fielder_1: string;
  team_a_mid_fielder_2: string;
  team_a_mid_fielder_3: string;
  team_a_striker_1: string;
  team_a_striker_2: string;
  team_a_defender_1_price: string;
  team_a_defender_2_price: string;
  team_a_defender_3_price: string;
  team_a_defender_4_price: string;
  team_a_mid_fielder_1_price: string;
  team_a_mid_fielder_2_price: string;
  team_a_mid_fielder_3_price: string;
  team_a_striker_1_price: string;
  team_a_striker_2_price: string;
  team_b_id: string;
  team_b_defender_1_name: string;
  team_b_defender_2_name: string;
  team_b_defender_3_name: string;
  team_b_defender_4_name: string;
  team_b_mid_fielder_1_name: string;
  team_b_mid_fielder_2_name: string;
  team_b_mid_fielder_3_name: string;
  team_b_striker_1_name: string;
  team_b_striker_2_name: string;
  team_b_defender_1: string;
  team_b_defender_2: string;
  team_b_defender_3: string;
  team_b_defender_4: string;
  team_b_mid_fielder_1: string;
  team_b_mid_fielder_2: string;
  team_b_mid_fielder_3: string;
  team_b_striker_1: string;
  team_b_striker_2: string;
  team_b_defender_1_price: string;
  team_b_defender_2_price: string;
  team_b_defender_3_price: string;
  team_b_defender_4_price: string;
  team_b_mid_fielder_1_price: string;
  team_b_mid_fielder_2_price: string;
  team_b_mid_fielder_3_price: string;
  team_b_striker_1_price: string;
  team_b_striker_2_price: string;
};

export interface Schedule {
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
export async function getSchedules(
  location_id?: number
): Promise<ScheduleDetails[] | string> {
  try {
    let query = supabase.from("schedule").select(`
        schedule_id,
        team_a:team!schedule_team_a_fkey (
          defender_1:profiles!team_defender_1_fkey (full_name, email, id),
          defender_2:profiles!team_defender_2_fkey (full_name, email, id),
          defender_3:profiles!team_defender_3_fkey (full_name, email, id),
          defender_4:profiles!team_defender_4_fkey (full_name, email, id),
          mid_fielder_1:profiles!team_mid_fielder_1_fkey (full_name, email, id),
          mid_fielder_2:profiles!team_mid_fielder_2_fkey (full_name, email, id),
          mid_fielder_3:profiles!team_mid_fielder_3_fkey (full_name, email, id),
          striker_1:profiles!team_striker_1_fkey (full_name, email, id),
          striker_2:profiles!team_striker_2_fkey (full_name, email, id),
          defender_1_price,
          defender_2_price,
          defender_3_price,
          defender_4_price,
          mid_fielder_1_price,
          mid_fielder_2_price,
          mid_fielder_3_price,
          striker_1_price,
          striker_2_price
        ),
        team_b:team!schedule_team_b_fkey (
          defender_1:profiles!team_defender_1_fkey (full_name, email, id),
          defender_2:profiles!team_defender_2_fkey (full_name, email, id),
          defender_3:profiles!team_defender_3_fkey (full_name, email, id),
          defender_4:profiles!team_defender_4_fkey (full_name, email, id),
          mid_fielder_1:profiles!team_mid_fielder_1_fkey (full_name, email, id),
          mid_fielder_2:profiles!team_mid_fielder_2_fkey (full_name, email, id),
          mid_fielder_3:profiles!team_mid_fielder_3_fkey (full_name, email, id),
          striker_1:profiles!team_striker_1_fkey (full_name, email, id),
          striker_2:profiles!team_striker_2_fkey (full_name, email, id),
          defender_1_price,
          defender_2_price,
          defender_3_price,
          defender_4_price,
          mid_fielder_1_price,
          mid_fielder_2_price,
          mid_fielder_3_price,
          striker_1_price,
          striker_2_price
        ),
        date_and_time,
        location:location_id (contact_person)
      `);
    if (location_id) {
      query = query.eq("location_id", location_id);
    }
    const { data, error } = await query;
    if (error) {
      console.log(error);
      return `Error fetching schedules: ${error.message}`;
    }

    // Transform the data to match the Schedule type
    const transformedData: ScheduleDetails[] = data.map((schedule: any) => ({
      schedule_id: schedule.schedule_id,
      date_and_time: schedule.date_and_time,
      contact_person: schedule.location.contact_person,
      team_a_id: schedule.team_a,
      team_b_id: schedule.team_b,
      team_a_defender_1_name: schedule.team_a.defender_1?.full_name ?? "",
      team_a_defender_2_name: schedule.team_a.defender_2?.full_name ?? "",
      team_a_defender_3_name: schedule.team_a.defender_3?.full_name ?? "",
      team_a_defender_4_name: schedule.team_a.defender_4?.full_name ?? "",
      team_a_mid_fielder_1_name:
        schedule.team_a.mid_fielder_1?.full_name ?? "",
      team_a_mid_fielder_2_name:
        schedule.team_a.mid_fielder_2?.full_name ?? "",
      team_a_mid_fielder_3_name:
        schedule.team_a.mid_fielder_3?.full_name ?? "",
      team_a_striker_1_name: schedule.team_a.striker_1?.full_name ?? "",
      team_a_striker_2_name: schedule.team_a.striker_2?.full_name ?? "",
      team_a_defender_1: schedule.team_a.defender_1?.id ?? "",
      team_a_defender_2: schedule.team_a.defender_2?.id ?? "",
      team_a_defender_3: schedule.team_a.defender_3?.id ?? "",
      team_a_defender_4: schedule.team_a.defender_4?.id ?? "",
      team_a_mid_fielder_1: schedule.team_a.mid_fielder_1?.id ?? "",
      team_a_mid_fielder_2: schedule.team_a.mid_fielder_2?.id ?? "",
      team_a_mid_fielder_3: schedule.team_a.mid_fielder_3?.id ?? "",
      team_a_striker_1: schedule.team_a.striker_1?.id ?? "",
      team_a_striker_2: schedule.team_a.striker_2?.id ?? "",
      team_a_defender_1_price: schedule.team_a.defender_1_price ?? "",
      team_a_defender_2_price: schedule.team_a.defender_2_price ?? "",
      team_a_defender_3_price: schedule.team_a.defender_3_price ?? "",
      team_a_defender_4_price: schedule.team_a.defender_4_price ?? "",
      team_a_mid_fielder_1_price: schedule.team_a.mid_fielder_1_price ?? "",
      team_a_mid_fielder_2_price: schedule.team_a.mid_fielder_2_price ?? "",
      team_a_mid_fielder_3_price: schedule.team_a.mid_fielder_3_price ?? "",
      team_a_striker_1_price: schedule.team_a.striker_1_price ?? "",
      team_a_striker_2_price: schedule.team_a.striker_2_price ?? "",
      team_b_defender_1_name: schedule.team_b.defender_1?.full_name ?? "",
      team_b_defender_2_name: schedule.team_b.defender_2?.full_name ?? "",
      team_b_defender_3_name: schedule.team_b.defender_3?.full_name ?? "",
      team_b_defender_4_name: schedule.team_b.defender_4?.full_name ?? "",
      team_b_mid_fielder_1_name:
        schedule.team_b.mid_fielder_1?.full_name ?? "",
      team_b_mid_fielder_2_name:
        schedule.team_b.mid_fielder_2?.full_name ?? "",
      team_b_mid_fielder_3_name:
        schedule.team_b.mid_fielder_3?.full_name ?? "",
      team_b_striker_1_name: schedule.team_b.striker_1?.full_name ?? "",
      team_b_striker_2_name: schedule.team_b.striker_2?.full_name ?? "",
      team_b_defender_1: schedule.team_b.defender_1?.id ?? "",
      team_b_defender_2: schedule.team_b.defender_2?.id ?? "",
      team_b_defender_3: schedule.team_b.defender_3?.id ?? "",
      team_b_defender_4: schedule.team_b.defender_4?.id ?? "",
      team_b_mid_fielder_1: schedule.team_b.mid_fielder_1?.id ?? "",
      team_b_mid_fielder_2: schedule.team_b.mid_fielder_2?.id ?? "",
      team_b_mid_fielder_3: schedule.team_b.mid_fielder_3?.id ?? "",
      team_b_striker_1: schedule.team_b.striker_1?.id ?? "",
      team_b_striker_2: schedule.team_b.striker_2?.id ?? "",
      team_b_defender_1_price: schedule.team_b.defender_1?.pri ?? "",
      team_b_defender_2_price: schedule.team_b.defender_2?.id ?? "",
      team_b_defender_3_price: schedule.team_b.defender_3?.id ?? "",
      team_b_defender_4_price: schedule.team_b.defender_4?.id ?? "",
      team_b_mid_fielder_1_price: schedule.team_b.mid_fielder_1_price ?? "",
      team_b_mid_fielder_2_price: schedule.team_b.mid_fielder_2_price ?? "",
      team_b_mid_fielder_3_price: schedule.team_b.mid_fielder_3_price ?? "",
      team_b_striker_1_price: schedule.team_b.striker_1_price ?? "",
      team_b_striker_2_price: schedule.team_b.striker_2_price ?? "",
    }));
    return transformedData;
  } catch (error) {
    throw error;
  }
}

// Read (Fetch Records)
export async function getAllSchedules(): Promise<ScheduleDetails[] | string> {
  try {
    let query = supabase.from("schedule").select(`
        schedule_id,
        team_a,
        team_a_array:team!schedule_team_a_fkey (
          defender_1:profiles!team_defender_1_fkey (full_name, email, id),
          defender_2:profiles!team_defender_2_fkey (full_name, email, id),
          defender_3:profiles!team_defender_3_fkey (full_name, email, id),
          defender_4:profiles!team_defender_4_fkey (full_name, email, id),
          mid_fielder_1:profiles!team_mid_fielder_1_fkey (full_name, email, id),
          mid_fielder_2:profiles!team_mid_fielder_2_fkey (full_name, email, id),
          mid_fielder_3:profiles!team_mid_fielder_3_fkey (full_name, email, id),
          striker_1:profiles!team_striker_1_fkey (full_name, email, id),
          striker_2:profiles!team_striker_2_fkey (full_name, email, id),
          defender_1_price,
          defender_2_price,
          defender_3_price,
          defender_4_price,
          mid_fielder_1_price,
          mid_fielder_2_price,
          mid_fielder_3_price,
          striker_1_price,
          striker_2_price
        ),
        team_b,
        team_b_array:team!schedule_team_b_fkey (
          defender_1:profiles!team_defender_1_fkey (full_name, email, id),
          defender_2:profiles!team_defender_2_fkey (full_name, email, id),
          defender_3:profiles!team_defender_3_fkey (full_name, email, id),
          defender_4:profiles!team_defender_4_fkey (full_name, email, id),
          mid_fielder_1:profiles!team_mid_fielder_1_fkey (full_name, email, id),
          mid_fielder_2:profiles!team_mid_fielder_2_fkey (full_name, email, id),
          mid_fielder_3:profiles!team_mid_fielder_3_fkey (full_name, email, id),
          striker_1:profiles!team_striker_1_fkey (full_name, email, id),
          striker_2:profiles!team_striker_2_fkey (full_name, email, id),
          defender_1_price,
          defender_2_price,
          defender_3_price,
          defender_4_price,
          mid_fielder_1_price,
          mid_fielder_2_price,
          mid_fielder_3_price,
          striker_1_price,
          striker_2_price
        ),
        date_and_time,
        location:location_id (contact_person)
      `);
    const { data, error } = await query;
    if (error) {
      console.log(error);
      return `Error fetching schedules: ${error.message}`;
    }

    // Transform the data to match the Schedule type
    const transformedData: ScheduleDetails[] = data.map((schedule: any) => ({
      schedule_id: schedule.schedule_id,
      date_and_time: schedule.date_and_time,
      contact_person: schedule.location.contact_person,
      team_a_id: schedule.team_a,
      team_b_id: schedule.team_b,
      team_a_defender_1_name: schedule.team_a_array.defender_1?.full_name ?? "",
      team_a_defender_2_name: schedule.team_a_array.defender_2?.full_name ?? "",
      team_a_defender_3_name: schedule.team_a_array.defender_3?.full_name ?? "",
      team_a_defender_4_name: schedule.team_a_array.defender_4?.full_name ?? "",
      team_a_mid_fielder_1_name:
        schedule.team_a_array.mid_fielder_1?.full_name ?? "",
      team_a_mid_fielder_2_name:
        schedule.team_a_array.mid_fielder_2?.full_name ?? "",
      team_a_mid_fielder_3_name:
        schedule.team_a_array.mid_fielder_3?.full_name ?? "",
      team_a_striker_1_name: schedule.team_a_array.striker_1?.full_name ?? "",
      team_a_striker_2_name: schedule.team_a_array.striker_2?.full_name ?? "",
      team_a_defender_1: schedule.team_a_array.defender_1?.id ?? "",
      team_a_defender_2: schedule.team_a_array.defender_2?.id ?? "",
      team_a_defender_3: schedule.team_a_array.defender_3?.id ?? "",
      team_a_defender_4: schedule.team_a_array.defender_4?.id ?? "",
      team_a_mid_fielder_1: schedule.team_a_array.mid_fielder_1?.id ?? "",
      team_a_mid_fielder_2: schedule.team_a_array.mid_fielder_2?.id ?? "",
      team_a_mid_fielder_3: schedule.team_a_array.mid_fielder_3?.id ?? "",
      team_a_striker_1: schedule.team_a_array.striker_1?.id ?? "",
      team_a_striker_2: schedule.team_a_array.striker_2?.id ?? "",
      team_a_defender_1_price: schedule.team_a_array.defender_1_price ?? "",
      team_a_defender_2_price: schedule.team_a_array.defender_2_price ?? "",
      team_a_defender_3_price: schedule.team_a_array.defender_3_price ?? "",
      team_a_defender_4_price: schedule.team_a_array.defender_4_price ?? "",
      team_a_mid_fielder_1_price: schedule.team_a_array.mid_fielder_1_price ?? "",
      team_a_mid_fielder_2_price: schedule.team_a_array.mid_fielder_2_price ?? "",
      team_a_mid_fielder_3_price: schedule.team_a_array.mid_fielder_3_price ?? "",
      team_a_striker_1_price: schedule.team_a_array.striker_1_price ?? "",
      team_a_striker_2_price: schedule.team_a_array.striker_2_price ?? "",
      team_b_defender_1_name: schedule.team_b_array.defender_1?.full_name ?? "",
      team_b_defender_2_name: schedule.team_b_array.defender_2?.full_name ?? "",
      team_b_defender_3_name: schedule.team_b_array.defender_3?.full_name ?? "",
      team_b_defender_4_name: schedule.team_b_array.defender_4?.full_name ?? "",
      team_b_mid_fielder_1_name:
        schedule.team_b_array.mid_fielder_1?.full_name ?? "",
      team_b_mid_fielder_2_name:
        schedule.team_b_array.mid_fielder_2?.full_name ?? "",
      team_b_mid_fielder_3_name:
        schedule.team_b_array.mid_fielder_3?.full_name ?? "",
      team_b_striker_1_name: schedule.team_b_array.striker_1?.full_name ?? "",
      team_b_striker_2_name: schedule.team_b_array.striker_2?.full_name ?? "",
      team_b_defender_1: schedule.team_b_array.defender_1?.id ?? "",
      team_b_defender_2: schedule.team_b_array.defender_2?.id ?? "",
      team_b_defender_3: schedule.team_b_array.defender_3?.id ?? "",
      team_b_defender_4: schedule.team_b_array.defender_4?.id ?? "",
      team_b_mid_fielder_1: schedule.team_b_array.mid_fielder_1?.id ?? "",
      team_b_mid_fielder_2: schedule.team_b_array.mid_fielder_2?.id ?? "",
      team_b_mid_fielder_3: schedule.team_b_array.mid_fielder_3?.id ?? "",
      team_b_striker_1: schedule.team_b_array.striker_1?.id ?? "",
      team_b_striker_2: schedule.team_b_array.striker_2?.id ?? "",
      team_b_defender_1_price: schedule.team_b_array.defender_1_price ?? "",
      team_b_defender_2_price: schedule.team_b_array.defender_2_price ?? "",
      team_b_defender_3_price: schedule.team_b_array.defender_3_price ?? "",
      team_b_defender_4_price: schedule.team_b_array.defender_4_price ?? "",
      team_b_mid_fielder_1_price: schedule.team_b_array.mid_fielder_1_price ?? "",
      team_b_mid_fielder_2_price: schedule.team_b_array.mid_fielder_2_price ?? "",
      team_b_mid_fielder_3_price: schedule.team_b_array.mid_fielder_3_price ?? "",
      team_b_striker_1_price: schedule.team_b_array.striker_1_price ?? "",
      team_b_striker_2_price: schedule.team_b_array.striker_2_price ?? "",
    }));
    return transformedData;
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
