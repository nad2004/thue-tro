import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';
import userRoutes from './routes/user.route.js';
import categoryRoutes from './routes/category.route.js';
import articleRoutes from './routes/article.route.js';  
import tagRoutes from './routes/tag.route.js';          
import commentRoutes from './routes/comment.route.js';
import conversationRoute from './routes/conversation.route.js';
import messageRoute from './routes/message.route.js';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler } from './middleware/error.middleware.js';
dotenv.config();

// Kết nối Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware bảo mật và logging
app.use(helmet());
app.use(cors());
app.use(morgan('tiny')); // Logging HTTP requests
app.use(express.json()); // Cho phép đọc body JSON
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route chính
app.use('/api/user', userRoutes);
app.use('/api/categories', categoryRoutes); 
app.use('/api/articles', articleRoutes);     
app.use('/api/tags', tagRoutes);             
app.use('/api/comments', commentRoutes);     
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);

app.get('/', (req, res) => {
  res.send('API Blog/News - Controller-Service-Mongoose');
});
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📄 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
