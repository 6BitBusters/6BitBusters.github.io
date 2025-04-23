import "./apiSelector.css";
import Select, { SingleValue } from "react-select";
import { useEffect, useState } from "react";
import DatasetItem from "../datasetItem/datasetItem";
import { useNavigate } from "react-router";
import { DatasetInfo } from "../../features/DataSource/types/DatasetInfo";
import { useSelector } from "react-redux";
import {
  requestDatasets,
  selectorDatasets,
  trySetCurrentDataset,
} from "../../features/DataSource/DataSourceSlice";
import { useAppDispatch } from "../../app/Hooks";

type OptionType = {
  value: number;
  label: string;
  data: DatasetInfo;
};

// CODICE DI TEST
const FakeItems: DatasetInfo[] = [
  {
    id: 1,
    name: "API A",
    size: [1000, 2000],
    description: "Dati del meteo della città di Roma a Marzo 2025",
  },
  {
    id: 2,
    name: "API B",
    size: [1000, 2000],
    description: "Dati sui voli aerei degli ultimi 5 anni",
  },
  {
    id: 3,
    name: "API C",
    size: [1000, 2000],
    description: "Dati sui voli aerei degli ultimi 10 anni",
  },
];

function ApiSelector() {
  let navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux get datasets
  //const items: DatasetInfo[] = useSelector(selectorDatasets);
  useEffect(() => {
    dispatch(requestDatasets());
  }, [dispatch]);
  const items: DatasetInfo[] = useSelector(selectorDatasets);

  // CODICE DI TEST
  // const options: OptionType[] = FakeItems.map((item) => ({
  //   value: item.id,
  //   label: item.name,
  //   data: item,
  // }));

  // CODICE VERO
  const options: OptionType[] = FakeItems.map((item) => ({
    value: item.id,
    label: item.name,
    data: item,
  }));

  // Custom select
  const [selected, setSelected] = useState<SingleValue<OptionType>>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selected) {
      dispatch(trySetCurrentDataset(selected.data.id));
      //dispatch(setCurrentDataset(selected.data)); //PER IL TESTING - ALTRMENTI SENZA BACKEND NELLO STATO NON CI SONO DATASET
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
              id={option.data.id}
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
