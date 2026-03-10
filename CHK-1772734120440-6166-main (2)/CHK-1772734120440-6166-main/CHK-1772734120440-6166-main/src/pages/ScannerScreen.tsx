import { ArrowLeft, Zap, FlashlightOff, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const ScannerScreen = () => {
  const navigate = useNavigate();
  const [flashOn, setFlashOn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    try {
      setCameraError(null);
      const scanner = new Html5Qrcode("scanner-container");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 280, height: 180 },
          aspectRatio: 1.5,
        },
        (decodedText) => {
          scanner.stop().then(() => {
            setScanning(false);
            navigate("/details", { state: { query: decodedText, source: "scan" } });
          });
        },
        () => {
          // ignore scan failures
        }
      );
      setScanning(true);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(
        "Could not access camera. Please allow camera permission and try again."
      );
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      stopScanner();
      navigate("/details", { state: { query: searchQuery.trim(), source: "search" } });
    }
  };

  return (
    <div className="app-shell flex flex-col min-h-screen bg-foreground relative">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4 z-10">
        <button
          onClick={() => {
            stopScanner();
            navigate("/");
          }}
          className="bg-card/20 backdrop-blur p-3 rounded-xl"
          aria-label="Go back"
        >
          <ArrowLeft size={28} className="text-card" />
        </button>
        <h1 className="text-senior-xl font-display font-bold text-card">
          Scan Medicine
        </h1>
        <button
          onClick={() => setFlashOn(!flashOn)}
          className="bg-card/20 backdrop-blur p-3 rounded-xl"
          aria-label="Toggle flashlight"
        >
          {flashOn ? (
            <Zap size={28} className="text-warning" />
          ) : (
            <FlashlightOff size={28} className="text-card" />
          )}
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 flex items-center justify-center relative px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 to-foreground/60" />
        <div
          id="scanner-container"
          ref={containerRef}
          className="relative z-10 w-full max-w-[320px] rounded-2xl overflow-hidden"
          style={{ minHeight: 220 }}
        />
        {cameraError && (
          <div className="absolute z-20 bg-card rounded-2xl p-6 mx-6 text-center">
            <p className="text-senior-base text-destructive font-bold mb-3">
              {cameraError}
            </p>
            <button
              onClick={startScanner}
              className="bg-primary text-primary-foreground rounded-xl px-6 py-3 font-display font-bold text-senior-base"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Search & Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 pb-32 z-10"
      >
        <div className="bg-card rounded-2xl p-5 shadow-lg space-y-4">
          <p className="text-senior-lg font-display font-bold text-foreground text-center">
            📦 Place barcode inside the box
          </p>
          <p className="text-senior-base text-muted-foreground text-center">
            Or search by medicine name below
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Type medicine name..."
              className="flex-1 bg-muted text-foreground rounded-xl px-4 py-3 text-senior-base font-body outline-none border-2 border-transparent focus:border-primary transition-colors"
            />
            <button
              onClick={handleSearch}
              className="bg-primary text-primary-foreground rounded-xl px-4 py-3 active:scale-95 transition-transform"
              aria-label="Search"
            >
              <Search size={24} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ScannerScreen;
