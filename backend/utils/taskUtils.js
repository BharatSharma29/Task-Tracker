// Utility functions for handling task-related operations

export const createTaskObject = (title, description, status, userEmail) => {
  return {
    id: Date.now().toString(), // simple unique id
    title: title,
    description: description,
    status: status || "pending",
    user_email: userEmail,
  };
};

export const formatTaskForSQS = (task) => {
  return JSON.stringify({
    event: "TASK_CREATED",
    title: task.title,
    user: task.user_email,
  });
};

export const formatTaskForS3 = (task) => {
  return `Task Created:
Title: ${task.title}
Description: ${task.description}
User: ${task.user_email}
`;
};