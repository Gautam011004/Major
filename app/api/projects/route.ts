import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prismaClient = new PrismaClient();

// GET - Fetch all projects or projects by filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const professorId = searchParams.get("professorId");
    const studentId = searchParams.get("studentId");
    const view = searchParams.get("view"); // "applied" or "working"
    const projectId = searchParams.get("projectId");

    // If requesting a single project
    if (projectId) {
      const project = await prismaClient.project.findUnique({
        where: { id: parseInt(projectId) },
        include: {
          professor: {
            select: {
              fullname: true,
            },
          },
        },
      });

      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: project.id,
        title: project.title,
        professor: project.professor.fullname,
        department: project.department,
        description: project.description,
        type: project.type,
        duration: project.duration,
        difficulty: project.difficulty,
      });
    }

    let whereClause: any = {};

    if (type && type !== "all") {
      whereClause.type = type;
    }

    if (professorId) {
      whereClause.professorId = parseInt(professorId);
    }

    // If student is requesting their applied/working/available projects
    if (studentId && view) {
      const studentIdNum = parseInt(studentId);
      
      if (view === "applied") {
        // Get projects the student applied to
        const applications = await prismaClient.application.findMany({
          where: { studentId: studentIdNum },
          include: {
            project: {
              include: {
                professor: {
                  select: {
                    fullname: true,
                  },
                },
              },
            },
          },
        });
        
        return NextResponse.json(applications.map(app => ({
          ...app.project,
          professor: app.project.professor.fullname,
          applicationStatus: app.status,
        })));
      } else if (view === "working") {
        // Get projects where student is accepted
        const applications = await prismaClient.application.findMany({
          where: { 
            studentId: studentIdNum,
            status: "accepted"
          },
          include: {
            project: {
              include: {
                professor: {
                  select: {
                    fullname: true,
                  },
                },
              },
            },
          },
        });
        
        // Include applicationStatus so frontend can render "Enrolled"/status
        return NextResponse.json(applications.map(app => ({
          ...app.project,
          professor: app.project.professor.fullname,
          applicationStatus: app.status,
        })));
      } else if (view === "available") {
        // Get all projects that student has NOT applied to
        const appliedProjectIds = await prismaClient.application.findMany({
          where: { studentId: studentIdNum },
          select: { projectId: true },
        });
        
        const appliedIds = appliedProjectIds.map(app => app.projectId);
        
        whereClause.id = {
          notIn: appliedIds,
        };
      }
    }

    const projects = await prismaClient.project.findMany({
      where: whereClause,
      include: {
        professor: {
          select: {
            fullname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data to match frontend format
    const formattedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      professor: project.professor.fullname,
      department: project.department,
      description: project.description,
      type: project.type,
      duration: project.duration,
      difficulty: project.difficulty,
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST - Create a new project
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { title, description, duration, difficulty, type, username } = data;

    if (!title || !description || !duration || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get professor's user ID and department
    const professor = await prismaClient.user.findFirst({
      where: { username },
      select: {
        id: true,
        usertype: true,
        department: true,
        fullname: true,
      },
    });

    if (!professor || professor.usertype !== "professor") {
      return NextResponse.json(
        { error: "Only professors can create projects" },
        { status: 403 }
      );
    }

    if (!professor.department) {
      return NextResponse.json(
        { error: "Please update your profile with department information before creating projects" },
        { status: 400 }
      );
    }

    const project = await prismaClient.project.create({
      data: {
        title,
        description,
        duration,
        difficulty: difficulty || "Intermediate",
        department: professor.department,
        type: type || "ai",
        professorId: professor.id,
      },
      include: {
        professor: {
          select: {
            fullname: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
