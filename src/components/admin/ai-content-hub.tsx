/**
 * AI Content Hub Component
 * Comprehensive AI-powered content enhancement interface for admin panel
 */

'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Search, 
  Zap, 
  Target, 
  Globe, 
  FileText, 
  TrendingUp, 
  Lightbulb,
  Download,
  Copy,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContentAnalysis {
  readingTime: number;
  readingLevel: string;
  sentimentScore: number;
  topicRelevance: number;
  keyPhrases: string[];
  suggestedTags: string[];
  languageDetection: string;
  wordCount: number;
  paragraphCount: number;
}

interface SEOAnalysis {
  titleScore: number;
  descriptionScore: number;
  keywordDensity: Record<string, number>;
  suggestedTitle: string[];
  suggestedDescription: string[];
  suggestedKeywords: string[];
  internalLinkOpportunities: string[];
  imageAltTextSuggestions: Record<string, string>;
}

interface PlatformAdaptation {
  platform: string;
  adaptedContent: string;
  adaptedTitle: string;
  hashtags: string[];
  mentions: string[];
}

const AIContentHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analyze');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [aiProvider, setAiProvider] = useState('openai');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platforms = [
    'Twitter/X', 'LinkedIn', 'Facebook', 'Instagram', 'Medium', 'Dev.to',
    'Hashnode', 'Reddit', 'Pinterest', 'TikTok', 'YouTube', 'Telegram'
  ];

  const aiProviders = [
    { value: 'openai', label: 'OpenAI GPT-4' },
    { value: 'anthropic', label: 'Anthropic Claude' },
    { value: 'google', label: 'Google Gemini' },
    { value: 'azure', label: 'Azure OpenAI' }
  ];

  const handleAnalyzeContent = async () => {
    if (!content.trim()) {
      setError('Please enter content to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, provider: aiProvider }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze content');
      }

      const data = await response.json();
      setResults(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSEOAnalysis = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please enter both title and content for SEO analysis');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, provider: aiProvider }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze SEO');
      }

      const data = await response.json();
      setResults(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformAdaptation = async () => {
    if (!content.trim() || !title.trim() || selectedPlatforms.length === 0) {
      setError('Please enter content, title, and select at least one platform');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalContent: content,
          originalTitle: title,
          platforms: selectedPlatforms,
          includeHashtags: true,
          provider: aiProvider,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to adapt content');
      }

      const data = await response.json();
      setResults(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleWritingAssistance = async (type: string) => {
    if (!content.trim()) {
      setError('Please enter content for writing assistance');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          content,
          provider: aiProvider,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get writing assistance');
      }

      const data = await response.json();
      setResults(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.1) return 'text-green-600';
    if (score < -0.1) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Content Hub</h1>
          <p className="text-muted-foreground">
            Enhance your content with AI-powered analysis, optimization, and adaptation
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={aiProvider} onValueChange={setAiProvider}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select AI Provider" />
            </SelectTrigger>
            <SelectContent>
              {aiProviders.map((provider) => (
                <SelectItem key={provider.value} value={provider.value}>
                  {provider.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Input
            </CardTitle>
            <CardDescription>
              Enter your content to analyze and enhance with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your content title..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your content here..."
                className="mt-1 min-h-[200px]"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {content.length} characters, ~{Math.ceil(content.split(' ').length / 200)} min read
            </div>
          </CardContent>
        </Card>

        {/* AI Tools Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="analyze">Analyze</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="adapt">Adapt</TabsTrigger>
                <TabsTrigger value="assist">Assist</TabsTrigger>
              </TabsList>

              <TabsContent value="analyze" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Get comprehensive analysis of your content including readability, sentiment, and key insights.
                </p>
                <Button onClick={handleAnalyzeContent} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  Analyze Content
                </Button>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Optimize your content for search engines with AI-powered SEO analysis and suggestions.
                </p>
                <Button onClick={handleSEOAnalysis} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
                  Analyze SEO
                </Button>
              </TabsContent>

              <TabsContent value="adapt" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Adapt your content for different social media platforms with optimal formatting and hashtags.
                </p>
                <div className="space-y-2">
                  <Label>Select Platforms</Label>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((platform) => (
                      <Badge
                        key={platform}
                        variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedPlatforms(prev =>
                            prev.includes(platform)
                              ? prev.filter(p => p !== platform)
                              : [...prev, platform]
                          );
                        }}
                      >
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button onClick={handlePlatformAdaptation} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
                  Adapt Content
                </Button>
              </TabsContent>

              <TabsContent value="assist" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Get AI-powered writing assistance to improve, expand, or modify your content.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleWritingAssistance('continue')}
                    disabled={loading}
                  >
                    Continue Writing
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleWritingAssistance('rewrite')}
                    disabled={loading}
                  >
                    Rewrite
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleWritingAssistance('summarize')}
                    disabled={loading}
                  >
                    Summarize
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleWritingAssistance('expand')}
                    disabled={loading}
                  >
                    Expand
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              {activeTab === 'analyze' && results.readingTime && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{results.readingTime}</div>
                      <div className="text-sm text-muted-foreground">Minutes to read</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{results.wordCount}</div>
                      <div className="text-sm text-muted-foreground">Words</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getSentimentColor(results.sentimentScore)}`}>
                        {results.sentimentScore > 0 ? 'Positive' : results.sentimentScore < 0 ? 'Negative' : 'Neutral'}
                      </div>
                      <div className="text-sm text-muted-foreground">Sentiment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{results.readingLevel}</div>
                      <div className="text-sm text-muted-foreground">Reading level</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Key Phrases</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.keyPhrases?.map((phrase: string, index: number) => (
                        <Badge key={index} variant="secondary">{phrase}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Suggested Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.suggestedTags?.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && results.titleScore && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Title Score</Label>
                      <div className="flex items-center gap-2">
                        <Progress value={results.titleScore} className="flex-1" />
                        <span className={`font-semibold ${getScoreColor(results.titleScore)}`}>
                          {results.titleScore}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label>Description Score</Label>
                      <div className="flex items-center gap-2">
                        <Progress value={results.descriptionScore} className="flex-1" />
                        <span className={`font-semibold ${getScoreColor(results.descriptionScore)}`}>
                          {results.descriptionScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Suggested Titles</h4>
                    <div className="space-y-2">
                      {results.suggestedTitle?.map((title: string, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{title}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(title)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Suggested Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.suggestedKeywords?.map((keyword: string, index: number) => (
                        <Badge key={index} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'adapt' && Array.isArray(results) && (
                <div className="space-y-4">
                  {results.map((adaptation: PlatformAdaptation, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{adaptation.platform}</h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(adaptation.adaptedContent)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm font-medium mb-1">{adaptation.adaptedTitle}</div>
                      <div className="text-sm text-muted-foreground mb-2">{adaptation.adaptedContent}</div>
                      {adaptation.hashtags?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {adaptation.hashtags.map((hashtag: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              #{hashtag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'assist' && results.suggestions && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">AI Suggestions</span>
                    <Badge variant="secondary">Confidence: {Math.round(results.confidence * 100)}%</Badge>
                  </div>
                  <div className="space-y-3">
                    {results.suggestions.map((suggestion: string, index: number) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-muted rounded">
                        <div className="flex-1">
                          <div className="text-sm">{suggestion}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(suggestion)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {results.reasoning && (
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <h5 className="font-medium text-blue-900 mb-1">AI Reasoning</h5>
                      <p className="text-sm text-blue-800">{results.reasoning}</p>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIContentHub;
