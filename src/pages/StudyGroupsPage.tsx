import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Brain, Users, MessageCircle, Calendar, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  maxMembers: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  nextSession: string;
  description: string;
}

const StudyGroupsPage = () => {
  const studyGroups: StudyGroup[] = [
    {
      id: '1',
      name: 'Calculus Masters',
      subject: 'Mathematics',
      members: 8,
      maxMembers: 12,
      level: 'Advanced',
      nextSession: 'Today 7:00 PM',
      description: 'Advanced calculus problem-solving and exam preparation'
    },
    {
      id: '2',
      name: 'Physics Fundamentals',
      subject: 'Physics',
      members: 15,
      maxMembers: 20,
      level: 'Beginner',
      nextSession: 'Tomorrow 3:00 PM',
      description: 'Basic physics concepts and laboratory discussions'
    },
    {
      id: '3',
      name: 'Chemistry Lab Partners',
      subject: 'Chemistry',
      members: 6,
      maxMembers: 10,
      level: 'Intermediate',
      nextSession: 'Friday 5:30 PM',
      description: 'Organic chemistry reactions and lab report assistance'
    },
    {
      id: '4',
      name: 'Biology Study Circle',
      subject: 'Biology',
      members: 12,
      maxMembers: 15,
      level: 'Intermediate',
      nextSession: 'Monday 6:00 PM',
      description: 'Cell biology, genetics, and evolution discussions'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-learning flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-learning bg-clip-text text-transparent">
                  Study Groups
                </h1>
              </div>
            </div>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </div>
      </header>

      {/* Study Groups Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Join Study Groups</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow students, share knowledge, and achieve academic success together through AI-guided study sessions.
            </p>
          </div>

          {/* Study Groups Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {studyGroups.map((group) => (
              <Card key={group.id} className="shadow-card-custom hover:shadow-learning transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{group.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{group.subject}</Badge>
                        <Badge variant={
                          group.level === 'Beginner' ? 'secondary' :
                          group.level === 'Intermediate' ? 'default' : 'destructive'
                        }>
                          {group.level}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Members</div>
                      <div className="text-lg font-semibold">{group.members}/{group.maxMembers}</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{group.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{group.nextSession}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{group.members} members</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Mock member avatars */}
                    <div className="flex -space-x-2">
                      {Array.from({ length: Math.min(4, group.members) }).map((_, i) => (
                        <Avatar key={i} className="h-8 w-8 border-2 border-background">
                          <AvatarFallback className="text-xs">U{i + 1}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    {group.members > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{group.members - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="default" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Join Group
                    </Button>
                    <Button variant="outline" size="icon">
                      <Brain className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Your Own Group CTA */}
          <Card className="shadow-card-custom bg-gradient-learning text-primary-foreground text-center">
            <CardContent className="p-8">
              <Users className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Don't see your subject?</h3>
              <p className="text-primary-foreground/90 mb-6">
                Create your own study group and invite classmates to join your learning journey.
              </p>
              <Button variant="secondary" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create New Study Group
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyGroupsPage;