import { z } from "zod";

export const WorkgroupSchema = z.object({
  group_name: z
    .string()
    .min(1, "กรุณาระบุชื่อกลุ่มงาน")
    .max(255, "ชื่อกลุ่มงานยาวเกินไป")
    .trim(),
  description: z.string().max(1000).trim().optional().nullable(),
  color_code: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "รูปแบบสีไม่ถูกต้อง")
    .optional()
    .nullable(),
});

export const SystemSchema = z.object({
  system_name: z
    .string()
    .min(1, "กรุณาระบุชื่อระบบ")
    .max(255, "ชื่อระบบยาวเกินไป")
    .trim(),
  system_url: z
    .string()
    .url("รูปแบบ URL ไม่ถูกต้อง")
    .max(500)
    .optional()
    .nullable()
    .or(z.literal("")),
  workgroup_id: z.string().optional().nullable(),
  creator_name: z.string().max(255).trim().optional().nullable(),
  note: z.string().max(2000).trim().optional().nullable(),
  is_pinned: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const SystemUpdateSchema = SystemSchema.partial();

export type WorkgroupInput = z.infer<typeof WorkgroupSchema>;
export type SystemInput = z.infer<typeof SystemSchema>;
export type SystemUpdateInput = z.infer<typeof SystemUpdateSchema>;
