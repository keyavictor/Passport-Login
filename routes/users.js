const express = require('express');
const User = require('../models/User'); // Adjust the path based on your project structure
const router = express.Router();
const jwt = require('jsonwebtoken');  // For creating tokens


// Register route
router.post('/users/register', async (req, res) => {
  console.log('Request body:', req.body); // Log the received request body

  const { firstName, lastName, email, password } = req.body;

  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
          return res.status(400).json({ error: 'Email is already in use' });
      }

      const user = await User.create({ firstName, lastName, email, password });
      res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// POST request for logging in a user
router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and Password are required' });
    }

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Validate password
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send response with token
    res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Create a new user
router.post('/users', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    const user = await User.create({ username, email, password, firstName, lastName });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read a single user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user by ID
router.put('/users/:id', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, isActive } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password; // `beforeUpdate` hook will handle hashing if changed
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.isActive = isActive !== undefined ? isActive : user.isActive;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
