"use server";
import { createClient } from "@/utils/supabase/server";
import { createSchedule } from "./schedule";

const supabase = createClient();

// Define types for Team and Schedule
interface Team {
  team_id: number;
  defender_1: string | null;
  defender_2: string | null;
  defender_3: string | null;
  defender_4: string | null;
  mid_fielder_1: string | null;
  mid_fielder_2: string | null;
  mid_fielder_3: string | null;
  striker_1: string | null;
  striker_2: string | null;
  defender_1_price: number;
  defender_2_price: number;
  defender_3_price: number;
  defender_4_price: number;
  mid_fielder_1_price: number;
  mid_fielder_2_price: number;
  mid_fielder_3_price: number;
  striker_1_price: number;
  striker_2_price: number;
}

interface Schedule {
  id: number;
  location_id: number;
  team_a: number;
  team_b: number;
  status: string;
  date_and_time: string;
}

type TeamDetails = { [key: string]: string | number };

// Create two teams and a schedule
export async function createTeamsAndSchedule(
  location_id: number,
  date_and_time: string,
  teamDetails: TeamDetails
): Promise<{ teamA: Team; teamB: Team; schedule: Schedule } | string> {
  try {
    console.log(teamDetails);
    // Create the first team
    const teamA = await createTeam(teamDetails, "A");
    if (typeof teamA === "string") {
      return `Error: ${teamA}`;
    }

    // Create the second team
    const teamB = await createTeam(teamDetails, "B");
    if (typeof teamB === "string") {
      return `Error: ${teamB}`;
    }

    // Create the schedule with the team IDs
    const schedule = await createSchedule(
      location_id,
      teamA.team_id,
      teamB.team_id,
      "active",
      date_and_time
    );
    if (typeof schedule === "string") {
      return `Error: ${schedule}`;
    }

    return { teamA, teamB, schedule };
  } catch (error) {
    throw error;
  }
}

// Create (Insert Team)
export async function createTeam(
  teamDetails: TeamDetails,
  teamNumber: String
): Promise<Team | string> {
  try {
    const { data, error } = await supabase
      .from("team")
      .insert({
        defender_1: null,
        defender_2: null,
        defender_3: null,
        defender_4: null,
        mid_fielder_1: null,
        mid_fielder_2: null,
        mid_fielder_3: null,
        striker_1: null,
        striker_2: null,
        defender_1_price:
          teamNumber == "A"
            ? teamDetails.defender1_teamA_price
            : teamDetails.defender1_teamB_price,
        defender_2_price:
          teamNumber == "A"
            ? teamDetails.defender2_teamA_price
            : teamDetails.defender2_teamB_price,
        defender_3_price:
          teamNumber == "A"
            ? teamDetails.defender3_teamA_price
            : teamDetails.defender3_teamB_price,
        defender_4_price:
          teamNumber == "A"
            ? teamDetails.defender4_teamA_price
            : teamDetails.defender4_teamB_price,
        mid_fielder_1_price:
          teamNumber == "A"
            ? teamDetails.mid_fielder1_teamA_price
            : teamDetails.mid_fielder1_teamB_price,
        mid_fielder_2_price:
          teamNumber == "A"
            ? teamDetails.mid_fielder2_teamA_price
            : teamDetails.mid_fielder2_teamB_price,
        mid_fielder_3_price:
          teamNumber == "A"
            ? teamDetails.mid_fielder3_teamA_price
            : teamDetails.mid_fielder3_teamB_price,
        striker_1_price:
          teamNumber == "A"
            ? teamDetails.striker1_teamA_price
            : teamDetails.striker1_teamB_price,
        striker_2_price:
          teamNumber == "A"
            ? teamDetails.striker2_teamA_price
            : teamDetails.striker2_teamB_price,
      })
      .select()
      .maybeSingle<Team>();

    if (error) {
      return `Error creating team: ${error.message}`;
    }
    return data as Team;
  } catch (error) {
    throw error;
  }
}

// Read (Fetch Teams)
export async function getTeams(teamId?: number) {
  try {
    const query = supabase.from("team").select("*");

    if (teamId) {
      query.eq("team_id", teamId);
    }

    const { data, error } = await query;
    if (error) {
      return `Error fetching teams: ${error.message}`;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

// Update (Modify Team)
export async function updateTeam(
  teamId: number,
  updates: {
    defender_1: number;
    defender_2: number;
    defender_3: number;
    defender_4: number;
    mid_fielder_1: number;
    mid_fielder_2: number;
    mid_fielder_3: number;
    striker_1: number;
    striker_2: number;
    defender_1_price: number;
    defender_2_price: number;
    defender_3_price: number;
    defender_4_price: number;
    mid_fielder_1_price: number;
    mid_fielder_2_price: number;
    mid_fielder_3_price: number;
    striker_1_price: number;
    striker_2_price: number;
  }
) {
  try {
    const { data, error } = await supabase
      .from("team")
      .update(updates)
      .match({ team_id: teamId })
      .select()
      .maybeSingle();

    if (error) {
      return `Error updating team: ${error.message}`;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

// Delete (Remove Team)
export async function deleteTeam(teamId: number) {
  try {
    const { data, error } = await supabase
      .from("team")
      .delete()
      .match({ team_id: teamId });

    if (error) {
      return `Error deleting team: ${error.message}`;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
