import { supabase } from './supabase.js';

export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (error) return { user: null, error: error.message };
  return { user: data.user, error: null };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { user: null, error: error.message };
  return { user: data.user, error: null };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

export async function getProfile(userId, fallbackUser) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!error) return { profile: data, error: null };

  if (fallbackUser) {
    const username = fallbackUser.user_metadata?.username || fallbackUser.email.split('@')[0];

    const { data: created, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id:         userId,
        username,
        xp:         0,
        level:      1,
        high_score: 0,
        language:   'English',
      })
      .select()
      .single();

    if (insertError) return { profile: null, error: insertError.message };
    return { profile: created, error: null };
  }

  return { profile: null, error: error.message };
}

export async function updateProfile(userId, fields) {
  const { error } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', userId);

  return { error: error?.message ?? null };
}

export async function verifyOtp(email, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });

  if (error) return { user: null, error: error.message };
  return { user: data.user, error: null };
}

export async function getLeaderboard() {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*');

  if (error) return { board: [], error: error.message };
  return { board: data, error: null };
}