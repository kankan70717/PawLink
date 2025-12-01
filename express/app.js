import express from 'express';
import router from './routes/index.js';
import { DatabaseSync } from 'node:sqlite';

const app = express();

app.listen('3000', () => {
	console.log(`Server listening on port 3000`);
});

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use('/api/v1', router);

export const db = new DatabaseSync('./database/data.db', (err) => {
	if (err) {
		console.error('Could not connect to database', err);
	} else {
		console.log('Connected to SQLite database');
	}
});