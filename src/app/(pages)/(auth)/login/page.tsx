import React from 'react'
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LoginComponent from '@/components/auth/Login';
import Link from 'next/link';
import { LoginFormType } from '@/lib/zod';

const LoginPage = ({ searchParams }: { searchParams: { message: string } }) => {
  
  const signIn = async (formData: LoginFormType) => {
    "use server";
    const { email, password } = formData;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
       //console.log(error.message)
       return redirect(`/login?message=${error.message}`);
     }
    return redirect("/");
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
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Login to your account</h1>
            <p className="text-sm text-muted-foreground">Enter your login details to access your account</p>
          </div>
          <LoginComponent error={searchParams.message} signIn={signIn} />
          <p className="text-start text-sm text-muted-foreground">
            Have not registered yet,
            <Link href="/register" className="ml-2 underline underline-offset-4 hover:text-primary">
              Register here
            </Link>
          </p>
          {searchParams?.message && <p className="text-red-500 text-sm text-start">{searchParams.message}!</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;