import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create workgroups
  const workgroups = await Promise.all([
    prisma.workgroup.upsert({
      where: { id: BigInt(1) },
      update: {},
      create: {
        group_name: "คอมพิวเตอร์",
        description: "กลุ่มงานคอมพิวเตอร์และเทคโนโลยีสารสนเทศ",
        color_code: "#0ea5e9",
      },
    }),
    prisma.workgroup.upsert({
      where: { id: BigInt(2) },
      update: {},
      create: {
        group_name: "วิชาการ",
        description: "กลุ่มงานวิชาการ",
        color_code: "#10b981",
      },
    }),
    prisma.workgroup.upsert({
      where: { id: BigInt(3) },
      update: {},
      create: {
        group_name: "บุคลากร",
        description: "กลุ่มงานบุคลากร",
        color_code: "#f59e0b",
      },
    }),
    prisma.workgroup.upsert({
      where: { id: BigInt(4) },
      update: {},
      create: {
        group_name: "ประชาสัมพันธ์",
        description: "กลุ่มงานประชาสัมพันธ์",
        color_code: "#06b6d4",
      },
    }),
  ]);

  console.log(`✅ Created ${workgroups.length} workgroups`);

  // Create sample systems
  const systems = [
    {
      system_name: "ระบบลงทะเบียนนักเรียนออนไลน์",
      system_url: "https://chomthongschool.ac.th/register",
      workgroup_id: workgroups[1].id,
      creator_name: "ทีมวิชาการ",
      note: "ระบบรับสมัครนักเรียนใหม่",
      is_pinned: true,
      sort_order: 1,
      status: "active" as const,
    },
    {
      system_name: "ระบบตรวจสอบผลการเรียน",
      system_url: "https://chomthongschool.ac.th/grade",
      workgroup_id: workgroups[1].id,
      creator_name: "กลุ่มวิชาการ",
      note: "ดูผลการเรียนออนไลน์",
      is_pinned: true,
      sort_order: 2,
      status: "active" as const,
    },
    {
      system_name: "ระบบจัดการข้อมูลบุคลากร",
      system_url: null,
      workgroup_id: workgroups[2].id,
      creator_name: "ฝ่ายบุคลากร",
      note: "อยู่ระหว่างพัฒนา",
      is_pinned: false,
      sort_order: 3,
      status: "inactive" as const,
    },
    {
      system_name: "ระบบประชาสัมพันธ์โรงเรียน",
      system_url: "https://chomthongschool.ac.th",
      workgroup_id: workgroups[3].id,
      creator_name: "ทีมประชาสัมพันธ์",
      note: "เว็บไซต์หลักของโรงเรียน",
      is_pinned: false,
      sort_order: 4,
      status: "active" as const,
    },
    {
      system_name: "ระบบสั่งซื้ออุปกรณ์การเรียน",
      system_url: null,
      workgroup_id: workgroups[0].id,
      creator_name: "ฝ่ายคอมพิวเตอร์",
      note: null,
      is_pinned: false,
      sort_order: 5,
      status: "active" as const,
    },
  ];

  for (const system of systems) {
    await prisma.system.create({ data: system });
  }

  console.log(`✅ Created ${systems.length} systems`);
  console.log("✨ Seeding completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
