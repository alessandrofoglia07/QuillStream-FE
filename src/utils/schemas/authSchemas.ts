import { z } from 'zod';

export const nameSchema = z.string().min(3, 'Name must be at least 3 characters long.').max(32, 'Name must not exceed 32 characters.');

export const emailSchema = z.string().email('Invalid email address. Did you make a typo?');

export const passwordSchema = z
    .string()
    .min(6, 'Password must be at least 6 characters long.')
    .refine((password) => {
        return /[a-z]/.test(password);
    }, 'Password must contain at least one lowercase letter.')
    .refine((password) => {
        return /[0-9]/.test(password);
    }, 'Password must contain at least one number.');

export const formSchemaSubmit = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema
});

export const confirmCodeSchema = z.string().length(6, 'Confirmation code must be 6 characters long.');