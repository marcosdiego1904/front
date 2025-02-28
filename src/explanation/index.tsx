import { useState } from "react";
import './style.css';

const ScientificExplanation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="explanation-container">
      <button className="toggle-explanation" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide Explanation ⬆" : "Why does this method work? ⬇"}
      </button>

      {isOpen && (
        <div className="explanation-content">
          <h3>🚀 The Science Behind This Method</h3>
          <p>
            Memory experts and neuroscientists agree: the best way to retain information is to engage multiple cognitive processes.
            This method is based on three scientifically proven learning techniques:
          </p>

          <h4>🧠 1. Active Recall</h4>
          <p>
            Studies show that **retrieving information from memory strengthens neural pathways**.
            Instead of passively reading, this system forces you to recall verses, improving retention.
          </p>

          <h4>🔁 2. Spaced Repetition</h4>
          <p>
            The **forgetting curve** (Ebbinghaus, 1885) proves that revisiting information at spaced intervals 
            helps **move knowledge from short-term to long-term memory**.
          </p>

          <h4>🔍 3. Chunking & Progressive Learning</h4>
          <p>
            Research shows that breaking down large amounts of text into **smaller, meaningful chunks** 
            (like splitting a verse into fragments) **improves recall and understanding**.
          </p>

          <p><strong>✨ This is why our approach helps you memorize faster and more effectively!</strong></p>
        </div>
      )}
    </div>
  );
};

export default ScientificExplanation;
