import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const Graduates = () => {
   const { t } = useTranslation();
   const [isVisible, setIsVisible] = useState(false);
   const sectionRef = useRef(null);

   const graduates = t('graduates.list', { returnObjects: true });

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

   // Анимации для списка
   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1
         }
      }
   };

   const itemVariants = {
      hidden: { opacity: 0, x: -50 },
      visible: {
         opacity: 1,
         x: 0,
         transition: {
            duration: 0.5,
            ease: "easeOut"
         }
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

            {/* Декоративные элементы */}
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
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
               >
                  {t('graduates.title')}
               </motion.h1>

               <motion.div
                  initial={{ scale: 0 }}
                  animate={isVisible ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto mb-8 rounded-full"
               ></motion.div>

               <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed"
               >
                  {t('graduates.subtitle', 'Список выпускников академии')}
               </motion.p>
            </motion.div>

            {/* Список студентов */}
            <motion.div
               variants={containerVariants}
               initial="hidden"
               animate={isVisible ? "visible" : "hidden"}
               className="max-w-4xl mx-auto"
            >
               {/* Заголовок списка */}
               <div className="bg-white/10 backdrop-blur-lg rounded-t-2xl border border-white/20 border-b-0 p-4">
                  <div className="grid grid-cols-12 gap-4 text-emerald-200 font-semibold">
                     <div className="col-span-1 text-center">#</div>
                     <div className="col-span-5">{t('graduates.table.name', 'ФИО студента')}</div>
                     <div className="col-span-3">{t('graduates.table.year', 'Год выпуска')}</div>
                     <div className="col-span-3">{t('graduates.table.status', 'Статус')}</div>
                  </div>
               </div>

               {/* Контейнер списка */}
               <div className="bg-white/5 backdrop-blur-lg rounded-b-2xl border border-white/20 overflow-hidden">
                  {Array.isArray(graduates) && graduates.map((graduate, index) => (
                     <motion.div
                        key={graduate.id || index}
                        variants={itemVariants}
                        whileHover={{
                           backgroundColor: 'rgba(16, 185, 129, 0.1)',
                           transition: { duration: 0.2 }
                        }}
                        className={`
                  grid grid-cols-12 gap-4 p-4 items-center
                  ${index !== graduates.length - 1 ? 'border-b border-white/10' : ''}
                  transition-all duration-300
                `}
                     >
                        {/* Номер */}
                        <div className="col-span-1">
                           <span className="inline-flex items-center justify-center w-8 h-8 
                                 bg-gradient-to-r from-emerald-500 to-teal-500 
                                 rounded-lg text-white font-bold text-sm">
                              {index + 1}
                           </span>
                        </div>

                        {/* ФИО и информация */}
                        <div className="col-span-5">
                           <div className="flex flex-col">
                              <span className="text-white font-medium text-lg">
                                 {graduate.name}
                              </span>
                              {graduate.description && (
                                 <span className="text-emerald-200/70 text-sm truncate max-w-md">
                                    {graduate.description}
                                 </span>
                              )}
                           </div>
                        </div>

                        {/* Год выпуска */}
                        <div className="col-span-3">
                           <div className="inline-flex items-center px-3 py-1.5 
                                bg-white/10 rounded-lg border border-white/20">
                              <span className="text-emerald-300 text-sm mr-1">🎓</span>
                              <span className="text-white text-sm font-medium">
                                 {graduate.year || '2024'}
                              </span>
                           </div>
                        </div>

                        {/* Статус */}
                        <div className="col-span-3">
                           {graduate.achievements ? (
                              <div className="inline-flex items-center px-3 py-1.5 
                                  bg-gradient-to-r from-amber-500/20 to-orange-500/20 
                                  rounded-lg border border-amber-500/30">
                                 <span className="text-amber-400 text-sm mr-1">🏆</span>
                                 <span className="text-amber-300 text-sm font-medium truncate">
                                    {graduate.achievements}
                                 </span>
                              </div>
                           ) : (
                              <div className="inline-flex items-center px-3 py-1.5 
                                  bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                                 <span className="text-emerald-400 text-sm mr-1">✓</span>
                                 <span className="text-emerald-300 text-sm font-medium">
                                    {t('graduates.status.graduated', 'Выпускник')}
                                 </span>
                              </div>
                           )}
                        </div>
                     </motion.div>
                  ))}
               </div>
            </motion.div>

            {/* Статистика */}


         </div>
      </section>
   );
};

export default Graduates;