import { makeVar } from '@apollo/client';

type TWsStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected';

export const wsStatusVar = makeVar<TWsStatus>('idle');

export const setWsStatus = (status: TWsStatus) => {
  if (wsStatusVar() === status) {
    return;
  }

  wsStatusVar(status);
};
