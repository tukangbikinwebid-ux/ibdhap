// i18n Configuration and Translations

export type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface Translations {
  // Home Page
  home: {
    title: string;
    subtitle: string;
    greeting: string;
    features: string;
    quickAccess: string;
    todayPrayer: string;
    currentPrayer: string;
    nextPrayer: string;
    timeRemaining: string;
    minutes: string;
    hours: string;
    viewAll: string;
    loading: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    retry: string;
    close: string;
    save: string;
    cancel: string;
    confirm: string;
    back: string;
    next: string;
    search: string;
  };
  // Widgets
  widgets: {
    quran: string;
    prayer: string;
    qibla: string;
    hijriCalendar: string;
    asmaulHusna: string;
    doa: string;
    hadith: string;
    articles: string;
    store: string;
  };
  // Prayer Page
  prayer: {
    title: string;
    subtitle: string;
    currentLocation: string;
    locationNotSet: string;
    useCurrentLocation: string;
    gettingLocation: string;
    locationRequired: string;
    locationRequiredDesc: string;
    allowLocationAccess: string;
    prayerSchedule: string;
    todaySchedule: string;
    currentlyOngoing: string;
    completed: string;
    adhanReminder: string;
    adhanActive: string;
    activateReminder: string;
    active: string;
    inactive: string;
    testAdhan: string;
    playingAdhan: string;
    stop: string;
    test: string;
    scheduledPrayers: string;
    allPrayersPassed: string;
    allowNotification: string;
    prayerNames: {
      fajr: string;
      dhuhr: string;
      asr: string;
      maghrib: string;
      isha: string;
    };
  };
  // Quran Page
  quran: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    readQuran: string;
    startFromFatihah: string;
    bookmark: string;
    surahSaved: string;
    savedSurahs: string;
    noBookmarks: string;
    recentlyRead: string;
    allSurahs: string;
    loading: string;
    surah: string;
    verses: string;
    juz: string;
    revelation: {
      all: string;
      meccan: string;
      medinan: string;
    };
  };
  // Kajian Page
  kajian: {
    title: string;
    subtitle: string;
    latestKajian: string;
    listenKajian: string;
    searchPlaceholder: string;
    sortBy: string;
    newest: string;
    oldest: string;
    ustadz: string;
    allUstadz: string;
    resetFilter: string;
    kajianList: string;
    kajian: string;
    noKajianFound: string;
    noKajianMatch: string;
    quickAccess: string;
    getNotifications: string;
  };
  // Prayer Tracker Page
  prayerTracker: {
    title: string;
    subtitle: string;
    loading: string;
    today: string;
    monthly: string;
    loadingSchedule: string;
    failedToLoad: string;
    checkConnection: string;
    motivationalQuote: string;
  };
  // Qibla Page
  qibla: {
    title: string;
    detectingLocation: string;
    ensureGpsActive: string;
    failedToGetLocation: string;
    tryAgain: string;
    facingQibla: string;
    rotateDevice: string;
    qiblaDirection: string;
    distanceToKaaba: string;
    enableRealtimeCompass: string;
    compassActive: string;
    moveDevice: string;
    accuracyTips: string;
    tips: {
      enableGps: string;
      avoidMetal: string;
      calibrateCompass: string;
      holdHorizontal: string;
    };
    compassCalibration: string;
    calibrationDescription: string;
    calibrationMovement: string;
    accuracy: {
      high: string;
      medium: string;
      low: string;
      detecting: string;
    };
    directions: {
      north: string;
      northeast: string;
      east: string;
      southeast: string;
      south: string;
      southwest: string;
      west: string;
      northwest: string;
    };
  };
  // Tajwid Page
  tajwid: {
    title: string;
    learningProgress: string;
    overallProgress: string;
    lessonsCompleted: string;
    materialsMastered: string;
    selectLesson: string;
    materials: string;
    completed: string;
    finished: string;
    back: string;
    explanation: string;
    example: string;
    listen: string;
    pause: string;
    alreadyMastered: string;
    markComplete: string;
    difficulty: {
      easy: string;
      medium: string;
      hard: string;
      unknown: string;
    };
    categories: {
      makharij: string;
      sifat: string;
      ahkam: string;
      wafq: string;
      category: string;
    };
  };
  // Hadith Page
  hadith: {
    title: string;
    selectedHadith: string;
    favorite: string;
    searchPlaceholder: string;
    allBooks: string;
    selectBook: string;
    hadithList: string;
    showing: string;
    noHadithFound: string;
    tryDifferentKeyword: string;
    previous: string;
    next: string;
    hadiths: string;
  };
  // Halal Page
  halal: {
    title: string;
    subtitle: string;
    halalCertified: string;
    findNearby: string;
    restaurantsFound: string;
    in: string;
    restaurants: string;
    menu: string;
    menuAvailable: string;
    noRestaurantsFound: string;
    tryDifferentFilter: string;
    motivationalQuote: string;
  };
  // Donation Page
  donation: {
    title: string;
    subtitle: string;
    donationList: string;
    selectDonation: string;
    donations: string;
    progress: string;
    days: string;
    donateNow: string;
    needHelp: string;
    helpDescription: string;
    favoriteDonation: string;
    share: string;
    donationHistory: string;
    motivationalQuote: string;
    donorName: string;
    donorNameRequired: string;
    email: string;
    emailOptional: string;
    phone: string;
    phoneOptional: string;
    donationAmount: string;
    donationAmountRequired: string;
    minimumDonation: string;
    message: string;
    messageOptional: string;
    paymentMethod: string;
    selectBank: string;
    scanQRIS: string;
    transferInstructions: string;
    accountNumber: string;
    confirmPayment: string;
    processing: string;
    donationSuccess: string;
    pleasePay: string;
    noDonationsAvailable: string;
    page: string;
    of: string;
    previous: string;
    next: string;
  };
  // Mosque Page
  mosque: {
    title: string;
    locationNotDetected: string;
    activateGps: string;
    locationDetected: string;
    searchRadius: string;
    dragToExpand: string;
    all: string;
    mosque: string;
    mushola: string;
    distance: string;
    rating: string;
    name: string;
    loading: string;
    searchingNearby: string;
    placesFound: string;
    open24Hours: string;
    closed: string;
    facilities: string;
    navigate: string;
    noPlacesFound: string;
    expandRadius: string;
    km: string;
  };
  // Event Page
  event: {
    title: string;
    subtitle: string;
    all: string;
    online: string;
    offline: string;
    loading: string;
    failedToLoad: string;
    registerNow: string;
    noEvents: string;
    noEventsInCategory: string;
  };
  // Tasbih Digital Page
  tasbih: {
    title: string;
    settings: string;
    guide: string;
    selectDhikr: string;
    targetCount: string;
    currentCount: string;
    progress: string;
    lastReset: string;
    press: string;
    resetCount: string;
    completed: string;
    guideStep1: string;
    guideStep2: string;
    guideStep3: string;
  };
  // Article Page
  article: {
    title: string;
    searchPlaceholder: string;
    trendingToday: string;
    category: string;
    all: string;
    articlesFound: string;
    resetFilter: string;
    read: string;
    noArticlesFound: string;
    tryDifferentKeyword: string;
    viewAllArticles: string;
    min: string;
  };
  // Ask Ustadz Page
  askUstadz: {
    title: string;
    subtitle: string;
    askQuestion: string;
    totalQuestions: string;
    answered: string;
    activeUstadz: string;
    popular: string;
    questionList: string;
    questions: string;
    motivationalQuote: string;
  };
  // Hijri Calendar Page
  hijriCalendar: {
    title: string;
    today: string;
    previous: string;
    next: string;
    importantDays: string;
    noImportantDays: string;
    information: string;
    infoDescription: string;
    explanation: string;
    selectedDate: string;
    importantDay: string;
    todayMarker: string;
  };
  // Template Letter Page
  templateLetter: {
    title: string;
    searchPlaceholder: string;
    loading: string;
    failedToLoad: string;
    tryAgain: string;
    download: string;
    notFound: string;
    tryDifferentKeyword: string;
    needOtherFormat: string;
    contactAdmin: string;
  };
  // Inheritance Calculator Page
  inheritance: {
    title: string;
    inheritanceInfo: string;
    deceasedGender: string;
    male: string;
    female: string;
    totalInheritance: string;
    heirs: string;
    father: string;
    mother: string;
    wife: string;
    husband: string;
    son: string;
    daughter: string;
    calculate: string;
    calculationResult: string;
    total: string;
    perPerson: string;
    share: string;
    remaining: string;
    totalGroup: string;
    people: string;
    remainingInheritance: string;
    remainingDescription: string;
    disclaimer: string;
  };
  // Zakat Calculator Page
  zakatCalculator: {
    title: string;
    zakatProfesi: string;
    zakatMaal: string;
    goldPricePerGram: string;
    enterFinancialData: string;
    monthlyIncome: string;
    bonus: string;
    debt: string;
    savings: string;
    goldSilver: string;
    assets: string;
    reset: string;
    calculateZakat: string;
    zakatObligatory: string;
    zakatNotObligatory: string;
    assetsReachedNisab: string;
    assetsNotReachedNisab: string;
    totalZakatToPay: string;
    lastCalculated: string;
    currency: string;
  };
  // E-Book Page
  ebook: {
    title: string;
    subtitle: string;
    selectedCategory: string;
    noBooksInCategory: string;
    freeDownload: string;
    freeDownloadDescription: string;
    pages: string;
    rating: string;
    downloads: string;
    loading: string;
  };
}

export const translations: Record<LocaleCode, Translations> = {
  id: {
    home: {
      title: "IbadahApp",
      subtitle: "Aplikasi Ibadah Digital Anda",
      greeting: "Selamat Datang",
      features: "Fitur",
      quickAccess: "Akses Cepat",
      todayPrayer: "Jadwal Sholat Hari Ini",
      currentPrayer: "Sholat Saat Ini",
      nextPrayer: "Sholat Berikutnya",
      timeRemaining: "Waktu Tersisa",
      minutes: "menit",
      hours: "jam",
      viewAll: "Lihat Semua",
      loading: "Memuat...",
    },
    common: {
      loading: "Memuat...",
      error: "Terjadi kesalahan",
      retry: "Coba Lagi",
      close: "Tutup",
      save: "Simpan",
      cancel: "Batal",
      confirm: "Konfirmasi",
      back: "Kembali",
      next: "Selanjutnya",
      search: "Cari",
    },
    widgets: {
      quran: "Al-Quran",
      prayer: "Jadwal Sholat",
      qibla: "Arah Kiblat",
      hijriCalendar: "Kalender Hijriyah",
      asmaulHusna: "Asmaul Husna",
      doa: "Doa & Dzikir",
      hadith: "Hadits",
      articles: "Artikel",
      store: "Toko",
    },
    quran: {
      title: "Al-Qur'an",
      subtitle: "Kitab suci umat Islam",
      searchPlaceholder: "Cari surah (Latin, Arti, Arab)...",
      readQuran: "Baca Al-Qur'an",
      startFromFatihah: "Mulai dari Al-Fatihah",
      bookmark: "Bookmark",
      surahSaved: "surah tersimpan",
      savedSurahs: "Surah Tersimpan",
      noBookmarks: "Belum ada surah yang dibookmark",
      recentlyRead: "Baru Dibaca",
      allSurahs: "Semua Surah",
      loading: "Memuat...",
      surah: "surah",
      verses: "ayat",
      juz: "Juz",
      revelation: {
        all: "Semua",
        meccan: "Makkiyah",
        medinan: "Madaniyah",
      },
    },
    kajian: {
      title: "Kajian Islam",
      subtitle: "Belajar dan memperdalam ilmu agama",
      latestKajian: "Kajian Islam Terbaru",
      listenKajian: "Dengarkan kajian pilihan dari para ustadz",
      searchPlaceholder: "Cari kajian, ustadz, atau topik...",
      sortBy: "Urutkan",
      newest: "Terbaru",
      oldest: "Terlama",
      ustadz: "Ustadz",
      allUstadz: "Semua Ustadz",
      resetFilter: "Reset Filter",
      kajianList: "Daftar Kajian",
      kajian: "kajian",
      noKajianFound: "Belum ada kajian ditemukan",
      noKajianMatch: "Tidak ada kajian yang sesuai dengan filter",
      quickAccess: "Akses Cepat",
      getNotifications: "Dapatkan notifikasi kajian terbaru dan jadwal live streaming",
    },
    prayerTracker: {
      title: "Prayer Tracker",
      subtitle: "Pantau progress sholat harian",
      loading: "Memuat jadwal sholat...",
      today: "Hari Ini",
      monthly: "Bulanan",
      loadingSchedule: "Memuat jadwal sholat...",
      failedToLoad: "Gagal memuat jadwal sholat. Periksa koneksi internet.",
      checkConnection: "Periksa koneksi internet",
      motivationalQuote: "Dan dirikanlah sholat untuk mengingat-Ku",
    },
    qibla: {
      title: "Arah Kiblat",
      detectingLocation: "Mendeteksi Lokasi...",
      ensureGpsActive: "Pastikan GPS aktif dan izinkan akses lokasi",
      failedToGetLocation: "Gagal Mendapatkan Lokasi",
      tryAgain: "Coba Lagi",
      facingQibla: "Anda Menghadap Kiblat!",
      rotateDevice: "Putar perangkat ke arah jarum",
      qiblaDirection: "Arah Kiblat",
      distanceToKaaba: "Jarak ke Ka'bah",
      enableRealtimeCompass: "Aktifkan Kompas Real-time",
      compassActive: "Kompas aktif - Gerakkan perangkat Anda",
      moveDevice: "Gerakkan perangkat Anda",
      accuracyTips: "Tips Akurasi Maksimal",
      tips: {
        enableGps: "Aktifkan GPS/Lokasi di pengaturan perangkat",
        avoidMetal: "Jauhkan dari benda logam atau magnet",
        calibrateCompass: "Kalibrasi kompas dengan gerakan angka 8",
        holdHorizontal: "Pegang perangkat secara horizontal",
      },
      compassCalibration: "Kalibrasi Kompas",
      calibrationDescription: "Jika jarum tidak akurat, gerakkan perangkat membentuk angka 8 di udara beberapa kali untuk mengkalibrasi sensor kompas.",
      calibrationMovement: "Gerakan kalibrasi",
      accuracy: {
        high: "Akurasi Tinggi",
        medium: "Akurasi Sedang",
        low: "Akurasi Rendah",
        detecting: "Mendeteksi...",
      },
      directions: {
        north: "Utara",
        northeast: "Timur Laut",
        east: "Timur",
        southeast: "Tenggara",
        south: "Selatan",
        southwest: "Barat Daya",
        west: "Barat",
        northwest: "Barat Laut",
      },
    },
    tajwid: {
      title: "Belajar Tajwid",
      learningProgress: "Progress Belajar",
      overallProgress: "Progress Keseluruhan",
      lessonsCompleted: "Pelajaran Selesai",
      materialsMastered: "Materi Dikuasai",
      selectLesson: "Pilih Pelajaran",
      materials: "materi",
      completed: "Selesai",
      finished: "selesai",
      back: "Kembali",
      explanation: "Penjelasan",
      example: "Contoh",
      listen: "Dengarkan",
      pause: "Pause",
      alreadyMastered: "Sudah Dikuasai",
      markComplete: "Tandai Selesai",
      difficulty: {
        easy: "Mudah",
        medium: "Sedang",
        hard: "Sulit",
        unknown: "Tidak diketahui",
      },
      categories: {
        makharij: "Makharijul Huruf",
        sifat: "Sifatul Huruf",
        ahkam: "Ahkamul Huruf",
        wafq: "Wafq",
        category: "Kategori",
      },
    },
    hadith: {
      title: "Hadist & Sunnah",
      selectedHadith: "Hadist Pilihan",
      favorite: "Favorit",
      searchPlaceholder: "Cari dalam halaman ini...",
      allBooks: "Semua Kitab",
      selectBook: "Pilih Kitab Hadits",
      hadithList: "Daftar Hadits",
      showing: "Menampilkan",
      noHadithFound: "Tidak ada hadist ditemukan",
      tryDifferentKeyword: "Coba ubah kata kunci pencarian",
      previous: "Sebelumnya",
      next: "Selanjutnya",
      hadiths: "hadits",
    },
    halal: {
      title: "Restoran Halal",
      subtitle: "Temukan tempat makan halal terdekat",
      halalCertified: "Halal Certified",
      findNearby: "Temukan tempat makan halal terdekat",
      restaurantsFound: "restoran halal ditemukan",
      in: "di",
      restaurants: "Restoran",
      menu: "Menu",
      menuAvailable: "menu tersedia",
      noRestaurantsFound: "Tidak ada restoran ditemukan",
      tryDifferentFilter: "Coba ubah filter atau pilih kota lain",
      motivationalQuote: "Makanlah dari rezeki yang halal dan baik yang telah Allah berikan kepadamu",
    },
    donation: {
      title: "Donasi & Sedekah",
      subtitle: "Berikan donasi terbaik Anda untuk kemaslahatan umat. Setiap rupiah yang Anda berikan akan membantu sesama yang membutuhkan.",
      donationList: "Daftar Donasi",
      selectDonation: "Pilih donasi yang ingin Anda dukung",
      donations: "Donasi",
      progress: "Progress",
      days: "hari",
      donateNow: "Donasi Sekarang",
      needHelp: "Butuh Bantuan?",
      helpDescription: "Tim kami siap membantu Anda dalam proses donasi",
      favoriteDonation: "Donasi Favorit",
      share: "Bagikan",
      donationHistory: "Riwayat Donasi",
      motivationalQuote: "Sesungguhnya sedekah itu akan memadamkan panas kubur bagi pelakunya, dan sesungguhnya di hari kiamat seorang mukmin akan berlindung di bawah naungan sedekahnya",
      donorName: "Nama Donor",
      donorNameRequired: "Nama Donor",
      email: "Email (Opsional)",
      emailOptional: "Email (Opsional)",
      phone: "No. Telepon (Opsional)",
      phoneOptional: "No. Telepon (Opsional)",
      donationAmount: "Nominal Donasi (Rp)",
      donationAmountRequired: "Nominal Donasi (Rp)",
      minimumDonation: "Minimum donasi: Rp 10.000",
      message: "Pesan/Doa (Opsional)",
      messageOptional: "Pesan/Doa (Opsional)",
      paymentMethod: "Metode Pembayaran",
      selectBank: "Pilih Bank",
      scanQRIS: "Scan QRIS di atas menggunakan e-wallet (Gopay, OVO, Dana) atau Mobile Banking.",
      transferInstructions: "Mohon transfer sesuai nominal hingga 3 digit terakhir untuk verifikasi otomatis.",
      accountNumber: "Nomor Rekening",
      confirmPayment: "Konfirmasi Pembayaran",
      processing: "Memproses...",
      donationSuccess: "Donasi berhasil dibuat! Silakan lakukan pembayaran.",
      pleasePay: "Silakan lakukan pembayaran.",
      noDonationsAvailable: "Belum ada donasi tersedia saat ini",
      page: "Halaman",
      of: "dari",
      previous: "Sebelumnya",
      next: "Selanjutnya",
    },
    mosque: {
      title: "Masjid & Mushola",
      locationNotDetected: "Lokasi belum terdeteksi",
      activateGps: "Aktifkan GPS",
      locationDetected: "Lokasi terdeteksi",
      searchRadius: "Radius Pencarian",
      dragToExpand: "Geser untuk memperluas jangkauan area",
      all: "Semua",
      mosque: "Masjid",
      mushola: "Mushola",
      distance: "Jarak",
      rating: "Rating",
      name: "Nama",
      loading: "Memuat...",
      searchingNearby: "Mencari tempat ibadah terdekat",
      placesFound: "Tempat Ibadah Ditemukan",
      open24Hours: "Buka 24 Jam",
      closed: "Tutup",
      facilities: "Fasilitas:",
      navigate: "Navigasi",
      noPlacesFound: "Tidak ada tempat ibadah ditemukan",
      expandRadius: "Coba perluas radius pencarian menjadi",
      km: "km",
    },
    event: {
      title: "Agenda & Kajian",
      subtitle: "Temukan majelis ilmu terdekat",
      all: "Semua",
      online: "Online",
      offline: "Offline",
      loading: "Memuat agenda...",
      failedToLoad: "Gagal memuat data event.",
      registerNow: "Daftar Sekarang",
      noEvents: "Tidak ada event",
      noEventsInCategory: "Belum ada jadwal untuk kategori ini.",
    },
    tasbih: {
      title: "Tasbih Digital",
      settings: "Pengaturan",
      guide: "Panduan",
      selectDhikr: "Pilih Dzikir",
      targetCount: "Target Hitungan",
      currentCount: "Hitungan Saat Ini",
      progress: "Progress",
      lastReset: "Terakhir direset:",
      press: "Tekan",
      resetCount: "Reset Hitungan",
      completed: "Selesai",
      guideStep1: "Tekan lingkaran besar untuk menambah hitungan dzikir",
      guideStep2: "Klik ikon pengaturan untuk mengubah jenis dzikir dan target",
      guideStep3: "Gunakan tombol reset untuk memulai hitungan dari awal",
    },
    article: {
      title: "Artikel Islami",
      searchPlaceholder: "Cari artikel yang Anda butuhkan...",
      trendingToday: "Trending Hari Ini",
      category: "Kategori",
      all: "Semua",
      articlesFound: "artikel ditemukan",
      resetFilter: "Reset Filter",
      read: "Baca",
      noArticlesFound: "Tidak ada artikel ditemukan",
      tryDifferentKeyword: "Coba ubah kata kunci pencarian atau filter kategori",
      viewAllArticles: "Lihat Semua Artikel",
      min: "min",
    },
    askUstadz: {
      title: "Tanya Ustadz",
      subtitle: "Ajukan pertanyaan tentang Islam kepada ustadz yang berkompeten. Dapatkan jawaban yang tepat dan terpercaya.",
      askQuestion: "Ajukan Pertanyaan",
      totalQuestions: "Total Pertanyaan",
      answered: "Terjawab",
      activeUstadz: "Ustadz Aktif",
      popular: "Populer",
      questionList: "Daftar Pertanyaan",
      questions: "pertanyaan",
      motivationalQuote: "Menuntut ilmu adalah kewajiban bagi setiap muslim",
    },
    hijriCalendar: {
      title: "Kalender Hijriyah",
      today: "Hari Ini",
      previous: "Sebelumnya",
      next: "Selanjutnya",
      importantDays: "Hari Besar",
      noImportantDays: "Tidak ada hari besar di bulan ini",
      information: "Informasi",
      infoDescription: "Klik pada tanggal di kalender untuk melihat detail hari besar. Tanggal yang memiliki tanda titik atau ikon adalah hari-hari penting dalam Islam.",
      explanation: "Penjelasan",
      selectedDate: "Tanggal Terpilih",
      importantDay: "Hari Besar",
      todayMarker: "Hari Ini",
    },
    templateLetter: {
      title: "Template Surat",
      searchPlaceholder: "Cari surat...",
      loading: "Memuat template...",
      failedToLoad: "Gagal memuat data.",
      tryAgain: "Coba Lagi",
      download: "Unduh",
      notFound: "Tidak ditemukan",
      tryDifferentKeyword: "Coba cari dengan kata kunci lain",
      needOtherFormat: "Butuh format lain?",
      contactAdmin: "Hubungi admin untuk request surat.",
    },
    inheritance: {
      title: "Kalkulator Waris",
      inheritanceInfo: "Informasi Harta & Pewaris",
      deceasedGender: "Jenis Kelamin Pewaris (Yang Meninggal)",
      male: "Laki-laki",
      female: "Perempuan",
      totalInheritance: "Total Harta Warisan (Rp)",
      heirs: "Ahli Waris",
      father: "Ayah",
      mother: "Ibu",
      wife: "Istri",
      husband: "Suami",
      son: "Anak Laki-laki",
      daughter: "Anak Perempuan",
      calculate: "Hitung Pembagian",
      calculationResult: "Hasil Perhitungan",
      total: "Total:",
      perPerson: "Per orang",
      share: "Bagian:",
      remaining: "Sisa Harta",
      totalGroup: "Total Golongan:",
      people: "Orang",
      remainingInheritance: "Sisa Harta (Radd)",
      remainingDescription: "Terdapat sisa harta yang tidak habis dibagi oleh Ashabul Furud. Sisa ini biasanya dikembalikan ke ahli waris nasab sebanding bagian mereka.",
      disclaimer: "*Perhitungan ini menggunakan simulasi dasar untuk keluarga inti. Untuk kasus kompleks (Kakek, Nenek, Saudara, Kalalah), mohon konsultasikan dengan Ulama atau ahli waris terpercaya.",
    },
    zakatCalculator: {
      title: "Kalkulator Zakat",
      zakatProfesi: "Zakat Profesi",
      zakatMaal: "Zakat Maal",
      goldPricePerGram: "Harga Emas /gram",
      enterFinancialData: "Masukkan Data Keuangan",
      monthlyIncome: "Penghasilan Bulanan",
      bonus: "Bonus / THR / Lainnya",
      debt: "Hutang / Cicilan Jatuh Tempo",
      savings: "Tabungan / Deposito / Kas",
      goldSilver: "Emas / Perak (Konversi Rp)",
      assets: "Saham / Surat Berharga",
      reset: "Reset",
      calculateZakat: "Hitung Zakat",
      zakatObligatory: "Wajib Zakat",
      zakatNotObligatory: "Belum Wajib Zakat",
      assetsReachedNisab: "Harta Anda telah mencapai Nisab",
      assetsNotReachedNisab: "Harta belum mencapai Nisab",
      totalZakatToPay: "Total Zakat Harus Dikeluarkan",
      lastCalculated: "Terakhir dihitung",
      currency: "IDR",
    },
    ebook: {
      title: "E-Book Islam",
      subtitle: "Koleksi buku digital Islam",
      selectedCategory: "Kategori Pilihan",
      noBooksInCategory: "Belum ada buku di kategori ini.",
      freeDownload: "Download Gratis",
      freeDownloadDescription: "Semua e-book tersedia gratis untuk pembelajaran dan dakwah",
      pages: "hlm",
      rating: "Rating",
      downloads: "Download",
      loading: "Memuat...",
    },
    prayer: {
      title: "Jadwal Sholat",
      subtitle: "Waktu sholat berdasarkan lokasi Anda",
      currentLocation: "Lokasi Saat Ini",
      locationNotSet: "Lokasi belum ditentukan",
      useCurrentLocation: "Gunakan Lokasi Saat Ini",
      gettingLocation: "Mendapatkan lokasi...",
      locationRequired: "Lokasi Diperlukan",
      locationRequiredDesc: "Untuk menampilkan jadwal sholat yang akurat, aplikasi memerlukan akses ke lokasi Anda.",
      allowLocationAccess: "Izinkan Akses Lokasi",
      prayerSchedule: "Jadwal Sholat Hari Ini",
      todaySchedule: "Jadwal Sholat Hari Ini",
      currentlyOngoing: "Sedang berlangsung",
      completed: "Selesai",
      adhanReminder: "Pengingat Adzan",
      adhanActive: "Adzan otomatis aktif",
      activateReminder: "Aktifkan untuk pengingat otomatis",
      active: "Aktif",
      inactive: "Nonaktif",
      testAdhan: "Test suara adzan",
      playingAdhan: "Memutar adzan",
      stop: "Stop",
      test: "Test",
      scheduledPrayers: "Jadwal adzan yang akan diputar hari ini:",
      allPrayersPassed: "Semua waktu sholat hari ini sudah lewat",
      allowNotification: "Izinkan notifikasi browser untuk pengalaman terbaik",
      prayerNames: {
        fajr: "Subuh",
        dhuhr: "Dzuhur",
        asr: "Ashar",
        maghrib: "Maghrib",
        isha: "Isya",
      },
    },
  },
  en: {
    home: {
      title: "IbadahApp",
      subtitle: "Your Digital Worship App",
      greeting: "Welcome",
      features: "Features",
      quickAccess: "Quick Access",
      todayPrayer: "Today's Prayer Times",
      currentPrayer: "Current Prayer",
      nextPrayer: "Next Prayer",
      timeRemaining: "Time Remaining",
      minutes: "minutes",
      hours: "hours",
      viewAll: "View All",
      loading: "Loading...",
    },
    common: {
      loading: "Loading...",
      error: "An error occurred",
      retry: "Retry",
      close: "Close",
      save: "Save",
      cancel: "Cancel",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      search: "Search",
    },
    widgets: {
      quran: "Quran",
      prayer: "Prayer Times",
      qibla: "Qibla Direction",
      hijriCalendar: "Hijri Calendar",
      asmaulHusna: "Asmaul Husna",
      doa: "Prayers & Dhikr",
      hadith: "Hadith",
      articles: "Articles",
      store: "Store",
    },
    quran: {
      title: "Al-Qur'an",
      subtitle: "The Holy Book of Islam",
      searchPlaceholder: "Search surah (Latin, Meaning, Arabic)...",
      readQuran: "Read Al-Qur'an",
      startFromFatihah: "Start from Al-Fatihah",
      bookmark: "Bookmark",
      surahSaved: "surahs saved",
      savedSurahs: "Saved Surahs",
      noBookmarks: "No bookmarked surahs yet",
      recentlyRead: "Recently Read",
      allSurahs: "All Surahs",
      loading: "Loading...",
      surah: "surah",
      verses: "verses",
      juz: "Juz",
      revelation: {
        all: "All",
        meccan: "Meccan",
        medinan: "Medinan",
      },
    },
    kajian: {
      title: "Islamic Study",
      subtitle: "Learn and deepen religious knowledge",
      latestKajian: "Latest Islamic Study",
      listenKajian: "Listen to selected studies from scholars",
      searchPlaceholder: "Search study, scholar, or topic...",
      sortBy: "Sort By",
      newest: "Newest",
      oldest: "Oldest",
      ustadz: "Scholar",
      allUstadz: "All Scholars",
      resetFilter: "Reset Filter",
      kajianList: "Study List",
      kajian: "studies",
      noKajianFound: "No studies found yet",
      noKajianMatch: "No studies match the filter",
      quickAccess: "Quick Access",
      getNotifications: "Get notifications for latest studies and live streaming schedule",
    },
    prayerTracker: {
      title: "Prayer Tracker",
      subtitle: "Track your daily prayer progress",
      loading: "Loading prayer schedule...",
      today: "Today",
      monthly: "Monthly",
      loadingSchedule: "Loading prayer schedule...",
      failedToLoad: "Failed to load prayer schedule. Check your internet connection.",
      checkConnection: "Check your internet connection",
      motivationalQuote: "And establish prayer for My remembrance",
    },
    qibla: {
      title: "Qibla Direction",
      detectingLocation: "Detecting Location...",
      ensureGpsActive: "Ensure GPS is active and allow location access",
      failedToGetLocation: "Failed to Get Location",
      tryAgain: "Try Again",
      facingQibla: "You Are Facing Qibla!",
      rotateDevice: "Rotate device towards arrow",
      qiblaDirection: "Qibla Direction",
      distanceToKaaba: "Distance to Kaaba",
      enableRealtimeCompass: "Enable Real-time Compass",
      compassActive: "Compass active - Move your device",
      moveDevice: "Move your device",
      accuracyTips: "Maximum Accuracy Tips",
      tips: {
        enableGps: "Enable GPS/Location in device settings",
        avoidMetal: "Keep away from metal or magnetic objects",
        calibrateCompass: "Calibrate compass with figure-8 movement",
        holdHorizontal: "Hold device horizontally",
      },
      compassCalibration: "Compass Calibration",
      calibrationDescription: "If the needle is not accurate, move the device in a figure-8 pattern in the air several times to calibrate the compass sensor.",
      calibrationMovement: "Calibration movement",
      accuracy: {
        high: "High Accuracy",
        medium: "Medium Accuracy",
        low: "Low Accuracy",
        detecting: "Detecting...",
      },
      directions: {
        north: "North",
        northeast: "Northeast",
        east: "East",
        southeast: "Southeast",
        south: "South",
        southwest: "Southwest",
        west: "West",
        northwest: "Northwest",
      },
    },
    tajwid: {
      title: "Learn Tajwid",
      learningProgress: "Learning Progress",
      overallProgress: "Overall Progress",
      lessonsCompleted: "Lessons Completed",
      materialsMastered: "Materials Mastered",
      selectLesson: "Select Lesson",
      materials: "materials",
      completed: "Completed",
      finished: "finished",
      back: "Back",
      explanation: "Explanation",
      example: "Example",
      listen: "Listen",
      pause: "Pause",
      alreadyMastered: "Already Mastered",
      markComplete: "Mark Complete",
      difficulty: {
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        unknown: "Unknown",
      },
      categories: {
        makharij: "Makharijul Huruf",
        sifat: "Sifatul Huruf",
        ahkam: "Ahkamul Huruf",
        wafq: "Wafq",
        category: "Category",
      },
    },
    hadith: {
      title: "Hadith & Sunnah",
      selectedHadith: "Selected Hadith",
      favorite: "Favorite",
      searchPlaceholder: "Search in this page...",
      allBooks: "All Books",
      selectBook: "Select Hadith Book",
      hadithList: "Hadith List",
      showing: "Showing",
      noHadithFound: "No hadith found",
      tryDifferentKeyword: "Try a different search keyword",
      previous: "Previous",
      next: "Next",
      hadiths: "hadiths",
    },
    halal: {
      title: "Halal Restaurants",
      subtitle: "Find nearby halal dining places",
      halalCertified: "Halal Certified",
      findNearby: "Find nearby halal dining places",
      restaurantsFound: "halal restaurants found",
      in: "in",
      restaurants: "Restaurants",
      menu: "Menu",
      menuAvailable: "menu available",
      noRestaurantsFound: "No restaurants found",
      tryDifferentFilter: "Try changing filters or select another city",
      motivationalQuote: "Eat from the lawful and good things which Allah has provided for you",
    },
    donation: {
      title: "Donation & Charity",
      subtitle: "Give your best donation for the benefit of the ummah. Every rupiah you give will help those in need.",
      donationList: "Donation List",
      selectDonation: "Select the donation you want to support",
      donations: "Donations",
      progress: "Progress",
      days: "days",
      donateNow: "Donate Now",
      needHelp: "Need Help?",
      helpDescription: "Our team is ready to help you in the donation process",
      favoriteDonation: "Favorite Donation",
      share: "Share",
      donationHistory: "Donation History",
      motivationalQuote: "Indeed, charity extinguishes the heat of the grave for its doer, and indeed on the Day of Judgment a believer will take shelter under the shade of his charity",
      donorName: "Donor Name",
      donorNameRequired: "Donor Name",
      email: "Email (Optional)",
      emailOptional: "Email (Optional)",
      phone: "Phone Number (Optional)",
      phoneOptional: "Phone Number (Optional)",
      donationAmount: "Donation Amount (Rp)",
      donationAmountRequired: "Donation Amount (Rp)",
      minimumDonation: "Minimum donation: Rp 10,000",
      message: "Message/Prayer (Optional)",
      messageOptional: "Message/Prayer (Optional)",
      paymentMethod: "Payment Method",
      selectBank: "Select Bank",
      scanQRIS: "Scan the QRIS above using e-wallet (Gopay, OVO, Dana) or Mobile Banking.",
      transferInstructions: "Please transfer according to the amount up to the last 3 digits for automatic verification.",
      accountNumber: "Account Number",
      confirmPayment: "Confirm Payment",
      processing: "Processing...",
      donationSuccess: "Donation created successfully! Please make payment.",
      pleasePay: "Please make payment.",
      noDonationsAvailable: "No donations available at this time",
      page: "Page",
      of: "of",
      previous: "Previous",
      next: "Next",
    },
    mosque: {
      title: "Mosque & Prayer Room",
      locationNotDetected: "Location not detected",
      activateGps: "Activate GPS",
      locationDetected: "Location detected",
      searchRadius: "Search Radius",
      dragToExpand: "Drag to expand search range",
      all: "All",
      mosque: "Mosque",
      mushola: "Prayer Room",
      distance: "Distance",
      rating: "Rating",
      name: "Name",
      loading: "Loading...",
      searchingNearby: "Searching for nearby places of worship",
      placesFound: "Places of Worship Found",
      open24Hours: "Open 24 Hours",
      closed: "Closed",
      facilities: "Facilities:",
      navigate: "Navigate",
      noPlacesFound: "No places of worship found",
      expandRadius: "Try expanding search radius to",
      km: "km",
    },
    event: {
      title: "Agenda & Study",
      subtitle: "Find nearby knowledge gatherings",
      all: "All",
      online: "Online",
      offline: "Offline",
      loading: "Loading agenda...",
      failedToLoad: "Failed to load event data.",
      registerNow: "Register Now",
      noEvents: "No events",
      noEventsInCategory: "No schedule for this category yet.",
    },
    tasbih: {
      title: "Digital Tasbih",
      settings: "Settings",
      guide: "Guide",
      selectDhikr: "Select Dhikr",
      targetCount: "Target Count",
      currentCount: "Current Count",
      progress: "Progress",
      lastReset: "Last reset:",
      press: "Press",
      resetCount: "Reset Count",
      completed: "Completed",
      guideStep1: "Press the large circle to add dhikr count",
      guideStep2: "Click the settings icon to change dhikr type and target",
      guideStep3: "Use the reset button to start counting from the beginning",
    },
    article: {
      title: "Islamic Articles",
      searchPlaceholder: "Search for articles you need...",
      trendingToday: "Trending Today",
      category: "Category",
      all: "All",
      articlesFound: "articles found",
      resetFilter: "Reset Filter",
      read: "Read",
      noArticlesFound: "No articles found",
      tryDifferentKeyword: "Try changing search keywords or category filter",
      viewAllArticles: "View All Articles",
      min: "min",
    },
    askUstadz: {
      title: "Ask Ustadz",
      subtitle: "Ask questions about Islam to competent ustadz. Get accurate and trusted answers.",
      askQuestion: "Ask Question",
      totalQuestions: "Total Questions",
      answered: "Answered",
      activeUstadz: "Active Ustadz",
      popular: "Popular",
      questionList: "Question List",
      questions: "questions",
      motivationalQuote: "Seeking knowledge is obligatory for every Muslim",
    },
    hijriCalendar: {
      title: "Hijri Calendar",
      today: "Today",
      previous: "Previous",
      next: "Next",
      importantDays: "Important Days",
      noImportantDays: "No important days this month",
      information: "Information",
      infoDescription: "Click on a date in the calendar to see important day details. Dates with dots or icons are important days in Islam.",
      explanation: "Explanation",
      selectedDate: "Selected Date",
      importantDay: "Important Day",
      todayMarker: "Today",
    },
    templateLetter: {
      title: "Letter Template",
      searchPlaceholder: "Search letter...",
      loading: "Loading templates...",
      failedToLoad: "Failed to load data.",
      tryAgain: "Try Again",
      download: "Download",
      notFound: "Not found",
      tryDifferentKeyword: "Try searching with different keywords",
      needOtherFormat: "Need other format?",
      contactAdmin: "Contact admin to request letter.",
    },
    inheritance: {
      title: "Inheritance Calculator",
      inheritanceInfo: "Inheritance & Deceased Information",
      deceasedGender: "Deceased Gender (Who Passed Away)",
      male: "Male",
      female: "Female",
      totalInheritance: "Total Inheritance (Rp)",
      heirs: "Heirs",
      father: "Father",
      mother: "Mother",
      wife: "Wife",
      husband: "Husband",
      son: "Son",
      daughter: "Daughter",
      calculate: "Calculate Distribution",
      calculationResult: "Calculation Result",
      total: "Total:",
      perPerson: "Per person",
      share: "Share:",
      remaining: "Remaining Inheritance",
      totalGroup: "Total Group:",
      people: "people",
      remainingInheritance: "Remaining Inheritance (Radd)",
      remainingDescription: "There is remaining inheritance that was not fully distributed by Ashabul Furud. This remainder is usually returned to nasab heirs proportionally to their shares.",
      disclaimer: "*This calculation uses basic simulation for nuclear families. For complex cases (Grandfather, Grandmother, Siblings, Kalalah), please consult with trusted Ulama or inheritance experts.",
    },
    zakatCalculator: {
      title: "Zakat Calculator",
      zakatProfesi: "Professional Zakat",
      zakatMaal: "Wealth Zakat",
      goldPricePerGram: "Gold Price /gram",
      enterFinancialData: "Enter Financial Data",
      monthlyIncome: "Monthly Income",
      bonus: "Bonus / THR / Others",
      debt: "Debt / Installment Due",
      savings: "Savings / Deposit / Cash",
      goldSilver: "Gold / Silver (Converted to Rp)",
      assets: "Stocks / Securities",
      reset: "Reset",
      calculateZakat: "Calculate Zakat",
      zakatObligatory: "Zakat Obligatory",
      zakatNotObligatory: "Zakat Not Obligatory",
      assetsReachedNisab: "Your assets have reached Nisab",
      assetsNotReachedNisab: "Assets have not reached Nisab",
      totalZakatToPay: "Total Zakat to Pay",
      lastCalculated: "Last calculated",
      currency: "IDR",
    },
    ebook: {
      title: "Islamic E-Books",
      subtitle: "Collection of digital Islamic books",
      selectedCategory: "Selected Category",
      noBooksInCategory: "No books available in this category.",
      freeDownload: "Free Download",
      freeDownloadDescription: "All e-books are available for free for learning and da'wah",
      pages: "pages",
      rating: "Rating",
      downloads: "Downloads",
      loading: "Loading...",
    },
    prayer: {
      title: "Prayer Times",
      subtitle: "Prayer times based on your location",
      currentLocation: "Current Location",
      locationNotSet: "Location not set",
      useCurrentLocation: "Use Current Location",
      gettingLocation: "Getting location...",
      locationRequired: "Location Required",
      locationRequiredDesc: "To display accurate prayer times, the app needs access to your location.",
      allowLocationAccess: "Allow Location Access",
      prayerSchedule: "Today's Prayer Schedule",
      todaySchedule: "Today's Prayer Schedule",
      currentlyOngoing: "Currently ongoing",
      completed: "Completed",
      adhanReminder: "Adhan Reminder",
      adhanActive: "Automatic adhan active",
      activateReminder: "Activate for automatic reminder",
      active: "Active",
      inactive: "Inactive",
      testAdhan: "Test adhan sound",
      playingAdhan: "Playing adhan",
      stop: "Stop",
      test: "Test",
      scheduledPrayers: "Scheduled adhan for today:",
      allPrayersPassed: "All prayer times for today have passed",
      allowNotification: "Allow browser notifications for best experience",
      prayerNames: {
        fajr: "Fajr",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
      },
    },
  },
  ar: {
    home: {
      title: "تطبيق العبادة",
      subtitle: "تطبيق العبادة الرقمي الخاص بك",
      greeting: "مرحباً",
      features: "المميزات",
      quickAccess: "الوصول السريع",
      todayPrayer: "أوقات الصلاة اليوم",
      currentPrayer: "الصلاة الحالية",
      nextPrayer: "الصلاة القادمة",
      timeRemaining: "الوقت المتبقي",
      minutes: "دقائق",
      hours: "ساعات",
      viewAll: "عرض الكل",
      loading: "جاري التحميل...",
    },
    common: {
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      retry: "إعادة المحاولة",
      close: "إغلاق",
      save: "حفظ",
      cancel: "إلغاء",
      confirm: "تأكيد",
      back: "رجوع",
      next: "التالي",
      search: "بحث",
    },
    widgets: {
      quran: "القرآن",
      prayer: "أوقات الصلاة",
      qibla: "اتجاه القبلة",
      hijriCalendar: "التقويم الهجري",
      asmaulHusna: "الأسماء الحسنى",
      doa: "الأدعية والأذكار",
      hadith: "الحديث",
      articles: "المقالات",
      store: "المتجر",
    },
    quran: {
      title: "القرآن الكريم",
      subtitle: "الكتاب المقدس للمسلمين",
      searchPlaceholder: "ابحث عن سورة (لاتيني، معنى، عربي)...",
      readQuran: "اقرأ القرآن",
      startFromFatihah: "ابدأ من الفاتحة",
      bookmark: "إشارة مرجعية",
      surahSaved: "سورة محفوظة",
      savedSurahs: "السور المحفوظة",
      noBookmarks: "لا توجد سور محفوظة بعد",
      recentlyRead: "مقروءة مؤخراً",
      allSurahs: "جميع السور",
      loading: "جاري التحميل...",
      surah: "سورة",
      verses: "آية",
      juz: "جزء",
      revelation: {
        all: "الكل",
        meccan: "مكية",
        medinan: "مدنية",
      },
    },
    kajian: {
      title: "الدراسات الإسلامية",
      subtitle: "تعلم وتعمق في المعرفة الدينية",
      latestKajian: "أحدث الدراسات الإسلامية",
      listenKajian: "استمع إلى الدراسات المختارة من العلماء",
      searchPlaceholder: "ابحث عن دراسة، عالم، أو موضوع...",
      sortBy: "ترتيب حسب",
      newest: "الأحدث",
      oldest: "الأقدم",
      ustadz: "عالم",
      allUstadz: "جميع العلماء",
      resetFilter: "إعادة تعيين المرشح",
      kajianList: "قائمة الدراسات",
      kajian: "دراسة",
      noKajianFound: "لم يتم العثور على دراسات بعد",
      noKajianMatch: "لا توجد دراسات تطابق المرشح",
      quickAccess: "الوصول السريع",
      getNotifications: "احصل على إشعارات لأحدث الدراسات وجدول البث المباشر",
    },
    prayerTracker: {
      title: "متتبع الصلاة",
      subtitle: "تتبع تقدم صلاتك اليومية",
      loading: "جاري تحميل جدول الصلاة...",
      today: "اليوم",
      monthly: "شهري",
      loadingSchedule: "جاري تحميل جدول الصلاة...",
      failedToLoad: "فشل تحميل جدول الصلاة. تحقق من اتصالك بالإنترنت.",
      checkConnection: "تحقق من اتصالك بالإنترنت",
      motivationalQuote: "وأقم الصلاة لذكري",
    },
    qibla: {
      title: "اتجاه القبلة",
      detectingLocation: "جاري اكتشاف الموقع...",
      ensureGpsActive: "تأكد من تفعيل GPS والسماح بالوصول إلى الموقع",
      failedToGetLocation: "فشل الحصول على الموقع",
      tryAgain: "حاول مرة أخرى",
      facingQibla: "أنت تواجه القبلة!",
      rotateDevice: "قم بتدوير الجهاز نحو السهم",
      qiblaDirection: "اتجاه القبلة",
      distanceToKaaba: "المسافة إلى الكعبة",
      enableRealtimeCompass: "تفعيل البوصلة في الوقت الفعلي",
      compassActive: "البوصلة نشطة - حرك جهازك",
      moveDevice: "حرك جهازك",
      accuracyTips: "نصائح للدقة القصوى",
      tips: {
        enableGps: "تفعيل GPS/الموقع في إعدادات الجهاز",
        avoidMetal: "ابتعد عن الأجسام المعدنية أو المغناطيسية",
        calibrateCompass: "معايرة البوصلة بحركة الرقم 8",
        holdHorizontal: "امسك الجهاز أفقياً",
      },
      compassCalibration: "معايرة البوصلة",
      calibrationDescription: "إذا كانت الإبرة غير دقيقة، حرك الجهاز في نمط الرقم 8 في الهواء عدة مرات لمعايرة مستشعر البوصلة.",
      calibrationMovement: "حركة المعايرة",
      accuracy: {
        high: "دقة عالية",
        medium: "دقة متوسطة",
        low: "دقة منخفضة",
        detecting: "جاري الاكتشاف...",
      },
      directions: {
        north: "الشمال",
        northeast: "الشمال الشرقي",
        east: "الشرق",
        southeast: "الجنوب الشرقي",
        south: "الجنوب",
        southwest: "الجنوب الغربي",
        west: "الغرب",
        northwest: "الشمال الغربي",
      },
    },
    tajwid: {
      title: "تعلم التجويد",
      learningProgress: "تقدم التعلم",
      overallProgress: "التقدم الإجمالي",
      lessonsCompleted: "الدروس المكتملة",
      materialsMastered: "المواد المتقنة",
      selectLesson: "اختر الدرس",
      materials: "مواد",
      completed: "مكتمل",
      finished: "منتهي",
      back: "رجوع",
      explanation: "شرح",
      example: "مثال",
      listen: "استمع",
      pause: "إيقاف مؤقت",
      alreadyMastered: "متقن بالفعل",
      markComplete: "وضع علامة مكتمل",
      difficulty: {
        easy: "سهل",
        medium: "متوسط",
        hard: "صعب",
        unknown: "غير معروف",
      },
      categories: {
        makharij: "مخارج الحروف",
        sifat: "صفات الحروف",
        ahkam: "أحكام الحروف",
        wafq: "الوقف",
        category: "الفئة",
      },
    },
    hadith: {
      title: "الحديث والسنة",
      selectedHadith: "حديث مختار",
      favorite: "مفضل",
      searchPlaceholder: "ابحث في هذه الصفحة...",
      allBooks: "جميع الكتب",
      selectBook: "اختر كتاب الحديث",
      hadithList: "قائمة الأحاديث",
      showing: "عرض",
      noHadithFound: "لم يتم العثور على حديث",
      tryDifferentKeyword: "جرب كلمة بحث مختلفة",
      previous: "السابق",
      next: "التالي",
      hadiths: "أحاديث",
    },
    halal: {
      title: "مطاعم حلال",
      subtitle: "ابحث عن أماكن تناول الطعام الحلال القريبة",
      halalCertified: "معتمد حلال",
      findNearby: "ابحث عن أماكن تناول الطعام الحلال القريبة",
      restaurantsFound: "مطعم حلال تم العثور عليه",
      in: "في",
      restaurants: "المطاعم",
      menu: "القائمة",
      menuAvailable: "قائمة متاحة",
      noRestaurantsFound: "لم يتم العثور على مطاعم",
      tryDifferentFilter: "جرب تغيير الفلاتر أو اختر مدينة أخرى",
      motivationalQuote: "كلوا من طيبات ما رزقناكم",
    },
    donation: {
      title: "التبرع والصدقة",
      subtitle: "قدم أفضل تبرعك لصالح الأمة. كل روبية تقدمها ستساعد المحتاجين.",
      donationList: "قائمة التبرعات",
      selectDonation: "اختر التبرع الذي تريد دعمه",
      donations: "تبرعات",
      progress: "التقدم",
      days: "أيام",
      donateNow: "تبرع الآن",
      needHelp: "تحتاج مساعدة؟",
      helpDescription: "فريقنا جاهز لمساعدتك في عملية التبرع",
      favoriteDonation: "تبرع مفضل",
      share: "مشاركة",
      donationHistory: "سجل التبرعات",
      motivationalQuote: "إن الصدقة تطفئ حر القبر لصاحبها، وإن المؤمن في يوم القيامة ليستظل بظل صدقته",
      donorName: "اسم المتبرع",
      donorNameRequired: "اسم المتبرع",
      email: "البريد الإلكتروني (اختياري)",
      emailOptional: "البريد الإلكتروني (اختياري)",
      phone: "رقم الهاتف (اختياري)",
      phoneOptional: "رقم الهاتف (اختياري)",
      donationAmount: "مبلغ التبرع (روبية)",
      donationAmountRequired: "مبلغ التبرع (روبية)",
      minimumDonation: "الحد الأدنى للتبرع: 10000 روبية",
      message: "رسالة/دعاء (اختياري)",
      messageOptional: "رسالة/دعاء (اختياري)",
      paymentMethod: "طريقة الدفع",
      selectBank: "اختر البنك",
      scanQRIS: "امسح رمز QRIS أعلاه باستخدام المحفظة الإلكترونية (Gopay, OVO, Dana) أو الخدمات المصرفية عبر الهاتف المحمول.",
      transferInstructions: "يرجى التحويل وفقًا للمبلغ حتى آخر 3 أرقام للتحقق التلقائي.",
      accountNumber: "رقم الحساب",
      confirmPayment: "تأكيد الدفع",
      processing: "جاري المعالجة...",
      donationSuccess: "تم إنشاء التبرع بنجاح! يرجى إجراء الدفع.",
      pleasePay: "يرجى إجراء الدفع.",
      noDonationsAvailable: "لا توجد تبرعات متاحة في الوقت الحالي",
      page: "صفحة",
      of: "من",
      previous: "السابق",
      next: "التالي",
    },
    mosque: {
      title: "المسجد والمصلى",
      locationNotDetected: "الموقع غير مكتشف",
      activateGps: "تفعيل GPS",
      locationDetected: "الموقع مكتشف",
      searchRadius: "نطاق البحث",
      dragToExpand: "اسحب لتوسيع نطاق البحث",
      all: "الكل",
      mosque: "مسجد",
      mushola: "مصلى",
      distance: "المسافة",
      rating: "التقييم",
      name: "الاسم",
      loading: "جاري التحميل...",
      searchingNearby: "البحث عن أماكن العبادة القريبة",
      placesFound: "تم العثور على أماكن العبادة",
      open24Hours: "مفتوح 24 ساعة",
      closed: "مغلق",
      facilities: "المرافق:",
      navigate: "التنقل",
      noPlacesFound: "لم يتم العثور على أماكن عبادة",
      expandRadius: "جرب توسيع نطاق البحث إلى",
      km: "كم",
    },
    event: {
      title: "الأجندة والدراسة",
      subtitle: "ابحث عن تجمعات المعرفة القريبة",
      all: "الكل",
      online: "عبر الإنترنت",
      offline: "غير متصل",
      loading: "جاري تحميل الأجندة...",
      failedToLoad: "فشل تحميل بيانات الحدث.",
      registerNow: "سجل الآن",
      noEvents: "لا توجد أحداث",
      noEventsInCategory: "لا يوجد جدول زمني لهذه الفئة بعد.",
    },
    tasbih: {
      title: "المسبحة الرقمية",
      settings: "الإعدادات",
      guide: "الدليل",
      selectDhikr: "اختر الذكر",
      targetCount: "عدد الهدف",
      currentCount: "العدد الحالي",
      progress: "التقدم",
      lastReset: "آخر إعادة تعيين:",
      press: "اضغط",
      resetCount: "إعادة تعيين العدد",
      completed: "مكتمل",
      guideStep1: "اضغط على الدائرة الكبيرة لإضافة عدد الذكر",
      guideStep2: "انقر على أيقونة الإعدادات لتغيير نوع الذكر والهدف",
      guideStep3: "استخدم زر إعادة التعيين لبدء العد من البداية",
    },
    article: {
      title: "المقالات الإسلامية",
      searchPlaceholder: "ابحث عن المقالات التي تحتاجها...",
      trendingToday: "الترند اليوم",
      category: "الفئة",
      all: "الكل",
      articlesFound: "مقال تم العثور عليه",
      resetFilter: "إعادة تعيين الفلتر",
      read: "اقرأ",
      noArticlesFound: "لم يتم العثور على مقالات",
      tryDifferentKeyword: "جرب تغيير كلمات البحث أو فلتر الفئة",
      viewAllArticles: "عرض جميع المقالات",
      min: "دقيقة",
    },
    askUstadz: {
      title: "اسأل الأستاذ",
      subtitle: "اطرح أسئلة حول الإسلام على أستاذ مختص. احصل على إجابات دقيقة وموثوقة.",
      askQuestion: "اطرح سؤالاً",
      totalQuestions: "إجمالي الأسئلة",
      answered: "تمت الإجابة",
      activeUstadz: "أستاذ نشط",
      popular: "شائع",
      questionList: "قائمة الأسئلة",
      questions: "أسئلة",
      motivationalQuote: "طلب العلم فريضة على كل مسلم",
    },
    hijriCalendar: {
      title: "التقويم الهجري",
      today: "اليوم",
      previous: "السابق",
      next: "التالي",
      importantDays: "الأيام المهمة",
      noImportantDays: "لا توجد أيام مهمة هذا الشهر",
      information: "معلومات",
      infoDescription: "انقر على تاريخ في التقويم لرؤية تفاصيل اليوم المهم. التواريخ التي تحتوي على نقاط أو أيقونات هي أيام مهمة في الإسلام.",
      explanation: "شرح",
      selectedDate: "التاريخ المحدد",
      importantDay: "يوم مهم",
      todayMarker: "اليوم",
    },
    templateLetter: {
      title: "قالب الرسالة",
      searchPlaceholder: "ابحث عن رسالة...",
      loading: "جاري تحميل القوالب...",
      failedToLoad: "فشل تحميل البيانات.",
      tryAgain: "حاول مرة أخرى",
      download: "تحميل",
      notFound: "غير موجود",
      tryDifferentKeyword: "جرب البحث بكلمات مختلفة",
      needOtherFormat: "تحتاج تنسيق آخر؟",
      contactAdmin: "اتصل بالمسؤول لطلب الرسالة.",
    },
    inheritance: {
      title: "حاسبة الميراث",
      inheritanceInfo: "معلومات الميراث والمتوفى",
      deceasedGender: "جنس المتوفى (من توفي)",
      male: "ذكر",
      female: "أنثى",
      totalInheritance: "إجمالي الميراث (روبية)",
      heirs: "الورثة",
      father: "الأب",
      mother: "الأم",
      wife: "الزوجة",
      husband: "الزوج",
      son: "الابن",
      daughter: "الابنة",
      calculate: "حساب التوزيع",
      calculationResult: "نتيجة الحساب",
      total: "الإجمالي:",
      perPerson: "لكل شخص",
      share: "الحصة:",
      remaining: "الميراث المتبقي",
      totalGroup: "إجمالي المجموعة:",
      people: "أشخاص",
      remainingInheritance: "الميراث المتبقي (الرد)",
      remainingDescription: "يوجد ميراث متبقي لم يتم توزيعه بالكامل من قبل أصحاب الفروض. عادة ما يتم إرجاع هذا الباقي إلى الورثة بالنسب بما يتناسب مع حصصهم.",
      disclaimer: "*يستخدم هذا الحساب محاكاة أساسية للأسر النووية. للحالات المعقدة (الجد، الجدة، الأشقاء، الكلالة)، يرجى استشارة عالم أو خبراء ميراث موثوقين.",
    },
    zakatCalculator: {
      title: "حاسبة الزكاة",
      zakatProfesi: "زكاة المهنة",
      zakatMaal: "زكاة المال",
      goldPricePerGram: "سعر الذهب /جرام",
      enterFinancialData: "أدخل البيانات المالية",
      monthlyIncome: "الدخل الشهري",
      bonus: "المكافأة / عيدية / أخرى",
      debt: "الدين / القسط المستحق",
      savings: "الادخار / الوديعة / النقد",
      goldSilver: "الذهب / الفضة (محول إلى روبية)",
      assets: "الأسهم / الأوراق المالية",
      reset: "إعادة تعيين",
      calculateZakat: "حساب الزكاة",
      zakatObligatory: "الزكاة واجبة",
      zakatNotObligatory: "الزكاة غير واجبة",
      assetsReachedNisab: "وصلت أموالك إلى النصاب",
      assetsNotReachedNisab: "الأموال لم تصل إلى النصاب",
      totalZakatToPay: "إجمالي الزكاة الواجبة",
      lastCalculated: "آخر حساب",
      currency: "IDR",
    },
    ebook: {
      title: "الكتب الإلكترونية الإسلامية",
      subtitle: "مجموعة من الكتب الإسلامية الرقمية",
      selectedCategory: "الفئة المختارة",
      noBooksInCategory: "لا توجد كتب متاحة في هذه الفئة.",
      freeDownload: "تحميل مجاني",
      freeDownloadDescription: "جميع الكتب الإلكترونية متاحة مجانًا للتعلم والدعوة",
      pages: "صفحة",
      rating: "التقييم",
      downloads: "التحميلات",
      loading: "جاري التحميل...",
    },
    prayer: {
      title: "أوقات الصلاة",
      subtitle: "أوقات الصلاة حسب موقعك",
      currentLocation: "الموقع الحالي",
      locationNotSet: "الموقع غير محدد",
      useCurrentLocation: "استخدام الموقع الحالي",
      gettingLocation: "جاري الحصول على الموقع...",
      locationRequired: "الموقع مطلوب",
      locationRequiredDesc: "لعرض أوقات الصلاة الدقيقة، يحتاج التطبيق إلى الوصول إلى موقعك.",
      allowLocationAccess: "السماح بالوصول إلى الموقع",
      prayerSchedule: "جدول الصلاة اليوم",
      todaySchedule: "جدول الصلاة اليوم",
      currentlyOngoing: "جاري الآن",
      completed: "تم",
      adhanReminder: "تذكير الأذان",
      adhanActive: "الأذان التلقائي نشط",
      activateReminder: "تفعيل للتذكير التلقائي",
      active: "نشط",
      inactive: "غير نشط",
      testAdhan: "اختبار صوت الأذان",
      playingAdhan: "جاري تشغيل الأذان",
      stop: "إيقاف",
      test: "اختبار",
      scheduledPrayers: "الأذان المجدول اليوم:",
      allPrayersPassed: "جميع أوقات الصلاة اليوم قد انتهت",
      allowNotification: "السماح بإشعارات المتصفح للحصول على أفضل تجربة",
      prayerNames: {
        fajr: "الفجر",
        dhuhr: "الظهر",
        asr: "العصر",
        maghrib: "المغرب",
        isha: "العشاء",
      },
    },
  },
  fr: {
    home: {
      title: "IbadahApp",
      subtitle: "Votre application de culte numérique",
      greeting: "Bienvenue",
      features: "Fonctionnalités",
      quickAccess: "Accès rapide",
      todayPrayer: "Horaires de prière d'aujourd'hui",
      currentPrayer: "Prière actuelle",
      nextPrayer: "Prière suivante",
      timeRemaining: "Temps restant",
      minutes: "minutes",
      hours: "heures",
      viewAll: "Voir tout",
      loading: "Chargement...",
    },
    common: {
      loading: "Chargement...",
      error: "Une erreur s'est produite",
      retry: "Réessayer",
      close: "Fermer",
      save: "Enregistrer",
      cancel: "Annuler",
      confirm: "Confirmer",
      back: "Retour",
      next: "Suivant",
      search: "Rechercher",
    },
    widgets: {
      quran: "Coran",
      prayer: "Horaires de prière",
      qibla: "Direction de la Qibla",
      hijriCalendar: "Calendrier Hijri",
      asmaulHusna: "Asmaul Husna",
      doa: "Prières et Dhikr",
      hadith: "Hadith",
      articles: "Articles",
      store: "Boutique",
    },
    quran: {
      title: "Le Coran",
      subtitle: "Le livre saint de l'Islam",
      searchPlaceholder: "Rechercher une sourate (latin, signification, arabe)...",
      readQuran: "Lire le Coran",
      startFromFatihah: "Commencer par Al-Fatihah",
      bookmark: "Signet",
      surahSaved: "sourates enregistrées",
      savedSurahs: "Sourates enregistrées",
      noBookmarks: "Aucune sourate enregistrée pour le moment",
      recentlyRead: "Lues récemment",
      allSurahs: "Toutes les sourates",
      loading: "Chargement...",
      surah: "sourate",
      verses: "versets",
      juz: "Juz",
      revelation: {
        all: "Tout",
        meccan: "Mecquoise",
        medinan: "Médinoise",
      },
    },
    kajian: {
      title: "Études islamiques",
      subtitle: "Apprendre et approfondir les connaissances religieuses",
      latestKajian: "Dernières études islamiques",
      listenKajian: "Écoutez les études sélectionnées des savants",
      searchPlaceholder: "Rechercher une étude, un savant ou un sujet...",
      sortBy: "Trier par",
      newest: "Plus récent",
      oldest: "Plus ancien",
      ustadz: "Savant",
      allUstadz: "Tous les savants",
      resetFilter: "Réinitialiser le filtre",
      kajianList: "Liste des études",
      kajian: "études",
      noKajianFound: "Aucune étude trouvée pour le moment",
      noKajianMatch: "Aucune étude ne correspond au filtre",
      quickAccess: "Accès rapide",
      getNotifications: "Recevoir des notifications pour les dernières études et le programme de diffusion en direct",
    },
    prayerTracker: {
      title: "Suivi de Prière",
      subtitle: "Suivez vos progrès de prière quotidiens",
      loading: "Chargement du programme de prière...",
      today: "Aujourd'hui",
      monthly: "Mensuel",
      loadingSchedule: "Chargement du programme de prière...",
      failedToLoad: "Échec du chargement du programme de prière. Vérifiez votre connexion Internet.",
      checkConnection: "Vérifiez votre connexion Internet",
      motivationalQuote: "Et accomplis la prière pour Mon souvenir",
    },
    qibla: {
      title: "Direction de la Qibla",
      detectingLocation: "Détection de la localisation...",
      ensureGpsActive: "Assurez-vous que le GPS est actif et autorisez l'accès à la localisation",
      failedToGetLocation: "Échec de l'obtention de la localisation",
      tryAgain: "Réessayer",
      facingQibla: "Vous êtes face à la Qibla!",
      rotateDevice: "Tournez l'appareil vers la flèche",
      qiblaDirection: "Direction de la Qibla",
      distanceToKaaba: "Distance à la Kaaba",
      enableRealtimeCompass: "Activer la boussole en temps réel",
      compassActive: "Boussole active - Déplacez votre appareil",
      moveDevice: "Déplacez votre appareil",
      accuracyTips: "Conseils pour une précision maximale",
      tips: {
        enableGps: "Activez GPS/Localisation dans les paramètres de l'appareil",
        avoidMetal: "Éloignez-vous des objets métalliques ou magnétiques",
        calibrateCompass: "Calibrez la boussole avec un mouvement en forme de 8",
        holdHorizontal: "Tenez l'appareil horizontalement",
      },
      compassCalibration: "Calibration de la boussole",
      calibrationDescription: "Si l'aiguille n'est pas précise, déplacez l'appareil en forme de 8 dans l'air plusieurs fois pour calibrer le capteur de boussole.",
      calibrationMovement: "Mouvement de calibration",
      accuracy: {
        high: "Précision élevée",
        medium: "Précision moyenne",
        low: "Précision faible",
        detecting: "Détection...",
      },
      directions: {
        north: "Nord",
        northeast: "Nord-est",
        east: "Est",
        southeast: "Sud-est",
        south: "Sud",
        southwest: "Sud-ouest",
        west: "Ouest",
        northwest: "Nord-ouest",
      },
    },
    tajwid: {
      title: "Apprendre le Tajwid",
      learningProgress: "Progrès d'apprentissage",
      overallProgress: "Progrès global",
      lessonsCompleted: "Leçons terminées",
      materialsMastered: "Matériaux maîtrisés",
      selectLesson: "Sélectionner une leçon",
      materials: "matériaux",
      completed: "Terminé",
      finished: "terminé",
      back: "Retour",
      explanation: "Explication",
      example: "Exemple",
      listen: "Écouter",
      pause: "Pause",
      alreadyMastered: "Déjà maîtrisé",
      markComplete: "Marquer comme terminé",
      difficulty: {
        easy: "Facile",
        medium: "Moyen",
        hard: "Difficile",
        unknown: "Inconnu",
      },
      categories: {
        makharij: "Makharijul Huruf",
        sifat: "Sifatul Huruf",
        ahkam: "Ahkamul Huruf",
        wafq: "Wafq",
        category: "Catégorie",
      },
    },
    hadith: {
      title: "Hadith & Sunnah",
      selectedHadith: "Hadith sélectionné",
      favorite: "Favori",
      searchPlaceholder: "Rechercher dans cette page...",
      allBooks: "Tous les livres",
      selectBook: "Sélectionner un livre de Hadith",
      hadithList: "Liste des Hadiths",
      showing: "Affichage",
      noHadithFound: "Aucun hadith trouvé",
      tryDifferentKeyword: "Essayez un mot-clé de recherche différent",
      previous: "Précédent",
      next: "Suivant",
      hadiths: "hadiths",
    },
    halal: {
      title: "Restaurants Halal",
      subtitle: "Trouvez des restaurants halal à proximité",
      halalCertified: "Certifié Halal",
      findNearby: "Trouvez des restaurants halal à proximité",
      restaurantsFound: "restaurants halal trouvés",
      in: "dans",
      restaurants: "Restaurants",
      menu: "Menu",
      menuAvailable: "menu disponible",
      noRestaurantsFound: "Aucun restaurant trouvé",
      tryDifferentFilter: "Essayez de changer les filtres ou sélectionnez une autre ville",
      motivationalQuote: "Mangez des choses licites et bonnes qu'Allah vous a fournies",
    },
    donation: {
      title: "Don & Charité",
      subtitle: "Donnez votre meilleur don pour le bien de l'ummah. Chaque roupiah que vous donnez aidera ceux qui en ont besoin.",
      donationList: "Liste des Dons",
      selectDonation: "Sélectionnez le don que vous souhaitez soutenir",
      donations: "Dons",
      progress: "Progrès",
      days: "jours",
      donateNow: "Faire un Don",
      needHelp: "Besoin d'Aide?",
      helpDescription: "Notre équipe est prête à vous aider dans le processus de don",
      favoriteDonation: "Don Favori",
      share: "Partager",
      donationHistory: "Historique des Dons",
      motivationalQuote: "En effet, la charité éteint la chaleur de la tombe pour son auteur, et en effet au Jour du Jugement un croyant trouvera refuge à l'ombre de sa charité",
      donorName: "Nom du Donateur",
      donorNameRequired: "Nom du Donateur",
      email: "Email (Optionnel)",
      emailOptional: "Email (Optionnel)",
      phone: "Numéro de Téléphone (Optionnel)",
      phoneOptional: "Numéro de Téléphone (Optionnel)",
      donationAmount: "Montant du Don (Rp)",
      donationAmountRequired: "Montant du Don (Rp)",
      minimumDonation: "Don minimum: Rp 10 000",
      message: "Message/Prière (Optionnel)",
      messageOptional: "Message/Prière (Optionnel)",
      paymentMethod: "Méthode de Paiement",
      selectBank: "Sélectionner une Banque",
      scanQRIS: "Scannez le QRIS ci-dessus en utilisant un portefeuille électronique (Gopay, OVO, Dana) ou une application bancaire mobile.",
      transferInstructions: "Veuillez transférer selon le montant jusqu'aux 3 derniers chiffres pour vérification automatique.",
      accountNumber: "Numéro de Compte",
      confirmPayment: "Confirmer le Paiement",
      processing: "Traitement...",
      donationSuccess: "Don créé avec succès! Veuillez effectuer le paiement.",
      pleasePay: "Veuillez effectuer le paiement.",
      noDonationsAvailable: "Aucun don disponible pour le moment",
      page: "Page",
      of: "de",
      previous: "Précédent",
      next: "Suivant",
    },
    mosque: {
      title: "Mosquée & Salle de Prière",
      locationNotDetected: "Localisation non détectée",
      activateGps: "Activer GPS",
      locationDetected: "Localisation détectée",
      searchRadius: "Rayon de Recherche",
      dragToExpand: "Glissez pour étendre la portée de recherche",
      all: "Tout",
      mosque: "Mosquée",
      mushola: "Salle de Prière",
      distance: "Distance",
      rating: "Note",
      name: "Nom",
      loading: "Chargement...",
      searchingNearby: "Recherche de lieux de culte à proximité",
      placesFound: "Lieux de Culte Trouvés",
      open24Hours: "Ouvert 24h/24",
      closed: "Fermé",
      facilities: "Installations:",
      navigate: "Naviguer",
      noPlacesFound: "Aucun lieu de culte trouvé",
      expandRadius: "Essayez d'élargir le rayon de recherche à",
      km: "km",
    },
    event: {
      title: "Agenda & Étude",
      subtitle: "Trouvez des rassemblements de connaissances à proximité",
      all: "Tout",
      online: "En ligne",
      offline: "Hors ligne",
      loading: "Chargement de l'agenda...",
      failedToLoad: "Échec du chargement des données d'événement.",
      registerNow: "S'inscrire Maintenant",
      noEvents: "Aucun événement",
      noEventsInCategory: "Aucun horaire pour cette catégorie pour le moment.",
    },
    tasbih: {
      title: "Tasbih Numérique",
      settings: "Paramètres",
      guide: "Guide",
      selectDhikr: "Sélectionner Dhikr",
      targetCount: "Nombre Cible",
      currentCount: "Nombre Actuel",
      progress: "Progrès",
      lastReset: "Dernière réinitialisation:",
      press: "Appuyer",
      resetCount: "Réinitialiser le Nombre",
      completed: "Terminé",
      guideStep1: "Appuyez sur le grand cercle pour ajouter le nombre de dhikr",
      guideStep2: "Cliquez sur l'icône des paramètres pour changer le type de dhikr et la cible",
      guideStep3: "Utilisez le bouton de réinitialisation pour commencer à compter depuis le début",
    },
    article: {
      title: "Articles Islamiques",
      searchPlaceholder: "Recherchez les articles dont vous avez besoin...",
      trendingToday: "Tendance Aujourd'hui",
      category: "Catégorie",
      all: "Tout",
      articlesFound: "articles trouvés",
      resetFilter: "Réinitialiser le Filtre",
      read: "Lire",
      noArticlesFound: "Aucun article trouvé",
      tryDifferentKeyword: "Essayez de changer les mots-clés de recherche ou le filtre de catégorie",
      viewAllArticles: "Voir Tous les Articles",
      min: "min",
    },
    askUstadz: {
      title: "Demander à l'Ustadz",
      subtitle: "Posez des questions sur l'Islam à des ustadz compétents. Obtenez des réponses précises et fiables.",
      askQuestion: "Poser une Question",
      totalQuestions: "Total des Questions",
      answered: "Répondu",
      activeUstadz: "Ustadz Actif",
      popular: "Populaire",
      questionList: "Liste des Questions",
      questions: "questions",
      motivationalQuote: "Chercher la connaissance est obligatoire pour chaque musulman",
    },
    hijriCalendar: {
      title: "Calendrier Hijri",
      today: "Aujourd'hui",
      previous: "Précédent",
      next: "Suivant",
      importantDays: "Jours Importants",
      noImportantDays: "Aucun jour important ce mois-ci",
      information: "Information",
      infoDescription: "Cliquez sur une date dans le calendrier pour voir les détails des jours importants. Les dates avec des points ou des icônes sont des jours importants en Islam.",
      explanation: "Explication",
      selectedDate: "Date Sélectionnée",
      importantDay: "Jour Important",
      todayMarker: "Aujourd'hui",
    },
    templateLetter: {
      title: "Modèle de Lettre",
      searchPlaceholder: "Rechercher une lettre...",
      loading: "Chargement des modèles...",
      failedToLoad: "Échec du chargement des données.",
      tryAgain: "Réessayer",
      download: "Télécharger",
      notFound: "Non trouvé",
      tryDifferentKeyword: "Essayez de rechercher avec des mots-clés différents",
      needOtherFormat: "Besoin d'un autre format?",
      contactAdmin: "Contactez l'administrateur pour demander une lettre.",
    },
    inheritance: {
      title: "Calculateur d'Héritage",
      inheritanceInfo: "Informations sur l'Héritage et le Défunt",
      deceasedGender: "Sexe du Défunt (Qui est Décédé)",
      male: "Homme",
      female: "Femme",
      totalInheritance: "Héritage Total (Rp)",
      heirs: "Héritiers",
      father: "Père",
      mother: "Mère",
      wife: "Épouse",
      husband: "Époux",
      son: "Fils",
      daughter: "Fille",
      calculate: "Calculer la Distribution",
      calculationResult: "Résultat du Calcul",
      total: "Total:",
      perPerson: "Par personne",
      share: "Part:",
      remaining: "Héritage Restant",
      totalGroup: "Total du Groupe:",
      people: "personnes",
      remainingInheritance: "Héritage Restant (Radd)",
      remainingDescription: "Il y a un héritage restant qui n'a pas été entièrement distribué par Ashabul Furud. Ce reste est généralement retourné aux héritiers nasab proportionnellement à leurs parts.",
      disclaimer: "*Ce calcul utilise une simulation de base pour les familles nucléaires. Pour les cas complexes (Grand-père, Grand-mère, Frères et Sœurs, Kalalah), veuillez consulter des Ulama ou des experts en héritage de confiance.",
    },
    zakatCalculator: {
      title: "Calculateur de Zakat",
      zakatProfesi: "Zakat Professionnelle",
      zakatMaal: "Zakat des Biens",
      goldPricePerGram: "Prix de l'Or /gramme",
      enterFinancialData: "Entrer les Données Financières",
      monthlyIncome: "Revenu Mensuel",
      bonus: "Bonus / THR / Autres",
      debt: "Dette / Échéance de Remboursement",
      savings: "Épargne / Dépôt / Espèces",
      goldSilver: "Or / Argent (Converti en Rp)",
      assets: "Actions / Titres",
      reset: "Réinitialiser",
      calculateZakat: "Calculer la Zakat",
      zakatObligatory: "Zakat Obligatoire",
      zakatNotObligatory: "Zakat Non Obligatoire",
      assetsReachedNisab: "Vos biens ont atteint le Nisab",
      assetsNotReachedNisab: "Les biens n'ont pas atteint le Nisab",
      totalZakatToPay: "Total de la Zakat à Payer",
      lastCalculated: "Dernier calcul",
      currency: "IDR",
    },
    ebook: {
      title: "Livres Électroniques Islamiques",
      subtitle: "Collection de livres numériques islamiques",
      selectedCategory: "Catégorie Sélectionnée",
      noBooksInCategory: "Aucun livre disponible dans cette catégorie.",
      freeDownload: "Téléchargement Gratuit",
      freeDownloadDescription: "Tous les livres électroniques sont disponibles gratuitement pour l'apprentissage et la da'wah",
      pages: "pages",
      rating: "Note",
      downloads: "Téléchargements",
      loading: "Chargement...",
    },
    prayer: {
      title: "Horaires de prière",
      subtitle: "Horaires de prière basés sur votre localisation",
      currentLocation: "Localisation actuelle",
      locationNotSet: "Localisation non définie",
      useCurrentLocation: "Utiliser la localisation actuelle",
      gettingLocation: "Obtention de la localisation...",
      locationRequired: "Localisation requise",
      locationRequiredDesc: "Pour afficher des horaires de prière précis, l'application nécessite l'accès à votre localisation.",
      allowLocationAccess: "Autoriser l'accès à la localisation",
      prayerSchedule: "Horaires de prière d'aujourd'hui",
      todaySchedule: "Horaires de prière d'aujourd'hui",
      currentlyOngoing: "En cours",
      completed: "Terminé",
      adhanReminder: "Rappel d'Adhan",
      adhanActive: "Adhan automatique actif",
      activateReminder: "Activer pour rappel automatique",
      active: "Actif",
      inactive: "Inactif",
      testAdhan: "Tester le son de l'Adhan",
      playingAdhan: "Lecture de l'Adhan",
      stop: "Arrêter",
      test: "Test",
      scheduledPrayers: "Adhan programmé aujourd'hui:",
      allPrayersPassed: "Tous les horaires de prière d'aujourd'hui sont passés",
      allowNotification: "Autoriser les notifications du navigateur pour une meilleure expérience",
      prayerNames: {
        fajr: "Fajr",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
      },
    },
  },
  kr: {
    home: {
      title: "IbadahApp",
      subtitle: "디지털 예배 앱",
      greeting: "환영합니다",
      features: "기능",
      quickAccess: "빠른 액세스",
      todayPrayer: "오늘의 기도 시간",
      currentPrayer: "현재 기도",
      nextPrayer: "다음 기도",
      timeRemaining: "남은 시간",
      minutes: "분",
      hours: "시간",
      viewAll: "모두 보기",
      loading: "로딩 중...",
    },
    common: {
      loading: "로딩 중...",
      error: "오류가 발생했습니다",
      retry: "다시 시도",
      close: "닫기",
      save: "저장",
      cancel: "취소",
      confirm: "확인",
      back: "뒤로",
      next: "다음",
      search: "검색",
    },
    widgets: {
      quran: "꾸란",
      prayer: "기도 시간",
      qibla: "키블라 방향",
      hijriCalendar: "히즈라력",
      asmaulHusna: "아스마울 후스나",
      doa: "기도와 즈키르",
      hadith: "하디스",
      articles: "기사",
      store: "상점",
    },
    quran: {
      title: "꾸란",
      subtitle: "이슬람의 성서",
      searchPlaceholder: "수라 검색 (라틴어, 의미, 아랍어)...",
      readQuran: "꾸란 읽기",
      startFromFatihah: "알 파티하부터 시작",
      bookmark: "북마크",
      surahSaved: "수라 저장됨",
      savedSurahs: "저장된 수라",
      noBookmarks: "저장된 수라가 없습니다",
      recentlyRead: "최근 읽음",
      allSurahs: "모든 수라",
      loading: "로딩 중...",
      surah: "수라",
      verses: "절",
      juz: "주즈",
      revelation: {
        all: "전체",
        meccan: "메카",
        medinan: "메디나",
      },
    },
    kajian: {
      title: "이슬람 연구",
      subtitle: "종교 지식을 배우고 심화",
      latestKajian: "최신 이슬람 연구",
      listenKajian: "학자들의 선택된 연구 듣기",
      searchPlaceholder: "연구, 학자 또는 주제 검색...",
      sortBy: "정렬",
      newest: "최신순",
      oldest: "오래된순",
      ustadz: "학자",
      allUstadz: "모든 학자",
      resetFilter: "필터 재설정",
      kajianList: "연구 목록",
      kajian: "연구",
      noKajianFound: "아직 연구가 없습니다",
      noKajianMatch: "필터와 일치하는 연구가 없습니다",
      quickAccess: "빠른 액세스",
      getNotifications: "최신 연구 및 라이브 스트리밍 일정 알림 받기",
    },
    prayerTracker: {
      title: "기도 추적기",
      subtitle: "일일 기도 진행 상황 추적",
      loading: "기도 일정 로딩 중...",
      today: "오늘",
      monthly: "월간",
      loadingSchedule: "기도 일정 로딩 중...",
      failedToLoad: "기도 일정을 불러오지 못했습니다. 인터넷 연결을 확인하세요.",
      checkConnection: "인터넷 연결을 확인하세요",
      motivationalQuote: "나를 기억하기 위해 기도를 드리라",
    },
    qibla: {
      title: "키블라 방향",
      detectingLocation: "위치 감지 중...",
      ensureGpsActive: "GPS가 활성화되어 있고 위치 액세스를 허용했는지 확인하세요",
      failedToGetLocation: "위치 가져오기 실패",
      tryAgain: "다시 시도",
      facingQibla: "키블라를 향하고 있습니다!",
      rotateDevice: "화살표 방향으로 기기를 회전하세요",
      qiblaDirection: "키블라 방향",
      distanceToKaaba: "카바까지의 거리",
      enableRealtimeCompass: "실시간 나침반 활성화",
      compassActive: "나침반 활성화 - 기기를 움직이세요",
      moveDevice: "기기를 움직이세요",
      accuracyTips: "최대 정확도 팁",
      tips: {
        enableGps: "기기 설정에서 GPS/위치 활성화",
        avoidMetal: "금속이나 자성 물체에서 멀리하세요",
        calibrateCompass: "8자 움직임으로 나침반 보정",
        holdHorizontal: "기기를 수평으로 잡으세요",
      },
      compassCalibration: "나침반 보정",
      calibrationDescription: "바늘이 정확하지 않으면 기기를 공중에서 8자 패턴으로 여러 번 움직여 나침반 센서를 보정하세요.",
      calibrationMovement: "보정 움직임",
      accuracy: {
        high: "높은 정확도",
        medium: "중간 정확도",
        low: "낮은 정확도",
        detecting: "감지 중...",
      },
      directions: {
        north: "북",
        northeast: "북동",
        east: "동",
        southeast: "남동",
        south: "남",
        southwest: "남서",
        west: "서",
        northwest: "북서",
      },
    },
    tajwid: {
      title: "타즈위드 배우기",
      learningProgress: "학습 진행 상황",
      overallProgress: "전체 진행 상황",
      lessonsCompleted: "완료된 수업",
      materialsMastered: "숙달된 자료",
      selectLesson: "수업 선택",
      materials: "자료",
      completed: "완료됨",
      finished: "완료",
      back: "뒤로",
      explanation: "설명",
      example: "예시",
      listen: "듣기",
      pause: "일시 정지",
      alreadyMastered: "이미 숙달됨",
      markComplete: "완료 표시",
      difficulty: {
        easy: "쉬움",
        medium: "보통",
        hard: "어려움",
        unknown: "알 수 없음",
      },
      categories: {
        makharij: "마카리줄 후루프",
        sifat: "시파툴 후루프",
        ahkam: "아카물 후루프",
        wafq: "와프크",
        category: "카테고리",
      },
    },
    hadith: {
      title: "하디스와 순나",
      selectedHadith: "선택된 하디스",
      favorite: "즐겨찾기",
      searchPlaceholder: "이 페이지에서 검색...",
      allBooks: "모든 책",
      selectBook: "하디스 책 선택",
      hadithList: "하디스 목록",
      showing: "표시 중",
      noHadithFound: "하디스를 찾을 수 없습니다",
      tryDifferentKeyword: "다른 검색어를 시도하세요",
      previous: "이전",
      next: "다음",
      hadiths: "하디스",
    },
    halal: {
      title: "할랄 레스토랑",
      subtitle: "가까운 할랄 식당 찾기",
      halalCertified: "할랄 인증",
      findNearby: "가까운 할랄 식당 찾기",
      restaurantsFound: "할랄 레스토랑 발견",
      in: "에서",
      restaurants: "레스토랑",
      menu: "메뉴",
      menuAvailable: "메뉴 사용 가능",
      noRestaurantsFound: "레스토랑을 찾을 수 없습니다",
      tryDifferentFilter: "필터를 변경하거나 다른 도시를 선택하세요",
      motivationalQuote: "알라가 당신에게 제공한 합법적이고 좋은 것들을 먹으라",
    },
    donation: {
      title: "기부 및 자선",
      subtitle: "움마를 위한 최선의 기부를 하세요. 당신이 기부하는 모든 루피아는 필요한 사람들을 도울 것입니다.",
      donationList: "기부 목록",
      selectDonation: "지원하고 싶은 기부를 선택하세요",
      donations: "기부",
      progress: "진행 상황",
      days: "일",
      donateNow: "지금 기부하기",
      needHelp: "도움이 필요하신가요?",
      helpDescription: "저희 팀은 기부 과정에서 도움을 드릴 준비가 되어 있습니다",
      favoriteDonation: "즐겨찾기 기부",
      share: "공유",
      donationHistory: "기부 내역",
      motivationalQuote: "실로 자선은 행한 자의 무덤의 열기를 끄고, 실로 심판의 날에 믿는 자는 자신의 자선의 그늘 아래에서 피난처를 얻을 것입니다",
      donorName: "기부자 이름",
      donorNameRequired: "기부자 이름",
      email: "이메일 (선택사항)",
      emailOptional: "이메일 (선택사항)",
      phone: "전화번호 (선택사항)",
      phoneOptional: "전화번호 (선택사항)",
      donationAmount: "기부 금액 (루피아)",
      donationAmountRequired: "기부 금액 (루피아)",
      minimumDonation: "최소 기부: 10,000 루피아",
      message: "메시지/기도 (선택사항)",
      messageOptional: "메시지/기도 (선택사항)",
      paymentMethod: "결제 방법",
      selectBank: "은행 선택",
      scanQRIS: "위의 QRIS를 전자지갑(Gopay, OVO, Dana) 또는 모바일 뱅킹을 사용하여 스캔하세요.",
      transferInstructions: "자동 확인을 위해 금액에 따라 마지막 3자리까지 이체해 주세요.",
      accountNumber: "계좌번호",
      confirmPayment: "결제 확인",
      processing: "처리 중...",
      donationSuccess: "기부가 성공적으로 생성되었습니다! 결제를 진행해 주세요.",
      pleasePay: "결제를 진행해 주세요.",
      noDonationsAvailable: "현재 사용 가능한 기부가 없습니다",
      page: "페이지",
      of: "의",
      previous: "이전",
      next: "다음",
    },
    mosque: {
      title: "모스크 및 기도실",
      locationNotDetected: "위치가 감지되지 않음",
      activateGps: "GPS 활성화",
      locationDetected: "위치 감지됨",
      searchRadius: "검색 반경",
      dragToExpand: "드래그하여 검색 범위 확장",
      all: "전체",
      mosque: "모스크",
      mushola: "기도실",
      distance: "거리",
      rating: "평점",
      name: "이름",
      loading: "로딩 중...",
      searchingNearby: "가까운 예배 장소 검색 중",
      placesFound: "예배 장소 발견",
      open24Hours: "24시간 영업",
      closed: "휴무",
      facilities: "시설:",
      navigate: "길찾기",
      noPlacesFound: "예배 장소를 찾을 수 없습니다",
      expandRadius: "검색 반경을 다음으로 확장해 보세요",
      km: "km",
    },
    event: {
      title: "일정 및 연구",
      subtitle: "가까운 지식 모임 찾기",
      all: "전체",
      online: "온라인",
      offline: "오프라인",
      loading: "일정 로딩 중...",
      failedToLoad: "이벤트 데이터를 불러오지 못했습니다.",
      registerNow: "지금 등록하기",
      noEvents: "이벤트 없음",
      noEventsInCategory: "이 카테고리에 대한 일정이 아직 없습니다.",
    },
    tasbih: {
      title: "디지털 타스비",
      settings: "설정",
      guide: "가이드",
      selectDhikr: "지크르 선택",
      targetCount: "목표 카운트",
      currentCount: "현재 카운트",
      progress: "진행률",
      lastReset: "마지막 재설정:",
      press: "누르기",
      resetCount: "카운트 재설정",
      completed: "완료",
      guideStep1: "큰 원을 눌러 지크르 카운트 추가",
      guideStep2: "설정 아이콘을 클릭하여 지크르 유형 및 목표 변경",
      guideStep3: "재설정 버튼을 사용하여 처음부터 카운트 시작",
    },
    article: {
      title: "이슬람 기사",
      searchPlaceholder: "필요한 기사 검색...",
      trendingToday: "오늘의 트렌드",
      category: "카테고리",
      all: "전체",
      articlesFound: "기사 발견",
      resetFilter: "필터 재설정",
      read: "읽기",
      noArticlesFound: "기사를 찾을 수 없습니다",
      tryDifferentKeyword: "검색어 또는 카테고리 필터 변경 시도",
      viewAllArticles: "모든 기사 보기",
      min: "분",
    },
    askUstadz: {
      title: "우스타즈에게 물어보기",
      subtitle: "유능한 우스타즈에게 이슬람에 대해 질문하세요. 정확하고 신뢰할 수 있는 답변을 받으세요.",
      askQuestion: "질문하기",
      totalQuestions: "총 질문",
      answered: "답변됨",
      activeUstadz: "활성 우스타즈",
      popular: "인기",
      questionList: "질문 목록",
      questions: "질문",
      motivationalQuote: "지식을 구하는 것은 모든 무슬림에게 의무입니다",
    },
    hijriCalendar: {
      title: "히즈리 달력",
      today: "오늘",
      previous: "이전",
      next: "다음",
      importantDays: "중요한 날",
      noImportantDays: "이번 달에는 중요한 날이 없습니다",
      information: "정보",
      infoDescription: "달력의 날짜를 클릭하여 중요한 날의 세부 정보를 확인하세요. 점이나 아이콘이 있는 날짜는 이슬람에서 중요한 날입니다.",
      explanation: "설명",
      selectedDate: "선택한 날짜",
      importantDay: "중요한 날",
      todayMarker: "오늘",
    },
    templateLetter: {
      title: "편지 템플릿",
      searchPlaceholder: "편지 검색...",
      loading: "템플릿 로딩 중...",
      failedToLoad: "데이터를 불러오지 못했습니다.",
      tryAgain: "다시 시도",
      download: "다운로드",
      notFound: "찾을 수 없음",
      tryDifferentKeyword: "다른 키워드로 검색 시도",
      needOtherFormat: "다른 형식이 필요하신가요?",
      contactAdmin: "편지를 요청하려면 관리자에게 문의하세요.",
    },
    inheritance: {
      title: "상속 계산기",
      inheritanceInfo: "상속 및 고인 정보",
      deceasedGender: "고인 성별 (사망한 사람)",
      male: "남성",
      female: "여성",
      totalInheritance: "총 상속 (루피아)",
      heirs: "상속인",
      father: "아버지",
      mother: "어머니",
      wife: "아내",
      husband: "남편",
      son: "아들",
      daughter: "딸",
      calculate: "분배 계산",
      calculationResult: "계산 결과",
      total: "총계:",
      perPerson: "인당",
      share: "지분:",
      remaining: "남은 상속",
      totalGroup: "그룹 총계:",
      people: "명",
      remainingInheritance: "남은 상속 (라드)",
      remainingDescription: "아슈불 푸루드에 의해 완전히 분배되지 않은 남은 상속이 있습니다. 이 나머지는 일반적으로 그들의 지분에 비례하여 나삽 상속인에게 반환됩니다.",
      disclaimer: "*이 계산은 핵가족에 대한 기본 시뮬레이션을 사용합니다. 복잡한 경우(할아버지, 할머니, 형제자매, 칼라라)의 경우 신뢰할 수 있는 울라마나 상속 전문가와 상담하세요.",
    },
    zakatCalculator: {
      title: "자카트 계산기",
      zakatProfesi: "직업 자카트",
      zakatMaal: "재산 자카트",
      goldPricePerGram: "금 가격 /그램",
      enterFinancialData: "재무 데이터 입력",
      monthlyIncome: "월 소득",
      bonus: "보너스 / THR / 기타",
      debt: "부채 / 만기 할부",
      savings: "저축 / 예금 / 현금",
      goldSilver: "금 / 은 (루피아로 변환)",
      assets: "주식 / 유가증권",
      reset: "재설정",
      calculateZakat: "자카트 계산",
      zakatObligatory: "자카트 의무",
      zakatNotObligatory: "자카트 비의무",
      assetsReachedNisab: "자산이 니삽에 도달했습니다",
      assetsNotReachedNisab: "자산이 니삽에 도달하지 않았습니다",
      totalZakatToPay: "납부할 총 자카트",
      lastCalculated: "마지막 계산",
      currency: "IDR",
    },
    ebook: {
      title: "이슬람 전자책",
      subtitle: "디지털 이슬람 서적 컬렉션",
      selectedCategory: "선택된 카테고리",
      noBooksInCategory: "이 카테고리에 사용 가능한 책이 없습니다.",
      freeDownload: "무료 다운로드",
      freeDownloadDescription: "모든 전자책은 학습 및 다와를 위해 무료로 제공됩니다",
      pages: "페이지",
      rating: "평점",
      downloads: "다운로드",
      loading: "로딩 중...",
    },
    prayer: {
      title: "기도 시간",
      subtitle: "위치 기반 기도 시간",
      currentLocation: "현재 위치",
      locationNotSet: "위치가 설정되지 않음",
      useCurrentLocation: "현재 위치 사용",
      gettingLocation: "위치 가져오는 중...",
      locationRequired: "위치 필요",
      locationRequiredDesc: "정확한 기도 시간을 표시하려면 앱이 위치에 액세스해야 합니다.",
      allowLocationAccess: "위치 액세스 허용",
      prayerSchedule: "오늘의 기도 시간표",
      todaySchedule: "오늘의 기도 시간표",
      currentlyOngoing: "진행 중",
      completed: "완료",
      adhanReminder: "아잔 알림",
      adhanActive: "자동 아잔 활성화",
      activateReminder: "자동 알림 활성화",
      active: "활성",
      inactive: "비활성",
      testAdhan: "아잔 소리 테스트",
      playingAdhan: "아잔 재생 중",
      stop: "중지",
      test: "테스트",
      scheduledPrayers: "오늘 예정된 아잔:",
      allPrayersPassed: "오늘의 모든 기도 시간이 지났습니다",
      allowNotification: "더 나은 경험을 위해 브라우저 알림 허용",
      prayerNames: {
        fajr: "파즈르",
        dhuhr: "두후르",
        asr: "아스르",
        maghrib: "마그립",
        isha: "이샤",
      },
    },
  },
  jp: {
    home: {
      title: "IbadahApp",
      subtitle: "デジタル礼拝アプリ",
      greeting: "ようこそ",
      features: "機能",
      quickAccess: "クイックアクセス",
      todayPrayer: "今日の礼拝時間",
      currentPrayer: "現在の礼拝",
      nextPrayer: "次の礼拝",
      timeRemaining: "残り時間",
      minutes: "分",
      hours: "時間",
      viewAll: "すべて表示",
      loading: "読み込み中...",
    },
    common: {
      loading: "読み込み中...",
      error: "エラーが発生しました",
      retry: "再試行",
      close: "閉じる",
      save: "保存",
      cancel: "キャンセル",
      confirm: "確認",
      back: "戻る",
      next: "次へ",
      search: "検索",
    },
    widgets: {
      quran: "クルアーン",
      prayer: "礼拝時間",
      qibla: "キブラの方向",
      hijriCalendar: "ヒジュラ暦",
      asmaulHusna: "アスマウル・フスナー",
      doa: "祈りとズィクル",
      hadith: "ハディース",
      articles: "記事",
      store: "ストア",
    },
    quran: {
      title: "クルアーン",
      subtitle: "イスラムの聖典",
      searchPlaceholder: "スーラを検索（ラテン語、意味、アラビア語）...",
      readQuran: "クルアーンを読む",
      startFromFatihah: "アル・ファーティハから始める",
      bookmark: "ブックマーク",
      surahSaved: "スーラ保存済み",
      savedSurahs: "保存されたスーラ",
      noBookmarks: "ブックマークされたスーラはまだありません",
      recentlyRead: "最近読んだ",
      allSurahs: "すべてのスーラ",
      loading: "読み込み中...",
      surah: "スーラ",
      verses: "節",
      juz: "ジュズ",
      revelation: {
        all: "すべて",
        meccan: "マッカ",
        medinan: "マディーナ",
      },
    },
    kajian: {
      title: "イスラム研究",
      subtitle: "宗教知識を学び、深める",
      latestKajian: "最新のイスラム研究",
      listenKajian: "学者による選ばれた研究を聞く",
      searchPlaceholder: "研究、学者、またはトピックを検索...",
      sortBy: "並び替え",
      newest: "最新",
      oldest: "最古",
      ustadz: "学者",
      allUstadz: "すべての学者",
      resetFilter: "フィルターをリセット",
      kajianList: "研究リスト",
      kajian: "研究",
      noKajianFound: "まだ研究が見つかりません",
      noKajianMatch: "フィルターに一致する研究がありません",
      quickAccess: "クイックアクセス",
      getNotifications: "最新の研究とライブストリーミングスケジュールの通知を受け取る",
    },
    prayerTracker: {
      title: "礼拝トラッカー",
      subtitle: "毎日の礼拝の進捗を追跡",
      loading: "礼拝スケジュールを読み込み中...",
      today: "今日",
      monthly: "月間",
      loadingSchedule: "礼拝スケジュールを読み込み中...",
      failedToLoad: "礼拝スケジュールの読み込みに失敗しました。インターネット接続を確認してください。",
      checkConnection: "インターネット接続を確認してください",
      motivationalQuote: "私を覚えるために礼拝を確立しなさい",
    },
    qibla: {
      title: "キブラの方向",
      detectingLocation: "位置情報を検出中...",
      ensureGpsActive: "GPSが有効で、位置情報へのアクセスが許可されていることを確認してください",
      failedToGetLocation: "位置情報の取得に失敗しました",
      tryAgain: "再試行",
      facingQibla: "キブラを向いています！",
      rotateDevice: "矢印の方向にデバイスを回転させてください",
      qiblaDirection: "キブラの方向",
      distanceToKaaba: "カーバまでの距離",
      enableRealtimeCompass: "リアルタイムコンパスを有効化",
      compassActive: "コンパスが有効 - デバイスを動かしてください",
      moveDevice: "デバイスを動かしてください",
      accuracyTips: "最大精度のヒント",
      tips: {
        enableGps: "デバイス設定でGPS/位置情報を有効化",
        avoidMetal: "金属や磁気のある物体から離してください",
        calibrateCompass: "8の字の動きでコンパスを較正",
        holdHorizontal: "デバイスを水平に持ってください",
      },
      compassCalibration: "コンパス較正",
      calibrationDescription: "針が正確でない場合は、デバイスを空中で8の字のパターンで数回動かしてコンパスセンサーを較正してください。",
      calibrationMovement: "較正の動き",
      accuracy: {
        high: "高精度",
        medium: "中精度",
        low: "低精度",
        detecting: "検出中...",
      },
      directions: {
        north: "北",
        northeast: "北東",
        east: "東",
        southeast: "南東",
        south: "南",
        southwest: "南西",
        west: "西",
        northwest: "北西",
      },
    },
    tajwid: {
      title: "タジュウィードを学ぶ",
      learningProgress: "学習の進捗",
      overallProgress: "全体的な進捗",
      lessonsCompleted: "完了したレッスン",
      materialsMastered: "習得した教材",
      selectLesson: "レッスンを選択",
      materials: "教材",
      completed: "完了",
      finished: "終了",
      back: "戻る",
      explanation: "説明",
      example: "例",
      listen: "聞く",
      pause: "一時停止",
      alreadyMastered: "既に習得済み",
      markComplete: "完了としてマーク",
      difficulty: {
        easy: "簡単",
        medium: "普通",
        hard: "難しい",
        unknown: "不明",
      },
      categories: {
        makharij: "マカリジュル・フルーフ",
        sifat: "シファトゥル・フルーフ",
        ahkam: "アッカムル・フルーフ",
        wafq: "ワフク",
        category: "カテゴリ",
      },
    },
    hadith: {
      title: "ハディースとスンナ",
      selectedHadith: "選択されたハディース",
      favorite: "お気に入り",
      searchPlaceholder: "このページで検索...",
      allBooks: "すべての本",
      selectBook: "ハディースの本を選択",
      hadithList: "ハディース一覧",
      showing: "表示中",
      noHadithFound: "ハディースが見つかりません",
      tryDifferentKeyword: "別の検索キーワードを試してください",
      previous: "前へ",
      next: "次へ",
      hadiths: "ハディース",
    },
    halal: {
      title: "ハラールレストラン",
      subtitle: "近くのハラールレストランを見つける",
      halalCertified: "ハラール認証",
      findNearby: "近くのハラールレストランを見つける",
      restaurantsFound: "ハラールレストランが見つかりました",
      in: "で",
      restaurants: "レストラン",
      menu: "メニュー",
      menuAvailable: "メニュー利用可能",
      noRestaurantsFound: "レストランが見つかりません",
      tryDifferentFilter: "フィルターを変更するか、別の都市を選択してください",
      motivationalQuote: "アッラーがあなたに与えた合法で良いものを食べなさい",
    },
    donation: {
      title: "寄付と慈善",
      subtitle: "ウンマの利益のために最善の寄付をしてください。あなたが寄付するすべてのルピアは、必要な人々を助けます。",
      donationList: "寄付リスト",
      selectDonation: "支援したい寄付を選択してください",
      donations: "寄付",
      progress: "進捗",
      days: "日",
      donateNow: "今すぐ寄付",
      needHelp: "ヘルプが必要ですか？",
      helpDescription: "私たちのチームは寄付プロセスであなたをサポートする準備ができています",
      favoriteDonation: "お気に入りの寄付",
      share: "共有",
      donationHistory: "寄付履歴",
      motivationalQuote: "確かに慈善はその行為者の墓の熱を消し、確かに審判の日に信者は自分の慈善の陰に避難所を見つけるでしょう",
      donorName: "寄付者名",
      donorNameRequired: "寄付者名",
      email: "メール（オプション）",
      emailOptional: "メール（オプション）",
      phone: "電話番号（オプション）",
      phoneOptional: "電話番号（オプション）",
      donationAmount: "寄付金額（ルピア）",
      donationAmountRequired: "寄付金額（ルピア）",
      minimumDonation: "最小寄付額: 10,000ルピア",
      message: "メッセージ/祈り（オプション）",
      messageOptional: "メッセージ/祈り（オプション）",
      paymentMethod: "支払い方法",
      selectBank: "銀行を選択",
      scanQRIS: "上記のQRISを電子財布（Gopay、OVO、Dana）またはモバイルバンキングでスキャンしてください。",
      transferInstructions: "自動確認のために、金額に応じて最後の3桁まで送金してください。",
      accountNumber: "口座番号",
      confirmPayment: "支払い確認",
      processing: "処理中...",
      donationSuccess: "寄付が正常に作成されました！支払いを行ってください。",
      pleasePay: "支払いを行ってください。",
      noDonationsAvailable: "現在利用可能な寄付はありません",
      page: "ページ",
      of: "の",
      previous: "前へ",
      next: "次へ",
    },
    mosque: {
      title: "モスクと礼拝室",
      locationNotDetected: "位置が検出されていません",
      activateGps: "GPSを有効化",
      locationDetected: "位置が検出されました",
      searchRadius: "検索半径",
      dragToExpand: "ドラッグして検索範囲を拡大",
      all: "すべて",
      mosque: "モスク",
      mushola: "礼拝室",
      distance: "距離",
      rating: "評価",
      name: "名前",
      loading: "読み込み中...",
      searchingNearby: "近くの礼拝場所を検索中",
      placesFound: "礼拝場所が見つかりました",
      open24Hours: "24時間営業",
      closed: "閉鎖",
      facilities: "施設:",
      navigate: "ナビゲート",
      noPlacesFound: "礼拝場所が見つかりません",
      expandRadius: "検索半径を以下に拡大してみてください",
      km: "km",
    },
    event: {
      title: "スケジュールと研究",
      subtitle: "近くの知識の集まりを見つける",
      all: "すべて",
      online: "オンライン",
      offline: "オフライン",
      loading: "スケジュールを読み込み中...",
      failedToLoad: "イベントデータの読み込みに失敗しました。",
      registerNow: "今すぐ登録",
      noEvents: "イベントなし",
      noEventsInCategory: "このカテゴリのスケジュールはまだありません。",
    },
    tasbih: {
      title: "デジタルタスビー",
      settings: "設定",
      guide: "ガイド",
      selectDhikr: "ズィクルを選択",
      targetCount: "目標カウント",
      currentCount: "現在のカウント",
      progress: "進捗",
      lastReset: "最後のリセット:",
      press: "押す",
      resetCount: "カウントをリセット",
      completed: "完了",
      guideStep1: "大きな円を押してズィクルカウントを追加",
      guideStep2: "設定アイコンをクリックしてズィクルの種類と目標を変更",
      guideStep3: "リセットボタンを使用して最初からカウントを開始",
    },
    article: {
      title: "イスラム記事",
      searchPlaceholder: "必要な記事を検索...",
      trendingToday: "今日のトレンド",
      category: "カテゴリ",
      all: "すべて",
      articlesFound: "記事が見つかりました",
      resetFilter: "フィルターをリセット",
      read: "読む",
      noArticlesFound: "記事が見つかりません",
      tryDifferentKeyword: "検索キーワードまたはカテゴリフィルターを変更してみてください",
      viewAllArticles: "すべての記事を見る",
      min: "分",
    },
    askUstadz: {
      title: "ウスタズに尋ねる",
      subtitle: "有能なウスタズにイスラムについて質問してください。正確で信頼できる回答を得られます。",
      askQuestion: "質問する",
      totalQuestions: "総質問数",
      answered: "回答済み",
      activeUstadz: "アクティブなウスタズ",
      popular: "人気",
      questionList: "質問リスト",
      questions: "質問",
      motivationalQuote: "知識を求めることはすべてのムスリムにとって義務です",
    },
    hijriCalendar: {
      title: "ヒジュラ暦",
      today: "今日",
      previous: "前へ",
      next: "次へ",
      importantDays: "重要な日",
      noImportantDays: "今月は重要な日がありません",
      information: "情報",
      infoDescription: "カレンダーの日付をクリックして重要な日の詳細を確認してください。点やアイコンがある日付はイスラムで重要な日です。",
      explanation: "説明",
      selectedDate: "選択した日付",
      importantDay: "重要な日",
      todayMarker: "今日",
    },
    templateLetter: {
      title: "手紙テンプレート",
      searchPlaceholder: "手紙を検索...",
      loading: "テンプレートを読み込み中...",
      failedToLoad: "データの読み込みに失敗しました。",
      tryAgain: "再試行",
      download: "ダウンロード",
      notFound: "見つかりません",
      tryDifferentKeyword: "別のキーワードで検索してみてください",
      needOtherFormat: "他の形式が必要ですか？",
      contactAdmin: "手紙をリクエストするには管理者に連絡してください。",
    },
    inheritance: {
      title: "相続計算機",
      inheritanceInfo: "相続と故人の情報",
      deceasedGender: "故人の性別（亡くなった人）",
      male: "男性",
      female: "女性",
      totalInheritance: "総相続額（ルピア）",
      heirs: "相続人",
      father: "父親",
      mother: "母親",
      wife: "妻",
      husband: "夫",
      son: "息子",
      daughter: "娘",
      calculate: "分配を計算",
      calculationResult: "計算結果",
      total: "合計:",
      perPerson: "一人当たり",
      share: "シェア:",
      remaining: "残りの相続",
      totalGroup: "グループ合計:",
      people: "人",
      remainingInheritance: "残りの相続（ラッド）",
      remainingDescription: "アシュブル・フルードによって完全に分配されなかった残りの相続があります。この残りは通常、彼らのシェアに比例してナサブ相続人に返されます。",
      disclaimer: "*この計算は核家族の基本的なシミュレーションを使用しています。複雑なケース（祖父、祖母、兄弟、カララ）については、信頼できるウラマーまたは相続の専門家に相談してください。",
    },
    zakatCalculator: {
      title: "ザカート計算機",
      zakatProfesi: "職業ザカート",
      zakatMaal: "財産ザカート",
      goldPricePerGram: "金価格 /グラム",
      enterFinancialData: "財務データを入力",
      monthlyIncome: "月収",
      bonus: "ボーナス / THR / その他",
      debt: "債務 / 分割払い期限",
      savings: "預金 / 定期預金 / 現金",
      goldSilver: "金 / 銀 (ルピアに変換)",
      assets: "株式 / 有価証券",
      reset: "リセット",
      calculateZakat: "ザカートを計算",
      zakatObligatory: "ザカート義務",
      zakatNotObligatory: "ザカート非義務",
      assetsReachedNisab: "資産がニサブに達しました",
      assetsNotReachedNisab: "資産がニサブに達していません",
      totalZakatToPay: "支払うべき総ザカート",
      lastCalculated: "最後の計算",
      currency: "IDR",
    },
    ebook: {
      title: "イスラム電子書籍",
      subtitle: "デジタルイスラム書籍コレクション",
      selectedCategory: "選択されたカテゴリ",
      noBooksInCategory: "このカテゴリに利用可能な本がありません。",
      freeDownload: "無料ダウンロード",
      freeDownloadDescription: "すべての電子書籍は学習とダワのために無料で提供されています",
      pages: "ページ",
      rating: "評価",
      downloads: "ダウンロード",
      loading: "読み込み中...",
    },
    prayer: {
      title: "礼拝時間",
      subtitle: "位置情報に基づく礼拝時間",
      currentLocation: "現在の位置",
      locationNotSet: "位置が設定されていません",
      useCurrentLocation: "現在の位置を使用",
      gettingLocation: "位置情報を取得中...",
      locationRequired: "位置情報が必要",
      locationRequiredDesc: "正確な礼拝時間を表示するには、アプリが位置情報にアクセスする必要があります。",
      allowLocationAccess: "位置情報へのアクセスを許可",
      prayerSchedule: "今日の礼拝スケジュール",
      todaySchedule: "今日の礼拝スケジュール",
      currentlyOngoing: "進行中",
      completed: "完了",
      adhanReminder: "アザーンリマインダー",
      adhanActive: "自動アザーンが有効",
      activateReminder: "自動リマインダーを有効化",
      active: "有効",
      inactive: "無効",
      testAdhan: "アザーンの音をテスト",
      playingAdhan: "アザーン再生中",
      stop: "停止",
      test: "テスト",
      scheduledPrayers: "今日予定されているアザーン:",
      allPrayersPassed: "今日のすべての礼拝時間が過ぎました",
      allowNotification: "より良い体験のためにブラウザの通知を許可",
      prayerNames: {
        fajr: "ファジュル",
        dhuhr: "ズフル",
        asr: "アスル",
        maghrib: "マグリブ",
        isha: "イシャー",
      },
    },
  },
};

// Get current locale from localStorage or default to 'id'
export const getCurrentLocale = (): LocaleCode => {
  if (typeof window === "undefined") return "id";
  const saved = localStorage.getItem("app_locale");
  return (saved as LocaleCode) || "id";
};

// Set locale
export const setLocale = (locale: LocaleCode) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("app_locale", locale);
};

// Get translation
export const t = (key: string, locale?: LocaleCode): string => {
  const currentLocale = locale || getCurrentLocale();
  const keys = key.split(".");
  let value: unknown = translations[currentLocale];

  for (const k of keys) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      value = (value as Record<string, unknown>)[k];
    } else {
      value = undefined;
    }
    if (value === undefined) {
      // Fallback to Indonesian if translation not found
      value = translations.id;
      for (const fallbackKey of keys) {
        if (value && typeof value === "object" && !Array.isArray(value)) {
          value = (value as Record<string, unknown>)[fallbackKey];
        } else {
          value = undefined;
          break;
        }
      }
      break;
    }
  }

  return typeof value === "string" ? value : key;
};
