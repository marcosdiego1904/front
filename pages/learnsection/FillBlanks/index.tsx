import { useState, useEffect } from "react";

interface Props {
  verse: string;
  onNext: () => void;
  prevStep: () => void;
  testMode?: boolean;
}

// Función avanzada para normalizar texto para comparación
const normalizeForComparison = (text: string) => {
  if (!text) return "";
  
  // 1. Convertir a minúsculas
  // 2. Eliminar puntuación excepto apóstrofes
  // 3. Eliminar espacios extras
  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, "")
    .trim();
};

// Función para ocultar palabras con manejo de casos especiales
const hideWords = (
  verse: string,
  interval = 4
): { hiddenVerse: string[]; answers: string[]; answerIndices: number[] } => {
  if (!verse || verse.trim() === "") {
    return { hiddenVerse: [], answers: [], answerIndices: [] };
  }

  // Dividir por espacios y filtrar cadenas vacías
  const words = verse.split(/\s+/).filter(word => word.length > 0);
  
  // Ajustar intervalo para versículos cortos
  const effectiveInterval = words.length < interval * 2 ? Math.max(2, Math.floor(words.length / 2)) : interval;
  
  const answerIndices: number[] = [];
  const answers: string[] = [];
  let currentAnswerIndex = 0;

  const hiddenVerse = words.map((word, i) => {
    if (i % effectiveInterval === 0) {
      answers.push(word);
      answerIndices.push(currentAnswerIndex);
      currentAnswerIndex++;
      return "_____";
    } else {
      answerIndices.push(-1);
      return word;
    }
  });

  return { hiddenVerse, answers, answerIndices };
};

const FillInTheBlanksSection = ({ verse, onNext, prevStep, testMode = false }: Props) => {
  const { hiddenVerse, answers, answerIndices } = hideWords(verse);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(answers.length).fill(""));
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState<boolean>(testMode);

  // Para pruebas: Auto-complete todas las respuestas correctamente
  const autoFill = () => {
    setUserAnswers([...answers]);
  };

  // Calcular información de depuración
  useEffect(() => {
    if (showDebug) {
      const debug = {
        originalVerse: verse,
        wordsInVerse: verse.split(/\s+/).filter(w => w.length > 0),
        hiddenWords: answers,
        normalizedAnswers: answers.map(a => normalizeForComparison(a)),
        userAnswers: userAnswers,
        normalizedUserAnswers: userAnswers.map(a => normalizeForComparison(a)),
        isCorrectByIndex: answers.map((a, i) => 
          normalizeForComparison(a) === normalizeForComparison(userAnswers[i] || "")
        )
      };
      setDebugInfo(debug);
    }
  }, [verse, answers, userAnswers, showDebug]);

  const handleChange = (answerIndex: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[answerIndex] = value;
    setUserAnswers(newAnswers);
  };

  const isCorrect = (answerIndex: number) => {
    if (answerIndex < 0 || answerIndex >= answers.length) return false;
    
    const expectedNormalized = normalizeForComparison(answers[answerIndex]);
    const userNormalized = normalizeForComparison(userAnswers[answerIndex] || "");
    
    return userNormalized === expectedNormalized;
  };

  const allCorrect = userAnswers.every((_, answerIndex) => isCorrect(answerIndex));

  return (
    <main className="main-container2">
      <div className="intro-section">
        <h1 className="title">Fill in the Blanks</h1>
        <p className="instruction">Complete the missing words from the verse.</p>

        {/* Panel de depuración (visible en modo de prueba) */}
        {showDebug && (
          <div className="debug-panel">
            <h3>Debug Information</h3>
            <button 
              onClick={autoFill} 
              className="debug-button"
            >
              Auto-Fill Answers
            </button>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}

        {/* Visualización del versículo con espacios en blanco */}
        <p className="verse">
          {hiddenVerse.map((word, verseIndex) => {
            if (word === "_____") {
              const answerIndex = answerIndices[verseIndex];
              return (
                <span key={verseIndex}>
                  <input
                    type="text"
                    className={`blank-input ${
                      userAnswers[answerIndex]
                        ? isCorrect(answerIndex)
                          ? "correct"
                          : "incorrect"
                        : ""
                    }`}
                    value={userAnswers[answerIndex]}
                    onChange={(e) => handleChange(answerIndex, e.target.value)}
                    placeholder="_____"
                    data-expected={showDebug ? answers[answerIndex] : undefined}
                  />
                  {showDebug && !isCorrect(answerIndex) && (
                    <span className="debug-expected">
                      (Esperado: "{answers[answerIndex]}")
                    </span>
                  )}
                </span>
              );
            } else {
              return <span key={verseIndex}> {word} </span>;
            }
          })}
        </p>

        {/* Mensaje de retroalimentación */}
        {!allCorrect && (
          <p className="hint">
            <strong>Sugerencia:</strong> Las palabras ocultas pueden incluir puntuación y mayúsculas, 
            pero tu respuesta será aceptada independientemente de estos detalles.
          </p>
        )}

        {/* Botones */}
        <div className="button-group">
          <button className="button back-button" onClick={prevStep}>← Atrás</button>
          
          {/* Botón para alternar el modo de depuración */}
          <button 
            className="button debug-toggle" 
            onClick={() => setShowDebug(!showDebug)}
            style={{ background: "#6c757d" }}
          >
            {showDebug ? "Ocultar Debug" : "Mostrar Debug"}
          </button>
          
          <button 
            className="button continue-button" 
            onClick={onNext} 
            disabled={!allCorrect}
          >
            Continuar
          </button>
        </div>
      </div>
    </main>
  );
};

// Componente de prueba
export const TestFillBlanks = () => {
  const [testVerse, setTestVerse] = useState<string>(
    `"For I know the plans I have for you," says the Lord. "They are plans for good and not for disaster, to give you a future and a hope."`
  );
  
  const [testResults, setTestResults] = useState<any[]>([]);
  
  // Versículos de prueba predefinidos
  const testVerses = [
    `"For I know the plans I have for you," says the Lord. "They are plans for good and not for disaster, to give you a future and a hope."`,
    "The Lord is my shepherd; I shall not want.",
    "This is a short verse.",
    "1 2 3 4 5 6 7 8 9 10",
    "¡Versículo con símbolos! ¿Funciona? #Hashtag @Menciones"
  ];
  
  const runTests = () => {
    const results = testVerses.map(verse => {
      const { hiddenVerse, answers } = hideWords(verse);
      return {
        verse,
        hiddenVerse,
        answers,
        wordsCount: verse.split(/\s+/).filter(w => w.length > 0).length
      };
    });
    
    setTestResults(results);
  };
  
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Test de Componente Fill in the Blanks</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <h2>Probar un versículo específico</h2>
        <textarea 
          value={testVerse}
          onChange={(e) => setTestVerse(e.target.value)}
          style={{ width: "100%", height: "100px", marginBottom: "10px" }}
        />
        <FillInTheBlanksSection 
          verse={testVerse} 
          onNext={() => alert("¡Completado correctamente!")}
          prevStep={() => {}}
          testMode={true}
        />
      </div>
      
      <div style={{ marginTop: "40px" }}>
        <h2>Ejecutar pruebas con versículos predefinidos</h2>
        <button 
          onClick={runTests}
          style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "5px" }}
        >
          Ejecutar Pruebas
        </button>
        
        {testResults.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>Resultados:</h3>
            {testResults.map((result, i) => (
              <div key={i} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd" }}>
                <p><strong>Versículo original:</strong> {result.verse}</p>
                <p><strong>Cantidad de palabras:</strong> {result.wordsCount}</p>
                <p><strong>Palabras ocultas:</strong> {result.answers.join(", ")}</p>
                <p><strong>Versículo con espacios:</strong> {result.hiddenVerse.join(" ")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FillInTheBlanksSection;