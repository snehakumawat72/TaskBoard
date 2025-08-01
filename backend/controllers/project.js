import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import NotificationService from "../libs/notification.service.js";

const createProject = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members } =
      req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const tagArray = tags ? tags.split(",") : [];

    const newProject = await Project.create({
      title,
      description,
      status,
      startDate,
      dueDate,
      tags: tagArray,
      workspace: workspaceId,
      members,
      createdBy: req.user._id,
    });

    workspace.projects.push(newProject._id);
    await workspace.save();

    // Create notifications for project creation
    try {
      // Notify all workspace members about new project
      const workspaceMembers = workspace.members.map(member => member.user);
      for (const memberId of workspaceMembers) {
        // Include the creator this time for testing
        await NotificationService.createProjectCreatedNotification(
          newProject._id,
          memberId,
          req.user._id,
          req.user.name || req.user.email,
          title,
          workspace.name
        );
      }
    } catch (notificationError) {
      console.log('Failed to create project notifications:', notificationError);
    }

    return res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate("members.user");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const tasks = await Task.find({
      project: projectId,
      isArchived: false,
    })
      .populate("assignees", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      project,
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const workspace = await Workspace.findById(project.workspace);
    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    // Store old values for comparison
    const oldTitle = project.title;
    const oldStatus = project.status;
    const oldDescription = project.description;

    // Update project fields
    if (title) project.title = title;
    if (description) project.description = description;
    if (status) project.status = status;
    if (startDate) project.startDate = startDate;
    if (dueDate) project.dueDate = dueDate;
    if (tags) project.tags = tags.split(",");
    if (members) project.members = members;

    await project.save();

    // Create notifications for project updates
    try {
      let updateType = '';
      if (oldTitle !== project.title) updateType += 'title, ';
      if (oldStatus !== project.status) updateType += 'status, ';
      if (oldDescription !== project.description) updateType += 'description, ';
      updateType = updateType.slice(0, -2); // Remove last comma

      if (updateType) {
        // Notify all workspace members about project update
        const workspaceMembers = workspace.members.map(member => member.user);
        for (const memberId of workspaceMembers) {
          // Include the updater this time for testing
          await NotificationService.createProjectUpdatedNotification(
            projectId,
            memberId,
            req.user._id,
            req.user.name || req.user.email,
            project.title,
            `updated ${updateType}`
          );
        }
      }
    } catch (notificationError) {
      console.log('Failed to create project update notifications:', notificationError);
    }

    return res.status(200).json({
      message: "Project updated successfully",
      project
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const workspace = await Workspace.findById(project.workspace);
    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    // Remove project from workspace
    workspace.projects = workspace.projects.filter(
      (id) => id.toString() !== projectId.toString()
    );
    await workspace.save();

    // Create notifications for project deletion
    try {
      // Notify all workspace members about project deletion
      const workspaceMembers = workspace.members.map(member => member.user);
      for (const memberId of workspaceMembers) {
        // Include the deleter this time for testing
        await NotificationService.createProjectDeletedNotification(
          memberId,
          req.user._id,
          req.user.name || req.user.email,
          project.title,
          workspace.name
        );
      }
    } catch (notificationError) {
      console.log('Failed to create project deletion notifications:', notificationError);
    }

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    return res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { createProject, getProjectDetails, getProjectTasks, updateProject, deleteProject };