import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EnvironmentPage from "../../../src/pages/environmentPage/environmentPage";
import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { AppDispatch, RootState } from "../../../src/app/store";
import { createMockRootState } from "../../utils/stateMockCreator";
import gsap from "gsap";
import * as THREE from "three";
import CustomCanvas from "../../../src/components/customCanvas/customCanvas";
import UI from "../../../src/components/UI/ui";
import { createBrowserRouter, RouterProvider } from "react-router";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);
const ROUTER_test = createBrowserRouter([
  {
    path: "/",
    Component: EnvironmentPage,
  },
]);

describe("UI", () => {
  describe("CameraResetButton", () => {
    it("Il bottone di reset camera deve essere visibile al caricamento del dataset", async () => {
      render(
        <Provider
          store={mockStore(
            createMockRootState({
              dataSource: {
                datasets: [],
                currentDataset: {
                  id: 1,
                  description: "",
                  name: "",
                  size: [1, 1],
                },
              },
            }),
          )}>
          <RouterProvider router={ROUTER_test} />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("resetCamera"));
      expect(screen.getByTestId("resetCamera")).toBeInTheDocument();
    });

    it("Il bottone di reset camera deve eseguire un`azione di tween sulla telecamra e riportarla alla posizione iniziale", async () => {
      const mockCustomCanvasRef = React.createRef<{
        resetCamera: () => void;
      }>();
      const mockControls = {
        current: {
          object: {
            position: new THREE.Vector3(),
            zoom: 1,
            updateProjectionMatrix: vi.fn(),
          },
          target: new THREE.Vector3(),
          update: vi.fn(),
          set: vi.fn(),
        },
      };
      vi.spyOn(React, "useRef").mockReturnValueOnce(mockControls);
      const initialCameraPosition: [number, number, number] = [25, 25, 25];
      const initialTarget: [number, number, number] = [0, 0, 0];
      const initialZoom = 1;

      render(
        <Provider store={mockStore(createMockRootState())}>
          <CustomCanvas
            ref={mockCustomCanvasRef}
            initialCameraPosition={initialCameraPosition}
            initialTarget={initialTarget}
            initialZoom={initialZoom}
          />
          <UI
            datasetName=""
            resetCamera={() => mockCustomCanvasRef.current?.resetCamera()}
          />
        </Provider>,
      );
      const gsapToSpy = vi.spyOn(gsap, "to");
      await waitFor(() => expect(mockCustomCanvasRef.current).not.toBeNull());
      const resetBtn = screen.getByTestId("resetCamera");
      await fireEvent.click(resetBtn);
      expect(gsapToSpy).toHaveBeenCalledTimes(3);
      expect(gsapToSpy).toHaveBeenNthCalledWith(
        1,
        mockControls.current.object.position,
        {
          x: initialCameraPosition[0],
          y: initialCameraPosition[1],
          z: initialCameraPosition[2],
          duration: 1,
          ease: "power2.out",
          delay: 0,
          overwrite: false,
          onUpdate: expect.any(Function),
        },
      );
      expect(gsapToSpy).toHaveBeenNthCalledWith(
        2,
        mockControls.current.target,
        {
          x: initialTarget[0],
          y: initialTarget[1],
          z: initialTarget[2],
          duration: 1,
          ease: "power2.out",
          delay: 0,
          onUpdate: expect.any(Function),
          overwrite: false,
        },
      );
      expect(gsapToSpy).toHaveBeenNthCalledWith(
        3,
        mockControls.current.object,
        {
          zoom: initialZoom,
          duration: 1,
          delay: 0,
          ease: "power2.out",
          onUpdate: expect.any(Function),
          overwrite: false,
        },
      );
    });
  });

  describe("CurrentDatasetLabel", () => {
    it("quando il dataset e` caricato visualizza nella pagina d`abimente il nome del dataset corrente", async () => {
      render(
        <Provider
          store={mockStore(
            createMockRootState({
              dataSource: {
                datasets: [],
                currentDataset: {
                  id: 1,
                  description: "",
                  name: "Weather",
                  size: [1, 1],
                },
              },
            }),
          )}>
          <RouterProvider router={ROUTER_test} />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("current-dataset"));
      const label = screen.getByText("Weather");
      expect(label).toBeInTheDocument();
    });
  });
});
