import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from './middlewares/validate';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = 4000;

app.use(express.json());

// 1. Define Zod Schema for User Registration
const createUserSchema = z.object({
  body: z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    email: z.string().email('Invalid email address format'),
    age: z.number().min(18, 'Must be at least 18 years old').optional(),
  }),
});

// 2. Route using the Zod validation middleware
app.post('/api/users', validate(createUserSchema), (req: Request, res: Response) => {
  // If we reach here, data is 100% valid and typed!
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: req.body,
  });
});

// 3. Test route to trigger a deliberate server error
app.get('/api/error-test', (req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error('Something went horribly wrong!');
  error.statusCode = 400;
  next(error); // Passes error straight to global error handler
});

// 4. Global Error Handler MUST be registered AFTER all routes
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Day 3 Server running on http://localhost:${PORT}`);
});