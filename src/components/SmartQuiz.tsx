import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Trophy, 
  Clock,
  Target,
  Lightbulb
} from "lucide-react";

interface Question {
  id: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

interface QuizResult {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

const SmartQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);

  const questions: Question[] = [
    {
      id: '1',
      subject: 'Mathematics',
      difficulty: 'Medium',
      question: 'What is the derivative of f(x) = 3x² + 2x - 5?',
      options: ['6x + 2', '6x - 2', '3x + 2', '6x² + 2x'],
      correctAnswer: 0,
      explanation: 'Using the power rule: d/dx(3x²) = 6x, d/dx(2x) = 2, d/dx(-5) = 0. Therefore, f\'(x) = 6x + 2.',
      points: 15
    },
    {
      id: '2',
      subject: 'Physics',
      difficulty: 'Hard',
      question: 'In which scenario would an object have the greatest gravitational potential energy?',
      options: [
        'A 2kg ball at 10m height',
        'A 1kg ball at 20m height',
        'A 3kg ball at 8m height',
        'A 1.5kg ball at 15m height'
      ],
      correctAnswer: 1,
      explanation: 'Gravitational PE = mgh. Calculate: A) 2×10×9.8 = 196J, B) 1×20×9.8 = 196J, C) 3×8×9.8 = 235.2J, D) 1.5×15×9.8 = 220.5J. Option C has the highest energy.',
      points: 20
    },
    {
      id: '3',
      subject: 'Chemistry',
      difficulty: 'Easy',
      question: 'How many electrons can the second electron shell hold at maximum?',
      options: ['2 electrons', '6 electrons', '8 electrons', '18 electrons'],
      correctAnswer: 2,
      explanation: 'The second shell (n=2) can hold a maximum of 2n² = 2(2)² = 8 electrons, distributed as 2 in the s subshell and 6 in the p subshell.',
      points: 10
    }
  ];

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const earnedPoints = quizResults.reduce((sum, result) => 
    sum + (result.isCorrect ? questions.find(q => q.id === result.questionId)?.points || 0 : 0), 0
  );

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const result: QuizResult = {
      questionId: questions[currentQuestion].id,
      selectedAnswer,
      isCorrect: selectedAnswer === questions[currentQuestion].correctAnswer,
      timeSpent: 30 - timeLeft
    };

    const newResults = [...quizResults, result];
    setQuizResults(newResults);
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
      } else {
        setIsQuizComplete(true);
      }
    }, 2000);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    // Start timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (!showResult && selectedAnswer === null) {
            // Auto-select a wrong answer if time runs out
            handleAnswerSelect(-1);
            handleNextQuestion();
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizResults([]);
    setShowResult(false);
    setIsQuizComplete(false);
    setTimeLeft(30);
    setQuizStarted(false);
  };

  const getScoreColor = () => {
    const percentage = (earnedPoints / totalPoints) * 100;
    if (percentage >= 80) return 'text-secondary';
    if (percentage >= 60) return 'text-primary';
    return 'text-destructive';
  };

  if (!quizStarted) {
    return (
      <Card className="max-w-2xl mx-auto shadow-card-custom">
        <CardHeader className="text-center bg-gradient-learning text-primary-foreground">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <Brain className="h-8 w-8" />
            Smart Quiz Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{questions.length}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{totalPoints}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">30s</div>
                <div className="text-sm text-muted-foreground">Per Question</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Test your knowledge across Mathematics, Physics, and Chemistry. 
                Each question is timed and adapted to your learning level.
              </p>
              
              <div className="flex gap-2 justify-center flex-wrap">
                {questions.map((q, i) => (
                  <Badge key={i} variant="outline">
                    {q.subject} - {q.difficulty}
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={startQuiz} size="xl" variant="hero" className="px-12">
              <Target className="h-5 w-5 mr-2" />
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isQuizComplete) {
    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    
    return (
      <Card className="max-w-2xl mx-auto shadow-card-custom">
        <CardHeader className="text-center bg-gradient-success text-secondary-foreground">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <Trophy className="h-8 w-8" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className={`text-6xl font-bold ${getScoreColor()}`}>
              {percentage}%
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{earnedPoints}/{totalPoints}</div>
                <div className="text-sm text-muted-foreground">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {quizResults.filter(r => r.isCorrect).length}/{questions.length}
                </div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
            </div>

            <Progress value={percentage} className="h-4" />

            <div className="space-y-3">
              {percentage >= 80 && (
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <p className="font-medium text-secondary flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Excellent! You've mastered these concepts!
                  </p>
                </div>
              )}
              
              {percentage >= 60 && percentage < 80 && (
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="font-medium text-primary flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Good work! Keep practicing to improve further.
                  </p>
                </div>
              )}
              
              {percentage < 60 && (
                <div className="p-4 bg-accent/10 rounded-lg">
                  <p className="font-medium text-accent flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Room for improvement. Try reviewing the concepts again.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetQuiz} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button variant="hero">
                <Brain className="h-4 w-4 mr-2" />
                Review Mistakes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="max-w-2xl mx-auto shadow-card-custom">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">{question.subject}</Badge>
          <Badge variant={question.difficulty === 'Easy' ? 'secondary' : 
                         question.difficulty === 'Medium' ? 'default' : 'destructive'}>
            {question.difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Question {currentQuestion + 1} of {questions.length}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={`font-mono ${timeLeft <= 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
              0:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold leading-relaxed">
            {question.question}
          </h3>
          
          <div className="text-right text-sm text-muted-foreground">
            Worth {question.points} points
          </div>
        </div>

        <RadioGroup 
          value={selectedAnswer?.toString()} 
          onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          disabled={showResult}
        >
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className={`flex-1 p-3 rounded-lg border cursor-pointer transition-smooth ${
                    showResult
                      ? index === question.correctAnswer
                        ? 'bg-secondary/20 border-secondary text-secondary'
                        : selectedAnswer === index
                        ? 'bg-destructive/20 border-destructive text-destructive'
                        : 'bg-muted/30'
                      : selectedAnswer === index
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{option}</span>
                    {showResult && (
                      <div className="flex items-center gap-1">
                        {index === question.correctAnswer && (
                          <CheckCircle className="h-4 w-4 text-secondary" />
                        )}
                        {selectedAnswer === index && selectedAnswer !== question.correctAnswer && (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        {showResult && (
          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="font-medium">Explanation:</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Score: {earnedPoints}/{totalPoints} points
          </div>
          
          <Button 
            onClick={handleNextQuestion} 
            disabled={selectedAnswer === null || showResult}
            variant={showResult ? "outline" : "default"}
          >
            {showResult ? (
              currentQuestion === questions.length - 1 ? "View Results" : "Next Question"
            ) : (
              "Submit Answer"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartQuiz;