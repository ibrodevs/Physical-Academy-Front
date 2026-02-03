import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DoctorateProgram = () => {
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
  const [programType, setProgramType] = useState('doctorate'); // 'doctorate', 'aspirantura', 'phd'

  // Статичные данные категорий для разных программ
  const doctorateCategories = [
    { 
      id: 1, 
      name: 'Кафедра теории и методики физического воспитания',
      color: 'blue',
      description: 'Кафедра занимается подготовкой высокопрофессиональных специалистов в области физической культуры и спорта на уровне докторантуры.',
      staff: [
        { id: 1, name: 'Иванов Иван Иванович', position: 'Профессор', phone: '+996 312 123456', email: 'ivanov@kgafkis.kg', photo: '/default-avatar.png' },
        { id: 2, name: 'Петров Петр Петрович', position: 'Доцент', phone: '+996 312 123457', email: 'petrov@kgafkis.kg', photo: '/default-avatar.png' },
        { id: 3, name: 'Сидоров Сергей Сергеевич', position: 'Старший преподаватель', phone: '+996 312 123458', email: 'sidorov@kgafkis.kg', photo: '/default-avatar.png' }
      ]
    },
    { 
      id: 2, 
      name: 'Кафедра легкой атлетики и спортивного совершенствования',
      color: 'green',
      description: 'Специализируется на подготовке спортсменов высокого класса и научных работников в области спорта.',
      staff: [
        { id: 4, name: 'Кулиев Камиль Кадимович', position: 'Профессор', phone: '+996 312 234567', email: 'kuliev@kgafkis.kg', photo: '/default-avatar.png' },
        { id: 5, name: 'Раимов Рашид Рашидович', position: 'Доцент', phone: '+996 312 234568', email: 'raimov@kgafkis.kg', photo: '/default-avatar.png' }
      ]
    },
    { 
      id: 3, 
      name: 'Кафедра биомеханики и физиологии спорта',
      color: 'blue-600',
      description: 'Занимается исследованиями в области биомеханики и физиологических основ спорта на докторском уровне.',
      staff: [
        { id: 6, name: 'Керимов Керим Керимович', position: 'Профессор', phone: '+996 312 345678', email: 'kerimov@kgafkis.kg', photo: '/default-avatar.png' },
        { id: 7, name: 'Абдукаев Абдул Абдулович', position: 'Доцент', phone: '+996 312 345679', email: 'abdukaev@kgafkis.kg', photo: '/default-avatar.png' }
      ]
    }
  ];

  const aspiranturaCategories = [
    { 
      id: 10, 
      name: 'Кафедра физического воспитания и спорта',
      color: 'green-600',
      description: 'Кафедра подготавливает высокопрофессиональных аспирантов в области физической культуры и спорта.',
      staff: [
        { id: 11, name: 'Алиев Амир Амирович', position: 'Профессор', phone: '+996 312 456789', email: 'aliev@kgafkis.kg', photo: '/default-avatar.png' },
        { id: 12, name: 'Маматов Мирбек Маматович', position: 'Доцент', phone: '+996 312 456790', email: 'mamatov@kgafkis.kg', photo: '/default-avatar.png' }
      ]
    },
    { 
      id: 11, 
      name: 'Кафедра тренерской подготовки',
      color: 'blue-700',
      description: 'Специализируется на подготовке высокопрофессиональных тренеров и научных работников.',
      staff: [
        { id: 13, name: 'Бейшеналиев Бекзат Бейшеналиевич', position: 'Профессор', phone: '+996 312 567890', email: 'beyshenaliev@kgafkis.kg', photo: '/default-avatar.png' },
        { id: 14, name: 'Смаилов Смаил Смаилович', position: 'Доцент', phone: '+996 312 567891', email: 'smailov@kgafkis.kg', photo: '/default-avatar.png' },
        { id: 15, name: 'Сартаев Сарыбай Сартаевич', position: 'Старший преподаватель', phone: '+996 312 567892', email: 'sartaev@kgafkis.kg', photo: '/default-avatar.png' }
      ]
    }
  ];

  const phdCategories = [
    { 
      id: 20, 
      name: 'Кафедра физического воспитания и спорта',
      color: 'purple-600',
      description: 'Кафедра готовит высокопрофессиональных докторов PhD в области физической культуры и спорта.',
      staff: [
        { id: 21, name: 'Назаров Назар Назарович', position: 'Профессор', phone: '+996 312 654321', email: 'nazarov@kgafkis.kg', photo: '/default-avatar.png' },
        { id: 22, name: 'Турусбеков Турус Туруsowич', position: 'Доцент', phone: '+996 312 654322', email: 'turusbekov@kgafkis.kg', photo: '/default-avatar.png' }
      ]
    },
    { 
      id: 21, 
      name: 'Кафедра тренерской подготовки',
      color: 'indigo-700',
      description: 'Подготавливает высокопрофессиональных докторов PhD в области тренерства и спорта.',
      staff: [
        { id: 23, name: 'Абдуллаев Абдула Абдулаевич', position: 'Профессор', phone: '+996 312 654323', email: 'abdullayev@kgafkis.kg', photo: '/default-avatar.png' },
        { id: 24, name: 'Жунусов Жунус Жунусович', position: 'Доцент', phone: '+996 312 654324', email: 'zhunusov@kgafkis.kg', photo: '/default-avatar.png' }
      ]
    }
  ];

  // Выбираем категории в зависимости от типа программы
  const staticCategories = 
    programType === 'doctorate' ? doctorateCategories : 
    programType === 'aspirantura' ? aspiranturaCategories : 
    phdCategories;

  // Получаем список всех кафедр
  useEffect(() => {
    try {
      setCategories(staticCategories);
      // Сбрасываем activeTab при смене программы
      setActiveTab(null);
      setSelectedTeacher(null);
      setActiveContent('info');
      if (staticCategories.length > 0) {
        setActiveTab(staticCategories[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [programType]);

  // Получаем детали конкретной кафедры по ID
  useEffect(() => {
    if (!activeTab) return;

    try {
      // Ищем в текущих категориях (которые зависят от programType)
      const category = staticCategories.find(cat => cat.id === activeTab);
      if (category) {
        setDepartmentDetails(category);
      } else {
        setDepartmentDetails(null);
      }
    } catch (err) {
      console.error('Error loading department details:', err);
      setErrorDetails(err.message);
    } finally {
      setLoadingDetails(false);
    }
  }, [activeTab, programType]);

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

  // Функция для рендеринга контента
  const renderContent = () => {
    switch (activeContent) {
      case 'info':
        return (
          <>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">О кафедре</h3>
            {departmentDetails && (departmentDetails.description || departmentDetails.info?.description) ? (
              <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: departmentDetails.description || departmentDetails.info?.description }} />
            ) : (
              <p className="text-gray-500 italic">Описание кафедры отсутствует</p>
            )}
          </>
        );
      
      case 'plan':
        return (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">{t('doctorateProgram.tabs.plan', 'УЧЕБНЫЙ ПЛАН')}</h3>
            <a href="https://myedu.kgafkis.kg/" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
              {t('doctorateProgram.goToPlan', 'Перейти к учебному плану')}
            </a>
          </div>
        );
      
      case 'disciplines':
        return (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">{t('doctorateProgram.tabs.disciplines', 'ДИСЦИПЛИНЫ')}</h3>
            <a href="https://myedu.kgafkis.kg/" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
              {t('doctorateProgram.goDisciplines', 'Перейти к дисциплинам')}
            </a>
          </div>
        );
      
      case 'staff':
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">{t('doctorateProgram.tabs.staff', 'СОТРУДНИКИ')}</h3>
            {selectedTeacher ? (
              <div className="bg-white rounded-2xl border-4 border-blue-300 p-12 shadow-2xl mb-8">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="md:w-2/5 flex justify-center">
                    <div className="w-80 h-80 rounded-full overflow-hidden border-8 border-blue-100 shadow-xl">
                      <img src={selectedTeacher.photo || selectedTeacher.image || '/default-avatar.png'} alt={selectedTeacher.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/default-avatar.png'; }} />
                    </div>
                  </div>
                  <div className="md:w-3/5">
                    <h3 className="text-4xl font-bold text-blue-900 mb-4">{selectedTeacher.name || selectedTeacher.full_name}</h3>
                    <p className="text-2xl text-gray-600 mb-8 font-medium">{selectedTeacher.role || selectedTeacher.position}</p>
                    <div className="space-y-5 mb-8">
                      {(selectedTeacher.phone || selectedTeacher.phone_number) && (
                        <div className="flex items-center gap-4">
                          <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-700 text-xl">{selectedTeacher.phone || selectedTeacher.phone_number}</span>
                        </div>
                      )}
                      {(selectedTeacher.email || selectedTeacher.email_address) && (
                        <div className="flex items-center gap-4">
                          <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700 text-xl">{selectedTeacher.email || selectedTeacher.email_address}</span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => setSelectedTeacher(null)} className="bg-blue-500 text-white font-bold py-4 px-10 rounded-lg hover:bg-blue-600 transition-colors text-lg">
                      Назад к списку преподавателей
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(departmentDetails?.staff || departmentDetails?.management || []).map((teacher, index) => (
                  <button key={teacher.id || index} onClick={() => setSelectedTeacher(teacher)} className="bg-white rounded-xl border border-blue-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform hover:border-blue-300 text-left">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 mx-auto border-4 border-blue-100">
                      <img src={teacher.photo || teacher.image || '/default-avatar.png'} alt={teacher.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/default-avatar.png'; }} />
                    </div>
                    <h4 className="text-center font-bold text-blue-900 text-lg mb-2">{teacher.name || teacher.full_name}</h4>
                    <p className="text-center text-gray-600 mb-3">{teacher.role || teacher.position}</p>
                    <div className="text-center text-blue-500 font-medium">Подробнее →</div>
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
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500">Ошибка: {error}</p>
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
            {programType === 'doctorate' 
              ? t('doctorate.title', 'Докторантура')
              : programType === 'aspirantura'
              ? t('aspirantura.title', 'Аспирантура')
              : t('phd.title', 'PhD программа')
            }
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {programType === 'doctorate'
              ? t('doctorate.description', 'Программа подготовки докторов в области физической культуры и спорта')
              : programType === 'aspirantura'
              ? t('aspirantura.description', 'Программа подготовки аспирантов для научных исследований')
              : t('phd.description', 'Программа подготовки докторов философии (PhD) с международными стандартами')
            }
          </p>
        </div>

        {/* Program Type Tabs - 3 кнопки */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['doctorate', 'aspirantura', 'phd'].map((type) => (
            <button
              key={type}
              onClick={() => {
                setProgramType(type);
                setActiveTab(null);
                setActiveContent('info');
                setSelectedTeacher(null);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                programType === type 
                  ? 'border-b-4 bg-blue-50 border-blue-500 text-blue-700 shadow-md' 
                  : 'bg-white text-gray-700 border-b-2 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {type === 'doctorate' ? 'Докторантура' : type === 'aspirantura' ? 'Аспирантура' : 'PhD'}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            <p className="ml-6 text-xl text-gray-600">Загрузка программ...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-8">
            <h3 className="text-red-800 font-bold text-lg">Ошибка при загрузке: {error}</h3>
          </div>
        )}

        {/* Department Categories Tabs */}
        {!loading && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {Array.isArray(categories) && categories.map((category) => {
              const styles = getColorStyles(category.color);
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveTab(category.id);
                    setActiveContent('info');
                    setSelectedTeacher(null);
                  }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                    activeTab === category.id 
                      ? `border-b-4 ${getActiveTabStyle(category.id)} shadow-md` 
                      : 'bg-white text-gray-700 border-b-2 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Main Content Grid or Empty State */}
        {!loading && categories.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">Нет доступных программ</p>
          </div>
        )}
        
        {activeCategory && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Card */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
                <div className={`h-2 ${getColorStyles(activeCategory.color).accent}`} />
                
                <div className="p-8 md:p-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">{activeCategory.name}</h2>

                  {loadingDetails ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                      <p className="ml-4 text-gray-600">Загрузка информации...</p>
                    </div>
                  ) : errorDetails ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="text-red-800 font-semibold">Ошибка: {errorDetails}</h3>
                    </div>
                  ) : (
                    <div className="animate-fadeIn">{renderContent()}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Side Buttons */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                {[
                  { id: 'info', title: t('doctorateProgram.tabs.info', 'ИНФОРМАЦИЯ'), subtitle: t('doctorateProgram.subtitles.info', 'О кафедре') },
                  { id: 'plan', title: t('doctorateProgram.tabs.plan', 'УЧЕБНЫЙ ПЛАН'), subtitle: t('doctorateProgram.subtitles.plan', '(ССЫЛКА НА My EDU)') },
                  { id: 'disciplines', title: t('doctorateProgram.tabs.disciplines', 'ДИСЦИПЛИНЫ'), subtitle: t('doctorateProgram.subtitles.disciplines', '(ССЫЛКА НА My EDU)') },
                  { id: 'staff', title: t('doctorateProgram.tabs.staff', 'СОТРУДНИКИ'), subtitle: t('doctorateProgram.subtitles.staff', '(СПИСОК ФИО)') }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => {
                      setActiveContent(btn.id);
                      setSelectedTeacher(null);
                    }}
                    className={`w-full border-4 font-bold py-4 px-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 text-center ${
                      activeContent === btn.id 
                        ? 'bg-blue-50 border-blue-500 text-blue-700' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-base mb-1">{btn.title}</div>
                    <div className={`text-xs ${activeContent === btn.id ? 'text-blue-500' : 'text-gray-500'}`}>{btn.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default DoctorateProgram;
