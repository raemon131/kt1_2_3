import { useState } from "react";
import LisaaSana from "./components/LisaaSana";
import HaeSana from "./components/HaeSana";
import "./App.css";

function App() {
  // Reititystä ei ole vielä käytössä, joten näytettävä sivu pidetään tilassa
  const [sivu, setSivu] = useState("");

  return (
    <div className="app">
      <h1>Sanakirja</h1>

      <nav>
        <button onClick={() => setSivu("lisaa")}>Lisää sana</button>
        <button onClick={() => setSivu("hae")}>Hae sana</button>
      </nav>

      <main>
        {sivu === "lisaa" && <LisaaSana />}
        {sivu === "hae" && <HaeSana />}
      </main>
    </div>
  );
}

export default App;
