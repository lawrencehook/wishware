(() => {
    const audio=document.createElement('audio');
    audio.controls=true;audio.preload='metadata';audio.src='excerpt.mp3';mount.prepend(audio);
    let a=0,b=0,loop=false,markers=[];
    function report(){statusLine.textContent='A '+a.toFixed(1)+'s · B '+b.toFixed(1)+'s · '+(loop?'loop on':'loop off')+' · '+markers.length+' marked attacks.';}
    button('Set A',()=>{a=audio.currentTime;b=Math.max(a,b);report();});
    button('Set B',()=>{if(audio.currentTime<=a){statusLine.textContent='Move past A before setting B.';return;}b=audio.currentTime;report();});
    button('Loop A–B',()=>{if(b-a<.1){statusLine.textContent='Set the start and end of a phrase first.';return;}loop=!loop;if(loop){audio.currentTime=a;audio.play().catch(()=>{});}report();});
    button('Mark attack',()=>{markers.push(audio.currentTime);statusLine.textContent='Attacks (seconds): '+markers.map(t=>t.toFixed(2)).join(' · ');});
    button('Clear marks',()=>{markers=[];report();});
    slider('Playback speed',.5,1.25,1,v=>{audio.playbackRate=v;report();},.05);
    audio.ontimeupdate=()=>{if(loop&&audio.currentTime>=b)audio.currentTime=a;};
    audio.onended=()=>{if(loop){audio.currentTime=a;audio.play().catch(()=>{});}};
    audio.onerror=()=>{statusLine.textContent='This browser could not play the bundled excerpt.';};
    report();
})();
