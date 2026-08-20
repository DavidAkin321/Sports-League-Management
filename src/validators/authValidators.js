import {z} from "zod"

const registerSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Please provide a valid email address"),
    password: z.string().min(8, "password is required"),
    role: z.enum(["ADMIN", "ORGANISER", "COACH", "PLAYER"], { error : () => ({
        message:"Role must be ADMIN, ORGANISER, COACH, PLAYER"
    }),
}),
    
})

const loginSchema = z.object({
    email: z.string().email("Please provide a valid email address"),
    password: z.string().min(1, "password is required"),
})

export { registerSchema, loginSchema }