"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Lightbulb, Info } from "lucide-react"; // Added icons
import QuestionForm from "../components/QuestionForm";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For router back
import { useCreateQnAMutation } from "@/services/public/kajian.service";
import { useI18n } from "@/app/hooks/useI18n";
import { CreateQnABody } from "@/services/public/kajian.service";
import Swal from "sweetalert2";

// --- TRANSLATION DICTIONARY ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface PageTranslations {
  headerTitle: string;
  headerDesc: string;
  backBtn: string;
  successTitle: string;
  successDesc: string;
  submitAnother: string;
  guidelinesTitle: string;
  guideline1: string;
  guideline2: string;
  guideline3: string;
  guideline4: string;
  tipsTitle: string;
  tips: string[];
  quote: string;
  quoteSource: string;
  errorTitle: string;
  errorMessage: string;
}

const PAGE_TEXT: Record<LocaleCode, PageTranslations> = {
  id: {
    headerTitle: "Ajukan Pertanyaan",
    headerDesc:
      "Sampaikan pertanyaan Anda tentang Islam kepada ustadz yang berkompeten.",
    backBtn: "Kembali",
    successTitle: "Berhasil Dikirim!",
    successDesc:
      "Pertanyaan Anda telah diterima dan akan diproses. Anda akan mendapat notifikasi ketika dijawab.",
    submitAnother: "Tanya Lagi",
    guidelinesTitle: "Panduan",
    guideline1: "Tuliskan pertanyaan dengan jelas",
    guideline2: "Pilih ustadz yang sesuai topik",
    guideline3: "Gunakan bahasa yang sopan",
    guideline4: "Berikan konteks yang cukup",
    tipsTitle: "Tips",
    tips: [
      "Hindari pertanyaan terlalu umum",
      "Sertakan situasi spesifik",
      "Berikan detail relevan",
      "Cek pertanyaan serupa dahulu",
    ],
    quote:
      "Barangsiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga",
    quoteSource: "- HR. Muslim",
    errorTitle: "Gagal",
    errorMessage: "Gagal mengirim pertanyaan. Silakan coba lagi.",
  },
  en: {
    headerTitle: "Ask a Question",
    headerDesc: "Submit your questions about Islam to competent scholars.",
    backBtn: "Back",
    successTitle: "Submitted Successfully!",
    successDesc:
      "Your question has been received and will be processed. You will be notified when answered.",
    submitAnother: "Ask Another",
    guidelinesTitle: "Guidelines",
    guideline1: "Write clearly and specifically",
    guideline2: "Choose relevant Ustadz",
    guideline3: "Use polite language",
    guideline4: "Provide enough context",
    tipsTitle: "Tips",
    tips: [
      "Avoid overly general questions",
      "Include specific situations",
      "Provide relevant details",
      "Check similar questions first",
    ],
    quote:
      "Whoever follows a path to seek knowledge, Allah will make the path to Paradise easy for him.",
    quoteSource: "- Sahih Muslim",
    errorTitle: "Failed",
    errorMessage: "Failed to submit question. Please try again.",
  },
  ar: {
    headerTitle: "طرح سؤال",
    headerDesc: "اطرح أسئلتك حول الإسلام على علماء أكفاء.",
    backBtn: "عودة",
    successTitle: "تم الإرسال بنجاح!",
    successDesc: "تم استلام سؤالك وجاري معالجته. سيتم إشعارك عند الرد.",
    submitAnother: "سؤال آخر",
    guidelinesTitle: "إرشادات",
    guideline1: "اكتب بوضوح",
    guideline2: "اختر الأستاذ المناسب",
    guideline3: "استخدم لغة مهذبة",
    guideline4: "وفر سياقًا كافيًا",
    tipsTitle: "نصائح",
    tips: [
      "تجنب العموميات",
      "اذكر تفاصيل محددة",
      "لا تتردد في التوضيح",
      "تأكد من عدم التكرار",
    ],
    quote:
      "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    quoteSource: "- رواه مسلم",
    errorTitle: "فشل",
    errorMessage: "فشل الإرسال. حاول مرة أخرى.",
  },
  fr: {
    headerTitle: "Poser une Question",
    headerDesc: "Posez vos questions sur l'Islam à des érudits compétents.",
    backBtn: "Retour",
    successTitle: "Envoyé avec Succès !",
    successDesc:
      "Votre question a été reçue. Vous serez notifié lors de la réponse.",
    submitAnother: "Autre Question",
    guidelinesTitle: "Directives",
    guideline1: "Écrivez clairement",
    guideline2: "Choisissez l'Oustaz pertinent",
    guideline3: "Soyez poli",
    guideline4: "Donnez du contexte",
    tipsTitle: "Conseils",
    tips: [
      "Évitez les généralités",
      "Incluez des détails spécifiques",
      "Fournissez des infos pertinentes",
      "Vérifiez les questions similaires",
    ],
    quote:
      "Celui qui emprunte un chemin à la recherche du savoir, Allah lui facilite un chemin vers le Paradis.",
    quoteSource: "- Sahih Muslim",
    errorTitle: "Échec",
    errorMessage: "Échec de l'envoi. Réessayez.",
  },
  kr: {
    headerTitle: "질문하기",
    headerDesc: "이슬람에 대한 질문을 유능한 학자들에게 제출하세요.",
    backBtn: "돌아가기",
    successTitle: "제출 성공!",
    successDesc: "질문이 접수되었습니다. 답변이 완료되면 알림을 드립니다.",
    submitAnother: "다른 질문",
    guidelinesTitle: "지침",
    guideline1: "명확하게 작성하세요",
    guideline2: "관련 우스타즈 선택",
    guideline3: "공손한 언어 사용",
    guideline4: "충분한 맥락 제공",
    tipsTitle: "팁",
    tips: [
      "너무 일반적인 질문 피하기",
      "구체적인 상황 포함",
      "관련 세부 정보 제공",
      "중복 확인",
    ],
    quote:
      "지식을 구하기 위해 길을 나서는 자, 알라께서 천국으로 가는 길을 쉽게 해주실 것이다.",
    quoteSource: "- 사히 무슬림",
    errorTitle: "실패",
    errorMessage: "제출 실패. 다시 시도해 주세요.",
  },
  jp: {
    headerTitle: "質問する",
    headerDesc: "イスラム教に関する質問を有能な学者に提出してください。",
    backBtn: "戻る",
    successTitle: "送信成功！",
    successDesc: "質問を受理しました。回答があり次第通知されます。",
    submitAnother: "別の質問",
    guidelinesTitle: "ガイドライン",
    guideline1: "明確に書いてください",
    guideline2: "適切なウスタズを選択",
    guideline3: "丁寧な言葉遣い",
    guideline4: "文脈を提供する",
    tipsTitle: "ヒント",
    tips: [
      "一般的すぎる質問は避ける",
      "具体的な状況を含める",
      "詳細を提供する",
      "類似質問を確認",
    ],
    quote:
      "知識を求めて道を歩む者には、アッラーが天国への道を容易にしてくださるだろう。",
    quoteSource: "- サヒーフ・ムスリム",
    errorTitle: "失敗",
    errorMessage: "送信に失敗しました。再試行してください。",
  },
};

export default function QuestionFormPage() {
  const router = useRouter();
  const { locale } = useI18n();
  // Safe Locale Access
  const safeLocale = (
    PAGE_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = PAGE_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createQnA] = useCreateQnAMutation();

  const handleQuestionSubmit = async (questionData: CreateQnABody) => {
    try {
      await createQnA(questionData).unwrap();
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit question:", error);
      Swal.fire({
        icon: "error",
        title: t.errorTitle,
        text: t.errorMessage,
        confirmButtonColor: "#0d9488",
        confirmButtonText: "OK",
        customClass: {
          popup: "font-comfortaa",
        },
      });
    }
  };

  if (isSubmitted) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 flex items-center justify-center p-4"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <Card className="w-full max-w-md border-green-200 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-800 font-comfortaa mb-2">
              {t.successTitle}
            </h2>
            <p className="text-sm text-green-700 font-comfortaa mb-6 leading-relaxed">
              {t.successDesc}
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/tanya-ustadz">
                <Button className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa h-10">
                  <ArrowLeft
                    className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"} ${isRtl ? "rotate-180" : ""}`}
                  />
                  {t.backBtn}
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="w-full font-comfortaa h-10 border-awqaf-primary text-awqaf-primary hover:bg-awqaf-primary/5"
              >
                {t.submitAnother}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative flex gap-2 items-center bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 transition-colors duration-200"
            >
              <ArrowLeft
                className={`w-5 h-5 text-awqaf-primary ${isRtl ? "rotate-180" : ""}`}
              />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-awqaf-primary font-comfortaa text-center">
                {t.headerTitle}
              </h1>
              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa text-center mt-0.5 line-clamp-1">
                {t.headerDesc}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Main Form */}
        <div className="bg-white p-4 rounded-2xl border border-awqaf-border-light shadow-sm">
          <QuestionForm onSubmit={handleQuestionSubmit} />
        </div>

        {/* Guidelines (Stacked) */}
        <Card className="border-awqaf-border-light bg-white/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-awqaf-primary font-comfortaa flex items-center gap-2">
              <Info className="w-4 h-4" />
              {t.guidelinesTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-xs font-comfortaa">
              {[t.guideline1, t.guideline2, t.guideline3, t.guideline4].map(
                (text, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-awqaf-primary/10 text-awqaf-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-awqaf-foreground-secondary leading-relaxed">
                      {text}
                    </p>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tips (Stacked) */}
        <Card className="border-awqaf-border-light bg-gradient-to-br from-accent-50 to-accent-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-awqaf-primary font-comfortaa flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-orange-500" />
              {t.tipsTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs font-comfortaa">
              {t.tips.map((tip: string, idx: number) => (
                <p
                  key={idx}
                  className="text-awqaf-foreground-secondary flex items-start gap-2"
                >
                  <span className="text-orange-500 mt-0.5">•</span> {tip}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivational Quote */}
        <Card className="border-awqaf-border-light bg-white/80">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-awqaf-primary font-comfortaa mb-2 italic leading-relaxed">
              &quot;{t.quote}&quot;
            </p>
            <p className="text-[10px] text-awqaf-foreground-secondary font-tajawal font-bold">
              {t.quoteSource}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}