import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Code2, LogOut, Settings, ChevronDown, FileText, Eye, EyeOff, Languages, Menu, X, User, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { SnippetCard } from '../components/SnippetCard';
import { CreateSnippetForm } from '../components/CreateSnippetForm';
import { StatsCard } from '../components/StatsCard';
import { useDebounce } from 'use-debounce';
import toast from 'react-hot-toast';
import type { Snippet } from 'shared';
import { useAuthActions } from '../hooks/useAuthActions';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      const data = await api.snippets.getAll();
      setSnippets(data.snippets || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch snippets';
      toast.error(message);
      console.error('Error fetching snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnippet = async (snippetData: {
    title: string;
    description: string;
    code: string;
    language: string;
    isPublic: boolean;
  }) => {
    try {
      await api.snippets.create(snippetData);
      toast.success('Snippet created successfully!');
      setIsCreateDialogOpen(false);
      fetchSnippets();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create snippet';
      toast.error(message);
      console.error('Error creating snippet:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get unique languages for filter
  const uniqueLanguages = Array.from(new Set(snippets.map(s => s.language)));

  // Filter snippets based on search query and filters
  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch = 
      snippet.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      snippet.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      snippet.language.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      snippet.tags?.some(tag => tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));

    const matchesLanguage = selectedLanguage === 'all' || snippet.language === selectedLanguage;
    const matchesVisibility = 
      selectedVisibility === 'all' || 
      (selectedVisibility === 'public' && snippet.isPublic) ||
      (selectedVisibility === 'private' && !snippet.isPublic);

    return matchesSearch && matchesLanguage && matchesVisibility;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Responsive Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <img src="/favicon.svg" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
              <div className="flex flex-col gap-0 space-y-0 ml-2 min-w-0">
                <span className="text-base sm:text-lg font-semibold text-foreground m-0 p-0 truncate">
                  Snippets Library
                </span>
                <p className="text-xs sm:text-sm text-muted-foreground hidden lg:block m-0 p-0 truncate">
                  Store, organize, and share your code snippets with ease
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => navigate('/dashboard')}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Snippet
              </Button>
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden">
                    {user?.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-none">{user?.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {snippets.length} snippet{snippets.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/settings')}
                  className="h-8 w-8 p-0 hover:bg-muted transition-colors"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="h-8 w-8 p-0 transition-transform hover:scale-110"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-card/95 backdrop-blur animate-in slide-in-from-top-2 duration-200">
              <div className="py-4 space-y-3">
                {/* User Profile Mobile */}
                <div className="flex items-center space-x-3 px-2 py-2 rounded-lg mx-2 bg-muted/50">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden">
                      {user?.avatarUrl ? (
                        <img 
                          src={user.avatarUrl} 
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {snippets.length} snippet{snippets.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Home className="h-4 w-4 mr-3" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setIsCreateDialogOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    New Snippet
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate('/settings');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Button>
                </div>

                {/* Logout Button */}
                <div className="pt-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Enhanced Search and Filter Bar */}
        <div className="bg-card rounded-lg border p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search snippets by title, description, language, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            
            {/* Filter and Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Filter Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-10 justify-start">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language-filter" className="text-sm font-medium">
                        Programming Language
                      </Label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger id="language-filter">
                          <SelectValue placeholder="All languages" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Languages</SelectItem>
                          {uniqueLanguages.map(lang => (
                            <SelectItem key={lang} value={lang}>
                              {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="visibility-filter" className="text-sm font-medium">
                        Visibility
                      </Label>
                      <Select value={selectedVisibility} onValueChange={setSelectedVisibility}>
                        <SelectTrigger id="visibility-filter">
                          <SelectValue placeholder="All snippets" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Snippets</SelectItem>
                          <SelectItem value="public">
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-2" />
                              Public Only
                            </div>
                          </SelectItem>
                          <SelectItem value="private">
                            <div className="flex items-center">
                              <EyeOff className="h-3 w-3 mr-2" />
                              Private Only
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedLanguage('all');
                          setSelectedVisibility('all');
                          setSearchQuery('');
                        }}
                      >
                        Clear All
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        {filteredSnippets.length} result{filteredSnippets.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Create Snippet Button */}
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="h-10 lg:hidden">
                    <Plus className="h-4 w-4 mr-2" />
                    New Snippet
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Snippet</DialogTitle>
                    <DialogDescription>
                      Create a new code snippet to save and organize your code.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateSnippetForm onSubmit={handleCreateSnippet} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {(selectedLanguage !== 'all' || selectedVisibility !== 'all' || searchQuery) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  <Search className="h-3 w-3" />
                  {searchQuery}
                </div>
              )}
              {selectedLanguage !== 'all' && (
                <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                  <Languages className="h-3 w-3" />
                  {selectedLanguage}
                </div>
              )}
              {selectedVisibility !== 'all' && (
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                  {selectedVisibility === 'public' ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {selectedVisibility}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Snippets"
            value={snippets.length}
            icon={<FileText className="h-5 w-5" />}
          />
          <StatsCard
            title="Languages"
            value={new Set(snippets.map(s => s.language)).size}
            icon={<Languages className="h-5 w-5" />}
          />
          <StatsCard
            title="Public Snippets"
            value={snippets.filter(s => s.isPublic).length}
            icon={<Eye className="h-5 w-5" />}
          />
          <StatsCard
            title="Private Snippets"
            value={snippets.filter(s => !s.isPublic).length}
            icon={<EyeOff className="h-5 w-5" />}
          />
        </div>

        {/* Create Snippet Dialog for Desktop */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Snippet</DialogTitle>
              <DialogDescription>
                Create a new code snippet to save and organize your code.
              </DialogDescription>
            </DialogHeader>
            <CreateSnippetForm onSubmit={handleCreateSnippet} />
          </DialogContent>
        </Dialog>

        {/* Enhanced Snippets Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading your snippets...</p>
          </div>
        ) : filteredSnippets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Code2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              {searchQuery || selectedLanguage !== 'all' || selectedVisibility !== 'all' 
                ? 'No snippets found' 
                : 'No snippets yet'
              }
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery || selectedLanguage !== 'all' || selectedVisibility !== 'all'
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.' 
                : 'Create your first snippet to get started organizing your code.'
              }
            </p>
            {!searchQuery && selectedLanguage === 'all' && selectedVisibility === 'all' && (
              <Button 
                size="lg" 
                onClick={() => setIsCreateDialogOpen(true)}
                className="px-8"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Snippet
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {searchQuery || selectedLanguage !== 'all' || selectedVisibility !== 'all' 
                  ? `${filteredSnippets.length} snippet${filteredSnippets.length !== 1 ? 's' : ''} found`
                  : `All Snippets (${filteredSnippets.length})`
                }
              </h2>
              <div className="text-sm text-muted-foreground">
                {filteredSnippets.length} of {snippets.length} total
              </div>
            </div>
            
            {/* Snippets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSnippets.map((snippet) => (
                <SnippetCard 
                  key={snippet.id} 
                  snippet={snippet} 
                  onUpdate={fetchSnippets}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
