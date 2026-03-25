import { useReactiveVar } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { wsStatusVar } from './wsStatus';

type TUseWsStatusMessageResult = {
  message: string | null;
};

const SHOW_DELAY = 2000;

export const useWsStatusMessage = (): TUseWsStatusMessageResult => {
  const status = useReactiveVar(wsStatusVar);
  const [delayedStatus, setDelayedStatus] = useState(status);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setDelayedStatus(status);
      },
      ['disconnected', 'reconnecting'].includes(status) ? SHOW_DELAY : 0,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [status]);

  if (delayedStatus === 'reconnecting') {
    return { message: 'Live updates paused. Reconnecting…' };
  }

  if (delayedStatus === 'disconnected') {
    return {
      message: 'Live updates unavailable. Please check your connection.',
    };
  }

  return { message: null };
};
