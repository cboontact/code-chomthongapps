# HostAtom Deployment Guide

เอกสารนี้เตรียมไว้สำหรับนำระบบ Chomthong Web Apps ขึ้น HostAtom เมื่อได้รายละเอียดโฮสต์จริงแล้วให้เติมค่าตาม cPanel/Node.js App ของบัญชีนั้น

## Hosting Requirement

ระบบนี้ต้องใช้:

- Node.js runtime
- MySQL database
- Environment variables
- Ability to run `npm install`, `npm run build` หรืออัปโหลด standalone bundle

ไม่ควร deploy เป็น static export เพราะระบบมี API routes และ Prisma

## Required Environment Variables

ตั้งค่าบน HostAtom/cPanel:

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
ADMIN_PASSWORD="รหัสผ่านผู้ดูแล"
ADMIN_SESSION_SECRET="สุ่มข้อความยาวอย่างน้อย 32 ตัวอักษร"
ADMIN_SESSION_TTL_SECONDS="86400"
NODE_ENV="production"
```

ถ้า HostAtom ให้ port มาเอง ให้ใช้ port นั้นผ่านตัวแปร `PORT`

## Build Locally

```bash
npm install
npm run deploy:standalone
```

ผลลัพธ์หลักอยู่ที่:

```bash
.next/standalone
```

โฟลเดอร์นี้มี `server.js`, runtime dependencies, `public`, และ `.next/static` พร้อมรันบน Node server

## Upload Option A: Standalone Bundle

อัปโหลดไฟล์เหล่านี้ขึ้น HostAtom:

```text
.next/standalone/*
```

Start command:

```bash
node server.js
```

Working directory ต้องเป็น directory ที่มี `server.js`

## Upload Option B: Full Project

อัปโหลดทั้งโปรเจกต์ ยกเว้น `node_modules`, `.next`, `.env` local แล้วรันบนโฮสต์:

```bash
npm install
npm run build
npm run start
```

วิธีนี้ง่ายกว่าเมื่อ HostAtom รองรับ terminal และ build บน server ได้

## Database Setup

หลังตั้ง `DATABASE_URL` แล้วให้ sync schema:

```bash
npm run db:push
```

ถ้าต้องการข้อมูลตัวอย่าง:

```bash
npm run db:seed
```

## Pre-Launch Checklist

- ตั้ง `DATABASE_URL` เป็น database ของ HostAtom
- เปลี่ยน `ADMIN_PASSWORD`
- ตั้ง `ADMIN_SESSION_SECRET` เป็นค่าสุ่มยาว
- ตรวจว่า domain ชี้เข้า Node app ถูกต้อง
- ทดสอบหน้าแรกโหลดรายการระบบได้
- ทดสอบ login admin แล้วเพิ่ม/แก้ไข/ลบระบบได้
- ทดสอบ logout แล้ว API mutation ถูกปฏิเสธ
