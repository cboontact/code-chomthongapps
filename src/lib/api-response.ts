import { NextResponse } from "next/server";

// Serialize BigInt and Date fields for JSON compatibility
function serializeData(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data === "bigint") return data.toString();
  if (data instanceof Date) return data.toISOString();
  if (Array.isArray(data)) return data.map(serializeData);
  if (typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([k, v]) => [k, serializeData(v)])
    );
  }
  return data;
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data: serializeData(data) }, { status });
}

export function errorResponse(error: string, status = 500) {
  return NextResponse.json({ success: false, error }, { status });
}

export function notFound(message = "ไม่พบข้อมูล") {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export function validationError(errors: Record<string, string[]>) {
  return NextResponse.json(
    { success: false, error: "ข้อมูลไม่ถูกต้อง", details: errors },
    { status: 422 }
  );
}
