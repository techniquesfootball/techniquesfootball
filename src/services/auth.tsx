"use server";
import { createClient } from "@/utils/supabase/server";

export async function signUp(name: string, email: string, password: string) {
  try {
    const supabase = createClient();
    // const {
    //   data: { user },
    //   error: signUpError,
    // } = await supabase.auth.signUp({
    //   email: email,
    //   password: password,
    // });
    // if (true) {
    // throw new Error(`Authentication error: ${signUpError.message}`);
    // }
    const { data: userData, error: dbInsertError } = await supabase
      .from("users")
      .insert({
        first_name: "danilo",
        last_name: "santos",
        phone_number: "3434",
        role: "regular",
        email: "danilo1998271@gmail.com",
      })
      .select()
      .maybeSingle();
    if (dbInsertError) {
      return `Sign up error: ${dbInsertError.message}`;
    }
    return userData;
  } catch (error) {
    throw error;
  }
}
