(() => {
    const search = document.querySelector('#find'),
        format = document.querySelector('#format');
    const notable = document.getElementById('notable');
    const entries = [
        ...document.querySelectorAll('.gallery > li, .music-list > li'),
    ];
    function update() {
        const query = search.value.trim().toLocaleLowerCase();
        if (notable) notable.hidden = Boolean(query);
        let shown = 0;
        for (const item of entries) {
            const matchesFormat =
                !format || format.selectedIndex === 0 ||
                item.dataset.format === format.value;
            item.hidden = !(
                matchesFormat &&
                item.textContent.toLocaleLowerCase().includes(query)
            );
            if (!item.hidden) shown++;
        }
        document.querySelector('#count').textContent =
            shown +
            (document.querySelector('.music-list')
                ? shown === 1
                    ? ' piece or collection'
                    : ' pieces and collections'
                : ' experiment' + (shown === 1 ? '' : 's'));
    }
    search.addEventListener('input', update);
    format?.addEventListener('change', update);
})();
