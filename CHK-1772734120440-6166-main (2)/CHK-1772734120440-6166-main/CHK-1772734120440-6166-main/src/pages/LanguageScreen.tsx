import { ArrowLeft, Check, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const languages = [
  { code: "en", label: "English", native: "English", sample: "Take 1 tablet every 6-8 hours with water." },
  { code: "hi", label: "Hindi", native: "हिन्दी", sample: "हर 6-8 घंटे में 1 गोली पानी के साथ लें।" },
  { code: "mr", label: "Marathi", native: "मराठी", sample: "दर 6-8 तासांनी 1 गोळी पाण्यासोबत घ्या." },
];

const LanguageScreen = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("en");
  const currentLang = languages.find((l) => l.code === selected)!;

  return (
    <div className="app-shell flex flex-col pb-28 px-5 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-muted p-3 rounded-xl"
          aria-label="Go back"
        >
          <ArrowLeft size={28} className="text-foreground" />
        </button>
        <div className="flex items-center gap-3">
          <Languages size={28} className="text-primary" />
          <h1 className="text-senior-xl font-display font-bold text-foreground">
            Language
          </h1>
        </div>
      </div>

      {/* Language Options */}
      <div className="space-y-3 mb-8">
        {languages.map((lang, i) => (
          <motion.button
            key={lang.code}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelected(lang.code)}
            className={`w-full flex items-center justify-between rounded-2xl p-5 transition-all active:scale-[0.98] ${
              selected === lang.code
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card text-foreground border-2 border-border"
            }`}
          >
            <div className="text-left">
              <span className="text-senior-lg font-display font-bold block">
                {lang.native}
              </span>
              <span className={`text-senior-sm ${selected === lang.code ? "opacity-80" : "text-muted-foreground"}`}>
                {lang.label}
              </span>
            </div>
            {selected === lang.code && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-primary-foreground/20 p-2 rounded-full"
              >
                <Check size={24} />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Preview */}
      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 border-2 border-primary/20 shadow-sm"
      >
        <h2 className="text-senior-base font-display font-bold text-muted-foreground mb-3">
          Preview — Dosage Instructions
        </h2>
        <p className="text-senior-xl font-display font-bold text-foreground leading-relaxed">
          {currentLang.sample}
        </p>
      </motion.div>
    </div>
  );
};

export default LanguageScreen;
