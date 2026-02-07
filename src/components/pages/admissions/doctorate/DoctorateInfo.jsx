// DoctorateInfo.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DoctorateInfo = () => {
  const { i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/admission/doctorate/?lang=${i18n.language}`);
        const result = await response.json();
        if (result.results && result.results.length > 0) {
          setData(result.results[0]);
        }
      } catch (error) {
        console.error('Error fetching doctorate data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language]);

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          <p className="text-blue-200 mt-4">Загрузка...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Аспирантура / Докторантура / PhD
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Программа подготовки высококвалифицированных специалистов в области физической культуры и спорта
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl">
          {data && (
            <>
              <div 
                className="text-blue-100 text-lg leading-relaxed mb-8"
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
              
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <div className="text-white font-medium">
                  {data.file_name}
                </div>
                <a 
                  href={data.pdf} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Скачать
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DoctorateInfo;