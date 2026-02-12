import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from 'framer-motion';
import { getGraduates } from "../../../services/api";

const Graduates = () => {
   const { t, i18n } = useTranslation();
   const [isVisible, setIsVisible] = useState(false);
   const sectionRef = useRef(null);

   // Состояния для данных из API
   const [graduatesData, setGraduatesData] = useState([]);
   const [loading, setLoading] = useState(true);

   // Резервные данные из i18n
   const backupGraduates = t('graduates.list', { returnObjects: true });

   const fetchGraduates = async () => {
      try {
         setLoading(true);

         // Берем только короткий код языка (ru, ky, en)
         const currentLang = i18n.language ? i18n.language.split('-')[0] : 'ru';

         const data = await getGraduates(currentLang);

         // Проверяем, что data существует и это массив
         if (data && Array.isArray(data) && data.length > 0) {
            setGraduatesData(data);
         } else {
            // Если с бэкенда пришел пустой список, берем данные из перевода
            setGraduatesData(Array.isArray(backupGraduates) ? backupGraduates : []);
         }
      } catch (error) {
         console.error('Error fetching graduates:', error);
         setGraduatesData(Array.isArray(backupGraduates) ? backupGraduates : []);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchGraduates();
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

   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: { staggerChildren: 0.1 }
      }
   };

   const itemVariants = {
      hidden: { opacity: 0, x: -50 },
      visible: {
         opacity: 1,
         x: 0,
         transition: { duration: 0.5, ease: "easeOut" }
      }
   };

   return (
      <section
         ref={sectionRef}
         className="relative min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 py-16 lg:py-24 overflow-hidden"
      >
         {/* Анимированный фон */}
         <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
            <div className="absolute top-1/3 left-1/4 w-56 h-56 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            <div className="absolute top-1/4 right-1/4 text-7xl opacity-5">📋</div>
            <div className="absolute bottom-1/3 left-1/4 text-7xl opacity-5">👨‍🎓</div>
            <div className="absolute top-2/3 right-1/3 text-7xl opacity-5">👩‍🎓</div>
         </div>

         <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Header */}
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={isVisible ? { opacity: 1, y: 0 } : {}}
               transition={{ duration: 0.8 }}
               className="text-center mb-16 lg:mb-20"
            >
               <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
               >
                  {t('graduates.title', 'Наши выпускники')}
               </motion.h1>

               <motion.div
                  initial={{ scale: 0 }}
                  animate={isVisible ? { scale: 1 } : {}}
                  className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto mb-8 rounded-full"
               ></motion.div>

               <motion.p
                  className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed"
               >
                  {t('graduates.subtitle', 'Гордость нашей академии — специалисты, меняющие мир спорта')}
               </motion.p>
            </motion.div>

            {/* Список выпускников */}
            <motion.div
               variants={containerVariants}
               initial="hidden"
               animate={isVisible ? "visible" : "hidden"}
               className="max-w-4xl mx-auto"
            >
               {/* Заголовок таблицы */}
               <div className="bg-white/10 backdrop-blur-lg rounded-t-2xl border border-white/20 border-b-0 p-4">
                  <div className="grid grid-cols-12 gap-4 text-emerald-200 font-semibold">
                     <div className="col-span-1 text-center">#</div>
                     <div className="col-span-11">{t('graduates.table.name', 'ФИО выпускника')}</div>
                  </div>
               </div>

               {/* Тело списка */}
               <div className="bg-white/5 backdrop-blur-lg rounded-b-2xl border border-white/20 overflow-hidden min-h-[200px]">
                  {loading ? (
                     <div className="flex justify-center items-center p-10 text-emerald-200">
                        <div className="animate-spin mr-3">🌀</div> Загрузка списка...
                     </div>
                  ) : (
                     graduatesData.map((graduate, index) => (
                        <motion.div
                           key={graduate.id || index}
                           variants={itemVariants}
                           whileHover={{
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              transition: { duration: 0.2 }
                           }}
                           className={`
                              grid grid-cols-12 gap-4 p-4 items-center
                              ${index !== graduatesData.length - 1 ? 'border-b border-white/10' : ''}
                              transition-all duration-300
                           `}
                        >
                           <div className="col-span-1">
                              <span className="inline-flex items-center justify-center w-8 h-8 
                                             bg-gradient-to-r from-emerald-500 to-teal-500 
                                             rounded-lg text-white font-bold text-sm">
                                 {index + 1}
                              </span>
                           </div>

                           <div className="col-span-11">
                              <div className="flex flex-col">
                                 {/* Имя из API (full_name) или из локализации (name) */}
                                 <span className="text-white font-medium text-lg">
                                    {graduate.full_name || graduate.name}
                                 </span>
                                 {/* Описание — рендерим как HTML, так как там могут быть теги */}
                                 {graduate.description && (
                                    <div
                                       className="text-emerald-200/70 text-sm leading-relaxed"
                                       dangerouslySetInnerHTML={{ __html: graduate.description }}
                                    />
                                 )}
                              </div>
                           </div>
                        </motion.div>
                     ))
                  )}
               </div>
            </motion.div>
         </div>
      </section>
   );
};

export default Graduates;