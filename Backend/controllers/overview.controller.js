import Overview from "../models/overview.model.js";

export const GetData = async (req, res) => {
    try {
      const data = await Overview.findOne(); // Get first record
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving data", error });
    }
  };

  export const PostUser = async (req, res) => {
    try {
      const currentMonth = new Date().getMonth() + 1; // Get current month (0-indexed)
      let overview = await Overview.findOne();
  
      if (!overview) {
        // If no data exists, create a new record
        overview = new Overview({
          total_views: 1,
          month_views: { month: currentMonth, views: 1 },
          last_updated: new Date(),
        });
      } else {
        // Increment total views
        overview.total_views += 1;
  
        // Check if it's the current month
        if (overview.month_views.month === currentMonth) {
          // Same month -> increment monthly views
          overview.month_views.views += 1;
        } else {
          // Different month -> reset views and update month
          overview.month_views.month = currentMonth;
          overview.month_views.views = 1;
        }
      }
  
      await overview.save();
      res.status(200).json({ message: "User data updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating data", error });
    }
  };

  export const PostUpdate = async (req, res) => {
    try {
      let overview = await Overview.findOne();
  
      if (!overview) {
        return res.status(404).json({ message: "No overview data found" });
      }
  
      overview.last_updated = new Date(); // Update the timestamp
      await overview.save();
      
      res.status(200).json({ message: "Last updated timestamp refreshed" });
    } catch (error) {
      res.status(500).json({ message: "Error updating timestamp", error });
    }
  };