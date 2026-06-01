import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { WorkgroupSchema } from "@/lib/validators";
import {
  successResponse,
  errorResponse,
  notFound,
  validationError,
} from "@/lib/api-response";
import { isAdminRequest } from "@/lib/admin-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const workgroup = await prisma.workgroup.findUnique({
      where: { id: BigInt(id) },
      include: { _count: { select: { systems: true } } },
    });
    if (!workgroup) return notFound("ไม่พบกลุ่มงาน");
    return successResponse(workgroup);
  } catch {
    return errorResponse("ไม่สามารถดึงข้อมูลกลุ่มงานได้");
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    if (!isAdminRequest(req)) return errorResponse("ไม่มีสิทธิ์ดำเนินการ", 401);

    const { id } = await params;
    const body = await req.json();
    const parsed = WorkgroupSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }
    const existing = await prisma.workgroup.findUnique({
      where: { id: BigInt(id) },
    });
    if (!existing) return notFound("ไม่พบกลุ่มงาน");
    const workgroup = await prisma.workgroup.update({
      where: { id: BigInt(id) },
      data: parsed.data,
    });
    return successResponse(workgroup);
  } catch {
    return errorResponse("ไม่สามารถอัปเดตกลุ่มงานได้");
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    if (!isAdminRequest(_req)) return errorResponse("ไม่มีสิทธิ์ดำเนินการ", 401);

    const { id } = await params;
    const existing = await prisma.workgroup.findUnique({
      where: { id: BigInt(id) },
      include: { _count: { select: { systems: true } } },
    });
    if (!existing) return notFound("ไม่พบกลุ่มงาน");
    if (existing._count.systems > 0) {
      return errorResponse("ไม่สามารถลบกลุ่มงานที่มีระบบอยู่ได้", 409);
    }
    await prisma.workgroup.delete({ where: { id: BigInt(id) } });
    return successResponse({ message: "ลบกลุ่มงานเรียบร้อยแล้ว" });
  } catch {
    return errorResponse("ไม่สามารถลบกลุ่มงานได้");
  }
}
