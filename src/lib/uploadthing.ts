import { UTApi } from "uploadthing/server";

// Instância do cliente UploadThing para operações server-side
export const utapi = new UTApi();

/**
 * Exclui um arquivo do UploadThing usando sua URL
 * @param fileUrl - URL completa do arquivo no UploadThing
 * @returns Promise<boolean> - true se excluído com sucesso, false caso contrário
 */
export async function deleteUploadThingFile(fileUrl: string): Promise<boolean> {
  try {
    // Extrair a chave do arquivo da URL
    // URL format: https://utfs.io/f/[key]
    const urlParts = fileUrl.split("/");
    const fileKey = urlParts[urlParts.length - 1];

    if (!fileKey) {
      console.error(
        "Não foi possível extrair a chave do arquivo da URL:",
        fileUrl,
      );
      return false;
    }

    // Excluir o arquivo
    await utapi.deleteFiles([fileKey]);
    console.log("✅ Arquivo excluído do UploadThing:", fileKey);
    return true;
  } catch (error) {
    console.error("❌ Erro ao excluir arquivo do UploadThing:", error);
    return false;
  }
}

/**
 * Exclui múltiplos arquivos do UploadThing
 * @param fileUrls - Array de URLs dos arquivos
 * @returns Promise<{ success: number; failed: number }> - Contadores de sucesso e falha
 */
export async function deleteUploadThingFiles(
  fileUrls: string[],
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  // Processar exclusões em paralelo para melhor performance
  const results = await Promise.allSettled(
    fileUrls.map((url) => deleteUploadThingFile(url)),
  );

  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      success++;
    } else {
      failed++;
    }
  });

  console.log(`📊 Exclusão de arquivos: ${success} sucessos, ${failed} falhas`);
  return { success, failed };
}
