/**
 * Created on: Admin page for monitoring topics and cron jobs - 12/08/2025 15:48
 * Purpose: Development dashboard for testing topic generation and monitoring cron jobs
 */

"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, RefreshCw, Calendar, Users, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  // Get current topic
  const { data: currentTopic, refetch: refetchCurrentTopic } = api.topic.getCurrent.useQuery();

  // Get all topics
  const { data: topicsData, refetch: refetchTopics } = api.topic.getMany.useQuery({
    limit: 10,
    includeInactive: true,
  });

  // Manual topic generation mutation
  const generateTopicMutation = api.topic.generateTest.useMutation({
    onSuccess: () => {
      setIsGenerating(false);
      refetchCurrentTopic();
      refetchTopics();
    },
    onError: (error) => {
      console.error("Failed to generate topic:", error);
      setIsGenerating(false);
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
    refetchCurrentTopic();
    refetchTopics();
  };

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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    {formatDistanceToNow(new Date(currentTopic.createdAt), { addSuffix: true })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">Active Since</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(currentTopic.date), { addSuffix: true })}
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
                There's no active topic right now. Generate one to get started.
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

      {/* Recent Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Topics
          </CardTitle>
          <CardDescription>
            History of generated topics (last 10)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topicsData?.topics && topicsData.topics.length > 0 ? (
            <div className="space-y-4">
              {topicsData.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{topic.title}</h4>
                      <Badge variant={topic.isActive ? "default" : "secondary"}>
                        {topic.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {topic.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Created {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {topic._count.posts}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No topics generated yet</p>
            </div>
          )}
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
              <p className="text-sm text-muted-foreground">Every 1 minute (* * * * *)</p>
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
                Within the next minute (if deployed)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
