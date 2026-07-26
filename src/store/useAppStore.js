import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  settings: {
    deviceType: '',
    deviceName: '',
    adminPin: '1234',
  },
  people: [],
  logs: [],
  loading: false,
  currentRecognition: null,
  isFirstLaunch: true,

  setSettings: (settings) => set({ settings }),
  setPeople: (people) => set({ people }),
  setLogs: (logs) => set({ logs }),
  setLoading: (loading) => set({ loading }),
  setCurrentRecognition: (recognition) => set({ currentRecognition: recognition }),
  setFirstLaunch: (isFirstLaunch) => set({ isFirstLaunch }),
}));

export default useAppStore;
