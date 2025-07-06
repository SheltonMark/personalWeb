// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    
    // 全局变量存储所有部分的数据和当前显示数量
    const sectionData = {
        growth: { data: [], displayCount: 3 },
        people: { data: [], displayCount: 3 },
        museums: { data: [], displayCount: 3 },
        travels: { data: [], displayCount: 3 }
    };
    
    // 动态加载网站内容
    async function loadSiteContent() {
        try {
            const response = await fetch('/api/content');
            const data = await response.json();
            
            // 应用系统配置
            if (data && data.settings) {
                applySystemSettings(data.settings);
            }
            
            if (data && data.sections) {
                // 加载成长部分
                loadGrowthSection(data.sections.growth || []);
                // 加载相遇部分
                loadPeopleSection(data.sections.people || []);
                // 加载博物馆部分
                loadMuseumsSection(data.sections.museums || []);
                // 加载旅行部分
                loadTravelsSection(data.sections.travels || []);
            }
        } catch (error) {
            console.log('加载内容失败，使用默认内容:', error);
        }
    }
    
    // 应用系统设置
    function applySystemSettings(settings) {
        // 应用主题设置
        if (settings.appearance && settings.appearance.theme) {
            applyTheme(settings.appearance.theme);
        }
        
        // 应用基本设置
        if (settings.basic) {
            const basic = settings.basic;
            
            // 更新页面标题
            if (basic.siteName) {
                document.title = basic.siteName;
            }
            
            // 更新导航栏标题
            if (basic.navTitle) {
                const logoText = document.querySelector('.logo-text');
                if (logoText) {
                    logoText.textContent = basic.navTitle;
                }
            }
            
            // 更新主页标题
            if (basic.heroTitle) {
                const heroTitle = document.querySelector('.hero-title');
                if (heroTitle) {
                    const lines = basic.heroTitle.split('\n');
                    heroTitle.innerHTML = lines.map(line => `<span class="title-line">${line}</span>`).join('');
                }
            }
            
            // 更新主页副标题
            if (basic.heroSubtitle) {
                const heroSubtitle = document.querySelector('.hero-subtitle');
                if (heroSubtitle) {
                    heroSubtitle.textContent = basic.heroSubtitle;
                }
            }
            
            // 更新头像
            if (basic.avatar) {
                updateUserAvatar(basic.avatar);
            }
            
            // 更新页脚信息
            if (basic.footerText) {
                const footerText = document.querySelector('.footer p');
                if (footerText) {
                    footerText.textContent = basic.footerText;
                }
            }
        }
        
        // 应用板块设置
        if (settings.sections) {
            applySectionSettings(settings.sections);
        }
    }
    
    // 全局变量存储动效状态
    let yellowFlowerEffects = {
        stars: null,
        particles: null,
        cursorGlow: null,
        isActive: false
    };

    // 应用主题
    function applyTheme(theme) {
        if (theme && theme.name) {
            const previousTheme = document.documentElement.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', theme.name);
            console.log(`已应用主题: ${theme.name}`);
            
            // 处理黄色花朵主题的动效
            if (theme.name === '黄色花朵') {
                if (!yellowFlowerEffects.isActive) {
                    initYellowFlowerEffects();
                }
            } else {
                // 其他主题移除黄色花朵动效
                if (yellowFlowerEffects.isActive) {
                    removeYellowFlowerEffects();
                }
            }
        }
    }

    // 初始化黄色花朵主题动效
    function initYellowFlowerEffects() {
        if (yellowFlowerEffects.isActive) return;
        
        console.log('初始化黄色花朵主题动效');
        yellowFlowerEffects.isActive = true;
        
        // 创建星星背景
        createYellowStars();
        
        // 创建粒子效果
        createYellowParticles();
        
        // 创建鼠标跟随光圈
        createCursorGlow();
    }

    // 移除黄色花朵主题动效
    function removeYellowFlowerEffects() {
        if (!yellowFlowerEffects.isActive) return;
        
        console.log('移除黄色花朵主题动效');
        yellowFlowerEffects.isActive = false;
        
        // 移除星星
        if (yellowFlowerEffects.stars) {
            yellowFlowerEffects.stars.remove();
            yellowFlowerEffects.stars = null;
        }
        
        // 移除粒子
        if (yellowFlowerEffects.particles) {
            yellowFlowerEffects.particles.remove();
            yellowFlowerEffects.particles = null;
        }
        
        // 移除鼠标光圈
        if (yellowFlowerEffects.cursorGlow) {
            yellowFlowerEffects.cursorGlow.remove();
            yellowFlowerEffects.cursorGlow = null;
        }
    }

    // 创建黄色星星背景
    function createYellowStars() {
        const starsContainer = document.createElement('div');
        starsContainer.id = 'yellow-stars';
        starsContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            background-image: 
                radial-gradient(circle at 15% 25%, #f4d03f 2px, transparent 2px),
                radial-gradient(circle at 85% 15%, #f7dc6f 1.5px, transparent 1.5px),
                radial-gradient(circle at 25% 60%, #f4d03f 2.5px, transparent 2.5px),
                radial-gradient(circle at 75% 80%, #f7dc6f 2px, transparent 2px),
                radial-gradient(circle at 40% 35%, #f4d03f 1px, transparent 1px),
                radial-gradient(circle at 90% 45%, #f7dc6f 2px, transparent 2px);
            background-size: 
                200px 200px, 150px 150px, 180px 180px, 220px 220px, 120px 120px, 160px 160px;
            background-position: 
                0 0, 50px 30px, 100px 80px, 150px 120px, 200px 20px, 30px 150px;
            background-attachment: fixed;
        `;
        
        document.body.appendChild(starsContainer);
        yellowFlowerEffects.stars = starsContainer;
        
        // 添加动态星星
        for (let i = 0; i < 20; i++) {
            const star = document.createElement('div');
            star.className = 'yellow-star';
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: #f4d03f;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: star-twinkle ${Math.random() * 3 + 2}s infinite ease-in-out;
                animation-delay: ${Math.random() * 2}s;
            `;
            starsContainer.appendChild(star);
        }
    }

    // 创建黄色粒子效果
    function createYellowParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.id = 'yellow-particles';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
        `;
        
        document.body.appendChild(particlesContainer);
        yellowFlowerEffects.particles = particlesContainer;
        
        // 创建粒子
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'yellow-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: #f7dc6f;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particle-float ${Math.random() * 4 + 3}s infinite linear;
                animation-delay: ${Math.random() * 2}s;
                opacity: ${Math.random() * 0.6 + 0.4};
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // 创建鼠标跟随光圈
    function createCursorGlow() {
        // 触摸设备不显示鼠标跟随效果
        if ('ontouchstart' in window) {
            return;
        }
        
        const cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        cursorGlow.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            background: radial-gradient(circle, rgba(244, 208, 63, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            mix-blend-mode: screen;
        `;
        
        document.body.appendChild(cursorGlow);
        yellowFlowerEffects.cursorGlow = cursorGlow;
        
        // 鼠标移动事件
        document.addEventListener('mousemove', function(e) {
            cursorGlow.style.left = e.clientX - 20 + 'px';
            cursorGlow.style.top = e.clientY - 20 + 'px';
        });
        
        // 悬停效果
        const hoverElements = document.querySelectorAll('.card, .nav-link, .music-btn, button, a');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursorGlow.style.transform = 'scale(1.5)';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(244, 208, 63, 0.5) 0%, transparent 70%)';
            });
            element.addEventListener('mouseleave', function() {
                cursorGlow.style.transform = 'scale(1)';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(244, 208, 63, 0.3) 0%, transparent 70%)';
            });
        });
    }
    
    // 更新用户头像
    function updateUserAvatar(avatarUrl) {
        // 在导航栏logo区域添加头像
        const navLogo = document.querySelector('.nav-logo');
        if (navLogo && avatarUrl) {
            // 检查是否已存在头像
            let avatarElement = document.querySelector('.user-avatar');
            if (!avatarElement) {
                avatarElement = document.createElement('div');
                avatarElement.className = 'user-avatar';
                avatarElement.innerHTML = `<img src="${avatarUrl.startsWith('/') ? avatarUrl : '/' + avatarUrl}" alt="用户头像">`;
                // 将头像插入到logo文字前面
                navLogo.insertBefore(avatarElement, navLogo.firstChild);
            } else {
                const img = avatarElement.querySelector('img');
                if (img) {
                    img.src = avatarUrl.startsWith('/') ? avatarUrl : '/' + avatarUrl;
                }
            }
        }
    }
    
    // 应用板块设置
    function applySectionSettings(sections) {
        const titleMappings = {
            growthTitle: '#growth .section-title',
            peopleTitle: '#people .section-title', 
            museumTitle: '#museum .section-title',
            travelTitle: '#travel .section-title',
            photosTitle: '#photos .section-title'
        };
        
        const subtitleMappings = {
            growthSubtitle: '#growth .title-subtitle',
            peopleSubtitle: '#people .title-subtitle',
            museumSubtitle: '#museum .title-subtitle',
            travelSubtitle: '#travel .title-subtitle',
            photosSubtitle: '#photos .title-subtitle'
        };
        
        // 更新标题
        Object.entries(titleMappings).forEach(([key, selector]) => {
            if (sections[key]) {
                const element = document.querySelector(selector);
                if (element) {
                    // 保留图标，只更新文本
                    const icon = element.querySelector('.title-icon');
                    const subtitle = element.querySelector('.title-subtitle');
                    const iconHtml = icon ? icon.outerHTML : '';
                    const subtitleHtml = subtitle ? subtitle.outerHTML : '';
                    element.innerHTML = `${iconHtml}${sections[key]}${subtitleHtml}`;
                }
            }
        });
        
        // 更新副标题
        Object.entries(subtitleMappings).forEach(([key, selector]) => {
            if (sections[key]) {
                const element = document.querySelector(selector);
                if (element) {
                    element.textContent = sections[key];
                }
            }
        });
    }
    
    // 生成成长部分内容
    function loadGrowthSection(growthData) {
        const growthContainer = document.querySelector('#growth .cards-grid');
        if (!growthContainer || !growthData.length) return;
        
        // 存储成长数据
        sectionData.growth.data = growthData;
        
        // 显示指定数量的内容
        displaySectionItems('growth');
    }
    
    // 生成相遇部分内容
    function loadPeopleSection(peopleData) {
        const peopleContainer = document.querySelector('#people .cards-grid');
        if (!peopleContainer || !peopleData.length) return;
        
        // 存储相遇数据
        sectionData.people.data = peopleData;
        
        // 显示指定数量的内容
        displaySectionItems('people');
    }
    
    // 生成博物馆部分内容
    function loadMuseumsSection(museumsData) {
        const museumsContainer = document.querySelector('#museum .cards-grid');
        if (!museumsContainer || !museumsData.length) return;
        
        // 存储博物馆数据
        sectionData.museums.data = museumsData;
        
        // 显示指定数量的内容
        displaySectionItems('museums');
    }
    
    // 生成旅行部分内容
    function loadTravelsSection(travelsData) {
        const travelsContainer = document.querySelector('#travel .cards-grid');
        if (!travelsContainer || !travelsData.length) return;
        
        // 存储旅行数据
        sectionData.travels.data = travelsData;
        
        // 显示指定数量的内容
        displaySectionItems('travels');
    }



    // 通用的文章显示函数
    function displaySectionItems(sectionName) {
        const containerMapping = {
            'growth': '#growth .cards-grid',
            'people': '#people .cards-grid',
            'museums': '#museum .cards-grid',
            'travels': '#travel .cards-grid'
        };
        
        const container = document.querySelector(containerMapping[sectionName]);
        if (!container || !sectionData[sectionName].data.length) return;
        
        const data = sectionData[sectionName].data;
        const displayCount = sectionData[sectionName].displayCount;
        const displayItems = data.slice(0, displayCount);
        
        // 生成卡片HTML
        container.innerHTML = displayItems.map(item => {
            return generateCardHTML(sectionName, item);
        }).join('');
        
        // 更新查看更多按钮
        updateViewMoreButton(sectionName);
    }
    
    // 生成卡片HTML
    function generateCardHTML(sectionName, item) {
        const truncateText = (text, maxLength = 50) => {
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        };
        
        // 标准化图片路径
        const getImageSrc = (imagePath) => {
            if (!imagePath) return '';
            const normalizedPath = imagePath.startsWith('/') || imagePath.startsWith('http') ? imagePath : '/' + imagePath;
            return `src="${normalizedPath}" onerror="this.style.display='none'; this.parentElement.classList.add('image-error')"`;
        };
        
        switch(sectionName) {
            case 'growth':
                return `
                    <div class="card card-hover" onclick="openArticle('growth', ${item.id})">
                        <div class="card-header">
                            <div class="card-icon">${item.icon}</div>
                            <h3>${item.title}</h3>
                        </div>
                        <div class="card-content">
                            <p>${truncateText(item.description)}</p>
                            <div class="card-date">${item.date}</div>
                            ${item.tags && item.tags.length > 0 ? `
                                <div class="card-tags">
                                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            case 'people':
                return `
                    <div class="card card-hover" onclick="openArticle('people', ${item.id})">
                        <div class="card-header">
                            <div class="card-icon">${item.icon}</div>
                            <h3>${item.title}</h3>
                        </div>
                        <div class="card-content">
                            <p>${truncateText(item.description)}</p>
                            <div class="people-tags">
                                ${(item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `;
            case 'museums':
                return `
                    <div class="card card-hover museum-card" onclick="openArticle('museums', ${item.id})">
                        <div class="card-image">
                            <img ${getImageSrc(item.image)} alt="${item.title}">
                        </div>
                        <div class="card-content">
                            <h3>${item.title}</h3>
                            <p>${truncateText(item.description)}</p>
                            <div class="museum-info">
                                <span class="visit-date">📅 ${item.date}</span>
                                <span class="museum-type">${item.type}</span>
                            </div>
                            ${item.tags && item.tags.length > 0 ? `
                                <div class="card-tags">
                                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            case 'travels':
                return `
                    <div class="card card-hover travel-card" onclick="openArticle('travels', ${item.id})">
                        <div class="card-image">
                            <img ${getImageSrc(item.image)} alt="${item.title}">
                        </div>
                        <div class="card-content">
                            <h3>${item.title}</h3>
                            <p>${truncateText(item.description)}</p>
                            <div class="travel-info">
                                <span class="travel-date">🗓 ${item.date}</span>
                                <span class="travel-location">🌍 ${item.location}</span>
                            </div>
                            ${item.tags && item.tags.length > 0 ? `
                                <div class="card-tags">
                                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            default:
                return '';
        }
    }
    
    // 更新查看更多按钮
    function updateViewMoreButton(sectionName) {
        const buttonMapping = {
            'growth': '#growth .view-more-btn',
            'people': '#people .view-more-btn',
            'museums': '#museum .view-more-btn',
            'travels': '#travel .view-more-btn'
        };
        
        const viewMoreBtn = document.querySelector(buttonMapping[sectionName]);
        if (!viewMoreBtn) return;
        
        const data = sectionData[sectionName].data;
        const displayCount = sectionData[sectionName].displayCount;
        
        if (displayCount >= data.length) {
            viewMoreBtn.style.display = 'none';
        } else {
            viewMoreBtn.style.display = 'block';
            viewMoreBtn.innerHTML = `
                <i class="fas fa-chevron-down"></i>
                查看更多 (${data.length - displayCount}篇)
            `;
        }
    }



    // 将函数设置为全局，以便HTML中的onclick可以访问
    window.openArticle = function(type, id) {
        window.location.href = `/pages/article-detail.html?type=${type}&id=${id}`;
    };

    window.loadMoreItems = function(sectionName) {
        const section = sectionData[sectionName];
        if (section && section.displayCount < section.data.length) {
            section.displayCount += 3; // 每次显示3篇更多内容
            displaySectionItems(sectionName);
            
            // 平滑滚动到新加载的内容
            setTimeout(() => {
                const containerMapping = {
                    'growth': '#growth .cards-grid',
                    'people': '#people .cards-grid',
                    'museums': '#museum .cards-grid',
                    'travels': '#travel .cards-grid'
                };
                
                const newCards = document.querySelectorAll(containerMapping[sectionName] + ' .card');
                if (newCards.length > 0) {
                    const scrollIndex = Math.max(0, section.displayCount - 6);
                    const targetCard = newCards[scrollIndex];
                    if (targetCard) {
                        targetCard.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start',
                            inline: 'nearest'
                        });
                    }
                }
            }, 100);
        }
    };



    // 打开文章列表页
    function openArticleList() {
        window.location.href = '/pages/article-list.html';
    }
    
    // 3D樱花雨效果 (基于参考代码优化)
    function createSakura() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        // 将canvas添加到樱花容器中
        const sakuraContainer = document.querySelector('.sakura-container');
        sakuraContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const cherries = [];
        
        // 参数设置
        const INIT_CHERRY_BLOSSOM_COUNT = 25;
        const MAX_ADDING_INTERVAL = 8;
        const FOCUS_POSITION = 300;
        const FAR_LIMIT = 600;
        const MAX_RIPPLE_COUNT = 80;
        const RIPPLE_RADIUS = 100;
        const SURFACE_RATE = 0.5;
        const SINK_OFFSET = 20;
        
        let width = canvas.width;
        let height = canvas.height;
        let maxAddingInterval;
        let addingInterval;
        
        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            maxAddingInterval = Math.round(MAX_ADDING_INTERVAL * 1000 / width);
            addingInterval = maxAddingInterval;
        }
        
        // 樱花花瓣类
        class CherryBlossom {
            constructor(isRandom = false) {
                this.init(isRandom);
            }
            
            getRandomValue(min, max) {
                return min + (max - min) * Math.random();
            }
            
            init(isRandom) {
                this.x = this.getRandomValue(-width, width);
                this.y = isRandom ? this.getRandomValue(0, height) : height * 1.5;
                this.z = this.getRandomValue(0, FAR_LIMIT);
                this.vx = this.getRandomValue(-2, 2);
                this.vy = -2;
                this.theta = this.getRandomValue(0, Math.PI * 2);
                this.phi = this.getRandomValue(0, Math.PI * 2);
                this.psi = 0;
                this.dpsi = this.getRandomValue(Math.PI / 600, Math.PI / 300);
                this.opacity = 0;
                this.endTheta = false;
                this.endPhi = false;
                this.rippleCount = 0;
                
                const axis = this.getAxis();
                let theta = this.theta + Math.ceil(-(this.y + height * SURFACE_RATE) / this.vy) * Math.PI / 500;
                theta %= Math.PI * 2;
                
                this.offsetY = 40 * ((theta <= Math.PI / 2 || theta >= Math.PI * 3 / 2) ? -1 : 1);
                this.thresholdY = height / 2 + height * SURFACE_RATE * axis.rate;
                
                // 创建樱花颜色渐变
                this.entityColor = ctx.createRadialGradient(0, 40, 0, 0, 40, 80);
                this.entityColor.addColorStop(0, `hsl(330, 70%, ${50 * (0.3 + axis.rate)}%)`);
                this.entityColor.addColorStop(0.05, `hsl(330, 40%, ${55 * (0.3 + axis.rate)}%)`);
                this.entityColor.addColorStop(1, `hsl(330, 20%, ${70 * (0.3 + axis.rate)}%)`);
                
                this.shadowColor = ctx.createRadialGradient(0, 40, 0, 0, 40, 80);
                this.shadowColor.addColorStop(0, `hsl(330, 40%, ${30 * (0.3 + axis.rate)}%)`);
                this.shadowColor.addColorStop(0.05, `hsl(330, 40%, ${30 * (0.3 + axis.rate)}%)`);
                this.shadowColor.addColorStop(1, `hsl(330, 20%, ${40 * (0.3 + axis.rate)}%)`);
            }
            
            getAxis() {
                const rate = FOCUS_POSITION / (this.z + FOCUS_POSITION);
                const x = width / 2 + this.x * rate;
                const y = height / 2 - this.y * rate;
                return { rate, x, y };
            }
            
            renderCherry(context, axis) {
                // 绘制樱花花瓣
                context.beginPath();
                context.moveTo(0, 40);
                context.bezierCurveTo(-60, 20, -10, -60, 0, -20);
                context.bezierCurveTo(10, -60, 60, 20, 0, 40);
                context.fill();
                
                // 绘制花瓣纹理
                for (let i = -4; i < 4; i++) {
                    context.beginPath();
                    context.moveTo(0, 40);
                    context.quadraticCurveTo(i * 12, 10, i * 4, -24 + Math.abs(i) * 2);
                    context.stroke();
                }
            }
            
            render() {
                const axis = this.getAxis();
                
                // 绘制水面涟漪效果
                if (axis.y >= this.thresholdY && this.rippleCount < MAX_RIPPLE_COUNT) {
                    ctx.save();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = `hsla(330, 60%, 80%, ${(MAX_RIPPLE_COUNT - this.rippleCount) / MAX_RIPPLE_COUNT * 0.6})`;
                    ctx.translate(axis.x + this.offsetY * axis.rate * (this.theta <= Math.PI ? -1 : 1), axis.y);
                    ctx.scale(1, 0.3);
                    ctx.beginPath();
                    ctx.arc(0, 0, this.rippleCount / MAX_RIPPLE_COUNT * RIPPLE_RADIUS * axis.rate, 0, Math.PI * 2, false);
                    ctx.stroke();
                    ctx.restore();
                    this.rippleCount++;
                }
                
                // 绘制樱花阴影
                if (axis.y < this.thresholdY || (!this.endTheta || !this.endPhi)) {
                    if (this.y <= 0) {
                        this.opacity = Math.min(this.opacity + 0.01, 1);
                    }
                    ctx.save();
                    ctx.globalAlpha = this.opacity * 0.3;
                    ctx.fillStyle = this.shadowColor;
                    ctx.strokeStyle = `hsl(330, 30%, ${40 * (0.3 + axis.rate)}%)`;
                    ctx.translate(axis.x, Math.max(axis.y, this.thresholdY + this.thresholdY - axis.y));
                    ctx.rotate(Math.PI - this.theta);
                    ctx.scale(axis.rate * -Math.sin(this.phi), axis.rate);
                    ctx.translate(0, this.offsetY);
                    this.renderCherry(ctx, axis);
                    ctx.restore();
                }
                
                // 绘制樱花主体
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.entityColor;
                ctx.strokeStyle = `hsl(330, 40%, ${70 * (0.3 + axis.rate)}%)`;
                ctx.translate(axis.x, axis.y + Math.abs(SINK_OFFSET * Math.sin(this.psi) * axis.rate));
                ctx.rotate(this.theta);
                ctx.scale(axis.rate * Math.sin(this.phi), axis.rate);
                ctx.translate(0, this.offsetY);
                this.renderCherry(ctx, axis);
                ctx.restore();
                
                // 更新樱花状态
                this.updateMotion(axis);
                
                return this.z > -FOCUS_POSITION && this.z < FAR_LIMIT && this.x < width * 1.5;
            }
            
            updateMotion(axis) {
                // 控制角度变化
                if (this.y <= -height / 4) {
                    if (!this.endTheta) {
                        for (let theta = Math.PI / 2; theta <= Math.PI * 3 / 2; theta += Math.PI) {
                            if (this.theta < theta && this.theta + Math.PI / 200 > theta) {
                                this.theta = theta;
                                this.endTheta = true;
                                break;
                            }
                        }
                    }
                    if (!this.endPhi) {
                        for (let phi = Math.PI / 8; phi <= Math.PI * 7 / 8; phi += Math.PI * 3 / 4) {
                            if (this.phi < phi && this.phi + Math.PI / 200 > phi) {
                                this.phi = Math.PI / 8;
                                this.endPhi = true;
                                break;
                            }
                        }
                    }
                }
                
                // 更新角度
                if (!this.endTheta) {
                    if (axis.y >= this.thresholdY) {
                        this.theta += Math.PI / 200 * ((this.theta < Math.PI / 2 || (this.theta >= Math.PI && this.theta < Math.PI * 3 / 2)) ? 1 : -1);
                    } else {
                        this.theta += Math.PI / 500;
                    }
                    this.theta %= Math.PI * 2;
                }
                
                if (this.endPhi) {
                    if (this.rippleCount >= MAX_RIPPLE_COUNT) {
                        this.psi += this.dpsi;
                        this.psi %= Math.PI * 2;
                    }
                } else {
                    this.phi += Math.PI / (axis.y >= this.thresholdY ? 200 : 500);
                    this.phi %= Math.PI;
                }
                
                // 更新位置
                if (this.y <= -height * SURFACE_RATE) {
                    this.x += 2;
                    this.y = -height * SURFACE_RATE;
                } else {
                    this.x += this.vx;
                    this.y += this.vy;
                }
            }
        }
        
        // 初始化樱花
        function initCherries() {
            for (let i = 0; i < Math.round(INIT_CHERRY_BLOSSOM_COUNT * width / 1000); i++) {
                cherries.push(new CherryBlossom(true));
            }
        }
        
        // 动画循环
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);
            
            // 排序樱花（按z轴深度）
            cherries.sort((cherry1, cherry2) => cherry1.z - cherry2.z);
            
            // 渲染樱花
            for (let i = cherries.length - 1; i >= 0; i--) {
                if (!cherries[i].render()) {
                    cherries.splice(i, 1);
                }
            }
            
            // 添加新樱花
            if (--addingInterval <= 0) {
                addingInterval = maxAddingInterval;
                cherries.push(new CherryBlossom(false));
            }
        }
        
        // 初始化
        resizeCanvas();
        initCherries();
        animate();
        
        // 监听窗口大小变化
        window.addEventListener('resize', resizeCanvas);
    }
    
    // 音乐播放控制
    function initMusicPlayer() {
        const musicToggle = document.getElementById('musicToggle');
        const bgMusic = document.getElementById('bgMusic');
        const musicStatus = document.getElementById('musicStatus');
        let isPlaying = false;
        
        // 如果音乐功能被禁用，隐藏音乐控制器
        if (window.musicEnabled === false) {
            if (musicToggle) musicToggle.style.display = 'none';
            if (musicStatus) musicStatus.style.display = 'none';
            return;
        }
        
        // 设置音量
        if (typeof window.musicVolume === 'number') {
            bgMusic.volume = window.musicVolume;
        } else {
            bgMusic.volume = 0.5; // 默认音量
        }
        
        // 尝试自动播放
        function attemptAutoplay() {
            bgMusic.play().then(() => {
                // 自动播放成功
                isPlaying = true;
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                musicToggle.classList.add('playing');
                musicStatus.textContent = '🎶 自动播放中...';
                console.log('音乐自动播放成功');
            }).catch((error) => {
                // 自动播放被阻止
                console.log('自动播放被浏览器阻止:', error);
                musicStatus.textContent = '🎵 点击开始播放';
                
                // 添加用户交互监听，首次点击时自动播放
                const enableAutoplay = () => {
                    bgMusic.play().then(() => {
                        isPlaying = true;
                        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                        musicToggle.classList.add('playing');
                        musicStatus.textContent = '🎶 正在播放...';
                    });
                    // 移除监听器，只在首次交互时触发
                    document.removeEventListener('click', enableAutoplay);
                    document.removeEventListener('keydown', enableAutoplay);
                };
                
                document.addEventListener('click', enableAutoplay, { once: true });
                document.addEventListener('keydown', enableAutoplay, { once: true });
            });
        }
        
        // 页面加载完成后尝试自动播放
        window.addEventListener('load', () => {
            // 检查是否启用自动播放
            if (window.musicEnabled !== false && window.musicAutoplay !== false) {
                setTimeout(attemptAutoplay, 1000); // 延迟1秒确保页面完全加载
            }
        });
        
        musicToggle.addEventListener('click', function() {
            if (isPlaying) {
                bgMusic.pause();
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
                musicToggle.classList.remove('playing');
                musicStatus.textContent = '🎵 点击播放音乐';
            } else {
                bgMusic.play().catch(function(error) {
                    console.log('音乐播放失败:', error);
                    musicStatus.textContent = '❌ 音乐加载失败';
                });
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                musicToggle.classList.add('playing');
                musicStatus.textContent = '🎶 正在播放...';
            }
            isPlaying = !isPlaying;
        });
        
        // 音乐加载成功事件
        bgMusic.addEventListener('loadeddata', function() {
            musicStatus.textContent = '🎵 音乐已准备好';
        });
        
        // 音乐播放事件
        bgMusic.addEventListener('play', function() {
            isPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            musicToggle.classList.add('playing');
            musicStatus.textContent = '🎶 正在播放...';
        });
        
        // 音乐暂停事件
        bgMusic.addEventListener('pause', function() {
            isPlaying = false;
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            musicToggle.classList.remove('playing');
            musicStatus.textContent = '⏸️ 音乐已暂停';
        });
        
        // 音乐结束事件
        bgMusic.addEventListener('ended', function() {
            musicToggle.classList.remove('playing');
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            musicStatus.textContent = '🎵 点击播放音乐';
            isPlaying = false;
        });
        
        // 键盘快捷键：空格键控制音乐
        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                musicToggle.click();
            }
        });
    }
    
    // 平滑滚动导航
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // 卡片动画观察器
    function initCardAnimations() {
        const cards = document.querySelectorAll('.card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'all 0.6s ease-out';
            observer.observe(card);
        });
    }
    
    // 导航栏滚动效果
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        // 如果是黄色花朵或明亮素雅主题，禁止滚动变色
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === '黄色花朵' || theme === '明亮素雅') {
            // 明亮素雅主题：白色半透明，黄色花朵主题：米黄色半透明
            if (theme === '明亮素雅') {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(253, 252, 248, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            }
            return;
        }
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(0, 0, 0, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(0, 0, 0, 0.9)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        });
    }
    
    // 鼠标跟随效果
    function initMouseFollower() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-follower';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(255, 107, 157, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });
        
        // 悬停在卡片上时放大
        const hoverElements = document.querySelectorAll('.card, .nav-link, .music-btn');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursor.style.transform = 'scale(2)';
            });
            element.addEventListener('mouseleave', function() {
                cursor.style.transform = 'scale(1)';
            });
        });
    }
    
    // 动态加载照片墙
    async function loadPhotoWall() {
        try {
            const response = await fetch('/api/content');
            const data = await response.json();
            
            if (data.settings && data.settings.media && data.settings.media.photoWall) {
                const photoWallData = data.settings.media.photoWall;
                const photoWallContainer = document.getElementById('photoWall');
                const previewImage = document.getElementById('preview-image');
                
                if (photoWallContainer) {
                    // 清空现有内容
                    photoWallContainer.innerHTML = '';
                    
                    // 转换照片数据为数组格式
                    const photoArray = Object.values(photoWallData);
                    
                    // 动态生成照片项
                    photoArray.forEach((photo, index) => {
                        const photoItem = document.createElement('div');
                        photoItem.className = 'photo-item';
                        photoItem.dataset.index = index;
                        
                        const img = document.createElement('img');
                        img.src = photo.src;
                        img.alt = photo.title;
                        
                        photoItem.appendChild(img);
                        photoWallContainer.appendChild(photoItem);
                    });
                    
                    // 设置默认预览图片
                    if (photoArray.length > 0 && previewImage) {
                        previewImage.src = photoArray[0].src;
                        previewImage.alt = photoArray[0].title;
                    }
                    
                    // 重新初始化照片墙交互
                    initPhotoWallInteractions(photoArray);
                }
            }
        } catch (error) {
            console.error('加载照片墙失败:', error);
        }
    }

    // 3D照片墙交互和预览功能
    function initPhotoWallInteractions(photoData) {
        const photoWall = document.querySelector('.photo-wall');
        const photoItems = document.querySelectorAll('.photo-item');
        const previewImage = document.getElementById('preview-image');
        
        if (photoWall && previewImage && photoData) {
            let isAutoRotating = true;
            let currentRotation = 0; // 跟踪当前旋转角度
            
            // 计算实际显示的照片索引
            function getVisiblePhotoIndex(itemIndex) {
                // 每个照片占60度，计算当前旋转后的实际位置
                const itemAngle = 60 * itemIndex;
                const totalRotation = (currentRotation % 360 + 360) % 360;
                const relativeAngle = (itemAngle - totalRotation + 360) % 360;
                
                // 返回视觉上最接近正面的照片索引
                return Math.floor(relativeAngle / 60);
            }
            
            // 监听动画旋转
            photoWall.addEventListener('animationiteration', () => {
                currentRotation += 360;
            });
            
            // 暂停/恢复旋转
            photoWall.addEventListener('mouseenter', function() {
                isAutoRotating = false;
                this.style.animationPlayState = 'paused';
                // 获取当前旋转角度
                const computedStyle = window.getComputedStyle(this);
                const transform = computedStyle.getPropertyValue('transform');
                const matrix = new DOMMatrix(transform);
                const angle = Math.round(Math.atan2(matrix.m12, matrix.m11) * (180/Math.PI));
                currentRotation = angle;
            });
            
            photoWall.addEventListener('mouseleave', function() {
                isAutoRotating = true;
                this.style.animationPlayState = 'running';
            });
            
            // 悬停照片显示预览
            photoItems.forEach((item, index) => {
                item.addEventListener('mouseenter', function() {
                    // 获取当前视觉上正面的照片索引
                    const visibleIndex = getVisiblePhotoIndex(index);
                    const photo = photoData[visibleIndex];
                    
                    if (photo) {
                        previewImage.src = photo.src;
                        
                        // 添加换图动画
                        previewImage.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            previewImage.style.transform = 'scale(1)';
                        }, 100);
                    }
                });

                // 鼠标离开时恢复默认预览图片
                item.addEventListener('mouseleave', function() {
                    // 获取当前视觉上正面的照片
                    const visibleIndex = getVisiblePhotoIndex(0);
                    const photo = photoData[visibleIndex];
                    
                    if (photo) {
                        previewImage.src = photo.src;
                        // 添加换图动画
                        previewImage.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            previewImage.style.transform = 'scale(1)';
                        }, 100);
                    }
                });
                
                // 点击照片查看大图模态框
                item.addEventListener('click', function() {
                    // 获取当前视觉上正面的照片索引
                    const visibleIndex = getVisiblePhotoIndex(index);
                    const photo = photoData[visibleIndex];
                    if (photo) {
                        showPhotoModal(photo.src, visibleIndex);
                    }
                });
            });
        }
    }
    
    // 照片模态框
    function showPhotoModal(imageSrc, index) {
        const modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(255, 107, 157, 0.3);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 30px;
            right: 30px;
            background: rgba(255, 107, 157, 0.8);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            color: white;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        modal.appendChild(img);
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);
        
        // 动画显示
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            img.style.transform = 'scale(1)';
        });
        
        // 关闭事件
        function closeModal() {
            modal.style.opacity = '0';
            img.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
    
    // 添加打字机效果到标题
    function initTypewriterEffect() {
        const titleLines = document.querySelectorAll('.title-line');
        
        titleLines.forEach((line, index) => {
            const text = line.textContent;
            line.textContent = '';
            line.style.borderRight = '2px solid #ff8fab';
            
            setTimeout(() => {
                let charIndex = 0;
                const typeInterval = setInterval(() => {
                    if (charIndex < text.length) {
                        line.textContent += text.charAt(charIndex);
                        charIndex++;
                    } else {
                        clearInterval(typeInterval);
                        line.style.borderRight = 'none';
                    }
                }, 100);
            }, index * 2000);
        });
    }
    
    // 添加粒子效果 - 简化版避免与樱花冲突
    function initParticleEffect() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5, // 更小的粒子
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.3 + 0.1 // 更透明
            };
        }
        
        function initParticles() {
            for (let i = 0; i < 30; i++) { // 减少粒子数量
                particles.push(createParticle());
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 139, 171, ${particle.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        resizeCanvas();
        initParticles();
        animateParticles();
        
        window.addEventListener('resize', resizeCanvas);
    }
    
    // 涟漪效果
    function initRippleEffect() {
        const waterEffect = document.querySelector('.water-effect');
        
        if (waterEffect) {
            waterEffect.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                ripple.style.left = (x - 100) + 'px'; // 居中涟漪
                ripple.style.top = (y - 100) + 'px';
                
                this.appendChild(ripple);
                
                // 动画结束后移除元素
                ripple.addEventListener('animationend', function() {
                    this.remove();
                });
            });
        }
    }
    
    // 动态加载音乐配置
    async function loadMusicConfig() {
        try {
            const response = await fetch('/api/content');
            const settings = await response.json();
            
            // 获取音乐配置，优先使用新格式(settings.music)，如果不存在则使用旧格式(settings.media)
            let musicSettings = settings.settings.music;
            if (!musicSettings) {
                const mediaSettings = settings.settings.media;
                if (mediaSettings) {
                    musicSettings = {
                        enabled: true,
                        autoplay: mediaSettings.autoPlay,
                        loop: mediaSettings.loopPlay,
                        volume: mediaSettings.defaultVolume / 100,
                        url: mediaSettings.musicFile,
                        title: "背景音乐",
                        artist: ""
                    };
                }
            }
            
            if (musicSettings) {
                const bgMusic = document.getElementById('bgMusic');
                const musicToggle = document.getElementById('musicToggle');
                const musicStatus = document.getElementById('musicStatus');
                
                // 设置全局配置变量
                window.musicEnabled = musicSettings.enabled;
                window.musicAutoplay = musicSettings.autoplay;
                window.musicVolume = musicSettings.volume !== undefined ? musicSettings.volume : 0.5;
                
                if (bgMusic) {
                    // 检查音乐功能是否启用
                    if (musicSettings.enabled === false) {
                        // 隐藏音乐控制器
                        if (musicToggle) musicToggle.style.display = 'none';
                        if (musicStatus) musicStatus.style.display = 'none';
                        return;
                    }
                    
                    // 动态设置音乐文件路径
                    if (musicSettings.url) {
                        const source = bgMusic.querySelector('source');
                        if (source) {
                            source.src = musicSettings.url;
                            bgMusic.load(); // 重新加载音频
                        }
                    }
                    
                    // 设置音量
                    bgMusic.volume = window.musicVolume;
                    
                    // 设置循环播放
                    if (musicSettings.loop !== undefined) {
                        bgMusic.loop = musicSettings.loop;
                    }
                    
                    // 设置音乐标题
                    if (musicSettings.title && musicStatus) {
                        const titleText = musicSettings.title;
                        const artistText = musicSettings.artist ? ` - ${musicSettings.artist}` : '';
                        musicStatus.title = `${titleText}${artistText}`;
                    }
                }
            }
        } catch (error) {
            console.error('加载音乐配置失败:', error);
            // 如果加载失败，设置默认值
            window.musicEnabled = true;
            window.musicAutoplay = true;
            window.musicVolume = 0.5;
        }
    }
    
    // 初始化所有功能
    async function init() {
        // 首先加载网站内容
        await loadSiteContent();
        
        createSakura();
        await loadMusicConfig(); // 先加载音乐配置
        initMusicPlayer();
        initSmoothScroll();
        
        // 内容加载后再初始化动画
        setTimeout(() => {
        initCardAnimations();
        }, 100);
        
        initNavbarScroll();
        initMouseFollower();
        loadPhotoWall();
        initTypewriterEffect();
        initParticleEffect();
        initRippleEffect(); // 添加涟漪效果
        
        // 根据当前主题初始化动效
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === '黄色花朵') {
            initYellowFlowerEffects();
        }
        
        // 监听设置更新
        initSettingsListener();
        
        // 添加加载完成类
        document.body.classList.add('loaded');
    }
    
    // 初始化设置更新监听器
    function initSettingsListener() {
        // 监听来自后台管理的消息
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SETTINGS_UPDATED') {
                console.log('收到设置更新通知，重新加载设置...');
                reloadSettings();
            } else if (event.data && event.data.type === 'CONTENT_UPDATED') {
                console.log('收到内容更新通知，重新加载内容...');
                reloadContent();
            }
        });
        
        // 监听localStorage变化（用于跨标签页通信）
        window.addEventListener('storage', (event) => {
            if (event.key === 'settingsUpdated') {
                console.log('检测到设置更新，重新加载...');
                reloadSettings();
                // 清除标记
                localStorage.removeItem('settingsUpdated');
            } else if (event.key === 'contentUpdated') {
                console.log('检测到内容更新，重新加载...');
                reloadContent();
                // 清除标记
                localStorage.removeItem('contentUpdated');
            }
        });
        
        // 监听BroadcastChannel消息
        if ('BroadcastChannel' in window) {
            const settingsChannel = new BroadcastChannel('settings-update');
            settingsChannel.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'SETTINGS_UPDATED') {
                    console.log('通过BroadcastChannel收到设置更新通知');
                    reloadSettings();
                }
            });
            
            const contentChannel = new BroadcastChannel('content-update');
            contentChannel.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'CONTENT_UPDATED') {
                    console.log('通过BroadcastChannel收到内容更新通知');
                    reloadContent();
                }
            });
        }
    }
    
    // 重新加载设置
    async function reloadSettings() {
        try {
            const response = await fetch('/api/content');
            const data = await response.json();
            
            if (data && data.settings) {
                // 重新加载音乐配置
                await loadMusicConfig();
                // 重新初始化音乐播放器
                initMusicPlayer();
                
                // 重新加载照片墙
                await loadPhotoWall();
                
                // 应用其他系统设置
                applySystemSettings(data.settings);
                
                // 处理主题动效更新
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (currentTheme === '黄色花朵') {
                    if (!yellowFlowerEffects.isActive) {
                        initYellowFlowerEffects();
                    }
                } else {
                    if (yellowFlowerEffects.isActive) {
                        removeYellowFlowerEffects();
                    }
                }
                
                console.log('设置已实时更新');
                
                // 显示更新提示
                showUpdateNotification('设置已更新！');
            }
        } catch (error) {
            console.error('重新加载设置失败:', error);
        }
    }

    // 重新加载内容
    async function reloadContent() {
        try {
            const response = await fetch('/api/content');
            const data = await response.json();
            
            if (data && data.sections) {
                // 重新加载所有内容板块
                loadGrowthSection(data.sections.growth || []);
                loadPeopleSection(data.sections.people || []);
                loadMuseumsSection(data.sections.museums || []);
                loadTravelsSection(data.sections.travels || []);
                
                console.log('内容已实时更新');
                
                // 显示更新提示
                showUpdateNotification('内容已更新！');
            }
        } catch (error) {
            console.error('重新加载内容失败:', error);
        }
    }
    
    // 显示更新通知
    function showUpdateNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        document.body.appendChild(notification);
        
        // 动画显示
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 3秒后自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // 启动
    init();
    
    // 添加键盘快捷键（导航）
    document.addEventListener('keydown', function(e) {
        // 数字键快速导航
        if (e.key >= '1' && e.key <= '5') {
            const navLinks = document.querySelectorAll('.nav-link');
            const index = parseInt(e.key) - 1;
            if (navLinks[index]) {
                navLinks[index].click();
            }
        }
    });
    
    // 添加触摸设备支持
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // 移除鼠标跟随效果（触摸设备不需要）
        const cursorFollower = document.querySelector('.cursor-follower');
        if (cursorFollower) {
            cursorFollower.remove();
        }
    }
    
    // 性能优化：节流滚动事件
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(function() {
            // 可以在这里添加其他滚动相关的操作
        }, 16); // 约60fps
    });
    
    console.log('🌸 小清新个人网站已加载完成 🌸');
}); 