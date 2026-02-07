import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiData } from '../../../../hooks/useApi.js';
import { getPhdPrograms } from '../../../../services/api.js';

const DoctorateProgram = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(1); 
  const [activeContent, setActiveContent] = useState('info'); 

  // Получаем данные из API
  const { data: programs, loading, error } = useApiData(getPhdPrograms);

  // Создаем категории на основе данных API
  const categories = programs ? programs.map(program => ({
    id: program.id,
    name: `${t('phd.program_name', 'Программа')} ${program.id}`,
    color: 'blue'
  })) : [];

  // Находим активную программу
  const departmentDetails = programs ? programs.find(program => program.id === activeTab) : null;

  const getColorStyles = (color) => {
    const colorMap = {
      blue: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', accent: 'bg-blue-500' },
      green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700', accent: 'bg-green-500' },
      'blue-600': { border: 'border-blue-600', bg: 'bg-blue-100', text: 'text-blue-800', accent: 'bg-blue-600' },
      'green-600': { border: 'border-green-600', bg: 'bg-green-100', text: 'text-green-800', accent: 'bg-green-600' },
      'blue-700': { border: 'border-blue-700', bg: 'bg-blue-50', text: 'text-blue-900', accent: 'bg-blue-700' }
    };
    return colorMap[color] || colorMap.blue;
  };

  const getActiveTabStyle = (tabId) => {
    if (!Array.isArray(categories)) return '';
    const category = categories.find(cat => cat.id === tabId);
    if (!category) return '';
    const styles = getColorStyles(category.color);
    return `${styles.border} ${styles.bg} ${styles.text}`;
  };

  const getActiveCategory = () => {
    if (!Array.isArray(categories) || !activeTab) return null;
    return categories.find(cat => cat.id === activeTab);
  };

  // Функция для рендеринга контента в зависимости от выбранной кнопки
  const renderContent = () => {
    switch (activeContent) {
      case 'info':
        return (
          <>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {t('phd.info_title', 'Информация')}
            </h3>
            <div className="prose prose-lg max-w-none">
              {departmentDetails?.info ? (
                <div 
                  className="text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: departmentDetails.info }}
                />
              ) : (
                <p className="text-gray-500 italic">{t('phd.no_info', 'Информация отсутствует')}</p>
              )}
            </div>
          </>
        );
      
      case 'plan':
        return (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {t('phd.study_plan', 'УЧЕБНЫЙ ПЛАН')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('phd.study_plan_desc', 'Ссылка на учебный план')}
            </p>
            {departmentDetails?.study_plan ? (
              <a 
                href={departmentDetails.study_plan} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t('phd.go_to_plan', 'Перейти к учебному плану')}
              </a>
            ) : (
              <p className="text-gray-500 italic">{t('phd.no_plan', 'Учебный план отсутствует')}</p>
            )}
          </div>
        );
      
      case 'disciplines':
        return (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {t('phd.disciplines', 'ДИСЦИПЛИНЫ')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('phd.disciplines_desc', 'Список дисциплин')}
            </p>
            {departmentDetails?.disciplines ? (
              <a 
                href={departmentDetails.disciplines} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t('phd.go_to_disciplines', 'Перейти к дисциплинам')}
              </a>
            ) : (
              <p className="text-gray-500 italic">{t('phd.no_disciplines', 'Дисциплины отсутствуют')}</p>
            )}
          </div>
        );
      
      case 'staff':
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-6">
              {t('phd.staff', 'СОТРУДНИКИ')}
            </h3>
            <div className="space-y-3">
              {(departmentDetails?.stuff || []).map((teacher, index) => (
                <div key={teacher.id || index} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 truncate">{teacher.fio}</h4>
                      <p className="text-gray-600 text-sm">{teacher.pos}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const activeCategory = categories.find(cat => cat.id === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading', 'Загрузка...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t('error', 'Ошибка загрузки данных')}</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!programs || programs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{t('no_data', 'Данные отсутствуют')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            {t('phd.title', 'Аспирантура / Докторантура / PhD')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('phd.subtitle', 'Программы подготовки научных кадров высшей квалификации')}
          </p>
        </div>

        {/* Основной контент с боковыми кнопками */}
        {activeCategory && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Главная карточка */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
                <div className={`h-2 ${getColorStyles(activeCategory.color).accent}`} />
                
                <div className="p-8 md:p-12">

                  <div className="animate-fadeIn">
                    {renderContent()}
                  </div>
                </div>
              </div>
            </div>

            {/* Боковые кнопки справа */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                {/* Кнопка ИНФОРМАЦИЯ */}
                <button
                  onClick={() => {
                    setActiveContent('info');
                  }}
                  className={`
                    w-full border-4 font-bold py-4 px-4 rounded-xl transition-all duration-300 
                    hover:shadow-lg transform hover:-translate-y-1 text-center
                    ${activeContent === 'info' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="text-base mb-1">{t('phd.info_button', 'ИНФОРМАЦИЯ')}</div>
                </button>

                {/* Кнопка УЧЕБНЫЙ ПЛАН */}
                <button
                  onClick={() => {
                    if (departmentDetails?.study_plan) {
                      window.open(departmentDetails.study_plan, '_blank');
                    } else {
                      setActiveContent('plan');
                    }
                  }}
                  className={`
                    w-full border-4 font-bold py-4 px-4 rounded-xl transition-all duration-300 
                    hover:shadow-lg transform hover:-translate-y-1 text-center
                    ${activeContent === 'plan' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="text-base mb-1">{t('phd.plan_button', 'УЧЕБНЫЙ ПЛАН')}</div>
                </button>

                {/* Кнопка ДИСЦИПЛИНЫ */}
                <button
                  onClick={() => {
                    if (departmentDetails?.disciplines) {
                      window.open(departmentDetails.disciplines, '_blank');
                    } else {
                      setActiveContent('disciplines');
                    }
                  }}
                  className={`
                    w-full border-4 font-bold py-4 px-4 rounded-xl transition-all duration-300 
                    hover:shadow-lg transform hover:-translate-y-1 text-center
                    ${activeContent === 'disciplines' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="text-base mb-1">{t('phd.disciplines_button', 'ДИСЦИПЛИНЫ')}</div>
                </button>

                {/* Кнопка СОТРУДНИКИ */}
                <button
                  onClick={() => {
                    setActiveContent('staff');
                  }}
                  className={`
                    w-full border-4 font-bold py-4 px-4 rounded-xl transition-all duration-300 
                    hover:shadow-lg transform hover:-translate-y-1 text-center
                    ${activeContent === 'staff' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="text-base mb-1">{t('phd.staff_button', 'СОТРУДНИКИ')}</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Добавляем CSS анимацию */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DoctorateProgram;
