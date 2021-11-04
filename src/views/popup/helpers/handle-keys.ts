import { IS_FIREFOX } from '@/constants';

const focusNextRowElement = (current: HTMLElement, reverse = false) => {
    const rows: NodeListOf<HTMLElement> = document.body.querySelectorAll(`
    [data-keys-target="list-row"],
    [data-keys-target="post-row"]
    `);
    if (!rows) return;
    const { length } = rows;
    let index = reverse ? length : -1;
    for (let i = 0; i < length; i += 1) {
        if (rows[i] === current) {
            index = i;
            break;
        }
    }

    index = reverse ? (index || length) - 1 : (index + 1) % length;

    rows[index].focus();
};

const getGroupHeader = (elem: HTMLElement) => {
    const container = elem.closest('[data-keys-target="list-container"]');
    const header: HTMLElement = container.querySelector('[data-keys-target="list-row"]');
    if (header.dataset.keysTarget === 'list-row') return header;
};

const isRow = (elem: HTMLElement) => ['list-row', 'post-row'].includes(elem.dataset.keysTarget);
const isPostRow = (elem: HTMLElement) => elem.dataset.keysTarget === 'post-row';
const isHeaderRow = (elem: HTMLElement) => elem.dataset.keysTarget === 'list-row';

/**
 * @param {KeyboardEvent} e
 */
export default function handleKeydownEvent(e: KeyboardEvent & { target: HTMLElement }) {
    const { target, key, code } = e;

    // Prevent scrolling by arrow key and other potential default behavior
    if ([' ', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Backspace'].includes(key)) e.preventDefault();

    // Select next element in the list
    if (key === 'ArrowDown' || code === 'KeyJ') {
        focusNextRowElement(target);
    }

    // Select previous element in the list
    if (key === 'ArrowUp' || code === 'KeyK') {
        focusNextRowElement(target, true);
    }

    // Open selected group of posts or open selected post
    if (key === 'ArrowRight' || key === 'Enter' || code === 'KeyL') {
        if (isHeaderRow(target)) return target.click();
        if (isPostRow(target)) {
            const link: HTMLElement = target.querySelector('a[data-keys-target="post-link"]');
            link?.click();
            if (IS_FIREFOX) {
                // close window shortly after the click because the extension will lose focus in firefox anyway
                setTimeout(() => window.close(), 30);
            }
        }
    }

    // Collapse group
    if (key === 'ArrowLeft' || key === 'Backspace' || code === 'KeyH') {
        if (isHeaderRow(target)) return target.click();
        if (isPostRow(target)) {
            const groupHeader = getGroupHeader(target);
            groupHeader.click();
            groupHeader.focus();
        }
    }

    // Mark selected post or subreddit as read
    if (code === 'Space') {
        if (!isRow(target)) return;
        const next = target.nextElementSibling as HTMLElement;
        const prev = target.previousElementSibling as HTMLElement;
        const button: HTMLElement = target.querySelector('[data-keys-target="check-mark"] button');
        button?.click();
        if (isPostRow(target)) {
            if (next) next.focus();
            else prev?.focus();
        }
    }

    if (code === 'KeyP') {
        if (isPostRow(target)) {
            const next = target.nextElementSibling as HTMLElement;
            const prev = target.previousElementSibling as HTMLElement;
            const btn: HTMLElement = target.querySelector('[data-keys-target="pin-post"] button');
            if (btn) {
                btn.click();
                if (next) next.focus();
                else prev?.focus();
            }
        }
    }
}
