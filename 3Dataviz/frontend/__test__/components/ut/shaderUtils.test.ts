import { describe, test, expect, vi, beforeEach } from "vitest";
import { LoadShader } from "../../../src/components/barChart/bars/utils/shaderUtils";

// Mock di THREE.FileLoader
const mockLoad = vi.fn();
vi.mock("three", () => ({
  ...vi.importActual("three"),
  FileLoader: vi.fn(() => ({
    load: mockLoad,
  })),
}));

describe("ShaderUtils", () => {
  describe("LoadShader", () => {
    beforeEach(() => {
      mockLoad.mockReset(); // Resetta la funzione mock prima di ogni test
    });

    test("Verifica che, quando il caricamento dello shader ha successo, la Promise venga risolta con il contenuto dello shader.", async () => {
      const mockShaderContent =
        "uniform float time; void main() { gl_FragColor = vec4(1.0); }";
      mockLoad.mockImplementation((path, onLoad) => {
        onLoad(mockShaderContent);
      });

      const shader = await LoadShader("success/path.glsl");
      expect(shader).toBe(mockShaderContent);
      expect(mockLoad).toHaveBeenCalledWith(
        "success/path.glsl",
        expect.any(Function),
        undefined,
        expect.any(Function),
      );
    });

    test("Verifica che, quando il caricamento dello shader fallisce, la Promise venga rifiutata (reject) con un errore.", async () => {
      const mockError = new Error("Failed to load shader");
      mockLoad.mockImplementation((path, onLoad, onProgress, onError) => {
        onError(mockError);
      });

      await expect(LoadShader("failure/path.glsl")).rejects.toBe(mockError);
      expect(mockLoad).toHaveBeenCalledWith(
        "failure/path.glsl",
        expect.any(Function),
        undefined,
        expect.any(Function),
      );
    });

    test("Verifica che, quando il contenuto del file caricato è HTML, la Promise venga rifiutata (reject) con errore 'File is not a shader'.", async () => {
      const mockHtmlContent =
        "<!doctype html><html><body>Not a shader</body></html>";
      mockLoad.mockImplementation((path, onLoad) => {
        onLoad(mockHtmlContent);
      });

      await expect(LoadShader("html/path.glsl")).rejects.toBe(
        "File is not a shader",
      );
      expect(mockLoad).toHaveBeenCalledWith(
        "html/path.glsl",
        expect.any(Function),
        undefined,
        expect.any(Function),
      );
    });
  });
});
