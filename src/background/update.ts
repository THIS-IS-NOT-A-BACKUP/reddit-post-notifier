import { sendFromBg } from '../port';
import storage from '../storage';
import NotifierApp from '../notifier/app';
import { scheduleNextUpdate } from './timers';
import { isAuthError } from '@/reddit-api/errors';

export let isUpdating = false;

export async function updateAndSchedule(isForcedByUser = false) {
    if (isUpdating) return;
    isUpdating = true;
    sendFromBg('UPDATING_START');

    try {
        const app = new NotifierApp();
        await app.update(isForcedByUser);
        await scheduleNextUpdate();
    } catch (e) {
        console.error(e);
        if (isAuthError(e)) {
            await storage.setAuthError(e);
            isUpdating = false;
            if (e.invalidateToken) await updateAndSchedule();
        } else {
            await scheduleNextUpdate();
        }
    } finally {
        isUpdating = false;
        sendFromBg('UPDATING_END');
    }
}
