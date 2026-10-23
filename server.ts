import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// PIN Authentication Storage & Helpers
const PIN_FILE = path.join(__dirname, 'auth-pin.json');
const DEFAULT_PIN = '123456';

function getStoredPin(): string {
  try {
    if (fs.existsSync(PIN_FILE)) {
      const data = JSON.parse(fs.readFileSync(PIN_FILE, 'utf-8'));
      if (data && data.pin) {
        return String(data.pin).trim();
      }
    }
  } catch (err) {
    console.error('Error reading pin file:', err);
  }
  return DEFAULT_PIN;
}

function savePin(newPin: string): boolean {
  try {
    fs.writeFileSync(
      PIN_FILE,
      JSON.stringify({ pin: newPin.trim(), updatedAt: new Date().toISOString() }),
      'utf-8'
    );
    return true;
  } catch (err) {
    console.error('Error saving pin file:', err);
    return false;
  }
}

// Endpoint to verify access PIN
app.post('/api/auth/verify-pin', (req: Request, res: Response) => {
  const { pin } = req.body;
  if (!pin) {
    return res.status(400).json({ success: false, error: 'Silakan masukkan PIN akses.' });
  }

  const currentPin = getStoredPin();
  if (String(pin).trim() === currentPin) {
    return res.json({
      success: true,
      message: 'PIN benar. Akses diberikan.',
      token: `auth_${Date.now()}_valid`,
    });
  }

  return res.status(401).json({
    success: false,
    error: 'PIN salah! Silakan coba lagi atau tanyakan kepada pemilik tools.',
  });
});

// Endpoint to change PIN
app.post('/api/auth/change-pin', (req: Request, res: Response) => {
  const { currentPin, newPin } = req.body;

  if (!currentPin || !newPin) {
    return res.status(400).json({ error: 'PIN lama dan PIN baru wajib diisi.' });
  }

  const stored = getStoredPin();
  if (String(currentPin).trim() !== stored) {
    return res.status(401).json({ error: 'PIN lama yang Anda masukkan salah.' });
  }

  const cleanNewPin = String(newPin).trim();
  if (cleanNewPin.length < 4 || cleanNewPin.length > 8) {
    return res.status(400).json({ error: 'PIN baru harus terdiri dari 4 sampai 8 digit angka.' });
  }

  if (savePin(cleanNewPin)) {
    return res.json({ success: true, message: 'PIN akses berhasil diperbarui ke seluruh perangkat.' });
  }

  return res.status(500).json({ error: 'Gagal menyimpan PIN baru.' });
});

// Initialize Gemini API client as per skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to extract keywords and slug from Shopee URLs
function parseShopeeUrl(urlStr: string) {
  try {
    const cleanUrl = urlStr.trim();
    let slug = '';
    let shopId = '';
    let itemId = '';

    // Pattern 1: .../product-slug-i.12345.67890
    const pattern1 = /shopee\.co\.id\/(.+)-i\.(\d+)\.(\d+)/i;
    const match1 = cleanUrl.match(pattern1);
    if (match1) {
      slug = decodeURIComponent(match1[1]).replace(/[-_]/g, ' ');
      shopId = match1[2];
      itemId = match1[3];
    }

    // Pattern 2: .../product/12345/67890
    const pattern2 = /shopee\.co\.id\/product\/(\d+)\/(\d+)/i;
    const match2 = cleanUrl.match(pattern2);
    if (match2) {
      shopId = match2[1];
      itemId = match2[2];
    }

    // Pattern 3: any path slug
    if (!slug) {
      try {
        const parsed = new URL(cleanUrl);
        const segments = parsed.pathname.split('/').filter(Boolean);
        if (segments.length > 0) {
          slug = decodeURIComponent(segments[segments.length - 1]).replace(/[-_]/g, ' ');
        }
      } catch {
        // url parsing fallback
      }
    }

    return { slug, shopId, itemId, cleanUrl };
  } catch (err) {
    return { slug: '', shopId: '', itemId: '', cleanUrl: urlStr };
  }
}

// Scrape basic meta tags if reachable
async function fetchMetaTags(url: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const html = await res.text();

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/i);
    const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/i);
    const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/i);

    return {
      pageTitle: titleMatch ? titleMatch[1].replace(/ \| Shopee Indonesia.*/i, '').trim() : null,
      ogTitle: ogTitle ? ogTitle[1].replace(/ \| Shopee Indonesia.*/i, '').trim() : null,
      ogDesc: ogDesc ? ogDesc[1].trim() : null,
      ogImage: ogImage ? ogImage[1] : null,
    };
  } catch (err) {
    return null;
  }
}

// API endpoint to audit Shopee product and generate 1000x sales solutions
app.post('/api/audit-product', async (req: Request, res: Response) => {
  try {
    const { url, rawTitle, rawCategory, currentPrice, currentSales } = req.body;

    if (!url && !rawTitle) {
      return res.status(400).json({ error: 'Harap masukkan link produk Shopee atau judul produk.' });
    }

    const parsed = url ? parseShopeeUrl(url) : { slug: rawTitle, cleanUrl: '' };
    let meta = null;
    if (url && url.startsWith('http')) {
      meta = await fetchMetaTags(url);
    }

    const detectedTitle = meta?.ogTitle || meta?.pageTitle || rawTitle || parsed.slug || 'Produk Shopee';
    const detectedDesc = meta?.ogDesc || '';
    const detectedImage = meta?.ogImage || '';

    const systemPrompt = `Anda adalah Pakar Algoritma Shopee Indonesia, Konsultan E-Commerce Top Seller No. 1, dan Master Copywriting Penjualan.
Tugas Anda adalah melakukan audit mendalam terhadap produk Shopee dari link/informasi yang diberikan oleh penjual (seller), membongkar SEMUA kesalahan fatal yang membuat produk sepi / tidak mencapai ribuan orderan, dan memberikan SOLUSI LENGKAP SIAP PAKAI agar toko bisa otomatis menghasilkan ribuan orderan (1.000+ pesanan).

Pahami algoritma Shopee Indonesia terkini:
1. Algoritma Pencarian & SEO Judul (Formula: [Merek] + [Kata Kunci Utama Berpencarian Tinggi] + [Fungsi/Manfaat Spesifik] + [Bahan/Model/Fitur] + [Varian/Ukuran]). Tidak boleh keyword spamming, harus memenuhi CTR pencarian.
2. Foto Sampul (Slide 1 Hook): Penentu 80% CTR. Harus ada badge garansi, free ongkir, kontras tinggi, teks penawaran yang terbaca di HP, background bersih.
3. Slide 2-9 Visual Storytelling: Menghilangkan keraguan pembeli (Social proof, sertifikasi BPOM/SNI jika ada, panduan ukuran/size chart, unboxing & packing aman).
4. Copywriting Deskripsi AIDA (Attention, Interest, Desire, Action) + Risk Reversal (Garansi 100% uang kembali jika rusak/palsu) + 18 Hashtag SEO Shopee.
5. Psikologi Harga & Voucher: Harga coret (diskon jangkar), Kombo Hemat, Voucher Ikuti Toko, Gratis Ongkir Xtra, COD Aktif.
6. Automasi Penjualan: Chat auto-reply cepat (menjaga performa chat >95%), broadcast chat keranjang ditinggalkan, trik dorongan Shopee Video (voucher subsidi 40%).

Berikan output JSON yang sangat mendalam, spesifik untuk produk ini, aplikatif dan langsung bisa di-copy paste oleh seller.`;

    const userPrompt = `Lakukan audit komprehensif untuk produk Shopee berikut:
- Link Produk: ${url || 'Tidak disertakan link langsung'}
- Judul / Slug Terdeteksi: ${detectedTitle}
- Deskripsi Awal: ${detectedDesc || 'Belum terisi optimal / default'}
- Kategori Yang Diperkirakan: ${rawCategory || 'Otomatis deteksi'}
- Harga Sekarang: ${currentPrice || 'Perkirakan harga pasar wajar Indonesia'}
- Penjualan Sekarang: ${currentSales || 'Masih sepi / puluhan orderan'}

Hasilkan analisis kesalahan fatal dan paket perbaikan lengkap menuju ribuan orderan secara otomatis.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            category: { type: Type.STRING },
            thumbnailUrl: { type: Type.STRING },
            auditScore: { type: Type.INTEGER, description: 'Skor kesehatan produk 0 - 100' },
            healthGrade: { type: Type.STRING, description: 'S, A, B, C, atau F' },
            statusLabel: { type: Type.STRING, description: 'Label status, misal: Perlu Perombakan Kritis' },
            executiveSummary: { type: Type.STRING, description: 'Ringkasan 2-3 kalimat mengapa produk ini belum tembus ribuan orderan dan kunci perubahannya' },
            
            // Critical Flaws
            criticalFlaws: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pillar: { type: Type.STRING, description: 'Judul SEO, Thumbnail 1:1, Copywriting Deskripsi, Harga & Voucher, atau Algoritma Trafik' },
                  severity: { type: Type.STRING, description: 'CRITICAL, WARNING, atau OPPORTUNITY' },
                  issue: { type: Type.STRING, description: 'Nama kesalahan spesifik' },
                  explanation: { type: Type.STRING, description: 'Penjelasan mengapa ini salah di algoritma Shopee' },
                  salesImpact: { type: Type.STRING, description: 'Dampak fatal terhadap penjualan/impresi' },
                  quickFix: { type: Type.STRING, description: 'Tindakan cepat perbaikan' },
                },
                required: ['pillar', 'severity', 'issue', 'explanation', 'salesImpact', 'quickFix'],
              },
            },

            // SEO Titles Formula
            seoTitles: {
              type: Type.OBJECT,
              properties: {
                recommendedFormula: { type: Type.STRING, description: 'Formula struktur judul terbaik' },
                option1_AlgorithmChamp: { type: Type.STRING, description: 'Judul 1: Standar algoritma Shopee organik pencarian tinggi' },
                option2_ViralHook: { type: Type.STRING, description: 'Judul 2: Hook emosional dan garansi' },
                option3_AdsReady: { type: Type.STRING, description: 'Judul 3: Optimal untuk Iklan Shopee Ads CTR tinggi' },
                whyTheseWork: { type: Type.STRING, description: 'Alasan teknis mengapa judul baru ini akan melonjakkan pencarian' },
              },
              required: ['recommendedFormula', 'option1_AlgorithmChamp', 'option2_ViralHook', 'option3_AdsReady', 'whyTheseWork'],
            },

            // High Converting Copywriting
            optimizedDescription: {
              type: Type.OBJECT,
              properties: {
                attentionHook: { type: Type.STRING, description: 'Kalimat pembuka pemikat 3 detik pertama' },
                problemAgitation: { type: Type.STRING, description: 'Masalah umum pembeli yang diselesaikan produk ini' },
                bulletBenefits: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Daftar keunggulan & spesifikasi unik produk',
                },
                riskReversalGuarantee: { type: Type.STRING, description: 'Garansi anti-rugi / uang kembali' },
                urgentCallToAction: { type: Type.STRING, description: 'Instruksi ajakan checkout segera' },
                shopeeTags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '15-18 hashtag relevan Shopee',
                },
                fullFormattedText: { type: Type.STRING, description: 'Teks deskripsi lengkap siap copy-paste ke Seller Centre Shopee' },
              },
              required: ['attentionHook', 'problemAgitation', 'bulletBenefits', 'riskReversalGuarantee', 'urgentCallToAction', 'shopeeTags', 'fullFormattedText'],
            },

            // Slide 1 to 9 visual blueprint
            visualBlueprint: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slideNumber: { type: Type.INTEGER },
                  role: { type: Type.STRING, description: 'Cover Utama / Social Proof / Detail Bahan / Size Chart / dll' },
                  visualInstructions: { type: Type.STRING, description: 'Instruksi visual foto & angle yang tepat' },
                  overlayTextHook: { type: Type.STRING, description: 'Teks stiker/badge yang wajib ditempel di foto' },
                  conversionPsychology: { type: Type.STRING, description: 'Psikologi di balik slide ini' },
                },
                required: ['slideNumber', 'role', 'visualInstructions', 'overlayTextHook', 'conversionPsychology'],
              },
            },

            // Pricing & Voucher Strategy
            pricingStrategy: {
              type: Type.OBJECT,
              properties: {
                suggestedCorePrice: { type: Type.STRING, description: 'Harga coret awal sebelum diskon' },
                suggestedPromoPrice: { type: Type.STRING, description: 'Harga final promo menarik' },
                discountPercentage: { type: Type.STRING, description: 'Persentase diskon coret psikologis' },
                bundleStrategy: { type: Type.STRING, description: 'Strategi Kombo Hemat / Paket Diskon (misal Beli 2 Diskon Rp...)' },
                voucherRecommendation: { type: Type.STRING, description: 'Setting voucher toko terbaik' },
              },
              required: ['suggestedCorePrice', 'suggestedPromoPrice', 'discountPercentage', 'bundleStrategy', 'voucherRecommendation'],
            },

            // Automation & Traffic Multipliers
            automationSystem: {
              type: Type.OBJECT,
              properties: {
                autoReplyGreeting: { type: Type.STRING, description: 'Pesan selamat datang otomatis Shopee Assistant' },
                autoReplyStockQuery: { type: Type.STRING, description: 'Jawaban instan otomatis pertanyaan ready/stok' },
                abandonedCartBroadcast: { type: Type.STRING, description: 'Pesan broadcast Shopee untuk pembeli yang masukkan ke keranjang tapi belum bayar' },
                packageInsertCardText: { type: Type.STRING, description: 'Teks kartu ucapan sisipan paket agar pembeli otomatis beri Bintang 5 + Video' },
                shopeeVideoHack: { type: Type.STRING, description: 'Trik mendapatkan subsidi voucher 30%-40% dari Shopee Video' },
                shopeeAdsStrategy: { type: Type.STRING, description: 'Strategi iklan kata kunci spesifik berbiaya murah' },
              },
              required: ['autoReplyGreeting', 'autoReplyStockQuery', 'abandonedCartBroadcast', 'packageInsertCardText', 'shopeeVideoHack', 'shopeeAdsStrategy'],
            },

            // Forecast Calculator to Reach 1000+ Orders
            ordersForecast: {
              type: Type.OBJECT,
              properties: {
                dailyImpressionsNeeded: { type: Type.INTEGER, description: 'Target impresi harian' },
                targetCTR: { type: Type.STRING, description: 'Target rasio klik e.g. 8.5%' },
                targetConversionRate: { type: Type.STRING, description: 'Target konversi e.g. 4.2%' },
                projectedDailyOrders: { type: Type.INTEGER, description: 'Estimasi order harian e.g. 35' },
                projectedMonthlyOrders: { type: Type.INTEGER, description: 'Estimasi order bulanan e.g. 1050' },
                roadmapTo1000Orders: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '4 fase langkah percepatan: Hari 1-3, Hari 4-7, Hari 8-14, Hari 15-30',
                },
              },
              required: ['dailyImpressionsNeeded', 'targetCTR', 'targetConversionRate', 'projectedDailyOrders', 'projectedMonthlyOrders', 'roadmapTo1000Orders'],
            },
          },
          required: [
            'productName',
            'category',
            'auditScore',
            'healthGrade',
            'statusLabel',
            'executiveSummary',
            'criticalFlaws',
            'seoTitles',
            'optimizedDescription',
            'visualBlueprint',
            'pricingStrategy',
            'automationSystem',
            'ordersForecast',
          ],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    if (detectedImage && !parsedJson.thumbnailUrl) {
      parsedJson.thumbnailUrl = detectedImage;
    }
    parsedJson.originalLink = url || '';

    return res.json(parsedJson);
  } catch (error: any) {
    console.error('Audit Error:', error);
    return res.status(500).json({
      error: 'Gagal melakukan audit otomatis.',
      details: error?.message || 'Terjadi gangguan koneksi ke Server Analisis.',
    });
  }
});

// Endpoint to generate 1-click complete 1000 orders/day recipe
app.post('/api/generate-1000-recipe', async (req: Request, res: Response) => {
  try {
    const { productName, category, currentPrice, url } = req.body;

    let targetTitle = productName;
    if (!targetTitle && url) {
      const parsed = parseShopeeUrl(url);
      targetTitle = parsed.slug || 'Produk Unggulan Shopee';
    }
    if (!targetTitle) {
      targetTitle = 'Produk Unggulan Shopee';
    }

    const systemPrompt = `Anda adalah Master Konsultan Top Seller Shopee Indonesia No. 1.
Tugas Anda adalah meracik PAKET RACIKAN 1.000 ORDERAN PER HARI LENGKAP SEKALI KLIK untuk seller Shopee Indonesia.

Racikan ini harus 100% aplikatif, siap di-copy paste langsung ke Seller Centre Shopee, dan mencakup:
1. Judul Juara Algoritma Pencarian Organik
2. Trik Psikologis Varian Pancingan (Loss Leader) dengan harga termurah Rp 9.900 untuk memicu label "Mulai Rp 9.900" di katalog pencarian Shopee sehingga CTR melonjak drastis.
3. Formulasi Diskon Coret 50-60% & Kombo Hemat Beli 2 Diskon.
4. Voucher Toko Ikuti Toko & Cashback Xtra.
5. Desain Stiker Hook Foto Sampul Slide 1.
6. Deskripsi Hipnotik Penjualan Lengkap dengan 18 Hashtag Shopee.
7. Naskah Host Shopee Live 10 Menit Pertama untuk memicu 100 checkout kilat etalase nomor 1.
8. Template Chat Otomatis 100% Balasan Cepat & Broadcast Keranjang Belanja.
9. 10 Rekomendasi Kata Kunci Iklan Pencarian Spesifik (Exact Match) dengan bid murah Rp 250 - Rp 350.
10. SOP Harian Eksekusi 1.000 Orderan.

JANGAN menggunakan kata atau singkatan AI. Gunakan bahasa e-commerce profesional Indonesia.`;

    const userPrompt = `Buatkan Paket Racikan 1.000 Orderan Per Hari Lengkap untuk:
- Produk: ${targetTitle}
- Kategori: ${category || 'Kategori Terkait di Shopee Indonesia'}
- Perkiraan Harga Jual: ${currentPrice || 'Standar Pasar Indonesia'}
- Link Referensi: ${url || 'Tidak disertakan link'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            category: { type: Type.STRING },
            recipeTitle: { type: Type.STRING, description: 'Judul juara algoritma pencarian Shopee' },
            lossLeaderVariant: {
              type: Type.OBJECT,
              properties: {
                variantName: { type: Type.STRING, description: 'Nama varian pancingan mini' },
                baitPrice: { type: Type.STRING, description: 'Harga pancingan e.g. Rp 9.900' },
                corePrice: { type: Type.STRING, description: 'Harga produk utama' },
                howItTriggersCTR: { type: Type.STRING, description: 'Mengapa ini melonjakkan klik di pencarian' },
              },
              required: ['variantName', 'baitPrice', 'corePrice', 'howItTriggersCTR'],
            },
            pricingAndDiscounts: {
              type: Type.OBJECT,
              properties: {
                originalStrikePrice: { type: Type.STRING, description: 'Harga coret sebelum diskon' },
                promoSellingPrice: { type: Type.STRING, description: 'Harga final promo' },
                discountPercent: { type: Type.STRING, description: 'Persentase diskon coret' },
                comboDeal: { type: Type.STRING, description: 'Paket diskon kombo hemat' },
                followPrizeVoucher: { type: Type.STRING, description: 'Voucher ikuti toko' },
                extraStoreVoucher: { type: Type.STRING, description: 'Voucher toko tambahan' },
              },
              required: ['originalStrikePrice', 'promoSellingPrice', 'discountPercent', 'comboDeal', 'followPrizeVoucher', 'extraStoreVoucher'],
            },
            coverPhotoHook: {
              type: Type.OBJECT,
              properties: {
                stickerHeadline: { type: Type.STRING, description: 'Teks stiker hook wajib di foto' },
                badges: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Badge wajib (Star+, Gratis Ongkir Xtra, COD)',
                },
                visualLayoutTip: { type: Type.STRING, description: 'Tips visual foto 1:1' },
              },
              required: ['stickerHeadline', 'badges', 'visualLayoutTip'],
            },
            copywritingDescription: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING, description: 'Hook pembuka 3 detik' },
                bodyText: { type: Type.STRING, description: 'Teks deskripsi lengkap siap copy' },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Hashtag Shopee pencarian tinggi',
                },
              },
              required: ['hook', 'bodyText', 'hashtags'],
            },
            liveStreamOpeningScript: { type: Type.STRING, description: 'Naskah 10 menit pertama host Shopee Live' },
            chatAutomation: {
              type: Type.OBJECT,
              properties: {
                greeting: { type: Type.STRING, description: 'Salam pembuka chat assistant' },
                abandonedCart: { type: Type.STRING, description: 'Pesan siaran keranjang ditinggalkan' },
                fiveStarThankYouCard: { type: Type.STRING, description: 'Kartu ucapan sisipan paket bintang 5' },
              },
              required: ['greeting', 'abandonedCart', 'fiveStarThankYouCard'],
            },
            adsTargetKeywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  recommendedBid: { type: Type.STRING },
                  matchType: { type: Type.STRING },
                },
                required: ['keyword', 'recommendedBid', 'matchType'],
              },
            },
            dailySopActionSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Langkah SOP eksekusi 1000 orderan',
            },
            fullMasterExportText: { type: Type.STRING, description: 'Teks gabungan satu paket lengkap siap copy paste' },
          },
          required: [
            'productName',
            'category',
            'recipeTitle',
            'lossLeaderVariant',
            'pricingAndDiscounts',
            'coverPhotoHook',
            'copywritingDescription',
            'liveStreamOpeningScript',
            'chatAutomation',
            'adsTargetKeywords',
            'dailySopActionSteps',
            'fullMasterExportText',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Recipe Error:', error);
    return res.status(500).json({
      error: 'Gagal membuat racikan 1.000 orderan.',
      details: error?.message || 'Terjadi gangguan koneksi.',
    });
  }
});

// Endpoint for custom Shopee Video script generation
app.post('/api/generate-video-script', async (req: Request, res: Response) => {
  try {
    const { productName, targetAudience, usp } = req.body;
    const prompt = `Buatkan 2 naskah script video Shopee Video pendek berdurasi 15-30 detik berformat viral TikTok/Shopee Video untuk produk: "${productName}".
Target audiens: ${targetAudience || 'Pembeli umum di Shopee Indonesia'}.
Keunggulan utama: ${usp || 'Kualitas terbaik, harga bersahabat, gratis ongkir'}.

PENTING: Shopee Video saat ini memberikan voucher subsidi diskon 30%-40% untuk produk yang ditautkan di keranjang oranye Shopee Video. Naskah harus memicu penonton mengklik keranjang oranye di Shopee Video sekarang juga.
Sertakan: Hook 3 detik pertama, visual action per detik, dialog suara/teks, dan Call To Action "Klaim Voucher Diskon di Keranjang Oranye".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ script: response.text });
  } catch (error: any) {
    console.error('Video Script Error:', error);
    return res.status(500).json({ error: 'Gagal membuat naskah video.' });
  }
});

// Configure Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`ShopeeBooster server running on port ${port}`);
  });
}

startServer();
