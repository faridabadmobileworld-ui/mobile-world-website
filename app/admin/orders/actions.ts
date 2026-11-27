'use server';
import { requireOwnerAccess } from '@/app/spin-admin-actions';
import { ownerDecision, setQuote, ShoppingError } from '@/lib/commerce/orders';
import type { RequestStatus } from '@/lib/commerce/core';

export async function manageOrder(id: string, from: RequestStatus, version: string, form: FormData) {
  await requireOwnerAccess();
  try {
    const action = form.get('action');
    if (action === 'quote') {
      const amounts = form.getAll('unit').map(value => typeof value === 'string' && value.trim() ? Number(value) : NaN);
      const rawFee = form.get('fee');
      const fee = typeof rawFee === 'string' && rawFee.trim() ? Number(rawFee) : NaN;
      const descriptions = form.getAll('description').map(v => typeof v === 'string' ? v : '');
      await setQuote(id,from,version,amounts,fee,descriptions);
    } else if (action === 'ready' || action === 'completed' || action === 'cancelled') await ownerDecision(id,from,action);
    else throw new ShoppingError('सही action चुनिए।');
    return { ok:true as const };
  } catch (e) { return { ok:false as const, message:e instanceof ShoppingError ? e.message : 'Order update save नहीं हुआ। फिर कोशिश कीजिए।' }; }
}
