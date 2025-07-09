import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserState {
  username: string | null;
  jwt: string | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (username: string, jwt: string) => void;
  clearUser: () => void;
  updateUsername: (username: string) => void;
  updateJWT: (jwt: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      username: null,
      jwt: null,
      isAuthenticated: false,

      setUser: (username: string, jwt: string) => {
        set({
          username,
          jwt,
          isAuthenticated: true,
        });
      },

      clearUser: () => {
        set({
          username: null,
          jwt: null,
          isAuthenticated: false,
        });
      },

      updateUsername: (username: string) => {
        set({ username });
      },

      updateJWT: (jwt: string) => {
        set({ jwt });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
