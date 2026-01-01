"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, MessageCircle, ArrowRight } from "lucide-react";
import { QnAUstadz } from "@/types/public/kajian";

interface PopularQuestionsProps {
  questions: QnAUstadz[];
  onQuestionClick?: (question: QnAUstadz) => void;
  onViewAllClick?: () => void;
}

export default function PopularQuestions({
  questions,
  onQuestionClick,
  onViewAllClick,
}: PopularQuestionsProps) {
  if (questions.length === 0) {
    return (
      <Card className="border-awqaf-border-light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-awqaf-primary font-comfortaa">
            <TrendingUp className="w-5 h-5" />
            Pertanyaan Populer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <MessageCircle className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
          <p className="text-awqaf-foreground-secondary font-comfortaa">
            Belum ada pertanyaan populer saat ini.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-awqaf-border-light">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-awqaf-primary font-comfortaa">
            <TrendingUp className="w-5 h-5" />
            Pertanyaan Terbaru
          </CardTitle>
          {onViewAllClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAllClick}
              className="text-awqaf-primary hover:text-awqaf-primary/80 font-comfortaa"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
        <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
          Pertanyaan yang baru saja dijawab oleh Ustadz
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="p-4 rounded-lg border border-awqaf-border-light hover:bg-awqaf-primary/5 transition-colors duration-200 cursor-pointer"
              onClick={() => onQuestionClick?.(question)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-awqaf-primary text-white text-xs font-bold flex items-center justify-center font-comfortaa">
                      {index + 1}
                    </div>
                    <span className="text-xs text-awqaf-primary font-bold">
                      {question.ustadz.name}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa leading-relaxed line-clamp-2">
                  {question.question}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}