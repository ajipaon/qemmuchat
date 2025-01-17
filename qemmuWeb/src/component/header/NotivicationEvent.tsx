import { useEffect } from 'react';
import CustomEventSource from '../../config/customEvent';
import { useLocalStorage } from '@mantine/hooks';
import { deCodeJwt } from '../../config/jwtClient';

export default function NotificationEvent() {
  // const [events, setEvents] = useState<string[]>([]);
  const [value] = useLocalStorage<string>({
    key: "token",

  });

  // useEffect(() => {
  //   if (value) {
  //     const user = deCodeJwt(value)
  //     const eventSource = new CustomEventSource(`/api/v1/notification/${user?.id}`, {
  //       Authorization: `Bearer ${value}`,
  //     });

  //     eventSource.connect(
  //       (data) => {
  //         // setEvents((prevEvents) => [...prevEvents, data]);
  //         console.log(data)
  //       },
  //       (error) => {
  //         console.error('Error connecting to the SSE server:', error);
  //       }
  //     );

  //     return () => {
  //       eventSource.close();
  //     };
  //   }
  // }, [value]);

  return <></>
};

