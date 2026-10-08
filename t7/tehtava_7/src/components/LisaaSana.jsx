import { useState } from "react";
import { API_URL } from "../api";

function LisaaSana() {
  const [fin, setFin] = useState("");
  const [eng, setEng] = useState("");
  const [viesti, setViesti] = useState("");
  const [onVirhe, setOnVirhe] = useState(false);

  // Lomakkeen lähetys: POST-pyyntö REST APIin
  const lisaa = async (e) => {
    e.preventDefault();

    const uusiSana = { fin: fin.trim(), eng: eng.trim() };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uusiSana),
      });

      if (response.ok) {
        setOnVirhe(false);
        setViesti(`Sana "${uusiSana.fin}" lisättiin sanakirjaan.`);
        setFin("");
        setEng("");
      } else if (response.status === 409) {
        // sana on jo sanakirjassa
        setOnVirhe(true);
        setViesti(`Sana "${uusiSana.fin}" on jo sanakirjassa.`);
      } else if (response.status === 400) {
        setOnVirhe(true);
        setViesti("Täytä molemmat kentät.");
      } else {
        setOnVirhe(true);
        setViesti("Lisäys epäonnistui.");
      }
    } catch (error) {
      console.log(error);
      setOnVirhe(true);
      setViesti("Palvelimeen ei saatu yhteyttä. Onko REST API käynnissä?");
    }
  };

  return (
    <div>
      <h2>Lisää sana</h2>
      <form onSubmit={lisaa}>
        <label>
          Suomeksi
          <input
            type="text"
            value={fin}
            onChange={(e) => setFin(e.target.value)}
            required
          />
        </label>
        <label>
          Englanniksi
          <input
            type="text"
            value={eng}
            onChange={(e) => setEng(e.target.value)}
            required
          />
        </label>
        <button type="submit">Lisää</button>
      </form>

      {viesti && (
        <p className={onVirhe ? "viesti virhe" : "viesti"} role="status">
          {viesti}
        </p>
      )}
    </div>
  );
}

export default LisaaSana;
