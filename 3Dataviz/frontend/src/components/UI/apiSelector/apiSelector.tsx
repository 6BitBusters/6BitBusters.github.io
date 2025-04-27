import "./apiSelector.css";
import Select, { SingleValue } from "react-select";
import { useState } from "react";
import DatasetItem from "../datasetItem/datasetItem";
import { useNavigate } from "react-router";
import { DatasetInfo } from "../../../features/dataSource/types/datasetInfo";
import { useSelector } from "react-redux";
import {
  selectorDatasets,
  trySetCurrentDataset,
} from "../../../features/dataSource/dataSourceSlice";
import { useAppDispatch } from "../../../app/hooks";

type OptionType = {
  value: number;
  label: string;
  data: DatasetInfo;
};

function ApiSelector() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const items: DatasetInfo[] = useSelector(selectorDatasets);

  const options: OptionType[] = items.map((item) => ({
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
      void navigate("/environment");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} data-testid="form">
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
          name="dataset"
          inputId="dataset"
          data-testid="select"
        />

        <input id="submitButton" type="submit" value="Avanti" />
      </form>
    </>
  );
}

export default ApiSelector;
