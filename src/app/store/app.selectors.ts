import { AppState } from './app.state';

const appSelector = (state: { app: AppState }) => state.app;

export const selectItems = (state: any) => appSelector(state).items;
