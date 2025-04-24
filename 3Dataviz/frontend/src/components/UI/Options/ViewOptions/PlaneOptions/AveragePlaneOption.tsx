import { ChangeEvent } from "react";
import { useAppDispatch } from "../../../../../app/hooks";
import { toggleAveragePlane } from "../../../../../features/viewOption/viewOptionSlice";

function AveragePlaneOption() {
  const dispatch = useAppDispatch();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedAlgorithm = e.target.id;
    if (selectedAlgorithm === "plane-active") {
      dispatch(toggleAveragePlane(true));
    } else {
      dispatch(toggleAveragePlane(false));
    }
  };
  return (
    <>
      <div className="plane-view" data-testid="plane-view">
        <p>Visualizza piano medio globale</p>
        <form className="choice-form">
          <div className="option-choise">
            <input
              type="radio"
              id="plane-active"
              data-testid="plane-active"
              name="choise"
              onChange={onChange}
            />
            <label htmlFor="plane-active">Abilitato</label>
          </div>
          <div className="option-choise">
            <input
              type="radio"
              id="plane-inactive"
              data-testid="plane-inactive"
              name="choise"
              onChange={onChange}
              defaultChecked
            />
            <label htmlFor="plane-inactive">Disabilitato</label>
          </div>
        </form>
      </div>
    </>
  );
}

export default AveragePlaneOption;
