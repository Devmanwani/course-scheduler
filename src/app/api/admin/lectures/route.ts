import { getPrismaClient } from '../../../../../prisma/client'
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const lectureSchema = z.object({
    
    date: z.coerce.date(),
    courseId:z.number(),
    instructorId:z.number()

});


export async function POST(req:NextRequest){
    const body = await req.json();
    const parseResult = lectureSchema.safeParse(body);

    if(!parseResult.success){
        return NextResponse.json(parseResult.error, {status: 400})
 
    }

    const {
        
        date,
        courseId,
        instructorId
    } = parseResult.data;

    const prisma = getPrismaClient();

    //check if the instructor already has a lecture on the same date
    const lecture = await prisma.lecture.findFirst({
        where:{
            instructorId,
            date
        }
    });

    if(lecture){
        return NextResponse.json({error: "Instructor already has a lecture on the same date"}, {status: 400});
    }
    try{
        await prisma.lecture.create({
            data:{
                
                date,
                courseId,
                instructorId
            }
        })
    }catch(e:any){
        return NextResponse.json({error: e.message}, {status: 500});
    }

    return NextResponse.json({message: "Lecture created successfully"},{status:201});

}
