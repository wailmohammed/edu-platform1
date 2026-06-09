import { describe, it, expect } from "vitest";
import { battleRouter } from "./battle.router";
import { teamsRouter } from "./teams.router";

const mockUser = { id: 1, name: "Test User", email: "test@test.com", role: "user" as const, subscriptionTier: "free" as const };
const mockUser2 = { id: 2, name: "Test User 2", email: "test2@test.com", role: "user" as const, subscriptionTier: "free" as const };

describe("Battle Router", () => {
  describe("createRoom", () => {
    it("should create a battle room", async () => {
      const caller = battleRouter.createCaller({ user: mockUser } as any);
      const result = await caller.createRoom({ problemId: 1 });
      expect(result.roomId).toMatch(/^battle-/);
      expect(result.status).toBe("waiting");
    });
  });

  describe("joinRoom", () => {
    it("should allow second player to join", async () => {
      const caller1 = battleRouter.createCaller({ user: mockUser } as any);
      const caller2 = battleRouter.createCaller({ user: mockUser2 } as any);
      
      const room1 = await caller1.createRoom({ problemId: 1 });
      const room2 = await caller2.joinRoom({ roomId: room1.roomId });
      
      expect(room2.status).toBe("active");
    });

    it("should error on non-existent room", async () => {
      const caller = battleRouter.createCaller({ user: mockUser } as any);
      await expect(caller.joinRoom({ roomId: "invalid" })).rejects.toThrow("Room not found");
    });
  });

  describe("submitSolution", () => {
    it("should submit solution and mark winner", async () => {
      const caller = battleRouter.createCaller({ user: mockUser } as any);
      const room = await caller.createRoom({ problemId: 1 });
      
      const result = await caller.submitSolution({
        roomId: room.roomId,
        code: "print('hello')",
      });
      
      expect(result.success).toBe(true);
    });
  });
});

describe("Teams Router", () => {
  describe("createTeam", () => {
    it("should create a team", async () => {
      const caller = teamsRouter.createCaller({ user: mockUser } as any);
      const result = await caller.createTeam({ name: "Test Team", description: "A test" });
      expect(result.success).toBe(true);
      expect(result.teamId).toBeGreaterThan(0);
    });
  });

  describe("joinTeam", () => {
    it("should add user to team", async () => {
      const caller = teamsRouter.createCaller({ user: mockUser } as any);
      const createResult = await caller.createTeam({ name: "Team A" });
      
      const joinCaller = teamsRouter.createCaller({ user: mockUser2 } as any);
      const result = await joinCaller.joinTeam({ teamId: createResult.teamId });
      
      expect(result.success).toBe(true);
    });
  });

  describe("listUserTeams", () => {
    it("should list user teams", async () => {
      const caller = teamsRouter.createCaller({ user: mockUser } as any);
      await caller.createTeam({ name: "Team B" });
      
      const result = await caller.listUserTeams();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});