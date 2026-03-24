import { useReactiveVar } from '@apollo/client/react';
import { wsStatusVar } from './wsStatus';

type TUseWsStatusMessageResult = {
  message: string | null;
};

export const useWsStatusMessage = (): TUseWsStatusMessageResult => {
  const status = useReactiveVar(wsStatusVar);

  if (status !== 'reconnecting' && status !== 'disconnected') {
    return { message: null };
  }

  return {
    message:
      status === 'reconnecting'
        ? 'Live updates paused. Reconnecting…'
        : 'Live updates unavailable. Please check your connection.',
  };
};
