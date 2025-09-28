import {
  ArrowUpRight,
  Building2,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your waste marketplace platform.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-lg border border-gray-300 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 font-semibold text-gray-700 text-sm">
                Total Users
              </p>
              <p className="font-bold text-3xl text-gray-900">2,847</p>
              <p className="mt-1 flex items-center font-medium text-green-700 text-sm">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +12% from last month
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="rounded-lg border border-gray-300 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 font-semibold text-gray-700 text-sm">
                Active Companies
              </p>
              <p className="font-bold text-3xl text-gray-900">156</p>
              <p className="mt-1 flex items-center font-medium text-green-700 text-sm">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +8% from last month
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <Building2 className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="rounded-lg border border-gray-300 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 font-semibold text-gray-700 text-sm">
                Collectors
              </p>
              <p className="font-bold text-3xl text-gray-900">89</p>
              <p className="mt-1 flex items-center font-medium text-green-700 text-sm">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +15% from last month
              </p>
            </div>
            <div className="rounded-lg bg-orange-100 p-3">
              <Package className="h-6 w-6 text-orange-700" />
            </div>
          </div>
        </Card>

        <Card className="rounded-lg border border-gray-300 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 font-semibold text-gray-700 text-sm">
                NGO Partners
              </p>
              <p className="font-bold text-3xl text-gray-900">23</p>
              <p className="mt-1 flex items-center font-medium text-green-700 text-sm">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +5% from last month
              </p>
            </div>
            <div className="rounded-lg bg-pink-100 p-3">
              <TrendingUp className="h-6 w-6 text-pink-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-lg border border-gray-300 bg-white shadow-md transition-shadow hover:shadow-lg">
          <CardHeader className="border-gray-300 border-b p-6">
            <CardTitle className="font-bold text-gray-900 text-lg">
              Recent Platform Activity
            </CardTitle>
            <p className="mt-1 font-medium text-gray-700 text-sm">
              Latest actions across the marketplace.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <Users className="h-4 w-4 text-gray-700" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">
                  New company registered
                </p>
                <p className="text-gray-700 text-sm">EcoTech Solutions</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge className="rounded border-0 bg-gray-100 px-2 py-1 font-medium text-gray-800 text-xs">
                    pending
                  </Badge>
                  <span className="font-medium text-gray-600 text-xs">
                    2 hours ago
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <Building2 className="h-4 w-4 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">
                  Waste collection completed
                </p>
                <p className="text-gray-700 text-sm">GreenCycle Ltd</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge className="rounded border-0 bg-green-100 px-2 py-1 font-medium text-green-800 text-xs">
                    completed
                  </Badge>
                  <span className="font-medium text-gray-600 text-xs">
                    4 hours ago
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                <Package className="h-4 w-4 text-yellow-700" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">
                  Compliance report submitted
                </p>
                <p className="text-gray-700 text-sm">Clean Earth NGO</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge className="rounded border-0 bg-gray-100 px-2 py-1 font-medium text-gray-800 text-xs">
                    review
                  </Badge>
                  <span className="font-medium text-gray-600 text-xs">
                    6 hours ago
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-4 w-4 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">
                  Payment processed
                </p>
                <p className="text-gray-700 text-sm">MetalWorks Inc</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge className="rounded border-0 bg-green-100 px-2 py-1 font-medium text-green-800 text-xs">
                    completed
                  </Badge>
                  <span className="font-medium text-gray-600 text-xs">
                    8 hours ago
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-gray-300 bg-white shadow-md transition-shadow hover:shadow-lg">
          <CardHeader className="border-gray-300 border-b p-6">
            <CardTitle className="font-bold text-gray-900 text-lg">
              System Health
            </CardTitle>
            <p className="mt-1 font-medium text-gray-700 text-sm">
              Platform performance metrics.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">
                API Response Time
              </span>
              <Badge className="rounded border-0 bg-green-100 px-2 py-1 font-medium text-green-800 text-xs">
                98ms avg
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">
                Database Performance
              </span>
              <Badge className="rounded border-0 bg-green-100 px-2 py-1 font-medium text-green-800 text-xs">
                Optimal
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">
                Active Connections
              </span>
              <span className="font-bold text-gray-900 text-sm">1,247</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">
                Error Rate
              </span>
              <Badge className="rounded border-0 bg-green-100 px-2 py-1 font-medium text-green-800 text-xs">
                0.02%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
