import 'dotenv/config';
import app from './app.js';
const port = Number(process.env.PORT || 3001);
const server = app.listen(port, () => console.log(`Contact Manager API listening on port ${port}`));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
