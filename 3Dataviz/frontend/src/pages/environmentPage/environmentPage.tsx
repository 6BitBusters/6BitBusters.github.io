import { useRef } from "react";
import "./environmentPage.css";
import CustomCanvas from "../../components/customcCanvas/customCanvas";
import UI from "../../components/UI/ui";
import { useSelector } from "react-redux";
import { selectorCurrentDataset } from "../../features/dataSource/dataSourceSlice";
import { selectorAppState } from "../../features/appStatus/appSlice";
import LoaderView from "../../components/UI/loaderView/loaderView";

function EnvironmentPage() {
  const datasetName = useSelector(selectorCurrentDataset)?.name || "";
  const isLoading = useSelector(selectorAppState).isLoading;
  const customCanvasRef = useRef<{ resetCamera: () => void } | null>(null);

  const handleResetButtonClick = () => {
    if (customCanvasRef.current && customCanvasRef.current.resetCamera) {
      customCanvasRef.current.resetCamera();
    }
  };

  return (
    <>
      {isLoading ? (
        <LoaderView />
      ) : (
        <>
          <CustomCanvas ref={customCanvasRef} />
          <UI datasetName={datasetName} resetCamera={handleResetButtonClick} />
        </>
      )}
    </>
  );
}

export default EnvironmentPage;
