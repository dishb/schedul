import { z } from "zod";

const LoginFormSchema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .min(1, "An email is required."),
  password: z.string().min(1, "A password is required."),
});

export default LoginFormSchema;
