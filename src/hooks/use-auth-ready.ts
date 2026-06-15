import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const ADMIN_EMAILS = ["mentorwiseaiedtech@gmail.com", "saifahmedmentorwise@gmail.com"];

export function isAdminEmail(email: string | null | undefined) {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

export function getUserDisplayName(user: User | null) {
  if (!user) return "Guest";
  const meta = user.user_metadata || {};
  return (
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.display_name === "string" && meta.display_name) ||
    user.email ||
    "Guest"
  );
}

export function useAuthReady() {
  const [state, setState] = useState({
    isReady: false,
    user: null as User | null,
  });

  useEffect(() => {
    let mounted = true;

    const apply = (user: User | null, isReady = true) => {
      if (!mounted) return;
      setState({ isReady, user });
    };

    supabase.auth
      .getSession()
      .then(({ data }) => apply(data.session?.user ?? null))
      .catch(() => apply(null));

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        apply(null);
        return;
      }
      if (session?.user) {
        apply(session.user);
        return;
      }
      if (event === "INITIAL_SESSION") apply(null);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const email = state.user?.email?.toLowerCase() ?? null;

  return {
    ...state,
    email,
    isAdmin: isAdminEmail(email),
    displayName: getUserDisplayName(state.user),
  };
}