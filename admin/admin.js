// 后台管理系统 JavaScript

class AdminSystem {
    constructor() {
        this.isLoggedIn = false;
        this.currentSection = '';
        this.currentItem = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkLoginStatus();
        this.loadDashboardData();
    }

    // 绑定事件
    bindEvents() {
        // 登录表单
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // 退出登录
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // 侧边栏导航
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.switchPage(page);
            });
        });

        // 内容标签页
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // 新建内容按钮
        const addArticleBtn = document.getElementById('addArticleBtn');
        if (addArticleBtn) {
            addArticleBtn.addEventListener('click', () => {
                this.openEditModal('add', 'articles');
            });
        }

        // 各个section的新建按钮
        document.querySelectorAll('.section-add-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                this.openEditModal('add', section);
            });
        });

        // 编辑表单提交
        const editForm = document.getElementById('editForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveItem();
            });
        }

        // 模态框背景点击关闭
        const editModal = document.getElementById('editModal');
        if (editModal) {
            editModal.addEventListener('click', (e) => {
                if (e.target === editModal) {
                    this.closeEditModal();
                }
            });
        }

        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('editModal');
                if (modal && modal.classList.contains('show')) {
                    this.closeEditModal();
                }
            }
        });

        // 设置表单
        const basicSettingsForm = document.getElementById('basicSettingsForm');
        if (basicSettingsForm) {
            basicSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveBasicSettings();
            });
        }
        
        const sectionsSettingsForm = document.getElementById('sectionsSettingsForm');
        if (sectionsSettingsForm) {
            sectionsSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveSectionsSettings();
            });
        }
        
        const appearanceSettingsForm = document.getElementById('appearanceSettingsForm');
        if (appearanceSettingsForm) {
            appearanceSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveAppearanceSettings();
            });
        }
        
        const mediaSettingsForm = document.getElementById('mediaSettingsForm');
        if (mediaSettingsForm) {
            mediaSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveMediaSettings();
            });
        }

        // 照片墙配置表单
        const photowallSettingsForm = document.getElementById('photowallSettingsForm');
        if (photowallSettingsForm) {
            photowallSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSavePhotoWallSettings();
            });
        }

        // 背景音乐配置表单
        const musicSettingsForm = document.getElementById('musicSettingsForm');
        if (musicSettingsForm) {
            musicSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveMusicSettings();
            });
        }

        // 设置页面标签页切换
        document.querySelectorAll('.settings-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchSettingsTab(tab);
            });
        });

        // 照片输入框实时预览
        for (let i = 1; i <= 6; i++) {
            const input = document.getElementById(`photo${i}Src`);
            if (input) {
                input.addEventListener('input', () => {
                    this.updatePhotoPreview(i, input.value);
                });
            }
        }

        // 音乐输入框实时预览
        const musicUrlInput = document.getElementById('musicUrl');
        if (musicUrlInput) {
            musicUrlInput.addEventListener('input', () => {
                this.updateMusicPreview(musicUrlInput.value);
            });
        }

        // 音量控制实时更新
        const musicVolumeInput = document.getElementById('musicVolume');
        const volumeValue = document.getElementById('volumeValue');
        if (musicVolumeInput && volumeValue) {
            musicVolumeInput.addEventListener('input', () => {
                const volume = (musicVolumeInput.value * 100).toFixed(0);
                volumeValue.textContent = volume + '%';
                
                // 同步更新预览音频的音量
                const audioPreview = document.getElementById('audioPreview');
                if (audioPreview) {
                    audioPreview.volume = musicVolumeInput.value;
                }
            });
        }

        // 文件上传
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.background = '#f0f4ff';
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.background = 'white';
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.background = 'white';
                const files = e.dataTransfer.files;
                this.handleFileUpload(files);
            });

            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    }

    // 检查登录状态
    checkLoginStatus() {
        const saved = localStorage.getItem('adminLoggedIn');
        if (saved === 'true') {
            this.showAdminPanel();
        } else {
            this.showLoginModal();
        }
    }

    // 处理登录
    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // 简单的验证（实际项目中应该使用更安全的验证）
        if (username === 'admin' && password === '123456') {
            localStorage.setItem('adminLoggedIn', 'true');
            this.showAdminPanel();
            this.showMessage('登录成功！', 'success');
        } else {
            this.showMessage('用户名或密码错误！', 'error');
        }
    }

    // 处理退出登录
    handleLogout() {
        localStorage.removeItem('adminLoggedIn');
        this.showLoginModal();
        this.showMessage('已退出登录', 'info');
    }

    // 显示登录模态框
    showLoginModal() {
        document.getElementById('loginModal').classList.add('show');
        document.getElementById('adminPanel').style.display = 'none';
    }

    // 显示管理面板
    showAdminPanel() {
        document.getElementById('loginModal').classList.remove('show');
        document.getElementById('adminPanel').style.display = 'flex';
        this.loadDashboardData();
    }

    // 切换页面
    switchPage(page) {
        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // 显示对应页面
        document.querySelectorAll('.content-page').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(page).classList.add('active');

        // 加载页面数据
        if (page === 'content') {
            this.loadContentData();
        } else if (page === 'media') {
            this.loadMediaData();
        } else if (page === 'settings') {
            this.loadUserSettings();
        }
    }

    // 切换标签页
    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-tab`).classList.add('active');

        // 加载对应的数据
        switch(tab) {
            case 'articles':
                this.loadArticles();
                break;
            case 'growth':
                this.loadSectionItems('growth');
                break;
            case 'people':
                this.loadSectionItems('people');
                break;
            case 'museums':
                this.loadSectionItems('museums');
                break;
            case 'travels':
                this.loadSectionItems('travels');
                break;
            case 'tags':
                this.loadTags();
                break;
        }
    }

    // 加载数据统计
    async loadDashboardData() {
        try {
            const response = await fetch('/api/data');
            const data = await response.json();
            
            // 更新各个section的统计数据
            const articleCount = data.sections.articles ? data.sections.articles.length : 0;
            const growthCount = data.sections.growth ? data.sections.growth.length : 0;
            const peopleCount = data.sections.people ? data.sections.people.length : 0;
            const museumCount = data.sections.museums ? data.sections.museums.length : 0;
            const travelCount = data.sections.travels ? data.sections.travels.length : 0;
            
            document.getElementById('articleCount').textContent = articleCount;
            document.getElementById('growthCount').textContent = growthCount;
            document.getElementById('peopleCount').textContent = peopleCount;
            document.getElementById('museumCount').textContent = museumCount;
            document.getElementById('travelCount').textContent = travelCount;
            
            // 计算总内容数量作为访问量的基础
            const totalContent = articleCount + growthCount + peopleCount + museumCount + travelCount;
            const estimatedVisits = Math.max(totalContent * 15 + Math.floor(Math.random() * 100), 0);
            document.getElementById('visitCount').textContent = estimatedVisits.toLocaleString();
            
            document.getElementById('lastUpdate').textContent = new Date().toLocaleDateString('zh-CN');
            
        } catch (error) {
            console.error('加载数据统计失败:', error);
            // 如果加载失败，显示0
            document.getElementById('articleCount').textContent = '0';
            document.getElementById('growthCount').textContent = '0';
            document.getElementById('peopleCount').textContent = '0';
            document.getElementById('museumCount').textContent = '0';
            document.getElementById('travelCount').textContent = '0';
            document.getElementById('visitCount').textContent = '0';
        }
    }

    // 加载内容数据
    loadContentData() {
        this.loadArticles();
        this.loadSectionItems('growth');
    }

    // 通用的section数据加载函数
    async loadSectionItems(section) {
        try {
            const response = await fetch(`/api/data/${section}`);
            const items = await response.json();
            
            const container = document.getElementById(`${section}List`);
            if (!container) return;
            
            if (items.length === 0) {
                container.innerHTML = '<div class="list-item"><p>暂无数据</p></div>';
                return;
            }

            container.innerHTML = items.map(item => {
                let itemInfo = '';
                let itemMeta = '';
                
                switch(section) {
                    case 'growth':
                        itemInfo = `${item.icon || '🌱'} ${item.title}`;
                        itemMeta = item.date;
                        break;
                    case 'people':
                        itemInfo = `${item.icon || '👥'} ${item.title}`;
                        itemMeta = (item.tags || []).join(', ');
                        break;
                    case 'museums':
                        itemInfo = item.title;
                        itemMeta = `${item.date} - ${item.type}`;
                        break;
                    case 'travels':
                        itemInfo = item.title;
                        itemMeta = `${item.date} - ${item.location}`;
                        break;
                    default:
                        itemInfo = item.title;
                        itemMeta = item.date || '';
                }
                
                return `
                    <div class="list-item">
                        <div class="item-info">
                            <h4>${itemInfo}</h4>
                            <p>${item.description || '暂无描述'}</p>
                            <div class="item-meta">${itemMeta}</div>
                        </div>
                        <div class="item-actions">
                            <button class="edit-btn" onclick="admin.openEditModal('edit', '${section}', ${item.id})">
                                <i class="fas fa-edit"></i> 编辑
                            </button>
                            <button class="delete-btn" onclick="admin.deleteItem('${section}', ${item.id})">
                                <i class="fas fa-trash"></i> 删除
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
        } catch (error) {
            console.error(`加载${section}数据失败:`, error);
            const container = document.getElementById(`${section}List`);
            if (container) {
                container.innerHTML = '<div class="list-item"><p>加载失败</p></div>';
            }
        }
    }

    // 加载文章列表
    async loadArticles() {
        try {
            const response = await fetch('/api/data/articles');
            const articles = await response.json();
            
            const articleList = document.getElementById('articleList');
            if (articles.length === 0) {
                articleList.innerHTML = '<div class="list-item"><p>暂无文章</p></div>';
                return;
            }

            articleList.innerHTML = articles.map(article => `
                <div class="list-item">
                    <div class="item-info">
                        <h4>${article.title}</h4>
                        <p>${article.excerpt || '暂无摘要'}</p>
                        <div class="item-meta">${new Date(article.date).toLocaleDateString('zh-CN')}</div>
                    </div>
                    <div class="item-actions">
                        <button class="edit-btn" onclick="admin.openEditModal('edit', 'articles', ${article.id})">
                            <i class="fas fa-edit"></i> 编辑
                        </button>
                        <button class="delete-btn" onclick="admin.deleteItem('articles', ${article.id})">
                            <i class="fas fa-trash"></i> 删除
                        </button>
                    </div>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('加载文章失败:', error);
            document.getElementById('articleList').innerHTML = '<div class="list-item"><p>加载失败</p></div>';
        }
    }

    // 加载成长历程
    async loadGrowthItems() {
        try {
            const response = await fetch('/api/data/growth');
            const items = await response.json();
            
            const growthList = document.getElementById('growthList');
            if (items.length === 0) {
                growthList.innerHTML = '<div class="list-item"><p>暂无成长历程</p></div>';
                return;
            }

            growthList.innerHTML = items.map(item => `
                <div class="list-item">
                    <div class="item-info">
                        <h4>${item.icon} ${item.title}</h4>
                        <p>${item.description}</p>
                        <div class="item-meta">${item.date}</div>
                    </div>
                    <div class="item-actions">
                        <button class="edit-btn" onclick="admin.openEditModal('edit', 'growth', ${item.id})">
                            <i class="fas fa-edit"></i> 编辑
                        </button>
                        <button class="delete-btn" onclick="admin.deleteItem('growth', ${item.id})">
                            <i class="fas fa-trash"></i> 删除
                        </button>
                    </div>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('加载成长历程失败:', error);
            document.getElementById('growthList').innerHTML = '<div class="list-item"><p>加载失败</p></div>';
        }
    }

    // 打开编辑模态框
    async openEditModal(mode, section, id = null) {
        this.currentSection = section;
        this.currentItem = null;
        
        const modal = document.getElementById('editModal');
        const title = document.getElementById('editModalTitle');
        
        // 设置表单字段显示
        this.setupFormFields(section);
        
        const sectionNames = {
            'articles': '文章',
            'growth': '成长经历',
            'people': '重要的人',
            'museums': '博物馆记忆',
            'travels': '旅行经历'
        };
        
        if (mode === 'add') {
            title.textContent = `新建${sectionNames[section]}`;
            this.clearEditForm();
        } else {
            title.textContent = `编辑${sectionNames[section]}`;
            
            try {
                const response = await fetch(`/api/data/${section}/${id}`);
                const item = await response.json();
                this.currentItem = item;
                this.fillEditForm(item, section);
            } catch (error) {
                this.showMessage('加载数据失败', 'error');
                return;
            }
        }
        
        modal.classList.add('show');
        
        // 加载标签数据（用于标签选择器）
        this.loadTags();
    }

    // 设置表单字段显示
    setupFormFields(section) {
        // 隐藏所有可选字段
        document.getElementById('iconGroup').style.display = 'none';
        document.getElementById('typeGroup').style.display = 'none';
        document.getElementById('locationGroup').style.display = 'none';
        document.getElementById('tagsGroup').style.display = 'none';
        document.getElementById('dateGroup').style.display = 'block';
        document.getElementById('imageGroup').style.display = 'block';
        
        // 根据section显示相应字段
        switch(section) {
            case 'articles':
                document.getElementById('descriptionLabel').textContent = '摘要';
                document.getElementById('dateLabel').textContent = '发布日期';
                document.getElementById('imageGroup').style.display = 'block';
                document.getElementById('tagsGroup').style.display = 'block';
                break;
                
            case 'growth':
                document.getElementById('iconGroup').style.display = 'block';
                document.getElementById('descriptionLabel').textContent = '描述';
                document.getElementById('dateLabel').textContent = '时间段';
                document.getElementById('imageGroup').style.display = 'none';
                document.getElementById('tagsGroup').style.display = 'block';
                break;
                
            case 'people':
                document.getElementById('iconGroup').style.display = 'block';
                document.getElementById('tagsGroup').style.display = 'block';
                document.getElementById('descriptionLabel').textContent = '描述';
                document.getElementById('dateGroup').style.display = 'none';
                document.getElementById('imageGroup').style.display = 'none';
                break;
                
            case 'museums':
                document.getElementById('typeGroup').style.display = 'block';
                document.getElementById('descriptionLabel').textContent = '描述';
                document.getElementById('dateLabel').textContent = '参观日期';
                document.getElementById('imageGroup').style.display = 'block';
                document.getElementById('tagsGroup').style.display = 'block';
                break;
                
            case 'travels':
                document.getElementById('locationGroup').style.display = 'block';
                document.getElementById('descriptionLabel').textContent = '描述';
                document.getElementById('dateLabel').textContent = '旅行时间';
                document.getElementById('imageGroup').style.display = 'block';
                document.getElementById('tagsGroup').style.display = 'block';
                break;
        }
    }

    // 清空编辑表单
    clearEditForm() {
        document.getElementById('editTitle').value = '';
        document.getElementById('editDescription').value = '';
        document.getElementById('editContent').innerHTML = '';
        document.getElementById('editImage').value = '';
        document.getElementById('editIcon').value = '';
        document.getElementById('editDate').value = '';
        document.getElementById('editType').value = '';
        document.getElementById('editLocation').value = '';
        
        // 清空标签选择
        const selectedTags = document.getElementById('selectedTags');
        if (selectedTags) {
            selectedTags.innerHTML = '';
        }
        
        // 隐藏图片预览
        hideImagePreview();
    }

    // 填充编辑表单
    fillEditForm(item, section) {
        document.getElementById('editTitle').value = item.title || '';
        document.getElementById('editDescription').value = item.description || item.excerpt || '';
        document.getElementById('editContent').innerHTML = item.content || '';
        
        // 根据section填充特定字段
        switch(section) {
            case 'articles':
                document.getElementById('editImage').value = item.image || '';
                document.getElementById('editDate').value = item.date || '';
                if (item.tags) {
                    this.setSelectedTags(Array.isArray(item.tags) ? item.tags : []);
                }
                break;
                
            case 'growth':
                document.getElementById('editIcon').value = item.icon || '';
                document.getElementById('editDate').value = item.date || '';
                if (item.tags) {
                    this.setSelectedTags(Array.isArray(item.tags) ? item.tags : []);
                }
                break;
                
            case 'people':
                document.getElementById('editIcon').value = item.icon || '';
                if (item.tags) {
                    this.setSelectedTags(Array.isArray(item.tags) ? item.tags : []);
                }
                break;
                
            case 'museums':
                document.getElementById('editImage').value = item.image || '';
                document.getElementById('editDate').value = item.date || '';
                document.getElementById('editType').value = item.type || '';
                if (item.tags) {
                    this.setSelectedTags(Array.isArray(item.tags) ? item.tags : []);
                }
                break;
                
            case 'travels':
                document.getElementById('editImage').value = item.image || '';
                document.getElementById('editDate').value = item.date || '';
                document.getElementById('editLocation').value = item.location || '';
                if (item.tags) {
                    this.setSelectedTags(Array.isArray(item.tags) ? item.tags : []);
                }
                break;
        }
    }

    // 关闭编辑模态框
    closeEditModal() {
        console.log('尝试关闭编辑模态框...');
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.classList.remove('show');
            console.log('模态框的show类已移除');
            
            // 清空表单数据
            this.clearEditForm();
            
            // 重置状态
            this.currentSection = '';
            this.currentItem = null;
            
            console.log('编辑模态框已关闭');
        } else {
            console.error('找不到编辑模态框元素');
        }
    }

    // 保存项目
    async handleSaveItem() {
        try {
            console.log('开始保存项目...');
            
            const title = document.getElementById('editTitle').value;
            const description = document.getElementById('editDescription').value;
            const content = document.getElementById('editContent').innerHTML;
            const image = document.getElementById('editImage').value;
            const icon = document.getElementById('editIcon').value;
            const date = document.getElementById('editDate').value;
            const type = document.getElementById('editType').value;
            const location = document.getElementById('editLocation').value;

            if (!title.trim()) {
                this.showMessage('请输入标题', 'error');
                return;
            }

            const itemData = {
                title: title.trim(),
                description: description.trim(),
                content: content.trim(),
                image: image.trim()
            };

            // 根据不同的section添加特定字段
            switch(this.currentSection) {
                case 'articles':
                    itemData.excerpt = description.trim();
                    itemData.date = date || new Date().toISOString().split('T')[0];
                    itemData.tags = this.getSelectedTags();
                    break;
                    
                case 'growth':
                    itemData.icon = icon || '🌱';
                    itemData.date = date || new Date().getFullYear().toString();
                    itemData.tags = this.getSelectedTags();
                    break;
                    
                case 'people':
                    itemData.icon = icon || '👥';
                    itemData.tags = this.getSelectedTags();
                    delete itemData.image; // people不需要图片字段
                    break;
                    
                case 'museums':
                    itemData.type = type;
                    itemData.date = date || new Date().toISOString().split('T')[0];
                    itemData.tags = this.getSelectedTags();
                    break;
                    
                case 'travels':
                    itemData.location = location;
                    itemData.date = date || new Date().toISOString().split('T')[0].substring(0, 7);
                    itemData.tags = this.getSelectedTags();
                    break;
            }

            console.log('准备发送数据:', itemData);

            let response;
            if (this.currentItem) {
                // 更新现有项目
                response = await fetch(`/api/data/${this.currentSection}/${this.currentItem.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(itemData)
                });
            } else {
                // 创建新项目
                response = await fetch(`/api/data/${this.currentSection}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(itemData)
                });
            }

            const result = await response.json();
            console.log('服务器响应:', result);
            
            if (response.ok) {
                this.showMessage(result.message, 'success');
                console.log('保存成功，准备关闭模态框');
                this.closeEditModal();
                
                // 刷新对应的列表
                if (this.currentSection === 'articles') {
                    this.loadArticles();
                } else {
                    this.loadSectionItems(this.currentSection);
                }
                
                this.loadDashboardData(); // 更新仪表盘数据
                
                // 通知前端页面内容已更新
                this.notifyContentUpdate();
            } else {
                console.error('保存失败:', result);
                this.showMessage(result.error || '保存失败', 'error');
            }
            
        } catch (error) {
            console.error('保存过程中发生错误:', error);
            this.showMessage('保存失败: ' + error.message, 'error');
        }
    }

    // 删除项目
    async deleteItem(section, id) {
        if (!confirm('确定要删除这个项目吗？')) {
            return;
        }

        try {
            const response = await fetch(`/api/data/${section}/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (response.ok) {
                this.showMessage(result.message, 'success');
                
                // 刷新对应的列表
                if (section === 'articles') {
                    this.loadArticles();
                } else {
                    this.loadSectionItems(section);
                }
                
                this.loadDashboardData(); // 更新仪表盘数据
                
                // 通知前端页面内容已更新
                this.notifyContentUpdate();
            } else {
                this.showMessage(result.error || '删除失败', 'error');
            }
            
        } catch (error) {
            console.error('删除失败:', error);
            this.showMessage('删除失败', 'error');
        }
    }

    // 加载媒体数据
    async loadMediaData() {
        try {
            const response = await fetch('/api/media');
            const mediaFiles = await response.json();
            
            const mediaGrid = document.getElementById('mediaGrid');
            
            if (mediaFiles.length === 0) {
                mediaGrid.innerHTML = `
                    <div class="empty-media-state">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <h3>暂无媒体文件</h3>
                        <p>拖拽文件到上方区域或点击上传文件</p>
                    </div>
                `;
                return;
            }

            mediaGrid.innerHTML = mediaFiles.map(media => `
                <div class="media-item" data-type="${media.type}">
                    <div class="media-preview">
                        ${this.renderMediaPreview(media)}
                    </div>
                    <div class="media-info">
                        <h4 title="${media.originalName}">${this.truncateFilename(media.originalName)}</h4>
                        <p class="media-meta">
                            <span class="media-size">${this.formatFileSize(media.size)}</span>
                            <span class="media-date">${this.formatDate(media.uploadTime)}</span>
                        </p>
                        <p class="media-type">${this.getFileTypeLabel(media.type)}</p>
                    </div>
                    <div class="media-actions">
                        <button class="preview-btn" onclick="admin.previewMedia('${media.url}', '${media.type}', '${media.originalName}')" title="预览">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="copy-btn" onclick="admin.copyMediaUrl('${media.url}')" title="复制链接">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="insert-btn" onclick="admin.insertMediaIntoEditor('${media.url}', '${media.type}', '${media.originalName}')" title="插入到编辑器">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="delete-btn" onclick="admin.deleteMedia('${media.filename}', '${media.originalName}')" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('加载媒体文件失败:', error);
            document.getElementById('mediaGrid').innerHTML = `
                <div class="error-media-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>加载失败</h3>
                    <p>无法加载媒体文件列表</p>
                </div>
            `;
        }
    }

    // 渲染媒体预览
    renderMediaPreview(media) {
        switch (media.type) {
            case 'image':
                return `<img src="${media.url}" alt="${media.originalName}" loading="lazy">`;
            case 'video':
                return `
                    <video preload="metadata" muted>
                        <source src="${media.url}" type="video/mp4">
                        <div class="video-placeholder">
                            <i class="fas fa-video"></i>
                        </div>
                    </video>
                `;
            case 'audio':
                return `
                    <div class="audio-preview">
                        <i class="fas fa-music"></i>
                        <span>音频文件</span>
                    </div>
                `;
            default:
                return `
                    <div class="file-preview">
                        <i class="fas fa-file"></i>
                        <span>未知文件</span>
                    </div>
                `;
        }
    }

    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN');
    }

    // 获取文件类型标签
    getFileTypeLabel(type) {
        const labels = {
            'image': '图片',
            'video': '视频',
            'audio': '音频',
            'unknown': '其他'
        };
        return labels[type] || '未知';
    }

    // 截断文件名
    truncateFilename(filename, maxLength = 20) {
        if (filename.length <= maxLength) return filename;
        const ext = filename.split('.').pop();
        const name = filename.slice(0, filename.lastIndexOf('.'));
        const truncated = name.slice(0, maxLength - ext.length - 4) + '...';
        return truncated + '.' + ext;
    }

    // 预览媒体文件
    previewMedia(url, type, filename) {
        const modal = document.createElement('div');
        modal.className = 'media-preview-modal';
        modal.innerHTML = `
            <div class="media-preview-content">
                <div class="media-preview-header">
                    <h3>${filename}</h3>
                    <button class="close-preview" onclick="this.closest('.media-preview-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="media-preview-body">
                    ${this.renderFullMediaPreview(url, type)}
                </div>
                <div class="media-preview-footer">
                    <button class="copy-url-btn" onclick="admin.copyMediaUrl('${url}')">
                        <i class="fas fa-copy"></i> 复制链接
                    </button>
                    <a href="${url}" download="${filename}" class="download-btn">
                        <i class="fas fa-download"></i> 下载文件
                    </a>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // 渲染完整媒体预览
    renderFullMediaPreview(url, type) {
        switch (type) {
            case 'image':
                return `<img src="${url}" alt="预览图片" style="max-width: 100%; max-height: 70vh; object-fit: contain;">`;
            case 'video':
                return `<video controls style="max-width: 100%; max-height: 70vh;"><source src="${url}"></video>`;
            case 'audio':
                return `<audio controls style="width: 100%;"><source src="${url}"></audio>`;
            default:
                return `<p>无法预览此文件类型</p>`;
        }
    }

    // 复制媒体URL
    copyMediaUrl(url) {
        const fullUrl = window.location.origin + url;
        navigator.clipboard.writeText(fullUrl).then(() => {
            this.showMessage('链接已复制到剪贴板', 'success');
        }).catch(() => {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = fullUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showMessage('链接已复制到剪贴板', 'success');
        });
    }

    // 删除媒体文件
    async deleteMedia(filename, originalName) {
        if (!confirm(`确定要删除文件"${originalName}"吗？此操作不可恢复。`)) {
            return;
        }

        try {
            const response = await fetch(`/api/media/${filename}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (response.ok) {
                this.showMessage('文件删除成功', 'success');
                this.loadMediaData(); // 重新加载媒体列表
            } else {
                this.showMessage(result.error || '删除失败', 'error');
            }
        } catch (error) {
            console.error('删除文件失败:', error);
            this.showMessage('删除失败', 'error');
        }
    }

    // 处理文件上传
    async handleFileUpload(files) {
        if (!files || files.length === 0) return;

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            
            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (response.ok) {
                    this.showMessage(`${file.name} 上传成功`, 'success');
                    this.loadMediaData(); // 刷新媒体列表
                } else {
                    this.showMessage(`${file.name} 上传失败: ${result.error}`, 'error');
                }
            } catch (error) {
                this.showMessage(`${file.name} 上传失败`, 'error');
            }
        }
    }

    // 渲染媒体预览
    renderMediaPreview(media) {
        switch (media.type) {
            case 'image':
                return `<img src="${media.url}" alt="${media.originalName}" loading="lazy">`;
            case 'video':
                return `
                    <video preload="metadata" muted>
                        <source src="${media.url}" type="video/mp4">
                        <div class="video-placeholder">
                            <i class="fas fa-video"></i>
                        </div>
                    </video>
                `;
            case 'audio':
                return `
                    <div class="audio-preview">
                        <i class="fas fa-music"></i>
                        <span>音频文件</span>
                    </div>
                `;
            default:
                return `
                    <div class="file-preview">
                        <i class="fas fa-file"></i>
                        <span>未知文件</span>
                    </div>
                `;
        }
    }

    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN');
    }

    // 获取文件类型标签
    getFileTypeLabel(type) {
        const labels = {
            'image': '图片',
            'video': '视频', 
            'audio': '音频',
            'unknown': '其他'
        };
        return labels[type] || '未知';
    }

    // 截断文件名
    truncateFilename(filename, maxLength = 20) {
        if (filename.length <= maxLength) return filename;
        const ext = filename.split('.').pop();
        const name = filename.slice(0, filename.lastIndexOf('.'));
        const truncated = name.slice(0, maxLength - ext.length - 4) + '...';
        return truncated + '.' + ext;
    }

    // 预览媒体文件
    previewMedia(url, type, filename) {
        const modal = document.createElement('div');
        modal.className = 'media-preview-modal';
        modal.innerHTML = `
            <div class="media-preview-content">
                <div class="media-preview-header">
                    <h3>${filename}</h3>
                    <button class="close-preview" onclick="this.closest('.media-preview-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="media-preview-body">
                    ${this.renderFullMediaPreview(url, type)}
                </div>
                <div class="media-preview-footer">
                    <button class="copy-url-btn" onclick="admin.copyMediaUrl('${url}')">
                        <i class="fas fa-copy"></i> 复制链接
                    </button>
                    <a href="${url}" download="${filename}" class="download-btn">
                        <i class="fas fa-download"></i> 下载文件
                    </a>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // 渲染完整媒体预览
    renderFullMediaPreview(url, type) {
        switch (type) {
            case 'image':
                return `<img src="${url}" alt="预览图片" style="max-width: 100%; max-height: 70vh; object-fit: contain;">`;
            case 'video':
                return `<video controls style="max-width: 100%; max-height: 70vh;"><source src="${url}"></video>`;
            case 'audio':
                return `<audio controls style="width: 100%;"><source src="${url}"></audio>`;
            default:
                return `<p>无法预览此文件类型</p>`;
        }
    }

    // 复制媒体URL
    copyMediaUrl(url) {
        const fullUrl = window.location.origin + url;
        navigator.clipboard.writeText(fullUrl).then(() => {
            this.showMessage('链接已复制到剪贴板', 'success');
        }).catch(() => {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = fullUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showMessage('链接已复制到剪贴板', 'success');
        });
    }

    // 插入媒体到编辑器
    insertMediaIntoEditor(url, type, filename) {
        const editor = document.getElementById('editContent');
        if (!editor) {
            this.showMessage('请先打开编辑器', 'error');
            return;
        }

        let mediaElement = '';
        switch (type) {
            case 'image':
                mediaElement = `<img src="${url}" alt="${filename}" style="max-width: 100%; height: auto;">`;
                break;
            case 'video':
                mediaElement = `<video controls style="max-width: 100%; height: auto;"><source src="${url}" type="video/mp4">您的浏览器不支持视频播放。</video>`;
                break;
            case 'audio':
                mediaElement = `<audio controls style="width: 100%;"><source src="${url}">您的浏览器不支持音频播放。</audio>`;
                break;
            default:
                mediaElement = `<a href="${url}" target="_blank">${filename}</a>`;
        }

        // 插入到编辑器
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = mediaElement;
            const element = tempDiv.firstChild;
            
            range.insertNode(element);
            range.setStartAfter(element);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            editor.innerHTML += mediaElement;
        }

        editor.focus();
        this.showMessage(`${this.getFileTypeLabel(type)}已插入到编辑器`, 'success');
    }

    // 删除媒体文件
    async deleteMedia(filename, originalName) {
        if (!confirm(`确定要删除文件"${originalName}"吗？此操作不可恢复。`)) {
            return;
        }

        try {
            const response = await fetch(`/api/media/${filename}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (response.ok) {
                this.showMessage('文件删除成功', 'success');
                this.loadMediaData(); // 重新加载媒体列表
            } else {
                this.showMessage(result.error || '删除失败', 'error');
            }
        } catch (error) {
            console.error('删除文件失败:', error);
            this.showMessage('删除失败', 'error');
        }
    }

    // 加载用户设置
    async loadUserSettings() {
        try {
            const response = await fetch('/api/settings');
            const settings = await response.json();
            
            if (settings) {
                // 基本设置
                if (settings.basic) {
                    document.getElementById('siteName').value = settings.basic.siteName || '';
                    document.getElementById('siteSubtitle').value = settings.basic.siteSubtitle || '';
                    document.getElementById('navTitle').value = settings.basic.navTitle || '';
                    document.getElementById('userName').value = settings.basic.userName || '';
                    document.getElementById('heroTitle').value = settings.basic.heroTitle || '';
                    document.getElementById('heroSubtitle').value = settings.basic.heroSubtitle || '';
                    document.getElementById('userBio').value = settings.basic.userBio || '';
                    document.getElementById('footerText').value = settings.basic.footerText || '';
                    document.getElementById('avatarUrl').value = settings.basic.avatar || '';
                    
                    // 更新头像预览
                    this.updateAvatarPreview(settings.basic.avatar);
                }
                
                // 栏目设置
                if (settings.sections) {
                    const sections = settings.sections;
                    document.getElementById('growthTitle').value = sections.growthTitle || '';
                    document.getElementById('growthSubtitle').value = sections.growthSubtitle || '';
                    document.getElementById('peopleTitle').value = sections.peopleTitle || '';
                    document.getElementById('peopleSubtitle').value = sections.peopleSubtitle || '';
                    document.getElementById('museumTitle').value = sections.museumTitle || '';
                    document.getElementById('museumSubtitle').value = sections.museumSubtitle || '';
                    document.getElementById('travelTitle').value = sections.travelTitle || '';
                    document.getElementById('travelSubtitle').value = sections.travelSubtitle || '';
                    document.getElementById('articlesTitle').value = sections.articlesTitle || '';
                    document.getElementById('articlesSubtitle').value = sections.articlesSubtitle || '';
                    document.getElementById('photosTitle').value = sections.photosTitle || '';
                    document.getElementById('photosSubtitle').value = sections.photosSubtitle || '';
                }
                
                // 外观设置
                if (settings.appearance) {
                    const appearance = settings.appearance;
                    document.getElementById('themeColor').value = appearance.themeColor || 'pink';
                    document.getElementById('enableSakura').checked = appearance.enableSakura !== false;
                    document.getElementById('enableWater').checked = appearance.enableWater !== false;
                    document.getElementById('enableParticles').checked = appearance.enableParticles !== false;
                    document.getElementById('animationSpeed').value = appearance.animationSpeed || 'normal';
                    document.getElementById('fontFamily').value = appearance.fontFamily || 'noto';
                }
                
                // 媒体设置
                if (settings.media) {
                    const media = settings.media;
                    document.getElementById('musicFile').value = media.musicFile || '';
                    document.getElementById('autoPlay').checked = media.autoPlay !== false;
                    document.getElementById('loopPlay').checked = media.loopPlay !== false;
                    document.getElementById('defaultVolume').value = media.defaultVolume || 50;
                    document.getElementById('volumeDisplay').textContent = (media.defaultVolume || 50) + '%';
                    
                    // 照片墙设置
                    if (media.photoWall) {
                        for (let i = 1; i <= 6; i++) {
                            const photo = media.photoWall[`photo${i}`];
                            if (photo) {
                                document.getElementById(`photo${i}`).value = photo.src || '';
                                document.getElementById(`photo${i}Title`).value = photo.title || '';
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('加载设置失败:', error);
        }
    }

    // 保存基本设置
    async handleSaveBasicSettings() {
        const basicData = {
            siteName: document.getElementById('siteName').value.trim(),
            siteSubtitle: document.getElementById('siteSubtitle').value.trim(),
            navTitle: document.getElementById('navTitle').value.trim(),
            userName: document.getElementById('userName').value.trim(),
            heroTitle: document.getElementById('heroTitle').value.trim(),
            heroSubtitle: document.getElementById('heroSubtitle').value.trim(),
            userBio: document.getElementById('userBio').value.trim(),
            footerText: document.getElementById('footerText').value.trim(),
            avatar: document.getElementById('avatarUrl').value.trim()
        };

        try {
            const response = await fetch('/api/settings/basic', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(basicData)
            });

            const result = await response.json();
            if (response.ok) {
                this.showMessage('基本设置保存成功', 'success');
                // 通知主页更新设置
                this.notifySettingsUpdate();
            } else {
                this.showMessage(result.error || '保存失败', 'error');
            }
        } catch (error) {
            console.error('保存基本设置失败:', error);
            this.showMessage('保存失败', 'error');
        }
    }

    // 保存栏目设置
    async handleSaveSectionsSettings() {
        const sectionsData = {
            growthTitle: document.getElementById('growthTitle').value.trim(),
            growthSubtitle: document.getElementById('growthSubtitle').value.trim(),
            peopleTitle: document.getElementById('peopleTitle').value.trim(),
            peopleSubtitle: document.getElementById('peopleSubtitle').value.trim(),
            museumTitle: document.getElementById('museumTitle').value.trim(),
            museumSubtitle: document.getElementById('museumSubtitle').value.trim(),
            travelTitle: document.getElementById('travelTitle').value.trim(),
            travelSubtitle: document.getElementById('travelSubtitle').value.trim(),
            articlesTitle: document.getElementById('articlesTitle').value.trim(),
            articlesSubtitle: document.getElementById('articlesSubtitle').value.trim(),
            photosTitle: document.getElementById('photosTitle').value.trim(),
            photosSubtitle: document.getElementById('photosSubtitle').value.trim()
        };

        try {
            const response = await fetch('/api/settings/sections', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sectionsData)
            });

            const result = await response.json();
            if (response.ok) {
                this.showMessage('栏目设置保存成功', 'success');
                // 通知主页更新设置
                this.notifySettingsUpdate();
            } else {
                this.showMessage(result.error || '保存失败', 'error');
            }
        } catch (error) {
            console.error('保存栏目设置失败:', error);
            this.showMessage('保存失败', 'error');
        }
    }

    // 保存外观设置
    async handleSaveAppearanceSettings() {
        const appearanceData = {
            themeColor: document.getElementById('themeColor').value,
            enableSakura: document.getElementById('enableSakura').checked,
            enableWater: document.getElementById('enableWater').checked,
            enableParticles: document.getElementById('enableParticles').checked,
            animationSpeed: document.getElementById('animationSpeed').value,
            fontFamily: document.getElementById('fontFamily').value
        };

        try {
            const response = await fetch('/api/settings/appearance', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appearanceData)
            });

            const result = await response.json();
            if (response.ok) {
                this.showMessage('外观设置保存成功', 'success');
                // 通知主页更新设置
                this.notifySettingsUpdate();
            } else {
                this.showMessage(result.error || '保存失败', 'error');
            }
        } catch (error) {
            console.error('保存外观设置失败:', error);
            this.showMessage('保存失败', 'error');
        }
    }

    // 保存媒体设置
    async handleSaveMediaSettings() {
        const photoWall = {};
        for (let i = 1; i <= 6; i++) {
            photoWall[`photo${i}`] = {
                src: document.getElementById(`photo${i}`).value.trim(),
                title: document.getElementById(`photo${i}Title`).value.trim()
            };
        }

        const mediaData = {
            musicFile: document.getElementById('musicFile').value.trim(),
            autoPlay: document.getElementById('autoPlay').checked,
            loopPlay: document.getElementById('loopPlay').checked,
            defaultVolume: parseInt(document.getElementById('defaultVolume').value),
            photoWall: photoWall
        };

        try {
            const response = await fetch('/api/settings/media', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mediaData)
            });

            const result = await response.json();
            if (response.ok) {
                this.showMessage('媒体设置保存成功', 'success');
                // 通知主页更新设置
                this.notifySettingsUpdate();
            } else {
                this.showMessage(result.error || '保存失败', 'error');
            }
        } catch (error) {
            console.error('保存媒体设置失败:', error);
            this.showMessage('保存失败', 'error');
        }
    }

    // 初始化设置页面
    initSettingsPage() {
        // 设置标签页切换
        document.querySelectorAll('.settings-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                // 更新按钮状态
                document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 显示对应内容
                document.querySelectorAll('.settings-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${tab}-settings`).classList.add('active');
            });
        });

        // 表单提交事件
        document.getElementById('basicSettingsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveBasicSettings();
        });

        document.getElementById('sectionsSettingsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveSectionsSettings();
        });

        document.getElementById('appearanceSettingsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveAppearanceSettings();
        });

        document.getElementById('mediaSettingsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveMediaSettings();
        });

        // 音量滑块事件
        document.getElementById('defaultVolume')?.addEventListener('input', (e) => {
            document.getElementById('volumeDisplay').textContent = e.target.value + '%';
        });

        // 头像输入框实时预览
        document.getElementById('avatarUrl')?.addEventListener('input', (e) => {
            this.updateAvatarPreview(e.target.value.trim());
        });
    }

    // 显示消息提示
    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">×</button>`;
        
        messageEl.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 15px 20px;
            border-radius: 8px; color: white; font-weight: 500; z-index: 10000;
            display: flex; align-items: center; gap: 15px; max-width: 300px;
        `;

        switch (type) {
            case 'success': messageEl.style.background = '#4CAF50'; break;
            case 'error': messageEl.style.background = '#ff6b6b'; break;
            case 'info': messageEl.style.background = '#667eea'; break;
            default: messageEl.style.background = '#999';
        }

        document.body.appendChild(messageEl);
        setTimeout(() => messageEl.remove(), 3000);
    }

    // 标签管理功能
    async loadTags() {
        try {
            const response = await fetch('/api/tags');
            const tags = await response.json();
            
            const tagsList = document.getElementById('tagsList');
            if (tags.length === 0) {
                tagsList.innerHTML = '<p class="empty-state">暂无标签</p>';
                return;
            }
            
            tagsList.innerHTML = tags.map(tag => `
                <div class="tag-item">
                    <span class="tag-name">${tag}</span>
                    <div class="tag-actions">
                        <button class="tag-edit-btn" onclick="admin.editTag('${tag}')" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="tag-delete-btn" onclick="admin.deleteTag('${tag}')" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            
            // 更新标签选择器
            this.updateTagSelector(tags);
            
        } catch (error) {
            console.error('加载标签失败:', error);
            document.getElementById('tagsList').innerHTML = '<p class="error-state">加载失败</p>';
        }
    }
    
    // 更新标签选择器
    updateTagSelector(tags) {
        const select = document.getElementById('availableTags');
        if (select) {
            select.innerHTML = '<option value="">选择标签...</option>' + 
                tags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
        }
    }
    
    // 显示添加标签表单
    showAddTagForm() {
        document.getElementById('addTagForm').style.display = 'flex';
        document.getElementById('newTagInput').focus();
    }
    
    // 隐藏添加标签表单
    hideAddTagForm() {
        document.getElementById('addTagForm').style.display = 'none';
        document.getElementById('newTagInput').value = '';
    }
    
    // 保存新标签
    async saveNewTag() {
        const tagName = document.getElementById('newTagInput').value.trim();
        if (!tagName) {
            this.showMessage('请输入标签名称', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: tagName })
            });
            
            const result = await response.json();
            if (response.ok) {
                this.hideAddTagForm();
                this.loadTags();
                this.showMessage('标签添加成功', 'success');
            } else {
                this.showMessage(result.error || '添加失败', 'error');
            }
        } catch (error) {
            console.error('添加标签失败:', error);
            this.showMessage('添加失败', 'error');
        }
    }
    
    // 编辑标签
    async editTag(oldTag) {
        const newTag = prompt('请输入新的标签名称:', oldTag);
        if (!newTag || newTag === oldTag) return;
        
        try {
            const response = await fetch(`/api/tags/${encodeURIComponent(oldTag)}/${encodeURIComponent(newTag)}`, {
                method: 'PUT'
            });
            
            const result = await response.json();
            if (response.ok) {
                this.loadTags();
                this.showMessage('标签更新成功', 'success');
            } else {
                this.showMessage(result.error || '更新失败', 'error');
            }
        } catch (error) {
            console.error('更新标签失败:', error);
            this.showMessage('更新失败', 'error');
        }
    }
    
    // 删除标签
    async deleteTag(tag) {
        if (!confirm(`确定要删除标签"${tag}"吗？这将会从所有相关内容中移除该标签。`)) {
            return;
        }
        
        try {
            const response = await fetch(`/api/tags/${encodeURIComponent(tag)}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            if (response.ok) {
                this.loadTags();
                this.showMessage('标签删除成功', 'success');
            } else {
                this.showMessage(result.error || '删除失败', 'error');
            }
        } catch (error) {
            console.error('删除标签失败:', error);
            this.showMessage('删除失败', 'error');
        }
    }
    
    // 初始化标签管理事件
    initTagManagement() {
        // 添加标签按钮
        document.getElementById('addTagBtn')?.addEventListener('click', () => {
            this.showAddTagForm();
        });
        
        // 保存标签按钮
        document.getElementById('saveTagBtn')?.addEventListener('click', () => {
            this.saveNewTag();
        });
        
        // 取消按钮
        document.getElementById('cancelTagBtn')?.addEventListener('click', () => {
            this.hideAddTagForm();
        });
        
        // 回车保存
        document.getElementById('newTagInput')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.saveNewTag();
            } else if (e.key === 'Escape') {
                this.hideAddTagForm();
            }
        });
        
        // 标签选择器
        document.getElementById('availableTags')?.addEventListener('change', (e) => {
            if (e.target.value) {
                this.addSelectedTag(e.target.value);
                e.target.value = '';
            }
        });
    }
    
    // 添加选中的标签
    addSelectedTag(tag) {
        const container = document.getElementById('selectedTags');
        const existing = container.querySelector(`[data-tag="${tag}"]`);
        if (existing) return; // 标签已存在
        
        const tagElement = document.createElement('span');
        tagElement.className = 'selected-tag';
        tagElement.dataset.tag = tag;
        tagElement.innerHTML = `
            ${tag}
            <button type="button" class="remove-tag" onclick="admin.removeSelectedTag('${tag}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(tagElement);
    }
    
    // 移除选中的标签
    removeSelectedTag(tag) {
        const container = document.getElementById('selectedTags');
        const tagElement = container.querySelector(`[data-tag="${tag}"]`);
        if (tagElement) {
            tagElement.remove();
        }
    }
    
    // 获取选中的标签
    getSelectedTags() {
        const container = document.getElementById('selectedTags');
        const tagElements = container.querySelectorAll('.selected-tag');
        return Array.from(tagElements).map(el => el.dataset.tag);
    }
    
    // 设置选中的标签
    setSelectedTags(tags) {
        const container = document.getElementById('selectedTags');
        container.innerHTML = '';
        tags.forEach(tag => this.addSelectedTag(tag));
    }

    // 设置标签页切换
    switchSettingsTab(tab) {
        // 更新按钮状态
        document.querySelectorAll('.settings-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // 更新内容区域
        document.querySelectorAll('.settings-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-settings`).classList.add('active');
        
        // 如果切换到照片墙配置，加载照片墙数据
        if (tab === 'photowall') {
            this.loadPhotoWallSettings();
        }
    }

    // 加载照片墙设置
    async loadPhotoWallSettings() {
        try {
            const response = await fetch('/api/settings');
            const data = await response.json();
            
            if (data.settings && data.settings.media && data.settings.media.photoWall) {
                const photoWall = data.settings.media.photoWall;
                for (let i = 1; i <= 6; i++) {
                    const photoData = photoWall[`photo${i}`];
                    if (photoData) {
                        document.getElementById(`photo${i}Src`).value = photoData.src || '';
                        document.getElementById(`photo${i}Title`).value = photoData.title || '';
                        this.updatePhotoPreview(i, photoData.src);
                    }
                }
            }
        } catch (error) {
            console.error('加载照片墙设置失败:', error);
        }
    }

    // 更新照片预览
    updatePhotoPreview(slot, src) {
        const preview = document.getElementById(`photoPreview${slot}`);
        const img = document.getElementById(`photoImg${slot}`);
        const placeholder = preview.querySelector('.placeholder-text');
        
        if (src && src.trim()) {
            img.src = src;
            img.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
            
            // 处理图片加载错误
            img.onerror = () => {
                img.style.display = 'none';
                if (placeholder) {
                    placeholder.style.display = 'block';
                    placeholder.textContent = '图片加载失败';
                }
            };
            
            img.onload = () => {
                if (placeholder) placeholder.style.display = 'none';
            };
        } else {
            img.style.display = 'none';
            if (placeholder) {
                placeholder.style.display = 'block';
                placeholder.textContent = `照片位置 ${slot}`;
            }
        }
    }

    // 打开媒体选择器
    async openMediaSelector(slot) {
        try {
            const response = await fetch('/api/media');
            const mediaList = await response.json();
            
            this.showMediaSelectorModal(slot, mediaList);
        } catch (error) {
            this.showMessage('加载媒体库失败', 'error');
        }
    }

    // 显示媒体选择器模态框
    showMediaSelectorModal(slot, mediaList) {
        const modal = document.createElement('div');
        modal.className = 'modal media-selector-modal';
        modal.style.zIndex = '10001';
        
        const images = mediaList.filter(media => media.type.startsWith('image/'));
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>选择图片 - 照片位置 ${slot}</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="media-grid">
                    ${images.map(media => `
                        <div class="media-item selectable-media" data-url="${media.url}" onclick="admin.selectMediaForPhotoWall(${slot}, '${media.url}', this.closest('.modal'))">
                            <img src="${media.url}" alt="${media.originalName}">
                            <div class="media-info">
                                <p title="${media.originalName}">${media.originalName}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${images.length === 0 ? '<p class="no-media">没有可用的图片文件</p>' : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.add('show');
    }

    // 选择媒体文件用于照片墙
    selectMediaForPhotoWall(slot, url, modal) {
        document.getElementById(`photo${slot}Src`).value = url;
        this.updatePhotoPreview(slot, url);
        modal.remove();
        this.showMessage(`已选择照片位置 ${slot} 的图片`, 'success');
    }

    // 加载媒体用于照片墙
    async loadMediaForPhotoWall() {
        this.showMessage('正在刷新媒体库...', 'info');
        // 这里可以添加刷新媒体库的逻辑
        setTimeout(() => {
            this.showMessage('媒体库已刷新', 'success');
        }, 1000);
    }

    // 保存照片墙设置
    async handleSavePhotoWallSettings() {
        const photoWallData = {
            photoWall: {}
        };
        
        for (let i = 1; i <= 6; i++) {
            const src = document.getElementById(`photo${i}Src`).value.trim();
            const title = document.getElementById(`photo${i}Title`).value.trim();
            
            photoWallData.photoWall[`photo${i}`] = {
                src: src,
                title: title || `美好回忆${i}`
            };
        }
        
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    section: 'media',
                    data: photoWallData
                })
            });
            
            if (response.ok) {
                this.showMessage('照片墙配置保存成功！', 'success');
                // 通知主页更新设置
                this.notifySettingsUpdate();
            } else {
                throw new Error('保存失败');
            }
        } catch (error) {
            console.error('保存照片墙设置失败:', error);
            this.showMessage('保存失败，请重试', 'error');
        }
    }

    // 预览照片墙效果
    previewPhotoWall() {
        const photos = [];
        for (let i = 1; i <= 6; i++) {
            const src = document.getElementById(`photo${i}Src`).value.trim();
            const title = document.getElementById(`photo${i}Title`).value.trim();
            if (src) {
                photos.push({ src, title: title || `美好回忆${i}` });
            }
        }
        
        if (photos.length === 0) {
            this.showMessage('请至少配置一张照片', 'warning');
            return;
        }
        
        // 在新窗口中预览
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>照片墙预览</title>
                <style>
                    body { margin: 0; padding: 20px; background: #f5f5f5; }
                    .preview-container { max-width: 800px; margin: 0 auto; }
                    .photo-wall { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
                    .photo-item { position: relative; aspect-ratio: 1; overflow: hidden; border-radius: 8px; }
                    .photo-item img { width: 100%; height: 100%; object-fit: cover; }
                    .photo-title { position: absolute; bottom: 0; left: 0; right: 0; 
                                  background: rgba(0,0,0,0.7); color: white; padding: 5px; 
                                  font-size: 12px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="preview-container">
                    <h2 style="text-align: center; margin-bottom: 20px;">照片墙预览效果</h2>
                    <div class="photo-wall">
                        ${photos.map(photo => `
                            <div class="photo-item">
                                <img src="${photo.src}" alt="${photo.title}" onerror="this.style.display='none'">
                                <div class="photo-title">${photo.title}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </body>
            </html>
        `);
        previewWindow.document.close();
    }

    // 背景音乐配置功能
    async loadMusicSettings() {
        try {
            const response = await fetch('/api/settings');
            const settings = await response.json();
            const musicSettings = settings.music || {};

            // 加载音乐设置
            document.getElementById('musicEnabled').checked = musicSettings.enabled !== false;
            document.getElementById('musicAutoplay').checked = musicSettings.autoplay !== false;
            document.getElementById('musicLoop').checked = musicSettings.loop !== false;
            document.getElementById('musicVolume').value = musicSettings.volume || 0.5;
            document.getElementById('volumeValue').textContent = ((musicSettings.volume || 0.5) * 100).toFixed(0) + '%';
            document.getElementById('musicUrl').value = musicSettings.url || '';
            document.getElementById('musicTitle').value = musicSettings.title || '';
            document.getElementById('musicArtist').value = musicSettings.artist || '';

            // 更新音乐预览
            if (musicSettings.url) {
                this.updateMusicPreview(musicSettings.url);
            }
        } catch (error) {
            console.error('加载音乐设置失败:', error);
        }
    }

    updateMusicPreview(url) {
        const audioPreview = document.getElementById('audioPreview');
        const audioSource = document.getElementById('audioSource');
        const musicInfo = document.getElementById('musicInfo');
        const musicTitle = musicInfo.querySelector('.music-title');
        const musicSize = musicInfo.querySelector('.music-size');

        if (url && url.trim()) {
            audioSource.src = url;
            audioPreview.load();
            
            // 更新音乐信息
            const filename = url.split('/').pop();
            musicTitle.textContent = filename || '未知音乐';
            musicSize.textContent = '音频文件';
            
            // 设置音量
            const volumeInput = document.getElementById('musicVolume');
            if (volumeInput) {
                audioPreview.volume = volumeInput.value;
            }
        } else {
            audioSource.src = '';
            musicTitle.textContent = '未选择音乐文件';
            musicSize.textContent = '--';
        }
    }

    async loadMediaForMusic() {
        try {
            const response = await fetch('/api/media');
            const mediaList = await response.json();
            
            // 筛选音频文件
            const audioFiles = mediaList.filter(media => media.type === 'audio');
            
            this.showMusicSelectorModal(audioFiles);
        } catch (error) {
            console.error('加载音频文件失败:', error);
            this.showMessage('加载音频文件失败', 'error');
        }
    }

    showMusicSelectorModal(audioList) {
        // 创建音乐选择器模态框
        let modal = document.getElementById('musicSelectorModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'musicSelectorModal';
            modal.className = 'music-selector-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="music-selector-content">
                <div class="music-selector-header">
                    <h3><i class="fas fa-music"></i> 选择背景音乐</h3>
                    <button class="close-btn" onclick="admin.closeMusicSelector()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="music-selector-body">
                    ${audioList.length > 0 ? `
                        <div class="music-selector-grid">
                            ${audioList.map(audio => `
                                <div class="music-selector-item" data-url="${audio.url}" onclick="admin.selectMusicFile(this)">
                                    <i class="fas fa-music"></i>
                                    <div class="music-name">${audio.originalName}</div>
                                    <div class="music-meta">${this.formatFileSize(audio.size)}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="empty-state">
                            <i class="fas fa-music"></i>
                            <p>没有找到音频文件，请先上传音频文件</p>
                        </div>
                    `}
                </div>
                <div class="music-selector-actions">
                    <button class="btn btn-secondary" onclick="admin.closeMusicSelector()">取消</button>
                    <button class="btn btn-primary" onclick="admin.confirmMusicSelection()">确定</button>
                </div>
            </div>
        `;

        modal.classList.add('active');
        this.selectedMusicUrl = '';
    }

    openMusicSelector() {
        this.loadMediaForMusic();
    }

    selectMusicFile(element) {
        // 移除其他选中状态
        document.querySelectorAll('.music-selector-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // 添加选中状态
        element.classList.add('selected');
        this.selectedMusicUrl = element.dataset.url;
    }

    confirmMusicSelection() {
        if (this.selectedMusicUrl) {
            document.getElementById('musicUrl').value = this.selectedMusicUrl;
            this.updateMusicPreview(this.selectedMusicUrl);
        }
        this.closeMusicSelector();
    }

    closeMusicSelector() {
        const modal = document.getElementById('musicSelectorModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    async handleSaveMusicSettings() {
        try {
            const musicSettings = {
                enabled: document.getElementById('musicEnabled').checked,
                autoplay: document.getElementById('musicAutoplay').checked,
                loop: document.getElementById('musicLoop').checked,
                volume: parseFloat(document.getElementById('musicVolume').value),
                url: document.getElementById('musicUrl').value.trim(),
                title: document.getElementById('musicTitle').value.trim(),
                artist: document.getElementById('musicArtist').value.trim()
            };

            const response = await fetch('/api/settings/music', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(musicSettings)
            });

            if (response.ok) {
                this.showMessage('背景音乐设置保存成功！', 'success');
                // 通知主页更新设置
                this.notifySettingsUpdate();
            } else {
                this.showMessage('保存失败，请重试', 'error');
            }
        } catch (error) {
            console.error('保存音乐设置失败:', error);
            this.showMessage('保存失败，请重试', 'error');
        }
    }

    previewMusic() {
        const audioPreview = document.getElementById('audioPreview');
        const musicUrl = document.getElementById('musicUrl').value.trim();
        
        if (!musicUrl) {
            this.showMessage('请先选择音乐文件', 'error');
            return;
        }

        if (audioPreview.paused) {
            audioPreview.play().then(() => {
                this.showMessage('开始播放预览', 'success');
            }).catch(() => {
                this.showMessage('播放失败，请检查音频文件', 'error');
            });
        } else {
            audioPreview.pause();
            this.showMessage('暂停播放', 'info');
        }
    }

    // 头像相关功能
    updateAvatarPreview(avatarUrl) {
        const avatarImg = document.getElementById('avatarImg');
        const avatarPlaceholder = document.querySelector('.avatar-placeholder');
        
        if (avatarUrl) {
            avatarImg.src = avatarUrl.startsWith('/') ? avatarUrl : '/' + avatarUrl;
            avatarImg.style.display = 'block';
            avatarPlaceholder.style.display = 'none';
        } else {
            avatarImg.style.display = 'none';
            avatarPlaceholder.style.display = 'flex';
        }
    }

    // 打开头像选择器
    async openAvatarSelector() {
        try {
            const response = await fetch('/api/media');
            const mediaList = await response.json();
            
            // 只显示图片文件
            const imageList = mediaList.filter(media => media.type === 'image');
            
            if (imageList.length === 0) {
                this.showMessage('媒体库中没有图片文件，请先上传图片', 'error');
                return;
            }
            
            this.showAvatarSelectorModal(imageList);
        } catch (error) {
            console.error('加载媒体列表失败:', error);
            this.showMessage('加载媒体列表失败', 'error');
        }
    }

    // 显示头像选择器模态框
    showAvatarSelectorModal(imageList) {
        // 创建头像选择器模态框
        const modal = document.createElement('div');
        modal.className = 'media-selector-modal active';
        modal.innerHTML = `
            <div class="media-selector-content">
                <div class="media-selector-header">
                    <h3><i class="fas fa-user-circle"></i> 选择头像</h3>
                    <button class="close-selector-btn" onclick="this.closest('.media-selector-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="media-selector-body">
                    <div class="media-selector-grid">
                        ${imageList.map(image => `
                            <div class="media-selector-item" onclick="admin.selectAvatarImage('${image.url}', this)">
                                <img src="${image.url}" alt="${image.originalName}">
                                <div class="media-name">${image.originalName}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="media-selector-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.media-selector-modal').remove()">取消</button>
                    <button class="btn btn-primary" onclick="admin.confirmAvatarSelection()">确认选择</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.currentAvatarModal = modal;
    }

    // 选择头像图片
    selectAvatarImage(url, element) {
        // 移除其他选中状态
        const modal = element.closest('.media-selector-modal');
        modal.querySelectorAll('.media-selector-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // 添加选中状态
        element.classList.add('selected');
        this.selectedAvatarUrl = url;
    }

    // 确认头像选择
    confirmAvatarSelection() {
        if (!this.selectedAvatarUrl) {
            this.showMessage('请选择一张图片', 'error');
            return;
        }
        
        // 更新头像URL输入框
        document.getElementById('avatarUrl').value = this.selectedAvatarUrl;
        
        // 更新头像预览
        this.updateAvatarPreview(this.selectedAvatarUrl);
        
        // 关闭模态框
        if (this.currentAvatarModal) {
            this.currentAvatarModal.remove();
            this.currentAvatarModal = null;
        }
        
        this.selectedAvatarUrl = null;
        this.showMessage('头像已选择', 'success');
    }

    // 上传头像
    uploadAvatar() {
        document.getElementById('avatarUpload').click();
    }

    // 处理头像上传
    async handleAvatarUpload(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        
        const file = files[0];
        
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            this.showMessage('请选择图片文件', 'error');
            return;
        }
        
        // 验证文件大小 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showMessage('文件大小不能超过5MB', 'error');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            this.showMessage('头像上传中...', 'info');
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            if (response.ok && result.url) {
                // 更新头像URL输入框
                document.getElementById('avatarUrl').value = result.url;
                
                // 更新头像预览
                this.updateAvatarPreview(result.url);
                
                this.showMessage('头像上传成功', 'success');
            } else {
                this.showMessage(result.error || '上传失败', 'error');
            }
        } catch (error) {
            console.error('头像上传失败:', error);
            this.showMessage('头像上传失败', 'error');
        }
        
        // 清空file input
        event.target.value = '';
    }

    // 通知主页更新设置
    notifySettingsUpdate() {
        // 方式1：通过localStorage发送跨标签页消息
        localStorage.setItem('settingsUpdated', Date.now().toString());
        
        // 方式2：如果可以获取到主页窗口，直接发送postMessage
        try {
            // 获取所有打开的窗口
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage({
                    type: 'SETTINGS_UPDATED',
                    timestamp: Date.now()
                }, '*');
            }
            
            // 或者通过BroadcastChannel API（如果支持）
            if ('BroadcastChannel' in window) {
                const channel = new BroadcastChannel('settings-update');
                channel.postMessage({
                    type: 'SETTINGS_UPDATED',
                    timestamp: Date.now()
                });
                channel.close();
            }
        } catch (error) {
            console.log('无法直接通知主页，将通过localStorage通信');
        }
        
        console.log('已发送设置更新通知');
    }

    // 通知主页更新内容
    notifyContentUpdate() {
        // 方式1：通过localStorage发送跨标签页消息
        localStorage.setItem('contentUpdated', Date.now().toString());
        
        // 方式2：如果可以获取到主页窗口，直接发送postMessage
        try {
            // 获取所有打开的窗口
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage({
                    type: 'CONTENT_UPDATED',
                    timestamp: Date.now()
                }, '*');
            }
            
            // 或者通过BroadcastChannel API（如果支持）
            if ('BroadcastChannel' in window) {
                const channel = new BroadcastChannel('content-update');
                channel.postMessage({
                    type: 'CONTENT_UPDATED',
                    timestamp: Date.now()
                });
                channel.close();
            }
        } catch (error) {
            console.log('无法直接通知主页，将通过localStorage通信');
        }
        
        console.log('已发送内容更新通知');
    }

    // 打开图片选择器（用于文章编辑）
    openImageSelector() {
        this.currentImageTarget = 'article';
        
        // 创建图片选择器模态框
        if (!document.getElementById('imageSelectorModal')) {
            this.createImageSelectorModal();
        }
        
        // 加载媒体文件
        this.loadMediaForImageSelector();
        
        // 显示模态框
        const modal = document.getElementById('imageSelectorModal');
        modal.classList.add('active');
    }

    // 创建图片选择器模态框
    createImageSelectorModal() {
        const modal = document.createElement('div');
        modal.id = 'imageSelectorModal';
        modal.className = 'image-selector-modal';
        modal.innerHTML = `
            <div class="image-selector-content">
                <div class="image-selector-header">
                    <h3>选择图片</h3>
                    <button class="close-selector-btn" onclick="admin.closeImageSelector()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="image-selector-body">
                    <div class="image-selector-grid" id="imageSelectorGrid">
                        <!-- 图片文件列表 -->
                    </div>
                </div>
                <div class="image-selector-actions">
                    <button class="btn btn-secondary" onclick="admin.closeImageSelector()">取消</button>
                    <button class="btn btn-primary" onclick="admin.confirmImageSelection()">确认选择</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // 加载媒体文件用于图片选择
    async loadMediaForImageSelector() {
        try {
            const response = await fetch('/api/media');
            const mediaFiles = await response.json();
            
            const grid = document.getElementById('imageSelectorGrid');
            if (!grid) return;
            
            if (mediaFiles.length === 0) {
                grid.innerHTML = '<div class="empty-state">暂无媒体文件</div>';
                return;
            }
            
            // 只显示图片文件
            const imageFiles = mediaFiles.filter(file => file.type === 'image');
            
            if (imageFiles.length === 0) {
                grid.innerHTML = '<div class="empty-state">暂无图片文件</div>';
                return;
            }
            
            grid.innerHTML = imageFiles.map(file => `
                <div class="image-selector-item" data-url="${file.url}" onclick="admin.selectImage('${file.url}', '${file.originalName}')">
                    <img src="${file.url}" alt="${file.originalName}">
                    <div class="image-name">${file.originalName}</div>
                </div>
            `).join('');
        } catch (error) {
            console.error('加载图片文件失败:', error);
            const grid = document.getElementById('imageSelectorGrid');
            if (grid) {
                grid.innerHTML = '<div class="empty-state">加载失败</div>';
            }
        }
    }

    // 选择图片
    selectImage(url, name) {
        // 移除之前的选中状态
        document.querySelectorAll('.image-selector-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // 添加选中状态
        event.currentTarget.classList.add('selected');
        this.selectedImageUrl = url;
        this.selectedImageName = name;
    }

    // 确认图片选择
    confirmImageSelection() {
        if (!this.selectedImageUrl) {
            this.showMessage('请先选择一个图片', 'error');
            return;
        }
        
        // 设置到编辑表单
        const imageInput = document.getElementById('editImage');
        if (imageInput) {
            imageInput.value = this.selectedImageUrl;
            // 触发预览
            showImagePreview(this.selectedImageUrl);
        }
        
        this.closeImageSelector();
        this.showMessage('图片选择成功！', 'success');
    }

    // 关闭图片选择器
    closeImageSelector() {
        const modal = document.getElementById('imageSelectorModal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.selectedImageUrl = null;
        this.selectedImageName = null;
    }

    // 打开富文本编辑器图片选择器
    openRichTextImageSelector() {
        this.currentImageTarget = 'richtext';
        
        // 创建富文本图片选择器模态框
        if (!document.getElementById('richTextImageModal')) {
            this.createRichTextImageModal();
        }
        
        // 显示模态框
        const modal = document.getElementById('richTextImageModal');
        modal.classList.add('active');
    }

    // 创建富文本图片选择器模态框
    createRichTextImageModal() {
        const modal = document.createElement('div');
        modal.id = 'richTextImageModal';
        modal.className = 'richtext-image-modal';
        modal.innerHTML = `
            <div class="richtext-image-content">
                <div class="richtext-image-header">
                    <h3>插入图片</h3>
                    <button class="close-selector-btn" onclick="admin.closeRichTextImageModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="richtext-image-body">
                    <div class="image-options">
                        <div class="option-card" onclick="admin.showMediaLibrary()">
                            <i class="fas fa-folder-open"></i>
                            <h4>从媒体库选择</h4>
                            <p>选择已上传的图片</p>
                        </div>
                        <div class="option-card" onclick="admin.uploadNewImage()">
                            <i class="fas fa-upload"></i>
                            <h4>上传新图片</h4>
                            <p>从本地选择图片上传</p>
                        </div>
                        <div class="option-card" onclick="admin.inputImageUrl()">
                            <i class="fas fa-link"></i>
                            <h4>输入图片链接</h4>
                            <p>使用外部图片URL</p>
                        </div>
                    </div>
                    
                    <!-- 媒体库视图 -->
                    <div class="media-library-view" id="mediaLibraryView" style="display: none;">
                        <div class="media-header">
                            <button class="back-btn" onclick="admin.showImageOptions()">
                                <i class="fas fa-arrow-left"></i> 返回选择
                            </button>
                            <h4>选择图片</h4>
                        </div>
                        <div class="media-grid-container">
                            <div class="media-grid" id="richTextMediaGrid">
                                <!-- 媒体文件列表 -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- URL输入视图 -->
                    <div class="url-input-view" id="urlInputView" style="display: none;">
                        <div class="url-header">
                            <button class="back-btn" onclick="admin.showImageOptions()">
                                <i class="fas fa-arrow-left"></i> 返回选择
                            </button>
                            <h4>输入图片链接</h4>
                        </div>
                        <div class="url-form">
                            <input type="text" id="imageUrlInput" placeholder="请输入图片URL" class="url-input">
                            <div class="url-preview" id="urlPreview" style="display: none;">
                                <img id="previewImage" src="" alt="预览图片">
                            </div>
                            <div class="url-actions">
                                <button class="btn btn-secondary" onclick="admin.showImageOptions()">取消</button>
                                <button class="btn btn-primary" onclick="admin.confirmUrlImage()">确认插入</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="richtext-image-footer" id="richTextImageFooter">
                    <button class="btn btn-secondary" onclick="admin.closeRichTextImageModal()">取消</button>
                    <button class="btn btn-primary" id="confirmImageBtn" onclick="admin.confirmRichTextImage()" style="display: none;">确认插入</button>
                </div>
            </div>
            <input type="file" id="richTextImageUpload" accept="image/*" style="display: none;">
        `;
        document.body.appendChild(modal);
        
        // 绑定文件上传事件
        const fileInput = document.getElementById('richTextImageUpload');
        fileInput.addEventListener('change', (e) => this.handleRichTextImageUpload(e));
        
        // 绑定URL输入事件
        const urlInput = document.getElementById('imageUrlInput');
        urlInput.addEventListener('input', (e) => this.previewUrlImage(e.target.value));
    }

    // 显示图片选择选项
    showImageOptions() {
        document.querySelector('.image-options').style.display = 'grid';
        document.getElementById('mediaLibraryView').style.display = 'none';
        document.getElementById('urlInputView').style.display = 'none';
        document.getElementById('richTextImageFooter').style.display = 'flex';
        document.getElementById('confirmImageBtn').style.display = 'none';
    }

    // 显示媒体库
    async showMediaLibrary() {
        document.querySelector('.image-options').style.display = 'none';
        document.getElementById('mediaLibraryView').style.display = 'block';
        document.getElementById('urlInputView').style.display = 'none';
        document.getElementById('richTextImageFooter').style.display = 'none';
        
        await this.loadRichTextMediaGrid();
    }

    // 加载富文本媒体网格
    async loadRichTextMediaGrid() {
        try {
            const response = await fetch('/api/media');
            const mediaFiles = await response.json();
            
            const grid = document.getElementById('richTextMediaGrid');
            if (!grid) return;
            
            const imageFiles = mediaFiles.filter(file => file.type === 'image');
            
            if (imageFiles.length === 0) {
                grid.innerHTML = '<div class="empty-state">暂无图片文件</div>';
                return;
            }
            
            grid.innerHTML = imageFiles.map(file => `
                <div class="media-item" data-url="${file.url}" onclick="admin.selectRichTextImage('${file.url}', '${file.originalName}')">
                    <img src="${file.url}" alt="${file.originalName}">
                    <div class="media-name">${file.originalName}</div>
                </div>
            `).join('');
        } catch (error) {
            console.error('加载媒体文件失败:', error);
            const grid = document.getElementById('richTextMediaGrid');
            if (grid) {
                grid.innerHTML = '<div class="empty-state">加载失败</div>';
            }
        }
    }

    // 选择富文本图片
    selectRichTextImage(url, name) {
        // 移除之前的选中状态
        document.querySelectorAll('#richTextMediaGrid .media-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // 添加选中状态
        event.currentTarget.classList.add('selected');
        this.selectedRichTextImageUrl = url;
        this.selectedRichTextImageName = name;
        
        // 显示确认按钮
        document.getElementById('richTextImageFooter').style.display = 'flex';
        document.getElementById('confirmImageBtn').style.display = 'inline-block';
    }

    // 上传新图片
    uploadNewImage() {
        document.getElementById('richTextImageUpload').click();
    }

    // 处理富文本图片上传
    async handleRichTextImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            this.showMessage('上传中...', 'info');
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            if (response.ok) {
                this.selectedRichTextImageUrl = result.url;
                this.selectedRichTextImageName = file.name;
                this.showMessage('上传成功！', 'success');
                
                // 直接插入图片
                this.insertImageToRichText(result.url);
                this.closeRichTextImageModal();
            } else {
                this.showMessage(result.error || '上传失败', 'error');
            }
        } catch (error) {
            console.error('上传失败:', error);
            this.showMessage('上传失败', 'error');
        }
        
        // 清空文件输入
        event.target.value = '';
    }

    // 输入图片URL
    inputImageUrl() {
        document.querySelector('.image-options').style.display = 'none';
        document.getElementById('mediaLibraryView').style.display = 'none';
        document.getElementById('urlInputView').style.display = 'block';
        document.getElementById('richTextImageFooter').style.display = 'none';
        
        // 清空输入框
        document.getElementById('imageUrlInput').value = '';
        document.getElementById('urlPreview').style.display = 'none';
    }

    // 预览URL图片
    previewUrlImage(url) {
        const preview = document.getElementById('urlPreview');
        const img = document.getElementById('previewImage');
        
        if (url.trim()) {
            img.src = url;
            img.onload = () => {
                preview.style.display = 'block';
            };
            img.onerror = () => {
                preview.style.display = 'none';
            };
        } else {
            preview.style.display = 'none';
        }
    }

    // 确认URL图片
    confirmUrlImage() {
        const url = document.getElementById('imageUrlInput').value.trim();
        if (url) {
            this.insertImageToRichText(url);
            this.closeRichTextImageModal();
        } else {
            this.showMessage('请输入有效的图片URL', 'error');
        }
    }

    // 确认富文本图片插入
    confirmRichTextImage() {
        if (this.selectedRichTextImageUrl) {
            this.insertImageToRichText(this.selectedRichTextImageUrl);
            this.closeRichTextImageModal();
        } else {
            this.showMessage('请先选择一个图片', 'error');
        }
    }

    // 插入图片到富文本编辑器
    insertImageToRichText(url) {
        const img = document.createElement('img');
        img.src = url;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.margin = '10px 0';
        
        // 恢复保存的光标位置并插入图片
        if (window.savedRange) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(window.savedRange);
            
            window.savedRange.insertNode(img);
            window.savedRange.setStartAfter(img);
            window.savedRange.collapse(true);
            
            // 清除保存的范围
            window.savedRange = null;
        } else {
            // 如果没有保存的范围，插入到编辑器末尾
            const editor = document.getElementById('editContent');
            editor.appendChild(img);
        }
        
        // 重新聚焦编辑器
        document.getElementById('editContent').focus();
    }

    // 关闭富文本图片选择模态框
    closeRichTextImageModal() {
        const modal = document.getElementById('richTextImageModal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.selectedRichTextImageUrl = null;
        this.selectedRichTextImageName = null;
        window.savedRange = null;
        
        // 重置视图
        this.showImageOptions();
    }

}

// 图片上传相关函数
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.url) {
            document.getElementById('editImage').value = result.url;
            showImagePreview(result.url);
            admin.showMessage('图片上传成功', 'success');
        } else {
            admin.showMessage(result.error || '上传失败', 'error');
        }
    })
    .catch(error => {
        console.error('上传失败:', error);
        admin.showMessage('上传失败', 'error');
    });
}

function handleImageUrl(event) {
    const url = event.target.value.trim();
    if (url) {
        showImagePreview(url);
    } else {
        hideImagePreview();
    }
}

function showImagePreview(url) {
    const preview = document.getElementById('imagePreview');
    const img = document.getElementById('previewImg');
    
    img.src = url;
    preview.style.display = 'block';
}

function hideImagePreview() {
    document.getElementById('imagePreview').style.display = 'none';
}

function removeImage() {
    document.getElementById('editImage').value = '';
    hideImagePreview();
}

// 富文本编辑器相关函数
function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('editContent').focus();
}

function formatHeading(tag) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const element = document.createElement(tag);
        element.textContent = selection.toString() || '标题';
        
        if (selection.toString()) {
            range.deleteContents();
        }
        range.insertNode(element);
        
        // 清除选择并将光标移动到元素后面
        selection.removeAllRanges();
        range.setStartAfter(element);
        range.collapse(true);
        selection.addRange(range);
    }
    document.getElementById('editContent').focus();
}

function insertImage() {
    // 保存当前光标位置
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        window.savedRange = selection.getRangeAt(0);
    }
    
    // 打开图片选择模态框
    admin.openRichTextImageSelector();
}

function insertLink() {
    const url = prompt('请输入链接URL:');
    if (url) {
        const text = prompt('请输入链接文字:', url);
        if (text) {
            const link = document.createElement('a');
            link.href = url;
            link.textContent = text;
            link.target = '_blank';
            
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (selection.toString()) {
                    range.deleteContents();
                }
                range.insertNode(link);
                range.setStartAfter(link);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
    document.getElementById('editContent').focus();
}

// 全局函数（供HTML调用）
function switchPage(page) { 
    console.log('切换页面:', page);
    admin.switchPage(page); 
}

function closeEditModal() { 
    console.log('HTML调用关闭模态框');
    admin.closeEditModal(); 
}

// 强制关闭模态框的紧急函数
window.forceCloseModal = function() {
    console.log('强制关闭模态框');
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        if (window.admin) {
            window.admin.currentSection = '';
            window.admin.currentItem = null;
        }
    }
};

// 初始化管理系统
const admin = new AdminSystem();
window.admin = admin;

// 扩展系统设置tab切换逻辑，加载音乐设置
const originalSwitchSettingsTab = admin.switchSettingsTab.bind(admin);
admin.switchSettingsTab = function(tab) {
    originalSwitchSettingsTab(tab);
    
    if (tab === 'music') {
        setTimeout(() => {
            this.loadMusicSettings();
        }, 100);
    }
};

// 照片墙配置功能
admin.loadPhotowallSettings = async function() {
    try {
        const response = await fetch('/api/content');
        const data = await response.json();
        
        if (data.settings && data.settings.media && data.settings.media.photoWall) {
            const photoWall = data.settings.media.photoWall;
            
            // 加载每个照片位置的配置
            Object.keys(photoWall).forEach(key => {
                const photoIndex = key.replace('photo', '');
                const photo = photoWall[key];
                
                const srcInput = document.getElementById(`photo${photoIndex}Src`);
                const titleInput = document.getElementById(`photo${photoIndex}Title`);
                const previewImg = document.getElementById(`photoImg${photoIndex}`);
                const placeholderText = document.querySelector(`#photoPreview${photoIndex} .placeholder-text`);
                
                if (srcInput && titleInput) {
                    srcInput.value = photo.src || '';
                    titleInput.value = photo.title || '';
                    
                    if (photo.src && previewImg) {
                        previewImg.src = photo.src;
                        previewImg.style.display = 'block';
                        if (placeholderText) {
                            placeholderText.style.display = 'none';
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('加载照片墙配置失败:', error);
    }
};

admin.savePhotowallSettings = async function() {
    try {
        const photoWallConfig = {};
        
        // 收集所有照片配置
        for (let i = 1; i <= 6; i++) {
            const srcInput = document.getElementById(`photo${i}Src`);
            const titleInput = document.getElementById(`photo${i}Title`);
            
            if (srcInput && titleInput) {
                const src = srcInput.value.trim();
                const title = titleInput.value.trim();
                
                if (src && title) {
                    photoWallConfig[`photo${i}`] = {
                        src: src,
                        title: title
                    };
                }
            }
        }
        
        // 发送到服务器
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                media: {
                    photoWall: photoWallConfig
                }
            })
        });
        
        if (response.ok) {
            this.showMessage('照片墙配置保存成功！', 'success');
        } else {
            throw new Error('保存失败');
        }
    } catch (error) {
        console.error('保存照片墙配置失败:', error);
        this.showMessage('保存失败，请重试', 'error');
    }
};

admin.openMediaSelector = function(slotIndex) {
    this.currentPhotoSlot = slotIndex;
    
    // 创建媒体选择器模态框
    if (!document.getElementById('mediaSelectorModal')) {
        this.createMediaSelectorModal();
    }
    
    // 加载媒体文件
    this.loadMediaForSelector();
    
    // 显示模态框
    const modal = document.getElementById('mediaSelectorModal');
    modal.classList.add('active');
};

admin.createMediaSelectorModal = function() {
    const modal = document.createElement('div');
    modal.id = 'mediaSelectorModal';
    modal.className = 'media-selector-modal';
    modal.innerHTML = `
        <div class="media-selector-content">
            <div class="media-selector-header">
                <h3>选择图片</h3>
                <button class="close-selector-btn" onclick="admin.closeMediaSelector()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="media-selector-body">
                <div class="media-selector-grid" id="mediaSelectorGrid">
                    <!-- 媒体文件列表 -->
                </div>
            </div>
            <div class="media-selector-actions">
                <button class="btn btn-secondary" onclick="admin.closeMediaSelector()">取消</button>
                <button class="btn btn-primary" onclick="admin.confirmMediaSelection()">确认选择</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

admin.loadMediaForSelector = async function() {
    try {
        const response = await fetch('/api/media');
        const mediaFiles = await response.json();
        
        const grid = document.getElementById('mediaSelectorGrid');
        if (!grid) return;
        
        if (mediaFiles.length === 0) {
            grid.innerHTML = '<div class="empty-state">暂无媒体文件</div>';
            return;
        }
        
        // 只显示图片文件
        const imageFiles = mediaFiles.filter(file => file.type === 'image');
        
        grid.innerHTML = imageFiles.map(file => `
            <div class="media-selector-item" data-url="${file.url}" onclick="admin.selectMedia('${file.url}', '${file.originalName}')">
                <img src="${file.url}" alt="${file.originalName}">
                <div class="media-name">${file.originalName}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('加载媒体文件失败:', error);
        const grid = document.getElementById('mediaSelectorGrid');
        if (grid) {
            grid.innerHTML = '<div class="empty-state">加载失败</div>';
        }
    }
};

admin.selectMedia = function(url, name) {
    // 移除之前的选中状态
    document.querySelectorAll('.media-selector-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // 添加选中状态
    event.currentTarget.classList.add('selected');
    this.selectedMediaUrl = url;
    this.selectedMediaName = name;
};

admin.confirmMediaSelection = function() {
    if (!this.selectedMediaUrl || !this.currentPhotoSlot) {
        this.showMessage('请先选择一个图片', 'error');
        return;
    }
    
    // 设置到相应的输入框
    const srcInput = document.getElementById(`photo${this.currentPhotoSlot}Src`);
    const titleInput = document.getElementById(`photo${this.currentPhotoSlot}Title`);
    const previewImg = document.getElementById(`photoImg${this.currentPhotoSlot}`);
    const placeholderText = document.querySelector(`#photoPreview${this.currentPhotoSlot} .placeholder-text`);
    
    if (srcInput) {
        srcInput.value = this.selectedMediaUrl;
    }
    
    if (titleInput && !titleInput.value) {
        titleInput.value = this.selectedMediaName.replace(/\.[^/.]+$/, ""); // 移除文件扩展名
    }
    
    if (previewImg) {
        previewImg.src = this.selectedMediaUrl;
        previewImg.style.display = 'block';
        if (placeholderText) {
            placeholderText.style.display = 'none';
        }
    }
    
    this.closeMediaSelector();
    this.showMessage('图片选择成功！', 'success');
};

admin.closeMediaSelector = function() {
    const modal = document.getElementById('mediaSelectorModal');
    if (modal) {
        modal.classList.remove('active');
    }
    this.selectedMediaUrl = null;
    this.selectedMediaName = null;
    this.currentPhotoSlot = null;
};

admin.previewPhotoWall = function() {
    // 在新窗口中打开主页预览
    window.open('/', '_blank');
};

admin.loadMediaForPhotoWall = function() {
    // 刷新媒体库（重新加载媒体管理数据）
    this.loadMediaData();
    this.showMessage('媒体库已刷新', 'success');
};

// 扩展初始化功能
const originalInit = admin.init.bind(admin);
admin.init = function() {
    originalInit();
    this.initTagManagement();
    this.initSettingsPage();
    
    // 监听tab切换，加载标签数据
    const originalSwitchTab = this.switchTab.bind(this);
    this.switchTab = function(tab) {
        originalSwitchTab(tab);
        if (tab === 'tags') {
            this.loadTags();
        }
    };
    
    // 照片墙配置表单提交
    const photowallForm = document.getElementById('photowallSettingsForm');
    if (photowallForm) {
        photowallForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePhotowallSettings();
        });
    }
    
    // 系统设置tab切换时加载相应数据
    const originalSwitchSettingsTab = document.querySelectorAll('.settings-tab-btn');
    originalSwitchSettingsTab.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            if (tab === 'photowall') {
                setTimeout(() => {
                    this.loadPhotowallSettings();
                    this.initPhotowallInputEvents();
                }, 100);
            }
        });
    });
    
    // 初始化照片墙输入框事件
    this.initPhotowallInputEvents();
}

// 初始化照片墙输入框事件
admin.initPhotowallInputEvents = function() {
    // 为每个照片输入框添加实时预览功能
    for (let i = 1; i <= 6; i++) {
        const srcInput = document.getElementById(`photo${i}Src`);
        const previewImg = document.getElementById(`photoImg${i}`);
        const placeholderText = document.querySelector(`#photoPreview${i} .placeholder-text`);
        
        if (srcInput && previewImg && placeholderText) {
            srcInput.addEventListener('input', function() {
                const url = this.value.trim();
                if (url) {
                    previewImg.src = url;
                    previewImg.style.display = 'block';
                    placeholderText.style.display = 'none';
                    
                    // 检查图片是否能正常加载
                    previewImg.onerror = function() {
                        this.style.display = 'none';
                        placeholderText.style.display = 'flex';
                        placeholderText.textContent = '图片加载失败';
                    };
                    
                    previewImg.onload = function() {
                        placeholderText.style.display = 'none';
                    };
                } else {
                    previewImg.style.display = 'none';
                    placeholderText.style.display = 'flex';
                    placeholderText.textContent = `照片位置 ${i}`;
                }
            });
        }
    }
}; 