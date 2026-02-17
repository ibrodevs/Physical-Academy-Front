import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import DefaultLogo from "../assets/Logo.png";
import SearchButton from './SearchButton';
import apiService from "../services/api.js";

const Navbar = ({ currentLanguage, languages = [], changeLanguage }) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [nestedMenu, setNestedMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const [adminStructurePdf, setAdminStructurePdf] = useState(null);
  const menuRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    if (currentLanguage && i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const pdfUrl = await apiService.getAdministrativeStructurePdf(currentLanguage);
        setAdminStructurePdf(pdfUrl);
      } catch (error) {
        console.error("Failed to load administrative structure PDF", error);
      }
    };
    fetchPdf();
  }, [currentLanguage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
        setNestedMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = (langCode) => {
    if (changeLanguage) changeLanguage(langCode);
    else i18n.changeLanguage(langCode);
  };

  const splitText = (text) => {
    const words = text.split(' ');
    if (words.length <= 1) return [text, ''];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  };

  const menuData = {
    academy: {
      title: t('nav.academy', 'Академия'),
      submenu: [
        {
          title: t('nav.about_academyy', 'Об академии'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.about_academy', 'Об академии'), link: '/academy/about' },
            { title: t('nav.history', 'История'), link: '/academy/history' },
            { title: t('nav.mission_strategy', 'Миссия и стратегия'), link: '/academy/mission' },
            { title: t('nav.accreditation', 'Аккредитация'), link: '/academy/accreditation' },
            { title: t('nav.kgafkis_in_numbers', 'КГАФКиС в цифрах'), link: '/academy/numbers' },
          ]
        },
        {
          title: t('nav.leadership', 'Руководство'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.board_of_trustees', 'Попечительский совет'), link: '/academy/leadership/board-of-trustees' },
            { title: t('nav.audit_commission', 'Ревизионная комиссия'), link: '/academy/leadership/audit-commission' },
            { title: t('nav.academic_council', 'Ученый совет'), link: '/academy/leadership/academic-council' },
            { title: t('nav.rectorate', 'Ректорат'), link: '/academy/leadership/rectorate' },
            { title: t('nav.trade_union', 'Профсоюз'), link: '/academy/leadership/trade-union' },
            { title: t('nav.commissions', 'Комиссии'), link: '/academy/leadership/commissions' },
            { title: t('nav.administrative_structure', 'Административная структура'), link: adminStructurePdf || '#', isExternal: true },
            { title: t('nav.administrative_units', 'Административные подразделения'), link: '/academy/structure/units' },
            { title: t('nav.documents', 'Документы'), link: '/academy/documents' },
          ]
        }
      ]
    },
    education: {
      title: t('nav.education', 'Образование'),
      submenu: [
        {
          title: t('nav.faculties', 'Факультеты'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.pedagogical_national_sports', 'Педагогический и национальные виды спорта'), link: '/education/faculties/pedagogical' },
            { title: t('nav.coaching_faculty', 'Тренерский факультет'), link: '/education/faculties/coaching' },
            { title: t('nav.military_training_physical_culture', 'Военная подготовка и физическая культура'), link: '/education/faculties/military-training' },
            { title: t('nav.correspondence_advanced_training', 'Заочное обучение и повышение квалификации'), link: '/education/faculties/correspondence' },
            { title: t('nav.general_faculty_departments', 'Общефакультетские кафедры'), link: '/education/departments' }
          ]
        },
        {
          title: t('nav.master_program', 'Магистратура'),
          hasNested: true,
          nestedItems: [{ title: t('nav.general_info', 'Общая информация'), link: '/education/faculties/master' }]
        },
        {
          title: t('nav.doctorate_program', 'Аспирантура, Докторантура, PhD'),
          hasNested: true,
          nestedItems: [{ title: t('nav.general_info', 'Общая информация'), link: '/education/faculties/doctorate' }]
        },
        {
          title: t('nav.college', 'Колледж'),
          hasNested: true,
          nestedItems: [{ title: t('nav.college_physical_culture_sports', 'Колледж физической культуры и спорта'), link: '/education/college/sports' }]
        },
      ]
    },
    sport: {
      title: t('nav.sport', 'Спорт'),
      submenu: [
        { title: t('nav.graduates', 'Выпускники'), link: '/sport/graduates' },
        { title: t('nav.achievements', 'Спортивные достижения'), link: '/sport/achievements' },
      ]
    },
    science: {
      title: t('nav.science', 'Наука'),
      submenu: [
        { title: t('nav.scientific_publications', 'Научные публикации'), link: '/science/publications' },
        { title: t('nav.vestnik', 'Вестник'), link: '/science/vestnik' },
        { title: t('nav.scientific_library', 'Научная библиотека'), link: '/science/library' },
        { title: t('nav.web_of_science', 'Наукометрическая база данных'), link: '/science/web-of-science' },
        { title: t('nav.topic_registry', 'Реестр тем'), link: '/science/topic-registry' },
        { title: t('nav.regulations', 'Положения'), link: '/science/regulations' },
        { title: t('nav.research_and_technical_council', 'Научно-технический совет'), link: '/science/nts-committee' },
        { title: t('nav.young_scientists_council', 'Совет молодых ученых'), link: '/science/young-scientists-council' },
        { title: t('nav.reports', 'Отчеты'), link: '/science/reports' }
      ]
    },
    admissions: {
      title: t('nav.admissions', 'Поступление'),
      submenu: [
        { title: t('nav.applicant', 'Абитуриент'), link: '/admissions/bachelor/info' },
        { title: t('nav.master_program', 'Магистратура'), link: '/admissions/master/info' },
        { title: t('nav.doctorate_program', 'Аспирантура, Докторантура, PhD'), link: '/admissions/doctorate/info' },
      ]
    },
    students: {
      title: t('nav.students', 'Студентам'),
      submenu: [
        {
          title: t('nav.useful_information', 'Полезная информация'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.students_with_disabilities', 'Студенты с ограниченными возможностями'), link: '/students/disabilities' },
            { title: t('nav.student_council', 'Студенческий совет'), link: '/students/council' },
            { title: t('nav.exchange_programs', 'Программы обмена'), link: '/students/exchange' },
            { title: t('nav.instructions', 'Инструкции'), link: '/students/instructions' },
            { title: t('nav.scholarship', 'Стипендия'), link: '/students/scholarship' }
          ]
        },
        {
          title: t('nav.useful_links', 'Полезные ссылки'),
          hasNested: true,
          nestedItems: [{ title: t('nav.visa_support', 'Визовая поддержка'), link: '/students/visa-support' }]
        }
      ]
    },
    myEdu: {
      title: t('nav.my_edu', 'Моё образование'),
      link: 'https://myedu.kgafkis.kg/',
      isExternal: true
    },
    contacts: {
      title: t('nav.contacts', 'Контакты'),
      submenu: [{ title: t('nav.contacts', 'Контакты'), link: '/contacts' }]
    }
  };

  const [firstLine] = splitText(t('nav.kgafkis1', 'КГАФКиС'));
  const [secondLine] = splitText(t('nav.kgafkis2', 'КГАФКиС'));

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-white py-2 shadow-lg border-b border-blue-100" ref={menuRef}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center group">
              <div className="h-14 px-3 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                <img src={DefaultLogo} alt="Logo" className="h-14 w-auto object-contain" />
                <h2 className="ml-3 text-xl font-bold text-blue-800 hidden sm:block">
                  {t('nav.kgafkis', 'КГАФКиС')}
                </h2>
                <div className="ml-2 flex sm:hidden flex-col">
                  <span className="text-sm font-bold text-blue-800 leading-tight">{firstLine}</span>
                  <span className="text-sm font-bold text-blue-800 leading-tight">{secondLine}</span>
                </div>
              </div>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden min-[1475px]:flex items-center justify-center flex-1">
            {Object.entries(menuData).map(([key, item]) => (
              <div
                key={key}
                className="relative flex items-center h-16"
                onMouseEnter={() => setActiveMenu(key)}
                onMouseLeave={() => { setActiveMenu(null); setNestedMenu(null); }}
              >
                {item.link ? (
                  <a
                    href={item.link}
                    target={item.isExternal ? "_blank" : "_self"}
                    rel={item.isExternal ? "noopener noreferrer" : ""}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-blue-800 hover:text-teal-600 transition-all"
                  >
                    {item.title}
                  </a>
                ) : (
                  <div className="relative">
                    <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeMenu === key ? 'text-white bg-gradient-to-r from-teal-500 to-emerald-500 shadow-md' : 'text-blue-800 hover:text-teal-600'}`}>
                      {item.title}
                    </button>

                    {activeMenu === key && (
                      <div className="absolute left-1/2 transform -translate-x-1/2 top-full min-w-[16rem] z-50 pt-2">
                        {/* Контейнер БЕЗ overflow-hidden чтобы вложенное меню было видно */}
                        <div className="rounded-xl shadow-2xl bg-white ring-1 ring-blue-100 py-2">
                          {item.submenu.map((subItem, index) => (
                            <div
                              key={index}
                              className="relative"
                              onMouseEnter={() => subItem.hasNested && setNestedMenu(`${key}-${index}`)}
                              onMouseLeave={() => setNestedMenu(null)}
                            >
                              {subItem.hasNested ? (
                                <>
                                  <button className="flex justify-between items-center w-full px-4 py-3 text-sm text-gray-800 hover:bg-teal-50 transition-colors">
                                    <span>{subItem.title}</span>
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                  </button>

                                  {nestedMenu === `${key}-${index}` && (
                                    <div className="absolute left-full top-0 w-64 pl-2">
                                      <div className="rounded-xl shadow-2xl bg-white ring-1 ring-blue-100 py-2">
                                        {subItem.nestedItems.map((nestedItem, nIdx) => (
                                          <a
                                            key={nIdx}
                                            href={nestedItem.link}
                                            target={nestedItem.isExternal ? "_blank" : "_self"}
                                            className="block px-4 py-3 text-sm text-gray-800 hover:bg-teal-50 border-l-4 border-transparent hover:border-emerald-400"
                                          >
                                            {nestedItem.title}
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <a
                                  href={subItem.link}
                                  target={subItem.isExternal ? "_blank" : "_self"}
                                  className="block px-4 py-3 text-sm text-gray-800 hover:bg-teal-50 border-l-4 border-transparent hover:border-teal-400"
                                >
                                  {subItem.title}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <SearchButton isScrolled={true} />
            <div className="relative" ref={langRef}>
              <LanguageSwitcher variant="outline" showText={true} onChange={handleLanguageChange} languages={languages} currentLanguage={currentLanguage} />
            </div>
            <div className="block min-[1475px]:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 rounded-xl border border-blue-200 text-blue-700 hover:bg-teal-50 transition-all">
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="block min-[1475px]:hidden bg-white shadow-xl border-t border-blue-100 animate-in slide-in-from-top-2">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {Object.entries(menuData).map(([key, item]) => (
              <div key={key}>
                {item.link ? (
                  <a href={item.link} className="block px-4 py-4 rounded-xl text-base font-semibold text-blue-800" onClick={() => setIsMenuOpen(false)}>
                    {item.title}
                  </a>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveMenu(activeMenu === key ? null : key)}
                      className={`w-full text-left flex justify-between items-center px-4 py-4 rounded-xl text-base font-semibold border-l-4 ${activeMenu === key ? 'bg-teal-500 text-white' : 'text-blue-800 border-transparent hover:bg-teal-50'}`}
                    >
                      {item.title}
                      <svg className={`h-5 w-5 ${activeMenu === key ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                    {activeMenu === key && (
                      <div className="pl-6 mt-2 space-y-2">
                        {item.submenu.map((subItem, idx) => (
                          <div key={idx}>
                            {subItem.hasNested ? (
                              <>
                                <button onClick={() => setNestedMenu(nestedMenu === `${key}-${idx}` ? null : `${key}-${idx}`)} className="w-full text-left flex justify-between px-4 py-3 text-sm text-gray-700">
                                  {subItem.title}
                                  <svg className={`h-4 w-4 ${nestedMenu === `${key}-${idx}` ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg>
                                </button>
                                {nestedMenu === `${key}-${idx}` && (
                                  <div className="pl-4 space-y-1">
                                    {subItem.nestedItems.map((nItem, nIdx) => (
                                      <a key={nIdx} href={nItem.link} className="block px-4 py-3 text-sm text-gray-600" onClick={() => setIsMenuOpen(false)}>
                                        {nItem.title}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <a href={subItem.link} className="block px-4 py-3 text-sm text-gray-700" onClick={() => setIsMenuOpen(false)}>
                                {subItem.title}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;