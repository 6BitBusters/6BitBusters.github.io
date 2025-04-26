import { ChangeEvent } from "react";
import { useAppDispatch } from "../../../../app/hooks";
import { toggleIsGreater } from "../../../../features/filterOption/filterOptionSlice";

function FilterModOptions() {
  const dispatch = useAppDispatch();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedAlgorithm = e.target.id;
    if (selectedAlgorithm === "sup") {
      dispatch(toggleIsGreater(true));
    } else {
      dispatch(toggleIsGreater(false));
    }
  };

  return (
    <>
      <div className="filter" data-testid="filter-options">
        <p>Scegli l`algoritmo di filtraggio</p>
        <form className="choice-form">
          <div className="option-choise">
            <input
              type="radio"
              id="sup"
              data-testid="filter-sup"
              name="choise"
              onChange={onChange}
            />
            <label htmlFor="sup">Superiori (o uguali)</label>
          </div>
          <div className="option-choise">
            <input
              type="radio"
              id="inf"
              data-testid="filter-inf"
              name="choise"
              onChange={onChange}
              defaultChecked
            />
            <label htmlFor="inf">Inferiori (o uguali)</label>
          </div>
        </form>
      </div>
    </>
  );
}

export default FilterModOptions;
