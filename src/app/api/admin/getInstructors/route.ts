import { NextRequest, NextResponse} from "next/server";
import { headers } from 'next/headers';
import {customJwtPayload} from '../../user/getLectureDetails/route';
import { verify } from 'jsonwebtoken';


import {getPrismaClient} from '../../../../../prisma/client';

export async function GET(req: NextRequest) {
    const authorization = headers().get("Authorization");
    if (!authorization) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    
    const token = authorization.split(" ")[1];
    

    let decodedToken: customJwtPayload;
    try {
        decodedToken = verify(token, process.env.JWT_SECRET ?? "secret") as customJwtPayload;
    } catch (e) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const prisma = getPrismaClient();
    const userId = (decodedToken.userId);

    const user = await prisma.user.findFirst({
        where:{
            id:userId
        }
    });

    if(!user || user.role !== "ADMIN"){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const instructors = await prisma.user.findMany({
        where:{
            role:"INSTRUCTOR"
        }
    });
    return NextResponse.json(instructors);
}
