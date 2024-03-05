import RegisterComponent from "@/components/Register";
import Link from "next/link";
import React from "react";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { RegisterFormType } from "@/lib/zod";

const RegisterPage = ({ searchParams }: { searchParams: { message: string } }) => {
  const signup = async (formData: RegisterFormType) => {
    "use server";
    const origin = headers().get("origin");
    const { phone, name, email, password } = formData;
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      phone,
      options: {
        data: {
          name: name,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Error signing up:", error);
      return redirect(`/register?message=${error}`);
    }
    return redirect("/login?message=Check email to continue sign in process.");
  };

  return (
    <div className="container relative h-screen w-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative h-auto md:h-full flex-col lg:bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0" />
        <img className="w-full md:h-[40dvh] lg:h-[91dvh] mt-2" src="/login.svg" alt="" />
      </div>
      <div className="lg:p-8 w-full ">
        <div className="mx-auto flex w-full lg:w-1/2 flex-col justify-center space-y-6 ">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Register your account</h1>
            <p className="text-sm text-muted-foreground">Enter your details to register your account</p>
          </div>
          <RegisterComponent signup={signup} />
          <p className="text-start text-sm text-muted-foreground">
            Already have an account,
            <Link href="/login" className="ml-2 underline underline-offset-4 hover:text-primary">
              Login here
            </Link>
          </p>
          {searchParams?.message && <p className="text-red-500 text-sm text-start">{searchParams.message}!</p>}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
