import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const StudentsDisabilities = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/students/support/?lang=${i18n.language}`);
        const result = await response.json();
        if (result.results && result.results.length > 0) {
          setData(result.results[0]);
        }
      } catch (error) {
        console.error('Error fetching students support data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">♿</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🤝</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">❤️</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
        <div className="text-center mb-12 lg:mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('students.disabilities.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('students.disabilities.subtitle')}
          </p>
        </div>

        {/* Описание */}
        <div className="max-w-4xl mx-auto bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              <p className="text-blue-200 mt-4">{t('common.loading')}</p>
            </div>
          ) : (
            data && (
              <div 
                className="text-blue-100 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default StudentsDisabilities;
