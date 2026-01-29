export type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface StaticContent {
  benefits: string;
  dalil: string;
}

// Data mentah (Hanya Bahasa Indonesia)
const RAW_DATA = [
  {
    id: 1,
    dalil:
      '"Katakanlah: Serulah Allah atau serulah Ar-Rahman." (QS. Al-Isra: 110)',
    benefit:
      "Menumbuhkan kasih sayang, membuka pintu rezeki, dan mendapat rahmat Allah.",
  },
  {
    id: 2,
    dalil:
      '"Sesungguhnya Allah Maha Penyayang kepada orang-orang yang beriman." (QS. Al-Ahzab: 43)',
    benefit:
      "Mendapat kasih sayang khusus, ketenangan hati, dan dicintai sesama.",
  },
  {
    id: 3,
    dalil: '"Maka Maha Tinggi Allah, Raja Yang Sebenarnya." (QS. Thaha: 114)',
    benefit: "Diberi wibawa, kemuliaan, dan kecukupan dalam memimpin.",
  },
  {
    id: 4,
    dalil: '"Raja, Yang Maha Suci, Yang Maha Sejahtera." (QS. Al-Hasyr: 23)',
    benefit: "Membersihkan hati dari sifat tercela dan menjernihkan pikiran.",
  },
  {
    id: 5,
    dalil: '"Dia-lah Allah... Yang Maha Sejahtera." (QS. Al-Hasyr: 23)',
    benefit: "Diberi keselamatan dari bahaya, penyakit, dan bencana.",
  },
  {
    id: 6,
    dalil: '"Yang Maha Memberi Keamanan." (QS. Al-Hasyr: 23)',
    benefit: "Diberi rasa aman dari ketakutan dan perlindungan dari gangguan.",
  },
  {
    id: 7,
    dalil: '"Yang Maha Memelihara." (QS. Al-Hasyr: 23)',
    benefit:
      "Terpelihara dari hal buruk dan senantiasa dalam pengawasan Allah.",
  },
  {
    id: 8,
    dalil:
      '"Dan Allah Maha Perkasa lagi Maha Bijaksana." (QS. Al-Baqarah: 220)',
    benefit:
      "Diberi kekuatan, kemuliaan, dan tidak mudah direndahkan orang lain.",
  },
  {
    id: 9,
    dalil: '"Yang Maha Memaksa." (QS. Al-Hasyr: 23)',
    benefit: "Mampu mengatasi kesulitan dan memperbaiki keadaan yang buruk.",
  },
  {
    id: 10,
    dalil: '"Yang Mempunyai Kebesaran." (QS. Al-Hasyr: 23)',
    benefit: "Diberi kewibawaan dan dijauhkan dari kehinaan.",
  },
  {
    id: 11,
    dalil: '"Dialah Allah Yang Menciptakan." (QS. Al-Hasyr: 24)',
    benefit:
      "Meningkatkan kreativitas dan dimudahkan dalam menyelesaikan pekerjaan.",
  },
  {
    id: 12,
    dalil: '"Yang Mengadakan." (QS. Al-Hasyr: 24)',
    benefit: "Dimudahkan dalam merencanakan dan memulai sesuatu yang baru.",
  },
  {
    id: 13,
    dalil: '"Yang Membentuk Rupa." (QS. Al-Hasyr: 24)',
    benefit: "Diberi keindahan akhlak dan rupa, serta keturunan yang baik.",
  },
  {
    id: 14,
    dalil:
      '"Dan sesungguhnya Aku Maha Pengampun bagi orang yang bertaubat." (QS. Thaha: 82)',
    benefit: "Diampuni dosa-dosanya dan ditutupi aibnya.",
  },
  {
    id: 15,
    dalil: '"Dialah Tuhan Yang Maha Esa lagi Maha Memaksa." (QS. Ar-Ra\'d: 16)',
    benefit: "Menundukkan hawa nafsu dan musuh-musuh yang zalim.",
  },
  {
    id: 16,
    dalil: '"Engkaulah Yang Maha Pemberi." (QS. Ali Imran: 8)',
    benefit: "Dilimpahkan karunia, rezeki, dan dikabulkan hajatnya.",
  },
  {
    id: 17,
    dalil:
      '"Sesungguhnya Allah Dialah Maha Pemberi rezeki." (QS. Adz-Dzariyat: 58)',
    benefit: "Dilancarkan rezekinya dan dicukupkan kebutuhannya.",
  },
  {
    id: 18,
    dalil:
      '"Dia-lah Maha Pemberi Keputusan lagi Maha Mengetahui." (QS. Saba: 26)',
    benefit: "Dibukakan pintu kebaikan, jodoh, dan solusi masalah.",
  },
  {
    id: 19,
    dalil: '"Dan Dia Maha Mengetahui segala sesuatu." (QS. Al-Baqarah: 29)',
    benefit: "Diberi ilmu yang bermanfaat dan kemudahan dalam belajar.",
  },
  {
    id: 20,
    dalil: '"Allah menyempitkan dan melapangkan rezeki." (QS. Al-Baqarah: 245)',
    benefit: "Terhindar dari ancaman musuh dan kelaparan.",
  },
  {
    id: 21,
    dalil: '"Allah menyempitkan dan melapangkan rezeki." (QS. Al-Baqarah: 245)',
    benefit: "Dilapangkan dadanya dan dimudahkan rezekinya.",
  },
  {
    id: 22,
    dalil:
      '"Maka apakah kamu merasa aman dari Allah yang di langit?" (QS. Al-Mulk: 16)',
    benefit: "Terlindung dari kejahatan orang yang zalim dan sombong.",
  },
  {
    id: 23,
    dalil:
      '"Allah meninggikan orang-orang yang beriman di antaramu." (QS. Al-Mujadilah: 11)',
    benefit: "Diangkat derajatnya di dunia dan akhirat.",
  },
  {
    id: 24,
    dalil: '"Engkau muliakan siapa yang Engkau kehendaki." (QS. Ali Imran: 26)',
    benefit: "Diberi kemuliaan dan kehormatan di mata manusia.",
  },
  {
    id: 25,
    dalil: '"Engkau hinakan siapa yang Engkau kehendaki." (QS. Ali Imran: 26)',
    benefit: "Terlindung dari fitnah dan kehinaan.",
  },
  {
    id: 26,
    dalil:
      '"Sesungguhnya Allah Maha Mendengar lagi Maha Mengetahui." (QS. Al-Baqarah: 181)',
    benefit: "Doanya didengar dan dikabulkan oleh Allah.",
  },
  {
    id: 27,
    dalil:
      '"Sesungguhnya Allah Maha Melihat apa yang kamu kerjakan." (QS. Al-Hujurat: 18)',
    benefit: "Diberi ketajaman mata hati dan kewaspadaan.",
  },
  {
    id: 28,
    dalil:
      '"Maka patutkah aku mencari hakim selain Allah?" (QS. Al-An\'am: 114)',
    benefit: "Diberi kebijaksanaan dalam mengambil keputusan.",
  },
  {
    id: 29,
    dalil:
      '"Dan telah sempurnalah kalimat Tuhanmu sebagai kalimat yang benar dan adil." (QS. Al-An\'am: 115)',
    benefit: "Diberi sifat adil dan amanah.",
  },
  {
    id: 30,
    dalil: '"Allah Maha Lembut terhadap hamba-hamba-Nya." (QS. Asy-Syura: 19)',
    benefit: "Dilembutkan hatinya dan dimudahkan urusannya.",
  },
  {
    id: 31,
    dalil:
      '"Sesungguhnya Allah Maha Mengetahui lagi Maha Teliti." (QS. Al-Hujurat: 13)',
    benefit: "Terhindar dari tipu daya dan hal-hal yang buruk.",
  },
  {
    id: 32,
    dalil:
      '"Dan Allah Maha Pengampun lagi Maha Penyantun." (QS. Al-Baqarah: 235)',
    benefit: "Diberi kesabaran dan ketenangan emosi.",
  },
  {
    id: 33,
    dalil: '"Dan Dia-lah Yang Maha Tinggi lagi Maha Agung." (QS. Asy-Syura: 4)',
    benefit: "Dihormati dan disegani oleh orang lain.",
  },
  {
    id: 34,
    dalil:
      '"Sesungguhnya Allah adalah Maha Pemaaf lagi Maha Pengampun." (QS. Al-Hajj: 60)',
    benefit: "Diampuni dosa dan diselamatkan dari kesedihan.",
  },
  {
    id: 35,
    dalil:
      '"Dan Allah Maha Mensyukuri lagi Maha Penyantun." (QS. At-Taghabun: 17)',
    benefit: "Diberi keberkahan dalam nikmat yang sedikit.",
  },
  {
    id: 36,
    dalil:
      '"Dan Dia-lah Yang Maha Tinggi lagi Maha Besar." (QS. Al-Baqarah: 255)',
    benefit: "Ditinggikan derajat dan cita-citanya.",
  },
  {
    id: 37,
    dalil:
      '"Sesungguhnya Allah Dialah Yang Maha Tinggi lagi Maha Besar." (QS. Al-Hajj: 62)',
    benefit: "Diberi kebesaran jiwa dan kewibawaan.",
  },
  {
    id: 38,
    dalil:
      '"Sesungguhnya Tuhanku adalah Maha Memelihara segala sesuatu." (QS. Hud: 57)',
    benefit: "Terlindung dari segala musibah dan gangguan.",
  },
  {
    id: 39,
    dalil: '"Dan Allah Maha Kuasa atas segala sesuatu." (QS. An-Nisa: 85)',
    benefit: "Dicukupkan segala kebutuhan dan logistiknya.",
  },
  {
    id: 40,
    dalil: '"Cukuplah Allah sebagai Pembuat perhitungan." (QS. An-Nisa: 6)',
    benefit: "Diberi ketenangan saat menghadapi hisab atau ujian.",
  },
  {
    id: 41,
    dalil:
      '"Maka Maha Suci nama Tuhanmu yang mempunyai Kebesaran dan Kemuliaan." (QS. Ar-Rahman: 78)',
    benefit: "Diberi kemuliaan budi pekerti.",
  },
  {
    id: 42,
    dalil:
      '"Hai manusia, apakah yang telah memperdayakan kamu terhadap Tuhanmu Yang Maha Pemurah?" (QS. Al-Infitar: 6)',
    benefit: "Diberi kemuliaan hidup dan rezeki yang mulia.",
  },
  {
    id: 43,
    dalil: '"Sesungguhnya Allah selalu mengawasi kamu." (QS. An-Nisa: 1)',
    benefit: "Selalu merasa diawasi Allah sehingga terjaga dari maksiat.",
  },
  {
    id: 44,
    dalil:
      '"Sesungguhnya Tuhanku Maha Dekat lagi Maha Mengabulkan." (QS. Hud: 61)',
    benefit: "Dikabulkan doa-doanya dengan cepat.",
  },
  {
    id: 45,
    dalil: '"Dan Allah Maha Luas lagi Maha Mengetahui." (QS. Al-Baqarah: 247)',
    benefit: "Dilapangkan rezeki, ilmu, dan kesabaran.",
  },
  {
    id: 46,
    dalil:
      '"Dan Dialah Yang Maha Bijaksana lagi Maha Mengetahui." (QS. Al-An\'am: 18)',
    benefit: "Diberi kebijaksanaan dan pemahaman agama.",
  },
  {
    id: 47,
    dalil:
      '"Dan Dia-lah Yang Maha Pengampun lagi Maha Pengasih." (QS. Al-Buruj: 14)',
    benefit: "Dicintai oleh Allah dan sesama manusia.",
  },
  {
    id: 48,
    dalil: '"Pemilik Arsy yang Maha Mulia." (QS. Al-Buruj: 15)',
    benefit: "Diberi kemuliaan dan kehormatan.",
  },
  {
    id: 49,
    dalil: '"Allah membangkitkan semua orang di dalam kubur." (QS. Al-Hajj: 7)',
    benefit: "Dibangkitkan semangat beribadah dan bekerja.",
  },
  {
    id: 50,
    dalil: '"Dan Allah Maha Menyaksikan segala sesuatu." (QS. Al-Mujadilah: 6)',
    benefit: "Diberi kesadaran akan pengawasan Allah.",
  },
  {
    id: 51,
    dalil:
      '"Maka Maha Tinggi Allah, Raja Yang Sebenarnya (Haq)." (QS. Al-Mu\'minun: 116)',
    benefit: "Diteguhkan dalam kebenaran dan iman.",
  },
  {
    id: 52,
    dalil:
      '"Cukuplah Allah menjadi Penolong kami dan Allah adalah sebaik-baik Pelindung." (QS. Ali Imran: 173)',
    benefit: "Terlindung dari segala bencana dan urusan diselesaikan Allah.",
  },
  {
    id: 53,
    dalil:
      '"Sesungguhnya Allah Maha Kuat lagi Maha Perkasa." (QS. Al-Hajj: 40)',
    benefit: "Diberi kekuatan fisik dan mental menghadapi musuh.",
  },
  {
    id: 54,
    dalil:
      '"Sesungguhnya Allah Dialah Maha Pemberi rezeki Yang Mempunyai Kekuatan lagi Sangat Kokoh." (QS. Adz-Dzariyat: 58)',
    benefit: "Diteguhkan pendirian dan iman.",
  },
  {
    id: 55,
    dalil: '"Allah Pelindung orang-orang yang beriman." (QS. Al-Baqarah: 257)',
    benefit: "Mendapat perlindungan khusus dari Allah.",
  },
  {
    id: 56,
    dalil:
      '"Dan ketahuilah bahwa Allah Maha Kaya lagi Maha Terpuji." (QS. Al-Baqarah: 267)',
    benefit: "Menjadi pribadi yang terpuji dan disukai banyak orang.",
  },
  {
    id: 57,
    dalil:
      '"Sesungguhnya Allah memperhitungkan segala sesuatu." (QS. An-Nisa: 86)',
    benefit: "Dimudahkan dalam hisab di hari kiamat.",
  },
  {
    id: 58,
    dalil: '"Allah memulai penciptaan kemudian mengulanginya." (QS. Yunus: 4)',
    benefit: "Dimudahkan dalam memulai setiap urusan.",
  },
  {
    id: 59,
    dalil:
      '"Sebagaimana Kami telah memulai penciptaan pertama, begitulah Kami akan mengulanginya." (QS. Al-Anbiya: 104)',
    benefit: "Mengembalikan barang yang hilang atau orang yang minggat.",
  },
  {
    id: 60,
    dalil:
      '"Sesungguhnya Dialah yang menghidupkan dan mematikan." (QS. Al-Buruj: 12)',
    benefit: "Dihidupkan hatinya dengan cahaya iman.",
  },
  {
    id: 61,
    dalil: '"Tuhan Yang menghidupkan dan mematikan." (QS. Al-A\'raf: 158)',
    benefit: "Mematikan hawa nafsu yang buruk.",
  },
  {
    id: 62,
    dalil:
      '"Allah, tidak ada Tuhan selain Dia. Yang Maha Hidup." (QS. Al-Baqarah: 255)',
    benefit: "Diberi umur panjang yang berkah dan kesehatan.",
  },
  {
    id: 63,
    dalil: '"Yang terus menerus mengurus makhluk-Nya." (QS. Al-Baqarah: 255)',
    benefit: "Diberi kemandirian dan tidak bergantung pada orang lain.",
  },
  {
    id: 64,
    dalil:
      '"Dan Dia mendapatimu sebagai seorang yang bingung, lalu Dia memberikan petunjuk." (QS. Ad-Dhuha: 7)',
    benefit: "Menemukan barang yang hilang dan kekayaan batin.",
  },
  {
    id: 65,
    dalil: '"Pemilik Arsy yang Maha Mulia." (QS. Al-Buruj: 15)',
    benefit: "Diberi kemuliaan dan kebesaran jiwa.",
  },
  {
    id: 66,
    dalil:
      '"Katakanlah: Allah adalah Pencipta segala sesuatu dan Dialah Tuhan Yang Maha Esa." (QS. Ar-Ra\'d: 16)',
    benefit: "Dijauhkan dari rasa takut dan gelisah.",
  },
  {
    id: 67,
    dalil: '"Katakanlah: Dialah Allah, Yang Maha Esa." (QS. Al-Ikhlas: 1)',
    benefit: "Diberi ketauhidan yang murni dan istiqomah.",
  },
  {
    id: 68,
    dalil:
      '"Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu." (QS. Al-Ikhlas: 2)',
    benefit: "Dicukupkan segala kebutuhan tanpa bergantung pada makhluk.",
  },
  {
    id: 69,
    dalil:
      '"Sesungguhnya Allah Maha Kuasa atas segala sesuatu." (QS. Al-Baqarah: 20)',
    benefit: "Diberi kemampuan melaksanakan keinginan yang baik.",
  },
  {
    id: 70,
    dalil:
      '"Di tempat yang disenangi di sisi Tuhan Yang Maha Berkuasa." (QS. Al-Qamar: 55)',
    benefit: "Diberi kekuasaan untuk mengendalikan diri.",
  },
  {
    id: 71,
    dalil:
      '"Maka Allah menyesatkan siapa yang Dia kehendaki." (QS. Ibrahim: 4)',
    benefit: "Didahulukan dalam segala kebaikan dan kesuksesan.",
  },
  {
    id: 72,
    dalil:
      '"Dan sesungguhnya Kami mengetahui orang-orang yang terdahulu... dan yang terkemudian." (QS. Al-Hijr: 24)',
    benefit: "Diberi umur panjang dalam ketaatan.",
  },
  {
    id: 73,
    dalil: '"Dialah Yang Awal dan Yang Akhir." (QS. Al-Hadid: 3)',
    benefit: "Menjadi yang terdepan dalam kebaikan.",
  },
  {
    id: 74,
    dalil: '"Dialah Yang Awal dan Yang Akhir." (QS. Al-Hadid: 3)',
    benefit: "Diberi akhir hidup yang baik (Husnul Khotimah).",
  },
  {
    id: 75,
    dalil: '"Yang Zahir dan Yang Batin." (QS. Al-Hadid: 3)',
    benefit: "Dibukakan rahasia ilmu dan kebenaran.",
  },
  {
    id: 76,
    dalil: '"Yang Zahir dan Yang Batin." (QS. Al-Hadid: 3)',
    benefit: "Dibersihkan batinnya dari kotoran hati.",
  },
  {
    id: 77,
    dalil:
      '"Dan tidak ada bagi mereka pelindung selain Allah." (QS. Ar-Ra\'d: 11)',
    benefit: "Terlindung dari marabahaya dan bencana.",
  },
  {
    id: 78,
    dalil: '"Maha Besar dan Maha Tinggi." (QS. Ar-Ra\'d: 9)',
    benefit: "Ditinggikan derajatnya di sisi Allah.",
  },
  {
    id: 79,
    dalil:
      '"Sesungguhnya Dia-lah Yang Maha Baik lagi Maha Penyayang." (QS. At-Tur: 28)',
    benefit: "Dimudahkan segala urusan dan diberi rezeki yang berkah.",
  },
  {
    id: 80,
    dalil:
      '"Sesungguhnya Allah Maha Penerima taubat lagi Maha Penyayang." (QS. Al-Hujurat: 12)',
    benefit: "Diterima taubatnya dan dijauhkan dari maksiat.",
  },
  {
    id: 81,
    dalil:
      '"Sesungguhnya Kami akan memberikan pembalasan kepada orang-orang yang berdosa." (QS. As-Sajdah: 22)',
    benefit: "Diselamatkan dari orang yang zalim.",
  },
  {
    id: 82,
    dalil:
      '"Sesungguhnya Allah Maha Pemaaf lagi Maha Pengampun." (QS. Al-Mujadilah: 2)',
    benefit: "Diampuni kesalahan dan dimaafkan kekhilafannya.",
  },
  {
    id: 83,
    dalil:
      '"Dan Allah Maha Penyantun kepada hamba-hamba-Nya." (QS. Al-Baqarah: 207)',
    benefit: "Diberi kasih sayang dan belas kasihan.",
  },
  {
    id: 84,
    dalil: '"Wahai Tuhan Yang mempunyai kerajaan." (QS. Ali Imran: 26)',
    benefit: "Diberi kekayaan dan kekuasaan yang berkah.",
  },
  {
    id: 85,
    dalil:
      '"Dan tetap kekal Wajah Tuhanmu yang mempunyai Kebesaran dan Kemuliaan." (QS. Ar-Rahman: 27)',
    benefit: "Diberi kebesaran dan kemuliaan hidup.",
  },
  {
    id: 86,
    dalil:
      '"Sesungguhnya Allah menyukai orang-orang yang adil." (QS. Al-Mumtahanah: 8)',
    benefit: "Diberi sifat adil dan bijaksana.",
  },
  {
    id: 87,
    dalil:
      '"Tuhan kami, sesungguhnya Engkau mengumpulkan manusia pada hari yang tidak ada keraguan padanya." (QS. Ali Imran: 9)',
    benefit: "Dikumpulkan kembali dengan keluarga yang hilang atau terpisah.",
  },
  {
    id: 88,
    dalil:
      '"Dan sesungguhnya Allah, Dialah Yang Maha Kaya lagi Maha Terpuji." (QS. Al-Hajj: 64)',
    benefit: "Diberi kekayaan hati dan materi.",
  },
  {
    id: 89,
    dalil:
      '"Dan bahwasanya Dialah yang memberikan kekayaan dan memberikan kecukupan." (QS. An-Najm: 48)',
    benefit: "Dicukupkan segala kebutuhan hidupnya.",
  },
  {
    id: 90,
    dalil:
      '"Atau siapakah dia yang ini yang memberi kamu rezeki jika Allah menahan rezeki-Nya?" (QS. Al-Mulk: 21)',
    benefit: "Terhindar dari kejahatan dan gangguan.",
  },
  {
    id: 91,
    dalil:
      '"Jika Allah menimpakan suatu kemudharatan kepadamu, maka tidak ada yang dapat menghilangkannya kecuali Dia." (QS. Al-An\'am: 17)',
    benefit: "Diselamatkan dari segala bahaya dan penyakit.",
  },
  {
    id: 92,
    dalil:
      '"Katakanlah: Aku tidak berkuasa menarik kemanfaatan bagi diriku." (QS. Al-A\'raf: 188)',
    benefit: "Diberi manfaat dan keberkahan dalam hidup.",
  },
  {
    id: 93,
    dalil:
      '"Allah (Pemberi) cahaya (kepada) langit dan bumi." (QS. An-Nur: 35)',
    benefit: "Diterangi hati dan pikirannya dengan cahaya iman.",
  },
  {
    id: 94,
    dalil:
      '"Dan sesungguhnya Allah adalah Pemberi petunjuk bagi orang-orang yang beriman." (QS. Al-Hajj: 54)',
    benefit: "Diberi petunjuk ke jalan yang lurus.",
  },
  {
    id: 95,
    dalil: '"Pencipta langit dan bumi." (QS. Al-Baqarah: 117)',
    benefit: "Dimudahkan dalam mewujudkan rencana.",
  },
  {
    id: 96,
    dalil: '"Dan tetap kekal Wajah Tuhanmu." (QS. Ar-Rahman: 27)',
    benefit: "Diberi umur panjang yang bermanfaat dan amal yang kekal.",
  },
  {
    id: 97,
    dalil: '"Dan Engkau adalah Waris Yang Paling Baik." (QS. Al-Anbiya: 89)',
    benefit: "Diberi keturunan yang sholeh dan harta yang berkah.",
  },
  {
    id: 98,
    dalil:
      '"Dan sesungguhnya mereka telah mengikuti jalan yang lurus." (QS. Hud: 97)',
    benefit: "Diberi kecerdasan dan ketepatan dalam bertindak.",
  },
  {
    id: 99,
    dalil:
      '"Dan bersabarlah kamu, sesungguhnya Allah beserta orang-orang yang sabar." (QS. Al-Anfal: 46)',
    benefit: "Diberi kesabaran yang luas dalam menghadapi ujian.",
  },
];

// Kategori & Template Terjemahan Cerdas
const TOPIC_TEMPLATES: Record<
  string,
  Record<Exclude<LocaleCode, "id">, string>
> = {
  // Rezeki / Kekayaan / Cukup
  wealth: {
    en: "Reciting this brings sustenance, wealth, and sufficiency in life.",
    ar: "الإكثار من ذكره يجلب الرزق والغنى والكفاية.",
    fr: "Réciter ceci apporte subsistance, richesse et suffisance.",
    kr: "이 이름을 암송하면 생계, 부, 풍요로움을 얻습니다.",
    jp: "これを唱えることで、糧、富、充足がもたらされます。",
  },
  // Perlindungan / Keamanan / Selamat
  protection: {
    en: "Provides protection from harm, enemies, and brings safety.",
    ar: "يمنح الحماية من الأذى والأعداء ويجلب الأمان.",
    fr: "Offre une protection contre le mal, les ennemis et apporte la sécurité.",
    kr: "해로움과 적으로부터 보호하고 안전을 가져옵니다.",
    jp: "害悪や敵からの保護と安全をもたらします。",
  },
  // Pengampunan / Dosa / Taubat
  forgiveness: {
    en: "Facilitates forgiveness of sins and acceptance of repentance.",
    ar: "ييسر مغفرة الذنوب وقبول التوبة.",
    fr: "Facilite le pardon des péchés et l'acceptation du repentir.",
    kr: "죄의 용서와 회개의 수용을 돕습니다.",
    jp: "罪の赦しと悔い改めの受容を助けます。",
  },
  // Ilmu / Hikmah / Pintar
  knowledge: {
    en: "Increases knowledge, wisdom, and understanding.",
    ar: "يزيد العلم والحكمة والفهم.",
    fr: "Augmente la connaissance, la sagesse et la compréhension.",
    kr: "지식, 지혜, 이해력을 증진시킵니다.",
    jp: "知識、知恵、理解力を高めます。",
  },
  // Kasih Sayang / Cinta / Lembut
  love: {
    en: "Fills the heart with compassion, love, and gentleness.",
    ar: "يملأ القلب بالرحمة والمودة واللين.",
    fr: "Remplit le cœur de compassion, d'amour et de douceur.",
    kr: "마음에 연민, 사랑, 온유함을 채웁니다.",
    jp: "心に慈悲、愛、優しさを満たします。",
  },
  // Keagungan / Wibawa / Derajat
  dignity: {
    en: "Grants dignity, honor, and elevates status.",
    ar: "يمنح الهيبة والشرف ويرفع المكانة.",
    fr: "Accorde dignité, honneur et élève le statut.",
    kr: "존엄성, 명예를 부여하고 지위를 높입니다.",
    jp: "尊厳、名誉を与え、地位を高めます。",
  },
  // Default General
  general: {
    en: "Reciting this name brings blessings related to its meaning.",
    ar: "ذكر هذا الاسم يجلب البركة المتعلقة بمعناه.",
    fr: "Réciter ce nom apporte des bénédictions liées à sa signification.",
    kr: "이 이름을 암송하면 그 의미와 관련된 축복을 받습니다.",
    jp: "この御名を唱えることで、その意味に関連する祝福がもたらされます。",
  },
};

// Fungsi Deteksi Topik Sederhana
const detectTopic = (text: string): string => {
  const lower = text.toLowerCase();
  if (
    lower.includes("rezeki") ||
    lower.includes("kaya") ||
    lower.includes("cukup") ||
    lower.includes("karunia")
  )
    return "wealth";
  if (
    lower.includes("lindung") ||
    lower.includes("selamat") ||
    lower.includes("jaga") ||
    lower.includes("aman") ||
    lower.includes("bahaya")
  )
    return "protection";
  if (
    lower.includes("ampun") ||
    lower.includes("dosa") ||
    lower.includes("taubat") ||
    lower.includes("maaf")
  )
    return "forgiveness";
  if (
    lower.includes("ilmu") ||
    lower.includes("paham") ||
    lower.includes("bijaksana") ||
    lower.includes("cerdas")
  )
    return "knowledge";
  if (
    lower.includes("kasih") ||
    lower.includes("sayang") ||
    lower.includes("cinta") ||
    lower.includes("lembut")
  )
    return "love";
  if (
    lower.includes("wibawa") ||
    lower.includes("derajat") ||
    lower.includes("mulia") ||
    lower.includes("agung") ||
    lower.includes("hormat")
  )
    return "dignity";
  return "general";
};

// Generator Data Lengkap
const generateData = () => {
  const result: Record<number, Record<LocaleCode, StaticContent>> = {};

  RAW_DATA.forEach((item) => {
    // Ekstrak referensi surat (misal: QS. Al-Isra: 110)
    const verseRef = item.dalil.match(/\(QS\..+?\)/)?.[0] || "(Quran)";
    const topic = detectTopic(item.benefit);
    const templates = TOPIC_TEMPLATES[topic] || TOPIC_TEMPLATES["general"];

    result[item.id] = {
      id: {
        benefits: item.benefit,
        dalil: item.dalil,
      },
      en: {
        benefits: templates.en,
        dalil: `See Quran translation for context. ${verseRef}`,
      },
      ar: {
        benefits: templates.ar,
        dalil: `انظر إلى الآية القرآنية المقابلة. ${verseRef.replace("QS.", "سورة")}`,
      },
      fr: {
        benefits: templates.fr,
        dalil: `Voir la traduction du Coran pour le contexte. ${verseRef}`,
      },
      kr: {
        benefits: templates.kr,
        dalil: `문맥을 위해 꾸란 번역을 참조하십시오. ${verseRef}`,
      },
      jp: {
        benefits: templates.jp,
        dalil: `文脈についてはコーランの翻訳を参照してください。 ${verseRef}`,
      },
    };
  });

  return result;
};

export const ASMAUL_STATIC_DATA = generateData();

export const getStaticContent = (id: number, locale: string): StaticContent => {
  const data = ASMAUL_STATIC_DATA[id];
  if (!data) return { benefits: "-", dalil: "-" };

  // Type casting untuk aman
  const loc = (locale in data ? locale : "id") as LocaleCode;
  return data[loc] || data.id;
};