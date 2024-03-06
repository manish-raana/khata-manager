import { z } from "zod";

export const RegisterFormSchema = z
  .object({
    phone: z.string().min(10, { message: "Enter a valid phone number!" }),
    name: z.string().min(3, { message: "Enter a name!" }),
    email: z.string().email("Enter a valid email!"),
    password: z
      .string()
      .min(6, {
        message: "Min Password length 6.",
      })
      .max(20, { message: "Max password length 20." }),
  });
export type RegisterFormType = z.infer<typeof RegisterFormSchema>;

export const LoginFormSchema = z
    .object({
        email: z.string().email("Please enter a valid email!"),
        password: z
            .string()
            .min(6)
    });
export type LoginFormType = z.infer<typeof LoginFormSchema>;

export const AddStoreFormSchema = z
    .object({
      name: z.string().min(2, { message: "Please enter a store name!" }),
      address: z.object({
        city: z.string().min(2, { message: "Please enter a city!" }),
        state: z.string().min(2,{message: "Please select a state!"}),
      })
    });
export type AddStoreFormType = z.infer<typeof AddStoreFormSchema>;