import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Trophy,
  BookOpen,
  Clock,
  Star,
  Award,
  Flame,
  BarChart3
} from "lucide-react";

interface WeeklyProgress {
  week: string;
  hours: number;
  quizzes: number;
  score: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  date?: string;
  points: number;
}

const ProgressTracker = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  const weeklyData: WeeklyProgress[] = [
    { week: 'Week 1', hours: 12, quizzes: 8, score: 85 },
    { week: 'Week 2', hours: 15, quizzes: 12, score: 78 },
    { week: 'Week 3', hours: 18, quizzes: 15, score: 92 },
    { week: 'Week 4', hours: 22, quizzes: 18, score: 87 },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first quiz',
      icon: <Trophy className="h-6 w-6 text-secondary" />,
      unlocked: true,
      date: '2 weeks ago',
      points: 10
    },
    {
      id: '2',
      title: 'Week Warrior', 
      description: '7-day study streak',
      icon: <Flame className="h-6 w-6 text-destructive" />,
      unlocked: true,
      date: '1 week ago',
      points: 25
    },
    {
      id: '3',
      title: 'Quiz Master',
      description: 'Score 90% or higher on 5 quizzes',
      icon: <Star className="h-6 w-6 text-primary" />,
      unlocked: true,
      date: '3 days ago',
      points: 50
    },
    {
      id: '4',
      title: 'Study Marathon',
      description: 'Study for 50+ hours total',
      icon: <Award className="h-6 w-6 text-accent" />,
      unlocked: false,
      points: 100
    }
  ];

  const subjectProgress = [
    { name: 'Mathematics', completed: 24, total: 30, percentage: 80, trend: '+12%' },
    { name: 'Physics', completed: 18, total: 25, percentage: 72, trend: '+8%' },
    { name: 'Chemistry', completed: 21, total: 28, percentage: 75, trend: '+15%' },
    { name: 'Biology', completed: 15, total: 22, percentage: 68, trend: '+5%' }
  ];

  const totalAchievementPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Progress Tracker
        </h2>
        <div className="flex gap-2">
          {(['week', 'month', 'all'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="capitalize"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">By Subject</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Weekly Progress Chart */}
          <Card className="shadow-card-custom">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((week, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center p-4 rounded-lg bg-muted/30">
                    <div className="font-medium">{week.week}</div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{week.hours}h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{week.quizzes} quizzes</span>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={week.score >= 85 ? "secondary" : week.score >= 75 ? "default" : "destructive"}
                      >
                        {week.score}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Goals */}
          <Card className="shadow-card-custom">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Study Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Weekly Study Hours</span>
                  <span className="text-sm text-muted-foreground">22/25 hours</span>
                </div>
                <Progress value={88} className="h-3" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Monthly Quiz Target</span>
                  <span className="text-sm text-muted-foreground">53/60 quizzes</span>
                </div>
                <Progress value={88.3} className="h-3" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Average Score Goal</span>
                  <span className="text-sm text-muted-foreground">87/85%</span>
                </div>
                <Progress value={100} className="h-3 bg-secondary/20">
                  <div className="h-full bg-gradient-success rounded-full transition-all" style={{ width: '100%' }} />
                </Progress>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <Card className="shadow-card-custom">
            <CardHeader>
              <CardTitle>Subject Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {subjectProgress.map((subject, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span className="font-medium">{subject.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{subject.completed}/{subject.total}</Badge>
                      <Badge variant="secondary" className="text-xs">
                        {subject.trend}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress value={subject.percentage} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{subject.percentage}% complete</span>
                      <span>{subject.total - subject.completed} topics remaining</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`shadow-card-custom transition-smooth ${
                  achievement.unlocked 
                    ? 'bg-gradient-card border-secondary/20' 
                    : 'bg-muted/30 opacity-75'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      achievement.unlocked 
                        ? 'bg-secondary/20' 
                        : 'bg-muted-foreground/20'
                    }`}>
                      {achievement.unlocked ? achievement.icon : (
                        <Award className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <Badge variant={achievement.unlocked ? "secondary" : "outline"}>
                          {achievement.points} pts
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      {achievement.unlocked && achievement.date && (
                        <div className="flex items-center gap-1 text-xs text-secondary">
                          <Calendar className="h-3 w-3" />
                          Unlocked {achievement.date}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-card-custom bg-gradient-learning text-primary-foreground">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Total Achievement Points</h3>
              <div className="text-3xl font-bold mb-2">{totalAchievementPoints}</div>
              <p className="text-primary-foreground/90">
                Keep studying to unlock more achievements!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressTracker;