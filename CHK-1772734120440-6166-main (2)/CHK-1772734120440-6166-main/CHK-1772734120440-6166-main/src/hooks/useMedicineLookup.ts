import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MedicineData {
  name: string;
  brand: string;
  type: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  warnings: string[];
  food: string[];
}

export function useMedicineLookup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MedicineData | null>(null);

  const lookup = async (query: string, language = "en") => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        "medicine-lookup",
        { body: { query, language } }
      );
      if (fnError) throw fnError;
      if (result?.error) throw new Error(result.error);
      setData(result as MedicineData);
      return result as MedicineData;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to lookup medicine";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { lookup, loading, error, data, setData };
}
