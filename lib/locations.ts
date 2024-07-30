"use server";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

// Create a Location
export async function createLocation(
  location: Omit<LocationModel, "location_id">
): Promise<LocationModel | string> {
  try {
    const { data, error } = await supabase
      .from("location")
      .insert(location)
      .select()
      .maybeSingle();
    if (error) {
      console.error("Database insert error:", error);
      return `Error inserting location: ${error.message}`;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    return "An unexpected error occurred. Please try again later.";
  }
}

// Read Locations
export async function readLocations(): Promise<LocationModel[] | string> {
  try {
    const { data, error } = await supabase.from("location").select();
    if (error) {
      console.error("Database read error:", error);
      return `Error reading locations: ${error.message}`;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    return "An unexpected error occurred. Please try again later.";
  }
}

// Read Location by ID
export async function readLocationById(
  locationId: number
): Promise<LocationModel | null> {
  try {
    const { data, error } = await supabase
      .from("location")
      .select()
      .eq("location_id", locationId)
      .maybeSingle();
    if (error) {
      console.error("Database read error:", error);
      return null;
    }
    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
}

export async function updateLocation(
  location_id: number,
  updates: Partial<LocationModel>
): Promise<LocationModel | string> {
  try {
    // Perform the update operation
    const { data, error } = await supabase
      .from("location")
      .update(updates)
      .eq("location_id", location_id)
      .select()
      .maybeSingle();

    // Check if there was an error in the update operation
    if (error) {
      console.error("Database update error:", error);
      return `Error updating location: ${error.message}`;
    }

    // Check if data is null, which means no record was found
    if (!data) {
      return "Location not found.";
    }

    // Return the updated data
    return data;
  } catch (error) {
    // Log unexpected errors
    console.error("Unexpected error:", error);
    return "An unexpected error occurred. Please try again later.";
  }
}
// Delete a Location
export async function deleteLocation(location_id: number): Promise<string> {
  try {
    const { error } = await supabase
      .from("location")
      .delete()
      .eq("location_id", location_id);
    if (error) {
      console.error("Database delete error:", error);
      return `Error deleting location: ${error.message}`;
    }
    return "Location deleted successfully.";
  } catch (error) {
    console.error("Unexpected error:", error);
    return "An unexpected error occurred. Please try again later.";
  }
}
