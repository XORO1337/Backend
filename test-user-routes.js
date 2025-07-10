const express = require('express');
const app = express();

// Try importing the user routes to see if there's an error
try {
  const userRoutes = require('./routes/User_route');
  app.use('/api/users', userRoutes);
  console.log('User routes imported successfully');
} catch (error) {
  console.error('Error importing user routes:', error);
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
