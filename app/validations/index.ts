import { z } from "zod";


export const signinSchema = z.object({
    email: z.email(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            "Password must contain uppercase, lowercase, number, and special character"
        ),
});

export const signupSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain uppercase, lowercase, number, and special character"),
    confirmPassword: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export const sendMoneySchema = z.object({
    amount: z.number(),
    address: z.string()
})

export const swapSchema = z.object({
    fromAddress: z.string(),
    toAddress: z.string(),
    amount: z.string()
})

export type signinInputs = z.infer<typeof signinSchema>;
export type signpInputs = z.infer<typeof signupSchema>;
export type sendMoneyInputs = z.infer<typeof sendMoneySchema>
export type swapInputs = z.infer<typeof swapSchema>