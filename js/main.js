/**
 * 辩论赛网页交互脚本
 * 功能：矩阵雨效果、动画、滚动交互
 * 主题：黑客帝国风格 - 丧尸互联网理论
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initPageLoader();
    initMatrixRain();
    initSmoothScrolling();
    initScrollAnimations();
    initTypingEffect();
    initMobileMenu();
    initScrollProgress();
    initParticles();
    initNavbarAnimations();
    initEnhancedAnimations();
});

/**
 * 矩阵雨背景效果
 */
function initMatrixRain() {
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    // 设置画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 矩阵字符集
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}".split("");
    const font_size = 10;
    const columns = canvas.width / font_size;
    const drops = [];

    // 初始化每列的起始位置
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    // 绘制函数
    function draw() {
        // 创建拖尾效果
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 设置文字样式
        ctx.fillStyle = '#00ff41';
        ctx.font = font_size + 'px monospace';

        // 绘制每一列的字符
        for (let i = 0; i < drops.length; i++) {
            const text = matrix[Math.floor(Math.random() * matrix.length)];
            ctx.fillText(text, i * font_size, drops[i] * font_size);

            // 随机重置列（创建不同长度的"雨滴"）
            if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // 开始动画（约28.5 FPS）
    setInterval(draw, 35);
}

/**
 * 平滑滚动功能
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * 滚动动画 - 元素进入视窗时淡入
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

/**
 * 主标题打字机效果
 */
function initTypingEffect() {
    const title = document.querySelector('.main-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '2px solid var(--matrix-green)';
    title.style.paddingRight = '5px';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 120);
        } else {
            // 打字完成后停止光标闪烁
            setTimeout(() => {
                title.style.borderRight = 'none';
                title.style.paddingRight = '0';
            }, 2000);
        }
    }
    
    // 延迟开始打字效果
    setTimeout(typeWriter, 1500);
}

/**
 * 工具函数：更新选手信息
 * @param {string} side - 'positive' 或 'negative'
 * @param {Array} debaters - 辩手信息数组 [{role: '一辩', name: '张三'}, ...]
 */
function updateDebaters(side, debaters) {
    const teamCard = document.querySelector(`.team-${side}`);
    if (!teamCard) return;
    
    const debaterElements = teamCard.querySelectorAll('.debater');
    
    debaters.forEach((debater, index) => {
        if (debaterElements[index]) {
            const nameElement = debaterElements[index].querySelector('.debater-name');
            if (nameElement) {
                nameElement.textContent = debater.name;
            }
        }
    });
}

/**
 * 工具函数：更新比赛结果
 * @param {Object} results - 比赛结果对象
 */
function updateResults(results) {
    const resultsContainer = document.querySelector('.results-container');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = `
        <div class="results-placeholder">🏆 比赛结果</div>
        <div class="results-content">
            <div class="winner-section">
                <h3>获胜队伍：${results.winner}</h3>
                <p>最佳辩手：${results.bestDebater}</p>
            </div>
            <div class="highlights-section">
                <h4>精彩瞬间</h4>
                <ul>
                    ${results.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
            </div>
            <div class="comments-section">
                <h4>评委点评</h4>
                <p>${results.judgeComments}</p>
            </div>
        </div>
    `;
}

/**
 * 工具函数：添加新的规则项
 * @param {string} title - 规则标题
 * @param {string} description - 规则描述
 */
function addRuleItem(title, description) {
    const rulesGrid = document.querySelector('.rules-grid');
    if (!rulesGrid) return;
    
    const ruleItem = document.createElement('div');
    ruleItem.className = 'rule-item fade-in';
    ruleItem.innerHTML = `
        <div class="rule-title">${title}</div>
        <p>${description}</p>
    `;
    
    rulesGrid.appendChild(ruleItem);
}

/**
 * 移动端菜单功能
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (!mobileMenuBtn || !navLinks) return;

    // 切换菜单状态
    function toggleMenu() {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // 防止背景滚动
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // 关闭菜单
    function closeMenu() {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 绑定事件
    mobileMenuBtn.addEventListener('click', toggleMenu);

    // 点击菜单项时关闭菜单
    navLinksItems.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // 点击菜单外区域关闭菜单
    navLinks.addEventListener('click', (e) => {
        if (e.target === navLinks) {
            closeMenu();
        }
    });

    // ESC键关闭菜单
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });

    // 窗口大小改变时关闭移动端菜单
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

/**
 * 导出工具函数供外部使用
 */
window.DebateUtils = {
    updateDebaters,
    updateResults,
    addRuleItem
};

/**
 * 页面加载动画
 */
function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    
    // 检查是否是从其他页面返回
    const referrer = document.referrer;
    const currentHost = window.location.hostname;
    const isFromDetailPage = referrer.includes('detail.html') || 
                            referrer.includes('mobile.html') ||
                            referrer.includes(currentHost);
    
    // 检查浏览器导航类型
    const isBackNavigation = (performance.navigation && performance.navigation.type === 2) ||
                             (performance.getEntriesByType && 
                              performance.getEntriesByType('navigation')[0]?.type === 'back_forward');
    
    // 检查会话存储中是否有访问标记
    const hasVisited = sessionStorage.getItem('hasVisitedMain');
    
    if (isFromDetailPage || isBackNavigation || hasVisited) {
        // 如果是返回访问，立即隐藏加载器
        loader.style.display = 'none';
        startPageAnimations();
    } else {
        // 首次访问，显示加载动画并设置访问标记
        sessionStorage.setItem('hasVisitedMain', 'true');
        setTimeout(() => {
            loader.classList.add('hidden');
            // 加载完成后启动页面动画
            setTimeout(() => {
                loader.style.display = 'none';
                startPageAnimations();
            }, 500);
        }, 1000);
    }
}

/**
 * 启动页面动画
 */
function startPageAnimations() {
    // 逐渐显示页面元素
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, index * 100);
    });
}

/**
 * 滚动进度条
 */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

/**
 * 背景粒子效果
 */
function initParticles() {
    const container = document.getElementById('particlesContainer');
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机位置和动画延迟
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        
        container.appendChild(particle);
        
        // 动画结束后移除粒子
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 20000);
    }
    
    // 定期创建粒子
    setInterval(createParticle, 500);
}

/**
 * 导航栏增强动画
 */
function initNavbarAnimations() {
    const nav = document.querySelector('.nav');
    let lastScrollTop = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        // 添加滚动状态类
        if (scrollTop > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // 自动隐藏/显示导航栏
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
        
        // 清除之前的超时，设置新的超时
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            nav.classList.remove('hidden');
        }, 1000);
    });
    
    // 鼠标悬浮时显示导航栏
    nav.addEventListener('mouseenter', () => {
        nav.classList.remove('hidden');
    });
}

/**
 * 增强动画效果
 */
function initEnhancedAnimations() {
    // 延迟加载动画类
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // 添加可见性类
                if (element.classList.contains('fade-in') ||
                    element.classList.contains('slide-in-left') ||
                    element.classList.contains('slide-in-right') ||
                    element.classList.contains('scale-in')) {
                    
                    setTimeout(() => {
                        element.classList.add('visible');
                    }, 100);
                }
                
                // 停止观察已经显示的元素
                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);
    
    // 观察所有动画元素
    const animationElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animationElements.forEach(el => {
        animationObserver.observe(el);
    });
    
    // 鼠标跟踪效果
    initMouseTracker();
    
    // 键盘快捷键
    initKeyboardShortcuts();
}

/**
 * 鼠标跟踪效果
 */
function initMouseTracker() {
    let mouseTracker = null;
    
    // 创建鼠标跟踪元素
    function createMouseTracker() {
        mouseTracker = document.createElement('div');
        mouseTracker.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(0, 255, 65, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            display: none;
        `;
        document.body.appendChild(mouseTracker);
    }
    
    createMouseTracker();
    
    document.addEventListener('mousemove', (e) => {
        if (mouseTracker) {
            mouseTracker.style.display = 'block';
            mouseTracker.style.left = (e.clientX - 10) + 'px';
            mouseTracker.style.top = (e.clientY - 10) + 'px';
        }
    });
    
    document.addEventListener('mouseleave', () => {
        if (mouseTracker) {
            mouseTracker.style.display = 'none';
        }
    });
    
    // 在交互元素上增强效果
    document.querySelectorAll('.interactive-element').forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (mouseTracker) {
                mouseTracker.style.transform = 'scale(2)';
                mouseTracker.style.background = 'radial-gradient(circle, rgba(0, 255, 65, 0.8) 0%, transparent 70%)';
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (mouseTracker) {
                mouseTracker.style.transform = 'scale(1)';
                mouseTracker.style.background = 'radial-gradient(circle, rgba(0, 255, 65, 0.6) 0%, transparent 70%)';
            }
        });
    });
}

/**
 * 键盘快捷键
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + 数字键快速导航
        if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const sections = ['#home', '#topic', '#teams', '#rules', '#survey', '#results'];
            const index = parseInt(e.key) - 1;
            if (sections[index]) {
                document.querySelector(sections[index]).scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // ESC 键返回顶部
        if (e.key === 'Escape') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

/**
 * 增强的打字机效果
 */
function initEnhancedTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--matrix-green)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // 打字完成后闪烁光标
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // 延迟开始打字效果
        setTimeout(typeWriter, 2000);
    });
}

/**
 * 性能监控和优化
 */
function initPerformanceOptimization() {
    // 检测用户的性能偏好
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // 禁用复杂动画
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        return;
    }
    
    // 检测设备性能
    const isLowPerformance = () => {
        const memory = navigator.deviceMemory;
        const cores = navigator.hardwareConcurrency;
        return (memory && memory < 4) || (cores && cores < 4);
    };
    
    if (isLowPerformance()) {
        // 降低动画复杂度
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
        
        // 禁用粒子效果
        const particlesContainer = document.getElementById('particlesContainer');
        if (particlesContainer) {
            particlesContainer.style.display = 'none';
        }
    }
}

// 初始化性能优化
initPerformanceOptimization();
