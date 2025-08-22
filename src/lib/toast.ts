// Simple toast implementation for notifications
export const toast = {
  success: (message: string) => {
    console.log("✅ SUCCESS:", message);
    // In a real app, this would trigger a toast notification
  },
  error: (message: string) => {
    console.error("❌ ERROR:", message);
    // In a real app, this would trigger an error toast
  },
  info: (message: string) => {
    console.info("ℹ️ INFO:", message);
    // In a real app, this would trigger an info toast
  }
};