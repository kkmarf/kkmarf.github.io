/**
 * 泡泡动画效果脚本
 * 为标签/专栏泡泡添加真实的不规则布朗运动效果和物理碰撞
 */

document.addEventListener('DOMContentLoaded', function() {
    const bubbleContainer = document.getElementById('bubbleContainer');
    if (!bubbleContainer) return;
    
    // 将 NodeList 转换为 Array 以便更好操作
    const bubbles = Array.from(bubbleContainer.querySelectorAll('.bubble-item'));
    if (bubbles.length === 0) return;
    
    // 初始化物理系统
    initPhysics(bubbles);
    
    // 监听窗口大小变化，重新计算初始位置
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateInitialPositions(bubbles);
        }, 200);
    });
    
    // 启动动画循环
    startAnimationLoop(bubbles);
});

/**
 * 初始化物理参数
 */
function initPhysics(bubbles) {
    bubbles.forEach((bubble) => {
        // 初始化不规则运动参数
        bubble.physics = {
            // 振幅 (运动范围) - 已大幅减小幅度，更细腻
            ampX1: Math.random() * 8 + 4,
            ampX2: Math.random() * 5 + 2,
            ampY1: Math.random() * 10 + 5, 
            ampY2: Math.random() * 6 + 3,
            
            // 频率 (运动速度)
            freqX1: Math.random() * 0.001 + 0.0005,
            freqX2: Math.random() * 0.002 + 0.001,
            freqY1: Math.random() * 0.001 + 0.0005,
            freqY2: Math.random() * 0.002 + 0.001,
            
            // 相位
            phaseX1: Math.random() * Math.PI * 2,
            phaseX2: Math.random() * Math.PI * 2,
            phaseY1: Math.random() * Math.PI * 2,
            phaseY2: Math.random() * Math.PI * 2,
            
            // 状态
            isHovering: false,
            scale: 1,
            baseZIndex: 1,
            
            // 实时物理坐标
            x: 0,
            y: 0,
            // 渲染相关
            renderX: 0,
            renderY: 0
        };
        
        // 绑定交互事件
        bindEvents(bubble);
    });
    
    // 获取初始位置
    updateInitialPositions(bubbles);
}

/**
 * 更新所有泡泡的初始布局位置（锚点）
 * @param {Array} bubbles 
 */
function updateInitialPositions(bubbles) {
    // 暂时移除 transform 以获取真实 DOM 布局位置
    // 使用 requestAnimationFrame 确保在下一帧获取
    bubbles.forEach(b => b.style.transform = '');
    
    // 强制同步获取布局
    // document.body.offsetHeight; // force reflow (Optional, offsetLeft usually triggers it)
    
    bubbles.forEach(bubble => {
        // 计算相对于容器的坐标（中心点）
        // bubble.offsetLeft 是相对于最近定位父元素的位置，这里是 bubbleContainer
        bubble.physics.initialX = bubble.offsetLeft + bubble.offsetWidth / 2;
        bubble.physics.initialY = bubble.offsetTop + bubble.offsetHeight / 2;
        bubble.physics.radius = bubble.offsetWidth / 2;
        
        // 初始化当前位置
        bubble.physics.x = bubble.physics.initialX;
        bubble.physics.y = bubble.physics.initialY;
    });
}

/**
 * 绑定鼠标事件
 */
function bindEvents(bubble) {
    bubble.addEventListener('mouseenter', () => {
        bubble.physics.isHovering = true;
        bubble.physics.scale = 1.15;
        bubble.style.zIndex = 100;
        // 悬停时稍微增加一点“质量”或排斥半径，让周围的泡泡让开
    });
    
    bubble.addEventListener('mouseleave', () => {
        bubble.physics.isHovering = false;
        bubble.physics.scale = 1;
        setTimeout(() => {
            if (!bubble.physics.isHovering) {
               bubble.style.zIndex = bubble.physics.baseZIndex;
            }
        }, 300);
    });
}

/**
 * 启动动画循环 (包含碰撞检测)
 */
function startAnimationLoop(bubbles) {
    function animate(timestamp) {
        const t = timestamp;
        
        // 1. 更新预期位置 (基于噪声/正弦波的自然浮动)
        bubbles.forEach(bubble => {
            const p = bubble.physics;
            
            // 计算自然浮动偏移
            const floatX = 
                p.ampX1 * Math.sin(t * p.freqX1 + p.phaseX1) + 
                p.ampX2 * Math.cos(t * p.freqX2 + p.phaseX2);
                
            const floatY = 
                p.ampY1 * Math.sin(t * p.freqY1 + p.phaseY1) + 
                p.ampY2 * Math.cos(t * p.freqY2 + p.phaseY2);
            
            // 更新理想位置 = 锚点 + 浮动
            p.x = p.initialX + floatX;
            p.y = p.initialY + floatY;
        });
        
        // 2. 物理碰撞解决 (Position Based Dynamics)
        // 迭代多次以解决复杂的连锁碰撞
        const iterations = 3;
        for (let k = 0; k < iterations; k++) {
            for (let i = 0; i < bubbles.length; i++) {
                for (let j = i + 1; j < bubbles.length; j++) {
                    const b1 = bubbles[i];
                    const b2 = bubbles[j];
                    const p1 = b1.physics;
                    const p2 = b2.physics;
                    
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const distSq = dx * dx + dy * dy;
                    
                    // 碰撞半径 = 两半径之和 + 缓冲空间(padding)
                    // 增加一点 padding 让它们不要贴得太紧
                    const padding = 12; 
                    const minDist = p1.radius + p2.radius + padding;
                    
                    // 如果发生碰撞/重叠
                    if (distSq < minDist * minDist && distSq > 0.1) {
                        const dist = Math.sqrt(distSq);
                        const overlap = minDist - dist;
                        
                        // 归一化碰撞向量
                        const nx = dx / dist;
                        const ny = dy / dist;
                        
                        // 将两个泡泡推开
                        // 按比例分配位移 (这里简单均分 0.5)
                        const separationX = nx * overlap * 0.5;
                        const separationY = ny * overlap * 0.5;
                        
                        // 应用修正
                        // 如果其中一个是悬停状态，我们让它更“重”一点，少移动一点，让未悬停的泡泡多让开
                        let weight1 = 0.5;
                        let weight2 = 0.5;
                        
                        if (p1.isHovering && !p2.isHovering) { weight1 = 0.1; weight2 = 0.9; }
                        if (!p1.isHovering && p2.isHovering) { weight1 = 0.9; weight2 = 0.1; }
                        
                        p1.x -= nx * overlap * weight1;
                        p1.y -= ny * overlap * weight1;
                        p2.x += nx * overlap * weight2;
                        p2.y += ny * overlap * weight2;
                    }
                }
            }
        }
        
        // 3. 应用渲染
        bubbles.forEach(bubble => {
            const p = bubble.physics;
            
            // 计算最终偏移量 (当前物理位置 - 布局锚点位置)
            const finalOffsetX = p.x - p.initialX;
            const finalOffsetY = p.y - p.initialY;
            
            // 悬停时的额外升力
            const hoverLift = p.isHovering ? -15 : 0;
            
            // 简单的旋转效果
            const rotate = finalOffsetX * 0.15;
            
            // 使用平滑过渡 (LERP) 避免碰撞修正带来的抖动 (可选，这里直接应用)
            p.renderX = finalOffsetX;
            p.renderY = finalOffsetY + hoverLift;
            
            bubble.style.transform = 
                `translate3d(${p.renderX.toFixed(2)}px, ${p.renderY.toFixed(2)}px, 0) scale(${p.scale}) rotate(${rotate.toFixed(2)}deg)`;
        });
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
}
