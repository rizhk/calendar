import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import EventCalendar from '@/app/ui/components/calendar';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <EventCalendar></EventCalendar>
    </main>
  );
}
