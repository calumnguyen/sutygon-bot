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
};

export default Util;
