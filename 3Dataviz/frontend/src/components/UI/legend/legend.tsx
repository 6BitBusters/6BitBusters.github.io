import { useSelector } from "react-redux";
import { selectorData } from "../../../features/data/dataSlice";
import "./legend.css";

function Legend() {
  const data = useSelector(selectorData);

  return (
    <>
      <div id="legend" data-testid="legend">
        <div>
          <div id="Xcolor" className="legendColor"></div>
          <p>{data.legend?.x}</p>
        </div>
        <div>
          <div id="Ycolor" className="legendColor"></div>
          <p>{data.legend?.y}</p>
        </div>
        <div>
          <div id="Zcolor" className="legendColor"></div>
          <p>{data.legend?.z}</p>
        </div>
      </div>
    </>
  );
}

export default Legend;
