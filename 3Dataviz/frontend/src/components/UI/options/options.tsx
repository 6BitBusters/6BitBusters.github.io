import Filter from "./filterOptions/filter";
import FilterModOptions from "./filterOptions/filterModOption";
import NFilter from "./filterOptions/nFilter";
import AveragePlaneOption from "./viewOptions/planeOptions/averagePlaneOption";
import "./options.css";
import ExpanderButton from "../expanderButton/expanderButton";
import { useSelector } from "react-redux";
import { selectorIsGreater } from "../../../features/filterOption/filterOptionSlice";
import { useAppDispatch } from "../../../app/hooks";
import {
  filterByAverage,
  filterFirstN,
  reset,
} from "../../../features/data/dataSlice";
import { setHit } from "../../../features/raycast/raycastHitSlice";

function Options() {
  const isGreater = useSelector(selectorIsGreater);
  const dispatch = useAppDispatch();

  const onFilterAverage = () => {
    dispatch(filterByAverage(isGreater));
    dispatch(setHit(null));
  };
  const onFilterN = (n: number) => {
    dispatch(filterFirstN({ value: n, isGreater: isGreater }));
    dispatch(setHit(null));
  };

  const onReset = () => {
    dispatch(reset());
    dispatch(setHit(null));
  };

  return (
    <>
      <div id="option-container" data-testid="option-container">
        <ExpanderButton
          id="view-options-expander"
          target="#option-container"
          fromToX={[0, -470]}
        />
        <div id="option-wrap">
          <div id="filter-container">
            <Filter
              title="Filtra per valor medio globale"
              description="Esegui un filtraggio rispetto al valore medio globale"
              onClick={onFilterAverage}
            />
            <NFilter onClick={onFilterN} />
            <FilterModOptions />
            <button
              id="filter-btn"
              data-testid="reset-filter"
              title="resetta filtri"
              onClick={onReset}>
              Resetta filtri
            </button>
          </div>

          <div id="viewoption-container">
            <AveragePlaneOption />
          </div>
        </div>
      </div>
    </>
  );
}

export default Options;
