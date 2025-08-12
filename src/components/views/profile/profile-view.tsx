/**
 * Created on: Comprehensive user profile component - 12/08/2025 16:07
 * Purpose: Complete profile view with user info, stats, posts, and achievements
 */

"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Trophy,
  Camera,
  Calendar,
  Heart,
  MessageCircle,
  TrendingUp,
  Award,
  Star,
  Zap,
  Target,
  BarChart3,
  Clock,
  Wallet,
  Edit,
  Settings,
  Crown,
  Medal,
  Flame
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { signOut } from "next-auth/react";
import Image from "next/image";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user profile data
  const { data: profile, isLoading: profileLoading } = api.user.getProfile.useQuery();
  const { data: stats, isLoading: statsLoading } = api.user.getStats.useQuery();
  const { data: activity, isLoading: activityLoading } = api.user.getActivity.useQuery();
  const { data: userPosts, isLoading: postsLoading } = api.post.getUserPosts.useQuery({
    limit: 20,
  });

  if (profileLoading || statsLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Camera className="h-12 w-12 mx-auto text-primary animate-pulse mb-4" />
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !stats) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
          <p className="text-muted-foreground">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  const isLoading = activityLoading || postsLoading;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <CardContent className="relative p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage
                  src={profile.twitterImage?.replace("_normal", "_400x400")}
                  alt={profile.twitterDisplayName || "Profile"}
                />
                <AvatarFallback className="text-2xl">
                  {profile.twitterDisplayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{profile.twitterDisplayName}</h1>
                  {stats.calculatedStats.rank <= 10 && (
                    <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                      <Crown className="h-3 w-3 mr-1" />
                      Top {stats.calculatedStats.rank}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>@{profile.twitterUsername}</span>
                  {profile.isAnonymous && (
                    <Badge variant="secondary">Anonymous</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{profile.totalRewards}</span>
                    <span className="text-muted-foreground">points</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">{profile.reputation.toFixed(1)}</span>
                    <span className="text-muted-foreground">reputation</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Medal className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">#{stats.calculatedStats.rank}</span>
                    <span className="text-muted-foreground">rank</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:ml-auto flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="destructive" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Camera className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <div className="text-2xl font-bold">{profile._count.posts}</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 mx-auto text-red-500 mb-2" />
            <div className="text-2xl font-bold">{profile.stats?.totalLikes ?? 0}</div>
            <div className="text-sm text-muted-foreground">Likes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <div className="text-2xl font-bold">{profile.stats?.totalComments ?? 0}</div>
            <div className="text-sm text-muted-foreground">Comments</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="h-8 w-8 mx-auto text-orange-500 mb-2" />
            <div className="text-2xl font-bold">{profile.stats?.consecutiveDays ?? 0}</div>
            <div className="text-sm text-muted-foreground">Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto text-purple-500 mb-2" />
            <div className="text-2xl font-bold">{stats.calculatedStats.engagementRate}</div>
            <div className="text-sm text-muted-foreground">Engagement</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
            <div className="text-2xl font-bold">{profile.stats?.topThreeFinishes ?? 0}</div>
            <div className="text-sm text-muted-foreground">Top 3s</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isLoading && activity?.recentActivity && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Posts (30 days)</span>
                      <span className="font-medium">{activity.recentActivity.postsLast30Days}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg. upvotes</span>
                      <span className="font-medium">{activity.recentActivity.averageUpvotes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current streak</span>
                      <span className="font-medium">{activity.recentActivity.currentStreak} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Best streak</span>
                      <span className="font-medium">{activity.recentActivity.longestStreak} days</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">User ID</span>
                  <span className="font-mono text-sm">{profile.id.slice(-8)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Twitter ID</span>
                  <span className="font-mono text-sm">{profile.twitterId?.slice(-8)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Anonymous Mode</span>
                  <Badge variant={profile.isAnonymous ? "default" : "secondary"}>
                    {profile.isAnonymous ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Wallets Connected</span>
                  <span className="font-medium">{profile.userWallets.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Latest Posts Preview */}
          {profile.posts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Latest Posts
                </CardTitle>
                <CardDescription>Your most recent photo submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profile.posts.slice(0, 3).map((post) => (
                    <div key={post.id} className="space-y-3">
                      <div className="aspect-square relative overflow-hidden rounded-lg">
                        <Image
                          src={post.imageUrl}
                          alt={post.topic.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium truncate">{post.topic.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {post._count.votes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {post._count.comments}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                All Posts ({profile._count.posts})
              </CardTitle>
              <CardDescription>Your complete photo challenge history</CardDescription>
            </CardHeader>
            <CardContent>
              {userPosts?.posts && userPosts.posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPosts.posts.map((post) => (
                    <div key={post.id} className="space-y-3">
                      <div className="aspect-square relative overflow-hidden rounded-lg">
                        <Image
                          src={post.imageUrl}
                          alt={post.topic.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-white/90">
                            {format(new Date(post.topic.date), 'MMM dd')}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">{post.topic.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.topic.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-red-500">
                            <Heart className="h-3 w-3" />
                            {post._count.votes}
                          </div>
                          <div className="flex items-center gap-1 text-blue-500">
                            <MessageCircle className="h-3 w-3" />
                            {post._count.comments}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                  <p className="text-muted-foreground">Start participating in daily challenges to see your posts here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Engagement</span>
                  <span className="font-medium">{stats.calculatedStats.totalEngagement}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Engagement Rate</span>
                  <span className="font-medium">{stats.calculatedStats.engagementRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Global Rank</span>
                  <span className="font-medium">#{stats.calculatedStats.rank}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Perfect Validations</span>
                  <span className="font-medium">{stats.stats?.perfectValidations ?? 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  Streak Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Streak</span>
                  <span className="font-medium">{profile.stats?.consecutiveDays ?? 0} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Longest Streak</span>
                  <span className="font-medium">{profile.stats?.longestStreak ?? 0} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Post</span>
                  <span className="font-medium">
                    {profile.stats?.lastPostDate
                      ? formatDistanceToNow(new Date(profile.stats.lastPostDate), { addSuffix: true })
                      : "Never"
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements & Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Achievement badges */}
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="font-medium">First Post</div>
                    <div className="text-sm text-muted-foreground">
                      {profile._count.posts > 0 ? "Completed" : "Not achieved"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Flame className="h-8 w-8 text-orange-500" />
                  <div>
                    <div className="font-medium">Streak Master</div>
                    <div className="text-sm text-muted-foreground">
                      {(profile.stats?.longestStreak ?? 0) >= 7 ? "7+ day streak" : `${profile.stats?.longestStreak ?? 0}/7 days`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Star className="h-8 w-8 text-purple-500" />
                  <div>
                    <div className="font-medium">Top Performer</div>
                    <div className="text-sm text-muted-foreground">
                      {(profile.stats?.topThreeFinishes ?? 0) > 0 ? `${profile.stats?.topThreeFinishes} top 3s` : "Not achieved"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Heart className="h-8 w-8 text-red-500" />
                  <div>
                    <div className="font-medium">Community Favorite</div>
                    <div className="text-sm text-muted-foreground">
                      {(profile.stats?.totalLikes ?? 0) >= 100 ? "100+ likes" : `${profile.stats?.totalLikes ?? 0}/100 likes`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Camera className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-medium">Prolific Creator</div>
                    <div className="text-sm text-muted-foreground">
                      {profile._count.posts >= 50 ? "50+ posts" : `${profile._count.posts}/50 posts`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Zap className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="font-medium">AI Validator</div>
                    <div className="text-sm text-muted-foreground">
                      {(profile.stats?.perfectValidations ?? 0) >= 10 ? "10+ perfect validations" : `${profile.stats?.perfectValidations ?? 0}/10 validations`}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
