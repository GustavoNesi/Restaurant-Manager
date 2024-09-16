"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

import FastFoodMenu from "../../public/Street Food-pana.png";
import GoogleLogo from "../../public/icons8-google-logo.svg";
import FacebookLogo from "../../public/icons8-facebook-novo.svg";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/firebaseConfig";
import { loginSchema } from "@/schemas/loginSchema";

export default function Home() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const token = await userCredential.user.getIdToken(); 
      localStorage.setItem("authToken", token);
      window.location.href = "/dashboard";
    } catch (error) {
      setError("Falha na autenticação. Verifique suas credenciais.");
    }
  }

  async function handleOAuthLogin(provider: any) {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken(); 
      localStorage.setItem("authToken", token); 
      window.location.href = "/dashboard"; 
    } catch (error) {
      setError("Falha na autenticação com OAuth.");
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="h-1/3 lg:h-full w-full lg:w-2/3 flex items-center justify-center">
        <Image src={FastFoodMenu} height={400} alt="Pessoas em um fastfood pedindo comida" />
      </div>
      
      <div className="flex-1 flex flex-col items-center lg:border-t-0 lg:border-l-4 border-neutral-900 px-6 lg:px-10">
        <span className="mt-8 lg:m-12 font-bold text-2xl lg:text-3xl text-amber-400">Bem vindo de Volta!</span>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 lg:space-y-6 w-full lg:w-96">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-amber-400 font-bold">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Coloque seu Email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-amber-400 font-bold">Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Coloque sua Senha" className="bg-transparent" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button className="w-full mt-4 lg:mt-6 bg-amber-400 font-bold text-gray-950 hover:text-gray-100" type="submit">
              Fazer Login
            </Button>
          </form>
        </Form>
        <div className="mt-2 flex items-center space-x-2">
          <div className="w-1/3 lg:w-28 border-2 border-neutral-900" />
          <span className="text-muted-foreground">Ou</span>
          <div className="w-1/3 lg:w-28 border-2 border-neutral-900" />
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-1 w-full">
          <Button className="w-full mt-2 lg:mt-4 gap-2 bg-gray-100 font-bold text-gray-950 hover:text-gray-100" onClick={() => handleOAuthLogin(new GoogleAuthProvider())}>
            <Image src={GoogleLogo} alt="Google Logo" height={20} />
            Google
          </Button>
          <Button className="w-full mt-2 lg:mt-4 gap-2 bg-gray-100 font-bold text-gray-950 hover:text-gray-100" onClick={() => handleOAuthLogin(new FacebookAuthProvider())}>
            <Image src={FacebookLogo} alt="Facebook Logo" height={20} />
            Facebook
          </Button>
        </div>

        <div className="flex mt-4 gap-1">
          <span className="text-muted-foreground">Ainda não tem conta?</span>
          <span className="text-amber-400 cursor-pointer">
            <Link href="/register">Criar Conta</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
