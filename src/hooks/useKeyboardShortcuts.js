import { useEffect } from 'react';

const useKeyboardShortcuts = (shortcuts) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Don't trigger shortcuts when typing in input fields
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            const key = event.key.toLowerCase();
            const ctrl = event.ctrlKey || event.metaKey;
            const alt = event.altKey;
            const shift = event.shiftKey;

            for (const shortcut of shortcuts) {
                const matchesKey = shortcut.key.toLowerCase() === key;
                const matchesCtrl = shortcut.ctrl === ctrl;
                const matchesAlt = shortcut.alt === alt;
                const matchesShift = shortcut.shift === shift;

                if (matchesKey && matchesCtrl && matchesAlt && matchesShift) {
                    event.preventDefault();
                    shortcut.action();
                    break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};

export default useKeyboardShortcuts; 