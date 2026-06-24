import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../context/LanguageContext";
import { analyzeCropImage } from "../utils/gemini";

export default function CropDoctor() {
  const { t, lang } = useLang();
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rawResult, setRawResult] = useState("");
  const fileRef = useRef();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResult(null);
    setRawResult("");
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target.result);
      setImageData(ev.target.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageData) return;
    setLoading(true);
    setResult(null);

    const response = await analyzeCropImage(imageData, mimeType);
    setRawResult(response);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setResult(parsed);
      } else {
        setResult({ raw: response });
      }
    } catch {
      setResult({ raw: response });
    }

    setLoading(false);
  };

  const confidenceColor = (confidence) => {
    if (!confidence) return "text-text-secondary";
    const c = confidence.toLowerCase();
    if (c.includes("अधिक") || c.includes("high")) return "text-success";
    if (c.includes("मध्यम") || c.includes("medium")) return "text-warning";
    return "text-danger";
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-text-primary">
          {t("cropDoctorTitle")}
        </h1>
        <p className="text-text-secondary text-sm mt-0.5">
          {t("cropDoctorSub")}
        </p>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileRef.current.click()}
        className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
          image
            ? "border-primary/30"
            : "border-secondary/50 hover:border-primary/40"
        }`}
      >
        {image ? (
          <div className="relative">
            <img src={image} alt="Crop" className="w-full h-56 object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-end p-3">
              <span className="text-white text-xs bg-black/40 rounded-lg px-2 py-1">
                {lang === "hi" ? "📷 बदलने के लिए दबाएं" : "📷 Tap to change"}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">📷</span>
            </div>
            <div className="text-center">
              <p className="font-medium text-text-primary text-sm">
                {t("uploadImage")}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {lang === "hi"
                  ? "फसल, पत्ती या जड़ की फोटो खींचें"
                  : "Photo of crop, leaf or root"}
              </p>
            </div>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {/* Analyze button */}
      {image && !loading && (
        <button
          onClick={handleAnalyze}
          className="w-full btn-primary py-4 text-base"
        >
          🔍 {t("analyze")}
        </button>
      )}

      {/* Loading */}
      {loading && (
        <div className="card flex flex-col items-center py-10 gap-4">
          <div
            className="w-14 h-14 border-3 border-primary/20 border-t-primary rounded-full animate-spin"
            style={{ borderWidth: 3 }}
          />
          <div className="text-center">
            <p className="font-medium text-text-primary">{t("analyzing")}</p>
            <p className="text-sm text-text-secondary mt-1">
              {lang === "hi"
                ? "AI फोटो जांच रहा है..."
                : "AI is examining the photo..."}
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {result.error ? (
              <div className="card">
                <h3 className="font-heading font-semibold text-red-500 mb-2">
                  ⚠️ Invalid Image
                </h3>

                <p>{result.message}</p>
              </div>
            ) : (
              <>
                {/* Disease card */}
                <div className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-text-secondary font-medium uppercase tracking-wide">
                        {t("disease")}
                      </p>
                      <p className="font-heading font-bold text-xl text-text-primary mt-1">
                        {result.disease}
                      </p>
                    </div>
                    {result.confidence && (
                      <div className="text-right">
                        <p className="text-xs text-text-secondary">विश्वास</p>
                        <p
                          className={`font-bold text-sm ${confidenceColor(result.confidence)}`}
                        >
                          {result.confidence}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Symptoms */}
                {result.symptoms?.length > 0 && (
                  <div className="card">
                    <h3 className="font-heading font-semibold text-sm text-text-primary mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-warning/10 rounded-lg flex items-center justify-center">
                        ⚠️
                      </span>
                      {t("symptoms")}
                    </h3>
                    <ul className="space-y-2">
                      {result.symptoms.map((s, i) => (
                        <li
                          key={i}
                          className="text-sm text-text-secondary flex items-start gap-2"
                        >
                          <span className="text-warning mt-0.5">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                {result.actions?.length > 0 && (
                  <div className="card border-l-4 border-l-primary">
                    <h3 className="font-heading font-semibold text-sm text-text-primary mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                        ✅
                      </span>
                      {t("treatment")}
                    </h3>
                    <ol className="space-y-2">
                      {result.actions.map((a, i) => (
                        <li
                          key={i}
                          className="text-sm text-text-secondary flex items-start gap-2"
                        >
                          <span className="font-bold text-primary flex-shrink-0">
                            {i + 1}.
                          </span>{" "}
                          {a}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Prevention */}
                {result.prevention?.length > 0 && (
                  <div className="card">
                    <h3 className="font-heading font-semibold text-sm text-text-primary mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-success/10 rounded-lg flex items-center justify-center">
                        🛡️
                      </span>
                      {t("prevention")}
                    </h3>
                    <ul className="space-y-2">
                      {result.prevention.map((p, i) => (
                        <li
                          key={i}
                          className="text-sm text-text-secondary flex items-start gap-2"
                        >
                          <span className="text-success mt-0.5">✓</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            <button
              onClick={() => {
                setResult(null);
                setImage(null);
                setImageData(null);
              }}
              className="w-full btn-secondary py-3 text-sm"
            >
              {lang === "hi" ? "↩ नई फोटो जांचें" : "↩ Check New Photo"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
