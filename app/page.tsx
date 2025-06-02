"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Calculator,
  Users,
  PieChart,
  Shield,
  Smartphone,
  Clock,
  Star,
  CheckCircle,
  TrendingUp,
  Banknote,
  CreditCard,
  BarChart3,
  Share2,
  Bell,
  FileText,
  Filter,
  QrCode,
  MessageCircle,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserPlus,
  Calendar,
  Target,
  Zap,
  Award,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!loading && user) {
      router.push("/home");
    }
  }, [user, loading, router]);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const coreFeatures = [
    {
      icon: <Calculator className="h-8 w-8 text-emerald-600" />,
      title: "Akıllı Borç Hesaplama",
      description:
        "Otomatik hesaplama sistemi ile borçlarınızı doğru bir şekilde takip edin. Kısmi ödemeler otomatik olarak hesaplanır ve güncellenir.",
      benefits: [
        "Otomatik hesaplama",
        "Kısmi ödeme desteği",
        "Anlık güncelleme",
      ],
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Arkadaş Yönetimi",
      description:
        "Sınırsız arkadaş ekleyin ve her biriyle olan borç durumunuzu ayrı ayrı takip edin. Kolay arama ve filtreleme özellikleri.",
      benefits: ["Sınırsız arkadaş", "Hızlı arama", "Grup yönetimi"],
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Detaylı İstatistikler",
      description:
        "Grafik ve raporlarla harcama alışkanlıklarınızı analiz edin. Aylık, haftalık ve kategoriye göre detaylı analizler.",
      benefits: ["Grafik raporlar", "Kategori analizi", "Trend takibi"],
    },
    {
      icon: <CreditCard className="h-8 w-8 text-green-600" />,
      title: "Kısmi Ödeme Sistemi",
      description:
        "Borçları taksitle ödeyebilir ve her ödemeyi detaylı olarak takip edebilirsiniz. Kalan bakiye otomatik hesaplanır.",
      benefits: ["Taksitli ödeme", "Ödeme geçmişi", "Kalan bakiye"],
    },
    {
      icon: <Share2 className="h-8 w-8 text-orange-600" />,
      title: "Kolay Paylaşım",
      description:
        "QR kod ile hızlı paylaşım, WhatsApp entegrasyonu ve link paylaşımı. Arkadaşlarınız kolayca erişebilir.",
      benefits: ["QR kod", "WhatsApp entegrasyonu", "Link paylaşımı"],
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Güvenli Saklama",
      description:
        "Firebase ile güvenli bulut depolama. Verileriniz şifrelenir ve yedeklenir. Hesap güvenliği iki faktörlü doğrulama ile korunur.",
      benefits: ["Bulut depolama", "Şifreli veriler", "Otomatik yedekleme"],
    },
    {
      icon: <PieChart className="h-8 w-8 text-indigo-600" />,
      title: "Kategori Bazlı Takip",
      description:
        "Harcamalarınızı kategorilere ayırın (yemek, ulaşım, eğlence vb.) ve hangi alanlarda daha çok harcadığınızı görün.",
      benefits: ["Kategori analizi", "Harcama dağılımı", "Bütçe kontrolü"],
    },
    {
      icon: <Bell className="h-8 w-8 text-yellow-600" />,
      title: "Akıllı Bildirimler",
      description:
        "Ödeme zamanları, borç durumu değişiklikleri ve önemli güncellemeler için otomatik bildirimler alın.",
      benefits: [
        "Ödeme hatırlatıcıları",
        "Durum bildirimleri",
        "Özel uyarılar",
      ],
    },
    {
      icon: <FileText className="h-8 w-8 text-teal-600" />,
      title: "Detaylı Raporlama",
      description:
        "Aylık, yıllık ve özel tarih aralıklarında detaylı raporlar oluşturun. PDF ve Excel formatında dışa aktarım.",
      benefits: ["Özel raporlar", "PDF dışa aktarım", "Excel desteği"],
    },
    {
      icon: <Smartphone className="h-8 w-8 text-pink-600" />,
      title: "Mobil Optimize",
      description:
        "Tüm cihazlarda mükemmel deneyim. Progressive Web App desteği ile mobil uygulama gibi kullanım.",
      benefits: ["Responsive tasarım", "PWA desteği", "Offline erişim"],
    },
    {
      icon: <Clock className="h-8 w-8 text-cyan-600" />,
      title: "Gerçek Zamanlı Senkronizasyon",
      description:
        "Tüm cihazlarınızda anlık senkronizasyon. Bir cihazda yaptığınız değişiklik diğerlerinde anında görünür.",
      benefits: ["Anlık senkronizasyon", "Çoklu cihaz", "Otomatik güncelleme"],
    },
    {
      icon: <Filter className="h-8 w-8 text-lime-600" />,
      title: "Gelişmiş Filtreleme",
      description:
        "İşlemlerinizi tarih, miktar, kişi ve kategoriye göre filtreleyin. Aradığınız işlemi kolayca bulun.",
      benefits: ["Çoklu filtre", "Hızlı arama", "Sıralama seçenekleri"],
    },
  ];

  const howItWorksSteps = [
    {
      step: "1",
      title: "Ücretsiz Hesap Oluşturun",
      description:
        "Email ile hızlı kayıt olun veya Google hesabınızla giriş yapın. Sadece 30 saniye sürer.",
      icon: <UserPlus className="h-8 w-8 text-emerald-600" />,
    },
    {
      step: "2",
      title: "Arkadaşlarınızı Ekleyin",
      description:
        "Borç alışverişi yaptığınız arkadaşlarınızı sisteme ekleyin. İsim yeterli, başka bilgi gerekmez.",
      icon: <Users className="h-8 w-8 text-blue-600" />,
    },
    {
      step: "3",
      title: "İşlemlerinizi Kaydedin",
      description:
        "Borç verme, borç alma veya ödeme işlemlerinizi kolayca kaydedin. Kategori ve açıklama ekleyebilirsiniz.",
      icon: <Plus className="h-8 w-8 text-purple-600" />,
    },
    {
      step: "4",
      title: "Kısmi Ödemeler Yapın",
      description:
        "Büyük borçları taksitlerle ödeyebilirsiniz. Her ödeme otomatik olarak hesaplanır ve güncellenir.",
      icon: <CreditCard className="h-8 w-8 text-green-600" />,
    },
    {
      step: "5",
      title: "Raporları İnceleyin",
      description:
        "Detaylı grafik ve raporlarla harcama alışkanlıklarınızı analiz edin. Hangi arkadaşla ne kadar borç alışverişi yaptığınızı görün.",
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
    },
    {
      step: "6",
      title: "Paylaşın ve Takip Edin",
      description:
        "QR kod veya link ile arkadaşlarınızla paylaşın. Herkes kendi borç durumunu görebilir.",
      icon: <Share2 className="h-8 w-8 text-red-600" />,
    },
  ];

  const whyChooseReasons = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Hızlı ve Kolay",
      description:
        "Karmaşık hesaplamalar yok. Sadece tutarı girin, sistem otomatik hesaplasın.",
    },
    {
      icon: <Award className="h-8 w-8 text-purple-500" />,
      title: "Tamamen Ücretsiz",
      description:
        "Hiçbir ücret ödemeden tüm özelliklerden faydalanın. Gizli maliyet yok.",
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Güvenli ve Özel",
      description:
        "Verileriniz şifrelenir ve güvenli sunucularda saklanır. Kişisel bilgileriniz korunur.",
    },
    {
      icon: <Target className="h-8 w-8 text-blue-500" />,
      title: "Türkiye'ye Özel",
      description:
        "Türk Lirası desteği ve Türkçe arayüz. Yerel ihtiyaçlara göre tasarlandı.",
    },
  ];

  const testimonials = [
    {
      name: "Ahmet Yılmaz",
      role: "Yazılım Geliştirici",
      content:
        "Muhasebeji sayesinde arkadaşlarımla olan borçlarımı çok daha kolay takip ediyorum. Özellikle kısmi ödeme özelliği harika! Artık büyük borçları taksitlerle ödeyebiliyorum.",
      rating: 5,
      avatar: "AY",
    },
    {
      name: "Elif Kaya",
      role: "Öğrenci",
      content:
        "Üniversitede arkadaşlarımla sürekli borç alışverişi yapıyoruz. Bu uygulama olmadan kim kime ne kadar borçlu olduğunu hatırlamak imkansızdı. Şimdi her şey çok organize.",
      rating: 5,
      avatar: "EK",
    },
    {
      name: "Mehmet Demir",
      role: "Öğrenci",
      content:
        "İstatistikler bölümü gerçekten etkileyici. Harcama alışkanlıklarımı değiştirmeme yardımcı oldu. Hangi kategorilerde ne kadar harcadığımı görmek çok faydalı.",
      rating: 5,
      avatar: "MD",
    },
    {
      name: "Zeynep Özkan",
      role: "Öğretmen",
      content:
        "QR kod paylaşım özelliği çok pratik. Arkadaşlarım uygulamayı bilmese bile kolayca erişebiliyorlar. WhatsApp entegrasyonu da süper.",
      rating: 5,
      avatar: "ZÖ",
    },
    {
      name: "Can Bulut",
      role: "Mühendis",
      content:
        "Mobil uygulaması yok ama web versiyonu o kadar iyi ki telefonuma uygulama gibi kaydettim. Her yerden erişebiliyorum.",
      rating: 5,
      avatar: "CB",
    },
    {
      name: "Selin Acar",
      role: "Pazarlama Uzmanı",
      content:
        "Raporlama özelliği işime çok yarıyor. Aylık harcama analizlerimi kolayca yapabiliyorum. PDF dışa aktarım da mükemmel.",
      rating: 5,
      avatar: "SA",
    },
  ];

  const faqs = [
    {
      question: "Muhasebeji tamamen ücretsiz mi?",
      answer:
        "Evet! Muhasebeji tamamen ücretsizdir. Tüm özelliklerden herhangi bir ücret ödemeden faydalanabilirsiniz. Gizli maliyet veya premium üyelik yoktur.",
    },
    {
      question: "Verilerim güvende mi?",
      answer:
        "Kesinlikle! Tüm verileriniz Firebase güvenli bulut altyapısında şifrelenerek saklanır. Kişisel bilgileriniz üçüncü şahıslarla paylaşılmaz ve düzenli olarak yedeklenir.",
    },
    {
      question: "Mobil uygulaması var mı?",
      answer:
        "Şu anda mobil uygulamamız bulunmuyor ancak web sitemiz responsive tasarıma sahip ve mobil cihazlarda mükemmel çalışır. Progressive Web App teknolojisi sayesinde telefona uygulama gibi kaydedebilirsiniz.",
    },
    {
      question: "Arkadaşlarım da uygulama kullanmak zorunda mı?",
      answer:
        "Hayır! Sadece siz kullanabilirsiniz. Ancak arkadaşlarınız QR kod veya link ile kendi borç durumlarını görüntüleyebilirler. Onların kayıt olmasına gerek yoktur.",
    },
    {
      question: "Verilerimi dışa aktarabilir miyim?",
      answer:
        "Evet! Tüm işlemlerinizi ve raporlarınızı PDF veya Excel formatında dışa aktarabilirsiniz. Bu sayede kendi arşivinizi oluşturabilir veya başka sistemlerde kullanabilirsiniz.",
    },
    {
      question: "Kaç arkadaş ekleyebilirim?",
      answer:
        "Sınırsız! İstediğiniz kadar arkadaş ekleyebilir ve hepsiyle olan borç alışverişinizi takip edebilirsiniz. Sistem performansı etkilenmez.",
    },
    {
      question: "Destek alabiliyor muyum?",
      answer:
        "Tabii ki! Herhangi bir sorunuz veya sorununuz olduğunda iletişim formumuzdan veya email adresimizden bize ulaşabilirsiniz. En kısa sürede dönüş yaparız.",
    },
    {
      question: "Hesabımı silebilir miyim?",
      answer:
        "Evet, hesabınızı istediğiniz zaman tamamen silebilirsiniz. Hesap silme işlemi tüm verilerinizi kalıcı olarak siler ve geri alınamaz.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10" />
        <div className="mx-auto px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <Image
                src="/muhasebeji6.png"
                alt="Muhasebeji"
                width={160}
                height={160}
                className="mx-auto"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold font-poppins bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent mb-6"
            >
              Muhasebeji
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed font-inter"
            >
              Arkadaşlarınızla olan borç alışverişinizi kolayca takip edin.
              <br />
              <span className="text-emerald-600 font-semibold">
                Akıllı hesaplama
              </span>{" "}
              ve
              <span className="text-emerald-600 font-semibold">
                {" "}
                detaylı raporlar
              </span>{" "}
              ile.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
              >
                <Link href="/register" className="flex items-center">
                  Hemen Başla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-black"
              >
                <Link href="/signin">Giriş Yap</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                Tamamen Ücretsiz
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                Kayıt Gerektirmez
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                Güvenli ve Özel
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Muhasebeji */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-poppins text-gray-900 mb-4">
              Neden Muhasebeji?
            </h2>
            <p className="text-xl text-gray-600 font-inter max-w-3xl mx-auto">
              Borç takibi hiç bu kadar kolay olmamıştı. İşte size Muhasebeji'yi
              seçmeniz için nedenler.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseReasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center p-6 gap-2 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center">{reason.icon}</div>
                  <h3 className="text-lg font-semibold font-poppins text-gray-900 mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 font-inter text-sm">
                    {reason.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-poppins text-gray-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-inter">
              Muhasebeji kullanmaya başlamak çok kolay. Sadece 6 adımda borç
              takibinizi profesyonelleştirin.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="h-full p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                  <div className="relative">
                    {/* Step Number Badge */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold font-poppins shadow-lg">
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner">
                        {step.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold font-poppins text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 font-inter leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-poppins text-gray-900 mb-4">
              Tüm Özellikler
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-inter">
              Muhasebeji ile borç takibinizi profesyonel seviyeye taşıyacak tüm
              araçlar elinizin altında.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105 hover-lift">
                  <CardContent className="p-6">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-gray-50 rounded-full mr-4">
                          {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold font-poppins text-gray-900">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed font-inter mb-4">
                        {feature.description}
                      </p>
                      <div className="mt-auto">
                        <ul className="space-y-1">
                          {feature.benefits.map((benefit, i) => (
                            <li
                              key={i}
                              className="flex items-center text-sm text-gray-500"
                            >
                              <CheckCircle className="h-3 w-3 text-emerald-500 mr-2 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-poppins text-gray-900 mb-4">
              Kullanıcı Deneyimleri
            </h2>
            <p className="text-xl text-gray-600 font-inter">
              Binlerce memnun kullanıcımızdan bazı yorumlar
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic font-inter text-sm leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-emerald-600 font-semibold text-sm">
                          {testimonial.avatar}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 font-poppins text-sm">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-gray-500 font-inter">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-poppins text-gray-900 mb-4">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-xl text-gray-600 font-inter">
              Muhasebeji hakkında merak ettikleriniz
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden">
                  <button
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold font-poppins text-gray-900">
                        {faq.question}
                      </h3>
                      {expandedFaq === index ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 font-inter leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-500">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-poppins text-white mb-6">
              Hemen Başlamaya Hazır Mısınız?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto font-inter">
              Muhasebeji ile borç takibinizi kolaylaştırın. Ücretsiz kayıt olun
              ve hemen kullanmaya başlayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-600 hover:bg-gray-50 hover:text-black"
              >
                <Link href="/register" className="flex items-center">
                  Ücretsiz Kayıt Ol
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-emerald-600 hover:bg-white hover:text-black"
              >
                <Link href="/signin">Zaten Hesabım Var</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
