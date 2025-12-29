import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import type { Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import ReactCountryFlag from "react-country-flag";

const languageNames: Record<Language, { label: string; countryCode: string }> = {
  en: { label: 'English', countryCode: 'US' },
  sv: { label: 'Svenska', countryCode: 'SE' },
  fi: { label: 'Suomi', countryCode: 'FI' },
};

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div>
      <Select value={language} onValueChange={(value: Language) => changeLanguage(value)}>
        <SelectTrigger className="border-0 w-30 max-[500px]:w-15 max-[500px]:h-10">
          {/* Normal select component for wide screens */}
          <span className="max-[500px]:hidden">
            <SelectValue />
          </span>
          {/* Flag icon for narrow screens */}
          <span className="hidden max-[500px]:flex">
            <ReactCountryFlag
              countryCode={languageNames[language].countryCode}
              svg
              className="w-5 h-5 rounded-full object-cover"
            />
          </span>
        </SelectTrigger>
        <SelectContent widthClass="w-32">
          {Object.entries(languageNames).map(([code, { label, countryCode }]) => (
            <SelectItem key={code} value={code as Language}>
              <span className="flex items-center gap-2">
                <ReactCountryFlag
                  countryCode={countryCode}
                  svg
                  className='w-4 h-4'
                  title={countryCode}
                />
                {label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
