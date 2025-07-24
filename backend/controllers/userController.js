const User = require('../models/User');
const CodeExecution = require('../models/CodeExecution');

const getUserStats = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await User.findById(req.session.userId);
    const executions = await CodeExecution.find({ userId: req.session.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const stats = {
      totalExecutions: user.codeExecutions,
      recentExecutions: executions,
      memberSince: user.createdAt,
      lastLogin: user.lastLogin
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

module.exports = { getUserStats };