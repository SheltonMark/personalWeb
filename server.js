const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static('.'));
app.use('/src', express.static('src'));
app.use('/pages', express.static('pages'));
app.use('/admin', express.static('admin'));

// 文件上传配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 创建必要的目录
const dirs = ['src/uploads', 'data'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 数据文件路径
const dataPath = path.join(__dirname, 'data', 'content.json');

// 初始化数据文件
if (!fs.existsSync(dataPath)) {
  const initialData = {
    user: {
      name: "小璇",
      title: "记录生活的美好",
      avatar: "src/avatar.jpg",
      bio: "在这里，每一个故事都值得被温柔对待"
    },
    sections: {
      growth: [
        {
          id: 1,
          title: "童年时光",
          icon: "👶",
          description: "那些天真无邪的岁月，每一天都充满了好奇与惊喜...",
          date: "2000-2010",
          content: "童年是人生中最美好的时光，那时的我们无忧无虑，对世界充满好奇。每一个阳光明媚的早晨，都是新的冒险的开始。"
        },
        {
          id: 2,
          title: "求学之路",
          icon: "🎓",
          description: "书本与梦想相伴，知识的种子在心中生根发芽...",
          date: "2010-2020",
          content: "求学的道路虽然充满挑战，但每一份努力都在为未来铺路。在书海中遨游，在知识的殿堂里成长。"
        },
        {
          id: 3,
          title: "职场新人",
          icon: "💼",
          description: "踏入社会的第一步，学会在挑战中成长...",
          date: "2020-至今",
          content: "踏入职场，面对新的挑战和机遇。每一天都在学习，每一次经历都是成长的阶梯。"
        }
      ],
      articles: [
        {
          id: 1,
          title: "春天的樱花",
          date: "2024-03-15",
          excerpt: "春天来了，樱花盛开...",
          content: "春天的脚步悄然而至，樱花如约绽放。粉色的花瓣在微风中飘洒，如同天使的羽毛轻抚大地。",
          image: "src/japan.jpg"
        }
      ]
    }
  };
  fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
}

// 读取数据
function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error('读取数据失败:', err);
    return null;
  }
}

// 写入数据
function writeData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('写入数据失败:', err);
    return false;
  }
}

// 路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

// API路由
// 获取所有数据
app.get('/api/data', (req, res) => {
  const data = readData();
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: '读取数据失败' });
  }
});

// 获取特定部分数据
app.get('/api/data/:section', (req, res) => {
  const data = readData();
  const section = req.params.section;
  
  if (data && data.sections && data.sections[section]) {
    res.json(data.sections[section]);
  } else {
    res.status(404).json({ error: '数据不存在' });
  }
});

// 获取单个内容
app.get('/api/data/:section/:id', (req, res) => {
  const data = readData();
  const section = req.params.section;
  const id = parseInt(req.params.id);
  
  if (data && data.sections && data.sections[section]) {
    const item = data.sections[section].find(item => item.id === id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: '内容不存在' });
    }
  } else {
    res.status(404).json({ error: '数据不存在' });
  }
});

// 更新用户信息
app.put('/api/user', (req, res) => {
  const data = readData();
  if (data) {
    data.user = { ...data.user, ...req.body };
    if (writeData(data)) {
      res.json({ message: '用户信息更新成功', user: data.user });
    } else {
      res.status(500).json({ error: '更新失败' });
    }
  } else {
    res.status(500).json({ error: '读取数据失败' });
  }
});

// 添加内容
app.post('/api/data/:section', (req, res) => {
  const data = readData();
  const section = req.params.section;
  
  if (data && data.sections) {
    if (!data.sections[section]) {
      data.sections[section] = [];
    }
    
    const newItem = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    data.sections[section].push(newItem);
    
    if (writeData(data)) {
      res.json({ message: '内容添加成功', item: newItem });
    } else {
      res.status(500).json({ error: '添加失败' });
    }
  } else {
    res.status(500).json({ error: '读取数据失败' });
  }
});

// 更新内容
app.put('/api/data/:section/:id', (req, res) => {
  const data = readData();
  const section = req.params.section;
  const id = parseInt(req.params.id);
  
  if (data && data.sections && data.sections[section]) {
    const index = data.sections[section].findIndex(item => item.id === id);
    if (index !== -1) {
      data.sections[section][index] = { ...data.sections[section][index], ...req.body };
      
      if (writeData(data)) {
        res.json({ message: '内容更新成功', item: data.sections[section][index] });
      } else {
        res.status(500).json({ error: '更新失败' });
      }
    } else {
      res.status(404).json({ error: '内容不存在' });
    }
  } else {
    res.status(404).json({ error: '数据不存在' });
  }
});

// 删除内容
app.delete('/api/data/:section/:id', (req, res) => {
  const data = readData();
  const section = req.params.section;
  const id = parseInt(req.params.id);
  
  if (data && data.sections && data.sections[section]) {
    const index = data.sections[section].findIndex(item => item.id === id);
    if (index !== -1) {
      const deletedItem = data.sections[section].splice(index, 1)[0];
      
      if (writeData(data)) {
        res.json({ message: '内容删除成功', item: deletedItem });
      } else {
        res.status(500).json({ error: '删除失败' });
      }
    } else {
      res.status(404).json({ error: '内容不存在' });
    }
  } else {
    res.status(404).json({ error: '数据不存在' });
  }
});

// 文件上传
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '没有文件上传' });
  }
  
  const fileUrl = '/src/uploads/' + req.file.filename;
  res.json({ 
    message: '文件上传成功', 
    url: fileUrl,
    filename: req.file.filename 
  });
});

// 获取本机IP地址
const os = require('os');
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // 跳过内部和非IPv4地址
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// 启动服务器 - 监听所有网络接口
app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log('\n🌸 ==================== 服务器启动成功 ====================');
  console.log(`🌸 服务器运行在端口: ${PORT}`);
  console.log(`🌸 本机访问: http://localhost:${PORT}`);
  console.log(`🌸 局域网访问: http://${localIP}:${PORT}`);
  console.log(`🌸 主页地址: http://${localIP}:${PORT}`);
  console.log(`🌸 后台管理: http://${localIP}:${PORT}/admin`);
  console.log(`🌸 管理员账号: admin / 123456`);
  console.log('🌸 ========================================================\n');
  
  // Windows特殊提示
  if (process.platform === 'win32') {
    console.log('💡 Windows用户提示:');
    console.log('   - 如果局域网无法访问，请检查Windows防火墙设置');
    console.log('   - 或者允许Node.js通过防火墙');
    console.log('   - 确保路由器没有禁用设备间通信\n');
  }
}); 