const photos = await fetch('film-sequence.json').then(response => {if(!response.ok) throw new Error('Unable to load photographs');return response.json()});
const frame = document.querySelector('#frame');
const previous = document.querySelector('.previous');
const next = document.querySelector('.next');
const message = document.querySelector('.load-message');
const progress = document.querySelector('.chapter-progress');
let position = 0;
let request = 0;
let displayed = 0;
const chapters = [...new Set(photos.map(photo => photo.chapter))];
chapters.forEach((chapter, index) => {
 const button = document.createElement('button');
 button.type = 'button';
 button.setAttribute('aria-label', `Go to ${chapter}`);
 button.title = chapter;
 button.setAttribute('aria-current', String(index === 0));
 button.addEventListener('click', () => show(photos.findIndex(photo => photo.chapter === chapter)));
 progress.append(button);
});
async function show(index) {
 position = Math.max(0, Math.min(photos.length - 1, index));
 const token = ++request;
 const target = position;
 const photo = photos[target];
 const image = new Image();
 image.src = photo.src;
 message.textContent = 'Loading photograph…';
 try { await image.decode(); } catch {
  if(token === request) {position = displayed;message.textContent = 'Couldn’t load this photograph. Please try again.';}
  return;
 }
 if(token !== request) return;
 frame.src = photo.src;
 frame.alt = photo.alt;
 displayed = target;
 document.querySelector('#chapter').textContent = photo.chapter;
 document.querySelector('#photo-title').textContent = photo.title;
 document.querySelector('#photo-counter').textContent = `${String(target+1).padStart(2,'0')} / ${photos.length}`;
 document.querySelector('#original').href = photo.src;
 previous.disabled = target === 0;
 next.disabled = target === photos.length-1;
 [...progress.children].forEach((button,i) => button.setAttribute('aria-current',String(chapters[i] === photo.chapter)));
 message.textContent = '';
 for(const neighbor of [photos[target+1],photos[target-1]]) if(neighbor) {const preload = new Image();preload.src = neighbor.src;}
}
previous.addEventListener('click', () => show(position-1));
next.addEventListener('click', () => show(position+1));
document.addEventListener('keydown', event => {
 if(event.altKey || event.metaKey || event.ctrlKey) return;
 if(event.key === 'ArrowRight') {event.preventDefault();show(position+1);}
 if(event.key === 'ArrowLeft') {event.preventDefault();show(position-1);}
});
let touch = null;
const stage = document.querySelector('.photo-stage');
stage.addEventListener('pointerdown',event => {if(event.pointerType==='touch')touch={x:event.clientX,y:event.clientY};});
stage.addEventListener('pointerup',event => {if(!touch)return;const dx=event.clientX-touch.x,dy=event.clientY-touch.y;touch=null;if(Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.5)show(position+(dx<0?1:-1));});
stage.addEventListener('pointercancel',()=>{touch=null;});
show(0);
