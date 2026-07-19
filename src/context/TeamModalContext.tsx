"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { TeamDetailModal } from "@/components/team/TeamDetailModal";

type TeamModalContextValue = {
  selectedTeam: string | null;
  openTeam: (team: string) => void;
  closeTeam: () => void;
};

const TeamModalContext = createContext<TeamModalContextValue | null>(null);

export function TeamModalProvider({ children }: { children: ReactNode }) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const openTeam = useCallback((team: string) => {
    setSelectedTeam(team);
  }, []);

  const closeTeam = useCallback(() => {
    setSelectedTeam(null);
  }, []);

  const value = useMemo(
    () => ({ selectedTeam, openTeam, closeTeam }),
    [selectedTeam, openTeam, closeTeam]
  );

  return (
    <TeamModalContext.Provider value={value}>
      {children}
      <TeamDetailModal
        team={selectedTeam}
        open={Boolean(selectedTeam)}
        onOpenChange={(open) => {
          if (!open) closeTeam();
        }}
      />
    </TeamModalContext.Provider>
  );
}

export function useTeamModal() {
  const context = useContext(TeamModalContext);
  if (!context) {
    throw new Error("useTeamModal must be used within TeamModalProvider");
  }
  return context;
}
