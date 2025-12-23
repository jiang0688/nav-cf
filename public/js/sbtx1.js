<script>
/*  Emoji-cursor Mini  */
(()=>{
  /* ====== 可配置项 ====== */
  const EMOJIS = ['🥳','😀','😂','😆','😊','🤩','🤗','🤠'];
  const FONT_SIZE = 24;               // px 
  const LIFE_TIME = 800;              // ms 
  const GRAVITY = 0.25;               // px / frame² 
  const MAX_COUNT = 60;               // 同时存在的粒子上限 
  /* ====================== */
 
  const css = document.createElement('style');
  css.textContent = `
    .em-cursor{position:fixed;top:0;left:0;font-size:${FONT_SIZE}px;
    line-height:1;pointer-events:none;z-index:9999;will-change:transform;
    user-select:none;}
  `;
  document.head.appendChild(css);
 
  const pool = [];                    // DOM 池 
  let pointer = 0;                    // 池指针 
 
  /* 借/还 DOM 节点 */
  function alloc(){
    if(pool.length < MAX_COUNT){
      const el = document.createElement('div');
      el.className = 'em-cursor';
      document.body.appendChild(el);
      pool.push(el);
    }
    return pool[pointer = (pointer+1)%MAX_COUNT];
  }
 
  /* 新建粒子 */
  function spark(x,y){
    const el = alloc();
    el.style.opacity = 1;
    el.textContent = EMOJIS[Math.random()*EMOJIS.length|0];
    el._y  = y;
    el._vy = -3 - Math.random()*3;
    el._born = performance.now();
  }
 
  /* 每帧更新 */
  function frame(now){
    pool.forEach(el=>{
      if(!el._born) return;
      const age = now - el._born;
      if(age > LIFE_TIME){ el._born=0; return; }
      el._vy += GRAVITY;
      el._y  += el._vy;
      const s = 1 - age/LIFE_TIME;          // 缩放 & 淡出没写，可自行加 
      el.style.transform = `translate(${el.offsetLeft}px,${el._y}px)`;
    });
    requestAnimationFrame(frame);
  }
 
  /* 统一指针事件 */
  const move = e=>{
    const t = e.touches?.[0] || e;
    spark(t.clientX, t.clientY);
  };
  addEventListener('mousemove', move);
  addEventListener('touchmove', move);
 
  requestAnimationFrame(frame);
})();
</script>
