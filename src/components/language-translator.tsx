"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, Languages } from "lucide-react";
import styles from "./language-translator.module.css";

interface GoogleTranslateElement {
  new (config: any, elementId: string): void;
  InlineLayout: {
    SIMPLE: string;
  };
}

interface GoogleTranslate {
  translate: {
    TranslateElement: GoogleTranslateElement;
  };
}

declare global {
  interface Window {
    google?: GoogleTranslate;
    googleTranslateElementInit?: () => void;
  }
}

export default function LanguageTranslator() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const translateElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Check if script is already loaded
    if (document.querySelector('script[src*="translate.google.com"]')) {
      return;
    }

    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    
    script.onerror = () => {
      setError("Failed to load Google Translate");
    };

    // Define the callback function before adding the script
    window.googleTranslateElementInit = function() {
      try {
        if (window.google?.translate?.TranslateElement && translateElementRef.current) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi,bn,te,ta,ml,gu,kn,mr,pa,ur,or,as,ne,si,my,km,lo,th,vi,id,ms,fil,zh-CN,ja,ko,ar,fa,he,tr,ru,uk,pl,cs,sk,hu,ro,bg,sr,hr,sl,lt,lv,et,fi,sv,da,no,nl,de,fr,es,pt,it,el",
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element"
          );

          // Hide unwanted elements
          const hideElements = () => {
            // Remove the banner
            const banner = document.querySelector('.goog-te-banner-frame');
            if (banner && banner.parentNode) {
              banner.parentNode.removeChild(banner);
            }

            // Remove the balloon
            const balloon = document.querySelector('.goog-te-balloon-frame');
            if (balloon && balloon.parentNode) {
              balloon.parentNode.removeChild(balloon);
            }

            // Remove the VIpgJd span
            const viSpan = document.querySelector('.VIpgJd-ZVi9od-xl07Ob-lTBxed');
            if (viSpan && viSpan.parentNode) {
              viSpan.parentNode.removeChild(viSpan);
            }

            // Remove the language selector arrow
            const arrow = document.querySelector('.goog-te-gadget-simple a span:last-child');
            if (arrow && arrow.parentNode) {
              arrow.parentNode.removeChild(arrow);
            }
          };

          // Call hideElements immediately and after a short delay
          hideElements();
          setTimeout(hideElements, 500);

          // Update the language names to show in their native scripts
          setTimeout(() => {
            const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (select) {
              const options = select.options;
              for (let i = 0; i < options.length; i++) {
                const option = options[i];
                switch(option.value) {
                  // Indian Languages
                  case 'hi': option.text = 'हिंदी'; break;
                  case 'bn': option.text = 'বাংলা'; break;
                  case 'te': option.text = 'తెలుగు'; break;
                  case 'ta': option.text = 'தமிழ்'; break;
                  case 'ml': option.text = 'മലയാളം'; break;
                  case 'gu': option.text = 'ગુજરાતી'; break;
                  case 'kn': option.text = 'ಕನ್ನಡ'; break;
                  case 'mr': option.text = 'मराठी'; break;
                  case 'pa': option.text = 'ਪੰਜਾਬੀ'; break;
                  case 'ur': option.text = 'اردو'; break;
                  case 'or': option.text = 'ଓଡ଼ିଆ'; break;
                  case 'as': option.text = 'অসমীয়া'; break;
                  case 'ne': option.text = 'नेपाली'; break;
                  // Other Asian Languages
                  case 'si': option.text = 'සිංහල'; break;
                  case 'my': option.text = 'မြန်မာ'; break;
                  case 'km': option.text = 'ខ្មែរ'; break;
                  case 'lo': option.text = 'ລາວ'; break;
                  case 'th': option.text = 'ไทย'; break;
                  case 'vi': option.text = 'Tiếng Việt'; break;
                  case 'id': option.text = 'Bahasa Indonesia'; break;
                  case 'ms': option.text = 'Bahasa Melayu'; break;
                  case 'fil': option.text = 'Filipino'; break;
                  // East Asian Languages
                  case 'zh-CN': option.text = '中文 (简体)'; break;
                  case 'ja': option.text = '日本語'; break;
                  case 'ko': option.text = '한국어'; break;
                  // Middle Eastern Languages
                  case 'ar': option.text = 'العربية'; break;
                  case 'fa': option.text = 'فارسی'; break;
                  case 'he': option.text = 'עברית'; break;
                  // European Languages
                  case 'tr': option.text = 'Türkçe'; break;
                  case 'ru': option.text = 'Русский'; break;
                  case 'uk': option.text = 'Українська'; break;
                  case 'pl': option.text = 'Polski'; break;
                  case 'cs': option.text = 'Čeština'; break;
                  case 'sk': option.text = 'Slovenčina'; break;
                  case 'hu': option.text = 'Magyar'; break;
                  case 'ro': option.text = 'Română'; break;
                  case 'bg': option.text = 'Български'; break;
                  case 'sr': option.text = 'Српски'; break;
                  case 'hr': option.text = 'Hrvatski'; break;
                  case 'sl': option.text = 'Slovenščina'; break;
                  case 'lt': option.text = 'Lietuvių'; break;
                  case 'lv': option.text = 'Latviešu'; break;
                  case 'et': option.text = 'Eesti'; break;
                  case 'fi': option.text = 'Suomi'; break;
                  case 'sv': option.text = 'Svenska'; break;
                  case 'da': option.text = 'Dansk'; break;
                  case 'no': option.text = 'Norsk'; break;
                  case 'nl': option.text = 'Nederlands'; break;
                  case 'de': option.text = 'Deutsch'; break;
                  case 'fr': option.text = 'Français'; break;
                  case 'es': option.text = 'Español'; break;
                  case 'pt': option.text = 'Português'; break;
                  case 'it': option.text = 'Italiano'; break;
                  case 'el': option.text = 'Ελληνικά'; break;
                }
              }
            }
          }, 1000);
        } else {
          setError("Google Translate API not available");
        }
      } catch (err) {
        setError("Error initializing Google Translate");
        console.error("Google Translate initialization error:", err);
      }
    };

    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.translatorContainer}>
      {/* Custom Translate Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-black border border-green-500 text-green-400 rounded-lg hover:bg-green-900/20 transition-all duration-300 neon-text"
        title="Translate Page"
      >
        <div className="relative">
          <Globe className="w-5 h-5" />
          <Languages className="w-3 h-3 absolute -top-1 -right-1 text-green-300" />
        </div>
        <span className="text-sm font-mono">TRANSLATE</span>
      </button>

      {/* Google Translate Element (Hidden but functional) */}
      <div 
        className={`${styles.translateDropdown} ${
          isOpen ? styles.translateDropdownVisible : styles.translateDropdownHidden
        }`}
      >
        <div className="bg-black border border-green-500 rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <span className="text-green-400 text-sm font-mono">Google Translate</span>
            </div>
          </div>
          <div id="google_translate_element" ref={translateElementRef}></div>
        </div>
      </div>

      {error && (
        <div className="absolute top-full right-0 mt-2 text-xs text-red-500 bg-black border border-red-500 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
} 