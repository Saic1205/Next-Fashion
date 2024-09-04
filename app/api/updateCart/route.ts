import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const { id, cart } = await request.json();

  const garmentsPath = path.join(process.cwd(), "app", "data", "garments.ts");
  const fabricsPath = path.join(process.cwd(), "app", "data", "fabrics.ts");

  let updatedItem = null;

  
  async function updateFile(filePath: string) {
    let content = await fs.readFile(filePath, "utf8");
    const regex = new RegExp(`id:\\s*${id}[^}]+cart:\\s*\\w+`);
    const newContent = content.replace(regex,
      `id: ${id},\n
      cart: ${cart}`);

    if (content !== newContent) {
      await fs.writeFile(filePath, newContent, "utf8");
      updatedItem = { id, cart };
      return true;
    }
    return false;
  }

  // Try to update garments file
  let updated = await updateFile(garmentsPath);

  // If not found in garments, try fabrics
  if (!updated) {
    updated = await updateFile(fabricsPath);
  }

  if (!updatedItem) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json(updatedItem);
}

/*import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const { id, cart } = await request.json();

  const filePath = path.join(process.cwd(), "app", "data", "garments.ts");
  let content = await fs.readFile(filePath, "utf8");

  const regex = new RegExp(`id:\\s*${id}[^}]+cart:\\s*\\w+`);
  content = content.replace(
    regex,
    `id: ${id}, 
    cart: ${cart}`
  );

  await fs.writeFile(filePath, content, "utf8");

  return NextResponse.json({ success: true });
}
*/
