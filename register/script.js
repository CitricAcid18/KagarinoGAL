function validateForm() {
    // 获取表单中的用户名、邮箱和密码
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    // 检查用户名是否为空
    if (username.trim() == "") {
        alert("请输入用户名");
        return false;
    }

    // 检查邮箱格式是否正确
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("请输入有效的邮箱地址");
        return false;
    }

    // 检查密码长度是否符合要求
    if (password.length < 6) {
        alert("密码长度至少为6位");
        return false;
    }
    var xhrUsername = new XMLHttpRequest();
    xhrUsername.open("GET", "/checkUsername?username=" + username, true); // 发送GET请求，检查用户名是否已存在
    xhrUsername.onreadystatechange = function () {
        if (xhrUsername.readyState == 4 && xhrUsername.status == 200) { // 检查请求状态和响应状态码
            var response = xhrUsername.responseText; // 获取响应数据
            if (response === "exists") { // 如果响应为 "exists"，表示用户名已被注册
                alert("该用户名已被注册，请使用其他用户名");
                return false; // 返回false，阻止表单提交
            } else { // 如果用户名未被注册
                // 发送检查邮箱请求
                var xhrEmail = new XMLHttpRequest();
                xhrEmail.open("GET", "/checkEmail?email=" + email, true); // 发送GET请求，检查邮箱是否已存在
                xhrEmail.onreadystatechange = function () {
                    if (xhrEmail.readyState == 4 && xhrEmail.status == 200) { // 检查请求状态和响应状态码
                        var response = xhrEmail.responseText; // 获取响应数据
                        if (response === "exists") { // 如果响应为 "exists"，表示邮箱已被注册
                            alert("该邮箱已被注册，请使用其他邮箱");
                            return false; // 返回false，阻止表单提交
                        } else { // 如果邮箱未被注册
                            // 注册成功，显示成功消息
                            document.getElementById("success-message").style.display = "block";
                            return true; // 返回true，允许表单提交
                        }
                    }
                };
                xhrEmail.send(); // 发送邮箱检查请求
            }
        }
    };
    xhrUsername.send(); // 发送用户名检查请求
    // 防止表单直接提交
    return false;
}
