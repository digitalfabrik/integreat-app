import React from 'react';
import builConfigs from 'build-configs';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit and save to reload. {builConfigs}
        </p>
      </header>
    </div>
  );
}

export default App;
