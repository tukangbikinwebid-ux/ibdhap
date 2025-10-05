export interface Artikel {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  views: number;
  image: string;
  featured: boolean;
}

export const artikelData: Artikel[] = [
  {
    id: "1",
    slug: "keutamaan-sholat-berjamaah-di-masjid",
    title: "Keutamaan Sholat Berjamaah di Masjid",
    excerpt:
      "Sholat berjamaah memiliki keutamaan yang sangat besar dalam Islam. Mari kita pelajari bersama keutamaan dan hikmah di balik sholat berjamaah di masjid.",
    content: `
      <h2>Keutamaan Sholat Berjamaah</h2>
      <p>Sholat berjamaah memiliki keutamaan yang sangat besar dalam Islam. Rasulullah SAW bersabda:</p>
      
      <blockquote>
        "Sholat berjamaah lebih utama 27 derajat dibandingkan sholat sendirian." (HR. Bukhari dan Muslim)
      </blockquote>
      
      <h3>Hikmah Sholat Berjamaah</h3>
      <p>Ada beberapa hikmah yang bisa kita ambil dari sholat berjamaah:</p>
      
      <h4>1. Mempererat Ukhuwah Islamiyah</h4>
      <p>Sholat berjamaah mengajarkan kita untuk bersatu, saling mengenal, dan mempererat tali persaudaraan sesama muslim.</p>
      
      <h4>2. Menunjukkan Kekuatan Umat Islam</h4>
      <p>Ketika umat Islam berkumpul di masjid untuk sholat berjamaah, ini menunjukkan kekuatan dan persatuan umat Islam.</p>
      
      <h4>3. Mendapat Pahala Berlipat</h4>
      <p>Setiap langkah menuju masjid akan dicatat sebagai pahala, dan sholat berjamaah mendapat pahala 27 kali lipat.</p>
      
      <h4>4. Belajar Disiplin</h4>
      <p>Sholat berjamaah mengajarkan kita untuk disiplin waktu dan mengikuti imam dengan baik.</p>
      
      <h3>Tips Menjaga Konsistensi Sholat Berjamaah</h3>
      <ul>
        <li>Buat jadwal harian yang teratur</li>
        <li>Pilih masjid yang dekat dengan rumah atau tempat kerja</li>
        <li>Bergabung dengan komunitas muslim di sekitar</li>
        <li>Ingatkan diri dengan keutamaan sholat berjamaah</li>
        <li>Berdoa kepada Allah untuk dimudahkan</li>
      </ul>
      
      <p>Semoga kita semua bisa istiqomah dalam menjalankan sholat berjamaah di masjid. Aamiin.</p>
    `,
    author: "Ustadz Ahmad",
    category: "Fiqih",
    tags: ["Sholat", "Berjamaah", "Masjid", "Ibadah"],
    publishedAt: "2024-01-15",
    readTime: "5 min",
    views: 2300,
    image: "/images/artikel/sholat-berjamaah.jpg",
    featured: true,
  },
  {
    id: "2",
    slug: "hikmah-puasa-sunnah-senin-kamis",
    title: "Hikmah Puasa Sunnah Senin Kamis",
    excerpt:
      "Puasa sunnah Senin Kamis memiliki banyak hikmah dan keutamaan yang luar biasa. Mari kita pelajari hikmah di balik puasa sunnah ini.",
    content: `
      <h2>Keutamaan Puasa Senin Kamis</h2>
      <p>Puasa sunnah Senin Kamis adalah salah satu amalan yang sangat dianjurkan dalam Islam. Rasulullah SAW bersabda:</p>
      
      <blockquote>
        "Amal perbuatan manusia diperiksa pada hari Senin dan Kamis, maka aku suka jika amalku diperiksa dalam keadaan berpuasa." (HR. Tirmidzi)
      </blockquote>
      
      <h3>Hikmah Puasa Senin Kamis</h3>
      
      <h4>1. Hari Diperiksanya Amal</h4>
      <p>Hari Senin dan Kamis adalah hari dimana amal perbuatan manusia diperiksa oleh Allah SWT. Dengan berpuasa, kita berharap amal kita diterima.</p>
      
      <h4>2. Menjaga Kesehatan</h4>
      <p>Puasa memberikan waktu istirahat untuk sistem pencernaan dan membantu detoksifikasi tubuh.</p>
      
      <h4>3. Melatih Kesabaran</h4>
      <p>Puasa mengajarkan kita untuk sabar menahan hawa nafsu dan mengendalikan diri.</p>
      
      <h4>4. Mendekatkan Diri kepada Allah</h4>
      <p>Puasa adalah ibadah yang sangat pribadi antara hamba dan Allah, sehingga bisa meningkatkan kualitas spiritual.</p>
      
      <h3>Cara Melakukan Puasa Senin Kamis</h3>
      <ol>
        <li>Niat puasa di malam hari atau sebelum fajar</li>
        <li>Menahan diri dari makan, minum, dan hal-hal yang membatalkan puasa</li>
        <li>Menjaga lisan dan perbuatan dari hal-hal yang tidak baik</li>
        <li>Memperbanyak dzikir dan doa</li>
        <li>Berbuka dengan yang manis dan air putih</li>
      </ol>
      
      <h3>Tips Konsisten Puasa Senin Kamis</h3>
      <ul>
        <li>Mulai dengan niat yang kuat</li>
        <li>Persiapkan menu sahur dan berbuka yang sehat</li>
        <li>Bergabung dengan komunitas yang sama-sama berpuasa</li>
        <li>Ingatkan diri dengan keutamaan puasa</li>
        <li>Jangan terlalu memaksakan diri jika sakit</li>
      </ul>
      
      <p>Semoga kita semua bisa istiqomah dalam menjalankan puasa sunnah Senin Kamis. Aamiin.</p>
    `,
    author: "Ustadzah Fatimah",
    category: "Ibadah",
    tags: ["Puasa", "Sunnah", "Senin Kamis", "Kesehatan"],
    publishedAt: "2024-01-12",
    readTime: "4 min",
    views: 1800,
    image: "/images/artikel/puasa-sunnah.jpg",
    featured: true,
  },
  {
    id: "3",
    slug: "cara-menjaga-lisan-dalam-kehidupan-sehari-hari",
    title: "Cara Menjaga Lisan dalam Kehidupan Sehari-hari",
    excerpt:
      "Lisan adalah salah satu nikmat Allah yang harus kita jaga dengan baik. Mari kita pelajari cara menjaga lisan dalam kehidupan sehari-hari.",
    content: `
      <h2>Pentingnya Menjaga Lisan</h2>
      <p>Lisan adalah salah satu nikmat Allah yang sangat berharga. Rasulullah SAW bersabda:</p>
      
      <blockquote>
        "Barangsiapa beriman kepada Allah dan hari akhir, hendaklah dia berkata baik atau diam." (HR. Bukhari dan Muslim)
      </blockquote>
      
      <h3>Bahaya Lisan yang Tidak Terjaga</h3>
      
      <h4>1. Ghibah (Menggunjing)</h4>
      <p>Membicarakan aib orang lain di belakang mereka adalah dosa besar yang bisa merusak persaudaraan.</p>
      
      <h4>2. Fitnah</h4>
      <p>Menyebarkan berita bohong atau menuduh orang lain tanpa bukti adalah perbuatan yang sangat tercela.</p>
      
      <h4>3. Ucapan Kotor</h4>
      <p>Mengucapkan kata-kata kotor, kasar, atau tidak pantas bisa merusak akhlak dan hubungan sosial.</p>
      
      <h3>Cara Menjaga Lisan</h3>
      
      <h4>1. Berpikir Sebelum Berbicara</h4>
      <p>Selalu pikirkan dampak dari setiap kata yang akan kita ucapkan sebelum mengatakannya.</p>
      
      <h4>2. Berkata yang Baik atau Diam</h4>
      <p>Jika tidak ada yang baik untuk dikatakan, lebih baik diam. Diam adalah emas.</p>
      
      <h4>3. Menghindari Ghibah</h4>
      <p>Jangan membicarakan aib orang lain, kecuali untuk tujuan yang dibenarkan syariat.</p>
      
      <h4>4. Menggunakan Kata-kata yang Sopan</h4>
      <p>Gunakan kata-kata yang sopan, lembut, dan tidak menyakiti perasaan orang lain.</p>
      
      <h3>Keutamaan Menjaga Lisan</h3>
      <ul>
        <li>Mendapat pahala dari Allah SWT</li>
        <li>Menjaga hubungan baik dengan sesama</li>
        <li>Menghindari dosa dan fitnah</li>
        <li>Meningkatkan kualitas akhlak</li>
        <li>Menjadi teladan yang baik</li>
      </ul>
      
      <h3>Tips Praktis Menjaga Lisan</h3>
      <ol>
        <li>Biasakan berdzikir dan beristighfar</li>
        <li>Bergaul dengan orang-orang yang baik</li>
        <li>Hindari tempat-tempat yang memicu ghibah</li>
        <li>Ingatkan diri dengan konsekuensi dosa lisan</li>
        <li>Minta perlindungan Allah dari kejahatan lisan</li>
      </ol>
      
      <p>Semoga kita semua bisa menjaga lisan dengan baik dalam kehidupan sehari-hari. Aamiin.</p>
    `,
    author: "Ustadz Muhammad",
    category: "Akhlak",
    tags: ["Lisan", "Akhlak", "Ghibah", "Komunikasi"],
    publishedAt: "2024-01-10",
    readTime: "6 min",
    views: 3100,
    image: "/images/artikel/menjaga-lisan.jpg",
    featured: false,
  },
  {
    id: "4",
    slug: "manfaat-membaca-al-quran-setiap-hari",
    title: "Manfaat Membaca Al-Quran Setiap Hari",
    excerpt:
      "Membaca Al-Quran setiap hari memiliki banyak manfaat yang luar biasa. Mari kita pelajari manfaat dan keutamaan membaca Al-Quran.",
    content: `
      <h2>Keutamaan Membaca Al-Quran</h2>
      <p>Al-Quran adalah kitab suci yang penuh dengan keberkahan. Rasulullah SAW bersabda:</p>
      
      <blockquote>
        "Bacalah Al-Quran, karena ia akan datang pada hari kiamat sebagai pemberi syafaat bagi pembacanya." (HR. Muslim)
      </blockquote>
      
      <h3>Manfaat Membaca Al-Quran</h3>
      
      <h4>1. Mendapat Pahala Berlipat</h4>
      <p>Setiap huruf yang dibaca dari Al-Quran akan mendapat pahala. Rasulullah SAW bersabda bahwa satu huruf mendapat 10 pahala.</p>
      
      <h4>2. Menenangkan Hati</h4>
      <p>Al-Quran memiliki kekuatan untuk menenangkan hati dan pikiran yang gelisah.</p>
      
      <h4>3. Menjadi Petunjuk Hidup</h4>
      <p>Al-Quran adalah petunjuk yang jelas untuk menjalani kehidupan yang diridhai Allah.</p>
      
      <h4>4. Meningkatkan Kualitas Ibadah</h4>
      <p>Dengan membaca Al-Quran, kualitas ibadah kita akan semakin baik dan khusyuk.</p>
      
      <h3>Cara Membaca Al-Quran yang Benar</h3>
      
      <h4>1. Dalam Keadaan Suci</h4>
      <p>Sebelum membaca Al-Quran, pastikan kita dalam keadaan suci (berwudhu).</p>
      
      <h4>2. Membaca dengan Tartil</h4>
      <p>Bacalah Al-Quran dengan perlahan dan jelas, tidak terburu-buru.</p>
      
      <h4>3. Memahami Maknanya</h4>
      <p>Usahakan untuk memahami makna dari ayat-ayat yang dibaca.</p>
      
      <h4>4. Membaca dengan Khusyuk</h4>
      <p>Fokuskan pikiran dan hati saat membaca Al-Quran.</p>
      
      <h3>Tips Konsisten Membaca Al-Quran</h3>
      <ul>
        <li>Tentukan target harian (misalnya 1 juz per hari)</li>
        <li>Pilih waktu yang tepat dan konsisten</li>
        <li>Gunakan mushaf yang mudah dibaca</li>
        <li>Bergabung dengan komunitas tilawah</li>
        <li>Gunakan aplikasi Al-Quran digital</li>
        <li>Mintalah bimbingan dari guru mengaji</li>
      </ul>
      
      <h3>Keutamaan Khusus Membaca Al-Quran</h3>
      <ol>
        <li>Mendapat syafaat di hari kiamat</li>
        <li>Meninggikan derajat di surga</li>
        <li>Menjadi keluarga Allah di dunia</li>
        <li>Mendapat pahala yang berlipat ganda</li>
        <li>Menjadi obat untuk berbagai penyakit hati</li>
      </ol>
      
      <p>Semoga kita semua bisa istiqomah dalam membaca Al-Quran setiap hari. Aamiin.</p>
    `,
    author: "Ustadzah Aisyah",
    category: "Al-Quran",
    tags: ["Al-Quran", "Tilawah", "Ibadah", "Pahala"],
    publishedAt: "2024-01-08",
    readTime: "7 min",
    views: 4200,
    image: "/images/artikel/membaca-quran.jpg",
    featured: true,
  },
  {
    id: "5",
    slug: "tips-mengatur-keuangan-menurut-islam",
    title: "Tips Mengatur Keuangan Menurut Islam",
    excerpt:
      "Islam memberikan panduan yang lengkap dalam mengatur keuangan. Mari kita pelajari tips mengatur keuangan sesuai dengan prinsip Islam.",
    content: `
      <h2>Prinsip Keuangan dalam Islam</h2>
      <p>Islam memberikan panduan yang lengkap dalam mengatur keuangan. Allah SWT berfirman:</p>
      
      <blockquote>
        "Dan janganlah kamu serahkan kepada orang-orang yang belum sempurna akalnya, harta (mereka yang ada dalam kekuasaanmu) yang dijadikan Allah sebagai pokok kehidupan." (QS. An-Nisa: 5)
      </blockquote>
      
      <h3>Prinsip Dasar Keuangan Islam</h3>
      
      <h4>1. Harta adalah Amanah</h4>
      <p>Semua harta yang kita miliki adalah amanah dari Allah yang harus dikelola dengan baik.</p>
      
      <h4>2. Menghindari Riba</h4>
      <p>Islam melarang keras praktik riba (bunga) dalam semua bentuk transaksi keuangan.</p>
      
      <h4>3. Zakat dan Sedekah</h4>
      <p>Wajib mengeluarkan zakat dan dianjurkan bersedekah untuk membersihkan harta.</p>
      
      <h4>4. Tidak Berlebihan</h4>
      <p>Hindari hidup berlebihan dan boros, gunakan harta sesuai kebutuhan.</p>
      
      <h3>Tips Mengatur Keuangan Islami</h3>
      
      <h4>1. Buat Anggaran Bulanan</h4>
      <p>Buatlah anggaran bulanan yang mencakup kebutuhan pokok, tabungan, dan sedekah.</p>
      
      <h4>2. Prioritaskan Kebutuhan</h4>
      <p>Utamakan kebutuhan pokok seperti makanan, pakaian, dan tempat tinggal.</p>
      
      <h4>3. Sisihkan untuk Zakat</h4>
      <p>Hitung dan sisihkan zakat yang wajib dikeluarkan setiap tahun.</p>
      
      <h4>4. Tabung untuk Masa Depan</h4>
      <p>Sisihkan sebagian penghasilan untuk tabungan dan investasi halal.</p>
      
      <h3>Investasi Halal dalam Islam</h3>
      <ul>
        <li>Investasi emas dan perak</li>
        <li>Investasi properti</li>
        <li>Investasi saham syariah</li>
        <li>Reksadana syariah</li>
        <li>Deposito syariah</li>
        <li>Bisnis yang halal</li>
      </ul>
      
      <h3>Menghindari Hutang Riba</h3>
      <ol>
        <li>Gunakan kartu kredit dengan bijak</li>
        <li>Hindari pinjaman dengan bunga tinggi</li>
        <li>Pilih bank syariah untuk transaksi</li>
        <li>Gunakan sistem qardhul hasan (pinjaman baik)</li>
        <li>Buat perencanaan keuangan yang matang</li>
      </ol>
      
      <h3>Keutamaan Sedekah</h3>
      <p>Sedekah tidak akan mengurangi harta, bahkan akan menambah keberkahan. Rasulullah SAW bersabda:</p>
      
      <blockquote>
        "Harta tidak akan berkurang karena sedekah." (HR. Muslim)
      </blockquote>
      
      <p>Semoga kita semua bisa mengatur keuangan sesuai dengan prinsip Islam. Aamiin.</p>
    `,
    author: "Ustadz Abdullah",
    category: "Keuangan",
    tags: ["Keuangan", "Zakat", "Investasi", "Sedekah"],
    publishedAt: "2024-01-05",
    readTime: "8 min",
    views: 2800,
    image: "/images/artikel/keuangan-islam.jpg",
    featured: false,
  },
  {
    id: "6",
    slug: "cara-mendidik-anak-menurut-islam",
    title: "Cara Mendidik Anak Menurut Islam",
    excerpt:
      "Mendidik anak adalah tanggung jawab besar yang harus dilakukan dengan penuh kasih sayang dan sesuai dengan ajaran Islam.",
    content: `
      <h2>Tanggung Jawab Mendidik Anak</h2>
      <p>Mendidik anak adalah amanah besar dari Allah SWT. Rasulullah SAW bersabda:</p>
      
      <blockquote>
        "Setiap anak dilahirkan dalam keadaan fitrah, maka kedua orang tuanyalah yang menjadikannya Yahudi, Nasrani, atau Majusi." (HR. Bukhari)
      </blockquote>
      
      <h3>Prinsip Dasar Pendidikan Anak</h3>
      
      <h4>1. Pendidikan Aqidah</h4>
      <p>Ajarkan anak tentang keesaan Allah, rukun iman, dan rukun Islam sejak dini.</p>
      
      <h4>2. Pendidikan Akhlak</h4>
      <p>Bentuk karakter anak dengan akhlak yang mulia sesuai dengan ajaran Islam.</p>
      
      <h4>3. Pendidikan Ibadah</h4>
      <p>Ajarkan anak untuk melaksanakan ibadah dengan benar dan konsisten.</p>
      
      <h4>4. Pendidikan Ilmu</h4>
      <p>Berikan pendidikan yang seimbang antara ilmu dunia dan ilmu akhirat.</p>
      
      <h3>Metode Mendidik Anak</h3>
      
      <h4>1. Keteladanan</h4>
      <p>Orang tua harus menjadi teladan yang baik bagi anak-anaknya.</p>
      
      <h4>2. Kasih Sayang</h4>
      <p>Berikan kasih sayang yang tulus dan tidak berlebihan.</p>
      
      <h4>3. Disiplin yang Bijak</h4>
      <p>Terapkan disiplin dengan cara yang bijak dan tidak kasar.</p>
      
      <h4>4. Komunikasi yang Baik</h4>
      <p>Jalin komunikasi yang baik dan terbuka dengan anak.</p>
      
      <h3>Tahapan Pendidikan Anak</h3>
      
      <h4>Usia 0-7 Tahun</h4>
      <ul>
        <li>Berikan kasih sayang yang penuh</li>
        <li>Ajarkan doa-doa sederhana</li>
        <li>Bentuk kebiasaan baik</li>
        <li>Hindari hukuman fisik</li>
      </ul>
      
      <h4>Usia 7-14 Tahun</h4>
      <ul>
        <li>Ajarkan sholat dan ibadah wajib</li>
        <li>Terapkan disiplin yang tegas</li>
        <li>Ajarkan tanggung jawab</li>
        <li>Bimbing dalam memilih teman</li>
      </ul>
      
      <h4>Usia 14 Tahun ke Atas</h4>
      <ul>
        <li>Jadikan teman diskusi</li>
        <li>Ajarkan kemandirian</li>
        <li>Bimbing dalam memilih jalan hidup</li>
        <li>Persiapkan untuk pernikahan</li>
      </ul>
      
      <h3>Tips Praktis Mendidik Anak</h3>
      <ol>
        <li>Mulai dengan doa dan niat yang baik</li>
        <li>Bersabar dalam menghadapi tingkah laku anak</li>
        <li>Gunakan metode yang sesuai dengan usia anak</li>
        <li>Libatkan anak dalam kegiatan keagamaan</li>
        <li>Berikan pujian untuk perbuatan baik</li>
        <li>Jangan membandingkan dengan anak lain</li>
        <li>Luangkan waktu berkualitas bersama anak</li>
      </ol>
      
      <h3>Doa untuk Anak</h3>
      <p>Selalu panjatkan doa untuk kebaikan anak-anak kita:</p>
      
      <blockquote>
        "Ya Tuhan kami, anugerahkanlah kepada kami pasangan kami dan keturunan kami sebagai penyenang hati (kami), dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa." (QS. Al-Furqan: 74)
      </blockquote>
      
      <p>Semoga kita semua bisa mendidik anak-anak kita dengan baik sesuai dengan ajaran Islam. Aamiin.</p>
    `,
    author: "Ustadzah Khadijah",
    category: "Keluarga",
    tags: ["Anak", "Pendidikan", "Keluarga", "Akhlak"],
    publishedAt: "2024-01-03",
    readTime: "9 min",
    views: 3500,
    image: "/images/artikel/mendidik-anak.jpg",
    featured: false,
  },
];

export const categories = [
  "Semua",
  "Fiqih",
  "Ibadah",
  "Akhlak",
  "Al-Quran",
  "Keuangan",
  "Keluarga",
];

export const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "popular", label: "Terpopuler" },
  { value: "title", label: "Judul A-Z" },
];
