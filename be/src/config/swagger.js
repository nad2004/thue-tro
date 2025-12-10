// src/config/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nhà Trọ 24h API Documentation',
      version: '1.0.0',
      description: 'API tài liệu cho dự án Nhà Trọ 24h',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // Thay đổi port tùy project của bạn
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Đường dẫn tới các file chứa comment swagger
  apis: ['./src/routes/*.js', './src/docs/*.yaml'], 
};

export const swaggerSpec = swaggerJsdoc(options);