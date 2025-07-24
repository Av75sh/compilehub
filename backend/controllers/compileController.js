const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const CodeExecution = require('../models/CodeExecution');
const { executeCode } = require('../services/compilerService');

const compile = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, error: 'Please login to run code' });
    }

    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ success: false, error: 'Code and language are required' });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const filename = uuidv4();
    const startTime = Date.now();

    const result = await executeCode(code, language, filename);
    const executionTime = Date.now() - startTime;

    user.codeExecutions += 1;
    await user.save();

    const execution = new CodeExecution({
      userId: user._id,
      language,
      code,
      output: result.success ? result.output : null,
      executionTime,
      success: result.success,
      error: result.success ? null : result.error
    });
    await execution.save();

    res.json({
      success: result.success,
      output: result.output,
      error: result.error,
      executionTime: `${executionTime}ms`
    });

  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({ success: false, error: 'Compilation failed' });
  }
};

module.exports = { compile };