import "./Filter.css";
import { filterProps } from "./props/filterProps";

function Filter({ title, description, onClick, children }: filterProps) {
  return (
    <>
      <div className="filter" data-testid="average-filter">
        <p>{title}</p>
        {children}
        <button
          id="filter-btn"
          data-testid="do-filter"
          title={description}
          onClick={onClick}>
          Filtra
        </button>
      </div>
    </>
  );
}

export default Filter;
