'use strict';
const mount = document.querySelector('#experiment');
const controls = document.createElement('div');
controls.className = 'controls';
const statusLine = document.createElement('output');
statusLine.setAttribute('aria-live', 'polite');
mount.append(controls, statusLine);

function button(title, action) {
    const element = document.createElement('button');
    element.textContent = title;
    element.addEventListener('click', action);
    controls.append(element);
    return element;
}
function field(title, input) {
    const label = document.createElement('label');
    input.id = 'field-' + controls.children.length;
    label.htmlFor = input.id;
    label.append(title + ' ', input);
    controls.append(label);
    return input;
}
function slider(title, min, max, value, change, step = 1) {
    const input = document.createElement('input');
    Object.assign(input, {type:'range',min,max,value,step});
    input.addEventListener('input', () => change(Number(input.value)));
    return field(title,input);
}
function menu(title, choices, change) {
    const input = document.createElement('select');
    choices.forEach((s,i) => input.add(new Option(s,i)));
    input.addEventListener('change', () => change(Number(input.value)));
    return field(title,input);
}
function board(description) {
    const canvas = document.createElement('canvas');
    canvas.width = 960; canvas.height = 320;
    canvas.setAttribute('role','img'); canvas.setAttribute('aria-label',description);
    mount.prepend(canvas);
    return canvas.getContext('2d');
}
const mint='#95dfc3', gold='#f2c777', coral='#eaa895', white='#e0eee6';
function clear(g) { g.fillStyle='#172d2b'; g.fillRect(0,0,960,320); }
function line(g, pts, color=mint, width=3) {
    g.beginPath(); pts.forEach(([x,y],i) => i ? g.lineTo(x,y) : g.moveTo(x,y));
    g.lineWidth=width; g.strokeStyle=color; g.stroke();
}
function dot(g,x,y,r,color=gold) { g.beginPath();g.arc(x,y,r,0,2*Math.PI);g.fillStyle=color;g.fill(); }
function labelAt(g,text,x,y,color=white) {g.fillStyle=color;g.font='19px system-ui';g.fillText(text,x,y);}
function curve(count,fn) {return Array.from({length:count},(_,i)=>fn(i/(count-1),i));}
