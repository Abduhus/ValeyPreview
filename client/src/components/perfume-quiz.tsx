import { useState } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface QuizProps {
  isOpen: boolean;
  onClose: () => void;
  onRecommendation: (productIds: string[]) => void;
}

interface Question {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
}

interface QuizAnswer {
  questionId: string;
  answer: string;
}

const quizQuestions: Question[] = [
  {
    id: "occasion",
    question: "When do you plan to wear this fragrance?",
    options: [
      { value: "daily", label: "Daily Wear", description: "For work, casual outings" },
      { value: "evening", label: "Evening Events", description: "Dinner, parties, dates" },
      { value: "special", label: "Special Occasions", description: "Weddings, celebrations" },
      { value: "any", label: "Any Time", description: "Versatile for all occasions" }
    ]
  },
  {
    id: "season",
    question: "Which season do you prefer this fragrance for?",
    options: [
      { value: "spring", label: "Spring", description: "Fresh, light, blooming" },
      { value: "summer", label: "Summer", description: "Citrusy, aquatic, energizing" },
      { value: "autumn", label: "Autumn", description: "Warm, spicy, cozy" },
      { value: "winter", label: "Winter", description: "Rich, deep, comforting" }
    ]
  },
  {
    id: "personality",
    question: "Which personality trait describes you best?",
    options: [
      { value: "romantic", label: "Romantic", description: "Dreamy, soft, feminine" },
      { value: "confident", label: "Confident", description: "Bold, powerful, assertive" },
      { value: "mysterious", label: "Mysterious", description: "Enigmatic, alluring, deep" },
      { value: "energetic", label: "Energetic", description: "Vibrant, active, fresh" }
    ]
  },
  {
    id: "intensity",
    question: "How strong do you like your fragrance?",
    options: [
      { value: "subtle", label: "Subtle", description: "Light, barely there" },
      { value: "moderate", label: "Moderate", description: "Noticeable but not overpowering" },
      { value: "strong", label: "Strong", description: "Bold, makes a statement" },
      { value: "intense", label: "Very Intense", description: "Long-lasting, powerful projection" }
    ]
  },
  {
    id: "notes",
    question: "Which scent family appeals to you most?",
    options: [
      { value: "floral", label: "Floral", description: "Rose, jasmine, lily" },
      { value: "citrus", label: "Citrus", description: "Lemon, orange, bergamot" },
      { value: "woody", label: "Woody", description: "Sandalwood, cedar, oak" },
      { value: "oriental", label: "Oriental", description: "Vanilla, amber, spices" }
    ]
  }
];

// Product recommendation mapping based on quiz answers
const productRecommendations: Record<string, string[]> = {
  // Light, fresh, daily wear combinations
  "daily-spring-energetic-subtle-citrus": ["3", "8"], // Mystic Oud, Heritage Oak
  "daily-summer-energetic-subtle-citrus": ["3", "8"], // Mystic Oud, Heritage Oak
  
  // Romantic, floral combinations
  "any-spring-romantic-moderate-floral": ["4", "7"], // Golden Lotus, Royal Garden
  "daily-spring-romantic-subtle-floral": ["4", "7"], // Golden Lotus, Royal Garden
  
  // Evening, sophisticated combinations
  "evening-autumn-confident-strong-oriental": ["1", "2"], // Desert Breeze, Midnight Rose
  "evening-winter-mysterious-intense-woody": ["1", "5"], // Desert Breeze, Urban Legend
  
  // Special occasions, luxury
  "special-any-confident-strong-oriental": ["4", "7"], // Golden Lotus, Royal Garden
  "special-winter-mysterious-intense-woody": ["1", "2"], // Desert Breeze, Midnight Rose
  
  // Versatile, unisex options
  "any-any-confident-moderate-woody": ["3", "6"], // Mystic Oud, Celestial Moon
  "daily-any-energetic-moderate-citrus": ["3", "8"], // Mystic Oud, Heritage Oak
};

export default function PerfumeQuiz({ isOpen, onClose, onRecommendation }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === quizQuestions[currentQuestion].id);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex].answer = answer;
    } else {
      newAnswers.push({
        questionId: quizQuestions[currentQuestion].id,
        answer: answer
      });
    }
    
    setAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateRecommendations();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateRecommendations = () => {
    // Create a key from the answers
    const answerKey = answers
      .sort((a, b) => {
        const aIndex = quizQuestions.findIndex(q => q.id === a.questionId);
        const bIndex = quizQuestions.findIndex(q => q.id === b.questionId);
        return aIndex - bIndex;
      })
      .map(a => a.answer)
      .join("-");

    // Try to find exact match
    let recommendedIds = productRecommendations[answerKey];
    
    // If no exact match, find the best partial matches
    if (!recommendedIds) {
      const answerValues = answers.reduce((acc, curr) => {
        acc[curr.questionId] = curr.answer;
        return acc;
      }, {} as Record<string, string>);

      // Fallback recommendation logic based on individual preferences
      recommendedIds = [];
      
      // Floral preferences
      if (answerValues.notes === 'floral') {
        recommendedIds.push("4", "7"); // Golden Lotus, Royal Garden
      }
      // Citrus preferences
      else if (answerValues.notes === 'citrus') {
        recommendedIds.push("3", "8"); // Mystic Oud, Heritage Oak
      }
      // Woody preferences
      else if (answerValues.notes === 'woody') {
        recommendedIds.push("5", "8"); // Urban Legend, Heritage Oak
      }
      // Oriental preferences
      else if (answerValues.notes === 'oriental') {
        recommendedIds.push("1", "2"); // Desert Breeze, Midnight Rose
      }
      
      // Add unisex option for versatility
      if (answerValues.occasion === 'any') {
        recommendedIds.push("3", "6"); // Mystic Oud, Celestial Moon
      }
      
      // Ensure we have at least 2 recommendations
      if (recommendedIds.length < 2) {
        recommendedIds = ["1", "3", "4"]; // Default recommendations
      }
      
      // Remove duplicates and limit to 3
      recommendedIds = Array.from(new Set(recommendedIds)).slice(0, 3);
    }

    setRecommendations(recommendedIds);
    setIsComplete(true);
    onRecommendation(recommendedIds);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsComplete(false);
    setRecommendations([]);
  };

  const handleClose = () => {
    resetQuiz();
    onClose();
  };

  const currentAnswer = answers.find(a => a.questionId === quizQuestions[currentQuestion]?.id)?.answer;
  const isAnswered = !!currentAnswer;
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card/95 backdrop-blur-glass border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary">Find Your Perfect Scent</h2>
            <p className="text-muted-foreground mt-1">
              {isComplete ? "Your personalized recommendations" : `Question ${currentQuestion + 1} of ${quizQuestions.length}`}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isComplete && (
          <>
            {/* Progress Bar */}
            <div className="px-6 py-4">
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="px-6 py-4">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                {quizQuestions[currentQuestion]?.question}
              </h3>
              
              <div className="grid gap-3">
                {quizQuestions[currentQuestion]?.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                      currentAnswer === option.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-6 border-t border-border">
              <button
                onClick={goToPreviousQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              
              <button
                onClick={goToNextQuestion}
                disabled={!isAnswered}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion === quizQuestions.length - 1 ? 'Get Recommendations' : 'Next'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {isComplete && (
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-primary mb-2">Perfect Matches Found!</h3>
              <p className="text-muted-foreground">
                Based on your preferences, we've selected these fragrances just for you.
              </p>
            </div>
            
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={() => {
                  handleClose();
                  // Navigate to catalog page with recommendations
                  window.location.href = '/catalog';
                }}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                View Recommendations
              </button>
              <button
                onClick={resetQuiz}
                className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-all duration-300"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}