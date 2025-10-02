import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const files = form.getAll("files");
    const fileList: File[] = files.filter((f): f is File => f instanceof File);

    if (fileList.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 },
      );
    }

    const utapi = new UTApi();
    const uploaded = await utapi.uploadFiles(fileList);

    const urls = uploaded
      .map((u) => (Array.isArray(u) ? u[0] : u))
      .map((u) => u?.data?.url)
      .filter(Boolean) as string[];

    return NextResponse.json({ success: true, urls });
  } catch (e) {
    console.error("UploadThing direct error:", e);
    return NextResponse.json({ error: "Falha no upload" }, { status: 500 });
  }
}
