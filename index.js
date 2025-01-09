import app from './app/app.js'
import { connectToDB } from './config/db.config.js';
import './config/dotenv.config.js'
import ApplicationErrorHandler from './utils/errorHandler.js';

app.listen(process.env.PORT, () => {
  console.log(`Starting server on port ${process.env.PORT}`);
  connectToDB()
})

app.use((err, req, res, next) => {
  if (err instanceof ApplicationErrorHandler) {
    return res.status(err.code || 500).json({ success: false, message: err.message });
  }
  return res.status(err.code || 500).json({ success: false, message: err.message || 'Internal server error' });
})