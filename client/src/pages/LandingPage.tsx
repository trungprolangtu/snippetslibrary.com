import { useState } from "react";
import {
  Github,
  Code2,
  Zap,
  Shield,
  ArrowRight,
  Star,
  Sparkles,
  Users,
  Search,
  Share2,
  ChevronRight,
  Globe,
  Database,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { CodeBlock } from "@/components/CodeBlock";
import { SEOHead } from '../components/SEOHead';

export function LandingPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login();
    } catch {
      toast.error("Failed to login. Please try again.");
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description:
        "Built with modern technologies for instant loading and smooth interactions. Optimized for performance and developer experience.",
      color: "from-primary to-primary/70",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description:
        "Your snippets are stored securely with GitHub authentication and enterprise-grade encryption. Your code stays private.",
      color: "from-primary to-primary/70",
    },
    {
      icon: <Code2 className="h-8 w-8" />,
      title: "Syntax Highlighting",
      description:
        "Beautiful syntax highlighting for over 100 programming languages and frameworks. Code that's easy to read and share.",
      color: "from-primary to-primary/70",
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Smart Search",
      description:
        "Find your snippets instantly with powerful search and filtering. Search by language, tags, or keywords to quickly locate what you need.",
      color: "from-primary to-primary/70",
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: "Easy Sharing",
      description:
        "Share your code with unique URLs, embed snippets, or export to various formats. Collaborate seamlessly with your team.",
      color: "from-primary to-primary/70",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description:
        "Work together on code snippets with real-time collaboration features. Perfect for teams and open source projects.",
      color: "from-primary to-primary/70",
    },
  ];

  const stats = [
    { number: "v1.0", label: "Latest Version" },
    { number: "100+", label: "Languages" },
    { number: "99.9%", label: "Uptime" },
    { number: "Free", label: "Open Source" },
  ];

  // SEO configuration for landing page
  const seoConfig = {
    title: 'Snippets Library - Organize, Share & Discover Code Snippets',
    description: 'The ultimate code snippet manager for developers. Organize, share, and discover code snippets with beautiful syntax highlighting, GitHub integration, and powerful search. Perfect for teams and individual developers.',
    keywords: 'code snippets, code manager, developer tools, programming, syntax highlighting, GitHub, code sharing, developer productivity, code organization, snippet library, programming languages, code examples, development tools, open source',
    image: `${window.location.origin}/icons/web-app-manifest-512x512.png`,
    type: 'website' as const,
    author: 'Snippets Library Team',
    siteName: 'Snippets Library',
    twitterHandle: '@snippetslibrary',
    category: 'Developer Tools',
    tags: ['code snippets', 'developer tools', 'programming', 'GitHub', 'syntax highlighting', 'productivity'],
    breadcrumbs: [
      { name: 'Home', url: `${window.location.origin}/` }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...seoConfig} />
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="flex justify-between items-center py-8">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Code2 className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Snippets Library
            </span>
          </div>
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="group relative overflow-hidden"
            size="lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            <Github className="h-4 w-4 relative z-10" />
            <span className="relative z-10">
              {isLoading ? "Connecting..." : "Sign in with GitHub"}
            </span>
            <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
          </Button>
        </header>

        {/* Hero Section */}
        <section className="py-20 md:py-32 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Badge */}
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm"
            >
              <Sparkles className="h-4 w-4" />
              New: AI-powered code search is here
            </Badge>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Organize, Secure, and Share
              <br />
              Your Code Snippets
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A beautiful, fast, and secure way to manage your code snippets.
              Built for developers who care about productivity, collaboration,
              and elegant design.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={handleLogin}
                disabled={isLoading}
                className="group relative overflow-hidden px-8 py-6 text-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <Github className="h-5 w-5 relative z-10" />
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight className="h-5 w-5 relative z-10 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group px-8 py-6 text-lg border-2 hover:bg-muted/50"
              >
                <Globe className="h-5 w-5" />
                <span>View Demo</span>
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <span className="text-sm">Built with love for developers</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-muted-foreground rounded-full" />
              <div className="text-sm">Modern, secure, and open source</div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything you need to manage code snippets
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful features designed for modern development workflows and
              seamless team collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4 w-fit group-hover:bg-primary/20 transition-colors">
                    <div className="text-primary group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Code Preview Section */}
        <section className="py-20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Beautiful Code, Beautifully Organized
            </h2>
            <p className="text-xl text-muted-foreground">
              Clean interface with powerful features for developers
            </p>
          </div>

          <div className="max-w-4xl mx-auto p-0">
            <Card className="overflow-hidden border-2 bg-card/50 backdrop-blur-sm py-0">
              <div className="bg-muted/50 px-6 py-4 border-b flex items-center gap-3">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-destructive"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    React Hook Example
                  </span>
                </div>
              </div>
              <CodeBlock
                code={`import { useState, useEffect } from 'react';

export function useLocalStorage(key: string, initialValue: any) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}`}
                language="javascript"
                theme="github-dark"
                className="!bg-transparent !p-0 !m-0 text-sm"
                
              />
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <Card className="relative overflow-hidden border-2 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
            <CardContent className="relative py-16 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Ready to organize your code?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Start organizing your code snippets today. Experience the
                  modern way to manage and share your code with a clean, fast,
                  and secure platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="group relative overflow-hidden px-8 py-6 text-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Github className="h-5 w-5 relative z-10" />
                  <span className="relative z-10">Start Free Today</span>
                  <ArrowRight className="h-5 w-5 relative z-10 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Snippets Library</span>
            </div>
            <p className="text-muted-foreground">
              &copy; 2025 Snippets Library. Built with ❤️ for developers
              worldwide.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
