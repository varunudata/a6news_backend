const prisma = require("../prisma/client");

const getTicker = async (req, res) => {
  try {
    let ticker = await prisma.ticker.findFirst();
    if (!ticker) {
      // Create a default one if none exists in the database
      ticker = await prisma.ticker.create({
        data: {
          text: "Breaking: New Tech Regulations Announced • AI is reshaping content creation • Stock markets open higher today • More updates coming soon...",
        },
      });
    }
    return res.status(200).json({ success: true, data: ticker });
  } catch (error) {
    console.error("Error getting ticker:", error);
    return res.status(500).json({
      success: false,
      message: "Server error getting ticker",
    });
  }
};

const updateTicker = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Ticker text cannot be empty",
      });
    }

    let ticker = await prisma.ticker.findFirst();
    if (!ticker) {
      ticker = await prisma.ticker.create({
        data: { text: text.trim() },
      });
    } else {
      ticker = await prisma.ticker.update({
        where: { id: ticker.id },
        data: { text: text.trim() },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticker updated successfully",
      data: ticker,
    });
  } catch (error) {
    console.error("Error updating ticker:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating ticker",
    });
  }
};

module.exports = {
  getTicker,
  updateTicker,
};
