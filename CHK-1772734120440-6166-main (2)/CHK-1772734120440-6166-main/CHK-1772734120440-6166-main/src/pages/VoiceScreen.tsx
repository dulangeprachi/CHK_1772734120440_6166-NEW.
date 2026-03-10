import { ArrowLeft, Volume2, Pause, Play, RotateCcw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { MedicineData } from "@/hooks/useMedicineLookup";

const VoiceScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { speak, stop, speaking, currentId } = useTextToSpeech();
  const [speed, setSpeed] = useState<1 | 0.75>(1);

  const medicineData = (location.state as any)?.medicineData as MedicineData | undefined;

  const instructions = medicineData
    ? [
        { id: "name", label: "Medicine Name", text: `${medicineData.name}, brand name ${medicineData.brand}` },
        { id: "dosage", label: "How to Take", text: medicineData.dosage },
        { id: "side", label: "Side Effects", text: medicineData.sideEffects.join(". ") },
        { id: "warn", label: "Warnings", text: medicineData.warnings.join(". ") },
        { id: "food", label: "Food Instructions", text: medicineData.food.join(". ") },
      ]
    : [
        { id: "1", label: "Medicine Name", text: "Paracetamol 500mg, brand name Crocin" },
        { id: "2", label: "How to Take", text: "Take 1 tablet every 6 to 8 hours with water" },
        { id: "3", label: "Side Effects", text: "May cause nausea or skin rash in rare cases" },
        { id: "4", label: "Warnings", text: "Do not take more than 4 tablets in 24 hours" },
      ];

  const readAll = () => {
    const allText = instructions.map((i) => `${i.label}. ${i.text}`).join(". ");
    if (speaking && currentId === "all") {
      stop();
    } else {
      speak(allText, "all", speed);
    }
  };

  const togglePlay = (id: string, text: string) => {
    if (speaking && currentId === id) {
      stop();
    } else {
      speak(text, id, speed);
    }
  };

  return (
    <div className="app-shell flex flex-col pb-28 px-5 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => { stop(); navigate(-1); }}
          className="bg-muted p-3 rounded-xl"
          aria-label="Go back"
        >
          <ArrowLeft size={28} className="text-foreground" />
        </button>
        <div className="flex items-center gap-3">
          <Volume2 size={28} className="text-primary" />
          <h1 className="text-senior-xl font-display font-bold text-foreground">
            Voice Help
          </h1>
        </div>
      </div>

      {/* Play All Button */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={readAll}
        className="w-full flex items-center justify-center gap-4 bg-primary text-primary-foreground rounded-2xl p-6 shadow-lg mb-4 active:scale-[0.98] transition-transform"
      >
        <div className="bg-primary-foreground/20 p-4 rounded-full">
          {speaking && currentId === "all" ? <Pause size={36} /> : <Volume2 size={36} />}
        </div>
        <div className="text-left">
          <span className="text-senior-xl font-display font-bold block">
            {speaking && currentId === "all" ? "Pause" : "Read All"}
          </span>
          <span className="text-senior-sm opacity-80">
            Listen to all instructions
          </span>
        </div>
      </motion.button>

      {/* Speed Toggle */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-senior-base text-muted-foreground font-semibold">Speed:</span>
        <button
          onClick={() => setSpeed(speed === 1 ? 0.75 : 1)}
          className={`px-5 py-3 rounded-xl font-display font-bold text-senior-base transition-all ${
            speed === 0.75
              ? "bg-secondary text-secondary-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {speed === 1 ? "Normal" : "Slow"}
        </button>
      </div>

      {/* Individual Sections */}
      <div className="space-y-3">
        {instructions.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="bg-card rounded-2xl p-5 border border-border shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-senior-lg font-display font-bold text-foreground">
                {item.label}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => togglePlay(item.id, item.text)}
                  className={`p-3 rounded-xl transition-colors ${
                    speaking && currentId === item.id
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                  aria-label={speaking && currentId === item.id ? "Pause" : "Play"}
                >
                  {speaking && currentId === item.id ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button
                  onClick={() => speak(item.text, item.id, speed)}
                  className="p-3 rounded-xl bg-muted text-muted-foreground"
                  aria-label="Replay"
                >
                  <RotateCcw size={24} />
                </button>
              </div>
            </div>
            <p className="text-senior-base text-foreground leading-relaxed">
              {item.text}
            </p>
            {speaking && currentId === item.id && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-1.5 bg-primary rounded-full mt-3 origin-left"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VoiceScreen;
