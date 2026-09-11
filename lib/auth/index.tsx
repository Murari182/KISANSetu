"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, Farm } from "@/types";

export interface SessionContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  activeFarm: Farm | null;
  farms: Farm[];
  setActiveFarm: (farm: Farm) => void;
  setRole: (role: UserRole) => void;
  login: (phone: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  addFarm: (farm: Omit<Farm, "id" | "createdAt">) => Farm;
  deleteFarm: (id: string) => void;
  isOnboarded: boolean;
  setOnboarded: (status: boolean) => void;
}

const DEFAULT_FARMS: Farm[] = [
  {
    id: "farm-1",
    name: "Lucknow Shivalik Farm",
    location: "Malihabad, Lucknow",
    district: "Lucknow",
    state: "Uttar Pradesh",
    pinCode: "226102",
    acres: 4.5,
    landType: "irrigated",
    irrigation: "drip",
    soilType: "alluvial",
    coordinates: { lat: 26.9214, lng: 80.7126 },
    healthScore: 88,
    activeCropsCount: 2,
    documentsCount: 3,
    createdAt: "2024-03-15",
  },
  {
    id: "farm-2",
    name: "Barabanki River Basin Farm",
    location: "Fatehpur, Barabanki",
    district: "Barabanki",
    state: "Uttar Pradesh",
    pinCode: "225305",
    acres: 2.2,
    landType: "wetland",
    irrigation: "borewell",
    soilType: "clayey",
    coordinates: { lat: 27.0211, lng: 81.221 },
    healthScore: 81,
    activeCropsCount: 1,
    documentsCount: 2,
    createdAt: "2024-06-20",
  },
];

const DEFAULT_USERS: Record<UserRole, User> = {
  farmer: {
    id: "usr-farmer-101",
    name: "Rameshwar Prasad Patel",
    phone: "+91 98765 43210",
    email: "rameshwar.patel@kisansetu.in",
    role: "farmer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    language: "en",
    voiceEnabled: true,
    state: "Uttar Pradesh",
    district: "Lucknow",
  },
  expert: {
    id: "usr-expert-201",
    name: "Dr. Ananya Swaminathan",
    phone: "+91 98123 45678",
    email: "dr.ananya@icar-gov.in",
    role: "expert",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    language: "en",
    voiceEnabled: false,
    state: "Delhi NCR",
    district: "New Delhi",
  },
  admin: {
    id: "usr-admin-301",
    name: "Vikramaditya Sharma",
    phone: "+91 99999 11111",
    email: "admin.vikram@kisansetu.in",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    language: "en",
    voiceEnabled: false,
    state: "National Headquarters",
    district: "New Delhi",
  },
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("farmer");
  const [user, setUser] = useState<User | null>(DEFAULT_USERS.farmer);
  const [farms, setFarms] = useState<Farm[]>(DEFAULT_FARMS);
  const [activeFarm, setActiveFarmState] = useState<Farm | null>(DEFAULT_FARMS[0]);
  const [isOnboarded, setOnboardedState] = useState<boolean>(true);

  // Load session from storage if present
  useEffect(() => {
    const savedRole = localStorage.getItem("kisan_role") as UserRole | null;
    if (savedRole && (savedRole === "farmer" || savedRole === "expert" || savedRole === "admin")) {
      setRoleState(savedRole);
      setUser(DEFAULT_USERS[savedRole]);
    }

    const savedFarms = localStorage.getItem("kisan_farms");
    if (savedFarms) {
      try {
        const parsed = JSON.parse(savedFarms);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFarms(parsed);
          setActiveFarmState(parsed[0]);
        }
      } catch (e) {
        console.error("Failed to parse saved farms", e);
      }
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setUser(DEFAULT_USERS[newRole]);
    localStorage.setItem("kisan_role", newRole);
  };

  const setActiveFarm = (farm: Farm) => {
    setActiveFarmState(farm);
  };

  const addFarm = (newFarmData: Omit<Farm, "id" | "createdAt">): Farm => {
    const newFarm: Farm = {
      ...newFarmData,
      id: `farm-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [...farms, newFarm];
    setFarms(updated);
    setActiveFarmState(newFarm);
    localStorage.setItem("kisan_farms", JSON.stringify(updated));
    return newFarm;
  };

  const deleteFarm = (id: string) => {
    const filtered = farms.filter((f) => f.id !== id);
    setFarms(filtered);
    if (activeFarm?.id === id) {
      setActiveFarmState(filtered.length > 0 ? filtered[0] : null);
    }
    localStorage.setItem("kisan_farms", JSON.stringify(filtered));
  };

  const login = async (phone: string, roleToLogin: UserRole = "farmer"): Promise<boolean> => {
    const userToSet = { ...DEFAULT_USERS[roleToLogin], phone };
    setUser(userToSet);
    setRoleState(roleToLogin);
    localStorage.setItem("kisan_role", roleToLogin);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
    }
  };

  const setOnboarded = (status: boolean) => {
    setOnboardedState(status);
    localStorage.setItem("kisan_onboarded", status ? "true" : "false");
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        activeFarm,
        farms,
        setActiveFarm,
        setRole,
        login,
        logout,
        updateUser,
        addFarm,
        deleteFarm,
        isOnboarded,
        setOnboarded,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
