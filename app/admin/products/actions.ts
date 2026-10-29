'use server';
import { revalidatePath } from 'next/cache';
import { requireOwnerAccess } from '@/app/spin-admin-actions';
import { connectSanity, connectionStatus, editorRecords, publishProduct, saveDraft, unpublishProduct, uploadProductImage } from '@/lib/catalog/sanity';

async function ownerAction<T>(work: () => Promise<T>) {
  await requireOwnerAccess();
  try { return { ok: true as const, data: await work() }; }
  catch (error) { return { ok: false as const, error: error instanceof Error ? error.message : 'Action पूरा नहीं हुआ। Connection जाँचकर फिर कोशिश कीजिए।' }; }
}

export async function productEditorState() {
  await requireOwnerAccess();
  const connection = await connectionStatus();
  return { connection, records: connection.configured ? await editorRecords() : [] };
}
export async function configureSanity(projectId: string, dataset: string, token: string) {
  return ownerAction(async () => { await connectSanity({ projectId, dataset, token }); return null; });
}
export async function saveProductDraft(input: unknown, revision: string) {
  return ownerAction(async () => { await saveDraft(input, revision); return null; });
}
function refresh() {
  revalidatePath('/products', 'layout'); revalidatePath('/catalog', 'layout'); revalidatePath('/sitemap.xml');
}
export async function publishSavedProduct(id: string, draftRevision: string, publishedRevision: string) {
  return ownerAction(async () => { const result = await publishProduct(id, draftRevision, publishedRevision); refresh(); return result; });
}
export async function unpublishSavedProduct(id: string, publishedRevision: string) {
  return ownerAction(async () => { const result = await unpublishProduct(id, publishedRevision); refresh(); return result; });
}
export async function uploadEditorImage(form: FormData) {
  return ownerAction(async () => {
    const image = form.get('image');
    if (!(image instanceof File)) throw new Error('Image चुनिए।');
    return { url: await uploadProductImage(image) };
  });
}
