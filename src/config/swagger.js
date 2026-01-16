const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Eventra API",
      version: "1.0.0",
      description: "Scalable Event Ticketing Backend API",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },


  apis: [
    path.join(__dirname, "../modules/**/**/*.routes.js"),
  ],
};

module.exports = swaggerJsdoc(options);
