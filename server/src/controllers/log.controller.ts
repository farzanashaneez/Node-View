import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

interface LogRequestBody {
  message: string;
  stack: string;
  time: string;
}

export const saveLog = (req: Request, res: Response): void => {
    const { message, stack, componentStack } = req.body;
    console.log(message, stack, componentStack);

    const logEntry = `\n[${new Date().toISOString()}]\nMessage: ${message}\nStack: ${stack}\nComponent Stack: ${componentStack}\n--------------------`;
  
    const logFilePath = path.join(__dirname, '../../logs/error.log');
  
    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        console.error('Failed to write to log file', err);
        res.status(500).json({ error: 'Failed to write log' });
      } else {
        res.status(200).json({ success: true });
      }
    });
    }
