'use client';
import React, {
  Fragment,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from 'react-big-calendar';

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import dayjs from 'dayjs';

import moment from 'moment';
import { createEvent, deleteEvent, updateEvent } from '@/app/lib/actions';

const localizer = momentLocalizer(moment);

const DnDCalendar = withDragAndDrop(Calendar);

import {
  Button,
  Modal,
  Space,
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Row,
  Col,
  TimePicker,
} from 'antd';

import type { EventType } from '@/app/lib/definitions';

const eventsJson = [
  {
    id: 0,
    title: 'Board meeting',
    start: new Date(2024, 2, 18, 9, 0, 0),
    end: new Date(2024, 2, 18, 13, 0, 0),
    resourceId: 1,
  },
  {
    id: 1,
    title: 'MS training',
    start: new Date(2024, 2, 18, 14, 0, 0),
    end: new Date(2024, 2, 18, 16, 30, 0),
    resourceId: 2,
  },
  {
    id: 2,
    title: 'Team lead meeting',
    start: new Date(2024, 3, 18, 8, 30, 0),
    end: new Date(2024, 3, 18, 12, 30, 0),
    resourceId: 3,
  },
  {
    id: 11,
    title: 'Birthday Party',
    start: new Date(2024, 3, 18, 7, 0, 0),
    end: new Date(2024, 3, 18, 10, 30, 0),
    resourceId: 4,
  },
];

const resourceMap1 = [
  { resourceId: 1, resourceTitle: 'Board room' },
  { resourceId: 2, resourceTitle: 'Training room' },
  { resourceId: 3, resourceTitle: 'Meeting room 1' },
  { resourceId: 4, resourceTitle: 'Meeting room 2' },
];

export default function Resource() {
  // const { defaultDate, views } = useMemo(
  //   () => ({
  //     defaultDate: new Date(2024, 0, 29),
  //     views: ['day', 'work_week', 'month'],
  //   }),
  //   [],
  // );

  const [events, setEvents] = useState<EventType[]>([]);
  const [resourceMap, setResourceMap] = useState([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.DAY);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<EventType | null>(null);

  let initialFormValues: any = {};

  const onNavigate = useCallback(
    (newDate: any) => {
      console.log('onNavigate', newDate);
      setDate(newDate);
    },
    [date],
  );
  const onView = useCallback(
    (newView: any) => {
      setView(newView);
    },
    [view],
  );

  const localizer = momentLocalizer(moment);

  const moveEvent = useCallback(
    async ({ event, start, end }: { event: any; start: any; end: any }) => {
      const idx = events.indexOf(event);
      const updatedEvent = { ...event, start, end };
      await updateEvent(updatedEvent.id, updatedEvent);
      const nextEvents = [...events];
      nextEvents.splice(idx, 1, updatedEvent);

      setEvents(nextEvents);
    },
    [events],
  );

  const resizeEvent = useCallback(
    async ({ event, start, end }: { event: any; start: any; end: any }) => {
      const nextEvents = await Promise.all(
        events.map(async (existingEvent) => {
          let updatedEvent;
          if (existingEvent.id === event.id) {
            updatedEvent = { ...existingEvent, start, end };
            await updateEvent(event.id, updatedEvent);
            return updatedEvent;
          } else {
            return existingEvent;
          }
        }),
      );

      setEvents(nextEvents);
    },
    [events],
  );

  const adEventToEventsArray = (event: EventType) => {
    const nextEvents: EventType[] = [...events];
    nextEvents.splice(nextEvents.length, 0, event);
    setEvents(nextEvents);
  };

  const onSelectSlot = (slotInfo: any) => {
    const newEvent = {
      title: 'New Event',
      start: slotInfo.start,
      end: slotInfo.end,
      resourceId: slotInfo.resourceId,
      description: '',
    };

    adEventToEventsArray(newEvent);
    setNewEvent(newEvent);
    setOpen(() => true);
  };

  const onSelectEvent = (event: any) => {
    console.log(event);
    const eventValues = { ...event };
    setNewEvent(eventValues);
    setOpen(() => true);
  };

  const handleSave = async (e: any) => {
    console.log('handleOk', newEvent);

    if (newEvent) {
      if (typeof newEvent.id === 'number') {
        await updateEvent(newEvent.id, newEvent);
      } else if (!newEvent.id) {
        const dbData = {
          ...newEvent,
          start: newEvent.start,
          end: newEvent.end,
        };
        await createEvent(dbData);
      }
    }

    setOpen(false);
  };
  const handleDelete = async (e: any) => {
    console.log('handleDelete', e);
    const newEvents = events.filter((e) =>
      !newEvent
        ? true
        : newEvent.id && e.id && e.id.toString() !== newEvent.id.toString(),
    );

    if (newEvent && newEvent.id && typeof newEvent.id === 'number') {
      await deleteEvent(newEvent.id);
    }
    setEvents(newEvents);
    setOpen(false);
  };

  const handleClose = async () => {
    setOpen(false);
  };

  /******* Form starts */

  const onFinish = (values: any) => {
    console.log(values);
  };

  const [allDay, setAllDay] = useState(false);

  const onAllDayChange = (e: any) => {
    setAllDay(e.target.checked);
  };

  const initialValues = () => {
    const initialValues = JSON.parse(JSON.stringify(newEvent));
    if (initialValues) {
      initialValues['start'] = newEvent ? dayjs(newEvent.start) : dayjs();
      initialValues['end'] = newEvent ? dayjs(newEvent.end) : dayjs();
    }

    return initialValues;
  };

  /* Form ends */

  let allViews = Object.values(Views);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      console.log('useEffect called');
      // fetch events from backend api
      const eventsResponse = await fetch('/api/events/all');
      const eventsData = await eventsResponse.json();
      const eventsRows = eventsData.rows || [];

      const events = eventsRows.map((item: any) => ({
        ...item,
        start: new Date(item.start),
        end: new Date(item.end),
      }));

      const resourceResponse = await fetch('/api/resources/all');
      const resourceData = await resourceResponse.json();
      const resourceRows = resourceData.rows || [];

      const resources = resourceRows.map((item: any) => ({
        ...item,
        start: new Date(item.start),
        end: new Date(item.end),
      }));

      if (eventsRows && resourceRows) {
        setEvents(events);
        setResourceMap(resources);
      } else {
        setEvents([]);
        setResourceMap([]);
      }

      // get all events and set to events
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <Modal
        open={open}
        onOk={handleSave}
        onCancel={handleClose}
        okText={'Save Event'}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <Button>Custom Button</Button>
            <Button onClick={handleDelete}>Delete Event</Button>
            <OkBtn />
          </>
        )}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={initialValues()}
          form={form}
        >
          <Row>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please input the title!' }]}
            >
              <Input
                onChange={(e) => {
                  console.log(e);
                }}
              />
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Col span={10}>
              <Form.Item name="start">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  minuteStep={15}
                  onChange={(date, dayteString) => {
                    const endDate = form.getFieldValue('end');
                    const id = form.getFieldValue('id');
                    resizeEvent({
                      event: { id: id },
                      start: date.toDate(),
                      end: endDate.toDate(),
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="end">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  minuteStep={15}
                  onChange={(date, dayteString) => {
                    const startDate = form.getFieldValue('start');
                    const id = form.getFieldValue('id');
                    resizeEvent({
                      event: { id: id },
                      start: startDate.toDate(),
                      end: date.toDate(),
                    });
                  }}
                />
              </Form.Item>
              <Form.Item noStyle name="id">
                <Input hidden />
              </Form.Item>
              <Form.Item noStyle name="resourceId">
                <Input hidden />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <div className="height600" style={{ height: '700px' }}>
        <DnDCalendar
          localizer={localizer}
          views={allViews}
          defaultView={'day'}
          view={view}
          onView={onView}
          onNavigate={onNavigate}
          date={date}
          timeslots={4}
          min={new Date(new Date().setHours(0, 0, 0, 0))} // 0:00 AM
          max={new Date(new Date().setHours(23, 59, 59, 999))}
          step={15}
          resizable
          events={events}
          onEventResize={resizeEvent}
          onEventDrop={moveEvent}
          defaultDate={new Date()}
          resources={resourceMap} // your resources array
          resourceIdAccessor={(resource: object) =>
            (resource as { resourceId: number }).resourceId
          }
          resourceTitleAccessor={(resource: object) =>
            (resource as { resourceTitle: string }).resourceTitle
          }
          selectable
          showMultiDayTimes={true}
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
        />
      </div>
      {/* <div className="height600" style={{ height: '40rem' }}>
        <Calendar
          defaultDate={defaultDate}
          events={events}
          localizer={localizer}
          popup
        />
      </div> */}
    </Fragment>
  );
}
Resource.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
};
