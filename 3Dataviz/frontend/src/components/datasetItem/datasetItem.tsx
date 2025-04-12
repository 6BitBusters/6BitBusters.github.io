import "./datasetItem.css";

type DatasetItemProps = {
  name: string;
  size: string;
  description: string;
};

function DatasetItem({ name, size, description }: DatasetItemProps) {
  return (
    <div className="datasetItemContainer">
      <div>
        <strong>{name}</strong> — <span>{size}</span>
      </div>
      <div id="datasetItemDesc">{description}</div>
    </div>
  );
}

export default DatasetItem;
