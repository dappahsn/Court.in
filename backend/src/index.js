const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'court.in API',
    timestamp: new Date().toISOString(),
  });
});

// ── Route placeholders (Step 3) ──
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/courts', require('./routes/courts'));
// app.use('/api/bookings', require('./routes/bookings'));
// app.use('/api/reviews', require('./routes/reviews'));
// app.use('/api/webhooks', require('./routes/webhooks'));

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`⚡ court.in API running on http://localhost:${PORT}`);
});
