'use client';

import { DateSelectArg, EventClickArg, EventContentArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useState } from 'react';

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { createEventId } from '../../utils/calendar';
import styles from './page.module.css';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  author?: string | undefined | null;
  authorEmail?: string | undefined | null;
  backgroundColor?: string;
}

// ✅ 각자의 아이디와 원하는 색상코드를 입력해주세용~!
const userColors: Record<string, string> = {
  'beingnami2023@gmail.com': '#3aa18c',
  'eunyjin.family@gmail.com': '#FFB2B2',
  'hasyory@gmail.com': 'babypink',
  'seoramyeon@gmail.com': '#a9f5d0',
  'sujinjo405@gmail.com': '#ff33f4',
  default: '#888888', // 기본 회색
};

const Calendar = () => {
  const { user } = useAuth();
  const userEmail = user?.email || 'default';
  const [weekendsVisible, setWeekendsVisible] = useState<boolean>(true);
  const [currentEvents, setCurrentEvents] = useState<CalendarEvent[]>([]);

  const handleWeekendsToggle = () => {
    setWeekendsVisible(!weekendsVisible);
  };

  const handleDateSelect = async (selectInfo: DateSelectArg) => {
    const title = prompt('새로운 이벤트 제목을 입력하세요');
    const calendarApi = selectInfo.view.calendar;
    const userColor = userColors[userEmail] || userColors.default;
    calendarApi.unselect();

    if (title) {
      const newEvent = {
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        author: user?.displayName,
        authorEmail: user?.email,
        backgroundColor: userColor,
      };

      calendarApi.addEvent(newEvent);
      console.log(newEvent.id);
      try {
        await addDoc(collection(db, 'calendar'), newEvent);
      } catch (error) {
        console.error('이벤트 저장 오류:', error);
      }
    }
  };

  const handleEventClick = async (clickInfo: EventClickArg) => {
    if (confirm(`이벤트 '${clickInfo.event.title}'을(를) 삭제하시겠습니까?`)) {
      clickInfo.event.remove();
      const querySnapshot = await getDocs(collection(db, 'calendar'));
      querySnapshot.forEach(async (docItem) => {
        if (docItem.data().id === clickInfo.event.id) {
          await deleteDoc(doc(db, 'calendar', docItem.id));
        }
      });
    }
  };

  const handleEventDrop = async (dropInfo: EventDropArg) => {
    const { event } = dropInfo;

    try {
      const querySnapshot = await getDocs(collection(db, 'calendar'));
      querySnapshot.forEach(async (docItem) => {
        if (docItem.data().id === event.id) {
          await updateDoc(doc(db, 'calendar', docItem.id), {
            start: event.start?.toISOString(),
            end: event.end?.toISOString(),
          });
        }
      });
    } catch (error) {
      console.error('이벤트 이동 오류:', error);
    }
  };

  const handleEventResize = async (resizeInfo: EventResizeDoneArg) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'calendar'));
      querySnapshot.forEach(async (docItem) => {
        if (docItem.data().id === resizeInfo.event.id) {
          await updateDoc(doc(db, 'calendar', docItem.id), {
            start: resizeInfo.event.start?.toISOString(),
            end: resizeInfo.event.end?.toISOString(),
          });
        }
      });
    } catch (error) {
      console.error('이벤트 크기 조정 오류:', error);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'calendar'));
        const events: CalendarEvent[] = querySnapshot.docs.map((doc) => {
          const eventData = doc.data();
          return {
            id: eventData.id,
            title: eventData.title,
            start: eventData.start,
            end: eventData.end,
            allDay: eventData.allDay,
            author: eventData.author ?? null,
            authorEmail: eventData.authorEmail ?? null,
            backgroundColor: userColors[eventData.authorEmail] || userColors.default,
          };
        });
        setCurrentEvents(events);
      } catch (error) {
        console.error('이벤트 불러오기 오류:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className={styles.calendarContainer}>
      <Sidebar weekendsVisible={weekendsVisible} handleWeekendsToggle={handleWeekendsToggle} />

      <div className={styles.calendarWrapper}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={currentEvents}
          weekends={weekendsVisible}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
        />
      </div>
    </div>
  );
};

const EventContent = ({ eventInfo }: { eventInfo: EventContentArg }) => (
  <div
    style={{
      backgroundColor: eventInfo.event.backgroundColor,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <b className={styles.blind}>{eventInfo.timeText}</b>
    <i>{eventInfo.event.title}&nbsp;&nbsp;</i>
    <small>{eventInfo.event.extendedProps.author}</small>
  </div>
);

// FullCalendar에서 사용
const renderEventContent = (eventInfo: EventContentArg) => {
  return <EventContent eventInfo={eventInfo} />;
};

/** 사이드바 */
const Sidebar = ({
  weekendsVisible,
  handleWeekendsToggle,
}: {
  weekendsVisible: boolean;
  handleWeekendsToggle: () => void;
}) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarSection}>
        <h2>📌 사용 방법</h2>
        <ul>
          <li>날짜를 선택하면 새로운 이벤트를 생성할 수 있습니다.</li>
          <li>이벤트를 드래그 & 드롭하여 이동할 수 있습니다.</li>
          <li>이벤트를 클릭하면 삭제됩니다.</li>
        </ul>
      </div>

      <div className={styles.sidebarSection}>
        <label>
          <input type="checkbox" checked={weekendsVisible} onChange={handleWeekendsToggle} />
          주말 표시
        </label>
      </div>
    </div>
  );
};

export default Calendar;
