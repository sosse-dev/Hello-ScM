import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min password is 8"),
});

export const SignupSchema = z.object({
  name: z.string().max(17, "Maximum length of name is 10"),
  email: z.string().email("Email tidak valid"),
  username: z.string().max(10, "Maximum length of username is 10"),
  sandi: z.string().min(8, "Minimal password 8 huruf"),
  gambar: z.string().nullable().optional(),
});

export const EditUserSchema = z.object({
  name: z.string().max(17, "Maximum length of name is 10"),
  deskripsi: z
    .string()
    .max(150, "Maximum length of description is 150")
    .optional(),
  gambar: z.string().nullable().optional(),
});

export const AddUserSchema = z.object({
  name: z.string().max(17, "Maximum length of name is 10"),
  deskripsi: z
    .string()
    .max(150, "Maximum length of description is 150")
    .optional(),
  username: z.string().max(10, "Maximum length of username is 10"),
  gambar: z.string().nullable().optional(),
});

export type InferedSignupSchema = z.infer<typeof SignupSchema>;

export const ResetSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, "Min password is 8"),
});

export const UpdateUserSchema = z.object({
  name: z.string().max(17, "Maximum length of name is 10").optional(),
  deskripsi: z
    .string()
    .max(150, "Maximum length of description is 150")
    .optional(),
  gambar: z.string().nullable().optional(),
});

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Title is Empty")
    .max(15, "Maximum length of title is 15 characters"),
  desc: z.string().optional(),
  image: z.string(),
});
