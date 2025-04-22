import { useRef } from "react";
import "./App.css";
import CustomCanvas from "./components/CustomCanvas/CustomCanvas";
import UI from "./components/UI/UI";
function App() {
  const customCanvasRef = useRef<{ resetCamera: () => void } | null>(null);

  const handleResetButtonClick = () => {
    if (customCanvasRef.current && customCanvasRef.current.resetCamera) {
      customCanvasRef.current.resetCamera();
    }
  };

  return (
    <>
      <CustomCanvas ref={customCanvasRef} />
      <UI resetCamera={handleResetButtonClick} />
    </>
  );
}

export default App;
