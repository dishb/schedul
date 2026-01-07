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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import SignUpFormSchema from "@/types/SignUpFormSchema";
import useAuth from "@/hooks/useAuth";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { signUp, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const signUpForm = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      schoolTitle: "Amador Valley High School",
    },
    mode: "all",
  });

  async function onSubmit(data: z.infer<typeof SignUpFormSchema>) {
    setIsSubmitting(true);
    try {
      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        schoolTitle: data.schoolTitle,
      });
      toast.success("Account created successfully. Welcome to Schedul!");
      router.push("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during sign up.";
      toast.error(errorMessage);
      signUpForm.setValue("password", "");
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
        <CardTitle>Sign up</CardTitle>
        <CardDescription>
          Already have an account? Log in{" "}
          <Link
            className="underline hover:text-foreground underline-offset-4 transition-colors ease-in-out duration-200"
            href="/login"
          >
            here
          </Link>
          .
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form" onSubmit={signUpForm.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="firstName"
              control={signUpForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>First name</FieldLabel>
                  <Input
                    {...field}
                    id="form-firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Enter first name"
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
              name="lastName"
              control={signUpForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Last name</FieldLabel>
                  <Input
                    {...field}
                    id="form-lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Enter last name"
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
              name="email"
              control={signUpForm.control}
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
              control={signUpForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Enter password"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="hover:cursor-pointer"
                      align="inline-end"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>
              )}
            />
            <Controller
              control={signUpForm.control}
              name="schoolTitle"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>School</FieldLabel>
                  <RadioGroup
                    value={field.value ?? undefined}
                    onValueChange={field.onChange}
                  >
                    <div className="flex gap-2">
                      <RadioGroupItem
                        value="Amador Valley High School"
                        id="Amador Valley High School"
                      />
                      <Label
                        htmlFor="Amador Valley High School"
                        className="hover:cursor-pointer"
                      >
                        Amador Valley High School
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <RadioGroupItem
                        value="Foothill High School"
                        id="Foothill High School"
                      />
                      <Label
                        htmlFor="Foothill High School"
                        className="hover:cursor-pointer"
                      >
                        Foothill High School
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <RadioGroupItem
                        value="Dublin High School"
                        id="Dublin High School"
                      />
                      <Label
                        htmlFor="Dublin High School"
                        className="hover:cursor-pointer"
                      >
                        Dublin High School
                      </Label>
                    </div>
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
            disabled={isSubmitting || !signUpForm.formState.isValid}
          >
            {isSubmitting ? (
              <>
                <Spinner />
                Loading...
              </>
            ) : (
              <>
                <LogIn /> Sign up
              </>
            )}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
