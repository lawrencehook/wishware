// Read metrical Standard MIDI Files, including running status and multitrack files.
function readMidi(buffer) {
    const bytes=new Uint8Array(buffer), data=new DataView(buffer);
    let at=0, limit=bytes.length;
    const take=()=>{if(at>=limit)throw Error('Incomplete MIDI event');return bytes[at++];};
    const tag=()=>String.fromCharCode(take(),take(),take(),take());
    function variable(){
        let n=0;
        for(let i=0;i<4;i++){const b=take();n=n*128+(b&127);if(b<128)return n;}
        throw Error('Invalid event length');
    }
    if(tag()!=='MThd'||data.getUint32(at)<6)throw Error('Expected a MIDI file');
    const size=data.getUint32(at), format=data.getUint16(at+4), tracks=data.getUint16(at+6), division=data.getUint16(at+8);
    if(format>1||!division||(division&0x8000))throw Error('Choose a format 0 or 1 file with musical beat timing');
    at+=size+4;
    const events=[];
    for(let track=0;track<tracks;track++){
        limit=bytes.length;
        if(tag()!=='MTrk')throw Error('Missing MIDI track');
        const len=data.getUint32(at);at+=4;limit=at+len;
        if(limit>bytes.length)throw Error('Incomplete MIDI track');
        let ticks=0,running=0;const held=new Map();
        while(at<limit){
            ticks+=variable();let op=take();
            if(op<128){if(!running)throw Error('Invalid running status');at--;op=running;}
            if(op===255||op===240||op===247){
                running=0;if(op===255)take();const length=variable();at+=length;
                if(at>limit)throw Error('Truncated event');continue;
            }
            if(op>=240)throw Error('Unsupported system event');
            running=op;const type=op>>4,channel=op&15,p=take(),v=(type===12||type===13)?0:take();
            const key=channel*128+p;
            if(type===9&&v)held.set(key,ticks);
            else if((type===8||type===9)&&held.has(key)){
                const begin=held.get(key);held.delete(key);
                events.push([begin/division,p,Math.max(1,ticks-begin)/division,track*16+channel]);
                if(events.length>150000)throw Error('Choose a shorter excerpt');
            }
        }
    }
    if(!events.length)throw Error('No playable notes');
    return events.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
}
