const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      const message = existingUser.email === email
        ? 'User email already exists'
        : 'Username already taken';
      return res.status(400).json({ success: false, message });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error(' Registration error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    user.lastLogin = new Date();
    await user.save();

    req.session.userId = user._id.toString();

    res.json({
      success: true,
      message: 'Login successful',
      user: user.toJSON()
    });

  } catch (error) {
    console.error(' Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }

    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logout successful' });
  });
};

const getMe = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: user.toJSON() });

  } catch (error) {
    console.error(' Auth check error:', error);
    res.status(500).json({ success: false, message: 'Authentication check failed' });
  }
};

module.exports = { register, login, logout, getMe };
