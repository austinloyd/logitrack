import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { APP_TITLE } from "@/const";

export default function SignIn() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Firebase auth object:", auth);
      console.log("Attempting authentication with:", { email, isSignUp });
      
      if (isSignUp) {
        console.log("Creating new account...");
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully!");
      } else {
        console.log("Signing in with email and password...");
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Signed in successfully!");
      }
      
      // Redirect to home page after successful sign in
      navigate("/");
      
      // Store auth state in localStorage
      const user = auth.currentUser;
      console.log("Current user after auth:", user);
      if (user) {
        localStorage.setItem("user", JSON.stringify({
          id: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email,
          photo: user.photoURL
        }));
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      console.log("Starting Google sign-in process...");
      const provider = new GoogleAuthProvider();
      console.log("Google provider created");
      
      // Add scopes if needed
      provider.addScope('email');
      provider.addScope('profile');
      
      console.log("Attempting sign in with popup...");
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google!");
      
      // Redirect to home page
      navigate("/");
      
      // Store auth state
      const user = auth.currentUser;
      console.log("Current user after Google auth:", user);
      if (user) {
        localStorage.setItem("user", JSON.stringify({
          id: user.uid,
          name: user.displayName || "User",
          email: user.email,
          photo: user.photoURL
        }));
      }
    } catch (error: any) {
      console.error("Google sign in error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      if (error.code === 'auth/configuration-not-found') {
        console.error("Firebase project configuration not found. Check your Firebase project settings and make sure the app is properly registered.");
        toast.error("Authentication configuration error. Please contact support.");
      } else {
        toast.error(error.message || "Failed to sign in with Google");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-cyan-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent mb-2">{APP_TITLE}</h1>
          <p className="text-foreground/70">Welcome back! Please sign in to continue</p>
        </div>

        {/* Sign In Card */}
        <Card className="card-bubble border-0 bg-white/90 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isSignUp ? "Create Account" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp ? "Start your logistics journey" : "Access your portals"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={18} />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={18} />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="btn-bubble-primary w-full"
              >
                {loading ? (
                  "Please wait..."
                ) : isSignUp ? (
                  <>
                    <UserPlus size={18} className="mr-2" />
                    Create Account
                  </>
                ) : (
                  <>
                    <LogIn size={18} className="mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-sm text-foreground/70">or</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Toggle Sign Up/Sign In */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setEmail("");
                  setPassword("");
                }}
                className="text-accent hover:underline text-sm"
              >
                {isSignUp ? (
                  <>Already have an account? Sign in</>
                ) : (
                  <>Don't have an account? Sign up</>
                )}
              </button>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <Link href="/" className="text-foreground/70 hover:text-accent text-sm">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

