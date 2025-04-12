import "./apiSelector.css";
import Select, { SingleValue } from "react-select";
import { useState } from "react";
import DatasetItem from "../datasetItem/datasetItem";
import { redirect } from "react-router";
import { useNavigate } from "react-router";

type APIItem = {
  id: number;
  name: string;
  size: string;
  description: string;
};

type OptionType = {
  value: number;
  label: string;
  data: APIItem;
};

const items: APIItem[] = [
  {
    id: 1,
    name: "API A",
    size: "2000",
    description: "Dati del meteo della città di Roma a Marzo 2025",
  },
  {
    id: 2,
    name: "API B",
    size: "5000",
    description: "Dati sui voli aerei degli ultimi 5 anni",
  },
  {
    id: 3,
    name: "API C",
    size: "10000",
    description: "Dati sui voli aerei degli ultimi 10 anni",
  },
];

const options: OptionType[] = items.map((item) => ({
  value: item.id,
  label: item.name,
  data: item,
}));

function ApiSelector() {
  const [selected, setSelected] = useState<SingleValue<OptionType>>(null);
  let navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selected) {
      console.log("Hai selezionato:", selected.data);
      // Qui puoi gestire la logica per passare alla pagina successiva impostando il dataset selezionato nello stato
      navigate("/environment");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Select<OptionType>
          options={options}
          value={selected}
          onChange={(option) => setSelected(option)}
          formatOptionLabel={(option) => (
            <DatasetItem
              name={option.data.name}
              size={option.data.size}
              description={option.data.description}
            />
          )}
          placeholder="Scegli una API..."
        />

        <input id="submitButton" type="submit" value="Avanti" />
      </form>
    </>
  );
}

export default ApiSelector;
