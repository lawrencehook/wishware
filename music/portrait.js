// Shared by the composer directory and the composer pages.
const voiceColors = ['#e9ce80','#8acfc3','#d9a8c1','#a6b7eb','#e8a17b','#b5c888','#d1b2ff'];
// The small portraits use actual note onsets from each score.
function portrait(canvas, data, featured) {
    const w=canvas.clientWidth, h=canvas.clientHeight, scale=devicePixelRatio||1;
    if (!w || !h) return;
    canvas.width=Math.round(w*scale); canvas.height=Math.round(h*scale);
    const ctx=canvas.getContext('2d');
    ctx.scale(scale,scale);
    let lo=Infinity, hi=-Infinity;
    for (const [, ...part] of data.parts) {
        for (const note of part) {
            for (let k=2; k<note.length; k++) {
                if (note[k] < lo) lo = note[k];
                if (note[k] > hi) hi = note[k];
            }
        }
    }
    if (!Number.isFinite(lo)) return;
    for (const [color, ...part] of data.parts) {
        let prev;
        ctx.strokeStyle=ctx.fillStyle=voiceColors[color % voiceColors.length];
        for (const [tick, length, ...pitches] of part) {
            const x = 3 + tick*(w-7)/data.span;
            const ys = pitches.sort((a,b) => a-b).map(pitch => h-5-(pitch-lo)*(h-10)/(hi-lo||1));
            ys.forEach((y, index) => {
                if (prev && tick <= prev.end+.1) {
                    ctx.globalAlpha=.65;
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.ys[Math.min(index, prev.ys.length-1)]);
                    ctx.lineTo(x,y);
                    ctx.stroke();
                }
                ctx.globalAlpha=.86;ctx.beginPath();ctx.arc(x,y,featured?2.4:1.2,0,2*Math.PI);ctx.fill();
            });
            prev={x,ys,end:tick+length};
        }
    }
}
