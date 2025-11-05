
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
const prismaclient = new PrismaClient()
export async function POST(req:NextRequest){
    const data = await req.json()
    console.log(data)
    await prismaclient.user.create({
        data:{
            username: data.username,
            password: data.password,
            usertype: data.usertype,
            fullname: data.fullname
        }
    })
    return NextResponse.json({
        message:"You have been signed up"
    })
}