import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Palette,
  Monitor,
  Sun,
  Moon,
  Eye,
  Search,
  Settings,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  X,
  Shield,
  Globe,
  Mail,
  Bell,
  Link2,
  Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { CodeBlock } from "../components/CodeBlock";
import { useAuth } from "../contexts/AuthContext";
import { useUserSettings } from "../hooks/useUserSettings";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import { SEOHead } from "../components/SEOHeadSSR";

// Available Shiki themes
const SHIKI_THEMES = [
  { value: "auto", label: "Auto (matches UI theme)" },
  { value: "dark-plus", label: "Dark+" },
  { value: "light-plus", label: "Light+" },
  { value: "github-dark", label: "GitHub Dark" },
  { value: "github-light", label: "GitHub Light" },
  { value: "github-dark-dimmed", label: "GitHub Dark Dimmed" },
  { value: "monokai", label: "Monokai" },
  { value: "dracula", label: "Dracula" },
  { value: "one-dark-pro", label: "One Dark Pro" },
  { value: "one-light", label: "One Light" },
  { value: "nord", label: "Nord" },
  { value: "tokyo-night", label: "Tokyo Night" },
  { value: "material-theme", label: "Material Theme" },
  { value: "catppuccin-mocha", label: "Catppuccin Mocha" },
  { value: "catppuccin-latte", label: "Catppuccin Latte" },
  { value: "rose-pine", label: "Rose Pine" },
  { value: "synthwave-84", label: "Synthwave 84" },
  { value: "poimandres", label: "Poimandres" },
  { value: "night-owl", label: "Night Owl" },
  { value: "solarized-dark", label: "Solarized Dark" },
  { value: "solarized-light", label: "Solarized Light" },
];

const SOCIAL_PLATFORMS = [
  {
    key: "twitter",
    label: "Twitter",
    icon: Twitter,
    placeholder: "https://twitter.com/username",
  },
  {
    key: "github",
    label: "GitHub",
    icon: Github,
    placeholder: "https://github.com/username",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/username",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: Instagram,
    placeholder: "https://instagram.com/username",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: Youtube,
    placeholder: "https://youtube.com/@username",
  },
];

const SAMPLE_CODE = `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example usage
const result = fibonacci(10);
console.log(\`Fibonacci(10) = \${result}\`);

// Modern async/await example
async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}`;

export function EnhancedAccountSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings, updateSettings, getEffectiveCodeTheme } = useUserSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    username: user?.username || "",
    codeTheme: settings.codeTheme,
    uiTheme: settings.uiTheme,
    seoTitle: settings.seoTitle || "",
    seoDescription: settings.seoDescription || "",
    seoKeywords: settings.seoKeywords || "",
    seoImageUrl: settings.seoImageUrl || "",
    socialLinks: settings.socialLinks || {},
    customDomain: settings.customDomain || "",
    isProfilePublic: settings.isProfilePublic ?? true,
    emailNotifications: settings.emailNotifications ?? true,
    enableAnalytics: settings.enableAnalytics ?? true,
  });

  useEffect(() => {
    setFormData({
      username: user?.username || "",
      codeTheme: settings.codeTheme,
      uiTheme: settings.uiTheme,
      seoTitle: settings.seoTitle || "",
      seoDescription: settings.seoDescription || "",
      seoKeywords: settings.seoKeywords || "",
      seoImageUrl: settings.seoImageUrl || "",
      socialLinks: settings.socialLinks || {},
      customDomain: settings.customDomain || "",
      isProfilePublic: settings.isProfilePublic ?? true,
      emailNotifications: settings.emailNotifications ?? true,
      enableAnalytics: settings.enableAnalytics ?? true,
    });
  }, [user, settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update user settings locally
      updateSettings(formData);

      // Update user profile on the server
      await api.user.updateProfile(formData);

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      const message = error instanceof Error ? error.message : "Failed to save settings";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setIsLoading(true);
    setFormData((prev) => ({ ...prev, codeTheme: newTheme }));

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const handleSocialLinkChange = (platform: string, url: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: url,
      },
    }));
  };

  const handleRemoveSocialLink = (platform: string) => {
    setFormData((prev) => {
      const newLinks = { ...prev.socialLinks };
      delete newLinks[platform];
      return {
        ...prev,
        socialLinks: newLinks,
      };
    });
  };

  // SEO Configuration
  const seoConfig = {
    title: `Account Settings - ${user?.username || 'User'}`,
    description: `Manage your Snippets Library account settings. Customize your profile, update preferences, manage social links, and configure privacy settings for your code snippets.`,
    keywords: `account settings, profile settings, user preferences, ${user?.username}, snippets library, code snippets, profile customization, privacy settings`,
    type: 'website' as const,
    author: user?.username || 'Snippets Library User',
    siteName: 'Snippets Library',
    twitterHandle: '@cojocarudavidme',
    category: 'Developer Tools',
    tags: ['account settings', 'profile', 'user preferences', 'privacy', 'customization'],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Account Settings', url: '/account-settings' }
    ]
  };

  // Utility functions for slug generation and validation
  return (
    <>
      <SEOHead {...seoConfig} />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Account Settings</h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    Manage your profile and preferences
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={
                  user?.avatarUrl || `https://github.com/${user?.username}.png`
                }
                alt={user?.username || "User"}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${user?.username || "U"}&background=6366f1&color=ffffff`;
                }}
              />
              <div className="hidden sm:block">
                <Badge variant="secondary" className="text-xs">
                  {user?.username}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            {/* Enhanced Tab Navigation */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <TabsList className="grid w-full grid-cols-4 h-auto p-1 md:w-auto md:grid-cols-4 bg-muted/50">
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-background"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-background"
                >
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Appearance</span>
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-background"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Privacy</span>
                </TabsTrigger>
                <TabsTrigger
                  value="seo"
                  className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-background"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">SEO</span>
                </TabsTrigger>
              </TabsList>

              {/* Save Button - Mobile Fixed */}
              <div className="md:hidden">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Enhanced Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              {/* Profile Overview Card */}
              <Card className="overflow-hidden pt-0">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
                  <CardHeader className="p-0">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          user?.avatarUrl ||
                          `https://github.com/${user?.username}.png`
                        }
                        alt={user?.username || "User"}
                        className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${user?.username || "U"}&background=6366f1&color=ffffff&size=64`;
                        }}
                      />
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <User className="h-5 w-5" />
                          Profile Information
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Update your account details and public profile
                          information
                        </CardDescription>
                      </div>
                      <Badge
                        variant="secondary"
                        className="hidden sm:inline-flex"
                      >
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        placeholder="Enter your username"
                        className="h-10"
                        readOnly
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          value={user?.email || ""}
                          disabled
                          placeholder="Email from GitHub"
                          className="h-10 pr-10"
                        />
                        <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-border" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Label
                        htmlFor="custom-domain"
                        className="text-sm font-medium"
                      >
                        Custom Domain
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        Coming Soon
                      </Badge>
                    </div>
                    <Input
                      id="custom-domain"
                      value={formData.customDomain}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customDomain: e.target.value,
                        }))
                      }
                      placeholder="snippets.yourdomain.com"
                      className="h-10"
                      disabled
                    />
                    <p className="text-sm text-muted-foreground">
                      Connect your custom domain to showcase your snippets
                      professionally.
                    </p>
                  </div>

                  <div className="h-px w-full bg-border" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-sm font-medium">
                        Social Media Links
                      </Label>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {SOCIAL_PLATFORMS.map(
                        ({ key, icon: Icon, placeholder, label }) => (
                          <div
                            key={key}
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <Label className="text-sm font-medium">
                                {label}
                              </Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  value={formData.socialLinks[key] || ""}
                                  onChange={(e) =>
                                    handleSocialLinkChange(key, e.target.value)
                                  }
                                  placeholder={placeholder}
                                  className="h-8"
                                />
                                {formData.socialLinks[key] && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveSocialLink(key)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="overflow-hidden pt-0">
                <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 p-6">
                  <CardHeader className="p-0">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Palette className="h-5 w-5" />
                      Theme Preferences
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Customize your code editor theme and UI appearance
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="p-6 space-y-8">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                          <Label
                            htmlFor="ui-theme"
                            className="text-sm font-medium"
                          >
                            UI Theme
                          </Label>
                        </div>
                        <Select
                          value={formData.uiTheme}
                          onValueChange={(value: "light" | "dark" | "system") =>
                            setFormData((prev) => ({ ...prev, uiTheme: value }))
                          }
                        >
                          <SelectTrigger id="ui-theme" className="h-16 w-full">
                            <SelectValue placeholder="Select UI theme" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            <SelectItem value="system">
                              <div className="flex items-center gap-3">
                                <Monitor className="h-4 w-4" />
                                <div className="font-medium">System</div>
                              </div>
                            </SelectItem>
                            <SelectItem value="light">
                              <div className="flex items-center gap-3">
                                <Sun className="h-4 w-4" />
                                <div className="font-medium">Light</div>
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center gap-3">
                                <Moon className="h-4 w-4" />
                                <div className="font-medium">Dark</div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-muted-foreground" />
                          <Label
                            htmlFor="code-theme"
                            className="text-sm font-medium"
                          >
                            Code Editor Theme
                          </Label>
                        </div>
                        <Select
                          value={formData.codeTheme}
                          onValueChange={handleThemeChange}
                        >
                          <SelectTrigger id="code-theme" className="h-12">
                            <SelectValue placeholder="Select code theme" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {SHIKI_THEMES.map((theme) => (
                              <SelectItem key={theme.value} value={theme.value}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{theme.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-sm font-medium">
                          Live Preview
                        </Label>
                      </div>
                      <Card className="overflow-hidden py-0">
                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-3 border-b">
                          <div className="text-sm font-medium text-muted-foreground">
                            theme-preview.ts
                          </div>
                        </div>
                        <div className="relative py-0">
                          {isLoading ? (
                            <div className="bg-muted p-8 flex items-center justify-center min-h-[300px]">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                <span>Loading theme...</span>
                              </div>
                            </div>
                          ) : (
                            <CodeBlock
                              code={SAMPLE_CODE}
                              language="typescript"
                              theme={
                                formData.codeTheme === "auto"
                                  ? getEffectiveCodeTheme()
                                  : formData.codeTheme
                              }
                              maxHeight="400px"
                              rounded={false}
                              className="border-0"
                            />
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card className="overflow-hidden pt-0">
                <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 p-6">
                  <CardHeader className="p-0">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Shield className="h-5 w-5" />
                      Privacy & Security
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Control your privacy settings and data preferences
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                          <Globe className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor="profile-public"
                            className="text-sm font-medium"
                          >
                            Public Profile
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Make your profile visible to everyone on the
                            internet
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="profile-public"
                        checked={formData.isProfilePublic}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            isProfilePublic: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                          <Bell className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor="email-notifications"
                            className="text-sm font-medium"
                          >
                            Email Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications for important updates
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={formData.emailNotifications}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            emailNotifications: checked,
                          }))
                        }
                      />
                    </div>

                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertDescription>
                        Your privacy is important to us. We only collect data
                        necessary to provide and improve our service.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced SEO Tab */}
            <TabsContent value="seo" className="space-y-6">
              <Card className="overflow-hidden pt-0">
                <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 p-6">
                  <CardHeader className="p-0">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Search className="h-5 w-5" />
                      SEO Optimization
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Optimize your public profile and snippets for search
                      engines
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="seo-title"
                          className="text-sm font-medium"
                        >
                          SEO Title
                        </Label>
                        <Input
                          id="seo-title"
                          value={formData.seoTitle}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              seoTitle: e.target.value,
                            }))
                          }
                          placeholder="Your Name - Code Snippets & Programming Portfolio"
                          maxLength={60}
                          className="h-10"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Appears in search results</span>
                          <span
                            className={
                              formData.seoTitle.length > 50
                                ? "text-orange-500"
                                : ""
                            }
                          >
                            {formData.seoTitle.length}/60
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="seo-description"
                          className="text-sm font-medium"
                        >
                          SEO Description
                        </Label>
                        <textarea
                          id="seo-description"
                          value={formData.seoDescription}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              seoDescription: e.target.value,
                            }))
                          }
                          placeholder="Discover my collection of code snippets, programming solutions, and technical insights."
                          maxLength={160}
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Appears in search results</span>
                          <span
                            className={
                              formData.seoDescription.length > 140
                                ? "text-orange-500"
                                : ""
                            }
                          >
                            {formData.seoDescription.length}/160
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="seo-keywords"
                          className="text-sm font-medium"
                        >
                          SEO Keywords
                        </Label>
                        <Input
                          id="seo-keywords"
                          value={formData.seoKeywords}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              seoKeywords: e.target.value,
                            }))
                          }
                          placeholder="programming, code snippets, javascript, typescript, react"
                          className="h-10"
                        />
                        <p className="text-sm text-muted-foreground">
                          Separate with commas. Use relevant programming
                          languages
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="seo-image"
                          className="text-sm font-medium"
                        >
                          SEO Image URL
                        </Label>
                        <Input
                          id="seo-image"
                          value={formData.seoImageUrl}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              seoImageUrl: e.target.value,
                            }))
                          }
                          placeholder="https://example.com/your-profile-image.jpg"
                          className="h-10"
                        />
                        <p className="text-sm text-muted-foreground">
                          1200x630px recommended for social media sharing
                        </p>
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertDescription>
                      SEO settings only apply to public profiles and snippets.
                      Enable public profile in Privacy settings to benefit from
                      SEO optimization.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Enhanced Save Button - Desktop */}
          <div className="hidden md:flex justify-end pt-6">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="min-w-40 h-11"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
