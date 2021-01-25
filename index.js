const LOCAL_DATA = "LOCAL_DATA";

let global_index = 1;
let data = {};

function getLocalData() {
  data = JSON.parse(localStorage.getItem(LOCAL_DATA)) || data;
  Object.keys(data).forEach(
    (element) => (global_index = Math.max(global_index, Number(element) + 1))
  );
}

// UI components
function getRenderBox(info) {
  return `
  <div class="py-2 col-md-4 px-3">
    <div class="outer border rounded bg-white text-center">
      <h6 class="text-white bg-info border-bottom py-2">${info.name}</h6>
      <div class="form-group px-4 py-2 mb-0">
        <input placeholder="Enter Key" name="key${info.id}" type="password" class="form-control  form-control-sm" />
      </div>
      <div class="text-center row w-100 mx-0 my-0 mt-2 px-4">
          <div class="col px-1"><button class="btn btn-outline-primary btn-sm btn-block" onclick="show('${info.id}')">Show</button></div>
          <div class="col px-1"><button class="btn btn-outline-secondary btn-sm btn-block" onclick="clean('${info.id}')">Close</button></div>
          <div class="col px-1"><button class="btn btn-outline-danger btn-sm btn-block" onclick="deleteData('${info.id}')">Delete</button></div>
        </div>
      <hr />
      <div class="data" id="${info.id}">
      </div>
     
    </div>
  </div>`;
}

function getDataBox(info) {
  return `
   <div class='px-2'>  
  <b> User: </b> ${info.username}
      <br />
      <b> Password :</b> ${info.password}
      <br />
      <b> Password 2 : </b> ${info.password2}
      <br />
      <b> Others :</b> ${info.others}
      </div>
      <hr />`;
}

// UI updators
function renderData() {
  const main_box = document.getElementById("main-box");
  let html = "";
  let keys = Object.keys(data);
  keys.sort();
  keys.forEach((key) => {
    const info = data[key];
    html += getRenderBox(info);
  });
  main_box.innerHTML = html;
}

function show(index) {
  const key = document.getElementsByName(`key${index}`)[0].value;
  document.getElementsByName(`key${index}`)[0].value = "";
  let info = { ...data[index] };
  Object.keys(info).forEach((item) => {
    if (item != "id" && item != "name") info[item] = decrypt(info[item], key);
  });
  document.getElementById(index).innerHTML = getDataBox(info);
}

function clean(index) {
  document.getElementById(index).innerHTML = "";
}

// Other functions
function deleteData(index) {
  if (confirm("Are sure to delete?")) {
    delete data[index];
    localStorage.setItem(LOCAL_DATA, JSON.stringify(data));
    renderData();
  }
}

function deleteAll() {
  if (confirm("Are sure to delete all?")) {
    data = {};
    localStorage.removeItem(LOCAL_DATA);
    renderData();
  }
}

function decrypt(info, key) {
  let decrypted = "";
  info = window.atob(info);
  let extra = 0;
  for (let i = 0; i < key.length; i++) extra += key.charCodeAt(i);
  extra = extra % 256;
  for (let i = 0; i < info.length; i++) {
    decrypted += String.fromCharCode(
      (((info.charCodeAt(i) - key.charCodeAt(i % key.legth) + 256) % 256) - extra + 256) % 256
    );
  }
  return decrypted;
}

function encrypt(info, key) {
  let encrypted = "";
  let extra = 0;
  for (let i = 0; i < key.length; i++) extra += key.charCodeAt(i);
  extra = extra % 256;
  for (let i = 0; i < info.length; i++) {
    encrypted += String.fromCharCode(
      (((info.charCodeAt(i) + key.charCodeAt(i % key.legth)) % 256) + extra) % 256
    );
  }
  return window.btoa(encrypted);
}

function addNewPassword() {
  const key = document.getElementsByName("key")[0].value;
  document.getElementsByName("key")[0].value = "";
  const name = document.getElementsByName("name")[0].value;
  document.getElementsByName("name")[0].value = "";
  let username = document.getElementsByName("username")[0].value;
  document.getElementsByName("username")[0].value = "";
  let password = document.getElementsByName("password")[0].value;
  document.getElementsByName("password")[0].value = "";
  let password2 = document.getElementsByName("password2")[0].value;
  document.getElementsByName("password2")[0].value = "";
  let others = document.getElementsByName("others")[0].value;
  document.getElementsByName("others")[0].value = "";

  if (key && name) {
    username = encrypt(username, key);
    password = encrypt(password, key);
    password2 = encrypt(password2, key);
    others = encrypt(others, key);

    const newObj = {
      id: global_index,
      name,
      username,
      password,
      password2,
      others,
    };

    data[global_index] = newObj;
    global_index += 1;
    localStorage.setItem(LOCAL_DATA, JSON.stringify(data));
    renderData(data);
  }
}

function initial() {
  getLocalData();
  renderData();
}

initial();
