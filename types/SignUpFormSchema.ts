import { z } from "zod";

const JoinFormSchema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .min(1, "An email is required."),
  password: z
    .string()
    .min(1, "A password is required.")
    .min(8, "Your password must be more than 8 characters."),
  firstName: z.string().min(1, "A first name is required."),
  lastName: z.string().min(1, "A last name is required."),
});

export default JoinFormSchema;
