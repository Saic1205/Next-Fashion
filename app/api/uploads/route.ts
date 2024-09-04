import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("files") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    await saveFile(file, filePath);

    return NextResponse.json(
      { message: "File uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: "Error uploading file" },
      { status: 500 }
    );
  }
}

async function saveFile(file: File, filePath: string): Promise<void> {
  const buffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(buffer));
}
