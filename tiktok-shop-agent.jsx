import { useState, useRef } from "react";

const TONES = ["Urgente 🔥", "Engraçado 😂", "Inspirador ✨", "Educativo 📚", "Exclusivo 💎"];
const FORMATS = ["Vídeo curto (15s)", "Vídeo médio (30-60s)", "Live de vendas", "Duet/Stitch", "Carrossel"];

const systemPrompt = `Você é um especialista em criação de conteúdo para TikTok Shop com foco total em conversão e vendas. 
Seu trabalho é criar conteúdo viral e persuasivo para qualquer produto.

Ao receber um produto, você deve retornar OBRIGATORIAMENTE um JSON com a seguinte estrutura EXATA (sem texto fora do JSON, sem markdown, sem backticks):

{
  "hook": "Frase de abertura impactante (máx 10 palavras, para prender atenção nos primeiros 3 segundos)",
  "script": "Script completo do vídeo com [PAUSA], [MOSTRAR PRODUTO], [ZOOM], etc. Deve ter início impactante, desenvolvimento com benefícios e CTA forte",
  "caption": "Legenda completa para o post com emojis, quebras de linha estratégicas e CTA",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8", "hashtag9", "hashtag10", "hashtag11", "hashtag12", "hashtag13", "hashtag14", "hashtag15", "hashtag16", "hashtag17", "hashtag18", "hashtag19", "hashtag20"],
  "cta": "Call-to-action principal para o vídeo",
  "gatilhos": ["gatilho mental 1", "gatilho mental 2", "gatilho mental 3"],
  "dicas": ["dica de gravação 1", "dica de gravação 2", "dica de gravação 3"],
  "titulo_seo": "Título otimizado para busca no TikTok Shop"
}

Adapte o tom, linguagem e estratégia para o TikTok brasileiro. Use gírias quando apropriado. Foco em conversão. Responda APENAS com o JSON puro, sem nenhum texto antes ou depois.`;

const GEMINI_API_KEY = "AIzaSyD_B1EiGMHE99AqMx-ZgBvJWPmj2-7nVWI";

export default function TikTokAgent() {
  const [produto, setProduto] = useState("");
  const [tom, setTom] = useState("Urgente 🔥");
  const [formato, setFormato] = useState("Vídeo curto (15s)");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("script");
  const [copied, setCopied] = useState("");
  const textareaRef = useRef(null);

  const gerarConteudo = async () => {
    if (!produto.trim()) return;
    setLoading(true);
    setError("");
    setResultado(null);

    const userPrompt = `Produto: ${produto}
Tom desejado: ${tom}
Formato: ${formato}

Crie conteúdo completo para TikTok Shop. Responda APENAS com o JSON puro, sem texto adicional, sem markdown, sem backticks.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 1500 },
          }),
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResultado(parsed);
      setActiveTab("script");
    } catch (err) {
      setError("Erro ao gerar conteúdo. Verifique sua chave de API e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const CopyBtn = ({ text, id }) => (
    <button
      onClick={() => copyText(text, id)}
      style={{
        background: copied === id ? "#00f5a0" : "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        color: copied === id ? "#000" : "#aaa",
        borderRadius: 8,
        padding: "4px 12px",
        fontSize: 11,
        cursor: "pointer",
        transition: "all 0.2s",
        fontFamily: "inherit",
        fontWeight: 600,
        letterSpacing: 0.5,
      }}
    >
      {copied === id ? "✓ COPIADO" : "COPIAR"}
    </button>
  );

  const tabs = [
    { id: "script", label: "📝 Script" },
    { id: "caption", label: "✍️ Legenda" },
    { id: "hashtags", label: "#️⃣ Hashtags" },
    { id: "extras", label: "💡 Extras" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#fff",
      padding: "0",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "fixed", top: -200, left: -200, width: 500, height: 500,
        background: "radial-gradient(circle, rgba(255,0,80,0.12) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: -150, right: -100, width: 400, height: 400,
        background: "radial-gradient(circle, rgba(0,245,160,0.08) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px 80px" }}>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,0,80,0.12)", border: "1px solid rgba(255,0,80,0.3)",
            borderRadius: 100, padding: "6px 16px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 12, color: "#ff0050", fontWeight: 700, letterSpacing: 1.5 }}>
              ● LIVE · TIKTOK SHOP AI
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 6vw, 44px)",
            fontWeight: 900,
            lineHeight: 1.1,
            margin: "0 0 12px",
            background: "linear-gradient(135deg, #fff 0%, #ff0050 50%, #00f5a0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Agente de Conteúdo<br />para TikTok Shop
          </h1>
          <p style={{ color: "#666", fontSize: 15, margin: 0 }}>
            Cole seu produto → receba script, legenda e hashtags prontos
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: 28,
          marginBottom: 20,
          backdropFilter: "blur(10px)",
        }}>
          <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.2, color: "#666", display: "block", marginBottom: 10 }}>
            PRODUTO / SERVIÇO
          </label>
          <textarea
            ref={textareaRef}
            value={produto}
            onChange={e => setProduto(e.target.value)}
            placeholder="Ex: Creme facial hidratante com vitamina C e ácido hialurônico, 50ml, R$89,90. Indicado para pele seca..."
            style={{
              width: "100%", minHeight: 100, background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
              color: "#fff", fontSize: 14, padding: 16, resize: "vertical",
              outline: "none", fontFamily: "inherit", lineHeight: 1.6,
              boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(255,0,80,0.5)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#555", display: "block", marginBottom: 8 }}>TOM</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {TONES.map(t => (
                  <button key={t} onClick={() => setTom(t)} style={{
                    padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                    fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s",
                    background: tom === t ? "rgba(255,0,80,0.2)" : "rgba(255,255,255,0.05)",
                    border: tom === t ? "1px solid rgba(255,0,80,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    color: tom === t ? "#ff6b8a" : "#666",
                  }}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#555", display: "block", marginBottom: 8 }}>FORMATO</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {FORMATS.map(f => (
                  <button key={f} onClick={() => setFormato(f)} style={{
                    padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                    fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s",
                    background: formato === f ? "rgba(0,245,160,0.15)" : "rgba(255,255,255,0.05)",
                    border: formato === f ? "1px solid rgba(0,245,160,0.4)" : "1px solid rgba(255,255,255,0.08)",
                    color: formato === f ? "#00f5a0" : "#666",
                  }}>{f}</button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={gerarConteudo}
            disabled={loading || !produto.trim()}
            style={{
              width: "100%", marginTop: 20, padding: "16px",
              background: loading || !produto.trim()
                ? "rgba(255,255,255,0.05)"
                : "linear-gradient(135deg, #ff0050, #ff4d6d)",
              border: "none", borderRadius: 12, color: "#fff",
              fontSize: 15, fontWeight: 800, cursor: loading || !produto.trim() ? "not-allowed" : "pointer",
              fontFamily: "inherit", letterSpacing: 0.5, transition: "all 0.2s",
              boxShadow: loading || !produto.trim() ? "none" : "0 8px 32px rgba(255,0,80,0.3)",
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span style={{
                  width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff", borderRadius: "50%",
                  animation: "spin 0.8s linear infinite", display: "inline-block",
                }} />
                Criando conteúdo viral...
              </span>
            ) : "⚡ Gerar Conteúdo para TikTok Shop"}
          </button>

          {error && (
            <p style={{ color: "#ff6b8a", fontSize: 13, marginTop: 12, textAlign: "center" }}>{error}</p>
          )}
        </div>

        {resultado && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(255,0,80,0.15), rgba(255,0,80,0.05))",
              border: "1px solid rgba(255,0,80,0.25)",
              borderRadius: 16, padding: 20, marginBottom: 16,
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 11, color: "#ff0050", fontWeight: 700, letterSpacing: 1.2, marginBottom: 6 }}>🎣 HOOK (3 PRIMEIROS SEGUNDOS)</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>"{resultado.hook}"</div>
              </div>
              <CopyBtn text={resultado.hook} id="hook" />
            </div>

            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20, overflow: "hidden",
            }}>
              <div style={{
                display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(0,0,0,0.3)",
              }}>
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                    flex: 1, padding: "14px 8px", background: "none",
                    border: "none", borderBottom: activeTab === tab.id ? "2px solid #ff0050" : "2px solid transparent",
                    color: activeTab === tab.id ? "#fff" : "#555",
                    fontSize: "clamp(11px, 2vw, 13px)", fontWeight: 700, cursor: "pointer",
                    fontFamily: "inherit", transition: "all 0.15s",
                  }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ padding: 24 }}>
                {activeTab === "script" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: 1 }}>SCRIPT COMPLETO</span>
                      <CopyBtn text={resultado.script} id="script" />
                    </div>
                    <div style={{
                      background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 16,
                      fontSize: 14, lineHeight: 1.8, color: "#ccc", whiteSpace: "pre-wrap",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}>
                      {resultado.script}
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>🎯 CTA PRINCIPAL</div>
                      <div style={{
                        background: "rgba(0,245,160,0.08)", border: "1px solid rgba(0,245,160,0.2)",
                        borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#00f5a0", fontWeight: 700,
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}>
                        {resultado.cta}
                        <CopyBtn text={resultado.cta} id="cta" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "caption" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: 1 }}>LEGENDA DO POST</span>
                      <CopyBtn text={resultado.caption} id="caption" />
                    </div>
                    <div style={{
                      background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 16,
                      fontSize: 14, lineHeight: 1.9, color: "#ddd", whiteSpace: "pre-wrap",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}>
                      {resultado.caption}
                    </div>
                    {resultado.titulo_seo && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>🔍 TÍTULO SEO (TikTok Shop)</div>
                        <div style={{
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#aaa",
                          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                        }}>
                          <span>{resultado.titulo_seo}</span>
                          <CopyBtn text={resultado.titulo_seo} id="seo" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "hashtags" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <span style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: 1 }}>HASHTAGS ESTRATÉGICAS</span>
                      <CopyBtn text={resultado.hashtags.map(h => `#${h.replace(/^#/, "")}`).join(" ")} id="hashtags" />
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {resultado.hashtags.map((tag, i) => (
                        <span key={i} onClick={() => copyText(`#${tag.replace(/^#/, "")}`, `tag${i}`)} style={{
                          background: copied === `tag${i}` ? "rgba(0,245,160,0.2)" : "rgba(255,255,255,0.05)",
                          border: copied === `tag${i}` ? "1px solid rgba(0,245,160,0.4)" : "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 100, padding: "6px 14px", fontSize: 13,
                          color: copied === `tag${i}` ? "#00f5a0" : "#888",
                          cursor: "pointer", transition: "all 0.15s", fontWeight: 600,
                        }}>
                          #{tag.replace(/^#/, "")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "extras" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {resultado.gatilhos && (
                      <div>
                        <div style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>🧠 GATILHOS MENTAIS USADOS</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {resultado.gatilhos.map((g, i) => (
                            <div key={i} style={{
                              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                              borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#bbb",
                              display: "flex", alignItems: "center", gap: 10,
                            }}>
                              <span style={{ color: "#ff0050", fontWeight: 800, fontSize: 16 }}>✦</span>
                              {g}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {resultado.dicas && (
                      <div>
                        <div style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>🎬 DICAS DE GRAVAÇÃO</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {resultado.dicas.map((d, i) => (
                            <div key={i} style={{
                              background: "rgba(0,245,160,0.04)", border: "1px solid rgba(0,245,160,0.1)",
                              borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#aaa",
                              display: "flex", alignItems: "flex-start", gap: 10,
                            }}>
                              <span style={{ color: "#00f5a0", fontWeight: 800, marginTop: 1 }}>{i + 1}.</span>
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={gerarConteudo}
              style={{
                width: "100%", marginTop: 12, padding: "12px",
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, color: "#555", fontSize: 13,
                fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                letterSpacing: 0.5, transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.color = "#aaa"; }}
              onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "#555"; }}
            >
              🔄 Gerar nova versão
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        textarea::placeholder { color: #333; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>
    </div>
  );
}
