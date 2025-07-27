import { Request, Response } from "express";
import { checkinsService } from "./checkins.service";
import { usersService } from "../users/users.service"; // Assuming you have this
import { AuthRequest } from "../../middleware/auth.middleware";

const getAll = async (req: Request, res: Response) => {
  try {
    const checkins = await checkinsService.findAll();
    return res.json({
      success: true,
      data: checkins,
    });
  } catch (error) {
    console.error("Error fetching checkins:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch checkins",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const checkin = await checkinsService.findById(id);
    if (!checkin) {
      return res.status(404).json({
        success: false,
        message: "Check-in not found",
      });
    }

    return res.json({
      success: true,
      data: checkin,
    });
  } catch (error) {
    console.error("Error fetching checkin:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch checkin",
    });
  }
};

const getByUser = async (req: AuthRequest, res: Response) => {
  try {
    // Use authenticated user's ID instead of params for security
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const checkins = await checkinsService.findByUser(userId);
    return res.json({
      success: true,
      data: checkins,
    });
  } catch (error) {
    console.error("Error getting user check-ins:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user check-ins",
    });
  }
};

const getUserStreak = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await usersService.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      data: {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastCheckin: user.lastCheckin,
        totalPoints: user.totalPoints,
      },
    });
  } catch (error) {
    console.error("Error getting user streak:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user streak",
    });
  }
};

const getTodayStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCheckin = await checkinsService.findByUserAndDate(userId, today);

    return res.json({
      success: true,
      data: {
        hasCheckedInToday: !!todayCheckin,
        checkinData: todayCheckin || null,
      },
    });
  } catch (error) {
    console.error("Error checking today's status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check today's status",
    });
  }
};

const create = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    // Use atomic transaction for checkin creation
    const result = await checkinsService.createCheckinWithPointsUpdate(userId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
        data: result.data,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Check-in successful!",
      data: result.data,
    });
  } catch (error) {
    console.error("Error creating checkin:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create check-in",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const success = await checkinsService.delete(id);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Check-in not found or already deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Check-in deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting check-in:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete check-in",
    });
  }
};

// Helper functions
// const calculateStreak = (lastCheckin: Date | null, currentStreak: number) => {
//   if (!lastCheckin) {
//     return { newStreak: 1, streakBroken: false };
//   }

//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);
//   yesterday.setHours(0, 0, 0, 0);

//   const lastCheckinDate = new Date(lastCheckin);
//   lastCheckinDate.setHours(0, 0, 0, 0);

//   // If last checkin was yesterday, continue streak
//   if (lastCheckinDate.getTime() === yesterday.getTime()) {
//     return { newStreak: currentStreak + 1, streakBroken: false };
//   }

//   // If last checkin was not yesterday, streak is broken
//   return { newStreak: 1, streakBroken: true };
// };

// const calculatePoints = (streakDay: number): number => {
//   const basePoints = 10;

//   // Streak bonuses
//   if (streakDay >= 30) return basePoints * 3; // 30x bonus
//   if (streakDay >= 14) return basePoints * 2; // 2x bonus
//   if (streakDay >= 7) return Math.floor(basePoints * 1.5); // 1.5x bonus

//   return basePoints;
// };

// const calculateBonusMultiplier = (streakDay: number): number => {
//   if (streakDay >= 30) return 3;
//   if (streakDay >= 14) return 2;
//   if (streakDay >= 7) return 1.5;
//   return 1;
// };

export {
  getAll,
  getById,
  remove,
  create,
  getByUser,
  getUserStreak,
  getTodayStatus,
};
