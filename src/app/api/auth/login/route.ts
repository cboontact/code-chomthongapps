import { NextRequest } from "next/server";
import { z } from "zod";
import { createAdminToken, validateAdminPassword } from "@/lib/admin-auth";
import { errorResponse, successResponse, validationError } from "@/lib/api-response";

const LoginSchema = z.object({
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    if (!validateAdminPassword(parsed.data.password)) {
      return errorResponse("รหัสผ่านไม่ถูกต้อง", 401);
    }

    const session = createAdminToken();
    if (!session) {
      return errorResponse("ยังไม่ได้ตั้งค่า ADMIN_PASSWORD หรือ ADMIN_SESSION_SECRET", 500);
    }

    return successResponse(session);
  } catch {
    return errorResponse("ไม่สามารถเข้าสู่ระบบได้");
  }
}
