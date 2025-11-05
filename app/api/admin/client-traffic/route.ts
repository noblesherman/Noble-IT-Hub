export async function GET() {
  const data = Array.from({ length: 15 }).map((_, i) => ({
    day: `Day ${i + 1}`,
    visits: Math.floor(Math.random() * 200)
  }));

  return Response.json(data);
}