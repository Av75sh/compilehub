import './CodeEditor.css';
import { useState } from 'react';
import { compileCode } from '../../utils/api';

const CodeEditor = ({ selectedLanguage, user, setShowAuthModal }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleRun = async () => {
    if (!user) {
      alert('Please login to run code!');
      setShowAuthModal(true);
      return;
    }

    if (!code.trim()) {
      setOutput('Error: Please write some code before running.');
      return;
    }

    setOutput('Running code...');

    const result = await compileCode(code, selectedLanguage);

    if (result.success) {
      const output = result.output || 'Code executed successfully (no output)';
      const executionTime = result.executionTime || '';
      setOutput(`${output}\n\n--- Execution completed in ${executionTime} ---`);
    } else {
      setOutput(`Error: ${result.error || 'Unknown error occurred'}`);
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput('');
  };

  return (
    <main className="editor-container">
      <div className="editor-buttons">
        <button
          onClick={handleRun}
          className={`run-button ${!user ? 'disabled' : ''}`}
        >
          Run {!user && '(Login Required)'}
        </button>
        <button
          onClick={handleClear}
          className="clear-button"
        >
          Clear
        </button>
      </div>

      <div className="editor-output-wrapper">
        <div className="code-editor">
          <h4 className="section-heading">Code Editor ({selectedLanguage})</h4>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="editor-textarea"
            placeholder="Write your code here..."
            spellCheck={false}
          />
        </div>

        <div className="code-output">
          <h4 className="section-heading">Output</h4>
          <div className="output-display">
            {output || (user ? 'Click "Run" to execute your code...' : 'Please login to run code...')}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CodeEditor;
