// Import the libraries.
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
// Load the secrets from .env file.
require('dotenv').config();

// Initialize the application.
const app = express();
const port = process.env.PORT || 5000;

// Setup Middleware (Security & Data Parsing)
app.use(cors());
app.use(express.json());

// Connect to Supabase.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create the basic "Home" route.
app.get('/', (req, res) => {
  res.send('CampusWallet Backend is Running! 🚀');
});

// UPDATED: Fetch transactions ONLY for a specific user
app.get('/api/transactions', async (req, res) => {
  // 1. Extract user_id from the query parameters (e.g., /api/transactions?user_id=123)
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      // 2. Filter: Only get rows where user_id matches the logged-in user
      .eq('user_id', user_id);

    if (error) throw error;
    res.status(200).json(data);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create the route to ADD a transaction with User ID.
app.post('/api/transactions', async (req, res) => {
  const { amount, category, description, date, is_expense, user_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        { amount, category, description, date, is_expense, user_id }
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server.
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});