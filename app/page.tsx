"use client";

import { useState } from "react";

export default function Home() {
  const [headline, setHeadline] = useState("");
  const [result, setResult] = useState<{
    label: string;
    confidence: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const exampleHeadlines = [
    "Carney will meet with Ukraine’s allies in Paris as peace talks intensify",
    "FIFA awards Donald Trump Golden Boot before 2026 World Cup even begins",
    "Flooding of the Egyptian Artifacts Library in the Louvre... What's the truth?",
    "Maduro arrives in New York to face federal charges",
  ];

  const getVerdictText = (score: number) => {
    if (score < 0.25) return "Very likely real";
    if (score < 0.45) return "Likely real";
    if (score < 0.55) return "Uncertain";
    if (score < 0.75) return "Likely fake";
    return "Very likely fake";
  };

  const analyzeHeadline = async () => {
    if (!headline) return;

    setLoading(true);
    setResult(null);
    setShowResult(false);

    try {
      const res = await fetch(
        `https://fake-news-headline-detector-api.onrender.com/predict?headline=${encodeURIComponent(
          headline
        )}`,
        { method: "POST" }
      );

      const data = await res.json();

      setTimeout(() => {
        setResult(data);
        setShowResult(true);
        setLoading(false);
      }, 600);
    } catch {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-xl w-full p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Fake News Headline Detector
        </h1>

        <textarea
          className="w-full p-3 rounded-lg bg-gray-900 border border-white/10 focus:outline-none focus:border-blue-500/50 transition"
          rows={3}
          placeholder="Paste a news headline here..."
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
        />

        {/* Analyze Button */}
        <button
          onClick={analyzeHeadline}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition shadow-sm hover:shadow-md"
        >
          {loading ? "Analyzing..." : "Analyze Headline"}
        </button>

        {/* Spinner */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Dimmed backdrop + Result */}
        {result && (
          <div className="relative">
            <div className="absolute inset-0 bg-black/40 rounded-xl blur-sm" />

            <div
              className={`relative p-5 rounded-xl border border-white/10 bg-black/60 backdrop-blur-sm
                shadow-[0_0_25px_rgba(0,0,0,0.6)]
                transition-all duration-700 ${
                  showResult
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
            >
              {/* Gradient Bar */}
              <div className="mb-4">
                <div className="relative h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500">
                  <div
                    className="absolute w-4 h-4 bg-white rounded-full border border-gray-800 transition-all duration-700"
                    style={{
                      left: `${Math.min(
                        Math.max(result.confidence * 100, 2),
                        98
                      )}%`,
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Real</span>
                  <span>Fake</span>
                </div>
              </div>

              {/* Prediction */}
              <p className="text-xl font-semibold text-center">
                Prediction:{" "}
                <span
                  className={
                    result.confidence < 0.45
                      ? "text-green-400"
                      : result.confidence > 0.55
                      ? "text-red-400"
                      : "text-gray-400"
                  }
                >
                  {getVerdictText(result.confidence)}
                </span>
              </p>

              <p className="text-sm text-gray-400 mt-1 text-center">
                Fake Score: {result.confidence.toFixed(3)} <br />
                <span className="text-xs">(0 = Real, 1 = Fake)</span>
              </p>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-400">
          <p className="mb-1">Try an example:</p>
          <div className="flex flex-col gap-2">
            {exampleHeadlines.map((text, idx) => (
              <button
                key={idx}
                onClick={() => setHeadline(text)}
                className="px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-gray-900 transition text-left"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
