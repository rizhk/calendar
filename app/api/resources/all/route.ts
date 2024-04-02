import { ResourceService } from '@/app/lib/services';

export function GET(request: Request) {
  const paramQuery: any = {};
  const columnsToFetch: any = {
    resourceId: true,
    name: true,
  };
  const pageSize: number = 100;
  const currentPage: number = 1;
  return ResourceService.getAllResources(
    paramQuery,
    columnsToFetch,
    pageSize,
    currentPage,
  ).then((resources: any) => {
    return new Response(JSON.stringify(resources), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
}
