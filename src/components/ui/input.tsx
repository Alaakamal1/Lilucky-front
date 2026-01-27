'use client';

import { Search } from 'lucide-react'; // أو أيقونة من Heroicons / Lucide

export default function SearchInput() {
  return (
    <div className="relative w-[220px]">
      {/* أيقونة البحث */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 " size={20} />

      {/* حقل الإدخال */}
      <input
        type="text"
        className="
          w-full
          pl-7
          pr-4
          py-1.5
          border
          border-primary
          rounded-xl
          caret-primary
          focus:outline-none
          focus:ring-1
          focus:ring-primary
          focus:border-primary
          text-secondary-text
          placeholder:text-gray-400
          transition-all
          duration-200
        "
      />
    </div>
  );
}
