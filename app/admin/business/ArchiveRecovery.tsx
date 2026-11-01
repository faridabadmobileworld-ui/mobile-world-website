'use client';
import { useRef, useState } from 'react';
import { businessResult } from '@/lib/business/result';
import { downloadArchiveBackup, previewArchiveRestore, restoreDailyArchive } from './actions';

export function ArchiveRecovery({ from, to, onRestored }: { from: string; to: string; onRestored: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState('');
  const [preview, setPreview] = useState<{ days: number; from: string; to: string; existing: number; missing: number } | null>(null);
  const input = useRef<HTMLInputElement>(null);
  async function run(action: () => Promise<void>) {
    setBusy(true); setError(''); setMessage('');
    try { await action(); } catch (failure) { setError(failure instanceof Error ? failure.message : 'Backup operation पूरी नहीं हुई। फिर कोशिश कीजिए।'); } finally { setBusy(false); }
  }
  return <section className="ma-card">
    <h2>Daily summary का backup और recovery</h2>
    <p>चुनी तारीख़ों के closed-day totals की JSON copy download कीजिए। इसमें customer journeys, enquiries, products या passwords नहीं हैं। Recovery केवल missing days जोड़ती है; मौजूद totals सुरक्षित रहते हैं। यह पूरा website backup नहीं है।</p>
    <button disabled={busy} onClick={() => void run(async () => {
      const text = businessResult(await downloadArchiveBackup(from, to));
      const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url; link.download = `Mobile-World-Daily-Backup-${from}-${to}.json`; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('Backup download शुरू हुआ। File अपने पास सुरक्षित रखिए।');
    })}>JSON backup download ↓</button>
    <details>
      <summary>Saved backup से missing days लौटाइए</summary>
      <label className="ma-backup-file">Mobile World backup JSON
        <input ref={input} type="file" accept="application/json,.json" disabled={busy} onChange={event => {
          const selected = event.currentTarget.files?.[0]; setPreview(null); setFile(''); setError(''); setMessage('');
          if (!selected) return;
          void run(async () => {
            if (selected.size > 900_000) throw new Error('Backup file 900 KB से बड़ी है। छोटी date range का backup चुनिए।');
            const text = await selected.text(); const result = businessResult(await previewArchiveRestore(text)); setFile(text); setPreview(result);
          });
        }}/>
      </label>
      {preview && <div>
        <p>{preview.from} – {preview.to} · {preview.days} days · {preview.missing} missing · {preview.existing} already saved.</p>
        <button disabled={busy} onClick={() => void run(async () => {
          const result = businessResult(await restoreDailyArchive(file));
          setPreview(null); setFile(''); if (input.current) input.current.value = '';
          setMessage(`${result.restored} days restored · ${result.skipped} existing days सुरक्षित।`);
          if (result.failed) setError(`${result.failed} days save नहीं हुए। वही backup फिर चुनकर retry कीजिए; saved days duplicate नहीं होंगे।`);
          await onRestored();
        })}>{busy ? 'Recovery चल रही है…' : 'Missing days restore कीजिए'}</button>
      </div>}
    </details>
    {error && <p className="ma-error" role="alert">{error}</p>}
    {message && <p className="ma-success" role="status">{message}</p>}
  </section>;
}
