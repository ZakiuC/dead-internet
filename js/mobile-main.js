/**
 * 移动端辩论赛网页交互脚本
 * 功能：矩阵雨效果、移动端导航、滚动动画
 * 主题：黑客帝国风格 - 丧尸互联网理论
 * 专为移动设备优化
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有移动端功能
    initMobileMatrixRain();
    initMobileNavigation();
    initSmoothScrolling();
    initMobileScrollAnimations();
    initMobileTouchOptimizations();
});

/**
 * 移动端优化的矩阵雨背景效果
 */
function initMobileMatrixRain() {
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    // 设置画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 移动端优化的矩阵字符集（减少字符数量以提升性能）
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*".split("");
    const font_size = 12; // 移动端稍大的字体
    const columns = Math.floor(canvas.width / font_size);
    const drops = [];

    // 初始化每列的起始位置
    for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * -100; // 随机起始位置
    }

    let animationId;
    let lastTime = 0;
    const frameRate = 1000 / 20; // 降低到20FPS以节省移动设备电量

    // 绘制函数
    function draw(currentTime) {
        if (currentTime - lastTime >= frameRate) {
            // 创建拖尾效果（移动端降低透明度以提升性能）
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 设置文字样式
            ctx.fillStyle = '#00ff41';
            ctx.font = font_size + 'px monospace';

            // 绘制每一列的字符
            for (let i = 0; i < drops.length; i++) {
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                const x = i * font_size;
                const y = drops[i] * font_size;
                
                ctx.fillText(text, x, y);

                // 随机重置列
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            
            lastTime = currentTime;
        }
        
        animationId = requestAnimationFrame(draw);
    }

    // 开始动画
    animationId = requestAnimationFrame(draw);

    // 页面可见性API - 当页面不可见时暂停动画以节省电量
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        } else {
            animationId = requestAnimationFrame(draw);
        }
    });
}

/**
 * 移动端导航功能
 */
function initMobileNavigation() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.mobile-nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !navMenu) return;

    // 切换菜单显示/隐藏
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });

    // 点击导航链接后关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 如果是页面内跳转，关闭菜单
            if (this.getAttribute('href').startsWith('#')) {
                closeMenu();
            }
        });
    });

    // 点击菜单外部区域关闭菜单
    navMenu.addEventListener('click', function(e) {
        if (e.target === navMenu) {
            closeMenu();
        }
    });

    // 监听ESC键关闭菜单
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    function toggleMenu() {
        const isActive = menuToggle.classList.contains('active');
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        menuToggle.classList.add('active');
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = ''; // 恢复背景滚动
    }

    // 处理设备旋转
    window.addEventListener('orientationchange', function() {
        setTimeout(closeMenu, 100); // 旋转后关闭菜单
    });
}

/**
 * 平滑滚动功能
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = 60; // 固定导航栏高度
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 移动端滚动动画
 */
function initMobileScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px' // 移动端减少边距
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.mobile-section, .topic-card, .team, .rule-item, .mobile-survey-container');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

/**
 * 移动端触摸优化
 */
function initMobileTouchOptimizations() {
    // 防止双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // 防止长按选择文本（除了可编辑区域）
    document.addEventListener('selectstart', function(e) {
        if (!e.target.closest('input, textarea, [contenteditable]')) {
            e.preventDefault();
        }
    });

    // 优化触摸反馈
    const touchElements = document.querySelectorAll('.nav-link, .footer-link, .mobile-menu-toggle, .mobile-link-button');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.opacity = '';
            }, 150);
        });
        
        element.addEventListener('touchcancel', function() {
            this.style.opacity = '';
        });
    });
}

/**
 * 移动端性能监控和优化
 */
function initPerformanceOptimizations() {
    // 检测低端设备并调整动画
    const isLowEndDevice = () => {
        const memory = navigator.deviceMemory;
        const cores = navigator.hardwareConcurrency;
        return (memory && memory < 4) || (cores && cores < 4);
    };

    if (isLowEndDevice()) {
        // 在低端设备上禁用或简化动画
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
        
        // 减少矩阵雨效果
        const canvas = document.getElementById('matrix');
        if (canvas) {
            canvas.style.opacity = '0.02';
        }
    }

    // 监听电池状态（如果支持）
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            function updateBatteryOptimization() {
                if (battery.level < 0.2 || !battery.charging) {
                    // 电量低时禁用矩阵雨动画
                    const canvas = document.getElementById('matrix');
                    if (canvas) {
                        canvas.style.display = 'none';
                    }
                }
            }
            
            battery.addEventListener('levelchange', updateBatteryOptimization);
            battery.addEventListener('chargingchange', updateBatteryOptimization);
            updateBatteryOptimization();
        });
    }
}

// 初始化性能优化
initPerformanceOptimizations();

/**
 * 移动端返回桌面版功能
 */
function addDesktopVersionLink() {
    // 在移动端页面添加"查看桌面版"的功能
    const desktopLinks = document.querySelectorAll('a[href="index.html"]');
    desktopLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 可以在这里添加确认对话框
            const userConfirm = confirm('是否切换到桌面版？桌面版在移动设备上可能显示效果不佳。');
            if (!userConfirm) {
                e.preventDefault();
            } else {
                // 添加参数防止自动跳转回移动版
                this.href = 'index.html?force_desktop=true';
            }
        });
    });
}

// 初始化桌面版链接
addDesktopVersionLink();
