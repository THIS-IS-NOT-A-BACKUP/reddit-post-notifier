import { browser } from 'webextension-polyfill-ts';
import { IS_FIREFOX, IS_TEST } from '../constants';
import DEFAULT_OPTIONS from '../options-default';
import { initializeBgListener, onMessage } from '../port';
import storage from '../storage';
import type { PortMessage } from '../types/message';
import { addNotificationClickListener } from './notifications';
import { scheduleNextUpdate, watchAlarms } from './timers';
import { isUpdating, updateAndSchedule } from './update';

if (IS_FIREFOX) {
    // Support notification-sound extension
    // https://github.com/freaktechnik/notification-sounds#extension-integration
    browser.notifications.onShown?.addListener(() => {
        void browser.runtime.sendMessage('@notification-sound', 'new-notification');
    });
}

/** Make sure that all options fields are saved */
async function mergeOptions() {
    const options = await storage.getOptions();
    await storage.saveOptions({ ...DEFAULT_OPTIONS, ...options });
}

export async function startExtension() {
    void browser.browserAction.setBadgeBackgroundColor({ color: 'darkred' });

    // Storage
    await mergeOptions();
    browser.storage.onChanged.addListener(() => void storage.countNumberOfUnreadItems());
    void storage.countNumberOfUnreadItems();

    // Register notifications
    addNotificationClickListener();

    // Register alarms
    watchAlarms();

    // Register port
    initializeBgListener((p) => {
        if (isUpdating) p.postMessage({ id: 'UPDATING_START' } as PortMessage);
    });

    onMessage('UPDATE_NOW', () => updateAndSchedule());
    onMessage('SCHEDULE_NEXT_UPDATE', () => scheduleNextUpdate());

    await updateAndSchedule();
}

if (!IS_TEST) void startExtension();
