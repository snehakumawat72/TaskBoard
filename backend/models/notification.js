import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "workspace_invite",
        "task_assigned",
        "task_completed", 
        "project_updated",
        "member_joined",
        "deadline_reminder",
        "comment_added",
        "login_welcome",
        "email_notification",
        "dashboard_update",
        "task_created",
        "task_updated", 
        "task_deleted",
        "project_created",
        "project_deleted",
        // Additional types used by the service
        "task",
        "project", 
        "workspace",
        "member_invite",
        "email",
        "calendar",
        "dashboard"  // Adding missing dashboard type
      ],
      required: true,
    },
    title: String,
    message: String,
    isRead: { type: Boolean, default: false },
    senderName: String,
    senderAvatar: String,
    workspaceName: String,
    projectName: String,
    taskName: String,
    inviteId: String,
    workspaceId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
