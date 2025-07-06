#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Personal Website Python Server
Using Flask framework to implement the same functionality as Node.js version
"""

import os
import json
import socket
import platform
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Configuration
PORT = 3000
UPLOAD_FOLDER = 'src/uploads'
DATA_FOLDER = 'data'
DATA_FILE = os.path.join(DATA_FOLDER, 'content.json')
ALLOWED_EXTENSIONS = {
    # Image formats
    'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg',
    # Video formats  
    'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv',
    # Audio formats
    'mp3', 'wav', 'ogg', 'aac', 'flac'
}

# Ensure necessary directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(DATA_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_type(filename):
    """Get file type category"""
    if not filename:
        return 'unknown'
    
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    
    if ext in {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'}:
        return 'image'
    elif ext in {'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'}:
        return 'video'
    elif ext in {'mp3', 'wav', 'ogg', 'aac', 'flac'}:
        return 'audio'
    else:
        return 'unknown'

def get_local_ip():
    """Get local IP address"""
    try:
        # Create socket connection to get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return 'localhost'

def init_data():
    """Initialize data file"""
    if not os.path.exists(DATA_FILE):
        initial_data = {
            "user": {
                "name": "小璇",
                "title": "记录生活的美好",
                "avatar": "src/avatar.jpg",
                "bio": "在这里，每一个故事都值得被温柔对待"
            },
            "settings": {
                "basic": {
                    "siteName": "我的小清新个人空间",
                    "siteSubtitle": "记录生活的美好",
                    "navTitle": "✿ 我的小世界 ✿",
                    "userName": "小璇",
                    "heroTitle": "记录生活的美好\n珍藏回忆的片段",
                    "heroSubtitle": "在这里，每一个故事都值得被温柔对待",
                    "userBio": "在这里，每一个故事都值得被温柔对待",
                    "footerText": "© 2024 我的小清新个人空间 | 用心记录，温柔生活 🌸"
                },
                "sections": {
                    "growthTitle": "溯·成长",
                    "growthSubtitle": "Growth Journey",
                    "peopleTitle": "铭·相遇",
                    "peopleSubtitle": "Important People",
                    "museumTitle": "凝·岁月",
                    "museumSubtitle": "Museum Memories",
                    "travelTitle": "触·世界",
                    "travelSubtitle": "Travel Diary",
                    "articlesTitle": "文·分享",
                    "articlesSubtitle": "Article Sharing",
                    "photosTitle": "记忆相册",
                    "photosSubtitle": "Photo Gallery"
                },
                "appearance": {
                    "themeColor": "pink",
                    "enableSakura": True,
                    "enableWater": True,
                    "enableParticles": True,
                    "animationSpeed": "normal",
                    "fontFamily": "noto"
                },
                "media": {
                    "musicFile": "src/bgm.mp3",
                    "autoPlay": True,
                    "loopPlay": True,
                    "defaultVolume": 50,
                    "photoWall": {
                        "photo1": {"src": "src/1 (1).jpg", "title": "美好回忆1"},
                        "photo2": {"src": "src/1 (2).jpg", "title": "美好回忆2"},
                        "photo3": {"src": "src/1 (3).jpg", "title": "美好回忆3"},
                        "photo4": {"src": "src/1 (4).jpg", "title": "美好回忆4"},
                        "photo5": {"src": "src/1 (5).jpg", "title": "美好回忆5"},
                        "photo6": {"src": "src/1 (6).jpg", "title": "美好回忆6"}
                    }
                }
            },
            "tags": [
                "春天", "樱花", "自然", "感悟", "夏天", "童年", "回忆", "蝉鸣", 
                "技术", "编程", "生活", "思考", "温暖", "支持", "爱", "陪伴", 
                "成长", "友谊", "指导", "智慧", "启发", "文化", "历史", "科技", 
                "旅行", "美景", "体验", "探索"
            ],
            "sections": {
                "growth": [
                    {
                        "id": 1,
                        "title": "童年时光",
                        "icon": "👶",
                        "description": "那些天真无邪的岁月，每一天都充满了好奇与惊喜，每个夏天都有蝉鸣和冰棍的味道。",
                        "date": "2000-2010",
                        "content": "童年是人生中最美好的时光，那时的我们无忧无虑，对世界充满好奇。每一个阳光明媚的早晨，都是新的冒险的开始。院子里的老槐树下，奶奶总是摇着蒲扇给我讲故事，那些关于勇敢和善良的故事，至今还深深印在我心里。"
                    },
                    {
                        "id": 2,
                        "title": "求学之路",
                        "icon": "🎓",
                        "description": "书本与梦想相伴，知识的种子在心中生根发芽，每一次考试都是对自己的超越。",
                        "date": "2010-2020",
                        "content": "求学的道路虽然充满挑战，但每一份努力都在为未来铺路。在书海中遨游，在知识的殿堂里成长。从小学的第一次举手发言，到中学的熬夜刷题，再到大学的独立思考，每一步都在塑造着更好的自己。"
                    },
                    {
                        "id": 3,
                        "title": "职场新人",
                        "icon": "💼",
                        "description": "踏入社会的第一步，学会在挑战中成长，从青涩到成熟的蜕变过程。",
                        "date": "2020-至今",
                        "content": "踏入职场，面对新的挑战和机遇。每一天都在学习，每一次经历都是成长的阶梯。从第一天紧张地介绍自己，到现在能够独当一面，这个过程充满了汗水和收获。"
                    },
                    {
                        "id": 4,
                        "title": "技能成长",
                        "icon": "⚡",
                        "description": "在编程和技术的海洋中探索，每一行代码都是对未来的投资。",
                        "date": "2021-至今",
                        "content": "从Hello World开始，到能够独立完成项目，技术的学习让我看到了更广阔的世界。Python、JavaScript、数据分析，每一门技术都打开了新的可能性。"
                    }
                ],
                "people": [
                    {
                        "id": 1,
                        "title": "我的家人",
                        "icon": "👨‍👩‍👧‍👦",
                        "description": "给予我无条件爱与支持的人，是我前行路上最温暖的港湾。",
                        "tags": ["温暖", "支持", "爱"],
                        "content": "家人是我生命中最重要的存在。父母的理解和支持，让我有勇气去追求自己的梦想。每当我遇到困难时，家就是我最好的避风港。"
                    },
                    {
                        "id": 2,
                        "title": "挚友良师",
                        "icon": "👫",
                        "description": "那些陪我哭过笑过的朋友，和指引我方向的老师。",
                        "tags": ["陪伴", "成长", "友谊"],
                        "content": "真正的朋友是那些在你最困难时伸出援手的人，是那些愿意听你倾诉的人。老师们的教诲，让我不仅学到了知识，更学会了做人的道理。"
                    },
                    {
                        "id": 3,
                        "title": "人生导师",
                        "icon": "🎓",
                        "description": "在迷茫时为我点亮明灯，在困顿时给我勇气的贵人。",
                        "tags": ["指导", "智慧", "启发"],
                        "content": "每个人的成长路上都会遇到那么几个重要的人，他们可能是老师、同事或者偶然相遇的陌生人，但他们的话语和行为却能改变你的人生轨迹。"
                    }
                ],
                "museums": [
                    {
                        "id": 1,
                        "title": "故宫博物院",
                        "description": "穿越六百年时光，感受古代文明的瑰丽与庄严，每一件文物都在诉说历史的故事。",
                        "date": "2023-03-15",
                        "type": "古建筑",
                        "image": "src/forbidden_city.jpg",
                        "content": "走进故宫的那一刻，仿佛穿越了时空。红墙黄瓦，雕梁画栋，每一处细节都体现着古代工匠的精湛技艺。太和殿的庄严肃穆，御花园的精致典雅，让人不由得感叹中华文明的博大精深。"
                    },
                    {
                        "id": 2,
                        "title": "中国国家博物馆",
                        "description": "历史的长河在这里汇聚，每一件文物都诉说着动人的故事，见证着民族的辉煌。",
                        "date": "2023-05-20",
                        "type": "历史文化",
                        "image": "src/museum1.jpg",
                        "content": "国家博物馆收藏着中华民族五千年的文明史。从远古的石器时代到近现代的革命文物，每一件展品都是历史的见证。站在这些文物前，仿佛能够听到历史的回声。"
                    },
                    {
                        "id": 3,
                        "title": "中国科技馆",
                        "description": "科技的魅力让人震撼，未来的可能性在这里无限延伸，激发着对未知世界的探索欲望。",
                        "date": "2023-07-08",
                        "type": "科学技术",
                        "image": "src/museum2.jpg",
                        "content": "科技馆里的每一个展项都让人惊叹不已。从宇宙探索到生命科学，从人工智能到量子物理，科技的发展速度让人目不暇接。这里不仅是知识的海洋，更是梦想的摇篮。"
                    }
                ],
                "travels": [
                    {
                        "id": 1,
                        "title": "樱花季·京都",
                        "description": "粉色花瓣飘洒的季节，古都的美丽与宁静让心灵得到净化，是一次心灵的洗礼。",
                        "date": "2023年4月",
                        "location": "日本",
                        "image": "src/japan.jpg",
                        "content": "京都的樱花季是世界上最美的景色之一。清水寺前的樱花盛开，粉色的花瓣如雪花般飘落。走在哲学之道上，两旁的樱花树形成了粉色的隧道，让人仿佛置身于梦境之中。"
                    },
                    {
                        "id": 2,
                        "title": "薰衣草·普罗旺斯",
                        "description": "紫色的浪漫延伸到天际，法式的优雅与自然的纯美完美融合，诠释着什么是生活的艺术。",
                        "date": "2023年6月",
                        "location": "法国",
                        "image": "src/lavender.jpg",
                        "content": "普罗旺斯的薰衣草田一望无际，紫色的海洋在微风中轻轻摇曳。空气中弥漫着淡淡的花香，让人心旷神怡。这里的每一寸土地都散发着浪漫的气息，让人不由得慢下脚步，享受这份宁静与美好。"
                    },
                    {
                        "id": 3,
                        "title": "沙漠星空·撒哈拉",
                        "description": "无尽的沙丘与璀璨的星空，感受大自然的壮阔与神秘，是一次与自己内心的对话。",
                        "date": "2023年9月",
                        "location": "摩洛哥",
                        "image": "src/sahara.jpg",
                        "content": "撒哈拉沙漠的夜晚，星空璀璨得让人屏息。没有城市的光污染，银河清晰可见，仿佛触手可及。坐在沙丘上仰望星空，感受着宇宙的浩瀚和自己的渺小，这种体验让人终生难忘。"
                    }
                ],
                "articles": [
                    {
                        "id": 1,
                        "title": "春天的樱花",
                        "date": "2024-03-15",
                        "excerpt": "春天来了，樱花盛开，粉色的花瓣如雪花般飘落，诉说着生命的美好与短暂。",
                        "content": "春天的脚步悄然而至，樱花如约绽放。粉色的花瓣在微风中飘洒，如同天使的羽毛轻抚大地。每一朵樱花都是自然的杰作，短暂而美丽，提醒着我们珍惜当下的每一个瞬间。站在樱花树下，看着花瓣缓缓飘落，心中涌起一种莫名的感动。或许这就是日本人所说的'物哀'吧，一种对美好事物即将逝去的淡淡哀愁，却又因为它的美丽而感到无比珍贵。",
                        "image": "src/japan.jpg",
                        "tags": ["春天", "樱花", "自然", "感悟"]
                    },
                    {
                        "id": 2,
                        "title": "夏日回忆",
                        "date": "2024-07-20",
                        "excerpt": "夏天的午后，蝉鸣声声，那些关于童年的美好回忆如潮水般涌来。",
                        "content": "夏天总是充满了回忆的味道。午后的阳光透过树叶的缝隙洒在地上，形成斑驳的光影。蝉鸣声此起彼伏，仿佛在讲述着夏天的故事。小时候最喜欢的就是这样的午后，和小伙伴们在院子里追逐嬉戏，或者静静地坐在树荫下听奶奶讲那些古老的传说。",
                        "image": "src/lavender.jpg",
                        "tags": ["夏天", "童年", "回忆", "蝉鸣"]
                    },
                    {
                        "id": 3,
                        "title": "技术与生活",
                        "date": "2024-11-15",
                        "excerpt": "在代码的世界里寻找生活的意义，技术不仅改变了世界，也改变了我们看世界的方式。",
                        "content": "技术的发展日新月异，作为一名程序员，我深深感受到了这个时代的脉搏。每一行代码都可能改变世界，每一个算法都可能解决现实中的问题。但技术的本质还是为了让生活更美好，让人与人之间的连接更加紧密。在追求技术极致的同时，我们也不能忘记技术背后的人文关怀。",
                        "image": "src/museum2.jpg",
                        "tags": ["技术", "编程", "生活", "思考"]
                    }
                ]
            }
        }
        
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(initial_data, f, ensure_ascii=False, indent=2)

def read_data():
    """Read data from file"""
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"[ERROR] Failed to read data: {e}")
        return None

def write_data(data):
    """Write data to file"""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"[ERROR] Failed to write data: {e}")
        return False

# Static file routes
@app.route('/')
def index():
    """Homepage"""
    return send_file('main.html')

@app.route('/admin')
def admin():
    """Admin panel"""
    return send_file('admin/index.html')

@app.route('/pages/<path:filename>')
def pages(filename):
    """Secondary pages"""
    return send_from_directory('pages', filename)

@app.route('/src/<path:filename>')
def src_files(filename):
    """Resource files"""
    return send_from_directory('src', filename)

@app.route('/admin/<path:filename>')
def admin_files(filename):
    """Admin files"""
    return send_from_directory('admin', filename)

@app.route('/<path:filename>')
def static_files(filename):
    """Root directory static files"""
    if os.path.exists(filename):
        return send_file(filename)
    return "File not found", 404

# API routes
@app.route('/api/data', methods=['GET'])
def get_all_data():
    """Get all data"""
    data = read_data()
    if data:
        return jsonify(data)
    else:
        return jsonify({"error": "Failed to read data"}), 500

@app.route('/api/content', methods=['GET'])
def get_content():
    """Get website content for frontend display"""
    data = read_data()
    if data:
        return jsonify(data)
    else:
        return jsonify({"error": "Failed to read data"}), 500

@app.route('/api/data/<section>', methods=['GET'])
def get_section_data(section):
    """Get section data"""
    data = read_data()
    if data and 'sections' in data and section in data['sections']:
        return jsonify(data['sections'][section])
    else:
        return jsonify({"error": "Data not found"}), 404

@app.route('/api/data/<section>/<int:item_id>', methods=['GET'])
def get_item_data(section, item_id):
    """Get single item data"""
    data = read_data()
    if data and 'sections' in data and section in data['sections']:
        items = data['sections'][section]
        item = next((item for item in items if item['id'] == item_id), None)
        if item:
            return jsonify(item)
        else:
            return jsonify({"error": "Content not found"}), 404
    else:
        return jsonify({"error": "Data not found"}), 404

@app.route('/api/user', methods=['PUT'])
def update_user():
    """Update user information"""
    data = read_data()
    if data:
        user_data = request.get_json()
        data['user'].update(user_data)
        if write_data(data):
            return jsonify({"message": "User info updated successfully", "user": data['user']})
        else:
            return jsonify({"error": "Update failed"}), 500
    else:
        return jsonify({"error": "Failed to read data"}), 500

@app.route('/api/data/<section>', methods=['POST'])
def add_item(section):
    """Add new content"""
    data = read_data()
    if data:
        if 'sections' not in data:
            data['sections'] = {}
        if section not in data['sections']:
            data['sections'][section] = []
        
        item_data = request.get_json()
        
        # Auto-set date based on section type if not provided
        if 'date' not in item_data or not item_data['date']:
            today = datetime.now()
            if section in ['articles', 'museums']:
                # Format: YYYY-MM-DD
                item_data['date'] = today.strftime('%Y-%m-%d')
            elif section == 'travels':
                # Format: YYYY年MM月
                item_data['date'] = today.strftime('%Y年%m月')
            else:
                # Default format for other sections
                item_data['date'] = today.strftime('%Y-%m-%d')
        
        new_item = {
            "id": int(datetime.now().timestamp() * 1000),  # Use timestamp as ID
            **item_data,
            "createdAt": datetime.now().isoformat()
        }
        
        data['sections'][section].append(new_item)
        
        if write_data(data):
            return jsonify({"message": "Content added successfully", "item": new_item})
        else:
            return jsonify({"error": "Add failed"}), 500
    else:
        return jsonify({"error": "Failed to read data"}), 500

@app.route('/api/data/<section>/<int:item_id>', methods=['PUT'])
def update_item(section, item_id):
    """Update content"""
    data = read_data()
    if data and 'sections' in data and section in data['sections']:
        items = data['sections'][section]
        for i, item in enumerate(items):
            if item['id'] == item_id:
                update_data = request.get_json()
                items[i].update(update_data)
                
                if write_data(data):
                    return jsonify({"message": "Content updated successfully", "item": items[i]})
                else:
                    return jsonify({"error": "Update failed"}), 500
        
        return jsonify({"error": "Content not found"}), 404
    else:
        return jsonify({"error": "Data not found"}), 404

@app.route('/api/data/<section>/<int:item_id>', methods=['DELETE'])
def delete_item(section, item_id):
    """Delete content"""
    data = read_data()
    if data and 'sections' in data and section in data['sections']:
        items = data['sections'][section]
        for i, item in enumerate(items):
            if item['id'] == item_id:
                deleted_item = items.pop(i)
                
                if write_data(data):
                    return jsonify({"message": "Content deleted successfully", "item": deleted_item})
                else:
                    return jsonify({"error": "Delete failed"}), 500
        
        return jsonify({"error": "Content not found"}), 404
    else:
        return jsonify({"error": "Data not found"}), 404

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """File upload"""
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add timestamp to avoid filename conflicts
        timestamp = str(int(datetime.now().timestamp()))
        name, ext = os.path.splitext(filename)
        filename = f"{timestamp}-{filename}"
        
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Get file size and type
        file_size = os.path.getsize(filepath)
        file_type = get_file_type(filename)
        
        file_url = f"/src/uploads/{filename}"
        return jsonify({
            "message": "File uploaded successfully",
            "url": file_url,
            "filename": filename,
            "originalName": file.filename,
            "size": file_size,
            "type": file_type,
            "uploadTime": datetime.now().isoformat()
        })
    else:
        return jsonify({"error": "Unsupported file type"}), 400

# Media management APIs
@app.route('/api/media', methods=['GET'])
def get_media_files():
    """Get all media files from uploads directory"""
    try:
        media_files = []
        
        # Get all files from uploads directory
        if os.path.exists(UPLOAD_FOLDER):
            for filename in os.listdir(UPLOAD_FOLDER):
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                if os.path.isfile(filepath) and allowed_file(filename):
                    file_stat = os.stat(filepath)
                    
                    # Determine if it's an originally existing file or newly uploaded
                    existing_files = [
                        "1 (1).jpg", "1 (2).jpg", "1 (3).jpg", "1 (4).jpg", "1 (5).jpg", "1 (6).jpg",
                        "forbidden_city.jpg", "japan.jpg", "lavender.jpg", "museum1.jpg", "museum2.jpg", "sahara.jpg", "bgm.mp3"
                    ]
                    
                    is_existing = filename in existing_files
                    original_name = filename.split('-', 1)[1] if '-' in filename and not is_existing else filename
                    
                    file_info = {
                        "filename": filename,
                        "url": f"/src/uploads/{filename}",
                        "size": file_stat.st_size,
                        "type": get_file_type(filename),
                        "uploadTime": datetime.fromtimestamp(file_stat.st_mtime).isoformat(),
                        "originalName": original_name,
                        "isExisting": is_existing
                    }
                    media_files.append(file_info)
        
        # Sort by upload time (newest first)
        media_files.sort(key=lambda x: x['uploadTime'], reverse=True)
        return jsonify(media_files)
        
    except Exception as e:
        print(f"[ERROR] Failed to get media files: {e}")
        return jsonify({"error": "Failed to get media files"}), 500

@app.route('/api/media/<filename>', methods=['DELETE'])
def delete_media_file(filename):
    """Delete a media file"""
    try:
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            # Check if it's an originally existing file
            existing_files = [
                "1 (1).jpg", "1 (2).jpg", "1 (3).jpg", "1 (4).jpg", "1 (5).jpg", "1 (6).jpg",
                "forbidden_city.jpg", "japan.jpg", "lavender.jpg", "museum1.jpg", "museum2.jpg", "sahara.jpg", "bgm.mp3"
            ]
            
            if filename in existing_files:
                return jsonify({"error": "Cannot delete original system files"}), 403
            else:
                # Allow deletion of user uploaded files
                os.remove(filepath)
                return jsonify({"message": "File deleted successfully"})
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        print(f"[ERROR] Failed to delete file: {e}")
        return jsonify({"error": "Failed to delete file"}), 500

# Settings management APIs
@app.route('/api/settings', methods=['GET'])
def get_settings():
    """Get all settings"""
    data = read_data()
    if data and 'settings' in data:
        return jsonify(data['settings'])
    else:
        return jsonify({})

@app.route('/api/settings', methods=['POST'])
def update_settings():
    """Update settings (general endpoint for all settings)"""
    data = read_data()
    if data:
        if 'settings' not in data:
            data['settings'] = {}
        
        settings_data = request.get_json()
        
        # Update all provided settings
        for key, value in settings_data.items():
            if key not in data['settings']:
                data['settings'][key] = {}
            data['settings'][key].update(value)
        
        if write_data(data):
            return jsonify({"message": "Settings updated successfully"})
        else:
            return jsonify({"error": "Update failed"}), 500
    else:
        return jsonify({"error": "Failed to read data"}), 500

@app.route('/api/settings/basic', methods=['PUT'])
def update_basic_settings():
    """Update basic settings"""
    data = read_data()
    if data:
        if 'settings' not in data:
            data['settings'] = {}
        if 'basic' not in data['settings']:
            data['settings']['basic'] = {}
        
        basic_data = request.get_json()
        data['settings']['basic'].update(basic_data)
        
        if write_data(data):
            return jsonify({"message": "Basic settings updated successfully"})
        else:
            return jsonify({"error": "Update failed"}), 500
    else:
        return jsonify({"error": "Failed to read data"}), 500

@app.route('/api/settings/sections', methods=['PUT'])
def update_sections_settings():
    """Update sections settings"""
    data = read_data()
    if data:
        if 'settings' not in data:
            data['settings'] = {}
        if 'sections' not in data['settings']:
            data['settings']['sections'] = {}
        
        sections_data = request.get_json()
        data['settings']['sections'].update(sections_data)
        
        if write_data(data):
            return jsonify({"message": "Sections settings updated successfully"})
        else:
            return jsonify({"error": "Update failed"}), 500
    else:
        return jsonify({"error": "Failed to read data"}), 500

@app.route('/api/settings/appearance', methods=['PUT'])
def update_appearance_settings():
    """Update appearance settings"""
    data = read_data()
    if data:
        if 'settings' not in data:
            data['settings'] = {}
        if 'appearance' not in data['settings']:
            data['settings']['appearance'] = {}
        
        appearance_data = request.get_json()
        data['settings']['appearance'].update(appearance_data)
        
        if write_data(data):
            return jsonify({"message": "Appearance settings updated successfully"})
        else:
            return jsonify({"error": "Update failed"}), 500
    else:
        return jsonify({"error": "Failed to read data"}), 500

@app.route('/api/settings/media', methods=['PUT'])
def update_media_settings():
    """Update media settings"""
    data = read_data()
    if data:
        if 'settings' not in data:
            data['settings'] = {}
        if 'media' not in data['settings']:
            data['settings']['media'] = {}
        
        media_data = request.get_json()
        data['settings']['media'].update(media_data)
        
        if write_data(data):
            return jsonify({"message": "Media settings updated successfully"})
        else:
            return jsonify({"error": "Update failed"}), 500
    else:
        return jsonify({"error": "Failed to read data"}), 500

@app.route('/api/settings/music', methods=['PUT'])
def update_music_settings():
    """Update background music settings"""
    data = read_data()
    if data:
        if 'settings' not in data:
            data['settings'] = {}
        if 'music' not in data['settings']:
            data['settings']['music'] = {}
        
        music_data = request.get_json()
        data['settings']['music'].update(music_data)
        
        if write_data(data):
            return jsonify({"message": "Music settings updated successfully"})
        else:
            return jsonify({"error": "Update failed"}), 500
    else:
        return jsonify({"error": "Failed to read data"}), 500

@app.route('/api/settings/theme', methods=['PUT'])
def update_theme_settings():
    """Update theme settings"""
    data = read_data()
    if data:
        if 'settings' not in data:
            data['settings'] = {}
        if 'appearance' not in data['settings']:
            data['settings']['appearance'] = {}
        
        theme_data = request.get_json()
        theme_name = theme_data.get('themeName')
        
        if not theme_name:
            return jsonify({"error": "Theme name is required"}), 400
        
        # Get available themes from configuration
        available_themes = data['settings']['appearance'].get('availableThemes', [])
        selected_theme = None
        
        for theme in available_themes:
            if theme['name'] == theme_name:
                selected_theme = theme
                break
        
        if not selected_theme:
            return jsonify({"error": "Theme not found"}), 404
        
        # Update current theme
        data['settings']['appearance']['theme'] = selected_theme
        
        if write_data(data):
            return jsonify({"message": f"Theme '{theme_name}' applied successfully"})
        else:
            return jsonify({"error": "Update failed"}), 500
    else:
        return jsonify({"error": "Failed to read data"}), 500

# Tags management APIs
@app.route('/api/tags', methods=['GET'])
def get_tags():
    """Get all tags"""
    data = read_data()
    if data and 'tags' in data:
        return jsonify(data['tags'])
    else:
        return jsonify([])

@app.route('/api/tags', methods=['POST'])
def add_tag():
    """Add new tag"""
    data = read_data()
    if data:
        if 'tags' not in data:
            data['tags'] = []
        
        tag_data = request.get_json()
        new_tag = tag_data.get('name', '').strip()
        
        if not new_tag:
            return jsonify({"error": "Tag name is required"}), 400
        
        if new_tag in data['tags']:
            return jsonify({"error": "Tag already exists"}), 400
        
        data['tags'].append(new_tag)
        
        if write_data(data):
            return jsonify({"message": "Tag added successfully", "tag": new_tag})
        else:
            return jsonify({"error": "Add failed"}), 500
    else:
        return jsonify({"error": "Failed to read data"}), 500

@app.route('/api/tags/<tag_name>', methods=['DELETE'])
def delete_tag(tag_name):
    """Delete tag"""
    data = read_data()
    if data and 'tags' in data:
        if tag_name in data['tags']:
            data['tags'].remove(tag_name)
            
            # Also remove tag from all content items
            for section in data.get('sections', {}).values():
                for item in section:
                    if 'tags' in item and tag_name in item['tags']:
                        item['tags'].remove(tag_name)
            
            if write_data(data):
                return jsonify({"message": "Tag deleted successfully"})
            else:
                return jsonify({"error": "Delete failed"}), 500
        else:
            return jsonify({"error": "Tag not found"}), 404
    else:
        return jsonify({"error": "Data not found"}), 404

@app.route('/api/tags/<old_tag>/<new_tag>', methods=['PUT'])
def update_tag(old_tag, new_tag):
    """Update tag name"""
    data = read_data()
    if data and 'tags' in data:
        if old_tag in data['tags']:
            # Check if new tag already exists
            if new_tag in data['tags']:
                return jsonify({"error": "New tag name already exists"}), 400
            
            # Update tag in tags list
            tag_index = data['tags'].index(old_tag)
            data['tags'][tag_index] = new_tag
            
            # Update tag in all content items
            for section in data.get('sections', {}).values():
                for item in section:
                    if 'tags' in item and old_tag in item['tags']:
                        tag_item_index = item['tags'].index(old_tag)
                        item['tags'][tag_item_index] = new_tag
            
            if write_data(data):
                return jsonify({"message": "Tag updated successfully"})
            else:
                return jsonify({"error": "Update failed"}), 500
        else:
            return jsonify({"error": "Tag not found"}), 404
    else:
        return jsonify({"error": "Data not found"}), 404

def print_startup_info():
    """Print startup information"""
    local_ip = get_local_ip()
    system = platform.system()
    
    print("\n" + "="*60)
    print("           Personal Website Server Started")
    print("="*60)
    print(f"Server running on port: {PORT}")
    print(f"Local access: http://localhost:{PORT}")
    print(f"Network access: http://{local_ip}:{PORT}")
    print(f"Homepage: http://{local_ip}:{PORT}")
    print(f"Admin panel: http://{local_ip}:{PORT}/admin")
    print(f"Admin account: admin / 123456")
    print("="*60 + "\n")
    
    if system == "Windows":
        print("Windows Users Tips:")
        print("  - If network access fails, check Windows Firewall")
        print("  - Allow Python through the firewall")
        print("  - Make sure router allows device communication\n")

if __name__ == '__main__':
    # Initialize data
    init_data()
    
    # Print startup info
    print("[INFO] Starting Python server...")
    
    # Start server
    try:
        print_startup_info()
        app.run(host='0.0.0.0', port=PORT, debug=False)
    except KeyboardInterrupt:
        print("\n[INFO] Server stopped")
    except Exception as e:
        print(f"\n[ERROR] Startup failed: {e}")
        print("Please check if port is occupied or try another port") 