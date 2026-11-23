// Contact the recording host only when the listener asks to play the performance.
(() => {
    const slots = [...document.querySelectorAll('[data-video]')];
    const audio = [...document.querySelectorAll('audio')];
    function stopOthers(except) {
        for (const a of audio) if (a !== except) a.pause();
        for (const slot of slots) {
            if (slot === except) continue;
            slot.querySelector('iframe')?.remove();
            const button = slot.querySelector('button');
            if (button) button.hidden = false;
        }
    }
    document.addEventListener('scoreplay', () => stopOthers());
    for (const a of audio)
        a.addEventListener('play', () => {
            stopOthers(a);
            document.dispatchEvent(new Event('performanceplay'));
        });
    for (const slot of slots) {
        const button = slot.querySelector('button');
        if (location.protocol === 'file:') {
            button.remove();
            continue;
        }
        button.onclick = () => {
            stopOthers(slot);
            document.dispatchEvent(new Event('performanceplay'));
            if (slot.querySelector('iframe')) return;
            const frame = document.createElement('iframe');
            frame.title = slot.dataset.title;
            frame.allow =
                'autoplay; encrypted-media; fullscreen; picture-in-picture';
            frame.allowFullscreen = true;
            frame.referrerPolicy = 'strict-origin-when-cross-origin';
            frame.src =
                'https://www.youtube-nocookie.com/embed/' +
                slot.dataset.video +
                '?autoplay=1';
            button.hidden = true;
            slot.append(frame);
        };
    }
})();
