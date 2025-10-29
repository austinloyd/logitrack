import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { MapPin, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function DriverPortal() {
  const { user, isAuthenticated, loading } = useAuth();
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Mock data for demonstration
  const shipments = [
    {
      id: 1,
      orderId: 1,
      trackingId: "LTP123456789",
      status: "picked_up",
      pickupLocation: "123 Main St, City A",
      deliveryLocation: "456 Oak Ave, City B",
      currentLocation: "Highway 5, Mile 45",
      currentLatitude: "40.7128",
      currentLongitude: "-74.0060",
      packageWeight: "5 kg",
      customerName: "John Doe",
      customerPhone: "+1-555-0123",
    },
    {
      id: 2,
      orderId: 2,
      trackingId: "LTP987654321",
      status: "in_transit",
      pickupLocation: "789 Pine Rd, City C",
      deliveryLocation: "321 Elm St, City D",
      currentLocation: "Downtown District",
      currentLatitude: "40.7580",
      currentLongitude: "-73.9855",
      packageWeight: "3 kg",
      customerName: "Jane Smith",
      customerPhone: "+1-555-0456",
    },
    {
      id: 3,
      orderId: 3,
      trackingId: "LTP555666777",
      status: "assigned",
      pickupLocation: "999 Maple Dr, City E",
      deliveryLocation: "111 Cedar Ln, City F",
      currentLocation: "Distribution Center",
      currentLatitude: "40.7489",
      currentLongitude: "-73.9680",
      packageWeight: "7 kg",
      customerName: "Bob Wilson",
      customerPhone: "+1-555-0789",
    },
  ];

  const updateMutation = trpc.shipments.updateStatus.useMutation({
    onSuccess: () => {
      toast.success(`Shipment ${selectedShipment.trackingId} updated successfully`);
      setUpdateOpen(false);
      setStatus("");
      setLatitude("");
      setLongitude("");
      setSelectedShipment(null);
    },
    onError: () => {
      toast.error("Failed to update shipment");
    },
  });

  const handleUpdateStatus = () => {
    if (!status || !latitude || !longitude || !selectedShipment) {
      toast.error("Please fill in all fields");
      return;
    }
    updateMutation.mutate({
      shipmentId: selectedShipment.id,
      status,
      latitude,
      longitude,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "assigned":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "picked_up":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "in_transit":
        return <MapPin className="h-5 w-5 text-orange-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-yellow-100 text-yellow-800";
      case "picked_up":
        return "bg-blue-100 text-blue-800";
      case "in_transit":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
            <CardDescription>Please sign in to access the Driver Portal</CardDescription>
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
            <h1 className="text-4xl font-bold text-foreground">Driver Portal</h1>
            <p className="text-foreground/70">Welcome, {user?.name}</p>
          </div>
          <Link href="/" className="text-accent hover:underline">
            ← Back Home
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Shipments", value: "3", color: "from-blue-100 to-blue-200" },
            { label: "Completed Today", value: "5", color: "from-green-100 to-green-200" },
            { label: "Total Deliveries", value: "127", color: "from-cyan-100 to-cyan-200" },
            { label: "Rating", value: "4.8★", color: "from-yellow-100 to-yellow-200" },
          ].map((stat, idx) => (
            <Card key={idx} className={`card-bubble border-0 bg-gradient-to-br ${stat.color}`}>
              <CardContent className="pt-6">
                <p className="text-foreground/70 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Shipments List */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Shipments</h2>
          <div className="grid gap-4">
            {shipments.map((shipment) => (
              <Card key={shipment.id} className="card-bubble border-0 bg-white/80">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getStatusIcon(shipment.status)}
                        {shipment.trackingId}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Customer: {shipment.customerName} • {shipment.customerPhone}
                      </CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                      {shipment.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-foreground/70 mb-1">Pickup Location</p>
                      <p className="font-medium">{shipment.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70 mb-1">Delivery Location</p>
                      <p className="font-medium">{shipment.deliveryLocation}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-foreground/70 mb-1">Current Location</p>
                      <p className="font-medium">{shipment.currentLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70 mb-1">Package Weight</p>
                      <p className="font-medium">{shipment.packageWeight}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-foreground/70 mb-1">Latitude</p>
                      <p className="font-medium text-sm">{shipment.currentLatitude}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70 mb-1">Longitude</p>
                      <p className="font-medium text-sm">{shipment.currentLongitude}</p>
                    </div>
                  </div>

                  <Dialog open={updateOpen && selectedShipment?.id === shipment.id} onOpenChange={setUpdateOpen}>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => setSelectedShipment(shipment)}
                        className="btn-bubble-primary w-full"
                      >
                        Update Status & Location
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Shipment Status</DialogTitle>
                        <DialogDescription>
                          Update the status and location for {selectedShipment?.trackingId}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Status</label>
                          <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="assigned">Assigned</SelectItem>
                              <SelectItem value="picked_up">Picked Up</SelectItem>
                              <SelectItem value="in_transit">In Transit</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Latitude</label>
                          <Input
                            placeholder="e.g., 40.7128"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Longitude</label>
                          <Input
                            placeholder="e.g., -74.0060"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                          />
                        </div>

                        <button
                          onClick={handleUpdateStatus}
                          disabled={updateMutation.isPending}
                          className="btn-bubble-primary w-full"
                        >
                          {updateMutation.isPending ? "Updating..." : "Update Shipment"}
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
