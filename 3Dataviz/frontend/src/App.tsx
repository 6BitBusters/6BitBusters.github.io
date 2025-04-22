import { useRef } from "react";
import "./App.css";
import CustomCanvas from "./components/CustomCanvas/CustomCanvas";
import UI from "./components/UI/UI";
import { useSelector } from "react-redux";
import { selectorCurrentDataset } from "./features/DataSource/DataSourceSlice";
import { selectorAppState } from "./features/AppStatus/AppSlice";
function App() {
  const datasetName = useSelector(selectorCurrentDataset)?.name || ""
  const isLoading = useSelector(selectorAppState).isLoading
  const customCanvasRef = useRef<{ resetCamera: () => void } | null>(null);

  const handleResetButtonClick = () => {
    if (customCanvasRef.current && customCanvasRef.current.resetCamera) {
      customCanvasRef.current.resetCamera();
    }
  };

  return (
    <>{
      isLoading ?
        <p id="loading" data-testid="loading">caricamento del dataset...</p>
      : ( 
      <>
        <CustomCanvas ref={customCanvasRef} />
        <UI datasetName={datasetName} resetCamera={handleResetButtonClick} /> 
      </>)
    }
    </>
  );
}

export default App;
