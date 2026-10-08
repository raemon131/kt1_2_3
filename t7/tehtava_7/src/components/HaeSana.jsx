import { useState } from "react";
import { API_URL } from "../api";

function HaeSana() {
  const [hakuehto, setHakuehto] = useState("");
  const [tulos, setTulos] = useState(null);
  const [virhe, setVirhe] = useState("");

  // Haku: GET-pyyntö, suomenkielinen sana menee osoitteen loppuun
  const hae = async (e) => {
    e.preventDefault();
    setTulos(null);
    setVirhe("");

    const haettava = hakuehto.trim();
    if (haettava === "") {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(haettava)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const vastaus = await response.json();
        setTulos(vastaus);
      } else if (response.status === 404) {
        setVirhe(`Sanaa "${haettava}" ei löytynyt sanakirjasta.`);
      } else {
        setVirhe("Haku epäonnistui.");
      }
    } catch (error) {
      console.log(error);
      setVirhe("Palvelimeen ei saatu yhteyttä. Onko REST API käynnissä?");
    }
  };

  return (
    <div>
      <h2>Hae sana</h2>
      <form onSubmit={hae}>
        <label>
          Suomenkielinen sana
          <input
            type="text"
            value={hakuehto}
            onChange={(e) => setHakuehto(e.target.value)}
            required
          />
        </label>
        <button type="submit">Hae</button>
      </form>

      {tulos && (
        <p className="viesti" role="status">
          {tulos.fin}: <strong>{tulos.eng}</strong>
        </p>
      )}
      {virhe && (
        <p className="viesti virhe" role="status">
          {virhe}
        </p>
      )}
    </div>
  );
}

export default HaeSana;
