import React, { useState, useEffect } from 'react';

const Terminal = () => {
  const steps = [
    { type: 'cmd', text: 'whoami', delayAfter: 600 },
    { type: 'out', text: 'bokengi · startup technologique & services', delayAfter: 800 },
    { type: 'cmd', text: 'services --list', delayAfter: 600 },
    { type: 'out', text: 'IT (Dev, Cyber, Cloud) · Group (Admin, Accompagnement)', delayAfter: 800 },
    { type: 'cmd', text: 'status --check', delayAfter: 600 },
    { type: 'out', text: '✓ opérationnel · prêt à propulser vos projets', delayAfter: 1000 }
  ];

  const [lines, setLines] = useState([]);
  const [currentCmd, setCurrentCmd] = useState('');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    if (currentStepIdx >= steps.length) return;

    const step = steps[currentStepIdx];
    
    if (step.type === 'cmd') {
      let charIdx = 0;
      setCurrentCmd('');

      const typeInterval = setInterval(() => {
        if (charIdx < step.text.length) {
          setCurrentCmd((prev) => prev + step.text[charIdx]);
          charIdx++;
        } else {
          clearInterval(typeInterval);
          setLines((prev) => [...prev, { type: 'cmd', text: step.text }]);
          setCurrentCmd('');
          
          setTimeout(() => {
            setCurrentStepIdx((prev) => prev + 1);
          }, step.delayAfter);
        }
      }, 40 + Math.random() * 40);

      return () => clearInterval(typeInterval);
    } else {
      setLines((prev) => [...prev, { type: 'out', text: step.text }]);
      
      const timeout = setTimeout(() => {
        setCurrentStepIdx((prev) => prev + 1);
      }, step.delayAfter);

      return () => clearTimeout(timeout);
    }
  }, [currentStepIdx]);

  return (
    <div className="hero-terminal" id="hero-terminal">
      <div className="terminal-header">// bokengi.sh — session active</div>
      <div className="terminal-content">
        {lines.map((line, idx) => (
          <div 
            key={idx} 
            className="terminal-line" 
            style={line.type === 'cmd' && idx > 0 ? { marginTop: '0.5rem' } : undefined}
          >
            {line.type === 'cmd' ? (
              <>
                <span className="terminal-prompt">$</span>
                <span className="terminal-cmd">{line.text}</span>
              </>
            ) : (
              <span className="terminal-out">{line.text}</span>
            )}
          </div>
        ))}
        
        {currentStepIdx < steps.length && steps[currentStepIdx].type === 'cmd' && (
          <div 
            className="terminal-line" 
            style={currentStepIdx > 0 ? { marginTop: '0.5rem' } : undefined}
          >
            <span className="terminal-prompt">$</span>
            <span className="terminal-cmd">{currentCmd}</span>
            <span className="terminal-cursor"></span>
          </div>
        )}

        {currentStepIdx >= steps.length && (
          <div className="terminal-line" style={{ marginTop: '0.5rem' }}>
            <span className="terminal-prompt">$</span>
            <span className="terminal-cursor"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
