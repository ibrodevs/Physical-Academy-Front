import React from "react"; import { useTranslation } from "react-i18next";

const ScientificLibrary = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('nav.scientific_library', 'Научная библиотека')}
          </h1>
          <p className="text-xl text-gray-600">Hello World</p>
        </div>
      </div>
    </div>
  );
};

export default ScientificLibrary;
