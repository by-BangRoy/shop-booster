import React, { useState } from 'react';
import {
  Flame,
  TrendingUp,
  Radio,
  Users,
  Package,
  Layers,
  Zap,
  CheckCircle,
  Copy,
  Check,
  Download,
  AlertTriangle,
  ArrowRight,
  Truck,
  DollarSign,
  ShieldAlert,
  Clock,
  Printer,
  Boxes
} from 'lucide-react';

interface MegaOrdersPlaybookSectionProps {
  productName?: string;
}

export const MegaOrdersPlaybookSection: React.FC<MegaOrdersPlaybookSectionProps> = ({
  productName = 'Produk Unggulan Anda',
}) => {
  const [targetLevel, setTargetLevel] = useState<'1000' | '2500' | '5000'>('1000');
  const [activeTab, setActiveTab] = useState<'strategy' | 'logistics' | 'checklist'>('strategy');
  const [copiedSop, setCopiedSop] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
  });

  const toggleStep = (id: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getTargetDetails = () => {
    switch (targetLevel) {
      case '5000':
        return {
          orders: '5.000+ Pesanan / Hari',
          monthlyOrders: '150.000+ Pesanan / Bulan',
          visitsNeeded: '100.000 - 125.000 Kunjungan / Hari',
          hostsNeeded: '4 - 6 Host Live (Shift 20 - 24 Jam)',
          affiliatesNeeded: '500+ Affiliator Aktif Tiap Minggu',
          packersNeeded: '12 - 18 Orang Tim Packing Terlatih',
          printersNeeded: '4 - 6 Unit Thermal Printer Industri',
          pickupSchedule: 'Pick-up Ekspedisi 3 - 4 Kali Sehari (Pagi, Siang, Sore, Malam)',
          gmvEst: 'Rp 400.000.000 - Rp 1.000.000.000+ / Hari',
          badge: 'Level Mega Top Seller (Tier 1)',
        };
      case '2500':
        return {
          orders: '2.500 Pesanan / Hari',
          monthlyOrders: '75.000 Pesanan / Bulan',
          visitsNeeded: '50.000 - 65.000 Kunjungan / Hari',
          hostsNeeded: '3 - 4 Host Live (Shift 14 - 18 Jam)',
          affiliatesNeeded: '200+ Affiliator Aktif',
          packersNeeded: '6 - 9 Orang Tim Packing',
          printersNeeded: '3 Unit Thermal Printer',
          pickupSchedule: 'Pick-up Ekspedisi 2 - 3 Kali Sehari (Siang, Sore)',
          gmvEst: 'Rp 175.000.000 - Rp 450.000.000 / Hari',
          badge: 'Level Star+ Seller Champion',
        };
      default:
        return {
          orders: '1.000 Pesanan / Hari',
          monthlyOrders: '30.000 Pesanan / Bulan',
          visitsNeeded: '20.000 - 25.000 Kunjungan / Hari',
          hostsNeeded: '2 Host Live (Shift 8 - 12 Jam)',
          affiliatesNeeded: '80 - 120 Affiliator Aktif',
          packersNeeded: '3 - 5 Orang Tim Packing',
          printersNeeded: '2 Unit Thermal Printer',
          pickupSchedule: 'Pick-up Ekspedisi 2 Kali Sehari (Siang, Sore)',
          gmvEst: 'Rp 70.000.000 - Rp 180.000.000 / Hari',
          badge: 'Level Top Brand Emerging',
        };
    }
  };

  const details = getTargetDetails();

  const sopText = `=== RESEP LENGKAP & SOP TEMBUS 1.000 - 5.000+ ORDERAN SHOPEE PER HARI ===
Target Volume: ${details.orders} (${details.badge})
Kebutuhan Kunjungan: ${details.visitsNeeded}

1. FORMULA TRAFIK MASIF (OMNI-CHANNEL TRAFFIC):
- 35% Organik Pencarian: Wajib peringkat 1-3 di 10 kata kunci utama pencarian tinggi.
- 30% Shopee Live: Siaran 12-24 jam nonstop dengan host bergantian, klaim voucher diskon s/d 50% dari Shopee.
- 20% Jaringan Affiliator: Sebarkan sampel gratis ke 100-500 kreator video untuk posting keranjang oranye Shopee Video.
- 15% Iklan Shopee Berbayar: Iklan Kata Kunci Spesifik (Exact Match) dengan ROAS target > 4x.

2. STRATEGI VARIAN PANCINGAN (LOSS-LEADER HOOK):
- Masukkan 1 varian pancingan murah (misal: sampel ukuran mini / bonus tali / kartu pembersih) seharga Rp 9.900.
- Ini membuat Shopee menampilkan label harga "Mulai Rp 9.900" di halaman pencarian!
- CTR foto sampul akan melonjak dari 3% menjadi 12%-16% karena pembeli terpancing melihat harga terendah.

3. KUNCI OPERASIONAL GUDANG 5.000 PAKET:
- Gunakan thermal printer 100x150 mm untuk cetak resi otomatis tanpa gunting kertas.
- Pola picking massal: Ambil produk berdasarkan tipe produk (Batch Picking), bukan cetak per lembar resi.
- MoU dengan SPX Express & J&T: Jadwalkan pick-up 3 kali sehari agar tidak ada penumpukan dan menjaga tingkat keterlambatan di bawah 1%.

Disusun oleh Formula Top Seller ShopeeBooster Pro.
`;

  const handleCopySop = () => {
    navigator.clipboard.writeText(sopText);
    setCopiedSop(true);
    setTimeout(() => setCopiedSop(false), 2000);
  };

  const checklistItems = [
    {
      id: 1,
      title: 'Pasang Varian Pancingan Termurah di Katalog',
      desc: 'Tambahkan 1 varian mini/aksesoris seharga Rp 9.900 agar harga terendah memicu CTR di halaman pencarian Shopee.',
      category: 'Katalog & Harga',
    },
    {
      id: 2,
      title: 'Tautkan Produk ke Shopee Video untuk Klaim Voucher 40%',
      desc: 'Buat minimal 3 video pendek per hari dengan keranjang oranye agar pembeli mendapatkan subsidi diskon langsung dari Shopee.',
      category: 'Trafik Video',
    },
    {
      id: 3,
      title: 'Atur Jadwal Live Streaming 12 - 24 Jam Nonstop',
      desc: 'Bagi 2-4 shift host live streaming. Tiap jam bagikan koin Shopee dan pin voucher diskon 50% Shopee Live.',
      category: 'Shopee Live',
    },
    {
      id: 4,
      title: 'Rekrut 50-100 Kreator Shopee Affiliate per Minggu',
      desc: 'Buka menu Kolaborasi Kreator di Seller Centre. Berikan komisi 10%-15% dan kirim sampel gratis bagi kreator bertrafik tinggi.',
      category: 'Affiliate Marketing',
    },
    {
      id: 5,
      title: 'Aktifkan Iklan Pencarian Otomatis + Spesifik Berbatas Biaya',
      desc: 'Bid 5 kata kunci utama dengan pencocokan spesifik (exact match), atur target ROAS minimal 4.0 agar margin tetap terjaga.',
      category: 'Shopee Ads',
    },
    {
      id: 6,
      title: 'Siapkan Stok Pengaman (Safety Stock) Minimal 3 Hari',
      desc: 'Pastikan buffer stock 3.000 - 15.000 unit di gudang siap kirim demi mencegah kehabisan stok saat flash deal berjalan.',
      category: 'Manajemen Stok',
    },
    {
      id: 7,
      title: 'Gunakan Thermal Printer Resi 100x150 mm Berkecepatan Tinggi',
      desc: 'Wajib barcode thermal agar 1 operator packing bisa menyelesaikan 300-500 paket per hari tanpa manual taping resi.',
      category: 'Operasional Gudang',
    },
    {
      id: 8,
      title: 'Kontrak Pick-Up Prioritas Ekspedisi (2-4 Kali per Hari)',
      desc: 'Jadwalkan armada truk ekspedisi pick-up pukul 10:00, 14:00, 18:00, dan 21:00 agar tingkat keterlambatan kirim < 1%.',
      category: 'Logistik & Ekspedisi',
    },
    {
      id: 9,
      title: 'Broadcast Chat Keranjang Ditinggalkan Setiap Pukul 19:30',
      desc: 'Kirim pengingat diskon terbatas 3 jam ke seluruh pengguna yang telah memasukkan produk ke keranjang belanja.',
      category: 'Konversi Chat',
    },
    {
      id: 10,
      title: 'Selipkan Kartu Terima Kasih Undian Bintang 5 di Tiap Dus',
      desc: 'Memicu 60%+ pembeli memberikan ulasan bintang 5 lengkap dengan foto & video unboxing untuk mendorong algoritma sosial.',
      category: 'Reputasi Toko',
    },
  ];

  return (
    <section id="section-mega-playbook" className="bg-white rounded-3xl shadow-2xl border-2 border-orange-400/40 p-5 sm:p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-200/40 via-amber-100/30 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-red-600 to-orange-600 text-white uppercase tracking-wider shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
              Formula Mega Top Seller
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              Skala Industri E-Commerce Indonesia
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            Resep Rahasia Tembus 1.000 - 5.000+ Orderan Per Hari
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Mencapai ribuan orderan setiap hari bukan sekadar soal keberuntungan, melainkan kombinasi sistematis: matematika pasokan trafik, psikologi varian pancingan, siaran live nonstop, pasukan kreator affiliate, dan operasional gudang kilat.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto flex-shrink-0">
          <button
            onClick={handleCopySop}
            className="px-4 py-2.5 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            {copiedSop ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>SOP Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Seluruh SOP Master</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Target Level Selector */}
      <div className="mt-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            Pilih Target Skala Orderan Harian Anda:
          </span>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            {details.badge}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setTargetLevel('1000')}
            className={`p-4 rounded-2xl border-2 transition-all text-left cursor-pointer flex flex-col justify-between ${
              targetLevel === '1000'
                ? 'border-orange-500 bg-orange-50/60 shadow-md ring-2 ring-orange-500/20'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Tier 1: Dasar Skala</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-200 text-orange-800">
                1.000 / Hari
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-2">1.000 Pesanan</div>
            <div className="text-xs text-slate-600 mt-0.5 font-medium">
              ~30.000 Paket / Bulan • Est. Omzet Rp 2M - 4.5M/bln
            </div>
          </button>

          <button
            onClick={() => setTargetLevel('2500')}
            className={`p-4 rounded-2xl border-2 transition-all text-left cursor-pointer flex flex-col justify-between ${
              targetLevel === '2500'
                ? 'border-orange-500 bg-orange-50/60 shadow-md ring-2 ring-orange-500/20'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Tier 2: Juara Kategori</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                2.500 / Hari
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-2">2.500 Pesanan</div>
            <div className="text-xs text-slate-600 mt-0.5 font-medium">
              ~75.000 Paket / Bulan • Est. Omzet Rp 5M - 12M/bln
            </div>
          </button>

          <button
            onClick={() => setTargetLevel('5000')}
            className={`p-4 rounded-2xl border-2 transition-all text-left cursor-pointer flex flex-col justify-between ${
              targetLevel === '5000'
                ? 'border-red-500 bg-red-50/60 shadow-md ring-2 ring-red-500/20'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-red-600">Tier 3: Mega Dominasi</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">
                5.000+ / Hari
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-2">5.000+ Pesanan</div>
            <div className="text-xs text-slate-600 mt-0.5 font-medium">
              ~150.000+ Paket / Bulan • Est. Omzet Rp 15M - 30M+/bln
            </div>
          </button>
        </div>
      </div>

      {/* Target Requirements Resource Box */}
      <div className="mt-5 p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl shadow-xl border border-slate-700">
        <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            Matematika Mesin Pasokan untuk {details.orders}:
          </span>
          <span className="text-[11px] font-mono text-slate-300">
            Kalkulasi Rasio Konversi E-Commerce
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-slate-300">Target Kunjungan Harian</div>
            <div className="text-base sm:text-lg font-black text-amber-300 mt-1">
              {details.visitsNeeded}
            </div>
            <div className="text-[10px] text-slate-400">Pencarian + Live + Affiliate</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-slate-300">Kapasitas Host Live</div>
            <div className="text-base sm:text-lg font-black text-orange-300 mt-1">
              {details.hostsNeeded}
            </div>
            <div className="text-[10px] text-slate-400">Siaran Shift Bergantian</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-slate-300">Kebutuhan Tim Packing</div>
            <div className="text-base sm:text-lg font-black text-emerald-300 mt-1">
              {details.packersNeeded}
            </div>
            <div className="text-[10px] text-slate-400">Kapasitas 350-450 paket/org</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-slate-300">Armada Pick-Up Ekspedisi</div>
            <div className="text-base sm:text-lg font-black text-teal-300 mt-1">
              {details.pickupSchedule.split('(')[0]}
            </div>
            <div className="text-[10px] text-slate-400">SPX Express / J&T / SiCepat</div>
          </div>
        </div>
      </div>

      {/* Playbook Navigation Tabs */}
      <div className="mt-8 flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('strategy')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'strategy'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>6 Kunci Rahasia Tembus 5.000 Order</span>
        </button>

        <button
          onClick={() => setActiveTab('logistics')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'logistics'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Sistem Gudang & Logistik 5.000 Paket</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'checklist'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Checklist Harian Top Seller</span>
        </button>
      </div>

      {/* Tab 1: 6 Core Secrets */}
      {activeTab === 'strategy' && (
        <div className="mt-6 space-y-4">
          {/* Secret 1: Loss Leader Varian Hook */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-white border border-orange-200/90 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-md">
                1
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-base font-extrabold text-slate-900">
                    Kunci 1: Trik Psikologis "Varian Pancingan Termurah" (Loss Leader)
                  </h4>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-200 text-orange-900">
                    Lonjakan CTR 400%
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  <strong>Rahasia Top Seller:</strong> Jangan hanya pasang 1 varian produk dengan harga normal misal Rp 89.000. Tambahkan 1 varian pancingan seperti <em>"Sample Tester / Pouch Travel / Tali Tambahan / Aksesoris Mini"</em> seharga <strong>Rp 9.900</strong>.
                </p>
                <div className="p-3 bg-white rounded-xl border border-orange-200 text-xs text-orange-950 mt-2">
                  <strong>Dampaknya di Algoritma Shopee:</strong> Di katalog pencarian, Shopee akan otomatis menampilkan label harga <strong>"Mulai Rp 9.900"</strong> dengan coret harga. Calon pembeli yang melihat produk Anda di antara kompetitor akan langsung mengklik karena terlihat paling murah. Begitu mereka masuk ke halaman produk, 90% tetap akan membeli produk utama seharga Rp 89.000!
                </div>
              </div>
            </div>
          </div>

          {/* Secret 2: Shopee Live Nonstop */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 via-orange-50 to-white border border-red-200/90 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-md">
                2
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-base font-extrabold text-slate-900">
                    Kunci 2: Mesin Shopee Live 12 - 24 Jam Nonstop dengan Sistem Shift
                  </h4>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-200 text-red-900">
                    Subsidi Voucher 50%
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Semua toko Shopee yang tembus 2.000 - 5.000 order per hari <strong>TIDAK PERNAH mematikan live streaming</strong>. Mereka merekrut 3-4 host live dengan sistem shift (masing-masing 4-6 jam).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs mt-2">
                  <div className="p-2.5 bg-white rounded-lg border border-red-200">
                    <strong className="text-red-700 block mb-1">Voucher Subsidi Shopee:</strong>
                    Shopee menanggung voucher diskon s/d 50% untuk checkout di Live. Anda tidak perlu memotong margin keuntungan toko!
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-red-200">
                    <strong className="text-red-700 block mb-1">Ritme Flash Deal 5 Menit:</strong>
                    Sematkan (PIN) produk etalase nomor 1 dan aktifkan hitung mundur "Flash Deal Live" setiap 5-10 menit sekali.
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-red-200">
                    <strong className="text-red-700 block mb-1">Umpan Koin Shopee:</strong>
                    Sebarkan koin Shopee 100-500 koin per sesi live agar algoritma merekomendasikan live Anda ke tab teratas.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secret 3: Pasukan Shopee Affiliate */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-white border border-blue-200/90 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-md">
                3
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-base font-extrabold text-slate-900">
                    Kunci 3: Menggerakkan Pasukan 500+ Shopee Affiliator Bebas Biaya Tetap
                  </h4>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-900">
                    Trafik Gratis Masif
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Daripada hanya mengandalkan iklan toko sendiri, bangun armada affiliator yang menjualkan produk Anda 24 jam sehari.
                </p>
                <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs text-blue-950 mt-2 space-y-1">
                  <div><strong>1. Komisi Menarik:</strong> Setel komisi tambahan penjual di level 10% - 15% pada menu Kolaborasi Kreator Shopee.</div>
                  <div><strong>2. Sampel Gratis (Free Sample):</strong> Kirim 50 - 100 paket sampel gratis setiap awal minggu ke kreator Shopee Video dengan views konsisten.</div>
                  <div><strong>3. Efek Bola Salju:</strong> Ketika 200 affiliator masing-masing mengunggah 2 video per minggu, ada 400 video aktif berkeranjang oranye yang mendatangkan ribuan checkout otomatis!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Secret 4: Shopee Video Subsidi 40% */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-white border border-amber-200/90 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-md">
                4
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-base font-extrabold text-slate-900">
                    Kunci 4: Manfaatkan Voucher Khusus Shopee Video (Keranjang Oranye)
                  </h4>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    Subsidi Shopee 40%
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Saat ini Shopee memberikan dorongan trafik dan voucher subsidi potongan belanja hingga 40% (maksimal Rp 40.000) bagi pembeli yang bertransaksi langsung dari keranjang oranye Shopee Video.
                </p>
                <p className="text-xs text-amber-900 mt-1">
                  <strong>Taktik:</strong> Unggah 3-5 video per hari dari akun toko resmi. Di 3 detik pertama berikan instruksi: <em>"Klaim voucher diskon 40% di keranjang oranye sekarang sebelum habis!"</em>
                </p>
              </div>
            </div>
          </div>

          {/* Secret 5: Iklan Kata Kunci Exact Match */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200/90 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-md">
                5
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-base font-extrabold text-slate-900">
                    Kunci 5: Iklan Shopee Berbiaya Murah dengan Strategi Kata Kunci Spesifik
                  </h4>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    Target ROAS &gt; 4.5x
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Hindari menyalakan iklan dengan pencocokan luas (*broad match*) tanpa batas karena akan membakar anggaran Anda dalam hitungan jam.
                </p>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-950 mt-2 space-y-1">
                  <div><strong>• Pencocokan Spesifik (Exact Match):</strong> Pilih 5-10 kata kunci yang berniat beli tinggi (contoh: bukan cuma "sepatu", tapi "sepatu sneakers pria putih empuk original").</div>
                  <div><strong>• Bid Awal Rendah:</strong> Mulai dari Rp 250 - Rp 450 per klik. Naikkan bertahap jika posisi iklan belum di peringkat 1-5 teratas.</div>
                  <div><strong>• Iklan Produk Serupa:</strong> Nyalakan di tab "Kamu Mungkin Juga Suka" dengan bid Rp 180 - Rp 250 untuk mencegat pembeli yang sedang melihat produk kompetitor mahal.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Secret 6: Program Gratis Ongkir Xtra & Star+ */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-violet-50 to-white border border-purple-200/90 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-md">
                6
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-base font-extrabold text-slate-900">
                    Kunci 6: Status Star+ Seller, Gratis Ongkir Xtra, & COD Aktif
                  </h4>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-200 text-purple-900">
                    Faktor Bobot Algoritma #1
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Lebih dari 75% pembeli Shopee memfilter pencarian mereka hanya pada toko yang memiliki badge <strong>Gratis Ongkir Xtra</strong> dan metode <strong>COD (Bayar di Tempat)</strong>.
                </p>
                <p className="text-xs text-purple-900 mt-1">
                  <strong>Syarat Mutlak:</strong> Jangan pernah mematikan opsi COD. Aktifkan Gratis Ongkir Xtra dan Cashback Xtra meskipun ada biaya admin program, karena volume penjualan yang masuk ribuan order akan melipatgandakan profit bersih toko Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Logistics & Warehouse */}
      {activeTab === 'logistics' && (
        <div className="mt-6 space-y-5">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-900 leading-relaxed">
            <strong className="font-bold text-amber-950">⚠️ Peringatan Kritis Poin Penalti:</strong> Menerima 1.000 - 5.000 orderan tanpa kesiapan gudang adalah bom waktu. Jika pesanan terlambat dikirim melebihi batas 2 hari, Shopee akan memberikan poin penalti dan mematikan badge Gratis Ongkir Xtra Anda. Terapkan sistem gudang di bawah ini:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Printer className="w-5 h-5 text-orange-500" />
                1. Otomasi Cetak Resi (Thermal 100x150 mm)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Haram menggunakan printer kertas biasa + isolasi lakban manual saat volume &gt; 500 order. Gunakan printer thermal barcode langsung tempel ke bubble wrap. 1 operator dapat menempel 10 resi per menit.
              </p>
              <div className="text-[11px] font-semibold text-orange-700 bg-orange-100/60 p-2 rounded-lg">
                Kapasitas: 1 unit thermal printer mampu menangani 1.200 - 1.500 resi per shift kerja.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Boxes className="w-5 h-5 text-blue-500" />
                2. Metode Batch Picking (Pengambilan Produk Massal)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jangan mengambil barang per pesanan individual. Gunakan metode <em>Batch Picking</em>: Kumpulkan total pesanan per varian dalam 1 keranjang besar (misal: 300 pcs Hitam XL), lalu bawa ke meja packing meja conveyor.
              </p>
              <div className="text-[11px] font-semibold text-blue-700 bg-blue-100/60 p-2 rounded-lg">
                Menghemat 70% waktu mondar-mandir operator gudang.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Truck className="w-5 h-5 text-emerald-500" />
                3. Perjanjian Khusus Pick-Up Armada Ekspedisi
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hubungi PIC logistik SPX Express, J&T Express, dan SiCepat di kota Anda. Jangan antar paket ke gerai drop-point. Minta armada truk atau grand max datang menjemput ke gudang minimal 3 kali sehari.
              </p>
              <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 p-2 rounded-lg">
                Jadwal Ideal: Pukul 11:00 (Pagi), 15:00 (Siang), dan 20:00 (Malam).
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Clock className="w-5 h-5 text-purple-500" />
                4. Batas Waktu Pengiriman Cepat (Fast Hand Shipping)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Semua pesanan yang masuk sebelum jam 16:00 WIB wajib diserahkan ke kurir pada hari yang sama. Kecepatan pengiriman akan memicu algoritma Shopee menempatkan toko Anda di kategori "Toko Pengiriman Kilat".
              </p>
              <div className="text-[11px] font-semibold text-purple-700 bg-purple-100/60 p-2 rounded-lg">
                Menghasilkan rating 4.9+ dan menjaga pembatalan order &lt; 0.5%.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Daily SOP Checklist */}
      {activeTab === 'checklist' && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Checklist SOP Harian Top Seller (Centang Sesuai Progres):
            </span>
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
              {Object.values(completedSteps).filter(Boolean).length} / {checklistItems.length} Selesai
            </span>
          </div>

          <div className="space-y-2.5">
            {checklistItems.map((item) => {
              const isChecked = !!completedSteps[item.id];

              return (
                <div
                  key={item.id}
                  onClick={() => toggleStep(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-white border-slate-200 hover:border-orange-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors border ${
                      isChecked
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white border-slate-300 text-transparent hover:border-orange-400'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h5
                        className={`text-sm font-bold ${
                          isChecked ? 'text-emerald-950 line-through opacity-85' : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </h5>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {item.category}
                      </span>
                    </div>
                    <p
                      className={`text-xs ${
                        isChecked ? 'text-emerald-800/80' : 'text-slate-600'
                      } leading-relaxed`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 text-center sm:text-left">
          <span className="font-bold text-slate-700">Tips Eksekusi:</span> Mulai dari Kunci 1 (Varian Pancingan) dan Kunci 2 (Shopee Live) dalam 48 jam pertama untuk memicu ledakan trafik awal.
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySop}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Salin Panduan Master</span>
          </button>
        </div>
      </div>
    </section>
  );
};
