import { RootState } from '../../src/app/Store';

export const createMockRootState = (overrides: Partial<RootState> = {}): RootState => ({
    data: {data: [], average: 0,legend: null, x:[],z:[] ,...overrides.data},
    appState:{error:null , isLoading: false,...overrides.appState},
    dataSource: {datasets: [],currentDataset: null,...overrides.dataSource},
    raycast: {previousSelectedBarId: null, barTooltipPosition:null,...overrides.raycast},
    // viewOption: {isPlaneVisible: false,...overrides.viewOption},
    // filterOption: {isGreater:false,...overrides.filterOption},
    ...overrides,
  });