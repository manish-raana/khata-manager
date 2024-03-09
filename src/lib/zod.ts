import { isValidPhoneNumber } from 'react-phone-number-input'
import { z } from 'zod'

export const CLIENT_TYPE_ENUM = z.enum(['CUSTOMER', 'SUPPLIER', 'EMPLOYEE'])
export type CLIENT_TYPE_ENUM_TYPE = 'CUSTOMER' | 'SUPPLIER' | 'EMPLOYEE'

export const RegisterFormSchema = z.object({
  phone: z.string().min(10, { message: 'Enter a valid phone number!' }),
  name: z.string().min(3, { message: 'Enter a name!' }),
  email: z.string().email('Enter a valid email!'),
  password: z
    .string()
    .min(6, {
      message: 'Min Password length 6.',
    })
    .max(20, { message: 'Max password length 20.' }),
})
export type RegisterFormType = z.infer<typeof RegisterFormSchema>

export const LoginFormSchema = z.object({
  email: z.string().email('Please enter a valid email!'),
  password: z.string().min(6),
})
export type LoginFormType = z.infer<typeof LoginFormSchema>

export const AddStoreFormSchema = z.object({
  name: z.string().min(2, { message: 'Please enter a store name!' }),
  address: z.string().min(2, { message: 'Please enter store adrress!' }),
})
export type AddStoreFormType = z.infer<typeof AddStoreFormSchema>

export const AddClientFormSchema = z.object({
  name: z.string().min(2, { message: 'Please enter a name!' }),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
  client_type: z.enum(['CUSTOMER', 'SUPPLIER', 'EMPLOYEE'], {
    required_error: 'You need to select a Client type.',
  }),
  address: z.string().min(2, { message: 'Please enter an address!' }),
})
export type AddClientFormType = z.infer<typeof AddClientFormSchema>

export const AddTxnFormSchema = z.object({
  amount: z.number().gt(0, { message: 'Amount must be greater than 0' }),
  description: z.string().optional(),
  date: z.date(),
  file: z.string().optional(),
})
export type AddTxnFormType = z.infer<typeof AddTxnFormSchema>
