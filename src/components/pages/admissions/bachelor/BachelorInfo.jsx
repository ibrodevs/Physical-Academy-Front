// components/BachelorInfo.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorInfo = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('faculties');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка данных из API
  useEffect(() => {
    setLoading(true); // Сбрасываем loading при смене языка
    const fetchBachelorData = async () => {
      try {
        const response = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/admission/bachelor-programs/?lang=${i18n.language}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setApiData(data.results[0]); // Берем первый элемент из results
      } catch (err) {
        setError(err.message);
        console.error('Error fetching bachelor data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBachelorData();
  }, [i18n.language]); // Добавляем зависимость от языка
  
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
  const admissionRules = {
    description: t('bachelor.rules.description', 'Для поступления в бакалавриат необходимо предоставить полный пакет документов, пройти вступительные испытания и медицинский осмотр. Прием документов осуществляется в установленные сроки. Все абитуриенты проходят тестирование по основам физической культуры и собеседование по выбранному виду спорта.'),
    pdf: {
      title: t('bachelor.rules.pdf.title', 'Правила приема в PDF'),
      link: t('bachelor.rules.pdf.link', '/documents/bachelor-admission-rules.pdf')
    }
  };

  // Контакты и график работы
  const contactsSchedule = {
    phone: t('bachelor.contacts.phone', '+996 312 57 04 89'),
    admissionCommission: {
      phone: t('bachelor.contacts.commissionPhone', '+996 (312) 57 04 89'),
      name: t('bachelor.contacts.commissionName', 'Приемная комиссия')
    },
    email: t('bachelor.contacts.emailAddress', 'Sport_akadem@mail.ru'),
    address: t('bachelor.contacts.address', 'И.Ахунбаева 97 Главный корпус'),
    workingHours: {
      weekdays: t('bachelor.contacts.workingHoursWeekdays', 'Понедельник-пятница: 8:00 - 17:00, обед 12:00 - 13:00'),
      weekend: t('bachelor.contacts.workingHoursWeekend', 'Суббота и воскресенье: выходные')
    },
    socialMedia: {
      instagram: 'https://www.instagram.com/ksapcs.kg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      facebook: 'https://www.facebook.com/people/%D0%91%D0%A2%D0%A2%D1%83%D1%80%D1%83%D1%81%D0%B1%D0%B5%D0%BA%D0%BE%D0%B2-%D0%B0%D1%82%D1%8B%D0%BD%D0%B4%D0%B0%D0%B3%D1%8B-%D0%9A%D0%9C%D0%94%D0%A2%D0%B6%D0%A1%D0%90/61585145273355/?ref=pl_edit_xav_ig_profile_page_web#'
    }
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

        {/* Табы */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-xl shadow-xl p-2 border-2 border-blue-100">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveTab('faculties')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'faculties'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-blue-700 hover:bg-blue-50 hover:shadow-md'
                }`}
              >
                {t('bachelor.tabs.faculties', 'ФАКУЛЬТЕТЫ')}
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'rules'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-blue-700 hover:bg-blue-50 hover:shadow-md'
                }`}
              >
                {t('bachelor.tabs.rules', 'ПРАВИЛА ПРИЕМА')}
              </button>
              <button
                onClick={() => setActiveTab('contacts_schedule')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'contacts_schedule'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-blue-700 hover:bg-blue-50 hover:shadow-md'
                }`}
              >
                {t('bachelor.tabs.contacts_schedule', 'КОНТАКТЫ И ГРАФИК РАБОТЫ')}
              </button>
            </div>
          </div>
        </div>
          
          {/* Контент табов */}
          {activeTab === 'faculties' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 pb-4 border-b border-blue-100">
                <span className="flex items-center">
                  <span className="text-3xl mr-3">🏃‍♂️</span>
                  {t('bachelor.faculties.title', 'ФАКУЛЬТЕТЫ')}
                </span>
              </h2>
              
              <div className="space-y-8">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">{t('bachelor.loading.faculties', 'Загрузка данных...')}</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">{t('bachelor.loading.error', 'Ошибка загрузки данных:')} {error}</p>
                  </div>
                ) : apiData?.faculties ? (
                  apiData.faculties.map((faculty, index) => (
                    <div key={faculty.id} className="border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all duration-300">
                      <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                        <span className="text-2xl mr-3">🏃‍♂️</span>
                        {faculty.name}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {faculty.sports}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">{t('bachelor.errors.facultiesNotFound', 'Данные о факультетах не найдены')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 pb-4 border-b border-blue-100">
                <span className="flex items-center">
                  <span className="text-3xl mr-3">📋</span>
                  {t('bachelor.rules.title', 'ПРАВИЛА ПРИЕМА')}
                </span>
              </h2>
              
              <div className="prose prose-lg max-w-none mb-8">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">{t('bachelor.loading.rules', 'Загрузка правил приема...')}</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">{t('bachelor.loading.error', 'Ошибка загрузки данных:')} {error}</p>
                  </div>
                ) : apiData?.ruling ? (
                  <div dangerouslySetInnerHTML={{ __html: apiData.ruling }} />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {admissionRules.description}
                  </p>
                )}
              </div>

              {/* PDF ссылка */}
              <div className="pt-6 border-t border-blue-100">
                <div className="flex items-center justify-center">
                  {apiData?.pdf ? (
                    <a
                      href={apiData.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {apiData.file_name || t('bachelor.rules.pdf.downloadText', 'СКАЧАТЬ ПРАВИЛА ПРИЕМА (PDF)')}
                    </a>
                  ) : (
                    <a
                      href={admissionRules.pdf.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {admissionRules.pdf.title}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts_schedule' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 pb-4 border-b border-blue-100">
                <span className="flex items-center">
                  <span className="text-3xl mr-3">📞</span>
                  {t('bachelor.tabs.contacts_schedule', 'КОНТАКТЫ И ГРАФИК РАБОТЫ')}
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
                    <p className="text-gray-600">{contactsSchedule.address}</p>
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
                      <h4 className="font-bold text-gray-800 text-lg mb-1">{t('bachelor.contacts.reception', 'Приемная')}</h4>
                      <p className="text-gray-600">{contactsSchedule.phone}</p>
                    </div>
                  </div>

                  <div className="ml-14 pl-4 border-l-2 border-green-300">
                    <h4 className="font-bold text-green-700 text-base mb-1">{t('bachelor.contacts.commission', 'Приемная комиссия')}</h4>
                    <p className="text-gray-600">{contactsSchedule.admissionCommission.phone}</p>
                    <p className="text-gray-500 text-sm mt-1">{contactsSchedule.admissionCommission.name}</p>
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
                    <h4 className="font-bold text-gray-800 text-lg mb-1">{t('bachelor.contacts.email', 'Email')}</h4>
                    <p className="text-gray-600">{contactsSchedule.email}</p>
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
                      {t('bachelor.contacts.schedule', 'График работы')}
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700 group/item">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
                      <span className="text-sm group-hover/item:text-blue-800 transition-colors">
                        {contactsSchedule.workingHours.weekdays}
                      </span>
                    </li>
                    <li className="flex items-center text-gray-700 group/item">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
                      <span className="text-sm group-hover/item:text-blue-800 transition-colors">
                        {contactsSchedule.workingHours.weekend}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Социальные сети */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 group hover:border-purple-300 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-purple-900 text-lg">
                      {t('bachelor.contacts.socialMedia', 'Социальные сети')}
                    </h4>
                  </div>
                  <div className="flex gap-3 justify-start">
                    <a 
                      href={contactsSchedule.socialMedia.instagram}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                      title="Instagram"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.015-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.882 0 1.44 1.44 0 012.882 0z"/>
                      </svg>
                    </a>
                    <a 
                      href={contactsSchedule.socialMedia.facebook}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                      title="Facebook"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

  );
};

export default BachelorInfo;