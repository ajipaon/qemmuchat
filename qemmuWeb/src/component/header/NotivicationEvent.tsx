import { useEffect } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { deCodeJwt } from '../../config/jwtClient';
import CustomHttpClient from '../../config/customEvent';

export default function NotificationEvent() {
  // const [events, setEvents] = useState<string[]>([]);
  const [value] = useLocalStorage<string>({
    key: "token",

  });

  useEffect(() => {
    if (value) {
      const user = deCodeJwt(value)
      const client = new CustomHttpClient(`/api/v1/notification/${user?.id}`, {
        Authorization: `Bearer ${value}`,
      });

      client.connect(
        (data) => {
          // setEvents((prevEvents) => [...prevEvents, data]);
          console.log('Received data:', data);
        },
        (error) => {
          console.error('Error connecting to the SSE server:', error);
        }
      );

      return () => {
        client.close();
      };
    }
  }, [value]);

  return <></>
};

