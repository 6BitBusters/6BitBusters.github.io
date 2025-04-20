import { beforeEach, describe, expect, it, vi } from "vitest";
import { BarsProps } from "../../../src/components/BarChart/Bars/types/BarsProps";
import { mockStore } from "../../setupTests";
import Bars from "../../../src/components/BarChart/Bars/Bars";
import ReactThreeTestRenderer from '@react-three/test-renderer'
import React from 'react';
import { ToolTipProps } from "../../../src/components/BarChart/Bars/types/TooltipProps";
import Tooltip from "../../../src/components/BarChart/Bars/Tooltip";

vi.mock('react-redux', () => ({
    ...vi.importActual('react-redux'),
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  }));

describe("ToolTip", ()=> {
        beforeEach(() => {
              vi.clearAllMocks()
            })
    it('Renderizza un tooltip senza crashare',async () => {
      const mockProp: ToolTipProps = {
          data: mockStore.getState().data.data[0],
          legend: mockStore.getState().data.legend,
          Xlabel: mockStore.getState().data.x[1],
          Zlabel: mockStore.getState().data.z[1]
      }
      const renderer = await ReactThreeTestRenderer.create(<Tooltip {...mockProp}/>)
      expect(renderer).toBeTruthy()
  });
  })