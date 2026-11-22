// A four-bar listening window. Score times are quarter-note units throughout.
(() => {
    let events = score.notes;
    let groups = [...new Set(events.map(n=>n[3]))].sort((a,b)=>a-b);
    let end = events.reduce((max,n)=>Math.max(max,n[0]+n[2]),0);
    const g = board('Piano roll showing pitch vertically and quarter-note beats horizontally');
    let start=0, bpm=88, selected=-1, context, timer, frame, origin, playing=false, tapped=null;
    const length=16, colors=[mint,gold,coral,'#9db9e9'];
    let current=[], filter='All notes', pinned=null, looping=false;
    let playRequest=0;
    const nodes=new Set();
    function visible() {
        const inWindow=events.filter(n=>n[0]<start+length && n[0]+n[2]>start && (selected<0 || n[3]===selected));
        if(filter==='All notes')return inWindow;
        const byTime=new Map();
        for(const n of inWindow){
            const key=Math.round(n[0]*96),previous=byTime.get(key);
            if(!previous || (filter==='Highest attacks' ? n[1]>previous[1] : n[1]<previous[1]))byTime.set(key,n);
        }
        return [...byTime.values()];
    }
    function paint(cursor=null) {
        clear(g);
        const low=current.reduce((p,n)=>Math.min(p,n[1]),54)-2,high=current.reduce((p,n)=>Math.max(p,n[1]),66)+2;
        for(let b=0;b<=length;b++) {
            const x=32+b*56;line(g,[[x,24],[x,273]],b%4?'#35514a':'#627d70',1);
            if(b%4===0)labelAt(g,String(Math.round(start+b)),x,302);
        }
        for(const [t,p,d,group] of current) {
            const left=Math.max(start,t), right=Math.min(start+length,t+d);
            g.fillStyle=p===pinned ? '#fff3a7' : colors[groups.indexOf(group)%colors.length];
            g.fillRect(32+(left-start)*56,250-(p-low)/(high-low)*220,Math.max(3,(right-left)*56-1),6);
        }
        if(cursor!==null)line(g,[[32+cursor*56,12],[32+cursor*56,274]],white,3);
        if(tapped!==null)dot(g,32+tapped*56,281,5,coral);
    }
    function stop() {
        playRequest++;playing=false;cancelAnimationFrame(frame);clearTimeout(timer);
        nodes.forEach(n=>{try{n.stop();}catch{}});nodes.clear();play.textContent='Play passage';
    }
    function refresh() {
        stop();tapped=null;current=visible();paint();
        const pitchClasses=new Set(current.map(n=>n[1]%12));
        const pitches=current.map(n=>n[1]);
        const span=pitches.length ? pitches.reduce((m,p)=>Math.max(m,p),0)-pitches.reduce((m,p)=>Math.min(m,p),127) : 0;
        const offbeats=current.filter(n=>Math.abs(n[0]-Math.round(n[0]))>.08).length;
        statusLine.textContent='Beats '+start+'–'+Math.min(Math.ceil(end),start+length)+' · '+pitchClasses.size+' pitch classes · span '+span+' semitones · '+offbeats+' offbeat attacks.';
    }
    async function begin() {
        if(playing){stop();paint();return;}
        const request=++playRequest;
        try {
            context ??= new AudioContext();
            await context.resume();
        } catch {statusLine.textContent='Audio playback is unavailable in this browser.';return;}
        if(request!==playRequest)return;
        stop();playing=true;play.textContent='Stop';origin=context.currentTime+.06;
        const sec=60/bpm;
        for(const [t,p,d] of current) {
            const clipped=Math.max(t,start),at=origin+(clipped-start)*sec;
            const duration=Math.max(.035,(Math.min(t+d,start+length)-clipped)*sec);
            const osc=context.createOscillator(), gain=context.createGain();
            osc.type='triangle';osc.frequency.value=440*2**((p-69)/12);
            gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.045,at+.012);
            gain.gain.exponentialRampToValueAtTime(.0001,at+duration+.025);
            osc.connect(gain).connect(context.destination);osc.start(at);osc.stop(at+duration+.04);
            nodes.add(osc);osc.onended=()=>{nodes.delete(osc);osc.disconnect();gain.disconnect();};
        }
        function tick(){if(!playing)return;paint(Math.max(0,(context.currentTime-origin)/sec));frame=requestAnimationFrame(tick);}
        tick(); timer=setTimeout(()=>{stop();paint();if(looping)begin();},Math.min(length,end-start)*sec*1000+120);
    }
    const play=button('Play passage',begin);
    const offset=slider('Start beat',0,Math.max(0,Math.ceil(end)-1),0,v=>{start=v;refresh();});
    slider('Tempo (BPM)',36,168,bpm,v=>{bpm=v;refresh();});
    const parts=menu('Listen to',['All parts',...groups.map((_,i)=>'Part '+(i+1))],i=>{selected=i===0?-1:groups[i-1];refresh();});
    menu('Attack layer',['All notes','Highest attacks','Lowest attacks'],i=>{
        filter=['All notes','Highest attacks','Lowest attacks'][i];refresh();
    });
    const file=document.createElement('input');file.type='file';file.accept='.mid,.midi,audio/midi';
    field('Use a local MIDI edition',file);
    file.onchange=async()=>{
        if(!file.files[0])return;
        try {
            if(file.files[0].size>8*1024*1024)throw Error('Choose a MIDI file under 8 MB');
            const imported=readMidi(await file.files[0].arrayBuffer());
            events=imported;groups=[...new Set(events.map(n=>n[3]))].sort((a,b)=>a-b);
            parts.replaceChildren(new Option('All parts',0),...groups.map((_,i)=>new Option('Part '+(i+1),i+1)));
            selected=-1;start=0;saved=0;end=events.reduce((max,n)=>Math.max(max,n[0]+n[2]),0);
            offset.max=Math.max(0,Math.ceil(end)-1);offset.value=0;refresh();
            statusLine.textContent='Loaded '+file.files[0].name+'.';
        } catch(error){statusLine.textContent=error.message;}
    };
    const loop=button('Loop passage',()=>{looping=!looping;loop.setAttribute('aria-pressed',String(looping));loop.textContent=looping?'Loop on':'Loop passage';});
    loop.setAttribute('aria-pressed','false');
    const pin=slider('Highlight MIDI pitch',21,108,69,v=>{
        pinned=v;paint();statusLine.textContent='Pitch '+v+' occurs '+current.filter(n=>n[1]===v).length+' times in this window.';
    });
    button('Most repeated pitch',()=>{
        const count=new Map();for(const note of current)count.set(note[1],(count.get(note[1])||0)+1);
        if(!count.size){statusLine.textContent='No notes in this window.';return;}
        const [pitch,total]=[...count].sort((a,b)=>b[1]-a[1])[0];
        pinned=pitch;pin.value=pitch;paint();statusLine.textContent='Pitch '+pitch+' repeats '+total+' times in this window.';
    });
    let saved=0;
    button('Mark passage A',()=>{saved=start;statusLine.textContent='Passage A begins at beat '+saved+'.';});
    button('Return to A',()=>{start=saved;offset.value=start;refresh();});
    button('Tap beat',()=>{
        if(!playing){statusLine.textContent='Play the passage, then tap along.';return;}
        tapped=Math.max(0,(context.currentTime-origin)*bpm/60);
        statusLine.textContent='Tap at beat '+(tapped+start).toFixed(2)+'.';
    });
    window.addEventListener('pagehide',stop);
    refresh();
})();
