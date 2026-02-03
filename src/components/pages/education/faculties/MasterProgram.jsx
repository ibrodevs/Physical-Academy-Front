import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const MasterProgram = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentDetails, setDepartmentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [activeContent, setActiveContent] = useState('info'); // 'info', 'plan', 'disciplines', 'staff'

  // Получаем список всех кафедр
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/education/master-categories/?lang=${i18n.language}`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        
        // Обработка различных форматов ответа API
        let categoriesArray = [];
        if (Array.isArray(data)) {
          categoriesArray = data;
        } else if (data && Array.isArray(data.results)) {
          categoriesArray = data.results;
        } else if (data && Array.isArray(data.data)) {
          categoriesArray = data.data;
        } else {
          console.warn('Unexpected API response format:', data);
          categoriesArray = [];
        }
        
        setCategories(categoriesArray);
        if (categoriesArray.length > 0) {
          setActiveTab(categoriesArray[0].id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [i18n.language]);

  // Получаем детали конкретной кафедры по ID
  useEffect(() => {
    if (!activeTab) return;

    const fetchDepartmentDetails = async () => {
      setLoadingDetails(true);
      setErrorDetails(null);
      try {
        const url = `https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/education/master-categories/${activeTab}/?lang=${i18n.language}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch department details: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        // Обработка различных форматов ответа API
        let departmentData = data;
        if (data && typeof data === 'object' && !data.description && !data.staff) {
          // Если данные wrapped в другое поле
          if (data.data) departmentData = data.data;
          else if (data.result) departmentData = data.result;
          else if (data.department) departmentData = data.department;
          
          // Если API возвращает данные в формате с info и management
          if (departmentData.info && !departmentData.description) {
            departmentData.description = departmentData.info.description;
          }
          if (departmentData.management && !departmentData.staff) {
            departmentData.staff = departmentData.management;
          }
        }
        
        setDepartmentDetails(departmentData);
      } catch (err) {
        console.error('Error fetching department details:', err);
        setErrorDetails(err.message);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDepartmentDetails();
  }, [activeTab, i18n.language]);

  const getColorStyles = (color) => {
    const colorMap = {
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        accent: 'bg-blue-500'
      },
      green: {
        border: 'border-green-500',
        bg: 'bg-green-50',
        text: 'text-green-700',
        accent: 'bg-green-500'
      },
      'blue-600': {
        border: 'border-blue-600',
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        accent: 'bg-blue-600'
      },
      'green-600': {
        border: 'border-green-600',
        bg: 'bg-green-100',
        text: 'text-green-800',
        accent: 'bg-green-600'
      },
      'blue-700': {
        border: 'border-blue-700',
        bg: 'bg-blue-50',
        text: 'text-blue-900',
        accent: 'bg-blue-700'
      }
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
              О кафедре
            </h3>
            <div className="prose prose-lg max-w-none">
              {departmentDetails && (departmentDetails.description || departmentDetails.info?.description) ? (
                <div 
                  className="text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: departmentDetails.description || departmentDetails.info?.description }}
                />
              ) : (
                <p className="text-gray-500 italic">Описание кафедры отсутствует</p>
              )}
            </div>
          </>
        );
      
      case 'plan':
        return (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              УЧЕБНЫЙ ПЛАН
            </h3>
            <p className="text-gray-600 mb-6">
              Ссылка на учебный план через My EDU
            </p>
            <a 
              href="https://myedu.kgafkis.kg/" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Перейти к учебному плану
            </a>
          </div>
        );
      
      case 'disciplines':
        return (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              ДИСЦИПЛИНЫ
            </h3>
            <p className="text-gray-600 mb-6">
              Список дисциплин через My EDU
            </p>
            <a 
              href="https://myedu.kgafkis.kg/" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Перейти к дисциплинам
            </a>
          </div>
        );
      
      case 'staff':
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              СОТРУДНИКИ
            </h3>
            {selectedTeacher ? (
              <div className="bg-white rounded-2xl border-4 border-blue-300 p-12 shadow-2xl mb-8">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="md:w-2/5 flex justify-center">
                    <div className="w-80 h-80 rounded-full overflow-hidden border-8 border-blue-100 shadow-xl">
                      <img 
                        src={selectedTeacher.photo || selectedTeacher.image || '/default-avatar.png'} 
                        alt={selectedTeacher.name || selectedTeacher.full_name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="md:w-3/5">
                    <h3 className="text-4xl font-bold text-blue-900 mb-4">
                      {selectedTeacher.name || selectedTeacher.full_name || selectedTeacher.title}
                    </h3>
                    <p className="text-2xl text-gray-600 mb-8 font-medium">
                      {selectedTeacher.role || selectedTeacher.position || selectedTeacher.job_title}
                    </p>
                    
                    <div className="space-y-5 mb-8">
                      {(selectedTeacher.phone || selectedTeacher.phone_number) && (
                        <div className="flex items-center gap-4">
                          <svg className="w-7 h-7 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-700 text-xl">{selectedTeacher.phone || selectedTeacher.phone_number}</span>
                        </div>
                      )}
                      
                      {(selectedTeacher.email || selectedTeacher.email_address) && (
                        <div className="flex items-center gap-4">
                          <svg className="w-7 h-7 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700 text-xl">{selectedTeacher.email || selectedTeacher.email_address}</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setSelectedTeacher(null)}
                      className="bg-blue-500 text-white font-bold py-4 px-10 rounded-lg hover:bg-blue-600 transition-colors text-lg"
                    >
                      Назад к списку преподавателей
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(departmentDetails?.staff || departmentDetails?.management || []).map((teacher, index) => (
                  <button
                    key={teacher.id || teacher.name || index}
                    onClick={() => setSelectedTeacher(teacher)}
                    className="bg-white rounded-xl border border-blue-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform hover:border-blue-300 text-left"
                  >
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 mx-auto border-4 border-blue-100">
                      <img 
                        src={teacher.photo || teacher.image || '/default-avatar.png'} 
                        alt={teacher.name || teacher.full_name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                    <h4 className="text-center font-bold text-blue-900 text-lg mb-2">
                      {teacher.name || teacher.full_name || teacher.title}
                    </h4>
                    <p className="text-center text-gray-600 mb-3">
                      {teacher.role || teacher.position || teacher.job_title}
                    </p>
                    <div className="text-center text-blue-500 font-medium">
                      Подробнее →
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading departments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  const activeCategory = getActiveCategory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            {t('master.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('master.description')}
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Array.isArray(categories) && categories
            .filter(category => !category.name.toLowerCase().includes('аспирантур'))
            .map((category) => {
            const styles = getColorStyles(category.color);
            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveTab(category.id);
                  setActiveContent('info');
                  setSelectedTeacher(null);
                }}
                className={`
                  px-6 py-3 rounded-xl font-semibold transition-all duration-300
                  transform hover:-translate-y-1 hover:shadow-lg
                  ${activeTab === category.id 
                    ? `border-b-4 ${getActiveTabStyle(category.id)} shadow-md` 
                    : 'bg-white text-gray-700 border-b-2 border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                {category.name}
              </button>
            );
          })}
        </div>  

        {/* Основной контент с боковыми кнопками */}
        {activeCategory && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Главная карточка */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
                <div className={`h-2 ${getColorStyles(activeCategory.color).accent}`} />
                
                <div className="p-8 md:p-12">
                  <div className="flex items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                      {activeCategory.name}
                    </h2>
                  </div>

                  {loadingDetails ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                      <p className="ml-4 text-gray-600">Загрузка информации...</p>
                    </div>
                  ) : errorDetails ? (
                    <div className="text-center py-8">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="text-red-800 font-semibold mb-2">Ошибка загрузки данных</h3>
                        <p className="text-red-600">{errorDetails}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-fadeIn">
                      {renderContent()}
                    </div>
                  )}
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
                    setSelectedTeacher(null);
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
                  <div className="text-base mb-1">ИНФОРМАЦИЯ</div>
                  <div className={`text-sm ${activeContent === 'info' ? 'text-blue-500' : 'text-gray-500'}`}>
                    О кафедре
                  </div>
                </button>

                {/* Кнопка УЧЕБНЫЙ ПЛАН */}
                <button
                  onClick={() => {
                    setActiveContent('plan');
                    setSelectedTeacher(null);
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
                  <div className="text-base mb-1">УЧЕБНЫЙ ПЛАН</div>
                  <div className={`text-xs ${activeContent === 'plan' ? 'text-blue-500' : 'text-gray-500'}`}>
                    (ССЫЛКА НА My EDU)
                  </div>
                </button>

                {/* Кнопка ДИСЦИПЛИНЫ */}
                <button
                  onClick={() => {
                    setActiveContent('disciplines');
                    setSelectedTeacher(null);
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
                  <div className="text-base mb-1">ДИСЦИПЛИНЫ</div>
                  <div className={`text-xs ${activeContent === 'disciplines' ? 'text-blue-500' : 'text-gray-500'}`}>
                    (ССЫЛКА НА My EDU)
                  </div>
                </button>

                {/* Кнопка СОТРУДНИКИ */}
                <button
                  onClick={() => {
                    setActiveContent('staff');
                    setSelectedTeacher(null);
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
                  <div className="text-base mb-1">СОТРУДНИКИ</div>
                  <div className={`text-xs ${activeContent === 'staff' ? 'text-blue-500' : 'text-gray-500'}`}>
                    (СПИСОК ФИО ПРЕПОДАВАТЕЛЕЙ)
                  </div>
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

export default MasterProgram;