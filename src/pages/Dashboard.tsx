import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Brain, 
  Trophy, 
  MessageCircle, 
  Target, 
  Clock, 
  TrendingUp,
  Zap,
  Users,
  FileText
} from "lucide-react";
import heroImage from "@/assets/hero-studysphere.jpg";

interface StudyStats {
  totalHours: number;
  streakDays: number;
  completedQuizzes: number;
  averageScore: number;
}

const Dashboard = () => {
  const [stats] = useState<StudyStats>({
    totalHours: 127,
    streakDays: 15,
    completedQuizzes: 43,
    averageScore: 87
  });

  const studyProgress = [
    { subject: "Mathematics", progress: 75, color: "bg-gradient-learning" },
    { subject: "Physics", progress: 62, color: "bg-gradient-success" },
    { subject: "Chemistry", progress: 89, color: "bg-primary" },
    { subject: "Biology", progress: 54, color: "bg-accent" }
  ];

  const recentActivities = [
    { type: "quiz", subject: "Mathematics", score: 92, time: "2 hours ago" },
    { type: "study", subject: "Physics", duration: 45, time: "5 hours ago" },
    { type: "achievement", title: "15-day streak!", time: "1 day ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-learning flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-learning bg-clip-text text-transparent">
                StudySphere
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Study Groups
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to="/ai-tutor">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  AI Tutor
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-hero overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Your AI Study Companion
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Personalized learning paths, instant feedback, and 24/7 AI tutoring 
                to accelerate your academic success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" variant="secondary" className="shadow-success">
                  <Zap className="h-5 w-5 mr-2" />
                  Start Learning
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  <FileText className="h-5 w-5 mr-2" />
                  Upload Notes
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="StudySphere AI Learning Platform" 
                className="rounded-2xl shadow-learning w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center shadow-card-custom">
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stats.totalHours}h</div>
                <p className="text-sm text-muted-foreground">Study Time</p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-card-custom">
              <CardContent className="pt-6">
                <Target className="h-8 w-8 mx-auto mb-3 text-secondary" />
                <div className="text-2xl font-bold text-foreground">{stats.streakDays}</div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card-custom">
              <CardContent className="pt-6">
                <BookOpen className="h-8 w-8 mx-auto mb-3 text-accent" />
                <div className="text-2xl font-bold text-foreground">{stats.completedQuizzes}</div>
                <p className="text-sm text-muted-foreground">Quizzes Done</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card-custom">
              <CardContent className="pt-6">
                <Trophy className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stats.averageScore}%</div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Study Progress */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-card-custom">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Study Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {studyProgress.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject.subject}</span>
                        <Badge variant="secondary">{subject.progress}%</Badge>
                      </div>
                      <Progress value={subject.progress} className="h-3" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-card-custom">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex-col" asChild>
                      <Link to="/quiz">
                        <Brain className="h-6 w-6 mb-2" />
                        AI Quiz
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" asChild>
                      <Link to="/ai-tutor">
                        <MessageCircle className="h-6 w-6 mb-2" />
                        Ask Tutor
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <FileText className="h-6 w-6 mb-2" />
                      Upload Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <div className="space-y-6">
              <Card className="shadow-card-custom">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      {activity.type === 'quiz' && <Brain className="h-5 w-5 text-primary" />}
                      {activity.type === 'study' && <BookOpen className="h-5 w-5 text-accent" />}
                      {activity.type === 'achievement' && <Trophy className="h-5 w-5 text-secondary" />}
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {activity.type === 'quiz' && `${activity.subject} Quiz`}
                          {activity.type === 'study' && `Studied ${activity.subject}`}
                          {activity.type === 'achievement' && activity.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.type === 'quiz' && `Score: ${activity.score}%`}
                          {activity.type === 'study' && `${activity.duration} minutes`}
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-card-custom bg-gradient-success text-secondary-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Achievement Unlocked!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">15-Day Study Streak</p>
                  <Button variant="outline" size="sm" className="border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10" asChild>
                    <Link to="/progress">
                      View All Achievements
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;