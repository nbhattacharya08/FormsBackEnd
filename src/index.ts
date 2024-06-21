import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.use(bodyParser.json());

const dbFilePath = path.join(__dirname, 'db.json');

// Function to read data from db.json
const readData = (): { submissions: Array<{ name: string, email: string, phone: string, github_link: string, stopwatch_time: string }> } => {
    const rawData = fs.readFileSync(dbFilePath, 'utf-8');
    return JSON.parse(rawData);
};

// Function to write data to db.json
const writeData = (data: { submissions: Array<{ name: string, email: string, phone: string, github_link: string, stopwatch_time: string }> }) => {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// /ping endpoint
app.get('/ping', (req: Request, res: Response) => {
    res.json(true);
});

// /submit endpoint
app.post('/submit', (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const data = readData();
    const submission = { name, email, phone, github_link, stopwatch_time };
    data.submissions.push(submission);
    writeData(data);

    res.status(201).json({ message: 'Submission received.', submission });
});

// /read endpoint
app.get('/read', (req: Request, res: Response) => {
    const index = parseInt(req.query.index as string);
    const data = readData();

    if (isNaN(index) || index < 0 || index >= data.submissions.length) {
        return res.status(400).json({ error: 'Invalid index.' });
    }

    res.json(data.submissions[index]);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
