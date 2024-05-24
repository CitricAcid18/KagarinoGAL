// 引入所需的模块
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// 创建 Express 应用
const app = express();

// 使用 body-parser 中间件解析请求体中的表单数据
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 连接到 MongoDB 数据库
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB 连接成功')) // 连接成功后打印消息
    .catch(err => console.error('MongoDB 连接错误', err)); // 连接失败时打印错误信息

// 定义用户模型
const User = mongoose.model('User', {
    username: String,
    email: String,
    password: String
});

// 处理注册请求
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body; // 从请求体中获取用户名、邮箱和密码

    try {
        // 创建新用户
        const newUser = new User({ username, email, password });
        // 将用户保存到数据库中
        await newUser.save();
        // 返回注册成功消息
        res.status(200).send('注册成功');
    } catch (error) {
        console.error('注册失败', error); // 打印注册失败的错误信息
        res.status(500).send('注册失败'); // 返回注册失败消息和状态码500
    }
});

const port = process.env.PORT || 5500; // 设置端口号为环境变量中的端口号，如果不存在则使用默认端口号 5500
app.listen(port, () => {
    console.log(`Server is running on port ${port}`); // 在服务器启动时打印端口信息
});

// 处理检查用户名是否存在的请求
app.get('/checkUsername', async (req, res) => {
    const { username } = req.query; // 从查询参数中获取用户名

    try {
        // 在数据库中查找是否存在相同的用户名
        const existingUser = await User.findOne({ username });
        // 如果存在相同的用户名，返回响应"exists"，否则返回"available"
        if (existingUser) {
            res.status(200).send('exists');
        } else {
            res.status(200).send('available');
        }
    } catch (error) {
        console.error('检查用户名失败', error); // 打印错误信息
        res.status(500).send('检查用户名失败'); // 返回500状态码和失败消息
    }
});

// 处理检查邮箱是否存在的请求
app.get('/checkEmail', async (req, res) => {
    const { email } = req.query; // 从查询参数中获取邮箱

    try {
        // 在数据库中查找是否存在相同的邮箱
        const existingUser = await User.findOne({ email });
        // 如果存在相同的邮箱，返回响应"exists"，否则返回"available"
        if (existingUser) {
            res.status(200).send('exists');
        } else {
            res.status(200).send('available');
        }
    } catch (error) {
        console.error('检查邮箱失败', error); // 打印错误信息
        res.status(500).send('检查邮箱失败'); // 返回500状态码和失败消息
    }
});

