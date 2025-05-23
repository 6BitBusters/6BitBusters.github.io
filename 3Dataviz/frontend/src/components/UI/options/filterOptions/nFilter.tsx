import { ChangeEvent, useState } from "react";
import Filter from "./filter";
import { NFilterProps } from "./props/nFilterProps";

function NFilter({ onClick }: NFilterProps) {
  const [inputValue, setInputValue] = useState(0);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value, 10);
    if (!isNaN(n) && n >= 0) {
      setInputValue(parseInt(e.target.value));
    } else {
      setInputValue(0);
    }
  };

  return (
    <>
      <div data-testid="N-filter">
        <Filter
          title="Filtra i primi n valori"
          description="Esegui un filtraggio dei top e bottom N"
          onClick={() => onClick(inputValue)}>
          <input
            type="number"
            data-testid="N-filter-value"
            min={0}
            onChange={onInputChange}
            value={inputValue}
          />
        </Filter>
      </div>
    </>
  );
}

export default NFilter;
