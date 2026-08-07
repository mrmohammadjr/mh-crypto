import { NextResponse } from 'next/server';
 import { auth } from '@/auth';
  import { supabaseAdmin } from '@/lib/supabase/client';
 import { z } from 'zod';
 
 export async function POST(req: Request) {
   const session = await auth();
   const watchlistItemSchema = z.object({
     coinId: z.string().min(1),
     coinSymbol: z.string().min(1),
     coinName: z.string().min(1),
     coinIcon: z.string().min(1),
     coinPrice: z.string().min(1),
     coinPriceDay: z.string().min(1),
     coinMarketCap: z.string().min(1),
   });

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = watchlistItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { data: user, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('watchlist')
    .eq('id', session.user.id) // ✅ FIX
    .single();

  if (fetchError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const currentWatchlist = user.watchlist ?? [];

  if (currentWatchlist.some((i: { coinId: string }) => i.coinId === parsed.data.coinId)) {
    return NextResponse.json({ watchlist: currentWatchlist }, { status: 200 });
  }

  const newItem = {
    ...parsed.data,
    addedAt: new Date().toISOString(),
  };

  const updatedWatchlist = [...currentWatchlist, newItem];

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('users')
    .update({ watchlist: updatedWatchlist })
    .eq('id', session.user.id) // ✅ FIX
    .select('watchlist')
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ watchlist: updated.watchlist }, { status: 200 });
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('watchlist')
    .eq('id', session.user.id)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ watchlist: user.watchlist ?? [] });
}

export async function DELETE(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const { coinId } = body as { coinId: string }; // ✅ FIX

  const { data: user, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('watchlist')
    .eq('id', session.user.id)
    .single();

  if (fetchError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const updatedWatchlist = (user.watchlist ?? []).filter(
    (i: { coinId: string }) => i.coinId !== coinId // ✅ FIX
  );

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('users')
    .update({ watchlist: updatedWatchlist })
    .eq('id', session.user.id)
    .select('watchlist')
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ watchlist: updated.watchlist }, { status: 200 });
}