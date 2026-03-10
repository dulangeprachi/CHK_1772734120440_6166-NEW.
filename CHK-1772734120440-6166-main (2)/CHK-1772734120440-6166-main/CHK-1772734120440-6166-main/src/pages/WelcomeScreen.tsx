import { ScanBarcode, Search, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-illustration.png";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
];

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="app-shell flex flex-col pb-28 px-6 pt-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-senior-2xl font-display font-900 text-foreground">
          MedScan
        </h1>
        <p className="text-senior-base text-muted-foreground mt-1">
          Your Medicine Helper
        </p>
      </motion.div>

      {/* Hero Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center mb-8"
      >
        <img
          src={heroImage}
          alt="Elderly person using medicine scanner app"
          className="w-48 h-48 object-contain"
        />
      </motion.div>

      {/* Main Action Buttons */}
      <div className="space-y-4 mb-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate("/scan")}
          className="w-full flex items-center gap-5 bg-primary text-primary-foreground rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow active:scale-[0.98]"
        >
          <div className="bg-primary-foreground/20 p-4 rounded-xl">
            <ScanBarcode size={36} />
          </div>
          <div className="text-left">
            <span className="text-senior-lg font-display font-bold block">
              Scan Medicine
            </span>
            <span className="text-senior-sm opacity-80">
              Use camera to scan barcode
            </span>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate("/details")}
          className="w-full flex items-center gap-5 bg-secondary text-secondary-foreground rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow active:scale-[0.98]"
        >
          <div className="bg-secondary-foreground/20 p-4 rounded-xl">
            <Search size={36} />
          </div>
          <div className="text-left">
            <span className="text-senior-lg font-display font-bold block">
              Search Medicine
            </span>
            <span className="text-senior-sm opacity-80">
              Type medicine name to find
            </span>
          </div>
        </motion.button>
      </div>

      {/* Language Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Languages size={24} className="text-primary" />
          <h2 className="text-senior-lg font-display font-bold text-foreground">
            Choose Language
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {languages.map((lang, i) => (
            <button
              key={lang.code}
              className={`rounded-xl p-4 text-center font-display font-bold text-senior-base transition-all active:scale-95 ${
                i === 0
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-foreground border-2 border-border hover:border-primary"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
