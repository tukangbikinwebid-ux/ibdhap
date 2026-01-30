"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, MessageSquare, Loader2, Lock, Globe } from "lucide-react";
import { useGetUstadzListQuery } from "@/services/public/kajian.service";
import { useI18n } from "@/app/hooks/useI18n";
import { CreateQnABody } from "@/services/public/kajian.service";
import { Ustadz } from "@/types/public/kajian";
import Swal from "sweetalert2"; // Import SweetAlert2

// --- TYPES & TRANSLATIONS ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface FormTranslations {
  formTitle: string;
  formSubtitle: string;
  labelName: string;
  phName: string;
  labelUstadz: string;
  selectUstadz: string;
  loadingUstadz: string;
  labelQuestion: string;
  phQuestion: string;
  labelVisibility: string;
  optionPublic: string;
  optionPrivate: string;
  submitBtn: string;
  submitting: string;
  fillAll: string;
  alertWarningTitle: string; // New translation key
}

const FORM_TEXT: Record<LocaleCode, FormTranslations> = {
  id: {
    formTitle: "Ajukan Pertanyaan",
    formSubtitle: "Sampaikan pertanyaan Anda kepada ustadz yang berkompeten",
    labelName: "Nama Lengkap (Samaran)",
    phName: "Masukkan nama Anda",
    labelUstadz: "Pilih Ustadz",
    selectUstadz: "Pilih Ustadz...",
    loadingUstadz: "Memuat daftar ustadz...",
    labelQuestion: "Pertanyaan Detail",
    phQuestion: "Tuliskan pertanyaan Anda secara detail dan jelas...",
    labelVisibility: "Visibilitas Pertanyaan",
    optionPublic: "Publik (Dapat dilihat semua orang)",
    optionPrivate: "Privat (Hanya dilihat Anda dan Ustadz)",
    submitBtn: "Kirim Pertanyaan",
    submitting: "Mengirim...",
    fillAll: "Mohon lengkapi semua field yang diperlukan",
    alertWarningTitle: "Perhatian",
  },
  en: {
    formTitle: "Ask a Question",
    formSubtitle: "Submit your question to a competent scholar",
    labelName: "Full Name (Pseudonym)",
    phName: "Enter your name",
    labelUstadz: "Select Scholar",
    selectUstadz: "Select Scholar...",
    loadingUstadz: "Loading scholars...",
    labelQuestion: "Detailed Question",
    phQuestion: "Write your question in detail...",
    labelVisibility: "Question Visibility",
    optionPublic: "Public (Visible to everyone)",
    optionPrivate: "Private (Visible only to you and the scholar)",
    submitBtn: "Submit Question",
    submitting: "Submitting...",
    fillAll: "Please fill in all required fields",
    alertWarningTitle: "Attention",
  },
  ar: {
    formTitle: "اطرح سؤالاً",
    formSubtitle: "قدم سؤالك إلى عالم مختص",
    labelName: "الاسم الكامل (مستعار)",
    phName: "أدخل اسمك",
    labelUstadz: "اختر الأستاذ",
    selectUstadz: "اختر الأستاذ...",
    loadingUstadz: "جار تحميل الأساتذة...",
    labelQuestion: "سؤال مفصل",
    phQuestion: "اكتب سؤالك بالتفصيل...",
    labelVisibility: "رؤية السؤال",
    optionPublic: "عام (مرئي للجميع)",
    optionPrivate: "خاص (مرئي لك وللأستاذ فقط)",
    submitBtn: "إرسال السؤال",
    submitting: "جار الإرسال...",
    fillAll: "يرجى ملء جميع الحقول المطلوبة",
    alertWarningTitle: "تنبيه",
  },
  fr: {
    formTitle: "Poser une Question",
    formSubtitle: "Soumettez votre question à un érudit compétent",
    labelName: "Nom Complet (Pseudonyme)",
    phName: "Entrez votre nom",
    labelUstadz: "Sélectionner un Oustaz",
    selectUstadz: "Sélectionner...",
    loadingUstadz: "Chargement...",
    labelQuestion: "Question Détaillée",
    phQuestion: "Écrivez votre question en détail...",
    labelVisibility: "Visibilité",
    optionPublic: "Public (Visible par tous)",
    optionPrivate: "Privé (Visible uniquement par vous et l'oustaz)",
    submitBtn: "Envoyer",
    submitting: "Envoi...",
    fillAll: "Veuillez remplir tous les champs",
    alertWarningTitle: "Attention",
  },
  kr: {
    formTitle: "질문하기",
    formSubtitle: "유능한 학자에게 질문 제출",
    labelName: "성명 (가명)",
    phName: "이름 입력",
    labelUstadz: "학자 선택",
    selectUstadz: "선택...",
    loadingUstadz: "학자 목록 로딩 중...",
    labelQuestion: "상세 질문",
    phQuestion: "질문을 상세히 작성하세요...",
    labelVisibility: "공개 여부",
    optionPublic: "공개 (모두에게 보임)",
    optionPrivate: "비공개 (본인과 학자에게만 보임)",
    submitBtn: "질문 제출",
    submitting: "제출 중...",
    fillAll: "모든 필수 항목을 입력해주세요",
    alertWarningTitle: "주의",
  },
  jp: {
    formTitle: "質問する",
    formSubtitle: "有能な学者に質問を提出",
    labelName: "氏名 (仮名)",
    phName: "名前を入力",
    labelUstadz: "学者を選択",
    selectUstadz: "選択...",
    loadingUstadz: "学者リストを読み込み中...",
    labelQuestion: "詳細な質問",
    phQuestion: "質問を詳しく書いてください...",
    labelVisibility: "公開設定",
    optionPublic: "公開 (全員に表示)",
    optionPrivate: "非公開 (あなたと学者のみ)",
    submitBtn: "質問を送信",
    submitting: "送信中...",
    fillAll: "すべての必須項目を入力してください",
    alertWarningTitle: "注意",
  },
};

interface QuestionFormProps {
  onSubmit?: (data: CreateQnABody) => void;
}

export default function QuestionForm({ onSubmit }: QuestionFormProps) {
  const { locale } = useI18n();
  const safeLocale = (
    FORM_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = FORM_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const [formData, setFormData] = useState<CreateQnABody>({
    ustadz_id: 0,
    name: "",
    question: "",
    is_public: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: ustadzList, isLoading: isLoadingUstadz } =
    useGetUstadzListQuery({
      paginate: 100,
    });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "ustadz_id" ? Number(value) : value,
    }));
  };

  const handleVisibilityChange = (isPublic: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_public: isPublic,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.question || !formData.ustadz_id) {
      // IMPLEMENTASI SWEETALERT
      Swal.fire({
        icon: "warning",
        title: t.alertWarningTitle,
        text: t.fillAll,
        confirmButtonColor: "#0d9488", // Warna teal/awqaf
        confirmButtonText: "OK",
        customClass: {
          popup: "font-comfortaa", // Menyesuaikan font
        },
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSubmit?.(formData);
    setIsSubmitting(false);
  };

  const ustadzArray =
    ustadzList && "data" in ustadzList && Array.isArray(ustadzList.data)
      ? ustadzList.data
      : [];

  return (
    <Card className="border-awqaf-border-light" dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-awqaf-primary font-comfortaa">
          <MessageSquare className={`w-5 h-5 ${isRtl ? "ml-2" : "mr-2"}`} />
          {t.formTitle}
        </CardTitle>
        <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
          {t.formSubtitle}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ustadz Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground font-comfortaa flex items-center gap-2">
              <User className="w-4 h-4" />
              {t.labelUstadz}
            </label>
            <select
              name="ustadz_id"
              value={formData.ustadz_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-awqaf-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-awqaf-primary bg-background font-comfortaa"
              required
              disabled={isLoadingUstadz}
            >
              <option value="0">
                {isLoadingUstadz ? t.loadingUstadz : t.selectUstadz}
              </option>
              {ustadzArray.map((ustadz: Ustadz) => (
                <option key={ustadz.id} value={ustadz.id}>
                  {ustadz.name}
                </option>
              ))}
            </select>
          </div>

          {/* User Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground font-comfortaa flex items-center gap-2">
              <User className="w-4 h-4" />
              {t.labelName}
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t.phName}
              className="font-comfortaa"
              required
            />
          </div>

          {/* Visibility Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground font-comfortaa">
              {t.labelVisibility}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleVisibilityChange(true)}
                className={`p-3 rounded-lg border text-sm font-comfortaa flex items-center justify-center gap-2 transition-all ${
                  formData.is_public
                    ? "border-awqaf-primary bg-awqaf-primary/10 text-awqaf-primary"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <Globe className="w-4 h-4" />
                {t.optionPublic}
              </button>
              <button
                type="button"
                onClick={() => handleVisibilityChange(false)}
                className={`p-3 rounded-lg border text-sm font-comfortaa flex items-center justify-center gap-2 transition-all ${
                  !formData.is_public
                    ? "border-awqaf-primary bg-awqaf-primary/10 text-awqaf-primary"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <Lock className="w-4 h-4" />
                {t.optionPrivate}
              </button>
            </div>
          </div>

          {/* Question */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground font-comfortaa">
              {t.labelQuestion}
            </label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              placeholder={t.phQuestion}
              className="w-full min-h-[120px] px-3 py-2 border border-awqaf-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-awqaf-primary focus:border-transparent font-comfortaa resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.submitting}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send
                  className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"} ${isRtl ? "rotate-180" : ""}`}
                />
                {t.submitBtn}
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}