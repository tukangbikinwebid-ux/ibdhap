export type AsmaulHusnaCategory = 
  | "keagungan" | "kasih_sayang" | "kekuasaan" | "ilmu" 
  | "keadilan" | "penciptaan" | "pemeliharaan" | "pengampunan" | "keesaan";

export interface AsmaulHusna {
  id: number;
  arabic: string;
  latin: string;
  meaning: string;
  category: AsmaulHusnaCategory;
  explanation: string;
  benefits: string;
  dalil: string;
}

export const categoryLabels: Record<AsmaulHusnaCategory, string> = {
  keagungan: "Keagungan",
  kasih_sayang: "Kasih Sayang",
  kekuasaan: "Kekuasaan",
  ilmu: "Ilmu",
  keadilan: "Keadilan",
  penciptaan: "Penciptaan",
  pemeliharaan: "Pemeliharaan",
  pengampunan: "Pengampunan",
  keesaan: "Keesaan",
};

export const categoryColors: Record<AsmaulHusnaCategory, string> = {
  keagungan: "bg-purple-100 text-purple-700 border-purple-200",
  kasih_sayang: "bg-pink-100 text-pink-700 border-pink-200",
  kekuasaan: "bg-red-100 text-red-700 border-red-200",
  ilmu: "bg-blue-100 text-blue-700 border-blue-200",
  keadilan: "bg-amber-100 text-amber-700 border-amber-200",
  penciptaan: "bg-green-100 text-green-700 border-green-200",
  pemeliharaan: "bg-teal-100 text-teal-700 border-teal-200",
  pengampunan: "bg-indigo-100 text-indigo-700 border-indigo-200",
  keesaan: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export const asmaulHusnaData: AsmaulHusna[] = [
  {
    id: 1, arabic: "الرَّحْمَنُ", latin: "Ar-Rahman", meaning: "Yang Maha Pengasih",
    category: "kasih_sayang",
    explanation: "Ar-Rahman menunjukkan kasih sayang Allah yang meliputi seluruh makhluk-Nya tanpa terkecuali, baik mukmin maupun kafir, di dunia ini. Nama ini khusus milik Allah dan tidak boleh disandangkan kepada makhluk. Kasih sayang-Nya bersifat umum mencakup pemberian rezeki, kesehatan, dan nikmat duniawi kepada semua makhluk.",
    benefits: "Memperbanyak menyebut nama ini akan menumbuhkan rasa kasih sayang dalam hati, membuka pintu rezeki, dan mendapat rahmat Allah di dunia dan akhirat.",
    dalil: "\"Katakanlah: Serulah Allah atau serulah Ar-Rahman. Dengan nama yang mana saja kamu seru, Dia mempunyai nama-nama yang terbaik.\" (QS. Al-Isra: 110)"
  },
  {
    id: 2, arabic: "الرَّحِيمُ", latin: "Ar-Rahim", meaning: "Yang Maha Penyayang",
    category: "kasih_sayang",
    explanation: "Ar-Rahim adalah kasih sayang Allah yang khusus bagi orang-orang beriman di akhirat kelak. Berbeda dengan Ar-Rahman yang bersifat umum, Ar-Rahim bersifat khusus untuk hamba-hamba yang taat. Di akhirat, hanya orang beriman yang akan merasakan rahmat khusus ini berupa surga dan keridaan Allah.",
    benefits: "Mengamalkan nama ini dengan berdoa dan berdzikir akan mendapat kasih sayang khusus Allah, dilindungi dari azab, dan diberi ketenangan hati.",
    dalil: "\"Dan Dia Maha Penyayang kepada orang-orang yang beriman.\" (QS. Al-Ahzab: 43)"
  },
  {
    id: 3, arabic: "الْمَلِكُ", latin: "Al-Malik", meaning: "Yang Maha Merajai",
    category: "kekuasaan",
    explanation: "Al-Malik berarti Allah adalah Raja yang sesungguhnya, Pemilik kerajaan langit dan bumi. Kekuasaan-Nya mutlak, tidak ada yang bisa menghalangi kehendak-Nya. Berbeda dengan raja dunia yang kekuasaannya terbatas, kekuasaan Allah meliputi seluruh alam semesta tanpa batas waktu dan tempat.",
    benefits: "Memperbanyak dzikir dengan nama ini akan meningkatkan rasa tawakkal, menghilangkan ketergantungan pada makhluk, dan diberi kemuliaan oleh Allah.",
    dalil: "\"Maka Maha Tinggi Allah, Raja Yang Sebenarnya.\" (QS. Thaha: 114)"
  },
  {
    id: 4, arabic: "الْقُدُّوسُ", latin: "Al-Quddus", meaning: "Yang Maha Suci",
    category: "keagungan",
    explanation: "Al-Quddus berarti Allah Maha Suci dari segala kekurangan, kelemahan, dan sifat-sifat yang tidak layak bagi-Nya. Kesucian Allah meliputi zat, sifat, dan perbuatan-Nya. Tidak ada sesuatu pun yang menyerupai-Nya dan Dia bersih dari segala aib.",
    benefits: "Berdzikir dengan nama ini akan membersihkan hati dari sifat tercela, meningkatkan kesucian jiwa, dan mendekatkan diri kepada Allah.",
    dalil: "\"Dia-lah Allah Yang tiada Tuhan selain Dia, Raja, Yang Maha Suci.\" (QS. Al-Hasyr: 23)"
  },
  {
    id: 5, arabic: "السَّلَامُ", latin: "As-Salam", meaning: "Yang Maha Memberi Kesejahteraan",
    category: "kasih_sayang",
    explanation: "As-Salam berarti Allah adalah sumber kedamaian, keselamatan, dan kesejahteraan. Dia yang memberikan keamanan kepada makhluk-Nya dari segala bahaya dan keburukan. Nama ini juga menunjukkan bahwa Allah selamat dari segala kekurangan dan aib.",
    benefits: "Memperbanyak dzikir dengan nama ini akan mendatangkan ketenangan, terhindar dari bahaya, dan mendapat keselamatan dunia akhirat.",
    dalil: "\"Dia-lah Allah Yang tiada Tuhan selain Dia... Yang Maha Sejahtera.\" (QS. Al-Hasyr: 23)"
  },
  {
    id: 6, arabic: "الْمُؤْمِنُ", latin: "Al-Mu'min", meaning: "Yang Maha Memberi Keamanan",
    category: "pemeliharaan",
    explanation: "Al-Mu'min berarti Allah yang membenarkan rasul-rasul-Nya dengan mukjizat, membenarkan orang-orang beriman dengan pahala, dan memberikan keamanan kepada makhluk-Nya. Allah juga yang menepati janji-Nya kepada hamba-hamba-Nya.",
    benefits: "Berdzikir dengan nama ini akan menguatkan iman, mendapat perlindungan dari rasa takut, dan diberi ketenangan dalam menghadapi ujian.",
    dalil: "\"Dia-lah Allah Yang tiada Tuhan selain Dia... Yang Maha Memberi Keamanan.\" (QS. Al-Hasyr: 23)"
  },
  {
    id: 7, arabic: "الْمُهَيْمِنُ", latin: "Al-Muhaymin", meaning: "Yang Maha Memelihara",
    category: "pemeliharaan",
    explanation: "Al-Muhaymin berarti Allah yang mengawasi, menjaga, dan memelihara seluruh makhluk-Nya. Tidak ada sesuatu pun yang luput dari pengawasan-Nya. Dia mengetahui segala yang tersembunyi dan yang tampak, serta menjaga keseimbangan alam semesta.",
    benefits: "Memperbanyak dzikir dengan nama ini akan mendapat perlindungan Allah, dijaga dari musuh, dan diberi pertolongan dalam kesulitan.",
    dalil: "\"Dia-lah Allah Yang tiada Tuhan selain Dia... Yang Maha Memelihara.\" (QS. Al-Hasyr: 23)"
  },
  {
    id: 8, arabic: "الْعَزِيزُ", latin: "Al-Aziz", meaning: "Yang Maha Perkasa",
    category: "kekuasaan",
    explanation: "Al-Aziz berarti Allah Yang Maha Perkasa, tidak ada yang bisa mengalahkan-Nya. Kekuasaan-Nya tidak tertandingi dan kehendak-Nya pasti terlaksana. Dia juga yang memberikan kemuliaan kepada siapa yang dikehendaki-Nya.",
    benefits: "Berdzikir dengan nama ini akan diberi kekuatan menghadapi kesulitan, kemuliaan di mata manusia, dan pertolongan dari Allah.",
    dalil: "\"Dan Allah Maha Perkasa lagi Maha Bijaksana.\" (QS. Al-Baqarah: 220)"
  },
  {
    id: 9, arabic: "الْجَبَّارُ", latin: "Al-Jabbar", meaning: "Yang Maha Memaksa",
    category: "kekuasaan",
    explanation: "Al-Jabbar memiliki beberapa makna: Yang Maha Memaksa segala sesuatu tunduk pada kehendak-Nya, Yang memperbaiki kerusakan, dan Yang Maha Tinggi di atas makhluk-Nya. Allah memaksa makhluk untuk taat pada hukum-hukum-Nya yang mengatur alam semesta.",
    benefits: "Memperbanyak dzikir dengan nama ini akan mendapat kekuatan melawan kezaliman, diperbaiki kondisi yang rusak, dan diberi keteguhan hati.",
    dalil: "\"Dia-lah Allah Yang tiada Tuhan selain Dia... Yang Maha Memaksa.\" (QS. Al-Hasyr: 23)"
  },
  {
    id: 10, arabic: "الْمُتَكَبِّرُ", latin: "Al-Mutakabbir", meaning: "Yang Maha Megah",
    category: "keagungan",
    explanation: "Al-Mutakabbir berarti Allah Yang memiliki kebesaran yang hakiki. Hanya Allah yang berhak memiliki sifat ini karena Dia memang Maha Besar. Sifat sombong tercela bagi makhluk karena mereka sebenarnya lemah, tetapi kebesaran Allah adalah kebenaran.",
    benefits: "Berdzikir dengan nama ini akan menumbuhkan kerendahan hati, menghilangkan kesombongan, dan mengagungkan Allah sebagaimana mestinya.",
    dalil: "\"Dia-lah Allah Yang tiada Tuhan selain Dia... Yang Mempunyai Kebesaran.\" (QS. Al-Hasyr: 23)"
  },
  {
    id: 11, arabic: "الْخَالِقُ", latin: "Al-Khaliq", meaning: "Yang Maha Pencipta",
    category: "penciptaan",
    explanation: "Al-Khaliq berarti Allah yang menciptakan segala sesuatu dari ketiadaan. Dia menentukan ukuran, bentuk, dan rupa segala makhluk sebelum menciptakannya. Penciptaan Allah sempurna tanpa cacat dan penuh hikmah.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menumbuhkan rasa syukur atas penciptaan, meningkatkan kreativitas, dan mendapat ilham dari Allah.",
    dalil: "\"Dialah Allah Yang Menciptakan, Yang Mengadakan, Yang Membentuk Rupa.\" (QS. Al-Hasyr: 24)"
  },
  {
    id: 12, arabic: "الْبَارِئُ", latin: "Al-Bari'", meaning: "Yang Maha Mengadakan",
    category: "penciptaan",
    explanation: "Al-Bari' berarti Allah yang mengadakan makhluk dari ketiadaan dengan sempurna, bebas dari cacat dan kekurangan. Dia mewujudkan apa yang telah ditentukan-Nya dalam ilmu-Nya menjadi kenyataan.",
    benefits: "Berdzikir dengan nama ini akan memudahkan dalam memulai perkara baru, mendapat kemudahan dalam usaha, dan terhindar dari kegagalan.",
    dalil: "\"Dialah Allah Yang Menciptakan, Yang Mengadakan.\" (QS. Al-Hasyr: 24)"
  },
  {
    id: 13, arabic: "الْمُصَوِّرُ", latin: "Al-Musawwir", meaning: "Yang Maha Membentuk Rupa",
    category: "penciptaan",
    explanation: "Al-Musawwir berarti Allah yang membentuk rupa makhluk-Nya dengan berbagai bentuk yang berbeda-beda. Setiap makhluk memiliki ciri khas tersendiri, tidak ada yang sama persis. Ini menunjukkan kesempurnaan ilmu dan kuasa Allah.",
    benefits: "Memperbanyak dzikir dengan nama ini baik untuk ibu hamil agar anaknya diberi rupa yang baik, dan menumbuhkan apresiasi terhadap keindahan ciptaan Allah.",
    dalil: "\"Dialah Allah Yang Menciptakan, Yang Mengadakan, Yang Membentuk Rupa.\" (QS. Al-Hasyr: 24)"
  },
  {
    id: 14, arabic: "الْغَفَّارُ", latin: "Al-Ghaffar", meaning: "Yang Maha Pengampun",
    category: "pengampunan",
    explanation: "Al-Ghaffar berarti Allah yang mengampuni dosa-dosa hamba-Nya berulang-ulang. Bentuk mubalaghah (sangat) menunjukkan ampunan Allah yang sangat luas dan terus-menerus. Selama hamba bertaubat dengan sungguh-sungguh, Allah akan mengampuninya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan mendapat ampunan dosa, terbuka pintu rahmat, dan diberi kelapangan dalam urusan.",
    dalil: "\"Dan sesungguhnya Aku Maha Pengampun bagi orang yang bertaubat.\" (QS. Thaha: 82)"
  },
  {
    id: 15, arabic: "الْقَهَّارُ", latin: "Al-Qahhar", meaning: "Yang Maha Memaksa",
    category: "kekuasaan",
    explanation: "Al-Qahhar berarti Allah yang mengalahkan dan menundukkan segala sesuatu. Tidak ada makhluk yang mampu melawan kekuasaan-Nya. Semua makhluk tunduk di bawah kehendak-Nya, mau tidak mau.",
    benefits: "Berdzikir dengan nama ini akan diberi kekuatan menghadapi musuh, dijauhkan dari kezaliman orang lain, dan ditundukkan hati orang yang keras.",
    dalil: "\"Katakanlah: Allah adalah Pencipta segala sesuatu dan Dia-lah Tuhan Yang Maha Esa lagi Maha Memaksa.\" (QS. Ar-Ra'd: 16)"
  },
  {
    id: 16, arabic: "الْوَهَّابُ", latin: "Al-Wahhab", meaning: "Yang Maha Pemberi Karunia",
    category: "kasih_sayang",
    explanation: "Al-Wahhab berarti Allah yang memberi karunia kepada makhluk-Nya tanpa mengharap imbalan. Pemberian-Nya sangat luas dan tidak terbatas. Dia memberi kepada siapa yang dikehendaki-Nya dengan hikmah yang sempurna.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dibukakan pintu rezeki, diberi keturunan yang baik, dan mendapat karunia yang tidak disangka-sangka.",
    dalil: "\"Ya Tuhan kami, janganlah Engkau condongkan hati kami setelah Engkau beri petunjuk dan karuniakanlah kepada kami rahmat dari sisi-Mu.\" (QS. Ali Imran: 8)"
  },
  {
    id: 17, arabic: "الرَّزَّاقُ", latin: "Ar-Razzaq", meaning: "Yang Maha Pemberi Rezeki",
    category: "pemeliharaan",
    explanation: "Ar-Razzaq berarti Allah yang memberi rezeki kepada seluruh makhluk-Nya. Rezeki meliputi makanan, minuman, ilmu, hidayah, dan segala yang bermanfaat. Allah menjamin rezeki setiap makhluk yang Dia ciptakan.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dibukakan pintu rezeki, dimudahkan dalam mencari nafkah, dan terhindar dari kekurangan.",
    dalil: "\"Sesungguhnya Allah Dialah Maha Pemberi rezeki Yang Mempunyai Kekuatan lagi Sangat Kokoh.\" (QS. Adz-Dzariyat: 58)"
  },
  {
    id: 18, arabic: "الْفَتَّاحُ", latin: "Al-Fattah", meaning: "Yang Maha Pembuka",
    category: "kekuasaan",
    explanation: "Al-Fattah berarti Allah yang membuka segala pintu kebaikan bagi hamba-Nya. Dia membuka pintu rahmat, rezeki, ilmu, dan hidayah. Dia juga yang memutuskan perkara dengan keadilan di antara hamba-hamba-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dibukakan pintu-pintu kebaikan, dimudahkan dalam kesulitan, dan mendapat kemenangan.",
    dalil: "\"Katakanlah: Tuhan kita akan mengumpulkan kita semua, kemudian Dia memberi keputusan antara kita dengan benar. Dan Dia-lah Maha Pemberi Keputusan lagi Maha Mengetahui.\" (QS. Saba: 26)"
  },
  {
    id: 19, arabic: "الْعَلِيمُ", latin: "Al-'Alim", meaning: "Yang Maha Mengetahui",
    category: "ilmu",
    explanation: "Al-'Alim berarti Allah yang ilmu-Nya meliputi segala sesuatu, yang tampak dan yang tersembunyi, yang besar dan yang kecil. Ilmu Allah tidak didahului oleh ketidaktahuan dan tidak diikuti oleh lupa. Dia mengetahui apa yang telah terjadi, yang sedang terjadi, dan yang akan terjadi.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi ilmu yang bermanfaat, dibukakan pintu pemahaman, dan ditambah keberkahan dalam belajar.",
    dalil: "\"Dan Dia Maha Mengetahui segala sesuatu.\" (QS. Al-Baqarah: 29)"
  },
  {
    id: 20, arabic: "الْقَابِضُ", latin: "Al-Qabid", meaning: "Yang Maha Menyempitkan",
    category: "kekuasaan",
    explanation: "Al-Qabid berarti Allah yang menyempitkan rezeki bagi siapa yang dikehendaki-Nya dengan hikmah. Kesempitan rezeki bukan berarti Allah tidak sayang, tetapi ada hikmah di baliknya, bisa sebagai ujian atau pengingat agar hamba kembali kepada-Nya.",
    benefits: "Memahami nama ini akan menumbuhkan kesabaran dalam kekurangan, ridha dengan takdir Allah, dan tidak berputus asa saat mengalami kesulitan.",
    dalil: "\"Allah menyempitkan dan melapangkan rezeki dan kepada-Nya-lah kamu dikembalikan.\" (QS. Al-Baqarah: 245)"
  },
  {
    id: 21, arabic: "الْبَاسِطُ", latin: "Al-Basit", meaning: "Yang Maha Melapangkan",
    category: "kasih_sayang",
    explanation: "Al-Basit berarti Allah yang melapangkan rezeki bagi siapa yang dikehendaki-Nya. Dia meluaskan pemberian-Nya kepada hamba yang dikehendaki dengan hikmah. Kelapangan rezeki adalah nikmat yang harus disyukuri.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dilapangkan rezeki, diberi kelapangan hati, dan dimudahkan dalam segala urusan.",
    dalil: "\"Allah menyempitkan dan melapangkan rezeki dan kepada-Nya-lah kamu dikembalikan.\" (QS. Al-Baqarah: 245)"
  },
  {
    id: 22, arabic: "الْخَافِضُ", latin: "Al-Khafid", meaning: "Yang Maha Merendahkan",
    category: "keadilan",
    explanation: "Al-Khafid berarti Allah yang merendahkan orang-orang yang sombong dan membangkang. Dia yang menghinakan orang-orang kafir dan durhaka. Ini menunjukkan keadilan Allah dalam memberikan balasan.",
    benefits: "Memahami nama ini akan menumbuhkan kerendahan hati, menjauhi kesombongan, dan takut akan murka Allah.",
    dalil: "\"Sesungguhnya Allah tidak menyukai orang-orang yang sombong lagi membanggakan diri.\" (QS. An-Nisa: 36)"
  },
  {
    id: 23, arabic: "الرَّافِعُ", latin: "Ar-Rafi'", meaning: "Yang Maha Meninggikan",
    category: "keagungan",
    explanation: "Ar-Rafi' berarti Allah yang meninggikan derajat orang-orang beriman dan berilmu. Dia yang mengangkat kedudukan hamba-hamba yang taat kepada-Nya di dunia dan akhirat.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diangkat derajatnya, diberi kemuliaan, dan ditinggikan kedudukannya di mata manusia.",
    dalil: "\"Allah akan meninggikan orang-orang yang beriman dan orang-orang yang diberi ilmu beberapa derajat.\" (QS. Al-Mujadilah: 11)"
  },
  {
    id: 24, arabic: "الْمُعِزُّ", latin: "Al-Mu'izz", meaning: "Yang Maha Memuliakan",
    category: "keagungan",
    explanation: "Al-Mu'izz berarti Allah yang memberikan kemuliaan kepada siapa yang dikehendaki-Nya. Kemuliaan sejati datang dari Allah, bukan dari harta atau jabatan. Orang yang dimuliakan Allah tidak akan bisa dihinakan oleh siapa pun.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kemuliaan, dihormati orang lain, dan dilindungi dari kehinaan.",
    dalil: "\"Engkau muliakan siapa yang Engkau kehendaki dan Engkau hinakan siapa yang Engkau kehendaki.\" (QS. Ali Imran: 26)"
  },
  {
    id: 25, arabic: "الْمُذِلُّ", latin: "Al-Mudzill", meaning: "Yang Maha Menghinakan",
    category: "keadilan",
    explanation: "Al-Mudzill berarti Allah yang menghinakan orang-orang yang pantas dihinakan karena kekufuran dan kedurhakaan mereka. Ini adalah bentuk keadilan Allah bagi orang-orang yang membangkang.",
    benefits: "Memahami nama ini akan menumbuhkan rasa takut berbuat dosa, menjauhi maksiat, dan selalu merendahkan diri di hadapan Allah.",
    dalil: "\"Engkau muliakan siapa yang Engkau kehendaki dan Engkau hinakan siapa yang Engkau kehendaki.\" (QS. Ali Imran: 26)"
  },
  {
    id: 26, arabic: "السَّمِيعُ", latin: "As-Sami'", meaning: "Yang Maha Mendengar",
    category: "ilmu",
    explanation: "As-Sami' berarti Allah yang mendengar segala sesuatu tanpa terkecuali. Pendengaran Allah meliputi semua suara, bisikan hati, dan doa-doa hamba-Nya. Tidak ada yang tersembunyi dari pendengaran-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dikabulkan doanya, dijaga ucapannya, dan selalu merasa diawasi Allah.",
    dalil: "\"Sesungguhnya Allah Maha Mendengar lagi Maha Mengetahui.\" (QS. Al-Baqarah: 181)"
  },
  {
    id: 27, arabic: "الْبَصِيرُ", latin: "Al-Basir", meaning: "Yang Maha Melihat",
    category: "ilmu",
    explanation: "Al-Basir berarti Allah yang melihat segala sesuatu, yang tampak dan yang tersembunyi, yang besar dan yang kecil. Penglihatan Allah tidak terhalang oleh kegelapan atau jarak. Dia melihat perbuatan lahir dan batin hamba-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menumbuhkan muraqabah (merasa diawasi Allah), menjaga perbuatan, dan meningkatkan keikhlasan.",
    dalil: "\"Sesungguhnya Allah Maha Melihat apa yang kamu kerjakan.\" (QS. Al-Hujurat: 18)"
  },
  {
    id: 28, arabic: "الْحَكَمُ", latin: "Al-Hakam", meaning: "Yang Maha Menetapkan Hukum",
    category: "keadilan",
    explanation: "Al-Hakam berarti Allah yang menetapkan hukum dan memutuskan perkara di antara hamba-hamba-Nya dengan keadilan. Keputusan-Nya tidak bisa dibantah dan tidak ada yang lebih adil dari-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi keadilan, dimenangkan dari kezaliman, dan dimudahkan dalam memutuskan perkara.",
    dalil: "\"Maka patutkah aku mencari hakim selain Allah, padahal Dia-lah yang menurunkan Kitab kepadamu dengan terperinci.\" (QS. Al-An'am: 114)"
  },
  {
    id: 29, arabic: "الْعَدْلُ", latin: "Al-'Adl", meaning: "Yang Maha Adil",
    category: "keadilan",
    explanation: "Al-'Adl berarti Allah Yang Maha Adil dalam segala ketetapan dan perbuatan-Nya. Dia tidak pernah zalim kepada siapa pun. Setiap nikmat dan musibah yang diberikan kepada hamba adalah sesuai dengan hikmah-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menumbuhkan sikap adil, terhindar dari kezaliman, dan mendapat keadilan dari Allah.",
    dalil: "\"Sesungguhnya Allah menyuruh berlaku adil dan berbuat kebajikan.\" (QS. An-Nahl: 90)"
  },
  {
    id: 30, arabic: "اللَّطِيفُ", latin: "Al-Latif", meaning: "Yang Maha Lembut",
    category: "kasih_sayang",
    explanation: "Al-Latif memiliki dua makna: Allah Yang Maha Halus ilmu-Nya sehingga mengetahui yang paling tersembunyi, dan Allah Yang Maha Lembut kepada hamba-Nya dengan memberikan kebaikan secara halus tanpa disadari.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kelembutan dalam hidup, dimudahkan urusan secara halus, dan diberi rezeki dari arah yang tidak disangka.",
    dalil: "\"Sesungguhnya Tuhanku Maha Lembut terhadap apa yang Dia kehendaki.\" (QS. Yusuf: 100)"
  },
  {
    id: 31, arabic: "الْخَبِيرُ", latin: "Al-Khabir", meaning: "Yang Maha Mengetahui Hakikat",
    category: "ilmu",
    explanation: "Al-Khabir berarti Allah yang mengetahui hakikat segala sesuatu, baik yang lahir maupun yang batin. Ilmu-Nya menembus ke dalam inti dan rahasia segala perkara. Tidak ada yang tersembunyi dari-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi pemahaman yang mendalam, mengetahui hakikat sesuatu, dan diberi firasat yang benar.",
    dalil: "\"Sesungguhnya Allah Maha Mengetahui lagi Maha Waspada.\" (QS. Al-Ahzab: 34)"
  },
  {
    id: 32, arabic: "الْحَلِيمُ", latin: "Al-Halim", meaning: "Yang Maha Penyantun",
    category: "kasih_sayang",
    explanation: "Al-Halim berarti Allah yang tidak tergesa-gesa dalam memberikan hukuman kepada hamba yang berdosa. Dia memberi kesempatan untuk bertaubat dan tidak langsung menghukum meski Dia mampu melakukannya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kesantunan dalam bergaul, kesabaran menghadapi orang lain, dan kelapangan dada.",
    dalil: "\"Dan ketahuilah bahwa Allah Maha Pengampun lagi Maha Penyantun.\" (QS. Al-Baqarah: 235)"
  },
  {
    id: 33, arabic: "الْعَظِيمُ", latin: "Al-'Azim", meaning: "Yang Maha Agung",
    category: "keagungan",
    explanation: "Al-'Azim berarti Allah yang memiliki keagungan yang tidak terbatas. Keagungan-Nya meliputi zat, sifat, dan perbuatan-Nya. Tidak ada makhluk yang bisa memahami hakikat keagungan Allah secara penuh.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menumbuhkan pengagungan terhadap Allah, meningkatkan khusyuk dalam ibadah, dan merendahkan diri di hadapan-Nya.",
    dalil: "\"Maka sucikanlah nama Tuhanmu Yang Maha Agung.\" (QS. Al-Waqi'ah: 96)"
  },
  {
    id: 34, arabic: "الْغَفُورُ", latin: "Al-Ghafur", meaning: "Yang Maha Pengampun",
    category: "pengampunan",
    explanation: "Al-Ghafur berarti Allah yang mengampuni dosa-dosa hamba-Nya dan menutupi aib mereka. Ampunan Allah sangat luas, tidak ada dosa yang terlalu besar untuk diampuni-Nya selama hamba bertaubat dengan sungguh-sungguh.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diampuni dosa-dosanya, ditutupi aibnya, dan diberi ketenangan hati dari rasa bersalah.",
    dalil: "\"Sesungguhnya Tuhanmu Maha Luas ampunan-Nya.\" (QS. An-Najm: 32)"
  },
  {
    id: 35, arabic: "الشَّكُورُ", latin: "Asy-Syakur", meaning: "Yang Maha Mensyukuri",
    category: "kasih_sayang",
    explanation: "Asy-Syakur berarti Allah yang memberikan pahala besar atas amal yang sedikit. Dia yang menghargai ketaatan hamba-hamba-Nya dengan balasan yang berlipat ganda. Syukur Allah adalah dengan memberi lebih banyak.",
    benefits: "Memperbanyak dzikir dengan nama ini akan ditambah nikmat, dilipatgandakan pahala amal, dan diberi kemudahan dalam bersyukur.",
    dalil: "\"Dan Allah Maha Mensyukuri lagi Maha Penyantun.\" (QS. At-Taghabun: 17)"
  },
  {
    id: 36, arabic: "الْعَلِيُّ", latin: "Al-'Aliyy", meaning: "Yang Maha Tinggi",
    category: "keagungan",
    explanation: "Al-'Aliyy berarti Allah Yang Maha Tinggi dalam segala hal: tinggi dalam zat-Nya (di atas Arsy), tinggi dalam sifat-sifat-Nya (kesempurnaan), dan tinggi dalam kekuasaan-Nya (menguasai segalanya).",
    benefits: "Memperbanyak dzikir dengan nama ini akan meninggikan derajat, menumbuhkan pengagungan terhadap Allah, dan merendahkan diri di hadapan-Nya.",
    dalil: "\"Dan Dia-lah Yang Maha Tinggi lagi Maha Besar.\" (QS. Al-Baqarah: 255)"
  },
  {
    id: 37, arabic: "الْكَبِيرُ", latin: "Al-Kabir", meaning: "Yang Maha Besar",
    category: "keagungan",
    explanation: "Al-Kabir berarti Allah Yang Maha Besar yang tidak ada sesuatu pun yang lebih besar dari-Nya. Kebesaran-Nya meliputi zat, sifat, dan perbuatan-Nya. Semua makhluk kecil di hadapan-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menumbuhkan kerendahan hati, menghilangkan kesombongan, dan mengagungkan Allah dalam setiap keadaan.",
    dalil: "\"Yang demikian itu karena sesungguhnya Allah, Dialah Yang Haq dan apa yang mereka seru selain Allah itulah yang batil dan sesungguhnya Allah Dialah Yang Maha Tinggi lagi Maha Besar.\" (QS. Al-Hajj: 62)"
  },
  {
    id: 38, arabic: "الْحَفِيظُ", latin: "Al-Hafiz", meaning: "Yang Maha Memelihara",
    category: "pemeliharaan",
    explanation: "Al-Hafiz berarti Allah yang memelihara dan menjaga makhluk-Nya dari kerusakan dan kebinasaan. Dia juga yang menjaga amal perbuatan hamba-Nya untuk dihisab di hari kiamat.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dijaga dari bahaya, dilindungi dari musuh, dan dipelihara iman dan amalnya.",
    dalil: "\"Sesungguhnya Tuhanku adalah Maha Memelihara segala sesuatu.\" (QS. Hud: 57)"
  },
  {
    id: 39, arabic: "الْمُقِيتُ", latin: "Al-Muqit", meaning: "Yang Maha Pemberi Kecukupan",
    category: "pemeliharaan",
    explanation: "Al-Muqit berarti Allah yang memberikan kecukupan kepada makhluk-Nya. Dia yang menyediakan makanan dan segala kebutuhan. Dia juga yang mengawasi dan mencatat segala perbuatan.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dicukupkan kebutuhannya, diberi ketenteraman, dan terhindar dari kekurangan.",
    dalil: "\"Dan Allah Maha Kuasa atas segala sesuatu.\" (QS. An-Nisa: 85)"
  },
  {
    id: 40, arabic: "الْحَسِيبُ", latin: "Al-Hasib", meaning: "Yang Maha Membuat Perhitungan",
    category: "keadilan",
    explanation: "Al-Hasib berarti Allah yang menghitung semua amal perbuatan hamba-Nya dan akan membalasnya dengan sempurna. Tidak ada yang terlewat dari perhitungan-Nya, sekecil apa pun.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menumbuhkan sikap hati-hati dalam beramal, tawakkal kepada Allah, dan merasa cukup dengan Allah.",
    dalil: "\"Cukuplah Allah sebagai Pembuat perhitungan.\" (QS. An-Nisa: 6)"
  },
  {
    id: 41, arabic: "الْجَلِيلُ", latin: "Al-Jalil", meaning: "Yang Maha Mulia",
    category: "keagungan",
    explanation: "Al-Jalil berarti Allah yang memiliki kemuliaan yang sempurna dalam zat, sifat, dan perbuatan-Nya. Kemuliaan-Nya tidak bisa dibandingkan dengan kemuliaan makhluk.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kemuliaan, dihormati orang lain, dan ditinggikan kedudukannya.",
    dalil: "\"Maka Maha Suci nama Tuhanmu yang mempunyai Kebesaran dan Kemuliaan.\" (QS. Ar-Rahman: 78)"
  },
  {
    id: 42, arabic: "الْكَرِيمُ", latin: "Al-Karim", meaning: "Yang Maha Mulia dan Pemurah",
    category: "kasih_sayang",
    explanation: "Al-Karim berarti Allah Yang Maha Mulia dalam zat dan sifat-Nya, serta Maha Pemurah dalam memberi. Kemuliaan-Nya sempurna dan kedermawanan-Nya tak terbatas. Dia memberi tanpa diminta dan memaafkan tanpa dimohon.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kemuliaan, dilimpahkan kemurahan, dan diberi sifat dermawan.",
    dalil: "\"Bacalah, dan Tuhanmulah Yang Maha Pemurah.\" (QS. Al-'Alaq: 3)"
  },
  {
    id: 43, arabic: "الرَّقِيبُ", latin: "Ar-Raqib", meaning: "Yang Maha Mengawasi",
    category: "ilmu",
    explanation: "Ar-Raqib berarti Allah yang mengawasi segala sesuatu, tidak ada yang luput dari pengawasan-Nya. Dia mengetahui setiap gerak-gerik, pikiran, dan niat hamba-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menumbuhkan sikap muraqabah (merasa diawasi), menjaga diri dari maksiat, dan meningkatkan keikhlasan.",
    dalil: "\"Sesungguhnya Allah selalu mengawasi kamu.\" (QS. An-Nisa: 1)"
  },
  {
    id: 44, arabic: "الْمُجِيبُ", latin: "Al-Mujib", meaning: "Yang Maha Mengabulkan",
    category: "kasih_sayang",
    explanation: "Al-Mujib berarti Allah yang mengabulkan doa orang-orang yang berdoa kepada-Nya. Dia yang menjawab permintaan hamba-Nya dengan cara yang terbaik menurut hikmah-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dikabulkan doanya, dipenuhi harapannya, dan diberi apa yang diminta atau yang lebih baik.",
    dalil: "\"Sesungguhnya Tuhanku Maha Dekat lagi Maha Mengabulkan.\" (QS. Hud: 61)"
  },
  {
    id: 45, arabic: "الْوَاسِعُ", latin: "Al-Wasi'", meaning: "Yang Maha Luas",
    category: "keagungan",
    explanation: "Al-Wasi' berarti Allah yang ilmu, rahmat, kekuasaan, dan pemberian-Nya sangat luas, meliputi segala sesuatu. Keluasan-Nya tidak terbatas dan tidak ada yang bisa membatasi-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diluaskan rezeki, dilapangkan ilmu, dan diberi keluasan dalam segala hal.",
    dalil: "\"Dan Allah Maha Luas lagi Maha Mengetahui.\" (QS. Al-Baqarah: 247)"
  },
  {
    id: 46, arabic: "الْحَكِيمُ", latin: "Al-Hakim", meaning: "Yang Maha Bijaksana",
    category: "ilmu",
    explanation: "Al-Hakim berarti Allah yang memiliki hikmah sempurna dalam segala ketetapan dan perbuatan-Nya. Tidak ada yang sia-sia dalam ciptaan-Nya dan tidak ada kesalahan dalam hukum-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi hikmah dalam berucap dan bertindak, memahami rahasia di balik takdir, dan diberi kebijaksanaan.",
    dalil: "\"Dan Allah Maha Mengetahui lagi Maha Bijaksana.\" (QS. An-Nisa: 26)"
  },
  {
    id: 47, arabic: "الْوَدُودُ", latin: "Al-Wadud", meaning: "Yang Maha Mencintai",
    category: "kasih_sayang",
    explanation: "Al-Wadud berarti Allah yang mencintai hamba-hamba-Nya yang beriman dan taat. Dia juga yang membuat hamba-hamba-Nya saling mencintai. Cinta Allah adalah cinta yang tertinggi dan paling sempurna.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dicintai Allah, dicintai manusia, dan diberi kemampuan untuk mencintai dengan benar.",
    dalil: "\"Sesungguhnya Tuhanku Maha Penyayang lagi Maha Pencinta.\" (QS. Hud: 90)"
  },
  {
    id: 48, arabic: "الْمَجِيدُ", latin: "Al-Majid", meaning: "Yang Maha Mulia",
    category: "keagungan",
    explanation: "Al-Majid berarti Allah yang memiliki kemuliaan yang sempurna dengan kebesaran sifat dan perbuatan-Nya. Kemuliaan-Nya mencakup keluasan pemberian dan keagungan zat.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kemuliaan, ditinggikan derajatnya, dan diberi keberkahan dalam hidup.",
    dalil: "\"Pemilik Arsy yang Maha Mulia.\" (QS. Al-Buruj: 15)"
  },
  {
    id: 49, arabic: "الْبَاعِثُ", latin: "Al-Ba'ith", meaning: "Yang Maha Membangkitkan",
    category: "kekuasaan",
    explanation: "Al-Ba'ith berarti Allah yang membangkitkan manusia dari kubur pada hari kiamat. Dia juga yang mengutus para rasul untuk membimbing manusia dan membangkitkan semangat orang yang lalai.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dikuatkan iman akan hari kebangkitan, diberi semangat dalam beramal, dan diingatkan akan akhirat.",
    dalil: "\"Dan sesungguhnya hari kiamat itu pasti akan datang, tidak ada keraguan padanya; dan sesungguhnya Allah membangkitkan semua orang di dalam kubur.\" (QS. Al-Hajj: 7)"
  },
  {
    id: 50, arabic: "الشَّهِيدُ", latin: "Asy-Syahid", meaning: "Yang Maha Menyaksikan",
    category: "ilmu",
    explanation: "Asy-Syahid berarti Allah yang menyaksikan segala sesuatu, tidak ada yang tersembunyi dari-Nya. Kesaksian Allah adalah kesaksian yang sempurna dan akan menjadi bukti di hari kiamat.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menumbuhkan sikap jujur, merasa diawasi Allah, dan menjaga perbuatan baik lahir maupun batin.",
    dalil: "\"Katakanlah: Cukuplah Allah menjadi saksi antaraku dan antaramu.\" (QS. Al-Isra: 96)"
  },
  {
    id: 51, arabic: "الْحَقُّ", latin: "Al-Haqq", meaning: "Yang Maha Benar",
    category: "keesaan",
    explanation: "Al-Haqq berarti Allah yang wujud-Nya adalah kebenaran yang pasti, tidak bisa dibantah. Segala yang dari-Nya adalah kebenaran: firman-Nya, janji-Nya, dan pertemuan dengan-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dikuatkan dalam kebenaran, dijauhkan dari kebatilan, dan diberi keteguhan dalam keyakinan.",
    dalil: "\"Yang demikian itu karena sesungguhnya Allah, Dialah Yang Haq.\" (QS. Al-Hajj: 62)"
  },
  {
    id: 52, arabic: "الْوَكِيلُ", latin: "Al-Wakil", meaning: "Yang Maha Memelihara Urusan",
    category: "pemeliharaan",
    explanation: "Al-Wakil berarti Allah yang mengurus segala perkara hamba-hamba-Nya yang bertawakkal kepada-Nya. Dia yang menjamin dan memelihara urusan orang yang menyerahkan urusannya kepada-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kemudahan dalam urusan, ditolong dari kesulitan, dan diberi ketenangan dengan bertawakkal.",
    dalil: "\"Cukuplah Allah menjadi Penolong kami dan Allah adalah sebaik-baik Pelindung.\" (QS. Ali Imran: 173)"
  },
  {
    id: 53, arabic: "الْقَوِيُّ", latin: "Al-Qawiyy", meaning: "Yang Maha Kuat",
    category: "kekuasaan",
    explanation: "Al-Qawiyy berarti Allah yang memiliki kekuatan yang sempurna, tidak ada kelemahan sedikit pun pada-Nya. Kekuatan-Nya tidak pernah berkurang dan tidak terpengaruh oleh apa pun.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kekuatan fisik dan mental, ditolong dari kelemahan, dan diberi keteguhan menghadapi musuh.",
    dalil: "\"Sesungguhnya Allah Dialah Maha Memberi rezeki Yang Mempunyai Kekuatan lagi Sangat Kokoh.\" (QS. Adz-Dzariyat: 58)"
  },
  {
    id: 54, arabic: "الْمَتِينُ", latin: "Al-Matin", meaning: "Yang Maha Kokoh",
    category: "kekuasaan",
    explanation: "Al-Matin berarti Allah yang memiliki kekuatan yang sangat kokoh, tidak pernah goyah atau lemah. Kekokohan-Nya dalam menjalankan kehendak-Nya tidak bisa diganggu gugat.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kekokohan iman, keteguhan hati, dan kekuatan menghadapi cobaan.",
    dalil: "\"Sesungguhnya Allah Dialah Maha Memberi rezeki Yang Mempunyai Kekuatan lagi Sangat Kokoh.\" (QS. Adz-Dzariyat: 58)"
  },
  {
    id: 55, arabic: "الْوَلِيُّ", latin: "Al-Waliyy", meaning: "Yang Maha Melindungi",
    category: "pemeliharaan",
    explanation: "Al-Waliyy berarti Allah yang menjadi Pelindung dan Penolong bagi hamba-hamba-Nya yang beriman. Dia yang mencintai dan menolong orang-orang yang bertakwa.",
    benefits: "Memperbanyak dzikir dengan nama ini akan mendapat perlindungan Allah, ditolong dalam kesulitan, dan diberi pertolongan tanpa diminta.",
    dalil: "\"Allah adalah Pelindung orang-orang yang beriman.\" (QS. Al-Baqarah: 257)"
  },
  {
    id: 56, arabic: "الْحَمِيدُ", latin: "Al-Hamid", meaning: "Yang Maha Terpuji",
    category: "keagungan",
    explanation: "Al-Hamid berarti Allah yang berhak menerima segala pujian karena kesempurnaan zat, sifat, dan perbuatan-Nya. Pujian kepada-Nya tidak akan pernah cukup untuk menggambarkan kemuliaan-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menumbuhkan sikap memuji Allah, bersyukur atas nikmat, dan menjadikan hidup penuh dengan pujian kepada Allah.",
    dalil: "\"Segala puji bagi Allah, Tuhan semesta alam.\" (QS. Al-Fatihah: 2)"
  },
  {
    id: 57, arabic: "الْمُحْصِي", latin: "Al-Muhsi", meaning: "Yang Maha Menghitung",
    category: "ilmu",
    explanation: "Al-Muhsi berarti Allah yang menghitung segala sesuatu dengan teliti, tidak ada yang terlewat atau terlupa. Ilmu-Nya meliputi jumlah seluruh makhluk dan amal perbuatan mereka.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menumbuhkan ketelitian dalam beramal, menghitung nikmat Allah, dan berhati-hati dengan perbuatan.",
    dalil: "\"Padahal Allah telah menghitung mereka dan membilangnya dengan tepat.\" (QS. Maryam: 94)"
  },
  {
    id: 58, arabic: "الْمُبْدِئُ", latin: "Al-Mubdi'", meaning: "Yang Maha Memulai",
    category: "penciptaan",
    explanation: "Al-Mubdi' berarti Allah yang memulai penciptaan dari ketiadaan tanpa contoh sebelumnya. Dia yang pertama kali menciptakan segala sesuatu dengan kehendak dan kekuasaan-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kemudahan memulai usaha baru, diberi kreativitas, dan dimudahkan dalam langkah pertama.",
    dalil: "\"Dia-lah yang memulai penciptaan, kemudian mengulanginya.\" (QS. Ar-Rum: 27)"
  },
  {
    id: 59, arabic: "الْمُعِيدُ", latin: "Al-Mu'id", meaning: "Yang Maha Mengembalikan",
    category: "kekuasaan",
    explanation: "Al-Mu'id berarti Allah yang mengembalikan makhluk setelah mematikannya, yaitu membangkitkan mereka pada hari kiamat. Dia yang mengulangi penciptaan setelah memulainya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dikuatkan iman kepada hari kebangkitan, dimudahkan kembali ke jalan yang benar, dan diberi kesempatan memperbaiki diri.",
    dalil: "\"Dia-lah yang memulai penciptaan, kemudian mengulanginya.\" (QS. Ar-Rum: 27)"
  },
  {
    id: 60, arabic: "الْمُحْيِي", latin: "Al-Muhyi", meaning: "Yang Maha Menghidupkan",
    category: "kekuasaan",
    explanation: "Al-Muhyi berarti Allah yang menghidupkan makhluk dari ketiadaan dan akan menghidupkan kembali orang mati pada hari kiamat. Dia juga yang menghidupkan hati dengan hidayah.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dihidupkan hatinya dengan iman, diberi semangat hidup, dan dimudahkan dalam menghadapi kelesuan.",
    dalil: "\"Sesungguhnya Allah menghidupkan bumi sesudah matinya.\" (QS. Al-Hadid: 17)"
  },
  {
    id: 61, arabic: "الْمُمِيتُ", latin: "Al-Mumit", meaning: "Yang Maha Mematikan",
    category: "kekuasaan",
    explanation: "Al-Mumit berarti Allah yang mematikan setiap makhluk hidup. Kematian adalah pasti dan tidak ada yang bisa menghindarinya. Ini mengingatkan manusia akan kelemahan mereka di hadapan Allah.",
    benefits: "Mengingat nama ini akan menumbuhkan sikap zuhud, tidak terlalu mencintai dunia, dan mempersiapkan diri untuk kematian.",
    dalil: "\"Dia yang mematikan dan menghidupkan.\" (QS. Al-Mu'minun: 80)"
  },
  {
    id: 62, arabic: "الْحَيُّ", latin: "Al-Hayy", meaning: "Yang Maha Hidup",
    category: "keesaan",
    explanation: "Al-Hayy berarti Allah yang hidup dengan kehidupan yang sempurna, tidak pernah mati dan tidak pernah tidur. Kehidupan-Nya tidak bergantung pada apa pun, berbeda dengan makhluk yang hidupnya terbatas.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dihidupkan hatinya, diberi semangat dalam beribadah, dan dikuatkan harapannya kepada Allah.",
    dalil: "\"Allah, tidak ada Tuhan selain Dia, Yang Hidup kekal lagi terus-menerus mengurus makhluk-Nya.\" (QS. Al-Baqarah: 255)"
  },
  {
    id: 63, arabic: "الْقَيُّومُ", latin: "Al-Qayyum", meaning: "Yang Maha Berdiri Sendiri",
    category: "keesaan",
    explanation: "Al-Qayyum berarti Allah yang berdiri sendiri, tidak membutuhkan siapa pun, sementara seluruh makhluk membutuhkan-Nya. Dia yang terus-menerus mengatur dan memelihara seluruh alam semesta.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kemandirian, dikuatkan dalam menghadapi cobaan, dan didekatkan kepada Allah.",
    dalil: "\"Allah, tidak ada Tuhan selain Dia, Yang Hidup kekal lagi terus-menerus mengurus makhluk-Nya.\" (QS. Al-Baqarah: 255)"
  },
  {
    id: 64, arabic: "الْوَاجِدُ", latin: "Al-Wajid", meaning: "Yang Maha Menemukan",
    category: "ilmu",
    explanation: "Al-Wajid berarti Allah yang tidak memerlukan apa pun karena semua yang dikehendaki-Nya pasti ada. Dia kaya dan memiliki segalanya. Tidak ada yang tersembunyi dari-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dimudahkan menemukan apa yang dicari, diberi kekayaan hati, dan tidak kekurangan.",
    dalil: "\"Dan sesungguhnya Allah Maha Kaya.\" (QS. Al-Ankabut: 6)"
  },
  {
    id: 65, arabic: "الْمَاجِدُ", latin: "Al-Majid", meaning: "Yang Maha Mulia",
    category: "keagungan",
    explanation: "Al-Majid berarti Allah yang memiliki kemuliaan dan kebesaran yang sangat tinggi. Kemajidan-Nya adalah kombinasi dari keagungan sifat dan keluasan kedermawanan-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kemuliaan, ditinggikan martabatnya, dan diberi keberkahan dalam hidup.",
    dalil: "\"Pemilik Arsy yang Maha Mulia.\" (QS. Al-Buruj: 15)"
  },
  {
    id: 66, arabic: "الْوَاحِدُ", latin: "Al-Wahid", meaning: "Yang Maha Esa",
    category: "keesaan",
    explanation: "Al-Wahid berarti Allah yang Esa dalam zat, sifat, dan perbuatan-Nya. Tidak ada sekutu bagi-Nya dan tidak ada yang menyerupai-Nya. Keesaan Allah adalah dasar tauhid.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menguatkan tauhid, membersihkan hati dari syirik, dan meningkatkan keikhlasan.",
    dalil: "\"Katakanlah: Dialah Allah, Yang Maha Esa.\" (QS. Al-Ikhlas: 1)"
  },
  {
    id: 67, arabic: "الْأَحَدُ", latin: "Al-Ahad", meaning: "Yang Maha Tunggal",
    category: "keesaan",
    explanation: "Al-Ahad berarti Allah Yang Maha Tunggal, tidak ada yang menyerupai-Nya sama sekali. Ketunggalan-Nya mutlak, tidak bisa dibagi atau dipisahkan. Dia unik dalam segala hal.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menguatkan keyakinan tauhid, menghilangkan ketergantungan pada makhluk, dan membersihkan hati.",
    dalil: "\"Katakanlah: Dialah Allah, Yang Maha Esa.\" (QS. Al-Ikhlas: 1)"
  },
  {
    id: 68, arabic: "الصَّمَدُ", latin: "As-Samad", meaning: "Yang Maha Dibutuhkan",
    category: "keesaan",
    explanation: "As-Samad berarti Allah yang menjadi tujuan semua makhluk untuk meminta kepada-Nya. Dia yang tidak membutuhkan makan dan minum. Semua makhluk bergantung kepada-Nya, sementara Dia tidak bergantung pada siapa pun.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kecukupan, dijauhkan dari meminta-minta kepada makhluk, dan didekatkan kepada Allah.",
    dalil: "\"Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu.\" (QS. Al-Ikhlas: 2)"
  },
  {
    id: 69, arabic: "الْقَادِرُ", latin: "Al-Qadir", meaning: "Yang Maha Kuasa",
    category: "kekuasaan",
    explanation: "Al-Qadir berarti Allah yang Maha Kuasa untuk melakukan apa pun yang dikehendaki-Nya. Tidak ada yang mustahil bagi-Nya dan tidak ada yang bisa menghalangi kehendak-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan meningkatkan keyakinan kepada kuasa Allah, bertawakkal dalam setiap usaha, dan tidak berputus asa.",
    dalil: "\"Sesungguhnya Allah Maha Kuasa atas segala sesuatu.\" (QS. Al-Baqarah: 20)"
  },
  {
    id: 70, arabic: "الْمُقْتَدِرُ", latin: "Al-Muqtadir", meaning: "Yang Maha Berkuasa",
    category: "kekuasaan",
    explanation: "Al-Muqtadir berarti Allah yang kekuasaan-Nya meliputi segala sesuatu dengan sempurna. Bentuk mubalaghah menunjukkan bahwa kekuasaan-Nya sangat sempurna tanpa batas.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kemampuan melakukan sesuatu, dikuatkan dalam usaha, dan diberi kesuksesan.",
    dalil: "\"Di tempat yang disenangi di sisi Tuhan Yang Maha Berkuasa.\" (QS. Al-Qamar: 55)"
  },
  {
    id: 71, arabic: "الْمُقَدِّمُ", latin: "Al-Muqaddim", meaning: "Yang Maha Mendahulukan",
    category: "keadilan",
    explanation: "Al-Muqaddim berarti Allah yang mendahulukan apa yang dikehendaki-Nya, baik dalam penciptaan, rezeki, atau derajat. Dia yang mendahulukan orang-orang beriman dengan hidayah dan pahala.",
    benefits: "Memperbanyak dzikir dengan nama ini akan didahulukan dalam kebaikan, diberi prioritas dalam rezeki, dan diutamakan dalam urusan penting.",
    dalil: "\"Sesungguhnya Kami mengetahui orang-orang yang terdahulu di antaramu dan sesungguhnya Kami mengetahui pula orang-orang yang terlambat.\" (QS. Al-Hijr: 24)"
  },
  {
    id: 72, arabic: "الْمُؤَخِّرُ", latin: "Al-Mu'akhkhir", meaning: "Yang Maha Mengakhirkan",
    category: "keadilan",
    explanation: "Al-Mu'akhkhir berarti Allah yang mengakhirkan apa yang dikehendaki-Nya dengan hikmah. Dia yang mengakhirkan azab bagi orang yang berhak sebagai kesempatan bertaubat.",
    benefits: "Memahami nama ini akan menumbuhkan kesabaran, tidak tergesa-gesa dalam segala hal, dan memahami hikmah penundaan.",
    dalil: "\"Sesungguhnya Kami mengetahui orang-orang yang terdahulu di antaramu dan sesungguhnya Kami mengetahui pula orang-orang yang terlambat.\" (QS. Al-Hijr: 24)"
  },
  {
    id: 73, arabic: "الْأَوَّلُ", latin: "Al-Awwal", meaning: "Yang Maha Pertama",
    category: "keesaan",
    explanation: "Al-Awwal berarti Allah yang ada sebelum segala sesuatu ada. Tidak ada sesuatu yang mendahului-Nya. Dia ada tanpa permulaan, Maha Dahulu dari segala yang dahulu.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menguatkan keyakinan tentang kekekalan Allah, memulai segala sesuatu dengan nama Allah, dan diberi keberkahan.",
    dalil: "\"Dialah Yang Awal dan Yang Akhir, Yang Zahir dan Yang Batin.\" (QS. Al-Hadid: 3)"
  },
  {
    id: 74, arabic: "الْآخِرُ", latin: "Al-Akhir", meaning: "Yang Maha Akhir",
    category: "keesaan",
    explanation: "Al-Akhir berarti Allah yang tetap ada setelah segala sesuatu binasa. Dia kekal abadi setelah semua makhluk musnah. Tidak ada sesuatu yang ada setelah-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menguatkan keyakinan tentang akhirat, mempersiapkan diri untuk bertemu Allah, dan tidak terlalu mencintai dunia.",
    dalil: "\"Dialah Yang Awal dan Yang Akhir, Yang Zahir dan Yang Batin.\" (QS. Al-Hadid: 3)"
  },
  {
    id: 75, arabic: "الظَّاهِرُ", latin: "Az-Zahir", meaning: "Yang Maha Nyata",
    category: "keesaan",
    explanation: "Az-Zahir berarti Allah yang nyata keberadaan-Nya melalui tanda-tanda kekuasaan-Nya. Meskipun tidak terlihat oleh mata, keberadaan-Nya sangat jelas melalui ciptaan-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kemampuan melihat tanda-tanda kebesaran Allah, meningkatkan keyakinan, dan tidak ragu tentang keberadaan-Nya.",
    dalil: "\"Dialah Yang Awal dan Yang Akhir, Yang Zahir dan Yang Batin.\" (QS. Al-Hadid: 3)"
  },
  {
    id: 76, arabic: "الْبَاطِنُ", latin: "Al-Batin", meaning: "Yang Maha Tersembunyi",
    category: "keesaan",
    explanation: "Al-Batin berarti Allah yang zat-Nya tidak bisa dijangkau oleh indera makhluk. Hakikat zat Allah tidak bisa dipahami oleh akal manusia. Dia dekat tetapi tidak bisa disentuh.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menumbuhkan sikap tawadu, tidak berusaha memahami hakikat zat Allah, dan meningkatkan keimanan.",
    dalil: "\"Dialah Yang Awal dan Yang Akhir, Yang Zahir dan Yang Batin.\" (QS. Al-Hadid: 3)"
  },
  {
    id: 77, arabic: "الْوَالِي", latin: "Al-Wali", meaning: "Yang Maha Memerintah",
    category: "kekuasaan",
    explanation: "Al-Wali berarti Allah yang memerintah dan mengatur segala urusan alam semesta. Tidak ada yang terjadi kecuali dengan izin dan pengaturan-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kemampuan mengatur urusan dengan baik, ditundukkan orang-orang yang dipimpin, dan diberi keberhasilan dalam kepemimpinan.",
    dalil: "\"Sesungguhnya Allah lebih mengetahui tentang musuh-musuhmu. Dan cukuplah Allah menjadi Pelindung dan cukuplah Allah menjadi Penolong.\" (QS. An-Nisa: 45)"
  },
  {
    id: 78, arabic: "الْمُتَعَالِي", latin: "Al-Muta'ali", meaning: "Yang Maha Tinggi",
    category: "keagungan",
    explanation: "Al-Muta'ali berarti Allah yang Maha Tinggi dari segala kekurangan dan kelemahan. Ketinggian-Nya mutlak di atas segala makhluk. Tidak ada yang setara dengan-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan meninggikan himmah (cita-cita), tidak rendah diri, dan mengagungkan Allah sebagaimana mestinya.",
    dalil: "\"Dia Maha Mengetahui yang gaib dan yang nyata, Maha Besar dan Maha Tinggi.\" (QS. Ar-Ra'd: 9)"
  },
  {
    id: 79, arabic: "الْبَرُّ", latin: "Al-Barr", meaning: "Yang Maha Baik",
    category: "kasih_sayang",
    explanation: "Al-Barr berarti Allah Yang Maha Baik dalam memperlakukan hamba-hamba-Nya. Kebaikan-Nya meliputi segala hal, baik di dunia maupun di akhirat. Dia berbuat baik kepada yang taat dan yang bermaksiat.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kebaikan dalam hidup, dimudahkan berbuat baik, dan diberi akhlak yang mulia.",
    dalil: "\"Sesungguhnya Dia-lah Yang Maha Baik lagi Maha Penyayang.\" (QS. At-Tur: 28)"
  },
  {
    id: 80, arabic: "التَّوَّابُ", latin: "At-Tawwab", meaning: "Yang Maha Menerima Taubat",
    category: "pengampunan",
    explanation: "At-Tawwab berarti Allah yang senantiasa menerima taubat hamba-hamba-Nya yang bertaubat. Dia memberi taufik untuk bertaubat dan kemudian menerima taubat tersebut. Taubat-Nya tidak pernah putus selama hamba mau kembali.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi taufik untuk bertaubat, diterima taubatnya, dan diampuni dosa-dosanya.",
    dalil: "\"Sesungguhnya Allah Maha Menerima taubat lagi Maha Penyayang.\" (QS. At-Taubah: 104)"
  },
  {
    id: 81, arabic: "الْمُنْتَقِمُ", latin: "Al-Muntaqim", meaning: "Yang Maha Menuntut Balas",
    category: "keadilan",
    explanation: "Al-Muntaqim berarti Allah yang menuntut balas dari orang-orang yang durhaka dan berbuat zalim. Pembalasan Allah adalah keadilan, bukan kezaliman. Dia menghukum siapa yang pantas dihukum.",
    benefits: "Memahami nama ini akan menumbuhkan rasa takut berbuat dosa, tidak berbuat zalim, dan bertaubat sebelum terlambat.",
    dalil: "\"Sesungguhnya Kami akan memberikan pembalasan kepada orang-orang yang berdosa.\" (QS. As-Sajdah: 22)"
  },
  {
    id: 82, arabic: "الْعَفُوُّ", latin: "Al-'Afuww", meaning: "Yang Maha Pemaaf",
    category: "pengampunan",
    explanation: "Al-'Afuww berarti Allah yang memaafkan dosa-dosa hamba-Nya dan menghapusnya seolah-olah tidak pernah terjadi. Pemaafan Allah lebih tinggi dari pengampunan karena Dia menghapus dosa dari catatan.",
    benefits: "Memperbanyak dzikir dengan nama ini, terutama di malam Lailatul Qadr, akan dimaafkan dosa-dosanya dan dibersihkan dari kesalahan.",
    dalil: "\"Sesungguhnya Allah Maha Pemaaf lagi Maha Pengampun.\" (QS. An-Nisa: 43)"
  },
  {
    id: 83, arabic: "الرَّءُوفُ", latin: "Ar-Ra'uf", meaning: "Yang Maha Pengasih",
    category: "kasih_sayang",
    explanation: "Ar-Ra'uf berarti Allah yang memiliki kasih sayang yang sangat lembut dan mendalam. Ra'fah adalah tingkat kasih sayang yang lebih tinggi, penuh kelembutan dan perhatian terhadap hamba-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kelembutan hati, kasih sayang kepada sesama, dan mendapat kasih sayang khusus dari Allah.",
    dalil: "\"Sesungguhnya Allah terhadap manusia adalah Maha Pengasih lagi Maha Penyayang.\" (QS. Al-Baqarah: 143)"
  },
  {
    id: 84, arabic: "مَالِكُ الْمُلْكِ", latin: "Malikul Mulk", meaning: "Pemilik Kerajaan",
    category: "kekuasaan",
    explanation: "Malikul Mulk berarti Allah adalah Pemilik kerajaan langit dan bumi. Dia yang memberikan kekuasaan kepada siapa yang dikehendaki dan mencabutnya dari siapa yang dikehendaki.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kemantapan dalam kekuasaan, tidak sombong dengan jabatan, dan mengakui bahwa segala kekuasaan milik Allah.",
    dalil: "\"Katakanlah: Wahai Tuhan yang mempunyai kerajaan.\" (QS. Ali Imran: 26)"
  },
  {
    id: 85, arabic: "ذُو الْجَلَالِ وَالْإِكْرَامِ", latin: "Dzul Jalali wal Ikram", meaning: "Pemilik Kebesaran dan Kemuliaan",
    category: "keagungan",
    explanation: "Dzul Jalali wal Ikram berarti Allah yang memiliki kebesaran yang mengagumkan dan kemuliaan yang sempurna. Dia layak diagungkan dan dimuliakan oleh semua makhluk.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi keagungan dan kemuliaan, dihormati orang lain, dan mendapat kehormatan di sisi Allah.",
    dalil: "\"Tetap kekal Dzat Tuhanmu yang mempunyai kebesaran dan kemuliaan.\" (QS. Ar-Rahman: 27)"
  },
  {
    id: 86, arabic: "الْمُقْسِطُ", latin: "Al-Muqsit", meaning: "Yang Maha Adil",
    category: "keadilan",
    explanation: "Al-Muqsit berarti Allah yang menegakkan keadilan dan memberikan hak kepada yang berhak. Dia tidak pernah berlaku zalim dan membenci kezaliman.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi keadilan dalam memutuskan perkara, terhindar dari kezaliman, dan diberi pertolongan saat dizalimi.",
    dalil: "\"Dan Allah tidak menghendaki kezaliman bagi hamba-hamba-Nya.\" (QS. Ghafir: 31)"
  },
  {
    id: 87, arabic: "الْجَامِعُ", latin: "Al-Jami'", meaning: "Yang Maha Mengumpulkan",
    category: "kekuasaan",
    explanation: "Al-Jami' berarti Allah yang mengumpulkan seluruh makhluk pada hari kiamat untuk dihisab. Dia juga yang mengumpulkan hal-hal yang bercerai-berai dan menyatukan yang berbeda-beda.",
    benefits: "Memperbanyak dzikir dengan nama ini akan disatukan hatinya dengan orang yang dicintai, dikumpulkan kebaikan dalam hidupnya, dan diberi keberkahan dalam pertemuan.",
    dalil: "\"Ya Tuhan kami, sesungguhnya Engkau mengumpulkan manusia pada suatu hari yang tidak ada keraguan padanya.\" (QS. Ali Imran: 9)"
  },
  {
    id: 88, arabic: "الْغَنِيُّ", latin: "Al-Ghaniyy", meaning: "Yang Maha Kaya",
    category: "keagungan",
    explanation: "Al-Ghaniyy berarti Allah yang kaya dan tidak membutuhkan apa pun dari makhluk-Nya. Kekayaan-Nya mutlak dan sempurna. Semua makhluk membutuhkan-Nya, tetapi Dia tidak membutuhkan siapa pun.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kekayaan hati, tidak tamak terhadap dunia, dan merasa cukup dengan apa yang Allah berikan.",
    dalil: "\"Sesungguhnya Allah, Dia-lah Yang Maha Kaya lagi Maha Terpuji.\" (QS. Luqman: 26)"
  },
  {
    id: 89, arabic: "الْمُغْنِي", latin: "Al-Mughni", meaning: "Yang Maha Memberi Kekayaan",
    category: "kasih_sayang",
    explanation: "Al-Mughni berarti Allah yang memberi kekayaan kepada siapa yang dikehendaki-Nya. Dia yang mencukupkan kebutuhan hamba-hamba-Nya dan menjadikan mereka tidak membutuhkan orang lain.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dicukupkan kebutuhannya, diberi kekayaan lahir dan batin, dan tidak bergantung pada makhluk.",
    dalil: "\"Dan bahwasanya Dialah yang memberikan kekayaan dan memberikan kecukupan.\" (QS. An-Najm: 48)"
  },
  {
    id: 90, arabic: "الْمَانِعُ", latin: "Al-Mani'", meaning: "Yang Maha Mencegah",
    category: "kekuasaan",
    explanation: "Al-Mani' berarti Allah yang mencegah sesuatu dari terjadi atau mencegah bahaya dari hamba-Nya. Dia yang menghalangi keburukan dan menjaga dari kesulitan.",
    benefits: "Memperbanyak dzikir dengan nama ini akan dijaga dari bahaya, dicegah dari keburukan, dan dilindungi dari musuh.",
    dalil: "\"Apa yang Allah anugerahkan kepada manusia berupa rahmat, maka tidak ada seorang pun yang dapat menahannya.\" (QS. Fatir: 2)"
  },
  {
    id: 91, arabic: "الضَّارُّ", latin: "Ad-Darr", meaning: "Yang Maha Memberi Bahaya",
    category: "kekuasaan",
    explanation: "Ad-Darr berarti Allah yang menimpakan bahaya kepada siapa yang dikehendaki-Nya dengan hikmah. Semua bahaya dan musibah adalah dengan izin Allah dan tidak ada yang bisa mendatangkan bahaya kecuali dengan izin-Nya.",
    benefits: "Memahami nama ini akan menumbuhkan sikap tawakkal, tidak takut kepada selain Allah, dan meminta perlindungan hanya kepada-Nya.",
    dalil: "\"Katakanlah: Aku tidak berkuasa menarik kemanfaatan bagi diriku dan tidak pula menolak kemudaratan.\" (QS. Yunus: 49)"
  },
  {
    id: 92, arabic: "النَّافِعُ", latin: "An-Nafi'", meaning: "Yang Maha Memberi Manfaat",
    category: "kasih_sayang",
    explanation: "An-Nafi' berarti Allah yang memberikan manfaat kepada siapa yang dikehendaki-Nya. Semua kebaikan dan manfaat datang dari Allah dan tidak ada yang bisa memberi manfaat kecuali dengan izin-Nya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi manfaat dalam segala hal, dimudahkan mendapat kebaikan, dan dijadikan bermanfaat bagi orang lain.",
    dalil: "\"Katakanlah: Aku tidak berkuasa menarik kemanfaatan bagi diriku dan tidak pula menolak kemudaratan.\" (QS. Yunus: 49)"
  },
  {
    id: 93, arabic: "النُّورُ", latin: "An-Nur", meaning: "Yang Maha Bercahaya",
    category: "keagungan",
    explanation: "An-Nur berarti Allah adalah cahaya langit dan bumi. Dia yang menerangi alam semesta dengan cahaya-Nya dan menerangi hati orang-orang beriman dengan hidayah. Tanpa cahaya-Nya, segalanya gelap.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diterangi hatinya dengan hidayah, diberi kecerahan pikiran, dan disinari wajahnya dengan nur.",
    dalil: "\"Allah adalah Cahaya langit dan bumi.\" (QS. An-Nur: 35)"
  },
  {
    id: 94, arabic: "الْهَادِي", latin: "Al-Hadi", meaning: "Yang Maha Memberi Petunjuk",
    category: "kasih_sayang",
    explanation: "Al-Hadi berarti Allah yang memberi petunjuk kepada makhluk-Nya ke jalan yang benar. Hidayah Allah adalah nikmat terbesar karena tanpanya manusia akan tersesat.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi hidayah, ditunjukkan jalan yang benar, dan dijauhkan dari kesesatan.",
    dalil: "\"Dan sesungguhnya Allah adalah Pemberi petunjuk bagi orang-orang yang beriman kepada jalan yang lurus.\" (QS. Al-Hajj: 54)"
  },
  {
    id: 95, arabic: "الْبَدِيعُ", latin: "Al-Badi'", meaning: "Yang Maha Pencipta Tanpa Contoh",
    category: "penciptaan",
    explanation: "Al-Badi' berarti Allah yang menciptakan segala sesuatu dengan cara yang baru dan unik tanpa contoh sebelumnya. Ciptaan-Nya tidak meniru apa pun dan selalu mengagumkan.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kreativitas, inovasi dalam berkarya, dan kemampuan menciptakan hal-hal baru.",
    dalil: "\"Dia Pencipta langit dan bumi.\" (QS. Al-Baqarah: 117)"
  },
  {
    id: 96, arabic: "الْبَاقِي", latin: "Al-Baqi", meaning: "Yang Maha Kekal",
    category: "keesaan",
    explanation: "Al-Baqi berarti Allah yang kekal abadi, tidak pernah binasa. Segala sesuatu akan musnah kecuali Dia. Kekekalan-Nya tidak ada batasnya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menumbuhkan kesadaran akan fana-nya dunia, tidak terlalu mencintai dunia, dan mempersiapkan diri untuk akhirat.",
    dalil: "\"Semua yang ada di bumi itu akan binasa. Dan tetap kekal Dzat Tuhanmu.\" (QS. Ar-Rahman: 26-27)"
  },
  {
    id: 97, arabic: "الْوَارِثُ", latin: "Al-Warits", meaning: "Yang Maha Mewarisi",
    category: "keesaan",
    explanation: "Al-Warits berarti Allah yang mewarisi bumi dan segala isinya setelah semua makhluk binasa. Dia yang kekal setelah semua musnah dan kembali kepada-Nya segala sesuatu.",
    benefits: "Memperbanyak dzikir dengan nama ini akan menumbuhkan sikap zuhud, tidak terlalu mencintai harta, dan menyedekahkan sebelum meninggal.",
    dalil: "\"Sesungguhnya Kami-lah yang mewarisi bumi dan semua yang ada di atasnya.\" (QS. Maryam: 40)"
  },
  {
    id: 98, arabic: "الرَّشِيدُ", latin: "Ar-Rasyid", meaning: "Yang Maha Pandai",
    category: "ilmu",
    explanation: "Ar-Rasyid berarti Allah yang Maha Bijaksana dalam segala ketetapan-Nya. Semua yang ditetapkan-Nya pasti mengandung kebenaran dan kebaikan, tidak ada kesalahan atau kesia-siaan.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi ketepatan dalam mengambil keputusan, kebijaksanaan dalam bertindak, dan diberi petunjuk ke jalan yang benar.",
    dalil: "\"Dan jika Allah menghendaki, niscaya Dia menjadikan kamu satu umat (saja).\" (QS. An-Nahl: 93)"
  },
  {
    id: 99, arabic: "الصَّبُورُ", latin: "As-Sabur", meaning: "Yang Maha Sabar",
    category: "kasih_sayang",
    explanation: "As-Sabur berarti Allah yang tidak tergesa-gesa dalam menghukum hamba yang berbuat maksiat. Dia memberi kesempatan untuk bertaubat dan tidak langsung menimpakan azab meskipun Dia mampu melakukannya.",
    benefits: "Memperbanyak dzikir dengan nama ini akan diberi kesabaran dalam menghadapi cobaan, tidak tergesa-gesa dalam mengambil keputusan, dan diberi ketenangan hati.",
    dalil: "\"Dan bersabarlah kamu bersama orang-orang yang menyeru Tuhannya.\" (QS. Al-Kahf: 28)"
  },
];
