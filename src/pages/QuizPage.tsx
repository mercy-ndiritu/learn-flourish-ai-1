import SmartQuiz from "@/components/SmartQuiz";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const QuizPage = () => {
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
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-learning bg-clip-text text-transparent">
                  Smart Quiz
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Quiz Component */}
      <div className="container mx-auto px-4 py-8">
        <SmartQuiz />
      </div>
    </div>
  );
};

export default QuizPage;