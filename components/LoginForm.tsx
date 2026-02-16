"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import LoginFormSchema from "@/types/LoginFormSchema";
import useAuth from "@/hooks/useAuth";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { handleAuthError } from "@/lib/utils";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { signIn, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  async function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    setIsSubmitting(true);
    try {
      await signIn(data);
      toast.success("Successfully signed in!");
      router.push("/dashboard");
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <Card className="w-full max-w-xl">
        <CardContent className="flex items-center justify-center gap-2 py-12">
          <Spinner />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (user) {
    return null;
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Don&apos;t have an account yet? Sign up{" "}
          <Link
            href="/signup"
            className="underline hover:text-foreground underline-offset-4 transition-colors ease-in-out duration-200"
          >
            here
          </Link>
          .
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form" onSubmit={loginForm.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={loginForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter email"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={loginForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter password"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      align="inline-end"
                      className="hover:cursor-pointer"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    Forgot password? Click{" "}
                    <Link
                      href="/"
                      className="transition-colors ease-in-out duration-200"
                    >
                      here
                    </Link>{" "}
                    to reset it.
                  </FieldDescription>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="form"
            disabled={isSubmitting || !loginForm.formState.isValid}
          >
            {isSubmitting ? (
              <>
                <Spinner /> Loading...
              </>
            ) : (
              <>
                <LogIn /> Login
              </>
            )}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
