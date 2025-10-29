import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Package, Users, Truck, DollarSign } from "lucide-react";
import { Link } from "wouter";

export default function AdminPortal() {
  const { user, isAuthenticated, loading } = useAuth();

  const orderData = [
    { date: "Mon", orders: 45, delivered: 42, pending: 3 },
    { date: "Tue", orders: 52, delivered: 50, pending: 2 },
    { date: "Wed", orders: 48, delivered: 46, pending: 2 },
    { date: "Thu", orders: 61, delivered: 59, pending: 2 },
    { date: "Fri", orders: 55, delivered: 53, pending: 2 },
    { date: "Sat", orders: 67, delivered: 65, pending: 2 },
    { date: "Sun", orders: 43, delivered: 41, pending: 2 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 4000, profit: 2400 },
    { month: "Feb", revenue: 3000, profit: 1398 },
    { month: "Mar", revenue: 2000, profit: 9800 },
    { month: "Apr", revenue: 2780, profit: 3908 },
    { month: "May", revenue: 1890, profit: 4800 },
    { month: "Jun", revenue: 2390, profit: 3800 },
  ];

  const orderTypeData = [
    { name: "Ship Orders", value: 65 },
    { name: "Warehouse", value: 35 },
  ];

  const COLORS = ["#ABE7B9", "#8FC7D9"];

  const stats = [
    {
      icon: Package,
      label: "Total Orders",
      value: "1,234",
      change: "+12%",
      color: "from-green-100 to-green-200",
    },
    {
      icon: Truck,
      label: "Active Deliveries",
      value: "87",
      change: "+5%",
      color: "from-cyan-100 to-cyan-200",
    },
    {
      icon: Users,
      label: "Total Drivers",
      value: "156",
      change: "+8%",
      color: "from-blue-100 to-blue-200",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: "$45,231",
      change: "+15%",
      color: "from-yellow-100 to-yellow-200",
    },
  ];

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
            <CardDescription>Please sign in to access the Admin Portal</CardDescription>
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
            <h1 className="text-4xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-foreground/70">Welcome, {user?.name}</p>
          </div>
          <Link href="/" className="text-accent hover:underline">
            ← Back Home
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className={`card-bubble border-0 bg-gradient-to-br ${stat.color}`}>
                <CardContent className="pt-6">
                  <Icon className="h-8 w-8 text-accent mb-2" />
                  <p className="text-foreground/70 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-2">{stat.change} from last month</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="bg-white/80">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="card-bubble border-0 bg-white/80">
              <CardHeader>
                <CardTitle>Orders Overview</CardTitle>
                <CardDescription>Daily order statistics for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={orderData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="delivered" fill="#ABE7B9" />
                    <Bar dataKey="pending" fill="#FFB6C1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card className="card-bubble border-0 bg-white/80">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and profit analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8FC7D9" />
                    <Line type="monotone" dataKey="profit" stroke="#ABE7B9" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution">
            <Card className="card-bubble border-0 bg-white/80">
              <CardHeader>
                <CardTitle>Order Type Distribution</CardTitle>
                <CardDescription>Breakdown of ship vs warehouse orders</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Orders */}
        <Card className="card-bubble border-0 bg-white/80 mt-8">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "LTP001", customer: "John Doe", type: "Ship", status: "Delivered", amount: "$45" },
                { id: "LTP002", customer: "Jane Smith", type: "Warehouse", status: "In Transit", amount: "$32" },
                { id: "LTP003", customer: "Bob Wilson", type: "Ship", status: "Pending", amount: "$58" },
                { id: "LTP004", customer: "Alice Brown", type: "Ship", status: "Delivered", amount: "$41" },
                { id: "LTP005", customer: "Charlie Davis", type: "Warehouse", status: "Stored", amount: "$28" },
              ].map((order) => (
                <div key={order.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-cyan-50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-foreground/70">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{order.type}</p>
                    <p className={`text-sm ${
                      order.status === "Delivered"
                        ? "text-green-600"
                        : order.status === "In Transit"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}>
                      {order.status}
                    </p>
                  </div>
                  <p className="font-bold text-accent">{order.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
