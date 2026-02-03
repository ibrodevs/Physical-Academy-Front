// components/BachelorInfo.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorInfo = () => {
  const { t } = useTranslation();
  const [selectedFaculty, setSelectedFaculty] = useState(0);
  const [selectedSport, setSelectedSport] = useState(0);
  
  // Данные факультетов
  const faculties = [
    {
      id: 1,
      name: t('bachelor.faculties.sports.name', 'Педагогический и национальные виды спорта'),
      description: t('bachelor.faculties.sports.description', 'Подготовка специалистов в области физической культуры и национальных видов спорта'),
      icon: '🏃‍♂️',
      sports: [
        { id: 1, name: t('bachelor.sports.football', 'Футбол') },
        { id: 2, name: t('bachelor.sports.basketball', 'Баскетбол') },
        { id: 3, name: t('bachelor.sports.volleyball', 'Волейбол') },
        { id: 4, name: t('bachelor.sports.swimming', 'Плавание') },
        { id: 5, name: t('bachelor.sports.athletics', 'Легкая атлетика') },
        { id: 6, name: t('bachelor.sports.judo', 'Дзюдо') },
      ]
    },
    {
      id: 2,
      name: t('bachelor.faculties.coaching.name', 'Тренерский факультет'),
      description: t('bachelor.faculties.coaching.description', 'Подготовка профессиональных тренеров и спортивных менеджеров'),
      icon: '👨‍🏫',
      sports: [
        { id: 7, name: t('bachelor.sports.boxing', 'Бокс') },
        { id: 8, name: t('bachelor.sports.wrestling', 'Борьба') },
        { id: 9, name: t('bachelor.sports.gymnastics', 'Гимнастика') },
        { id: 10, name: t('bachelor.sports.tennis', 'Теннис') },
        { id: 11, name: t('bachelor.sports.weightlifting', 'Тяжелая атлетика') },
      ]
    },
    {
      id: 3,
      name: t('bachelor.faculties.military.name', 'Военная подготовка и физическая культура'),
      description: t('bachelor.faculties.military.description', 'Подготовка специалистов по физической подготовке для вооруженных сил'),
      icon: '🎖️',
      sports: [
        { id: 12, name: t('bachelor.sports.shooting', 'Стрельба') },
        { id: 13, name: t('bachelor.sports.archery', 'Стрельба из лука') },
        { id: 14, name: t('bachelor.sports.martialArts', 'Боевые искусства') },
        { id: 15, name: t('bachelor.sports.orientation', 'Спортивное ориентирование') },
      ]
    }
  ];

  // Данные правил приема
  const admissionRules = [
    {
      id: 1,
      title: t('bachelor.rules.documents.title', 'Необходимые документы'),
      icon: '📄',
      color: 'from-blue-500 to-blue-600',
      items: [
        t('bachelor.rules.documents.item1', 'Заявление на поступление'),
        t('bachelor.rules.documents.item2', 'Аттестат о среднем образовании (оригинал)'),
        t('bachelor.rules.documents.item3', 'Паспорт (копия)'),
        t('bachelor.rules.documents.item4', 'Медицинская справка формы 086/у'),
        t('bachelor.rules.documents.item5', '6 фотографии 3x4 см'),
        t('bachelor.rules.documents.item6', 'Сертификат ЕГЭ/ОРТ (при наличии)'),
      ]
    },
    {
      id: 2,
      title: t('bachelor.rules.dates.title', 'Сроки подачи документов'),
      icon: '📅',
      color: 'from-green-500 to-green-600',
      items: [
        t('bachelor.rules.dates.item1', 'Начало приема документов: 20 июня'),
        t('bachelor.rules.dates.item2', 'Окончание приема документов: 25 августа'),
        t('bachelor.rules.dates.item3', 'Вступительные испытания: 26-30 августа'),
        t('bachelor.rules.dates.item4', 'Объявление результатов: 1 сентября'),
      ]
    },
    {
      id: 3,
      title: t('bachelor.rules.exams.title', 'Вступительные испытания'),
      icon: '📝',
      color: 'from-purple-500 to-purple-600',
      items: [
        t('bachelor.rules.exams.item1', 'Общая физическая подготовка'),
        t('bachelor.rules.exams.item2', 'Тестирование по основам физической культуры'),
        t('bachelor.rules.exams.item3', 'Собеседование по выбранному виду спорта'),
        t('bachelor.rules.exams.item4', 'Медицинский осмотр'),
      ]
    }
  ];

  // Контактная информация
  const contactInfo = {
    title: t('bachelor.contacts.title', 'Контакты и график работы'),
    address: t('bachelor.contacts.address', 'И.Ахунбаева 97 Главный корпус'),
    phone: '+996 312 57 04 89',
    admissionCommission: {
      phone: '+996 707 09 09 52',
      name: 'Халиалдаева Айнура Саматовна'
    },
    email: 'admission@kgafkis.kg',
    schedule: [
      t('bachelor.contacts.weekdays', 'Пн-Пт: 8:00 - 17:00, обед 12:00 - 13:00'),
      t('bachelor.contacts.saturday', 'Сб: выходной'),
      t('bachelor.contacts.sunday', 'Вс: выходной'),
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6">
            {t('bachelor.title', 'БАКАЛАВРИАТ')}
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-6"></div>
          <p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto font-medium leading-relaxed">
            {t('bachelor.subtitle', 'Подготовка высококвалифицированных специалистов в области физической культуры и спорта')}
          </p>
        </div>

        {/* Основная сетка: 3 колонки */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Левая колонка: Факультеты */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 pb-4 border-b border-blue-100">
                <span className="flex items-center">
                  <span className="text-3xl mr-3">🎓</span>
                  {t('bachelor.faculties.title', 'ФАКУЛЬТЕТЫ')}
                </span>
              </h2>
              
              <div className="space-y-4 mb-8">
                {faculties.map((faculty, index) => (
                  <button
                    key={faculty.id}
                    onClick={() => setSelectedFaculty(index)}
                    className={`w-full text-left p-5 rounded-xl transition-all duration-300 group ${
                      selectedFaculty === index
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border-2 border-blue-400'
                        : 'bg-blue-50 text-blue-800 hover:bg-blue-100 hover:shadow-md border-2 border-blue-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{faculty.icon}</span>
                      <div className="flex-1">
                        <div className="font-bold text-lg">{faculty.name}</div>
                        {selectedFaculty === index && (
                          <div className="mt-2 text-blue-100 text-sm">
                            {faculty.description}
                          </div>
                        )}
                      </div>
                      {selectedFaculty === index && (
                        <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Виды спорта выбранного факультета */}
              <div className="mt-8 pt-6 border-t border-blue-100">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">⚽</span>
                  {t('bachelor.sports.title', 'ВИДЫ СПОРТА')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {faculties[selectedFaculty]?.sports.map((sport) => (
                    <div
                      key={sport.id}
                      className={`p-3 rounded-lg text-center transition-all duration-300 cursor-pointer border-2 ${
                        selectedSport === sport.id
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400 shadow-md'
                          : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300'
                      }`}
                      onClick={() => setSelectedSport(sport.id)}
                    >
                      <div className="font-medium text-sm">
                        {sport.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Центральная колонка: Правила приема */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 h-full">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 pb-4 border-b border-blue-100">
                <span className="flex items-center">
                  <span className="text-3xl mr-3">📋</span>
                  {t('bachelor.rules.title', 'ПРАВИЛА ПРИЕМА')}
                </span>
              </h2>
              
              <div className="space-y-6">
                {admissionRules.map((rule) => (
                  <div 
                    key={rule.id} 
                    className="p-5 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 group hover:shadow-lg"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${rule.color} flex items-center justify-center text-white text-xl shadow-md mr-4`}>
                        {rule.icon}
                      </div>
                      <h3 className="text-lg font-bold text-blue-900">
                        {rule.title}
                      </h3>
                    </div>
                    
                    <ul className="space-y-2">
                      {rule.items.map((item, index) => (
                        <li key={index} className="flex items-start group/item">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3"></div>
                          <span className="text-gray-700 text-sm group-hover/item:text-blue-800 transition-colors">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Кнопка подачи заявления */}
              <div className="mt-8 pt-6 border-t border-blue-100">
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group">
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-lg">{t('bachelor.applyButton', 'ПОДАТЬ ЗАЯВЛЕНИЕ ОНЛАЙН')}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Правая колонка: Контакты и график */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 h-full">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 pb-4 border-b border-blue-100">
                <span className="flex items-center">
                  <span className="text-3xl mr-3">📞</span>
                  {contactInfo.title.toUpperCase()}
                </span>
              </h2>
              
              <div className="space-y-6">
                {/* Адрес */}
                <div className="flex items-start group">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">{t('bachelor.contacts.addressTitle', 'Адрес')}</h4>
                    <p className="text-gray-600">{contactInfo.address}</p>
                  </div>
                </div>

                {/* Телефон */}
                <div className="space-y-4">
                  <div className="flex items-start group">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-200 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg mb-1">{t('bachelor.contacts.phoneTitle', 'Приемная')}</h4>
                      <p className="text-gray-600">{contactInfo.phone}</p>
                    </div>
                  </div>

                  <div className="ml-14 pl-4 border-l-2 border-green-300">
                    <h4 className="font-bold text-green-700 text-base mb-1">{t('bachelor.contacts.commissionTitle', 'Приемная комиссия')}</h4>
                    <p className="text-gray-600">{contactInfo.admissionCommission.phone}</p>
                    <p className="text-gray-500 text-sm mt-1">{contactInfo.admissionCommission.name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start group">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">Email</h4>
                    <p className="text-gray-600">{contactInfo.email}</p>
                  </div>
                </div>

                {/* График работы */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border-2 border-blue-200 group hover:border-blue-300 transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-green-400 rounded-lg flex items-center justify-center text-white mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-blue-900 text-lg">
                      {t('bachelor.contacts.scheduleTitle', 'График работы')}
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {contactInfo.schedule.map((item, index) => (
                      <li key={index} className="flex items-center text-gray-700 group/item">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-sm group-hover/item:text-blue-800 transition-colors">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя секция с дополнительной информацией */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
          <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">
            <span className="flex items-center justify-center">
              <span className="text-3xl mr-3">ℹ️</span>
              {t('bachelor.additionalInfo.title', 'ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ')}
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 group hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-2xl shadow-md mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                🎓
              </div>
              <h3 className="font-bold text-blue-900 text-xl mb-3 text-center">
                {t('bachelor.additionalInfo.scholarship.title', 'СТИПЕНДИИ')}
              </h3>
              <p className="text-gray-600 text-center">
                {t('bachelor.additionalInfo.scholarship.description', 'Для успевающих студентов предоставляются академические и социальные стипендии.')}
              </p>
            </div>
            
            <div className="p-6 rounded-xl border-2 border-green-200 hover:border-green-400 transition-all duration-300 group hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center text-white text-2xl shadow-md mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                🏠
              </div>
              <h3 className="font-bold text-green-900 text-xl mb-3 text-center">
                {t('bachelor.additionalInfo.hostel.title', 'ОБЩЕЖИТИЕ')}
              </h3>
              <p className="text-gray-600 text-center">
                {t('bachelor.additionalInfo.hostel.description', 'Иногородним студентам предоставляется место в современном общежитии академии.')}
              </p>
            </div>
            
            <div className="p-6 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 group hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-2xl shadow-md mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                🌍
              </div>
              <h3 className="font-bold text-purple-900 text-xl mb-3 text-center">
                {t('bachelor.additionalInfo.international.title', 'МЕЖДУНАРОДНЫЕ ПРОГРАММЫ')}
              </h3>
              <p className="text-gray-600 text-center">
                {t('bachelor.additionalInfo.international.description', 'Программы обмена с ведущими спортивными вузами Европы и Азии.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BachelorInfo;