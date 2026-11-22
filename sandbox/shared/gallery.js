(() => {
    const search=document.querySelector('#find'),format=document.querySelector('#format');
    const entries=[...document.querySelectorAll('.gallery li')];
    function update(){
        const query=search.value.trim().toLocaleLowerCase();
        let shown=0;
        for(const item of entries){
            const matchesFormat=format.selectedIndex===0||item.dataset.format===format.value;
            item.hidden=!(matchesFormat && item.textContent.toLocaleLowerCase().includes(query));
            if(!item.hidden)shown++;
        }
        document.querySelector('#count').textContent=shown+' experiment'+(shown===1?'':'s');
    }
    search.addEventListener('input',update);format.addEventListener('change',update);
})();
