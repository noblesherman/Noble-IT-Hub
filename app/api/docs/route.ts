import { NextResponse } from "next/server";
import { swaggerSpec } from "./spec";

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Docs</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      </head>
      <body style="margin:0;">
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script>
          SwaggerUIBundle({
            spec: ${JSON.stringify(swaggerSpec)},
            dom_id: '#swagger-ui'
          });
        </script>
      </body>
    </html>
  `;
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" }
  });
}