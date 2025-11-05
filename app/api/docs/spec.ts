export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Noble IT Hub API",
    version: "1.0.0",
    description: "Professional docs for your backend",
  },
  paths: {
    "/api/clients": {
      get: {
        summary: "Get all clients",
        tags: ["Clients"],
      },
      post: {
        summary: "Create a client",
        tags: ["Clients"],
      },
    },
    "/api/projects": {
      get: {
        summary: "Get all projects",
        tags: ["Projects"],
      },
      post: {
        summary: "Create a project",
        tags: ["Projects"],
      },
    },
  },
  tags: [
    { name: "Clients" },
    { name: "Projects" },
  ]
};