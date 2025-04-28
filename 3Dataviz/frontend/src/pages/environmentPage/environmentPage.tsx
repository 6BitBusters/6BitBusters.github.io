import { useEffect, useRef } from "react";
import "./environmentPage.css";
import CustomCanvas from "../../components/customCanvas/customCanvas";
import UI from "../../components/UI/ui";
import { useSelector } from "react-redux";
import { selectorCurrentDataset } from "../../features/dataSource/dataSourceSlice";
import { selectorAppState } from "../../features/appStatus/appSlice";
import LoaderView from "../../components/UI/loaderView/loaderView";
import { useAppDispatch } from "../../app/hooks";
import { requestData } from "../../features/data/dataSlice";
import { useNavigate } from "react-router";

function EnvironmentPage() {
  const dataset = useSelector(selectorCurrentDataset);
  const appState = useSelector(selectorAppState);
  const customCanvasRef = useRef<{ resetCamera: () => void } | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (dataset == null || dataset.id == null) {
      void navigate("/error");
    } else {
      void dispatch(requestData(dataset?.id));
    }
  }, [dataset, dataset?.id, dispatch, navigate]);

  useEffect(() => {
    if (appState.error != null) {
      void navigate("/error");
    }
  }, [appState.error, navigate]);

  const handleResetButtonClick = () => {
    if (customCanvasRef.current && customCanvasRef.current.resetCamera) {
      customCanvasRef.current.resetCamera();
    }
  };

  return (
    <>
      {appState.isLoading ? (
        <LoaderView />
      ) : (
        <>
          <CustomCanvas ref={customCanvasRef} />
          <UI
            datasetName={dataset?.name || ""}
            resetCamera={handleResetButtonClick}
          />
        </>
      )}
    </>
  );
}

export default EnvironmentPage;
