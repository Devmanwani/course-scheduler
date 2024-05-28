import  Prisma  from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {sign} from "jsonwebtoken";



const requestBodySchema = z.object({
    email: z.string(),
    password: z.string(),
});

export async function POST(req: NextRequest){
    const body  = await req.json();
    const parseResult = requestBodySchema.safeParse(body);

    if(!parseResult.success){
        return NextResponse.json(parseResult.error, {status:400});
    }

    const {email, password} = parseResult.data;

    const prisma = new Prisma.PrismaClient();

    const user = await prisma.user.findFirst({
        where:{
            email,
            password,
            role:"ADMIN"
        }
    })

    if(!user){
        return NextResponse.json({error: "Invalid credentials"}, {status: 401});

    }

    const token = sign({userId:user.id }, process.env.JWT_SECRET??"secret");
    
    return NextResponse.json({token}, {status: 200});
    
}
