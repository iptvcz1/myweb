// 初始化数据
let items = JSON.parse(localStorage.getItem('items')) || [];
let logo = localStorage.getItem('logo') || '';
let admins = JSON.parse(localStorage.getItem('admins')) || [
  { username: 'admin', password: '123456' }
];

// 渲染表格
function renderTable() {
  const table = document.getElementById('itemTable');
  table.innerHTML = `
    <tr>
      <th>颜色代码</th>
      <th>色块</th>
      <th>物品名称</th>
      <th>分类</th>
      <th>描述</th>
      <th>图片</th>
    </tr>
  `;
  items.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.color}</td>
      <td><div class="color-block" style="background-color: ${item.color};"></div></td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.description}</td>
      <td><img src="${item.image}" class="item-image" alt="${item.name}"></td>
    `;
    table.appendChild(row);
  });
}

// 渲染管理员表格（带删除按钮）
function renderAdminTable() {
  const table = document.getElementById('itemTable');
  table.innerHTML = `
    <tr>
      <th>颜色代码</th>
      <th>色块</th>
      <th>物品名称</th>
      <th>分类</th>
      <th>描述</th>
      <th>图片</th>
      <th>操作</th>
    </tr>
  `;
  items.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.color}</td>
      <td><div class="color-block" style="background-color: ${item.color};"></div></td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.description}</td>
      <td><img src="${item.image}" class="item-image" alt="${item.name}"></td>
      <td>
        <button onclick="handleDelete(${index})">删除</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// 处理删除
function handleDelete(index) {
  if (index >= 0 && index < items.length) {
    items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(items));
    renderAdminTable(); // 重新渲染管理员表格
    alert('物品已删除！');
  }
}

// 上传并设置Logo
function uploadLogo() {
  const fileInput = document.getElementById('logoUpload');
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      logo = e.target.result;
      localStorage.setItem('logo', logo);
      document.getElementById('siteLogo').src = logo;
      alert('Logo上传成功！');
    };
    reader.readAsDataURL(file);
  } else {
    alert('请选择一个Logo文件！');
  }
}

// 管理员登录功能
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const admin = admins.find(a => a.username === username && a.password === password);
  if (admin) {
    alert('登录成功！');
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('adminPanel').classList.add('active');
    renderAdminTable(); // 渲染管理员表格
  } else {
    alert('用户名或密码错误！');
  }
}

// 切换登录面板显示/隐藏
function toggleLogin() {
  const loginPanel = document.getElementById('loginPanel');
  loginPanel.style.display = loginPanel.style.display === 'block' ? 'none' : 'block';
}

// 初始化渲染
renderTable();
if (logo) {
  document.getElementById('siteLogo').src = logo;
}

// 添加新物品
function addItem() {
  const category = document.getElementById('newItemCategory').value;
  const color = document.getElementById('newItemColor').value;
  const name = document.getElementById('newItemName').value;
  const description = document.getElementById('newItemDescription').value;
  const imageFile = document.getElementById('newItemImage').files[0];
  if (category && color && name && description && imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const newItem = {
        category,
        color,
        name,
        description,
        image: e.target.result
      };
      items.push(newItem);
      localStorage.setItem('items', JSON.stringify(items));
      renderAdminTable(); // 重新渲染管理员表格
      alert('添加成功！');
    };
    reader.readAsDataURL(imageFile);
  } else {
    alert('请填写完整信息并上传图片！');
  }
}

// 修改物品信息
function editItem() {
  const itemId = document.getElementById('editItemId').value;
  const newColorCode = document.getElementById('editColorCode').value;
  const newItemName = document.getElementById('editItemName').value;
  if (itemId && newColorCode && newItemName) {
    const index = parseInt(itemId) - 1;
    if (items[index]) {
      items[index].color = newColorCode;
      items[index].name = newItemName;
      localStorage.setItem('items', JSON.stringify(items));
      renderAdminTable(); // 重新渲染管理员表格
      alert('修改成功！');
    } else {
      alert('未找到对应物品！');
    }
  } else {
    alert('请填写完整信息！');
  }
}

// 导入数据
function importData() {
  const fileInput = document.getElementById('xlsFile');
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      jsonData.forEach((item) => {
        items.push(item);
      });
      localStorage.setItem('items', JSON.stringify(items));
      renderAdminTable(); // 重新渲染管理员表格
      alert('数据导入成功！');
    };
    reader.readAsBinaryString(file);
  } else {
    alert('请选择一个Excel文件！');
  }
}

// 返回主页
function goBackToHome() {
  window.location.href = 'index.html';
}