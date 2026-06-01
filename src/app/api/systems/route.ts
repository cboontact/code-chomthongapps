import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SystemSchema } from "@/lib/validators";
import {
  successResponse,
  errorResponse,
  validationError,
} from "@/lib/api-response";
import { isAdminRequest } from "@/lib/admin-auth";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const workgroup_id = searchParams.get("workgroup_id") ?? "";
    const status = searchParams.get("status") ?? "";
    const sortField = searchParams.get("sortField") ?? "sort_order";
    const sortOrder = (searchParams.get("sortOrder") ?? "asc") as "asc" | "desc";

    const allowedSortFields = ["system_name", "sort_order", "created_at", "status"];
    const safeSortField = allowedSortFields.includes(sortField) ? sortField : "sort_order";

    const where: Prisma.SystemWhereInput = {
      ...(search && {
        OR: [
          { system_name: { contains: search } },
          { creator_name: { contains: search } },
          { note: { contains: search } },
        ],
      }),
      ...(workgroup_id && { workgroup_id: BigInt(workgroup_id) }),
      ...(status && { status: status as "active" | "inactive" }),
    };

    const [systems, total] = await Promise.all([
      prisma.system.findMany({
        where,
        include: { workgroup: true },
        orderBy: [
          { is_pinned: "desc" },
          { [safeSortField]: sortOrder },
        ],
      }),
      prisma.system.count({ where }),
    ]);

    return successResponse({ data: systems, total });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Unknown error";
    return errorResponse(`ไม่สามารถดึงข้อมูลระบบได้: ${detail}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) return errorResponse("ไม่มีสิทธิ์ดำเนินการ", 401);

    const body = await req.json();
    const parsed = SystemSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { workgroup_id, system_url, ...rest } = parsed.data;

    const system = await prisma.system.create({
      data: {
        ...rest,
        system_url: system_url || null,
        ...(workgroup_id ? { workgroup_id: BigInt(workgroup_id) } : {}),
      },
      include: { workgroup: true },
    });

    return successResponse(system, 201);
  } catch {
    return errorResponse("ไม่สามารถสร้างระบบได้");
  }
}
