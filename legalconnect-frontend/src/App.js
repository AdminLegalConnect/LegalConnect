import React from 'react';
import { Routes, Route } from 'react-router-dom';  // Importer Routes et Route

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} /> {/* Route principale */}
        <Route path="/about" element={<About />} /> {/* Exemple d'autre route */}
        {/* Ajouter d'autres routes si nécessaire */}
      </Routes>
    </div>
  );
}

const Home = () => <h1>Welcome to the Home Page</h1>;
const About = () => <h1>About Us</h1>;

export default App;
