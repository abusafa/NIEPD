import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Settings, 
  Users,
  ArrowRight,
  Shield,
  Globe,
  Sparkles
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/logos/niepd-logo-horizontal.svg"
                alt="NIEPD Logo"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <Link href="/admin">
              <Button variant="default" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  NIEPD CMS
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Content Management System for the National Institute for Educational Professional Development
              </p>
              <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
                Manage your educational content, programs, events, and resources with our powerful and intuitive platform designed specifically for educational institutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/admin">
                  <Button size="lg" className="flex items-center gap-2 px-8 py-6 text-lg">
                    <Shield className="h-5 w-5" />
                    Access Admin Panel
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                  <Globe className="h-5 w-5 mr-2" />
                  View Public Site
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Content Management
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to manage your educational content effectively
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>
                    Create and manage news articles, pages, and educational content
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Programs & Courses</CardTitle>
                  <CardDescription>
                    Manage educational programs, courses, and learning resources
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Events Management</CardTitle>
                  <CardDescription>
                    Schedule and manage educational events, workshops, and seminars
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage staff accounts, roles, and permissions securely
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <Settings className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>
                    Configure site settings, navigation, and organizational structure
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-pink-600" />
                  </div>
                  <CardTitle>Media Library</CardTitle>
                  <CardDescription>
                    Upload and manage images, documents, and multimedia content
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Access the admin panel to begin managing your content and educational resources.
              </p>
              <Link href="/admin">
                <Button variant="secondary" size="lg" className="px-8 py-6 text-lg">
                  <Shield className="h-5 w-5 mr-2" />
                  Go to Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image
                src="/images/logos/niepd-logo-horizontal.svg"
                alt="NIEPD Logo"
                width={150}
                height={45}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © {new Date().getFullYear()} National Institute for Educational Professional Development
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Content Management System
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
