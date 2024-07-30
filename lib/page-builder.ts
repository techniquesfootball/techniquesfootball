"use server";
import { createClient } from "@/utils/supabase/server";

// Define the type for the user data
export type PageBuilder = {
  contact_us?: string;
  about_us?: string;
  match_rules?: string;
  locations?: string;
  jobs?: string;
};

// Read users
export async function getValuesOfPageBuilder() {
  try {
    const supabase = createClient();
    const { data: users, error: dbReadError } = await supabase
      .from("page_builder")
      .select("*")
      .eq("id", 1);

    if (dbReadError) {
      throw new Error(`Error fetching users: ${dbReadError.message}`);
    }

    return users;
  } catch (error) {
    throw error;
  }
}

// Update page builder values
export async function updatePageBuilder(updates: PageBuilder) {
  try {
    const supabase = createClient();
    const { data, error: dbUpdateError } = await supabase
      .from("page_builder")
      .update(updates)
      .eq("id", 1);

    if (dbUpdateError) {
      throw new Error(`Error updating page builder: ${dbUpdateError.message}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}
