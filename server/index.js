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
// Visit http://localhost:5000/ in the browser to see this.
app.get('/', (req, res) => {
  res.send('CampusWallet Backend is Running! 🚀');
});

// Create a route to fetch transactions.
app.get('/api/transactions', async (req, res) => {
  try {
    // Fetch data from the 'transactions' table.
    const { data, error } = await supabase
      .from('transactions')
      // Select (*) all columns within the table.
      .select('*');

    if (error) throw error;

    // Send the data back to the user.
    res.status(200).json(data);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Existing GET Route

// NEW: Create the route to ADD a transaction.
app.post('/api/transactions', async (req, res) => {
  const { amount, category, description, date, is_expense } = req.body;

  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        { amount, category, description, date, is_expense }
      ])
      // Return the inserted data for confirmation.
      .select();

    if (error) throw error;
    // 201 = "Created"
    res.status(201).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server.
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});