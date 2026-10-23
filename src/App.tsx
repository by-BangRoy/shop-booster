import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { UrlInputCard } from './components/UrlInputCard';
import { AuditScoreCard } from './components/AuditScoreCard';
import { CriticalFlawsSection } from './components/CriticalFlawsSection';
import { SeoTitlesSection } from './components/SeoTitlesSection';
import { CopywritingSection } from './components/CopywritingSection';
import { VisualBlueprintSection } from './components/VisualBlueprintSection';
import { PricingVoucherSection } from './components/PricingVoucherSection';
import { AutomationSection } from './components/AutomationSection';
import { OrdersForecastCalculator } from './components/OrdersForecastCalculator';
import { ShopeeMockupPreview } from './components/ShopeeMockupPreview';
import { Instant1000RecipeModal } from './components/Instant1000RecipeModal';
import { VideoScriptModal } from './components/VideoScriptModal';
import { MegaOrdersPlaybookSection } from './components/MegaOrdersPlaybookSection';
import { PinLoginScreen } from './components/PinLoginScreen';
import { ChangePinModal } from './components/ChangePinModal';
import { AuditResult, Master1000Recipe } from './types/audit';
import { Sparkles, AlertCircle, RefreshCw, CheckCircle, Download, Share2, Layers, ArrowUp, Flame } from 'lucide-react';

export default function App() {
  // PIN Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('shopeebooster_auth_session') !== null;
  });
  const [isChangePinModalOpen, setIsChangePinModalOpen] = useState(false);

  const [auditData, setAuditData] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showStandalonePlaybook, setShowStandalonePlaybook] = useState(true);

  // 1-Click 1000 Orders Master Recipe State
  const [instantRecipe, setInstantRecipe] = useState<Master1000Recipe | null>(null);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleLock = () => {
    localStorage.removeItem('shopeebooster_auth_session');
    localStorage.removeItem('shopeebooster_auth_time');
    setIsAuthenticated(false);
  };

  const runAudit = async (payload: {
    url: string;
    rawTitle?: string;
    rawCategory?: string;
    currentPrice?: string;
    currentSales?: string;
  }) => {
    setIsLoading(true);
    setErrorMsg('');
    setLoadingStep('Memeriksa link & mengambil data listing produk Shopee...');

    // Progress animation steps
    const timer1 = setTimeout(() => {
      setLoadingStep('Membedah kelemahan algoritma pencarian Shopee & CTR foto...');
    }, 1500);

    const timer2 = setTimeout(() => {
      setLoadingStep('Merumuskan 3 judul SEO, copywriting AIDA, & sistem auto-reply...');
    }, 3200);

    const timer3 = setTimeout(() => {
      setLoadingStep('Menghitung kalkulasi funnel matematis tembus 1.000+ orderan...');
    }, 5000);

    try {
      const response = await fetch('/api/audit-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.details || 'Gagal melakukan audit.');
      }

      const data: AuditResult = await response.json();
      setAuditData(data);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message || 'Terjadi gangguan saat memproses audit produk. Pastikan server terhubung.'
      );
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const runGenerate1000Recipe = async (payload: {
    url: string;
    rawTitle?: string;
    rawCategory?: string;
    currentPrice?: string;
  }) => {
    setIsRecipeLoading(true);
    setIsRecipeModalOpen(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/generate-1000-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: payload.url,
          productName: payload.rawTitle,
          category: payload.rawCategory,
          currentPrice: payload.currentPrice,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.details || 'Gagal membuat racikan 1.000 orderan.');
      }

      const data: Master1000Recipe = await response.json();
      setInstantRecipe(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat meracik formula 1.000 orderan.');
    } finally {
      setIsRecipeLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExportSummary = () => {
    if (!auditData) return;
    const textContent = `=== LAPORAN AUDIT & SOLUSI SHOPEE 1000X ORDER ===
Produk: ${auditData.productName}
Kategori: ${auditData.category}
Skor Kesehatan: ${auditData.auditScore}/100 (Grade ${auditData.healthGrade})
Status: ${auditData.statusLabel}

RINGKASAN DIAGNOSA:
${auditData.executiveSummary}

---
FORMULA JUDUL BARU JUARA ORGANIK:
${auditData.seoTitles.option1_AlgorithmChamp}

FORMULA JUDUL VIRAL HOOK:
${auditData.seoTitles.option2_ViralHook}

FORMULA JUDUL SHOPEE ADS:
${auditData.seoTitles.option3_AdsReady}

---
DESKRIPSI LENGKAP:
${auditData.optimizedDescription.fullFormattedText}

---
TAGS SHOPEE:
${auditData.optimizedDescription.shopeeTags.join(' ')}

---
SETTING HARGA & PROMOSI:
Harga Coret: ${auditData.pricingStrategy.suggestedCorePrice}
Harga Promo: ${auditData.pricingStrategy.suggestedPromoPrice} (Diskon ${auditData.pricingStrategy.discountPercentage})
Paket Kombo: ${auditData.pricingStrategy.bundleStrategy}
Voucher Toko: ${auditData.pricingStrategy.voucherRecommendation}

---
SISTEM AUTOMASI CHAT 24/7:
Greeting: ${auditData.automationSystem.autoReplyGreeting}
Stok Ready: ${auditData.automationSystem.autoReplyStockQuery}
Broadcast Keranjang: ${auditData.automationSystem.abandonedCartBroadcast}
Kartu Review Bintang 5: ${auditData.automationSystem.packageInsertCardText}

Generated by ShopeeBooster Pro
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ShopeeBooster-ActionPlan-${auditData.productName.slice(0, 20)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return <PinLoginScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      <Header
        onLock={handleLock}
        onChangePin={() => setIsChangePinModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* Input Card */}
        <UrlInputCard
          onAudit={runAudit}
          onGenerateRecipe={runGenerate1000Recipe}
          isLoading={isLoading}
          isRecipeLoading={isRecipeLoading}
        />

        {/* Master Recipe 1000 - 5000+ Orders Banner */}
        {!auditData && !isLoading && (
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-red-400/40">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-inner">
                  <Flame className="w-6 h-6 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-white/25 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                      Resep Rahasia Skala Masif
                    </span>
                    <span className="text-amber-200 text-xs font-bold">1.000 - 5.000+ Order/Hari</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                    Kunci Penjualan Otomatis 1.000 - 5.000+ Orderan Per Hari
                  </h3>
                  <p className="text-xs sm:text-sm text-orange-100">
                    Formula varian pancingan termurah, siaran live nonstop, pasukan kreator affiliate, dan SOP gudang 5.000 paket.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStandalonePlaybook(!showStandalonePlaybook)}
                className="px-4 py-2.5 bg-white text-slate-900 hover:bg-orange-50 font-extrabold text-xs sm:text-sm rounded-xl shadow transition-all cursor-pointer flex-shrink-0 self-start sm:self-auto"
              >
                {showStandalonePlaybook ? 'Tutup Resep' : 'Buka Resep 5000x'}
              </button>
            </div>

            {showStandalonePlaybook && (
              <MegaOrdersPlaybookSection productName="Produk Unggulan Anda" />
            )}
          </div>
        )}

        {/* Loading Progress State */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-xl border border-orange-200 p-8 sm:p-12 text-center animate-in fade-in duration-300">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800">
              ShopeeBooster Sedang Membedah Produk Anda
            </h3>
            <p className="text-sm font-semibold text-orange-600 mt-2 max-w-md mx-auto">
              {loadingStep}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Algoritma Search 2026
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Formula Copywriting Penjualan
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Auto-Reply & Video Hack
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {errorMsg && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 text-rose-800 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-base text-rose-900">Gagal Melakukan Audit</h4>
              <p className="text-xs sm:text-sm mt-1">{errorMsg}</p>
              <p className="text-xs text-rose-700 mt-2">
                Tips: Anda juga dapat memilih salah satu contoh produk siap pakai di atas atau memasukkan judul produk secara langsung.
              </p>
            </div>
          </div>
        )}

        {/* Audit Results View */}
        {auditData && !isLoading && (
          <div ref={resultsRef} className="space-y-8 animate-in fade-in duration-500">
            {/* Quick Navigation Sticky Bar */}
            <div className="sticky top-2 z-30 bg-slate-900/90 backdrop-blur-md text-white rounded-2xl p-2 px-3 shadow-xl border border-slate-700 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1 text-xs font-bold">
                <button
                  onClick={() => scrollToSection('section-flaws')}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-rose-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                >
                  Kesalahan ({auditData.criticalFlaws.length})
                </button>
                <button
                  onClick={() => scrollToSection('section-seo')}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-orange-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                >
                  Judul SEO
                </button>
                <button
                  onClick={() => scrollToSection('section-copywriting')}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-blue-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                >
                  Deskripsi Lengkap
                </button>
                <button
                  onClick={() => scrollToSection('section-visuals')}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-violet-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                >
                  Foto 9-Slide
                </button>
                <button
                  onClick={() => scrollToSection('section-pricing')}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-emerald-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                >
                  Harga & Voucher
                </button>
                <button
                  onClick={() => scrollToSection('section-automation')}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-amber-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                >
                  Automasi Chat
                </button>
                <button
                  onClick={() => scrollToSection('section-forecast')}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-teal-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                >
                  Kalkulator 1000x
                </button>
                <button
                  onClick={() => scrollToSection('section-mockup')}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-amber-200 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                >
                  Simulasi Shopee
                </button>
                <button
                  onClick={() => scrollToSection('section-mega-playbook')}
                  className="px-2.5 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-extrabold transition-colors cursor-pointer flex-shrink-0 flex items-center gap-1"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  Resep 1000-5000x
                </button>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() =>
                    runGenerate1000Recipe({
                      url: auditData.originalLink || '',
                      rawTitle: auditData.productName,
                      rawCategory: auditData.category,
                      currentPrice: auditData.pricingStrategy.suggestedPromoPrice,
                    })
                  }
                  className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
                  <span className="hidden sm:inline">Paket Racikan 1000x</span>
                </button>
                <button
                  onClick={handleExportSummary}
                  title="Unduh Laporan Action Plan TXT"
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh Action Plan</span>
                </button>
              </div>
            </div>

            {/* Score & Diagnostic Card */}
            <AuditScoreCard audit={auditData} onNavigateToSection={scrollToSection} />

            {/* Section 2: Critical Flaws */}
            <CriticalFlawsSection flaws={auditData.criticalFlaws} />

            {/* Section 3: 3 SEO Title Formulas */}
            <SeoTitlesSection seoTitles={auditData.seoTitles} />

            {/* Section 4: AIDA Copywriting */}
            <CopywritingSection desc={auditData.optimizedDescription} />

            {/* Section 5: 9-Slide Visual Blueprint */}
            <VisualBlueprintSection blueprint={auditData.visualBlueprint} />

            {/* Section 6: Pricing Psychology & Vouchers */}
            <PricingVoucherSection pricing={auditData.pricingStrategy} />

            {/* Section 7: 24/7 Automation System */}
            <AutomationSection
              automation={auditData.automationSystem}
              productName={auditData.productName}
              onOpenVideoModal={() => setIsVideoModalOpen(true)}
            />

            {/* Section 8: Orders Forecast Funnel */}
            <OrdersForecastCalculator
              forecast={auditData.ordersForecast}
              suggestedPrice={auditData.pricingStrategy.suggestedPromoPrice}
            />

            {/* Section 9: Live Simulated Shopee Mockup */}
            <ShopeeMockupPreview audit={auditData} />

            {/* Section 10: Master Recipe & Blueprint 1000 - 5000+ Orders/Day */}
            <MegaOrdersPlaybookSection productName={auditData.productName} />

            {/* Bottom Callout */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1.5 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Siap Menerapkan Solusi ke Toko Shopee Anda?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Salin judul dan deskripsi baru langsung ke Seller Centre Shopee, perbaiki stiker cover produk, dan aktifkan auto-reply untuk mulai merasakan lonjakan pesanan.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExportSummary}
                  className="px-5 py-3 bg-white text-slate-900 hover:bg-orange-50 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-orange-600" />
                  <span>Unduh Semua Rekomendasi (.txt)</span>
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>Audit Produk Lain</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 1-Click 1000 Orders Recipe Modal */}
      <Instant1000RecipeModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        recipe={instantRecipe}
        isLoading={isRecipeLoading}
      />

      {/* Change Master PIN Modal */}
      <ChangePinModal
        isOpen={isChangePinModalOpen}
        onClose={() => setIsChangePinModalOpen(false)}
      />

      {/* Video Script Modal */}
      {auditData && (
        <VideoScriptModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          productName={auditData.productName}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700">
            ShopeeBooster — Tool Audit 1-Klik & Solusi Otomasi Ribuan Orderan
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Dirancang khusus untuk Seller Shopee Indonesia mengikuti kaidah algoritma pencarian organik, CTR visual smartphone, dan konversi checkout otomatis.
          </p>
        </div>
      </footer>
    </div>
  );
}
