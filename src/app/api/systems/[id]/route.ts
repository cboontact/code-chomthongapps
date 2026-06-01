import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SystemUpdateSchema } from "@/lib/validators";
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
    const system = await prisma.system.findUnique({
      where: { id: BigInt(id) },
      include: { workgroup: true },
    });
    if (!system) return notFound("ไม่พบระบบ");
    return successResponse(system);
  } catch {
    return errorResponse("ไม่สามารถดึงข้อมูลระบบได้");
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    if (!isAdminRequest(req)) return errorResponse("ไม่มีสิทธิ์ดำเนินการ", 401);

    const { id } = await params;
    const body = await req.json();
    const parsed = SystemUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const existing = await prisma.system.findUnique({ where: { id: BigInt(id) } });
    if (!existing) return notFound("ไม่พบระบบ");

    const { workgroup_id, system_url, ...rest } = parsed.data;

    const system = await prisma.system.update({
      where: { id: BigInt(id) },
      data: {
        ...rest,
        ...(system_url !== undefined ? { system_url: system_url || null } : {}),
        ...(workgroup_id !== undefined
          ? { workgroup_id: workgroup_id ? BigInt(workgroup_id) : null }
          : {}),
      },
      include: { workgroup: true },
    });

    return successResponse(system);
  } catch {
    return errorResponse("ไม่สามารถอัปเดตระบบได้");
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    if (!isAdminRequest(_req)) return errorResponse("ไม่มีสิทธิ์ดำเนินการ", 401);

    const { id } = await params;
    const existing = await prisma.system.findUnique({ where: { id: BigInt(id) } });
    if (!existing) return notFound("ไม่พบระบบ");
    await prisma.system.delete({ where: { id: BigInt(id) } });
    return successResponse({ message: "ลบระบบเรียบร้อยแล้ว" });
  } catch {
    return errorResponse("ไม่สามารถลบระบบได้");
  }
}
