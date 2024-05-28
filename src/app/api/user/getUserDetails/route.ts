import { NextRequest, NextResponse } from "next/server";
import Prisma from "@prisma/client";
import { headers } from 'next/headers';
import { JwtPayload, verify } from 'jsonwebtoken';
import {customJwtPayload} from '../getLectureDetails/route';

export async function GET() {
    const authorization = headers().get("Authorization");
    if (!authorization) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    
    const token = authorization.split(" ")[1];
    const prisma = new Prisma.PrismaClient();

    let decodedToken: customJwtPayload;
    try {
        decodedToken = verify(token, process.env.JWT_SECRET ?? "secret") as customJwtPayload;
    } catch (e) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = (decodedToken.userId);
    

    const lecture = await prisma.lecture.findFirst({
        where: {
            instructorId: userId
        },
        select:{
            id:true,
            date:true,
            course:{
                select:{
                    name:true,
                    level:true,
                    description:true,
                    image:true,
                    id:true
                }
            }
        }
    });

    if (!lecture) {
        return NextResponse.json({ error: "Lecture not found" }, { status: 404 });
    }

    return NextResponse.json(lecture);
}