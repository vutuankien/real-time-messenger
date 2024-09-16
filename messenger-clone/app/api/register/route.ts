import bcrypt from "bcrypt"; // Use bcryptjs for ES Modules compatibility

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, password } = body;

        // Validate input
        if (!email || !name || !password) {
            return new NextResponse("Missing required information", { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user in the database
        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
            },
        });

        // Return the created user
        return NextResponse.json(user);
    } catch (error: any) {
        console.error("Registration_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
