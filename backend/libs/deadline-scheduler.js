import Task from "../models/task.js";
import NotificationService from "./notification.service.js";

class DeadlineScheduler {
  constructor() {
    this.intervalId = null;
  }

  // Start the deadline checker (runs every hour)
  start() {
    console.log("🕐 Deadline scheduler started");
    this.intervalId = setInterval(() => {
      this.checkDeadlines();
    }, 60 * 60 * 1000); // Check every hour

    // Also check immediately on start
    this.checkDeadlines();
  }

  // Stop the scheduler
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("🕐 Deadline scheduler stopped");
    }
  }

  // Check for tasks with approaching deadlines
  async checkDeadlines() {
    try {
      console.log("🔍 Checking for approaching deadlines...");
      
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const dayAfterTomorrow = new Date(now.getTime() + 48 * 60 * 60 * 1000);

      // Find tasks with deadlines in the next 24-48 hours that are not completed
      const upcomingTasks = await Task.find({
        dueDate: {
          $gte: tomorrow,
          $lte: dayAfterTomorrow
        },
        status: { $nin: ['completed', 'done'] },
        $or: [
          { lastDeadlineReminder: { $exists: false } },
          { lastDeadlineReminder: { $lt: new Date(now.getTime() - 23 * 60 * 60 * 1000) } } // Last reminder was more than 23 hours ago
        ]
      }).populate('assignees');

      console.log(`📅 Found ${upcomingTasks.length} tasks with approaching deadlines`);

      for (const task of upcomingTasks) {
        // Send deadline reminder to assignees
        if (task.assignees && task.assignees.length > 0) {
          for (const assignee of task.assignees) {
            await NotificationService.createDeadlineReminderNotification(
              task._id,
              assignee._id,
              task.title,
              task.dueDate
            );
          }
        }

        // Update task to track when we sent the reminder
        task.lastDeadlineReminder = now;
        await task.save();
      }

    } catch (error) {
      console.error("❌ Error checking deadlines:", error);
    }
  }
}

// Create singleton instance
const deadlineScheduler = new DeadlineScheduler();

export default deadlineScheduler;
