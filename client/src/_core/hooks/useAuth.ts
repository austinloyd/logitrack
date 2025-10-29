import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/signin" } =
    options ?? {};
  
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const utils = trpc.useUtils();

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);

      // Store user info in localStorage
      if (user) {
        localStorage.setItem("user", JSON.stringify({
          id: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email,
          photo: user.photoURL
        }));
      } else {
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);

  // Create user object from Firebase
  const user = useMemo(() => {
    if (!firebaseUser) return null;
    
    return {
      id: parseInt(firebaseUser.uid.slice(0, 8), 16), // Convert to number
      name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
      email: firebaseUser.email || "",
      loginMethod: "email",
      role: "customer" as const,
    };
  }, [firebaseUser]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    loading,
    user,
  ]);

  return {
    user,
    loading,
    error: null,
    isAuthenticated: Boolean(user),
    refresh: async () => {},
    logout,
  };
}
