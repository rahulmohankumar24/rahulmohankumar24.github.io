for(const toggle of document.querySelectorAll('.scroll-toggle')){
 const paper=toggle.closest('.paper-scroll'),content=document.getElementById(toggle.getAttribute('aria-controls'));
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));paper.classList.toggle('is-open',open);content.inert=!open;content.setAttribute('aria-hidden',String(!open));toggle.querySelector('.scroll-action').textContent=open?'Close −':'Open ↗';});
}
