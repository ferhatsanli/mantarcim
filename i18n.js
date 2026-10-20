// Arayüz metinleri (TR / EN). Mantar verisindeki metinler data.js içinde: tr -> d,h,s,w,t ; en -> de,he,se,we,n
const I18N = {
  tr: {
    title: "Mantar Kataloğu",
    search: "Türkçe, Latince veya cins adıyla ara…", search_aria: "Mantar ara", theme: "Açık / koyu tema", close: "Kapat",
    all: "Tümü",
    cat: { yenilebilir: "Yenilebilir", sartli: "Şartlı Yenilebilir", zehirli: "Zehirli", olumcul: "Ölümcül", halusinojen: "Halüsinojen" },
    count: (n) => `${n} mantar türü listeniyor`, more: (n) => `Daha fazla göster (${n} tür daha)`, empty: "Sonuç bulunamadı.",
    genus: "Cins", genus_sub: (g) => `${g} cinsi`, habitat: "Yetiştiği ortam", hab_note: "Cins düzeyinde genel bilgi ve Wikipedia metninden otomatik derlenmiştir; yerel ayrıntılar farklı olabilir.", season: "Mevsim", tags: "Etiketler",
    tag: { halusinojen: "Psikoaktif", tibbi: "Tıbbi kullanım" }, warn: "Dikkat:",
    wiki_sum: "Wikipedia özeti (İngilizce):", src: "Türkçe bilgi kaynağı: E. Karaduman, \"Doğal Mantarlar\" (Samsun Tarım ve Orman İl Müdürlüğü); Türkçe Vikipedi.",
    wiki_en: "Wikipedia'da aç ↗", wiki_tr: "Türkçe Wikipedia ↗",
    intro: "<strong>⚠ Uyarı:</strong> Bu katalog yalnızca bilgilendirme amaçlıdır; sınıflandırmalar Wikipedia kategorilerinden derlenmiştir ve eksik veya hatalı olabilir. Fotoğraftan mantar tanıyarak yemek hayati risk taşır. Uzman (mikolog) onayı olmadan hiçbir mantarı tüketmeyin. Zehirlenme şüphesinde hemen <strong>112</strong> veya Ulusal Zehir Danışma Merkezi <strong>114</strong>'ü arayın.",
    info_title: "Doğru bilinen yanlışlar ve zehirlenme belirtileri",
    info_body: `<p>Türkiye'de yaklaşık 2200 makromantar türü bilinir; bunların yaklaşık 300'ü yenilebilir niteliktedir. Zehirli ve yenilebilir mantarlar yan yana yetişebilir ve çoğu zaman ayırt etmek çok zordur. Aşağıdakilerin <strong>hepsi yanlış inanışlardır</strong>:</p>
      <ul><li>Zehirli ve yenen mantarlar ayrı topraklarda yetişir.</li>
      <li>Koparılınca iç kısmı mavileşen mantar zehirlidir, rengi değişmeyen ve hoş kokulu olan zararsızdır.</li>
      <li>Gümüş kaşık veya para ile pişirilince kararıyorsa zehirlidir.</li>
      <li>Salyangozların ve böceklerin yediği mantar zehirsizdir.</li>
      <li>Çayırlarda veya ağaçlar üzerinde yetişen mantarlar zehirsizdir.</li>
      <li>Tuzlu veya sirkeli suda kaynatmak zehirliliği ortadan kaldırır; kurutmak veya pişirmek zehri yok eder.</li>
      <li>Yanında demir varsa zehirlidir; zehiri mantara yılanlar verir.</li></ul>
      <p><strong>Belirtiler.</strong> Yedikten sonra 2 saate kadar: sersemlik, uykuya meyil, tansiyon düşüklüğü, bulanık görme, yüz ve boyunda kızarma, nabız artışı, ağızda metal tadı, bulantı, kusma, terleme. 6 saat ve sonrasında: bulantı, kusma, ishal, ateş, karın ağrısı, karaciğer ve böbrek bozuklukları. Belirtiler gecikmeli başladığı için iyi hissetmek güvence değildir; şüphede hemen acile gidin.</p>
      <p class="src">Kaynak: Ercan Karaduman, "Doğal Mantarlar", Samsun Tarım ve Orman İl Müdürlüğü.</p>`,
    footer: "Fotoğraflar Wikimedia Commons'tan, bilgiler Wikipedia ve Wikidata'dan alınmıştır; telif hakları ilgili fotoğrafçılara ve yazarlara aittir (CC lisansları).",
  },
  en: {
    title: "Mushroom Catalog",
    search: "Search by common, Latin or genus name…", search_aria: "Search mushrooms", theme: "Light / dark theme", close: "Close",
    all: "All",
    cat: { yenilebilir: "Edible", sartli: "Conditionally Edible", zehirli: "Poisonous", olumcul: "Deadly", halusinojen: "Hallucinogenic" },
    count: (n) => `Showing ${n} mushroom species`, more: (n) => `Show more (${n} more)`, empty: "No results found.",
    genus: "Genus", genus_sub: (g) => `Genus ${g}`, habitat: "Habitat", hab_note: "Compiled automatically from genus-level knowledge and Wikipedia text; local details may differ.", season: "Season", tags: "Tags",
    tag: { halusinojen: "Psychoactive", tibbi: "Medicinal use" }, warn: "Warning:",
    wiki_sum: "Wikipedia summary:", src: "Turkish field information: E. Karaduman, “Doğal Mantarlar” (Samsun Provincial Directorate of Agriculture and Forestry); Turkish Wikipedia.",
    wiki_en: "Open on Wikipedia ↗", wiki_tr: "Turkish Wikipedia ↗",
    intro: "<strong>⚠ Warning:</strong> This catalog is for information only; the classifications were compiled from Wikipedia categories and may be incomplete or wrong. Eating a mushroom identified from a photo can be fatal. Never eat any mushroom without confirmation from an expert (mycologist). If you suspect poisoning, call your local emergency number immediately (<strong>112</strong> in Türkiye, National Poison Information Center <strong>114</strong>).",
    info_title: "Common myths and symptoms of mushroom poisoning",
    info_body: `<p>About 2,200 macrofungi species are known in Türkiye, roughly 300 of them edible. Poisonous and edible mushrooms can grow side by side and are often very hard to tell apart. <strong>All of the following are myths</strong>:</p>
      <ul><li>Poisonous and edible mushrooms grow in different soils.</li>
      <li>A mushroom that turns blue when broken is poisonous; one that does not change colour and smells nice is harmless.</li>
      <li>If a silver spoon or coin turns black when cooked with it, it is poisonous.</li>
      <li>Mushrooms eaten by snails and insects are not poisonous.</li>
      <li>Mushrooms growing in meadows or on trees are not poisonous.</li>
      <li>Boiling in salted or vinegared water, drying or cooking removes the poison.</li>
      <li>If there is iron nearby it is poisonous; snakes give mushrooms their poison.</li></ul>
      <p><strong>Symptoms.</strong> Within 2 hours of eating: dizziness, drowsiness, low blood pressure, blurred vision, flushing of the face and neck, fast pulse, a metallic taste, nausea, vomiting, sweating. After 6 hours or more: nausea, vomiting, diarrhoea, fever, abdominal pain, liver and kidney disorders. Because symptoms can start late, feeling well is no guarantee; go to the emergency room at the slightest suspicion.</p>
      <p class="src">Source: Ercan Karaduman, “Doğal Mantarlar”, Samsun Provincial Directorate of Agriculture and Forestry.</p>`,
    footer: "Photos are from Wikimedia Commons and information from Wikipedia and Wikidata; copyrights belong to the respective photographers and authors (CC licences).",
  },
};
