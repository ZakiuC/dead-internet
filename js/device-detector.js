/**
 * 设备检测和页面跳转脚本
 * 检测移动设备并自动跳转到移动端页面
 */

(function() {
    'use strict';
    
    /**
     * 检测是否为移动设备
     */
    function isMobileDevice() {
        // 检测用户代理字符串
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = [
            'mobile', 'android', 'iphone', 'ipad', 'ipod', 
            'blackberry', 'opera mini', 'windows phone', 
            'silk', 'kindle', 'phone'
        ];
        
        const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
        
        // 检测屏幕尺寸（宽度小于768px认为是移动设备）
        const isMobileScreen = window.innerWidth <= 768;
        
        // 检测触摸支持
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // 综合判断
        return isMobileUA || (isMobileScreen && isTouchDevice);
    }
    
    /**
     * 检测是否已经在移动端页面或强制显示桌面版
     */
    function isOnMobilePage() {
        return window.location.pathname.includes('mobile.html') || 
               window.location.search.includes('mobile=true');
    }
    
    /**
     * 检测是否强制显示桌面版
     */
    function isForceDesktop() {
        return window.location.search.includes('force_desktop=true');
    }
    
    /**
     * 跳转到移动端页面
     */
    function redirectToMobile() {
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const currentHash = window.location.hash;
        
        // 构建移动端URL
        const mobileUrl = currentPath.replace('index.html', 'mobile.html') + 
                         (currentPath.endsWith('/') ? 'mobile.html' : '') +
                         currentSearch + currentHash;
        
        // 跳转到移动端页面
        window.location.href = mobileUrl;
    }
    
    /**
     * 主函数：检测并跳转
     */
    function checkAndRedirect() {
        // 如果强制显示桌面版，则不跳转
        if (isForceDesktop()) {
            return;
        }
        
        // 如果是移动设备且不在移动端页面，则跳转
        if (isMobileDevice() && !isOnMobilePage()) {
            // 添加小延迟以确保页面加载完成
            setTimeout(redirectToMobile, 100);
        }
    }
    
    // 页面加载完成后执行检测
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndRedirect);
    } else {
        checkAndRedirect();
    }
    
    // 监听窗口大小变化（用户旋转设备等情况）
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (!isForceDesktop() && isMobileDevice() && !isOnMobilePage()) {
                redirectToMobile();
            }
        }, 500);
    });
    
})();
