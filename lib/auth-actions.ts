"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  const form = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword(form);

  if (authError) {
    console.error(authError);
    redirect("/first-website/error");
    return;
  }

  const userId = authData.user?.id;

  if (userId) {
    const { data: userData, error: userError } = await supabase
      .from("profiles") 
      .select("role")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error(userError);
      redirect("/first-website/error");
    }

    const userRole = userData?.role;

    if (userRole === "admin") {
      revalidatePath("/first-website/admin", "layout");
      redirect("/first-website/admin");
    } else if (userRole === "player") {
      revalidatePath("/first-website/player", "layout");
      redirect("/first-website/player");
    } else {
      redirect("/first-website/error");
    }
  } else {
    redirect("/first-website/error");
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("fullname") as string,
        email: formData.get("email") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);
  if (error) {
    redirect("/first-website/error");
  }

  revalidatePath("/first-website", "layout");
  redirect("/first-website");
}

export async function signout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/first-website/error");
  }

  redirect("/first-website/logout");
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/first-website/error");
  }

  redirect(data.url);
}
