import { useState } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface QuizProps {
  isOpen: boolean;
  onClose: () => void;
  onRecommendation: (productIds: string[], quizResults: QuizResults) => void;
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

// New interface for quiz results
interface QuizResults {
  occasion: string;
  season: string;
  personality: string;
  intensity: string;
  notes: string;
  fragranceProfile: string;
  lifestyle: string;
  olfactoryFamily?: string;
  notesPreference?: string;
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
    id: "olfactoryFamily",
    question: "Which scent family appeals to you most?",
    options: [
      { value: "floral", label: "Floral", description: "Rose, jasmine, lily - feminine and romantic" },
      { value: "citrus", label: "Citrus", description: "Lemon, orange, bergamot - fresh and energizing" },
      { value: "woody", label: "Woody", description: "Sandalwood, cedar, vetiver - warm and grounding" },
      { value: "oriental", label: "Oriental", description: "Vanilla, amber, spices - rich and sensual" },
      { value: "fresh", label: "Fresh", description: "Aquatic, green, ozonic - clean and crisp" },
      { value: "gourmand", label: "Gourmand", description: "Vanilla, caramel, chocolate - sweet and edible" }
    ]
  },
  {
    id: "notesPreference",
    question: "What kind of fragrance notes do you prefer?",
    options: [
      { value: "fruity", label: "Fruity", description: "Apple, peach, berries - sweet and juicy" },
      { value: "spicy", label: "Spicy", description: "Cinnamon, cardamom, pepper - warm and exotic" },
      { value: "aromatic", label: "Aromatic", description: "Lavender, rosemary, mint - herbal and green" },
      { value: "earthy", label: "Earthy", description: "Patchouli, moss, mushrooms - natural and grounding" },
      { value: "smoky", label: "Smoky", description: "Oud, incense, tobacco - mysterious and intense" },
      { value: "powdery", label: "Powdery", description: "Iris, musk, vanilla - soft and comforting" }
    ]
  }
];

// Enhanced product recommendation mapping based on comprehensive quiz answers
const productRecommendations: Record<string, { ids: string[]; profile: string; lifestyle: string }> = {
  // Light, fresh, daily wear combinations
  "daily-spring-energetic-subtle-citrus-fruity": { 
    ids: ["3", "8"], 
    profile: "Fresh & Citrus", 
    lifestyle: "Active & Energetic" 
  },
  "daily-summer-energetic-subtle-citrus-aromatic": { 
    ids: ["3", "8"], 
    profile: "Aquatic & Citrus", 
    lifestyle: "Outdoor & Sporty" 
  },
  
  // Romantic, floral combinations
  "any-spring-romantic-moderate-floral-powdery": { 
    ids: ["4", "7"], 
    profile: "Floral & Feminine", 
    lifestyle: "Romantic & Dreamy" 
  },
  "daily-spring-romantic-subtle-floral-fruity": { 
    ids: ["4", "7"], 
    profile: "Soft Floral", 
    lifestyle: "Graceful & Elegant" 
  },
  
  // Evening, sophisticated combinations
  "evening-autumn-confident-strong-oriental-spicy": { 
    ids: ["1", "2"], 
    profile: "Warm & Spicy", 
    lifestyle: "Sophisticated & Bold" 
  },
  "evening-winter-mysterious-intense-woody-smoky": { 
    ids: ["1", "5"], 
    profile: "Woody & Mysterious", 
    lifestyle: "Luxurious & Enigmatic" 
  },
  
  // Special occasions, luxury
  "special-any-confident-strong-oriental-gourmand": { 
    ids: ["4", "7"], 
    profile: "Rich & Opulent", 
    lifestyle: "Celebratory & Prestigious" 
  },
  "special-winter-mysterious-intense-woody-earthy": { 
    ids: ["1", "2"], 
    profile: "Deep & Complex", 
    lifestyle: "Exclusive & Refined" 
  },
  
  // Versatile, unisex options
  "any-any-confident-moderate-woody-aromatic": { 
    ids: ["3", "6"], 
    profile: "Balanced & Versatile", 
    lifestyle: "Modern & Adaptable" 
  },
  "daily-any-energetic-moderate-citrus-fruity": { 
    ids: ["3", "8"], 
    profile: "Vibrant & Refreshing", 
    lifestyle: "Youthful & Dynamic" 
  },
  
  // Fresh and clean combinations
  "daily-summer-energetic-subtle-fresh-aromatic": { 
    ids: ["3", "8"], 
    profile: "Clean & Aquatic", 
    lifestyle: "Refreshing & Vital" 
  },
  "daily-spring-romantic-subtle-fresh-powdery": { 
    ids: ["4", "7"], 
    profile: "Soft & Clean", 
    lifestyle: "Pure & Serene" 
  },
  
  // Earthy and natural combinations
  "daily-autumn-confident-moderate-earthy-earthy": { 
    ids: ["5", "6"], 
    profile: "Natural & Grounding", 
    lifestyle: "Earthy & Authentic" 
  },
  "daily-winter-mysterious-strong-woody-earthy": { 
    ids: ["1", "5"], 
    profile: "Deep & Earthy", 
    lifestyle: "Rooted & Stable" 
  },
  
  // Spicy and exotic combinations (fixed duplicate)
  "special-any-confident-intense-oriental-spicy": { 
    ids: ["1", "2"], 
    profile: "Rich & Exotic", 
    lifestyle: "Luxurious & Passionate" 
  },
};

// Fallback recommendations based on individual preferences
const fallbackRecommendations: Record<string, { ids: string[]; profile: string; lifestyle: string }> = {
  // Based on olfactory family preference
  "floral": { 
    ids: ["4", "7"], 
    profile: "Floral & Feminine", 
    lifestyle: "Romantic & Graceful" 
  },
  "citrus": { 
    ids: ["3", "8"], 
    profile: "Fresh & Citrus", 
    lifestyle: "Energetic & Vibrant" 
  },
  "woody": { 
    ids: ["5", "1"], 
    profile: "Woody & Earthy", 
    lifestyle: "Confident & Grounded" 
  },
  "oriental": { 
    ids: ["1", "2"], 
    profile: "Warm & Spicy", 
    lifestyle: "Sophisticated & Alluring" 
  },
  "fresh": { 
    ids: ["3", "8"], 
    profile: "Clean & Aquatic", 
    lifestyle: "Refreshing & Pure" 
  },
  "gourmand": { 
    ids: ["4", "7"], 
    profile: "Sweet & Edible", 
    lifestyle: "Indulgent & Comforting" 
  },
  
  // Based on notes preference
  "fruity": { 
    ids: ["4", "7"], 
    profile: "Fruity & Juicy", 
    lifestyle: "Playful & Sweet" 
  },
  "spicy": { 
    ids: ["1", "2"], 
    profile: "Spicy & Warm", 
    lifestyle: "Bold & Exotic" 
  },
  "aromatic": { 
    ids: ["3", "8"], 
    profile: "Herbal & Green", 
    lifestyle: "Fresh & Natural" 
  },
  "earthy": { 
    ids: ["5", "6"], 
    profile: "Earthy & Natural", 
    lifestyle: "Grounded & Authentic" 
  },
  "smoky": { 
    ids: ["1", "5"], 
    profile: "Smoky & Mysterious", 
    lifestyle: "Intense & Enigmatic" 
  },
  "powdery": { 
    ids: ["4", "7"], 
    profile: "Soft & Powdery", 
    lifestyle: "Comforting & Delicate" 
  },
  
  // Based on personality traits
  "romantic": { 
    ids: ["4", "7"], 
    profile: "Soft & Dreamy", 
    lifestyle: "Romantic & Feminine" 
  },
  "confident": { 
    ids: ["1", "2"], 
    profile: "Bold & Assertive", 
    lifestyle: "Powerful & Dynamic" 
  },
  "mysterious": { 
    ids: ["1", "5"], 
    profile: "Enigmatic & Deep", 
    lifestyle: "Intriguing & Complex" 
  },
  "energetic": { 
    ids: ["3", "8"], 
    profile: "Vibrant & Fresh", 
    lifestyle: "Active & Lively" 
  },
  
  // Based on season
  "spring": { 
    ids: ["4", "7"], 
    profile: "Floral & Fresh", 
    lifestyle: "Renewed & Blossoming" 
  },
  "summer": { 
    ids: ["3", "8"], 
    profile: "Aquatic & Citrus", 
    lifestyle: "Cool & Refreshing" 
  },
  "autumn": { 
    ids: ["1", "2"], 
    profile: "Warm & Spicy", 
    lifestyle: "Cozy & Comforting" 
  },
  "winter": { 
    ids: ["5", "6"], 
    profile: "Rich & Deep", 
    lifestyle: "Luxurious & Intense" 
  },
  
  // Default recommendations
  "default": { 
    ids: ["1", "3", "4"], 
    profile: "Well-Rounded Selection", 
    lifestyle: "Versatile & Balanced" 
  }
};

export default function PerfumeQuiz({ isOpen, onClose, onRecommendation }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [recommendations, setRecommendations] = useState<{ ids: string[]; profile: string; lifestyle: string }>({ 
    ids: [], 
    profile: "", 
    lifestyle: "" 
  });

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
    let recommendation = productRecommendations[answerKey];
    
    // If no exact match, find the best partial matches
    if (!recommendation) {
      const answerValues = answers.reduce((acc, curr) => {
        acc[curr.questionId] = curr.answer;
        return acc;
      }, {} as Record<string, string>);

      // Fallback recommendation logic based on individual preferences
      const ids: string[] = [];
      let profile = "";
      let lifestyle = "";
      
      // Determine profile based on olfactory family
      if (answerValues.olfactoryFamily) {
        const familyRec = fallbackRecommendations[answerValues.olfactoryFamily];
        if (familyRec) {
          ids.push(...familyRec.ids);
          profile = familyRec.profile;
          lifestyle = familyRec.lifestyle;
        }
      }
      
      // Adjust based on notes preference
      if (answerValues.notesPreference && !profile) {
        const notesRec = fallbackRecommendations[answerValues.notesPreference];
        if (notesRec) {
          ids.push(...notesRec.ids);
          profile = notesRec.profile;
          lifestyle = notesRec.lifestyle;
        }
      }
      
      // Adjust based on personality
      if (answerValues.personality && !profile) {
        const personalityRec = fallbackRecommendations[answerValues.personality];
        if (personalityRec) {
          ids.push(...personalityRec.ids);
          profile = personalityRec.profile;
          lifestyle = personalityRec.lifestyle;
        }
      }
      
      // Adjust based on season
      if (answerValues.season && !profile) {
        const seasonRec = fallbackRecommendations[answerValues.season];
        if (seasonRec) {
          ids.push(...seasonRec.ids);
          profile = seasonRec.profile;
          lifestyle = seasonRec.lifestyle;
        }
      }
      
      // Ensure we have at least 2 recommendations
      if (ids.length < 2) {
        const defaultRec = fallbackRecommendations["default"];
        ids.push(...defaultRec.ids);
        if (!profile) profile = defaultRec.profile;
        if (!lifestyle) lifestyle = defaultRec.lifestyle;
      }
      
      // Remove duplicates and limit to 3
      const uniqueIds = Array.from(new Set(ids)).slice(0, 3);
      recommendation = { ids: uniqueIds, profile, lifestyle };
    }

    setRecommendations(recommendation);
    setIsComplete(true);
    
    // Create quiz results object with enhanced fragrance knowledge
    const quizResults: QuizResults = {
      occasion: answers.find(a => a.questionId === "occasion")?.answer || "",
      season: answers.find(a => a.questionId === "season")?.answer || "",
      personality: answers.find(a => a.questionId === "personality")?.answer || "",
      intensity: answers.find(a => a.questionId === "intensity")?.answer || "",
      notes: answers.find(a => a.questionId === "olfactoryFamily")?.answer || "",
      fragranceProfile: recommendation.profile,
      lifestyle: recommendation.lifestyle
    };
    
    // Save results to localStorage
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
    localStorage.setItem('recommendedProducts', JSON.stringify(recommendation.ids));
    
    onRecommendation(recommendation.ids, quizResults);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsComplete(false);
    setRecommendations({ ids: [], profile: "", lifestyle: "" });
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
            <h2 className="text-2xl font-serif font-bold text-gradient-smooth">Find Your Perfect Scent</h2>
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
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 product-card-enhanced disabled:opacity-50 disabled:cursor-not-allowed"
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
              <h3 className="text-xl font-semibold text-gradient-smooth mb-2">Perfect Matches Found!</h3>
              <p className="text-muted-foreground">
                Based on your preferences, we've selected these fragrances just for you.
              </p>
            </div>
            
            <div className="bg-card/40 border border-primary/20 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gradient-smooth mb-2">Your Fragrance Profile:</h4>
              <p className="text-foreground">{recommendations.profile}</p>
              <h4 className="font-semibold text-gradient-smooth mt-3 mb-2">Lifestyle Match:</h4>
              <p className="text-foreground">{recommendations.lifestyle}</p>
              
              {/* Enhanced fragrance knowledge display */}
              <div className="mt-4 pt-4 border-t border-primary/10">
                <h4 className="font-semibold text-gradient-smooth mb-2">Fragrance Insights:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-foreground/80 w-24">Olfactory Family:</span>
                    <span className="text-foreground capitalize">
                      {answers.find(a => a.questionId === "olfactoryFamily")?.answer || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-foreground/80 w-24">Notes Type:</span>
                    <span className="text-foreground capitalize">
                      {answers.find(a => a.questionId === "notesPreference")?.answer || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-foreground/80 w-24">Intensity:</span>
                    <span className="text-foreground capitalize">
                      {answers.find(a => a.questionId === "intensity")?.answer || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-foreground/80 w-24">Season:</span>
                    <span className="text-foreground capitalize">
                      {answers.find(a => a.questionId === "season")?.answer || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={() => {
                  handleClose();
                  // Navigate to quiz results page
                  window.location.href = '/quiz-results';
                }}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 product-card-enhanced"
              >
                View Full Results
              </button>
              <button
                onClick={resetQuiz}
                className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-all duration-300 product-card-enhanced"
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