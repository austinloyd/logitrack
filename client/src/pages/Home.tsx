import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { Star, Package, MapPin, Users, TrendingUp } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const submitFeedback = trpc.feedback.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your feedback!");
      setFeedbackOpen(false);
      setRating(0);
      setComment("");
    },
    onError: () => {
      toast.error("Failed to submit feedback");
    },
  });

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    submitFeedback.mutate({
      rating,
      comment,
      customerId: user?.id,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-cyan-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-100">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
            <h1 className="text-2xl font-bold text-accent">{APP_TITLE}</h1>
          </div>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-foreground">Welcome, {user?.name}</span>
                <Link href="/customer" className="btn-bubble-primary text-sm">
                  Dashboard
                </Link>
              </>
            ) : (
              <Link href="/signin" className="btn-bubble-primary text-sm">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-foreground mb-6">
              Logistics Made <span className="text-accent">Simple</span>
            </h2>
            <p className="text-xl text-foreground/70 mb-8">
              Track your shipments in real-time, manage warehouse storage, and connect with professional drivers. LogiTrack Pro makes logistics effortless.
            </p>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <Link href="/customer" className="btn-bubble-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <Link href="/signin" className="btn-bubble-primary">
                  Get Started
                </Link>
              )}
              <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
                <DialogTrigger asChild>
                  <button className="btn-bubble-outline">
                    Share Feedback
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Your Feedback</DialogTitle>
                    <DialogDescription>
                      Help us improve LogiTrack Pro by sharing your thoughts and experience.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="transition-transform hover:scale-110"
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star
                              size={32}
                              className={
                                star <= (hoveredStar || rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Comments</label>
                      <Textarea
                        placeholder="Tell us what you think..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-24"
                      />
                    </div>
                    <button
                      onClick={handleSubmitFeedback}
                      disabled={submitFeedback.isPending}
                      className="btn-bubble-primary w-full"
                    >
                      {submitFeedback.isPending ? "Submitting..." : "Submit Feedback"}
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-green-200 to-blue-200 rounded-3xl p-8 shadow-xl">
              <div className="space-y-4">
                <div className="bg-white/80 rounded-2xl p-4 shadow-md">
                  <p className="text-sm text-foreground/70">Real-time Tracking</p>
                  <p className="text-2xl font-bold text-accent">Track Anywhere</p>
                </div>
                <div className="bg-white/80 rounded-2xl p-4 shadow-md">
                  <p className="text-sm text-foreground/70">Professional Drivers</p>
                  <p className="text-2xl font-bold text-accent">Trusted Delivery</p>
                </div>
                <div className="bg-white/80 rounded-2xl p-4 shadow-md">
                  <p className="text-sm text-foreground/70">Warehouse Storage</p>
                  <p className="text-2xl font-bold text-accent">Secure Storage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/50 py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center text-foreground mb-16">
            Why Choose <span className="text-accent">LogiTrack Pro</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Package,
                title: "Easy Shipping",
                description: "Create orders in minutes with our simple form",
              },
              {
                icon: MapPin,
                title: "Live Tracking",
                description: "Track your packages in real-time with GPS",
              },
              {
                icon: Users,
                title: "Professional Drivers",
                description: "Vetted and experienced delivery professionals",
              },
              {
                icon: TrendingUp,
                title: "Analytics",
                description: "Detailed insights for business growth",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="card-bubble border-0 bg-gradient-to-br from-green-50 to-blue-50">
                  <CardHeader>
                    <Icon className="h-8 w-8 text-accent mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-4xl font-bold text-center text-foreground mb-16">
          Access Your <span className="text-accent">Portal</span>
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Customer Portal",
              description: "Create orders, track shipments, and manage your logistics",
              color: "from-green-100 to-green-200",
              path: "/customer",
              buttonText: "Go to Portal",
            },
            {
              title: "Driver Portal",
              description: "Manage deliveries, update locations, and track earnings",
              color: "from-cyan-100 to-cyan-200",
              path: "/driver",
              buttonText: "Go to Portal",
            },
            {
              title: "Admin Portal",
              description: "Monitor operations, analytics, and manage the platform",
              color: "from-blue-100 to-blue-200",
              path: "/admin",
              buttonText: "Go to Portal",
            },
          ].map((portal, idx) => (
            <Card key={idx} className={`card-bubble border-0 bg-gradient-to-br ${portal.color} overflow-hidden`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{portal.title}</CardTitle>
                <CardDescription className="text-base">{portal.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={portal.path} className="btn-bubble-primary w-full block text-center">
                  {portal.buttonText}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-foreground/70">
          <p>&copy; 2025 {APP_TITLE}. All rights reserved.</p>
          <p className="text-sm mt-2">Powered by advanced logistics technology</p>
        </div>
      </footer>
    </div>
  );
}
