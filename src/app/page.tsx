import { supabase } from '@/lib/supabase';

export default async function Home() {
  if (!supabase) {
    return (
      <main className="min-h-screen p-8 font-sans">
        <h1 className="text-2xl font-bold mb-4">Jondhale Folio — Phase 0</h1>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <strong>Supabase not configured.</strong> Copy <code className="bg-amber-100 px-1 rounded">.env.local.example</code> to{' '}
          <code className="bg-amber-100 px-1 rounded">.env.local</code> and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </div>
      </main>
    );
  }

  const { data, error } = await supabase.from('departments').select('*');

  return (
    <main className="min-h-screen p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Jondhale Folio — Phase 0</h1>
      <p className="text-gray-600 mb-6">
        If you see the 5 departments below, Supabase is connected and Phase 0 is done.
      </p>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <strong>Supabase error:</strong> {error.message}
          <p className="mt-2 text-sm">
            Ensure .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
          </p>
        </div>
      )}
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
        {JSON.stringify(data ?? [], null, 2)}
      </pre>
    </main>
  );
}
