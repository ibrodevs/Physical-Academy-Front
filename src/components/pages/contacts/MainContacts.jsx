import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Globe, Facebook, Instagram, Youtube } from "lucide-react";

const MainContacts = () => {
   const { t, i18n } = useTranslation();
   const [selectedContact, setSelectedContact] = useState(null);

   const currentLang = i18n.language || 'en';

   // Статичные данные для контактов
   const contactData = {
      addresses: [
         {
            id: 1,
            name: currentLang === 'ru' ? 'Главный корпус' :
               currentLang === 'kg' ? 'Негизги имарат' :
                  'Main Building',
            address: currentLang === 'ru' ? 'И.Ахунбаева 97' :
               currentLang === 'kg' ? 'И.Ахунбаева 97' :
                  'I.Akhunbaeva 97',
            description: currentLang === 'ru' ? 'Администрация, учебные корпуса' :
               currentLang === 'kg' ? 'Администрация, окуу имараттары' :
                  'Administration, academic buildings'
         },
         {
            id: 2,
            name: currentLang === 'ru' ? 'Спорт комплекс (Манеж)' :
               currentLang === 'kg' ? 'Спорт комплекси (Манеж)' :
                  'Sports Complex (Manezh)',
            address: currentLang === 'ru' ? 'И.Ахунбаева 97/1' :
               currentLang === 'kg' ? 'И.Ахунбаева 97/1' :
                  'I.Akhunbaeva 97/1',
            description: currentLang === 'ru' ? 'Спортивные залы, бассейн, тренажеры' :
               currentLang === 'kg' ? 'Спорт залдары, бассейн, тренажерлер' :
                  'Gym halls, swimming pool, fitness equipment'
         }
      ],
      contacts: [
         {
            id: 1,
            type: 'phone',
            title: currentLang === 'ru' ? 'Приемная' :
               currentLang === 'kg' ? 'Кабыл алуу' :
                  'Reception',
            value: '+996 312 57 04 89',
            description: currentLang === 'ru' ? 'Основной телефон университета' :
               currentLang === 'kg' ? 'Университеттин негизги телефони' :
                  'Main university phone number'
         },
         {
            id: 2,
            type: 'phone',
            title: currentLang === 'ru' ? 'Приемная комиссия' :
               currentLang === 'kg' ? 'Кабыл алуу комиссиясы' :
                  'Admission Committee',
            value: '+996 707 09 09 52',
            description: currentLang === 'ru' ? 'Халиалдаева Айнура Саматовна' :
               currentLang === 'kg' ? 'Халиалдаева Айнура Саматовна' :
                  'Khalialdaeva Ainura Samatovna'
         },
         {
            // id: 3,
            // type: 'email',
            // title: currentLang === 'ru' ? 'Электронная почта' :
            //    currentLang === 'kg' ? 'Электрондук почта' :
            //       'Email',
            // value: 'info@ala-too.edu.kg',
            // description: currentLang === 'ru' ? 'Общие вопросы' :
            //    currentLang === 'kg' ? 'Жалпы суроолор' :
            //       'General inquiries'
         },
         {
            // id: 4,
            // type: 'website',
            // title: currentLang === 'ru' ? 'Веб-сайт' :
            //    currentLang === 'kg' ? 'Веб-сайт' :
            //       'Website',
            // value: 'www.ala-too.edu.kg',
            // description: currentLang === 'ru' ? 'Официальный сайт университета' :
            //    currentLang === 'kg' ? 'Университеттин расмий сайты' :
            //       'Official university website'
         }
      ],
      schedule: {
         title: currentLang === 'ru' ? 'График работы' :
            currentLang === 'kg' ? 'Иш графиги' :
               'Working Hours',
         days: currentLang === 'ru' ? 'Понедельник - Пятница' :
            currentLang === 'kg' ? 'Дүйшөмбү - Жума' :
               'Monday - Friday',
         hours: currentLang === 'ru' ? '8:00 - 17:00' :
            currentLang === 'kg' ? '8:00 - 17:00' :
               '8:00 - 17:00',
         lunch: currentLang === 'ru' ? 'Обед: 12:00 - 13:00' :
            currentLang === 'kg' ? 'Түшкү тамак: 12:00 - 13:00' :
               'Lunch: 12:00 - 13:00',
         weekend: currentLang === 'ru' ? 'Суббота и Воскресенье - выходные' :
            currentLang === 'kg' ? 'Ишемби жана Жекшемби - эс алуу күндөрү' :
               'Saturday and Sunday - days off'
      },
      socialMedia: [
         {
            id: 1,
            name: 'Facebook',
            icon: <Facebook size={20} />,
            url: 'https://www.facebook.com/people/%D0%91%D0%A2%D0%A2%D1%83%D1%80%D1%83%D1%81%D0%B1%D0%B5%D0%BA%D0%BE%D0%B2-%D0%B0%D1%82%D1%8B%D0%BD%D0%B4%D0%B0%D0%B3%D1%8B-%D0%9A%D0%9C%D0%94%D0%A2%D0%B6%D0%A1%D0%90/61585145273355/?ref=pl_edit_xav_ig_profile_page_web#',
            color: 'bg-blue-600'
         },
         {
            id: 2,
            name: 'Instagram',
            icon: <Instagram size={20} />,
            url: 'https://www.instagram.com/ksapcs.kg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
            color: 'bg-gradient-to-r from-purple-600 to-pink-600'
         },
         {
            id: 3,
            name: 'YouTube',
            icon: <Youtube size={20} />,
            url: '●	https://www.facebook.com/people/%D0%91%D0%A2%D0%A2%D1%83%D1%80%D1%83%D1%81%D0%B1%D0%B5%D0%BA%D0%BE%D0%B2-%D0%B0%D1%82%D1%8B%D0%BD%D0%B4%D0%B0%D0%B3%D1%8B-%D0%9A%D0%9C%D0%94%D0%A2%D0%B6%D0%A1%D0%90/61585145273355/?ref=pl_edit_xav_ig_profile_page_web#',
            color: 'bg-red-600'
         }
      ]
   };

   const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
         alert(currentLang === 'ru' ? 'Скопировано в буфер обмена!' :
            currentLang === 'kg' ? 'Алып жазгычха көчүрүлдү!' :
               'Copied to clipboard!');
      });
   };

   const handleContactClick = (contact) => {
      setSelectedContact(contact);
      setTimeout(() => setSelectedContact(null), 2000);

      if (contact.type === 'phone') {
         window.open(`tel:${contact.value}`);
      } else if (contact.type === 'email') {
         window.open(`mailto:${contact.value}`);
      } else if (contact.type === 'website') {
         window.open(`https://${contact.value}`, '_blank');
      }
   };

   return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden">
         {/* Фоновые элементы */}
         <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
            <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
         </div>

         <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Заголовок */}
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="text-center mb-12 lg:mb-20"
            >
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                  {currentLang === 'ru' ? 'Контакты' :
                     currentLang === 'kg' ? 'Байланыштар' :
                        'Contact Us'}
               </h1>
               <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
               <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  {currentLang === 'ru' ? 'Свяжитесь с нами удобным для вас способом' :
                     currentLang === 'kg' ? 'Өзүңүзгө ыңгайлуу жол менен биз менен байланышыңыз' :
                        'Reach out to us through any convenient method'}
               </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
               {/* Левая колонка: Адреса и Контакты */}
               <div className="space-y-8">
                  {/* Адреса */}
                  <motion.div
                     initial={{ opacity: 0, x: -30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.6, delay: 0.2 }}
                     className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 lg:p-8"
                  >
                     <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mr-4">
                           <MapPin size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                           {currentLang === 'ru' ? 'Адреса' :
                              currentLang === 'kg' ? 'Даректер' :
                                 'Addresses'}
                        </h2>
                     </div>

                     <div className="space-y-6">
                        {contactData.addresses.map((address) => (
                           <div key={address.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-emerald-400/30 transition-all duration-300">
                              <h3 className="text-lg font-semibold text-white mb-2">{address.name}</h3>
                              <div className="flex items-start space-x-2 mb-2">
                                 <MapPin size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                                 <p className="text-blue-100">{address.address}</p>
                              </div>
                              <p className="text-sm text-blue-300">{address.description}</p>
                           </div>
                        ))}
                     </div>

                     {/* Карта Google Maps */}
                     <div className="mt-6 rounded-xl overflow-hidden border border-white/20">
                        <iframe
                           title="Ala-Too University Location"
                           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2924.083189418088!2d74.59021521542224!3d42.87180897915616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389ec9c5d7e5b7a7%3A0x8f2b4f5f5b5b5b5b!2sAla-Too%20International%20University!5e0!3m2!1sen!2skg!4v1647456000000!5m2!1sen!2skg"
                           width="100%"
                           height="250"
                           style={{ border: 0 }}
                           allowFullScreen=""
                           loading="lazy"
                           referrerPolicy="no-referrer-when-downgrade"
                           className="rounded-lg"
                        ></iframe>
                     </div>
                  </motion.div>

                  {/* График работы */}
                  <motion.div
                     initial={{ opacity: 0, x: -30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.6, delay: 0.4 }}
                     className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 lg:p-8"
                  >
                     <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center text-amber-400 mr-4">
                           <Clock size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">{contactData.schedule.title}</h2>
                     </div>

                     <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl p-4">
                           <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">{contactData.schedule.days}</span>
                              <span className="text-emerald-400 font-semibold">{contactData.schedule.hours}</span>
                           </div>
                           <p className="text-blue-300 text-sm">{contactData.schedule.lunch}</p>
                        </div>

                        <div className="bg-rose-500/10 rounded-xl p-4 border border-rose-500/20">
                           <p className="text-rose-300 text-center">{contactData.schedule.weekend}</p>
                        </div>
                     </div>
                  </motion.div>
               </div>

               {/* Правая колонка: Контакты и Соцсети */}
               <div className="space-y-8">
                  {/* Контакты */}
                  <motion.div
                     initial={{ opacity: 0, x: 30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.6, delay: 0.3 }}
                     className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 lg:p-8"
                  >
                     <h2 className="text-2xl font-bold text-white mb-6">
                        {currentLang === 'ru' ? 'Контакты' :
                           currentLang === 'kg' ? 'Байланыштар' :
                              'Contacts'}
                     </h2>

                     <div className="space-y-4">
                        {contactData.contacts.map((contact) => (
                           <motion.button
                              key={contact.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleContactClick(contact)}
                              onContextMenu={(e) => {
                                 e.preventDefault();
                                 copyToClipboard(contact.value);
                              }}
                              className="w-full bg-white/5 rounded-xl p-4 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group text-left"
                           >
                              <div className="flex items-start space-x-4">
                                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${contact.type === 'phone' ? 'bg-blue-500/20 text-blue-400' :
                                    contact.type === 'email' ? 'bg-emerald-500/20 text-emerald-400' :
                                       'bg-purple-500/20 text-purple-400'
                                    } group-hover:scale-110 transition-transform duration-300`}>
                                    {contact.type === 'phone' ? <Phone size={20} /> :
                                       contact.type === 'email' ? <Mail size={20} /> :
                                          <Globe size={20} />}
                                 </div>
                                 <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-1">{contact.title}</h3>
                                    <p className="text-blue-100 text-lg font-medium mb-1">{contact.value}</p>
                                    <p className="text-sm text-blue-300">{contact.description}</p>
                                 </div>
                              </div>
                           </motion.button>
                        ))}
                     </div>

                     {/* Подсказка */}
                     <div className="mt-6 bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                        <p className="text-blue-300 text-sm text-center">
                           {currentLang === 'ru' ? 'Нажмите для звонка/открытия, нажмите правой кнопкой для копирования' :
                              currentLang === 'kg' ? 'Чакыруу/ачуу үчүн басыңыз, көчүрүү үчүн оң баскыч менен басыңыз' :
                                 'Click to call/open, right-click to copy'}
                        </p>
                     </div>
                  </motion.div>

                  {/* Социальные сети */}
                  <motion.div
                     initial={{ opacity: 0, x: 30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.6, delay: 0.5 }}
                     className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 lg:p-8"
                  >
                     <h2 className="text-2xl font-bold text-white mb-6">
                        {currentLang === 'ru' ? 'Социальные сети' :
                           currentLang === 'kg' ? 'Социалдык тармактар' :
                              'Social Media'}
                     </h2>

                     <div className="grid grid-cols-3 gap-4">
                        {contactData.socialMedia.map((social) => (
                           <motion.a
                              key={social.id}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ y: -5 }}
                              whileTap={{ scale: 0.95 }}
                              className={`${social.color} rounded-xl p-4 flex flex-col items-center justify-center text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                           >
                              <div className="mb-2">{social.icon}</div>
                              <span className="text-sm font-medium">{social.name}</span>
                           </motion.a>
                        ))}
                     </div>

                     <div className="mt-6 text-center">
                        <p className="text-blue-300">
                           {currentLang === 'ru' ? 'Следите за нашими новостями и обновлениями' :
                              currentLang === 'kg' ? 'Биздин жаңылыктар жана жаңыртууларды көрүңүз' :
                                 'Follow our news and updates'}
                        </p>
                     </div>
                  </motion.div>

                  {/* Дополнительная информация */}

               </div>
            </div>
         </div>
      </section>
   );
};

export default MainContacts;