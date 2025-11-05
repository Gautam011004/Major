import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prismaClient = new PrismaClient();

// POST - Apply to a project
export async function POST(req: NextRequest) {
  try {
    const { projectId, username, previousExperience, whyJoin } = await req.json();

    if (!projectId || !username || !previousExperience || !whyJoin) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get student's user ID
    const student = await prismaClient.user.findFirst({
      where: { username },
    });

    if (!student || student.usertype !== "student") {
      return NextResponse.json(
        { error: "Only students can apply to projects" },
        { status: 403 }
      );
    }

    // Check if already applied
    const existingApplication = await prismaClient.application.findUnique({
      where: {
        studentId_projectId: {
          studentId: student.id,
          projectId: parseInt(projectId),
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "Already applied to this project" },
        { status: 400 }
      );
    }

    const application = await prismaClient.application.create({
      data: {
        studentId: student.id,
        projectId: parseInt(projectId),
        status: "pending",
        previousExperience,
        whyJoin,
      },
    });

    return NextResponse.json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

// GET - Get applications (for professors to see who applied)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Get professor's projects
    const professor = await prismaClient.user.findFirst({
      where: { username },
      include: {
        projects: {
          include: {
            applications: {
              include: {
                student: {
                  select: {
                    id: true,
                    username: true,
                    fullname: true,
                    university: true,
                    batch: true,
                    department: true,
                  },
                },
                project: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!professor) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Flatten all applications from all professor's projects
    const allApplications = professor.projects.flatMap(project => 
      project.applications.map(app => ({
        id: app.id,
        name: app.student.fullname,
        email: app.student.username, // You can add email field to User model
        projectId: app.projectId,
        projectTitle: app.project.title,
        status: app.status,
        appliedDate: app.appliedAt.toISOString().split('T')[0],
        university: app.student.university,
        batch: app.student.batch,
        department: (app.student as any).department,
        previousExperience: (app as any).previousExperience,
        whyJoin: (app as any).whyJoin,
      }))
    );

    return NextResponse.json(allApplications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// PATCH - Update application status (accept/reject)
export async function PATCH(req: NextRequest) {
  try {
    const { applicationId, status } = await req.json();

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const application = await prismaClient.application.update({
      where: { id: parseInt(applicationId) },
      data: { status },
    });

    return NextResponse.json({
      message: "Application status updated",
      application,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
