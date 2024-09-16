import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const {
            userId,
            isGroup,
            members,
            name
        } = body;

        // Fix: Corrected authentication check condition
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Not authenticated", { status: 401 });
        }


        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse("Invalid group creation request", { status: 400 });
        }

        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name, isGroup, users: {
                        connect: [
                            ...members.map((member: { value: string }) => ({
                                id: member.value
                            })),
                            {
                                id: currentUser.id
                            }
                        ]
                    }
                }
            })
        }

        // Add your logic here (e.g., creating a group or handling members)

        return new NextResponse("Success", { status: 200 });
    } catch (error: any) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
