'use client';
import Modal from '@/components/common/Modal';
import ColorPicker from '@/components/feature/ColorPicker';
import { DateSelectArg, EventClickArg, EventContentArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
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

const Calendar = () => {
  const { user } = useAuth();
  const getEmailIdPattern = /^[^@]+/;

  const userEmailId = user?.email?.match(getEmailIdPattern)?.[0] || '';

  const [weekendsVisible, setWeekendsVisible] = useState<boolean>(true);
  const [currentEvents, setCurrentEvents] = useState<CalendarEvent[]>([]);
  const [userColorList, setUserColorList] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const handleWeekendsToggle = () => {
    setWeekendsVisible(!weekendsVisible);
  };

  useEffect(() => {
    const fetchUserColors = async () => {
      console.log('01. DB -> =userColorList= 값 삽입');
      try {
        const docRef = doc(db, 'userColors', 'list');
        const docSnap = await getDoc(docRef);
        const userColors = docSnap.data();
        if (userColors) {
          setUserColorList(userColors as Record<string, string>);
          console.log('01-1. =userColorList=', userColorList);
          console.log('01-2. =userColorList[userEmailId]=', userColorList[userEmailId]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserColors();
  }, []);

  useEffect(() => {
    console.log('02. 모달 useEffect 실행');
    if (userColorList && Object.keys(userColorList).length > 0) {
      if (userColorList[userEmailId]) {
        console.log('02-1. 이미 값이 있음');
        setShowModal(false);
      } else {
        console.log('02-2. 값이 없어서 모달 띄움');
        setShowModal(true);
      }
    }
  }, [userColorList]);

  const handleDateSelect = async (selectInfo: DateSelectArg) => {
    const title = prompt('새로운 이벤트 제목을 입력하세요');
    const calendarApi = selectInfo.view.calendar;

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
        backgroundColor: userColorList[userEmailId] || '',
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
            backgroundColor: userColorList[userEmailId] || '',
          };
        });
        setCurrentEvents(events);
      } catch (error) {
        console.error('이벤트 불러오기 오류:', error);
      }
    };

    fetchEvents();
  }, [userColorList]);

  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <ColorPicker
          onClose={() => {
            setShowModal(false);
            console.log('컬러픽 선택하기', showModal);
          }}
        />
      </Modal>
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
    </>
  );
};

const EventContent = ({ eventInfo }: { eventInfo: EventContentArg }) => {
  console.log(eventInfo);
  return (
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
};

const renderEventContent = (eventInfo: EventContentArg) => {
  return (
    <>
      <EventContent eventInfo={eventInfo} />
    </>
  );
};

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
