import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Send, 
  Lightbulb, 
  BookOpen, 
  Calculator, 
  Atom,
  Microscope,
  Bot
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  subject?: string;
}

interface QuickTopic {
  icon: React.ReactNode;
  label: string;
  subject: string;
  question: string;
}

const AITutor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Study Buddy. I'm here to help you with any subject - from math and physics to biology and chemistry. What would you like to learn about today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickTopics: QuickTopic[] = [
    {
      icon: <Calculator className="h-4 w-4" />,
      label: "Quadratic Equations",
      subject: "Mathematics",
      question: "Can you explain how to solve quadratic equations step by step?"
    },
    {
      icon: <Atom className="h-4 w-4" />,
      label: "Atomic Structure",
      subject: "Physics",
      question: "How does the structure of an atom work and what are its main components?"
    },
    {
      icon: <Microscope className="h-4 w-4" />,
      label: "Cell Division",
      subject: "Biology",
      question: "What's the difference between mitosis and meiosis in cell division?"
    }
  ];

  const handleSendMessage = async (text: string, subject?: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      subject
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(text, subject);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        subject
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question: string, subject?: string): string => {
    // Mock AI responses based on keywords
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('quadratic') || lowerQuestion.includes('equation')) {
      return "Great question about quadratic equations! 📊\n\nA quadratic equation has the form ax² + bx + c = 0. Here's how to solve it:\n\n1. **Factoring Method**: Look for two numbers that multiply to 'ac' and add to 'b'\n2. **Quadratic Formula**: x = (-b ± √(b²-4ac)) / 2a\n3. **Completing the Square**: Rewrite as (x + p)² = q\n\nWould you like me to work through a specific example?";
    }
    
    if (lowerQuestion.includes('atom') || lowerQuestion.includes('structure')) {
      return "Excellent question about atomic structure! ⚛️\n\nAtoms consist of three main particles:\n\n• **Protons** (+) - in the nucleus, determine element identity\n• **Neutrons** (neutral) - in the nucleus, add mass\n• **Electrons** (-) - orbit in shells, determine chemical behavior\n\nThe nucleus is incredibly dense and small, while electrons create the atom's 'size'. Want to explore electron configurations or chemical bonding next?";
    }
    
    if (lowerQuestion.includes('cell') || lowerQuestion.includes('mitosis') || lowerQuestion.includes('meiosis')) {
      return "Great question about cell division! 🧬\n\n**Mitosis** (Body cells):\n• Creates 2 identical diploid cells\n• For growth and repair\n• Maintains chromosome number\n\n**Meiosis** (Sex cells):\n• Creates 4 genetically different haploid gametes\n• For sexual reproduction\n• Reduces chromosome number by half\n\nKey difference: Mitosis maintains, meiosis reduces! Need help with the specific phases?";
    }
    
    // Generic helpful response
    return `I'd be happy to help you with that! 🎓\n\nLet me break this down for you in a clear, step-by-step way. Based on your question about "${question}", here are some key points to consider:\n\n• This topic connects to several important concepts\n• Understanding the fundamentals will help with advanced topics\n• Practice problems are essential for mastery\n\nWould you like me to provide some practice questions or explain any specific part in more detail?`;
  };

  const handleQuickTopic = (topic: QuickTopic) => {
    handleSendMessage(topic.question, topic.subject);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <Card className="flex-1 flex flex-col shadow-card-custom">
        <CardHeader className="bg-gradient-learning text-primary-foreground">
          <CardTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Brain className="h-6 w-6" />
            </div>
            AI Study Tutor
            <Badge variant="secondary" className="ml-auto">
              <Bot className="h-3 w-3 mr-1" />
              Online
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Quick Topics */}
          <div className="p-4 border-b bg-muted/30">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Quick Topics
            </p>
            <div className="flex gap-2 flex-wrap">
              {quickTopics.map((topic, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickTopic(topic)}
                  className="flex items-center gap-2 text-xs"
                >
                  {topic.icon}
                  {topic.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="h-8 w-8 bg-gradient-learning">
                      <AvatarFallback className="text-primary-foreground text-xs">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    {message.subject && (
                      <Badge variant="outline" className="mb-2 text-xs">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {message.subject}
                      </Badge>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 bg-secondary">
                      <AvatarFallback className="text-secondary-foreground text-xs">
                        You
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 bg-gradient-learning">
                    <AvatarFallback className="text-primary-foreground text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t bg-muted/30">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about your studies..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(inputValue);
                  }
                }}
                className="flex-1"
              />
              <Button 
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITutor;