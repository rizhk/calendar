import { EventService } from '@/app/lib/services';

export function GET(request: Request) {
  const paramQuery: any = {};
  const columnsToFetch: any = {
    id: true,
    title: true,
    start: true,
    end: true,
    description: true,
    resourceId: true,
  };
  const pageSize: number = 100;
  const currentPage: number = 1;
  return EventService.getAllEvents(
    paramQuery,
    columnsToFetch,
    pageSize,
    currentPage,
  ).then((events: any) => {
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
}
