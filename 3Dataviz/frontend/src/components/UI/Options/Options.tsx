import Filter from "./FilterOptions/Filter";
import FilterModOptions from "./FilterOptions/FilterModOption";
import NFilter from "./FilterOptions/NFilter";
import AveragePlaneOption from "./ViewOptions/PlaneOptions/AveragePlaneOption";
import "./Options.css";
import ExpanderButton from "../ExpanderButton/ExpanderButton";
import { useSelector } from "react-redux";
import { selectorIsGreater } from "../../../features/FilterOption/FilterOptionSlice";
import { useAppDispatch } from "../../../app/Hooks";
import {
  filterByAverage,
  filterFirstN,
  reset,
} from "../../../features/Data/DataSlice";
import { setHit } from "../../../features/Raycast/RaycastHitSlice";

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
