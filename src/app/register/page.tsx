"use client"

import Image from "next/image";
import LoginImage from "../../../public/Take Away-bro.svg";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { registerSchema } from "@/schemas/registerSchema";

type FormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  const { handleSubmit, control } = form;

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Conta criada com sucesso!",
        className: "bg-green-800 border-green-800 text-gray-900",
      });
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        className: "bg-red-800 border-red-800 text-gray-900",
      });
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="h-1/3 lg:h-full w-full lg:w-2/3 flex items-center justify-center">
        <Image src={LoginImage} alt="Imagem de uma atendente na página de login" />
      </div>
      <div className="flex-1 flex flex-col items-center border-t-4 lg:border-t-0 lg:border-l-4 border-neutral-900 px-6 lg:px-10">
        <span className="mt-8 lg:m-12 font-bold text-2xl lg:text-3xl text-amber-400">Cadastro</span>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:space-y-6 w-full lg:w-96">
            <FormField
              control={control}
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
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-amber-400 font-bold">Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Coloque sua Senha" type="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-amber-400 font-bold">Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirme sua Senha" type="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <span className="mt-4 text-sm text-muted-foreground">
              Ao se Cadastrar, você concorda com os
              <span className="text-amber-400 text-sm cursor-pointer"> Termos de uso</span> e
              <span className="text-amber-400 text-sm cursor-pointer"> Políticas de Privacidade</span>
            </span>
            <Button
              className="h-14 bg-amber-400 text-gray-900 font-bold w-full hover:text-slate-50"
              type="submit"
            >
              Cadastrar
            </Button>
          </form>
        </Form>
        <span className="mt-4 text-md text-muted-foreground">
          Você já possui uma conta?{" "}
          <Link href="/" className="text-amber-400 text-md cursor-pointer">
            Login
          </Link>
        </span>
      </div>
    </div>
  );
}
