// A movable loupe and trace on a locally bundled archive plate.
(() => {
    const canvas=document.createElement('canvas');
    canvas.width=960;canvas.height=550;canvas.style.aspectRatio='960/550';
    canvas.setAttribute('role','img');canvas.setAttribute('aria-label',study.task);
    mount.prepend(canvas);
    const g=canvas.getContext('2d');
    const images=study.files.map(f=>{const im=new Image();im.onload=draw;im.src=f;return im;});
    let view=0,x=.5,y=.5,zoom=1,points=[],blend=0;
    function imageBox(im) {
        const k=Math.min(960/im.naturalWidth,550/im.naturalHeight)*zoom;
        const w=k*im.naturalWidth,h=k*im.naturalHeight;
        return [(960-w)/2+(zoom-1)*(.5-x)*400,(550-h)/2+(zoom-1)*(.5-y)*250,w,h];
    }
    function project(p,box){return [box[0]+box[2]*p[0],box[1]+box[3]*p[1]];}
    function draw(){
        g.fillStyle='#172d2b';g.fillRect(0,0,960,550);
        const im=images[view];if(!im?.naturalWidth)return;
        const box=imageBox(im);g.drawImage(im,...box);
        if(blend&&images.length>1){const other=images[1-view];if(other.naturalWidth){g.globalAlpha=blend;g.drawImage(other,...box);g.globalAlpha=1;}}
        const active=points.filter(p=>p[2]===view);
        line(g,active.map(p=>project(p,box)),coral,3);
        active.forEach((p,i)=>{const [xx,yy]=project(p,box);dot(g,xx,yy,6,coral);labelAt(g,String(i+1),xx+8,yy-8,'#fcf8c9');});
        const [cx,cy]=project([x,y],box);
        for(const [c,w] of [['#172822',5],['#fff3ae',2]]){
            line(g,[[cx-13,cy],[cx+13,cy]],c,w);line(g,[[cx,cy-13],[cx,cy+13]],c,w);
        }
    }
    function place(){
        points.push([x,y,view]);draw();const marked=points.filter(p=>p[2]===view);
        let message=study.mark+' '+marked.length+' · '+Math.round(x*100)+'% across, '+Math.round(y*100)+'% down.';
        if(study.swatches){
            const rgb=atob(study.swatches);
            const offset=3*(Math.round(y*63)*64+Math.round(x*63));
            message+=' Local swatch RGB '+[0,1,2].map(i=>rgb.charCodeAt(offset+i)).join(', ')+'.';
        }
        statusLine.textContent=message;
    }
    if(images.length>1){menu('Plate',images.map((_,i)=>'View '+(i+1)),v=>{view=v;draw();});slider('Overlay other plate',0,1,0,v=>{blend=v;draw();},.05);}
    const horizontal=slider('Across (%)',0,100,50,v=>{x=v/100;draw();});
    const vertical=slider('Down (%)',0,100,50,v=>{y=v/100;draw();});
    slider('Magnification',1,3,1,v=>{zoom=v;draw();},.1);
    button(study.action,place);
    button('Undo last mark',()=>{points.pop();draw();statusLine.textContent=points.length+' marks remaining.';});
    canvas.onpointerdown=e=>{
        if(!images[view].naturalWidth)return;
        const r=canvas.getBoundingClientRect(),box=imageBox(images[view]);
        const px=((e.clientX-r.left)*960/r.width-box[0])/box[2],py=((e.clientY-r.top)*550/r.height-box[1])/box[3];
        if(px<0||px>1||py<0||py>1)return;
        x=px;y=py;horizontal.value=x*100;vertical.value=y*100;place();
    };
    statusLine.textContent=study.task;
})();
