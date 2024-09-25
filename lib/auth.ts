"use server";
import { createClient } from "@/utils/supabase/server";

// Define the type for the user data
export type UserData = {
  id: number;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  role?: string;
  phone_number?: string;
};

// Create a new user
export async function createUser(
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  role: string,
  phone_number: string
) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
    });
    if (error) {
    } else {
      const { data: userData, error: dbInsertError } = await supabase
        .from("profiles")
        .insert({
          first_name,
          last_name,
          email,
          password,
          role,
          phone_number,
        })
        .select()
        .maybeSingle();
      if (dbInsertError) {
        throw new Error(`Sign up error: ${dbInsertError.message}`);
      }
      return userData;
    }
  } catch (error) {
    throw error;
  }
}

// Read users
export async function getUsers() {
  try {
    const supabase = createClient();
    const { data: users, error: dbReadError } = await supabase
      .from("profiles")
      .select("*");
    if (dbReadError) {
      throw new Error(`Error fetching users: ${dbReadError.message}`);
    }
    return users;
  } catch (error) {
    throw error;
  }
}

// Read user by ID
export async function getUserById(id: number) {
  try {
    const supabase = createClient();
    const { data: user, error: dbReadError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (dbReadError) {
      throw new Error(`Error fetching user by ID: ${dbReadError.message}`);
    }
    return user;
  } catch (error) {
    throw error;
  }
}

// Update a user
export async function updateUser(
  id: number,
  full_name?: string,
  email?: string,
  role?: string,
  phone_number?: string
) {
  try {
    const supabase = createClient();
    const updates: UserData = {
      id,
      full_name,
      email,
      role,
      phone_number,
    };
    (Object.keys(updates) as (keyof UserData)[]).forEach((key) => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });
    const { data: userData, error: dbUpdateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (dbUpdateError) {
      throw new Error(`Update error: ${dbUpdateError.message}`);
    }
    return userData;
  } catch (error) {
    throw error;
  }
}

// Delete a user
export async function deleteUser(id: number) {
  try {
    const supabase = createClient();
    const { data, error: dbDeleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (dbDeleteError) {
      throw new Error(`Delete error: ${dbDeleteError.message}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}
