import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Noble IT Hub API",
      version: "1.0.0",
      description: "API documentation for admin resources",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local dev server",
      },
    ],
  },
  apis: ["./app/api/**/route.ts"], // Scan all your API route files for docs
});