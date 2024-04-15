'use client';
import React, {
  Fragment,
  useMemo,
  useState,
  useCallback,
  useLayoutEffect,
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
import {
  createEvent,
  deleteEvent,
  updateEvent,
  getEventData,
} from '@/app/lib/actions';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

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
import { set } from 'zod';

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

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 0,
    },
  },
};

export default function Resource() {
  console.log('rendering');
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

  let allViews = Object.values(Views);
  const [form] = Form.useForm();

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

  const overLapped = (event: any, start: string, end: string) => {
    let eventOverlapped = false;
    const eventsCheckForOverlap = JSON.parse(JSON.stringify(events));
    const eventsForSameResource = eventsCheckForOverlap.filter(
      (e: any) => e.resourceId === event.resourceId,
    );
    console.log('eventsCheckForOverlap', eventsForSameResource);
    console.log('event.id', event.id);
    if (eventsForSameResource.length > 0) {
      const existingEventKey = eventsForSameResource.findIndex(
        (e: any) => e.id === event.id && e.resourceId === event.resourceId,
      );
      console.log('existingEventKey', existingEventKey);
      if (existingEventKey >= 0) {
        eventsForSameResource.splice(existingEventKey, 1);
      }
    }

    let movedStart = new Date(start);
    let movedEnd = new Date(end);
    for (const value of eventsForSameResource) {
      let eventStart = new Date(value.start);
      let eventEnd = new Date(value.end);
      if (eventStart < movedEnd && eventEnd > movedStart) {
        console.log('event', value, start, end);
        eventOverlapped = true;
        break;
      }
    }

    console.log('eventOverlapped', eventOverlapped);

    return eventOverlapped;
  };

  const localizer = momentLocalizer(moment);

  const onEventDrop = useCallback(
    ({ event, start, end }: { event: any; start: any; end: any }) => {
      const idx = events.indexOf(event);
      const updatedEvent = { ...event, start, end };

      if (overLapped(updatedEvent, start, end)) {
        setNewEvent((oldEventValue) => event);
        return false;
      }

      // Optimistically update the UI first
      const nextEvents = [...events];
      nextEvents.splice(idx, 1, updatedEvent);
      setEvents((oldEvents) => nextEvents);
      setNewEvent((oldEventValue) => updatedEvent);

      // Then handle the database update in the background
      updateEvent(updatedEvent.id, updatedEvent).catch((error) => {
        // If the update fails, revert the changes in the UI
        console.error('Failed to update event:', error);
        nextEvents.splice(idx, 1, event);
        setEvents((oldEvents) => nextEvents);
        setNewEvent((oldEventValue) => event);
      });
    },
    [events],
  );

  const resizeEvent = useCallback(
    async ({ event, start, end }: { event: any; start: any; end: any }) => {
      console.log('resizeEvent', event);

      if (overLapped(event, start, end)) {
        return false;
      }
      let oldEvent: any = {};
      let updatedEvent: any = { ...event, start, end };

      if ('id' in event && event.id) {
        const nextEvents = events.map((existingEvent) => {
          return existingEvent.id === event.id ? updatedEvent : existingEvent;
        });

        setEvents((oldEvents) => nextEvents);

        form.setFieldsValue({
          ...updatedEvent,
          start: dayjs(updatedEvent.start),
          end: dayjs(updatedEvent.end),
        });

        updateEvent(event.id, updatedEvent).catch((error) => {
          const nextEvents = events.map((existingEvent) => {
            return existingEvent.id === event.id ? event : existingEvent;
          });

          setEvents((oldEvents) => nextEvents);
        });
      } else {
        setEvents((oldEvents) => events.filter((event) => event.id));
        const newEvent = { ...event, start, end };
        for (const key in events) {
          if (!events[key].id) {
            events[key] = newEvent;
          }
        }
        setEvents((oldEvents) => events);

        setNewEvent((oldEventValue) => newEvent);
        form.setFieldsValue({
          ...newEvent,
          start: dayjs(newEvent.start),
          end: dayjs(newEvent.end),
        });
      }
    },
    [events],
  );

  const adEventToEventsArray = (event: EventType) => {
    const nextEvents: EventType[] = [...events];
    nextEvents.splice(nextEvents.length, 0, event);
    setEvents((oldEvents) => nextEvents);
  };

  const onSelectSlot = (slotInfo: any) => {
    const newEvent = {
      title: 'New Event',
      start: slotInfo.start,
      end: slotInfo.end,
      resourceId: slotInfo.resourceId,
      description: '',
    };
    form.resetFields();

    adEventToEventsArray(newEvent);
    setNewEvent((oldEventValue) => newEvent);
    form.setFieldsValue({
      ...newEvent,
      start: dayjs(newEvent.start),
      end: dayjs(newEvent.end),
    });
    setOpen(() => true);
    console.log('onSelectSlot', newEvent);
  };

  const onSelectEvent = async (event: any) => {
    let eventDbData;
    console.log('onSelectEvent', event);

    if (event && 'id' in event && event.id && typeof event.id === 'number') {
      eventDbData = await getEventData(event.id);
    }
    const eventValues = {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      resourceId: event.resourceId,
      description: eventDbData?.description,
    };

    setNewEvent((oldEventValue) => eventValues);
    form.resetFields();
    form.setFieldsValue({
      ...eventValues,
      start: dayjs(event.start),
      end: dayjs(event.end),
    });

    setOpen(() => true);
  };

  const handleSave = async (e: any) => {
    const formValues = form.getFieldsValue();
    const eventValues = {
      ...formValues,
      start: formValues.start.toDate(),
      end: formValues.end.toDate(),
    };
    console.log('handleSave', eventValues);

    if (formValues) {
      if ('id' in formValues && typeof formValues.id === 'number') {
        const updatedEvent = await updateEvent(formValues.id, eventValues);
        setEvents((oldevents) =>
          oldevents.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
        );
        setNewEvent((oldEventValue) => updatedEvent);
      } else if (!eventValues.id) {
        const updatedEvents = events.filter((e) => e.id);
        const newCreatedEvent = await createEvent(eventValues);
        updatedEvents.splice(updatedEvents.length, 0, newCreatedEvent);
        setEvents((oldevents) => updatedEvents);
        setNewEvent((oldEventValue) => newCreatedEvent);
      }
    }

    setOpen(false);
  };
  const handleDelete = async (e: any) => {
    console.log('handleDelete', newEvent);

    if (newEvent && newEvent.id && typeof newEvent.id === 'number') {
      const newEvents = events.filter((e) => {
        return (
          newEvent.id && e.id && e.id.toString() !== newEvent.id.toString()
        );
      });

      await deleteEvent(newEvent.id);
      setEvents((oldevents) => newEvents);
    } else {
      const newEvents = events.filter((e) => e.id);
      setEvents((oldevents) => newEvents);
    }

    setOpen(false);
  };

  const handleClose = async () => {
    const newEvents = events.filter((e) =>
      e.hasOwnProperty('id') && e.id !== null ? true : false,
    );
    setEvents((oldEvents) => newEvents);
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
    console.log('initialValues ran');
    console.log('iitialized with', newEvent);

    const initialValues = JSON.parse(JSON.stringify(newEvent));
    if (initialValues) {
      initialValues['start'] = newEvent ? dayjs(newEvent.start) : dayjs();
      initialValues['end'] = newEvent ? dayjs(newEvent.end) : dayjs();
    }

    return initialValues;
  };

  /* Form ends */

  useLayoutEffect(() => {
    console.log(date);
    const fetchData = async () => {
      console.log('useEffect called');
      // fetch events from backend api
      const eventsResponse = await fetch('/api/events/all');
      const eventsData = eventsResponse ? await eventsResponse.json() : {};
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
        setEvents((oldEvents) => events);
        setResourceMap(resources);
      } else {
        setEvents((oldEvents) => []);
        setResourceMap([]);
      }

      // get all events and set to events
    };

    fetchData();
  }, [date]);

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
          // initialValues={initialValues()}
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
                  disabledDate={(current) => {
                    const endDate = form.getFieldValue('end');
                    return (
                      endDate && current && current.isAfter(endDate, 'day')
                    );
                  }}
                  onChange={(date, dayteString) => {
                    const endDate = form.getFieldValue('end');
                    const id = form.getFieldValue('id');
                    resizeEvent({
                      event: newEvent,
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
                  disabledDate={(current) => {
                    const startDate = form.getFieldValue('start');
                    return (
                      startDate && current && current.isBefore(startDate, 'day')
                    );
                  }}
                  onChange={(date, dayteString) => {
                    const startDate = form.getFieldValue('start');
                    const id = form.getFieldValue('id');
                    resizeEvent({
                      event: newEvent,
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
          <Row gutter={16}>
            <Col span={18}>
              <Form.List
                name="emails"
                rules={[
                  {
                    validator: async (_, names) => {
                      if (!names || names.length < 2) {
                        return Promise.reject(
                          new Error('At least 1 attendee is required'),
                        );
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        {...(index === 0
                          ? formItemLayout
                          : formItemLayoutWithOutLabel)}
                        label={index === 0 ? 'Emails' : ''}
                        required={false}
                        key={field.key}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              type: 'email',
                              message: 'The input is not a valid E-mail!',
                            },
                            {
                              required: true,
                              message: 'Please input your E-mail!',
                            },
                          ]}
                          noStyle
                        >
                          <Input
                            placeholder="attendees email"
                            style={{
                              width: '80%',
                              marginRight: '10px',
                            }}
                          />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{
                          width: '40%',
                        }}
                        icon={<PlusOutlined />}
                      >
                        Add Attendee
                      </Button>
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item name="description" label="Notes">
                <Input.TextArea />
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
          onEventDrop={onEventDrop}
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
