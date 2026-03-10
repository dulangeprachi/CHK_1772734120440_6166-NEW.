import {
  ArrowLeft,
  Pill,
  Clock,
  AlertTriangle,
  UtensilsCrossed,
  Shield,
  Activity,
  Volume2,
  Loader2,
  Search,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMedicineLookup, MedicineData } from "@/hooks/useMedicineLookup";

const Section = ({
  icon: Icon,
  title,
  color,
  children,
  delay,
}: {
  icon: any;
  title: string;
  color: string;
  children: React.ReactNode;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-card rounded-2xl p-5 shadow-sm border border-border"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-card" />
      </div>
      <h2 className="text-senior-lg font-display font-bold text-foreground">
        {title}
      </h2>
    </div>
    {children}
  </motion.div>
);

const MedicineDetailsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lookup, loading, error, data } = useMedicineLookup();
  const [searchQuery, setSearchQuery] = useState("");

  const stateQuery = (location.state as any)?.query;

  useEffect(() => {
    if (stateQuery) {
      setSearchQuery(stateQuery);
      lookup(stateQuery);
    }
  }, [stateQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      lookup(searchQuery.trim());
    }
  };

  return (
    <div className="app-shell flex flex-col pb-28">
      {/* Header */}
      <div className="bg-primary px-5 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-5">
          <button
            onClick={() => navigate(-1)}
            className="bg-primary-foreground/20 p-3 rounded-xl"
            aria-label="Go back"
          >
            <ArrowLeft size={28} className="text-primary-foreground" />
          </button>
          <h1 className="text-senior-xl font-display font-bold text-primary-foreground">
            Medicine Details
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search medicine name..."
            className="flex-1 bg-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/50 rounded-xl px-4 py-3 text-senior-base font-body outline-none border-2 border-transparent focus:border-primary-foreground/40 transition-colors"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-secondary text-secondary-foreground rounded-xl px-4 py-3 active:scale-95 transition-transform disabled:opacity-50"
            aria-label="Search"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
          </button>
        </div>

        {/* Medicine Name Card */}
        {data && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary-foreground/15 backdrop-blur rounded-2xl p-5"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary-foreground/20 p-4 rounded-xl">
                <Pill size={36} className="text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-senior-xl font-display font-900 text-primary-foreground">
                  {data.name}
                </h2>
                <p className="text-senior-base text-primary-foreground/80">
                  {data.brand} · {data.type}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/voice", { state: { medicineData: data } })}
              className="mt-4 w-full flex items-center justify-center gap-3 bg-secondary text-secondary-foreground rounded-xl p-3 font-display font-bold text-senior-base active:scale-[0.98] transition-transform"
            >
              <Volume2 size={24} />
              Listen to Instructions
            </button>
          </motion.div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={48} className="text-primary animate-spin mb-4" />
          <p className="text-senior-lg font-display font-bold text-muted-foreground">
            Looking up medicine...
          </p>
          <p className="text-senior-base text-muted-foreground">
            AI is fetching detailed information
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="px-5 pt-8">
          <div className="bg-destructive/10 rounded-2xl p-6 text-center">
            <AlertTriangle size={48} className="text-destructive mx-auto mb-3" />
            <p className="text-senior-lg font-display font-bold text-destructive mb-2">
              Could not find medicine
            </p>
            <p className="text-senior-base text-muted-foreground">{error}</p>
            <button
              onClick={handleSearch}
              className="mt-4 bg-primary text-primary-foreground rounded-xl px-6 py-3 font-display font-bold text-senior-base"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* No Query State */}
      {!data && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <Search size={64} className="text-muted-foreground/30 mb-4" />
          <p className="text-senior-lg font-display font-bold text-muted-foreground text-center">
            Search for a medicine
          </p>
          <p className="text-senior-base text-muted-foreground text-center">
            Type a medicine name above or scan a barcode
          </p>
        </div>
      )}

      {/* Content */}
      {data && !loading && (
        <div className="px-5 -mt-2 space-y-4 pt-4">
          <Section icon={Activity} title="Uses" color="bg-primary" delay={0.1}>
            <ul className="space-y-2">
              {data.uses.map((use, i) => (
                <li key={i} className="flex items-start gap-3 text-senior-base text-foreground">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  {use}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={Clock} title="Dosage" color="bg-accent" delay={0.2}>
            <p className="text-senior-base text-foreground leading-relaxed">
              {data.dosage}
            </p>
          </Section>

          <Section icon={AlertTriangle} title="Side Effects" color="bg-warning" delay={0.3}>
            <ul className="space-y-2">
              {data.sideEffects.map((effect, i) => (
                <li key={i} className="flex items-start gap-3 text-senior-base text-foreground">
                  <span className="text-warning font-bold mt-0.5">⚠</span>
                  {effect}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={Shield} title="Warnings" color="bg-destructive" delay={0.4}>
            <ul className="space-y-2">
              {data.warnings.map((warning, i) => (
                <li key={i} className="flex items-start gap-3 text-senior-base text-foreground font-semibold">
                  <span className="text-destructive font-bold mt-0.5">🚫</span>
                  {warning}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={UtensilsCrossed} title="Food & Drink" color="bg-success" delay={0.5}>
            <ul className="space-y-2">
              {data.food.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-senior-base text-foreground">
                  <span className="text-success font-bold mt-0.5">🍽</span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}
    </div>
  );
};

export default MedicineDetailsScreen;
