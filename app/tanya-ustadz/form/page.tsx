"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import QuestionForm from "../components/QuestionForm";
import Link from "next/link";
import { useCreateQnAMutation } from "@/services/public/kajian.service";
import { useI18n } from "@/app/hooks/useI18n";
import { CreateQnABody } from "@/services/public/kajian.service";
import Swal from "sweetalert2"; // Import SweetAlert2

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
  errorTitle: string; // New
  errorMessage: string; // New
}

const PAGE_TEXT: Record<LocaleCode, PageTranslations> = {
  id: {
    headerTitle: "Ajukan Pertanyaan",
    headerDesc:
      "Sampaikan pertanyaan Anda tentang Islam kepada ustadz yang berkompeten. Dapatkan jawaban yang tepat dan terpercaya.",
    backBtn: "Kembali ke Tanya Ustadz",
    successTitle: "Pertanyaan Berhasil Dikirim!",
    successDesc:
      "Pertanyaan Anda telah diterima dan akan diproses oleh tim ustadz. Anda akan mendapat notifikasi ketika pertanyaan sudah dijawab.",
    submitAnother: "Ajukan Pertanyaan Lain",
    guidelinesTitle: "Panduan Bertanya",
    guideline1: "Tuliskan pertanyaan dengan jelas dan spesifik",
    guideline2: "Pilih ustadz yang sesuai dengan topik pertanyaan",
    guideline3: "Gunakan bahasa yang sopan dan santun",
    guideline4: "Berikan konteks yang cukup untuk pertanyaan Anda",
    tipsTitle: "Tips Bertanya",
    tips: [
      "Hindari pertanyaan yang terlalu umum",
      "Sertakan situasi atau kondisi spesifik",
      "Jangan ragu untuk memberikan detail yang relevan",
      "Pastikan pertanyaan belum pernah ditanyakan sebelumnya",
    ],
    quote:
      "Barangsiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga",
    quoteSource: "- HR. Muslim",
    errorTitle: "Gagal",
    errorMessage: "Gagal mengirim pertanyaan. Silakan coba lagi.",
  },
  en: {
    headerTitle: "Ask a Question",
    headerDesc:
      "Submit your questions about Islam to competent scholars. Get accurate and reliable answers.",
    backBtn: "Back to Ask Ustadz",
    successTitle: "Question Submitted Successfully!",
    successDesc:
      "Your question has been received and will be processed by our team. You will be notified when it's answered.",
    submitAnother: "Submit Another Question",
    guidelinesTitle: "Guidelines",
    guideline1: "Write your question clearly and specifically",
    guideline2: "Choose an Ustadz relevant to the topic",
    guideline3: "Use polite and respectful language",
    guideline4: "Provide enough context for your question",
    tipsTitle: "Tips",
    tips: [
      "Avoid overly general questions",
      "Include specific situations or conditions",
      "Don't hesitate to provide relevant details",
      "Ensure the question hasn't been asked before",
    ],
    quote:
      "Whoever follows a path to seek knowledge, Allah will make the path to Paradise easy for him.",
    quoteSource: "- Sahih Muslim",
    errorTitle: "Failed",
    errorMessage: "Failed to submit question. Please try again.",
  },
  ar: {
    headerTitle: "طرح سؤال",
    headerDesc:
      "اطرح أسئلتك حول الإسلام على علماء أكفاء. احصل على إجابات دقيقة وموثوقة.",
    backBtn: "العودة إلى اسأل الأستاذ",
    successTitle: "تم إرسال السؤال بنجاح!",
    successDesc:
      "تم استلام سؤالك وسيتم معالجته من قبل فريقنا. سيتم إشعارك عند الرد عليه.",
    submitAnother: "طرح سؤال آخر",
    guidelinesTitle: "إرشادات",
    guideline1: "اكتب سؤالك بوضوح وتحديد",
    guideline2: "اختر أستاذًا ذا صلة بالموضوع",
    guideline3: "استخدم لغة مهذبة ومحترمة",
    guideline4: "قدم سياقًا كافيًا لسؤالك",
    tipsTitle: "نصائح",
    tips: [
      "تجنب الأسئلة العامة جدًا",
      "قم بتضمين مواقف أو ظروف محددة",
      "لا تتردد في تقديم التفاصيل ذات الصلة",
      "تأكد من عدم طرح السؤال من قبل",
    ],
    quote:
      "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    quoteSource: "- رواه مسلم",
    errorTitle: "فشل",
    errorMessage: "فشل إرسال السؤال. يرجى المحاولة مرة أخرى.",
  },
  fr: {
    headerTitle: "Poser une Question",
    headerDesc:
      "Posez vos questions sur l'Islam à des érudits compétents. Obtenez des réponses précises et fiables.",
    backBtn: "Retour à Demander à l'Oustaz",
    successTitle: "Question Envoyée avec Succès !",
    successDesc:
      "Votre question a été reçue et sera traitée par notre équipe. Vous serez notifié lorsqu'elle sera répondue.",
    submitAnother: "Poser une Autre Question",
    guidelinesTitle: "Directives",
    guideline1: "Écrivez votre question clairement et spécifiquement",
    guideline2: "Choisissez un Oustaz pertinent pour le sujet",
    guideline3: "Utilisez un langage poli et respectueux",
    guideline4: "Fournissez suffisamment de contexte pour votre question",
    tipsTitle: "Conseils",
    tips: [
      "Évitez les questions trop générales",
      "Incluez des situations ou conditions spécifiques",
      "N'hésitez pas à fournir des détails pertinents",
      "Assurez-vous que la question n'a pas déjà été posée",
    ],
    quote:
      "Celui qui emprunte un chemin à la recherche du savoir, Allah lui facilite un chemin vers le Paradis.",
    quoteSource: "- Sahih Muslim",
    errorTitle: "Échec",
    errorMessage: "Échec de l'envoi de la question. Veuillez réessayer.",
  },
  kr: {
    headerTitle: "질문하기",
    headerDesc:
      "이슬람에 대한 질문을 유능한 학자들에게 제출하세요. 정확하고 신뢰할 수 있는 답변을 받으세요.",
    backBtn: "우스타즈에게 질문하기로 돌아가기",
    successTitle: "질문이 성공적으로 제출되었습니다!",
    successDesc:
      "귀하의 질문이 접수되었으며 우리 팀에 의해 처리될 것입니다. 답변이 완료되면 알림을 받게 됩니다.",
    submitAnother: "다른 질문 제출하기",
    guidelinesTitle: "지침",
    guideline1: "질문을 명확하고 구체적으로 작성하세요",
    guideline2: "주제와 관련된 우스타즈를 선택하세요",
    guideline3: "공손하고 존중하는 언어를 사용하세요",
    guideline4: "질문에 대한 충분한 맥락을 제공하세요",
    tipsTitle: "팁",
    tips: [
      "너무 일반적인 질문은 피하세요",
      "구체적인 상황이나 조건을 포함하세요",
      "관련 세부 정보를 제공하는 것을 주저하지 마세요",
      "이전에 질문되지 않았는지 확인하세요",
    ],
    quote:
      "지식을 구하기 위해 길을 나서는 자, 알라께서 그를 위해 천국으로 가는 길을 쉽게 해주실 것이다.",
    quoteSource: "- 사히 무슬림",
    errorTitle: "실패",
    errorMessage: "질문을 제출하지 못했습니다. 다시 시도해 주세요.",
  },
  jp: {
    headerTitle: "質問する",
    headerDesc:
      "イスラム教に関する質問を有能な学者に提出してください。正確で信頼できる回答を得られます。",
    backBtn: "ウスタズに質問するに戻る",
    successTitle: "質問が正常に送信されました！",
    successDesc:
      "あなたの質問は受理され、私たちのチームによって処理されます。回答が得られ次第通知されます。",
    submitAnother: "別の質問を送信",
    guidelinesTitle: "ガイドライン",
    guideline1: "質問は明確かつ具体的に書いてください",
    guideline2: "トピックに関連するウスタズを選択してください",
    guideline3: "丁寧で敬意のある言葉遣いをしてください",
    guideline4: "質問に十分な文脈を提供してください",
    tipsTitle: "ヒント",
    tips: [
      "一般的すぎる質問は避けてください",
      "具体的な状況や条件を含めてください",
      "関連する詳細を提供することを躊躇しないでください",
      "以前に質問されていないことを確認してください",
    ],
    quote:
      "知識を求めて道を歩む者には、アッラーが天国への道を容易にしてくださるだろう。",
    quoteSource: "- サヒーフ・ムスリム",
    errorTitle: "失敗",
    errorMessage: "質問の送信に失敗しました。もう一度お試しください。",
  },
};

export default function QuestionFormPage() {
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
      // IMPLEMENTASI SWEETALERT
      Swal.fire({
        icon: "error",
        title: t.errorTitle,
        text: t.errorMessage,
        confirmButtonColor: "#0d9488", // Teal
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
        className="min-h-screen bg-background pb-20"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-awqaf-primary to-awqaf-primary/80 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold font-comfortaa mb-4">
                {t.headerTitle}
              </h1>
              <p className="text-lg text-white/90 font-comfortaa mb-6 max-w-2xl mx-auto">
                {t.headerDesc}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-800 font-comfortaa mb-4">
                  {t.successTitle}
                </h2>
                <p className="text-green-700 font-comfortaa mb-6 leading-relaxed">
                  {t.successDesc}
                </p>
                <div className="space-y-4">
                  <Link href="/tanya-ustadz">
                    <Button className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa">
                      <ArrowLeft
                        className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"} ${isRtl ? "rotate-180" : ""}`}
                      />
                      {t.backBtn}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                    className="w-full font-comfortaa"
                  >
                    {t.submitAnother}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-awqaf-primary to-awqaf-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold font-comfortaa mb-4">
              {t.headerTitle}
            </h1>
            <p className="text-lg text-white/90 font-comfortaa mb-6 max-w-2xl mx-auto">
              {t.headerDesc}
            </p>
            <Link href="/tanya-ustadz">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-comfortaa"
              >
                <ArrowLeft
                  className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"} ${isRtl ? "rotate-180" : ""}`}
                />
                {t.backBtn}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <QuestionForm onSubmit={handleQuestionSubmit} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Guidelines */}
              <Card className="border-awqaf-border-light">
                <CardHeader>
                  <CardTitle className="text-awqaf-primary font-comfortaa">
                    {t.guidelinesTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm font-comfortaa">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-awqaf-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <p className="text-awqaf-foreground-secondary">
                        {t.guideline1}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-awqaf-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <p className="text-awqaf-foreground-secondary">
                        {t.guideline2}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-awqaf-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <p className="text-awqaf-foreground-secondary">
                        {t.guideline3}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-awqaf-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        4
                      </div>
                      <p className="text-awqaf-foreground-secondary">
                        {t.guideline4}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
                <CardHeader>
                  <CardTitle className="text-awqaf-primary font-comfortaa">
                    {t.tipsTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm font-comfortaa">
                    {t.tips.map((tip: string, idx: number) => (
                      <p key={idx} className="text-awqaf-foreground-secondary">
                        • {tip}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Motivational Quote */}
              <Card className="border-awqaf-border-light bg-gradient-to-r from-awqaf-primary/5 to-awqaf-primary/10">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-awqaf-primary font-comfortaa mb-1">
                    &quot;{t.quote}&quot;
                  </p>
                  <p className="text-xs text-awqaf-foreground-secondary font-tajawal">
                    {t.quoteSource}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}