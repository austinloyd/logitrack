import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Eye, Download, Package, Warehouse } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function CustomerPortal() {
  const { user, isAuthenticated, loading } = useAuth();
  const [orderType, setOrderType] = useState<"ship" | "warehouse" | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [formData, setFormData] = useState({
    pickupLocation: "",
    deliveryLocation: "",
    packageWeight: "",
    packageDimensions: "",
    description: "",
  });

  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (result: any) => {
      toast.success(`Order created! Tracking ID: ${result.trackingId}`);
      setFormOpen(false);
      setOrderType(null);
      setFormData({
        pickupLocation: "",
        deliveryLocation: "",
        packageWeight: "",
        packageDimensions: "",
        description: "",
      });
      refetchOrders();
    },
    onError: () => {
      toast.error("Failed to create order");
    },
  });

  const { data: orders = [], refetch: refetchOrders } = trpc.orders.getMyOrders.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: trackedOrder } = trpc.orders.getByTrackingId.useQuery(
    { trackingId },
    { enabled: trackingOpen && trackingId.length > 0 }
  );

  const handleCreateOrder = () => {
    if (!orderType || !formData.pickupLocation || !formData.packageWeight || !formData.packageDimensions) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (orderType === "ship" && !formData.deliveryLocation) {
      toast.error("Delivery location is required for shipping orders");
      return;
    }

    createOrderMutation.mutate({
      orderType,
      pickupLocation: formData.pickupLocation,
      deliveryLocation: formData.deliveryLocation || "",
      packageWeight: formData.packageWeight,
      packageDimensions: formData.packageDimensions,
      description: formData.description,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-cyan-50 to-blue-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-cyan-50 to-blue-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to access the Customer Portal</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/" className="btn-bubble-primary w-full block text-center">
              Go Home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-100 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Customer Portal</h1>
            <p className="text-foreground/70">Welcome, {user?.name}</p>
          </div>
          <Link href="/" className="text-accent hover:underline">
            ← Back Home
          </Link>
        </div>

        {/* Add Order Button - Only visible here */}
        <div className="mb-8">
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <button className="btn-bubble-primary text-lg px-8 py-4 flex items-center gap-2">
                <Plus size={24} />
                Add New Order
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>Choose your service type and fill in the details</DialogDescription>
              </DialogHeader>

              {!orderType ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setOrderType("ship")}
                    className="p-6 border-2 border-accent rounded-2xl hover:bg-accent/10 transition-all"
                  >
                    <Package className="h-12 w-12 text-accent mx-auto mb-2" />
                    <h3 className="font-bold text-lg">Ship Package</h3>
                    <p className="text-sm text-foreground/70">Send packages to any location</p>
                  </button>
                  <button
                    onClick={() => setOrderType("warehouse")}
                    className="p-6 border-2 border-accent rounded-2xl hover:bg-accent/10 transition-all"
                  >
                    <Warehouse className="h-12 w-12 text-accent mx-auto mb-2" />
                    <h3 className="font-bold text-lg">Store in Warehouse</h3>
                    <p className="text-sm text-foreground/70">Secure warehouse storage</p>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setOrderType(null)}
                    className="text-accent hover:underline text-sm"
                  >
                    ← Change Service Type
                  </button>

                  <div>
                    <label className="block text-sm font-medium mb-2">Pickup Location *</label>
                    <Input
                      placeholder="Enter pickup address"
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    />
                  </div>

                  {orderType === "ship" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Delivery Location *</label>
                      <Input
                        placeholder="Enter delivery address"
                        value={formData.deliveryLocation}
                        onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Package Weight *</label>
                      <Input
                        placeholder="e.g., 5 kg"
                        value={formData.packageWeight}
                        onChange={(e) => setFormData({ ...formData, packageWeight: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Dimensions *</label>
                      <Input
                        placeholder="e.g., 30x20x10 cm"
                        value={formData.packageDimensions}
                        onChange={(e) => setFormData({ ...formData, packageDimensions: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      placeholder="Describe your package contents"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={handleCreateOrder}
                    disabled={createOrderMutation.isPending}
                    className="btn-bubble-primary w-full"
                  >
                    {createOrderMutation.isPending ? "Creating..." : "Create Order"}
                  </button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Track Order Button */}
        <div className="mb-8">
          <Dialog open={trackingOpen} onOpenChange={setTrackingOpen}>
            <DialogTrigger asChild>
              <button className="btn-bubble-secondary text-lg px-8 py-4 flex items-center gap-2">
                <Eye size={24} />
                Track Order
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Track Your Order</DialogTitle>
                <DialogDescription>Enter your tracking ID to view order status</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter tracking ID (e.g., LTP...)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
                {trackedOrder && (
                  <Card className="bg-green-50">
                    <CardHeader>
                      <CardTitle>Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Status:</span>
                        <span className="font-bold text-accent capitalize">{trackedOrder.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Type:</span>
                        <span className="font-bold capitalize">{trackedOrder.orderType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Pickup:</span>
                        <span>{trackedOrder.pickupLocation}</span>
                      </div>
                      {trackedOrder.deliveryLocation && (
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Delivery:</span>
                          <span>{trackedOrder.deliveryLocation}</span>
                        </div>
                      )}
                      <button className="btn-bubble-outline w-full mt-4 flex items-center justify-center gap-2">
                        <Download size={18} />
                        Download Invoice
                      </button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Orders List */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Orders</h2>
          {orders.length === 0 ? (
            <Card className="card-bubble border-0 bg-white/80">
              <CardContent className="pt-6 text-center">
                <p className="text-foreground/70 mb-4">No orders yet. Create your first order to get started!</p>
                <Dialog open={formOpen} onOpenChange={setFormOpen}>
                  <DialogTrigger asChild>
                    <button className="btn-bubble-primary">
                      <Plus size={18} className="mr-2" />
                      Create Order
                    </button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {orders.map((order: any) => (
                <Card key={order.id} className="card-bubble border-0 bg-white/80">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{order.trackingId}</CardTitle>
                        <CardDescription>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "in_transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Type:</span>
                        <span className="font-medium capitalize">{order.orderType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/70">From:</span>
                        <span>{order.pickupLocation}</span>
                      </div>
                      {order.deliveryLocation && (
                        <div className="flex justify-between">
                          <span className="text-foreground/70">To:</span>
                          <span>{order.deliveryLocation}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Weight:</span>
                        <span>{order.packageWeight}</span>
                      </div>
                    </div>
                    <button className="btn-bubble-outline w-full mt-4 flex items-center justify-center gap-2 text-sm">
                      <Download size={16} />
                      Download Invoice
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
