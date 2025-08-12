/**
 * Updated on: Enhanced admin dashboard with pagination and improved topic management - 12/08/2025 15:57
 * Purpose: Comprehensive admin panel for topic generation, monitoring, and management
 */

"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, RefreshCw, Calendar, Users, Eye, ChevronLeft, ChevronRight, Hash, Timer, Trash2, AlertTriangle, Database, Zap, RotateCcw } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { signOut } from "next-auth/react";

export default function AdminPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [topicsPerPage] = useState(10);

  // Get current topic
  const { data: currentTopic, refetch: refetchCurrentTopic } = api.topic.getCurrent.useQuery();

  // Get paginated topics
  const { data: topicsData, refetch: refetchTopics } = api.topic.getMany.useQuery({
    limit: 50, // Get more topics for pagination
    includeInactive: true,
  });

  // Get all topics for display
  const allTopics = topicsData?.topics ?? [];
  const hasNextPage = !!topicsData?.nextCursor;
  const isFetchingNextPage = false;

  // Manual topic generation mutation
  const generateTopicMutation = api.topic.generateTest.useMutation({
    onSuccess: () => {
      setIsGenerating(false);
      void refetchCurrentTopic();
      void refetchTopics();
    },
    onError: (error) => {
      console.error("Failed to generate topic:", error);
      setIsGenerating(false);
    },
  });

  // Delete user account mutation
  const deleteAccountMutation = api.user.deleteAccount.useMutation({
    onSuccess: async () => {
      console.log("Account deleted successfully");
      // Sign out and redirect
      await signOut({ callbackUrl: "/signin" });
    },
    onError: (error) => {
      console.error("Failed to delete account:", error);
      setIsDeleting(false);
      alert(`Failed to delete account: ${error.message}`);
    },
  });

  const handleGenerateTopic = async () => {
    setIsGenerating(true);
    try {
      await generateTopicMutation.mutateAsync();
    } catch (error) {
      console.error("Error generating topic:", error);
      setIsGenerating(false);
    }
  };

  const handleRefresh = () => {
    void refetchCurrentTopic();
    void refetchTopics();
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "⚠️ DANGER: This will permanently delete your account and ALL related data including:\n\n" +
      "• All your posts and images\n" +
      "• All votes and comments you made\n" +
      "• All votes and comments on your posts\n" +
      "• Your user statistics and achievements\n" +
      "• Your wallet connections\n" +
      "• All reward transactions\n\n" +
      "This action CANNOT be undone!\n\n" +
      "Are you absolutely sure you want to delete your account?"
    );

    if (!confirmed) return;

    const doubleConfirmed = window.confirm(
      "This is your FINAL warning!\n\n" +
      "Clicking OK will PERMANENTLY DELETE your account and all data.\n\n" +
      "Are you 100% sure?"
    );

    if (!doubleConfirmed) return;

    setIsDeleting(true);
    try {
      await deleteAccountMutation.mutateAsync();
    } catch (error) {
      console.error("Error deleting account:", error);
      setIsDeleting(false);
    }
  };

  const handleSeedDatabase = async (action: "seed" | "clear" | "clear-and-seed") => {
    let confirmMessage = "";

    if (action === "seed") {
      confirmMessage = "This will add 30 random users with posts, votes, and comments to the database. Continue?";
    } else if (action === "clear") {
      confirmMessage = "⚠️ WARNING: This will DELETE ALL data from the database except your current user account. This cannot be undone! Continue?";
    } else {
      confirmMessage = "⚠️ WARNING: This will DELETE ALL data and then seed with new test data. This cannot be undone! Continue?";
    }

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    setIsSeeding(true);
    try {
      const response = await fetch("/api/admin/seed-database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const result = (await response.json()) as {
        success: boolean;
        message: string;
        stats?: {
          users: number;
          topics: number;
          posts: number;
          votes: number;
          comments: number;
        };
      };

      if (result.success) {
        alert(`✅ ${result.message}\n\n${result.stats ? `Created:\n• ${result.stats.users} users\n• ${result.stats.topics} topics\n• ${result.stats.posts} posts\n• ${result.stats.votes} votes\n• ${result.stats.comments} comments` : ""}`);
        // Refresh data
        void refetchCurrentTopic();
        void refetchTopics();
      } else {
        alert(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Seeding error:", error);
      alert("❌ Failed to seed database");
    } finally {
      setIsSeeding(false);
    }
  };

  const loadMoreTopics = () => {
    // For now, just refresh to get more topics
    // In the future, this could implement true infinite loading
    void refetchTopics();
  };

  // Get current page topics for display
  const startIndex = currentPage * topicsPerPage;
  const endIndex = startIndex + topicsPerPage;
  const currentTopics = allTopics.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allTopics.length / topicsPerPage);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor topics and test cron functionality
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={handleGenerateTopic}
            disabled={isGenerating || generateTopicMutation.isPending}
          >
            {isGenerating || generateTopicMutation.isPending ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Generate Topic
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isDeleting || deleteAccountMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting || deleteAccountMutation.isPending ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete Test User
          </Button>
        </div>
      </div>

      {/* Current Topic */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Current Active Topic
          </CardTitle>
          <CardDescription>
            The topic currently available for submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentTopic ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{currentTopic.title}</h3>
                  <p className="text-muted-foreground">{currentTopic.description}</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentTopic._count.posts}</div>
                  <div className="text-sm text-muted-foreground">Submissions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentTopic.keywords.length}</div>
                  <div className="text-sm text-muted-foreground">Keywords</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">Created</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(currentTopic.createdAt), 'MMM dd, HH:mm')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">Active Since</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(currentTopic.date), { addSuffix: true })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">Topic ID</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {currentTopic.id.slice(-8)}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Keywords:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentTopic.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Topic</h3>
              <p className="text-muted-foreground mb-4">
                There&apos;s no active topic right now. Generate one to get started.
              </p>
              <Button onClick={handleGenerateTopic} disabled={isGenerating}>
                {isGenerating ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Generate First Topic
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Topics with Pagination */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                All Topics
              </CardTitle>
              <CardDescription>
                Complete history of generated topics ({allTopics.length} total)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {hasNextPage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadMoreTopics}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronRight className="mr-2 h-4 w-4" />
                  )}
                  Load More
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentTopics.length > 0 ? (
            <>
              <div className="space-y-4">
                {currentTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{topic.title}</h4>
                        <Badge variant={topic.isActive ? "default" : "secondary"}>
                          {topic.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Hash className="h-3 w-3" />
                          {topic.id.slice(-6)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {topic.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {topic.keywords.slice(0, 5).map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {topic.keywords.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{topic.keywords.length - 5} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          Created {format(new Date(topic.createdAt), 'MMM dd, yyyy HH:mm')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(topic.date), { addSuffix: true })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm ml-4">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{topic._count.posts}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">posts</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, allTopics.length)} of {allTopics.length} topics
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = currentPage < 3 ? i : currentPage - 2 + i;
                        if (pageNum >= totalPages) return null;
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum + 1}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage >= totalPages - 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No topics generated yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Database Seeding Tools */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Database className="h-5 w-5" />
            Database Seeding Tools
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Generate realistic test data for development and testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/30 dark:bg-blue-950/10">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Seed Database</h4>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                  Add 30 random users with posts, votes, comments, and realistic engagement data.
                </p>
                <Button
                  onClick={() => handleSeedDatabase("seed")}
                  disabled={isSeeding}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSeeding ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Database className="mr-2 h-4 w-4" />
                  )}
                  Seed Data
                </Button>
              </div>

              <div className="p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50/30 dark:bg-orange-950/10">
                <div className="flex items-center gap-2 mb-3">
                  <Trash2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <h4 className="font-medium text-orange-800 dark:text-orange-200">Clear Database</h4>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
                  Remove all data except your account. Useful for clean testing environment.
                </p>
                <Button
                  onClick={() => handleSeedDatabase("clear")}
                  disabled={isSeeding}
                  variant="outline"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  {isSeeding ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Clear Data
                </Button>
              </div>

              <div className="p-4 border border-green-200 dark:border-green-800 rounded-lg bg-green-50/30 dark:bg-green-950/10">
                <div className="flex items-center gap-2 mb-3">
                  <RotateCcw className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-medium text-green-800 dark:text-green-200">Fresh Start</h4>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                  Clear everything and seed with fresh data. Complete reset for testing.
                </p>
                <Button
                  onClick={() => handleSeedDatabase("clear-and-seed")}
                  disabled={isSeeding}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isSeeding ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCcw className="mr-2 h-4 w-4" />
                  )}
                  Reset & Seed
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">What gets created:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-700 dark:text-blue-300">
                <div>• 30 realistic users with Twitter-style profiles</div>
                <div>• 10 diverse photo challenge topics</div>
                <div>• 180+ posts with AI descriptions</div>
                <div>• Thousands of votes and engagement</div>
                <div>• Realistic comments and community validation</div>
                <div>• User statistics and achievement data</div>
                <div>• Reward transactions and point history</div>
                <div>• Post views and analytics data</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Tools */}
      <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
            <AlertTriangle className="h-5 w-5" />
            User Account Testing
          </CardTitle>
          <CardDescription className="text-orange-700 dark:text-orange-300">
            Dangerous operations for testing purposes only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50/50 dark:bg-red-950/20">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Delete Test User Account</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  Permanently deletes the currently logged-in user and ALL related data from the database, then signs out the session.
                </p>
                <div className="text-xs text-red-600 dark:text-red-400 space-y-1">
                  <p>• All posts and uploaded images will be removed</p>
                  <p>• All votes and comments made by the user will be deleted</p>
                  <p>• All votes and comments on user&apos;s posts will be deleted</p>
                  <p>• User statistics, achievements, and wallet connections will be removed</p>
                  <p>• All reward transactions will be deleted</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Use Case:</strong> Perfect for testing the complete user flow - sign up, create posts, then clean slate for retesting.
                The delete operation includes double confirmation dialogs to prevent accidental deletion.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cron Information */}
      <Card>
        <CardHeader>
          <CardTitle>Cron Job Information</CardTitle>
          <CardDescription>
            Current cron job configuration and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Schedule</h4>
              <p className="text-sm text-muted-foreground">Every 2 days at midnight (0 0 */2 * *)</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Endpoint</h4>
              <p className="text-sm text-muted-foreground">/api/cron/generate-topic</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Environment</h4>
              <p className="text-sm text-muted-foreground">
                {process.env.NODE_ENV === "development" ? "Development (Manual Testing)" : "Production (Automated)"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Next Topic</h4>
              <p className="text-sm text-muted-foreground">
                Every 2 days (if deployed to production)
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Cron Schedule Explanation
            </h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><code className="bg-background px-1 rounded">0 0 */2 * *</code> - At 00:00 (midnight) every 2 days</p>
              <p>Format: <code className="bg-background px-1 rounded">minute hour day month weekday</code></p>
              <p>You can modify this schedule in <code className="bg-background px-1 rounded">vercel.json</code></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
