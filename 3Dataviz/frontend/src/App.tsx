import { useRef } from "react";
import "./App.css";
import CustomCanvas from "./components/CustomCanvas/CustomCanvas";

function App() {
  const customCanvasRef = useRef<{ resetCamera: () => void } | null>(null);

  // const handleResetButtonClick = () => {
  //   if (customCanvasRef.current && customCanvasRef.current.resetCamera) {
  //     customCanvasRef.current.resetCamera();
  //   }
  // };

  return (
    <>
      <CustomCanvas ref={customCanvasRef} />
    </>
  );
}

export default App;
