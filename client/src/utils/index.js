const Util = {
  parseOrderStatus: (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Chưa sẵn sàng";
      case "ready":
        return "Sẵn sàng";
      case "active":
        return "Đã lấy hàng";
      case "completed":
        return "Hoàn tất";
      case "overdue":
        return "Trễ hàng";
      case "lost":
        return "Mất";
      case "ready for pickup":
        return "Sẵn sàng";

      default:
        return status;
    }
  },
  getCardColor: (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { from: "#B0A4E8", to: "#463690" };
      case "ready":
        return { from: "#9DCCD4", to: "#4CA1AF" };
      case "active":
        return { from: "#6682B5", to: "#2C4A80" };
      case "completed":
        return { from: "#01C6FF", to: "#0181FF" };
      case "overdue":
        return { from: "#DC2430", to: "#8D3D84" };
      case "lost":
        return { from: "#ccc", to: "#333" };
      case "ready for pickup":
        return { from: "#9DCCD4", to: "#4CA1AF" };
      default:
        return { from: "#ccc", to: "#333" };
    }
  },
};

export default Util;
