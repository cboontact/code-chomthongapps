import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { WorkgroupSchema } from "@/lib/validators";
import {
  successResponse,
  errorResponse,
  validationError,
} from "@/lib/api-response";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET() {
  try {
    const workgroups = await prisma.workgroup.findMany({
      orderBy: { group_name: "asc" },
      include: {
        _count: { select: { systems: true } },
      },
    });
    return successResponse(workgroups);
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Unknown error";
    return errorResponse(`ไม่สามารถดึงข้อมูลกลุ่มงานได้: ${detail}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) return errorResponse("ไม่มีสิทธิ์ดำเนินการ", 401);

    const body = await req.json();
    const parsed = WorkgroupSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }
    const workgroup = await prisma.workgroup.create({ data: parsed.data });
    return successResponse(workgroup, 201);
  } catch {
    return errorResponse("ไม่สามารถสร้างกลุ่มงานได้");
  }
}
