import { DatasetInfo } from "../../features/DataSource/types/DatasetInfo";
import "./datasetItem.css";

function DatasetItem({ id, name, size, description }: DatasetInfo) {
  return (
    <div className="datasetItemContainer" data-testid="datasetItem">
      <div>
        <strong>
          <span>{id}</span> - <span>{name}</span>
        </strong>
      </div>
      <div>
        <span>
          {size[0]}x{size[1]}
        </span>
      </div>
      <div id="datasetItemDesc">{description}</div>
    </div>
  );
}

export default DatasetItem;
