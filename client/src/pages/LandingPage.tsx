import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import HeroHome from "@/components/custom/hero";
import FeaturesPlanet from "@/components/FeaturesPlanet";
import Cta from "@/components/Cta";

import { useAuth } from "../contexts/AuthContext";
import { SEOHead } from '../components/SEOHeadSSR';
import toast from "react-hot-toast";

export function LandingPage() {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  }, []);

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
  
  const seoConfig = {
    title: 'Snippets Library - Organize, Share & Discover Code Snippets',
    description: 'The ultimate code snippet manager for developers. Organize, share, and discover code snippets with beautiful syntax highlighting, GitHub integration, and powerful search. Perfect for teams and individual developers.',
    keywords: 'code snippets, code manager, developer tools, programming, syntax highlighting, GitHub, code sharing, developer productivity, code organization, snippet library, programming languages, code examples, development tools, open source',
    image: '/icons/web-app-manifest-512x512.png',
    type: 'website' as const,
    author: 'Cojocaru David',
    siteName: 'Snippets Library',
    twitterHandle: '@cojocarudavidme',
    category: 'Developer Tools',
    tags: ['code snippets', 'developer tools', 'programming', 'GitHub', 'syntax highlighting', 'productivity'],
    breadcrumbs: [
      { name: 'Home', url: '/' }
    ]
  };

  return (
    <>
      <SEOHead {...seoConfig} />
      <Header handleLogin={handleLogin} isLoading={isLoading} />
      <main className="grow">
        <HeroHome handleLogin={handleLogin} />
        <FeaturesPlanet />
        <Cta handleLogin={handleLogin} />
      </main>
      <Footer />
    </>
  );
}
