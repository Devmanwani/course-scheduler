import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPrismaClient } from "../../../../../prisma/client";
import  { headers } from "next/headers";
import { customJwtPayload } from "../../user/getLectureDetails/route";
import { verify } from "jsonwebtoken";


const requestBodySchema = z.object({
    name: z.string(),
    level: z.string(),
    description: z.string(),
   
    image:z.string()
});



export async function POST(req: NextRequest){

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


    const body = await req.json();
    const parseResult = requestBodySchema.safeParse(body);

    if(!parseResult.success){
        return NextResponse.json(parseResult.error, {status: 400})
    }

    const {
        name,
        level,
        description,
        
        image
    } = parseResult.data;



    try{
        await prisma.course.create({
            data:{
                name,
                level,
                description,
                
                image
            }
        });
    }catch{
        return NextResponse.json({error: "An error occurred while creating the course"}, {status: 500});
    }
        return NextResponse.json({message: "Course created successfully"}, {status: 201});

    }

export async function GET(){

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


    
    const courses = await prisma.course.findMany();
    return NextResponse.json(courses);
}

