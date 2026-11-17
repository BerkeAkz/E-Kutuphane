/* ==========================================================================
   E-KÜTÜPHANE — İSTEMCİ ETKİLEŞİMLERİ (script.js)
   - Yazdıkça açılan canlı kitap arama kutusu (Python API entegrasyonuna hazır)
   - Arama sonuçlarından doğrudan "Sonra Okuyacaklarım Listesi"ne kitap ekleme
   - Okuyacaklarım listesindeki kartlarda "Okudum" butonu ile Kütüphanem'e aktarma
   - Kütüphanem ve Okuma Listem etkileşimli sayaçları
   - Giriş Yap / Kayıt Ol modal penceresi kontrolü
   ========================================================================== */

(function () {
  "use strict";

  // 1. Örnek Kitap Kataloğu (Python API bağlandığında fetch ile dinamik çekilecek)
  const SAMPLE_BOOKS = [
    {
      title: "Nutuk",
      author: "Mustafa Kemal Atatürk",
      topic: "Tarih ve Cumhuriyet Arşivi",
      year: "1927",
      pages: "658 Sayfa",
      note: "Milli Mücadele ve Cumhuriyet'in kuruluş sürecinin birinci elden tarihsel belgesi.",
      image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "Geometri",
      author: "Mustafa Kemal Atatürk",
      topic: "Bilim ve Eğitim",
      year: "1937",
      pages: "90 Sayfa",
      note: "Türkçe matematik terimlerinin temelini atan tarihsel kılavuz eser.",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "Kürk Mantolu Madonna",
      author: "Sabahattin Ali",
      topic: "Türk Edebiyatı · Roman",
      year: "1943",
      pages: "160 Sayfa",
      note: "Raif Efendi'nin Berlin yılları ve iç dünyasına dair unutulmaz bir portre.",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "İçimizdeki Şeytan",
      author: "Sabahattin Ali",
      topic: "Türk Edebiyatı · Roman",
      year: "1940",
      pages: "264 Sayfa",
      note: "Ömer ve Macide üzerinden bireyin sorumluluktan kaçışını sorgulayan roman.",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "Kuyucaklı Yusuf",
      author: "Sabahattin Ali",
      topic: "Toplumcu Klasik",
      year: "1937",
      pages: "221 Sayfa",
      note: "Edremit kasabasında doğayla uyumlu bir gencin toplumsal düzenle çatışması.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "Saatleri Ayarlama Enstitüsü",
      author: "Ahmet Hamdi Tanpınar",
      topic: "Modern Klasik · Roman",
      year: "1961",
      pages: "382 Sayfa",
      note: "Doğu ile Batı arasında zaman, modernleşme ve ironi üzerine derin bir roman.",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "Huzur",
      author: "Ahmet Hamdi Tanpınar",
      topic: "Türk Edebiyatı · Roman",
      year: "1949",
      pages: "454 Sayfa",
      note: "Mümtaz ve Nuran'ın İstanbul boğazı, musiki ve tarih ekseninde gelişen derin hikayesi.",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "İnce Memed",
      author: "Yaşar Kemal",
      topic: "Toplumcu Roman",
      year: "1955",
      pages: "436 Sayfa",
      note: "Çukurova doğası ve insan direncini destansı bir dille anlatan başyapıt.",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "Çalıkuşu",
      author: "Reşat Nuri Güntekin",
      topic: "Cumhuriyet Klasikleri",
      year: "1922",
      pages: "408 Sayfa",
      note: "Feride'nin Anadolu kasabalarındaki öğretmenlik yılları ve hatıra defteri.",
      image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "Tutunamayanlar",
      author: "Oğuz Atay",
      topic: "Modern Türk Edebiyatı",
      year: "1972",
      pages: "724 Sayfa",
      note: "Selim Işık ve Turgut Özben üzerinden bireyin toplumla hesaplaşmasını anlatan başyapıt.",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "Suç ve Ceza",
      author: "Fyodor Dostoyevski",
      topic: "Dünya Klasikleri · Psikoloji",
      year: "1866",
      pages: "687 Sayfa",
      note: "Raskolnikov'un vicdan, adalet ve ahlaki sınırlar arasındaki psikolojik çatışması.",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "Sefiller",
      author: "Victor Hugo",
      topic: "Dünya Klasikleri · Toplum",
      year: "1862",
      pages: "1463 Sayfa",
      note: "Jean Valjean'ın kefaret yolculuğu üzerinden 19. yüzyıl Fransa'sında merhamet ve adalet.",
      image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "Yaban",
      author: "Yakup Kadri Karaosmanoğlu",
      topic: "Cumhuriyet Dönemi",
      year: "1932",
      pages: "215 Sayfa",
      note: "Kurtuluş Savaşı yıllarında bir Anadolu köyünde aydın ile halk arasındaki karşılaşma.",
      image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "Aylak Adam",
      author: "Yusuf Atılgan",
      topic: "Modern Klasik",
      year: "1959",
      pages: "192 Sayfa",
      note: "Kent yaşamında gerçek sevgiyi ve anlamı arayan C.'nin dört mevsimlik içsel yolculuğu.",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "Dokuzuncu Hariciye Koğuşu",
      author: "Peyami Safa",
      topic: "Psikolojik Roman",
      year: "1930",
      pages: "112 Sayfa",
      note: "Hasta bir gencin hastane koridorları ile Erenköy köşkü arasındaki iç gözlemleri.",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "Puslu Kıtalar Atlası",
      author: "İhsan Oktay Anar",
      topic: "Tarihi ve Felsefi Kurgu",
      year: "1995",
      pages: "238 Sayfa",
      note: "17. yüzyıl İstanbul'unda düş ile gerçeğin iç içe geçtiği felsefi bir serüven.",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "Devlet",
      author: "Platon",
      topic: "Felsefe ve Siyaset",
      year: "MÖ 375",
      pages: "344 Sayfa",
      note: "Adalet, erdem, eğitim ve ideal toplum düzeni üzerine felsefi diyaloglar.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80"
    }
  ];

  const STORAGE_READ_KEY = "ekutuphane_read_from_watchlist";

  const searchWrap = document.getElementById("hero-search-wrap");
  const searchForm = document.getElementById("hero-search-form");
  const searchInput = document.getElementById("book-search-input");
  const searchDropdown = document.getElementById("search-dropdown");
  const searchDropdownList = document.getElementById("search-dropdown-list");
  const searchStatusText = document.getElementById("search-status-text");
  const searchCountText = document.getElementById("search-count-text");

  const libraryCountEl = document.getElementById("library-count");
  const watchlistCountEl = document.getElementById("watchlist-count");
  const watchlistGrid = document.getElementById("watchlist-grid");
  const libraryGrid = document.getElementById("library-grid");

  function getSavedReadBooks() {
    try {
      const raw = localStorage.getItem(STORAGE_READ_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function setSavedReadBooks(list) {
    try {
      localStorage.setItem(STORAGE_READ_KEY, JSON.stringify(list));
    } catch (e) {
      // Tarayıcı gizli modda depolamaya izin vermezse sessizce geç
    }
  }

  function toggleBookInSavedReadStorage(bookData, isRead) {
    const list = getSavedReadBooks().filter(function (item) {
      return item.title !== bookData.title;
    });
    if (isRead) {
      list.unshift(bookData);
    }
    setSavedReadBooks(list);
  }

  function extractBookDataFromCard(card) {
    if (!card) return null;
    const titleEl = card.querySelector(".card-title");
    const genreEl = card.querySelector(".book-specimen-genre");
    const authorEl = card.querySelector(".book-specimen-author");
    const noteEl = card.querySelector(".book-specimen-note");
    const imgEl = card.querySelector(".book-specimen-cover img");

    const title =
      card.getAttribute("data-book-title") ||
      (titleEl ? titleEl.textContent.trim() : "");

    const matched = SAMPLE_BOOKS.find(function (b) {
      return b.title === title;
    });
    if (matched) return matched;

    return {
      title: title,
      author: authorEl ? authorEl.textContent.trim() : "",
      topic: genreEl ? genreEl.textContent.trim() : "Edebi Eser",
      year: "",
      pages: "",
      note: noteEl ? noteEl.textContent.trim() : "",
      image: imgEl ? imgEl.src : ""
    };
  }

  function recalcShelfCounts() {
    const libBtns = document.querySelectorAll('[data-shelf-action="library"].is-active');
    if (libraryCountEl) libraryCountEl.textContent = String(libBtns.length);

    if (watchlistCountEl) {
      if (watchlistGrid) {
        // Sonra Okuyacaklarım sayfasında henüz "Okudum" olarak işaretlenmemiş kartların sayısı
        const remainingBtns = watchlistGrid.querySelectorAll(
          '[data-shelf-action="mark-read"]:not(.is-active)'
        );
        watchlistCountEl.textContent = String(remainingBtns.length);
      } else {
        const watchBtns = document.querySelectorAll(
          '[data-shelf-action="watchlist"].is-active'
        );
        watchlistCountEl.textContent = String(watchBtns.length);
      }
    }
  }

  function updateWatchlistCount(delta) {
    if (!watchlistCountEl) return;
    if (watchlistGrid) {
      recalcShelfCounts();
      return;
    }
    const current = parseInt(watchlistCountEl.textContent, 10) || 0;
    watchlistCountEl.textContent = String(Math.max(0, current + delta));
  }

  function bindShelfButton(btn) {
    btn.addEventListener("click", function () {
      const type = btn.getAttribute("data-shelf-action");
      btn.classList.toggle("is-active");
      const active = btn.classList.contains("is-active");

      if (type === "library") {
        btn.textContent = active ? "Kütüphanemde" : "Kütüphaneme Ekle";
      } else if (type === "mark-read") {
        // Sonra Okuyacaklarım kartındaki "Okudum" butonu -> Kütüphaneme ekler
        btn.textContent = active ? "Kütüphaneme Eklendi" : "Okudum";
        const card = btn.closest(".book-specimen");
        if (card) {
          const dateEl = card.querySelector(".book-read-date");
          if (dateEl) {
            if (!dateEl.getAttribute("data-orig-date")) {
              dateEl.setAttribute("data-orig-date", dateEl.textContent);
            }
            dateEl.textContent = active
              ? "Okundu · Kütüphanemde"
              : dateEl.getAttribute("data-orig-date");
          }
          const bookData = extractBookDataFromCard(card);
          if (bookData) {
            toggleBookInSavedReadStorage(bookData, active);
          }
        }
      } else {
        btn.textContent = active ? "Listemde Ekli" : "Okuma Listem";
      }

      recalcShelfCounts();
    });
  }

  document.querySelectorAll("[data-shelf-action]").forEach(bindShelfButton);

  // Kütüphanem sayfasındaysak, Sonra Okuyacaklarım'dan "Okudum" denilerek eklenen kitapları rafa yansıt
  if (libraryGrid) {
    const savedReadBooks = getSavedReadBooks();
    savedReadBooks.forEach(function (book) {
      const existingTitles = Array.from(
        libraryGrid.querySelectorAll(".card-title")
      ).map(function (el) {
        return el.textContent.trim();
      });
      if (existingTitles.includes(book.title)) return;

      const article = document.createElement("article");
      article.className = "book-specimen reveal";

      const topWrap = document.createElement("div");

      const figure = document.createElement("figure");
      figure.className = "book-specimen-cover";

      const img = document.createElement("img");
      img.src =
        book.image ||
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80";
      img.alt = book.title + " eseri için ciltli kitap görünümü";
      img.loading = "lazy";
      figure.appendChild(img);

      const body = document.createElement("div");
      body.className = "book-specimen-body";

      const genre = document.createElement("span");
      genre.className = "book-specimen-genre";
      genre.textContent = book.year ? book.topic + " · " + book.year : book.topic;

      const titleEl = document.createElement("h2");
      titleEl.className = "card-title";
      titleEl.textContent = book.title;

      const authorEl = document.createElement("p");
      authorEl.className = "book-specimen-author";
      authorEl.textContent =
        book.pages && !book.author.includes("Sayfa")
          ? book.author + " · " + book.pages
          : book.author;

      const noteEl = document.createElement("p");
      noteEl.className = "book-specimen-note";
      noteEl.textContent =
        book.note || "Okuyacaklarım listenizden tamamlanarak kütüphanenize eklendi.";

      body.appendChild(genre);
      body.appendChild(titleEl);
      body.appendChild(authorEl);
      body.appendChild(noteEl);

      topWrap.appendChild(figure);
      topWrap.appendChild(body);

      const foot = document.createElement("div");
      foot.className = "book-specimen-foot";

      const dateSpan = document.createElement("span");
      dateSpan.className = "book-read-date nums";
      dateSpan.textContent = "Okundu · Yeni Tamamlandı";

      const actionBtn = document.createElement("button");
      actionBtn.type = "button";
      actionBtn.className = "book-action-btn is-active";
      actionBtn.setAttribute("data-shelf-action", "library");
      actionBtn.textContent = "Kütüphanemde";
      bindShelfButton(actionBtn);

      foot.appendChild(dateSpan);
      foot.appendChild(actionBtn);

      article.appendChild(topWrap);
      article.appendChild(foot);

      libraryGrid.insertBefore(article, libraryGrid.firstChild);
    });
    recalcShelfCounts();
  }

  // Sonra Okuyacaklarım sayfasındaysak, daha önce "Okudum" olarak işaretlenmiş olanları geri yükle
  if (watchlistGrid) {
    const savedTitles = getSavedReadBooks().map(function (b) {
      return b.title;
    });
    watchlistGrid.querySelectorAll(".book-specimen").forEach(function (card) {
      const title = card.getAttribute("data-book-title");
      if (savedTitles.includes(title)) {
        const btn = card.querySelector('[data-shelf-action="mark-read"]');
        const dateEl = card.querySelector(".book-read-date");
        if (btn) {
          btn.classList.add("is-active");
          btn.textContent = "Kütüphaneme Eklendi";
        }
        if (dateEl) {
          if (!dateEl.getAttribute("data-orig-date")) {
            dateEl.setAttribute("data-orig-date", dateEl.textContent);
          }
          dateEl.textContent = "Okundu · Kütüphanemde";
        }
      }
    });
    recalcShelfCounts();
  }

  function findWatchlistCardByTitle(title) {
    if (!watchlistGrid) return null;
    const cards = watchlistGrid.querySelectorAll("[data-book-title]");
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].getAttribute("data-book-title") === title) {
        return cards[i];
      }
    }
    return null;
  }

  function isBookInWatchlistGrid(title) {
    return Boolean(findWatchlistCardByTitle(title));
  }

  function addBookToWatchlistGrid(book) {
    if (!watchlistGrid) return false;

    const existingCard = findWatchlistCardByTitle(book.title);
    if (existingCard) {
      existingCard.remove();
      recalcShelfCounts();
      return false;
    }

    const article = document.createElement("article");
    article.className = "book-specimen reveal";
    article.setAttribute("data-book-title", book.title);

    const topWrap = document.createElement("div");

    const figure = document.createElement("figure");
    figure.className = "book-specimen-cover";

    const img = document.createElement("img");
    img.src =
      book.image ||
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80";
    img.alt = book.title + " eseri için ciltli kitap görünümü";
    img.loading = "lazy";
    figure.appendChild(img);

    const body = document.createElement("div");
    body.className = "book-specimen-body";

    const genre = document.createElement("span");
    genre.className = "book-specimen-genre";
    genre.textContent = book.topic + " · " + book.year;

    const titleEl = document.createElement("h3");
    titleEl.className = "card-title";
    titleEl.textContent = book.title;

    const authorEl = document.createElement("p");
    authorEl.className = "book-specimen-author";
    authorEl.textContent = book.author + " · " + (book.pages || "320 Sayfa");

    const noteEl = document.createElement("p");
    noteEl.className = "book-specimen-note";
    noteEl.textContent =
      book.note || "Okuyacaklarım listenize arama çubuğu üzerinden eklenen eser.";

    body.appendChild(genre);
    body.appendChild(titleEl);
    body.appendChild(authorEl);
    body.appendChild(noteEl);

    topWrap.appendChild(figure);
    topWrap.appendChild(body);

    const foot = document.createElement("div");
    foot.className = "book-specimen-foot";

    const dateSpan = document.createElement("span");
    dateSpan.className = "book-read-date nums";
    dateSpan.textContent = "Sırada · Yeni Eklendi";

    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "book-action-btn";
    actionBtn.setAttribute("data-shelf-action", "mark-read");
    actionBtn.textContent = "Okudum";
    bindShelfButton(actionBtn);

    foot.appendChild(dateSpan);
    foot.appendChild(actionBtn);

    article.appendChild(topWrap);
    article.appendChild(foot);

    watchlistGrid.insertBefore(article, watchlistGrid.firstChild);
    recalcShelfCounts();
    return true;
  }

  function closeSearchDropdown() {
    if (!searchDropdown) return;
    searchDropdown.hidden = true;
  }

  function handleSearchInput() {
    if (!searchInput || !searchDropdown || !searchDropdownList) return;

    const rawQuery = searchInput.value.trim();

    if (rawQuery.length === 0) {
      closeSearchDropdown();
      searchDropdownList.innerHTML = "";
      return;
    }

    const query = rawQuery.toLocaleLowerCase("tr-TR");
    const matches = SAMPLE_BOOKS.filter(function (book) {
      const text = (
        book.title +
        " " +
        book.author +
        " " +
        book.topic +
        " " +
        book.year
      ).toLocaleLowerCase("tr-TR");
      return text.includes(query);
    });

    searchDropdown.hidden = false;
    searchStatusText.textContent = "“" + rawQuery + "” için arama sonuçları";
    searchCountText.textContent = matches.length + " sonuç";
    searchDropdownList.innerHTML = "";

    if (matches.length === 0) {
      const emptyRow = document.createElement("div");
      emptyRow.className = "search-result-row";
      emptyRow.innerHTML =
        "<div class='search-result-meta'>" +
        "<strong>Eşleşen kitap bulunamadı</strong>" +
        "<span>Farklı bir kitap adı, yazar veya konu başlığı deneyin.</span>" +
        "</div>";
      searchDropdownList.appendChild(emptyRow);
      return;
    }

    matches.slice(0, 6).forEach(function (book) {
      const row = document.createElement("div");
      row.className = "search-result-row";

      const meta = document.createElement("div");
      meta.className = "search-result-meta";

      const titleEl = document.createElement("strong");
      titleEl.textContent = book.title;

      const subEl = document.createElement("span");
      subEl.textContent =
        book.author +
        " · " +
        book.topic +
        " (" +
        book.year +
        ")" +
        (book.pages ? " · " + book.pages : "");

      meta.appendChild(titleEl);
      meta.appendChild(subEl);

      const actionBtn = document.createElement("button");
      actionBtn.type = "button";
      actionBtn.className = "search-result-btn";

      if (watchlistGrid) {
        const alreadyInList = isBookInWatchlistGrid(book.title);
        if (alreadyInList) actionBtn.classList.add("is-saved");
        actionBtn.textContent = alreadyInList
          ? "Listede Ekli"
          : "Okuyacaklarıma Ekle";

        actionBtn.addEventListener("click", function () {
          const addedNow = addBookToWatchlistGrid(book);
          actionBtn.classList.toggle("is-saved", addedNow);
          actionBtn.textContent = addedNow
            ? "Listede Ekli"
            : "Okuyacaklarıma Ekle";
        });
      } else {
        actionBtn.textContent = "Listeme Ekle";
        actionBtn.addEventListener("click", function () {
          actionBtn.classList.toggle("is-saved");
          const saved = actionBtn.classList.contains("is-saved");
          actionBtn.textContent = saved ? "Listeye Eklendi" : "Listeme Ekle";
          updateWatchlistCount(saved ? 1 : -1);
        });
      }

      row.appendChild(meta);
      row.appendChild(actionBtn);
      searchDropdownList.appendChild(row);
    });
  }

  if (searchInput && searchForm) {
    searchInput.addEventListener("input", handleSearchInput);
    searchInput.addEventListener("focus", function () {
      if (searchInput.value.trim().length > 0) {
        handleSearchInput();
      }
    });

    searchForm.addEventListener("submit", function (e) {
      if (
        window.location.protocol === "file:" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "localhost"
      ) {
        e.preventDefault();
        if (searchInput.value.trim().length === 0) {
          searchInput.focus();
        } else {
          handleSearchInput();
        }
      }
    });
  }

  document.addEventListener("click", function (e) {
    if (searchWrap && !searchWrap.contains(e.target)) {
      closeSearchDropdown();
    }
  });

  // 3. Giriş Yap / Kayıt Ol Modal Kontrolü
  const modalBackdrop = document.getElementById("auth-modal-backdrop");
  const modalClose = document.getElementById("auth-modal-close");
  const authTabs = document.querySelectorAll("[data-auth-tab]");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const authFeedback = document.getElementById("auth-feedback");

  function switchAuthTab(mode) {
    authTabs.forEach(function (tab) {
      const isMatch = tab.getAttribute("data-auth-tab") === mode;
      tab.classList.toggle("is-active", isMatch);
      tab.setAttribute("aria-selected", isMatch ? "true" : "false");
    });
    if (loginForm && registerForm) {
      loginForm.hidden = mode === "register";
      registerForm.hidden = mode !== "register";
    }
    if (authFeedback) {
      authFeedback.classList.remove("is-visible");
      authFeedback.textContent = "";
    }
  }

  function openAuthModal(mode) {
    if (!modalBackdrop) return;
    switchAuthTab(mode || "login");
    modalBackdrop.classList.add("is-open");
    modalBackdrop.setAttribute("aria-hidden", "false");
  }

  function closeAuthModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove("is-open");
    modalBackdrop.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll("[data-auth-open]").forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      openAuthModal(trigger.getAttribute("data-auth-open"));
    });
  });

  authTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      switchAuthTab(tab.getAttribute("data-auth-tab"));
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeAuthModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", function (e) {
      if (e.target === modalBackdrop) closeAuthModal();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeSearchDropdown();
      closeAuthModal();
    }
  });

  [loginForm, registerForm].forEach(function (form) {
    if (!form) return;
    form.addEventListener("submit", function (e) {
      if (
        window.location.protocol === "file:" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "localhost"
      ) {
        e.preventDefault();
        if (authFeedback) {
          authFeedback.textContent =
            form.id === "login-form"
              ? "Giriş formu hazır. Python backend (/giris POST) bağlandığında oturum açılacaktır."
              : "Kayıt formu hazır. Python backend (/kayit POST) bağlandığında okur profiliniz oluşturulacaktır.";
          authFeedback.classList.add("is-visible");
        }
      }
    });
  });

  // 4. Okur Profili Formu ve Canlı Sayaç Kontrolü (profil.html)
  const profileReadCountEl = document.getElementById("profile-read-count");
  const profileToReadCountEl = document.getElementById("profile-to-read-count");

  if (profileReadCountEl && profileToReadCountEl) {
    const newlyReadCount = getSavedReadBooks().length;
    profileReadCountEl.textContent = String(8 + newlyReadCount);
    profileToReadCountEl.textContent = String(Math.max(0, 6 - newlyReadCount));
  }

  const profileForm = document.getElementById("profile-form");
  const profileFeedback = document.getElementById("profile-feedback");

  if (profileForm) {
    profileForm.addEventListener("submit", function (e) {
      if (
        window.location.protocol === "file:" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "localhost"
      ) {
        e.preventDefault();
        if (profileFeedback) {
          profileFeedback.textContent =
            "Profil bilgileriniz kaydedildi. Python backend (/profil POST) bağlandığında veritabanında güncellenecektir.";
          profileFeedback.classList.add("is-visible");
        }
      }
    });
  }
})();
