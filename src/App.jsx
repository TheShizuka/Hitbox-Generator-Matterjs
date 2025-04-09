// src/App.jsx
import React from 'react';
import HitboxCanvas from './components/HitboxCanvas';

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <HitboxCanvas />
    </div>
  );
}

export default App;