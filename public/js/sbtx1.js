/* ====== 可配置项 ====== */
const EMOJIS = ['🥳','😀','😂','😆','😊','🤩','🤗','🤠'];
const FONT_SIZE = 24;
const LIFE_TIME = 600;      // 2秒生命周期
const GRAVITY = 0.05;        // 非常轻微的重力
const MAX_COUNT = 100;        // 增加最大粒子数
const SCALE_SPEED = 0.05;  // 非常缓慢的缩小
const FADE_START = 0.4;      // 从70%生命周期开始淡出
/* ====================== */

// DOM加载后执行
document.addEventListener('DOMContentLoaded', function() {
    const css = document.createElement('style');
    css.textContent = `
        .em-cursor {
            position: fixed;
            font-size: ${FONT_SIZE}px;
            line-height: 1;
            pointer-events: none;
            z-index: 9999;
            will-change: transform, opacity;
            user-select: none;
            transform-origin: center center;
        }
    `;
    document.head.appendChild(css);

    const particles = [];
    
    function createParticle(x, y){
        if(particles.length >= MAX_COUNT){
            // 移除最旧的粒子
            const oldParticle = particles.shift();
            if(oldParticle.element.parentNode){
                document.body.removeChild(oldParticle.element);
            }
        }
        
        const el = document.createElement('div');
        el.className = 'em-cursor';
        el.textContent = EMOJIS[Math.random()*EMOJIS.length|0];
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.opacity = '1';
        el.style.transform = 'translate(-50%, -50%) scale(1)';
        document.body.appendChild(el);
        
        const particle = {
            element: el,
            x: x,
            y: y,
            vy: 0,  // 初始速度为0，直接开始下落
            scale: 1,
            born: performance.now(),
            life: 1
        };
        
        particles.push(particle);
        return particle;
    }

    function updateParticles(now){
        for(let i = particles.length - 1; i >= 0; i--){
            const p = particles[i];
            const age = now - p.born;
            
            if(age > LIFE_TIME){
                // 移除过期粒子
                if(p.element.parentNode){
                    document.body.removeChild(p.element);
                }
                particles.splice(i, 1);
                continue;
            }
            
            // 计算生命进度
            const lifeProgress = age / LIFE_TIME;
            p.life = 1 - lifeProgress;
            
            // 缓慢下落 - 速度随年龄增加而轻微增加
            p.vy = lifeProgress * 0.5;  // 最大下落速度0.5px/帧
            p.y += p.vy;
            
            // 缓慢缩小 - 在最后20%生命周期才明显缩小
            let scaleProgress = lifeProgress;
            if(scaleProgress < 0.8){
                scaleProgress = 0;  // 前80%生命周期基本不缩小
            } else {
                scaleProgress = (scaleProgress - 0.8) * 5; // 最后20%加速缩小
            }
            p.scale = Math.max(0.3, 1 - scaleProgress * 0.7);
            
            // 淡出效果 - 在最后30%生命周期才开始淡出
            let fadeProgress = lifeProgress;
            if(fadeProgress < FADE_START){
                fadeProgress = 0;  // 前70%生命周期不淡出
            } else {
                fadeProgress = (fadeProgress - FADE_START) / (1 - FADE_START);
            }
            const opacity = 1 - fadeProgress;
            
            // 应用变换
            p.element.style.opacity = opacity;
            p.element.style.transform = `translate(-50%, -50%) scale(${p.scale})`;
            p.element.style.top = p.y + 'px';
        }
        
        requestAnimationFrame(updateParticles);
    }

    // 鼠标/触摸移动事件
    document.addEventListener('mousemove', function(e){
        createParticle(e.clientX, e.clientY);
    });
    
    document.addEventListener('touchmove', function(e){
        e.preventDefault();
        if(e.touches.length > 0){
            createParticle(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });

    // 开始动画循环
    requestAnimationFrame(updateParticles);
    
    // 预创建一些粒子
    for(let i = 0; i < 10; i++){
        setTimeout(() => {
            createParticle(
                window.innerWidth * Math.random(),
                window.innerHeight * Math.random()
            );
        }, i * 100);
    }
});
