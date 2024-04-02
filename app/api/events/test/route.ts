import { EventService } from '@/app/lib/services';

export function GET(request: Request) {
  //   return Response.json({ data: 'data' });
  return new Response(JSON.stringify({ data: 'data' }), {
    status: 200,
    headers: { 'Set-Cookie': `token=test` },
  });
}
