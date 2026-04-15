// Simple reusable helper functions

export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "in-progress":
      return "In Progress";
    case "done":
      return "Completed";
    default:
      return "Unknown";
  }
};