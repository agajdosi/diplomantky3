import * as params from '@params';

const EDIT_BIO = 'bio';
const EDIT_ARTWORK = 'diploma';

const EDIT_TEXT = 'edit';
const PREVIEW_TEXT = 'preview';
const SAVE_TEXT = 'save';

window.addEventListener('load', editorPageLoaded);

function editorPageLoaded() {
  let loggedAs = getLoggedAsCookie();
  let userRole = getUserRoleCookie();
  console.log(`logged as: ${loggedAs} with role ${userRole}`);
  if (!loggedAs) return;
  let pageOwner = document.querySelector("meta[name='owner']").getAttribute('content');
  if (!pageOwner) return;
  if (loggedAs != pageOwner && userRole != "admin") return;
  addEditButton();
  initTinyMCE(EDIT_ARTWORK);
  initTinyMCE(EDIT_BIO);
}

function editButtonClicked(event){
  let currentText = event.target.innerText;
  if (currentText === EDIT_TEXT) {
    enterEditorMode(event, EDIT_BIO);
    enterEditorMode(event, EDIT_ARTWORK);
    return;
  }
  if (currentText === PREVIEW_TEXT) {
    enterPreviewMode(event, EDIT_BIO);
    enterPreviewMode(event, EDIT_ARTWORK);
    return;
  }
}

function get_jwt() {
  let jwt = document.cookie.split('; ').find(row => row.startsWith('jwt=')).split('=')[1];
  return jwt;
}

function save() {
  let jwt = get_jwt();
  let content_bio = tinymce.get(EDIT_BIO+'_editor').getContent();
  let content_diploma = tinymce.get(EDIT_ARTWORK+'_editor').getContent();
  let sourceFile = document.querySelector("meta[name='sourceFile']").getAttribute('content');
  let sourceDir = document.querySelector("meta[name='sourceDir']").getAttribute('content');
  let sourceFilePath = document.querySelector("meta[name='sourceFilePath']").getAttribute('content');
  let data = {
      "token": jwt,
      "content_bio": content_bio,
      "content_diploma": content_diploma,
      "sourceFile": sourceFile,
      "sourceDir": sourceDir,
      "sourceFilePath": sourceFilePath,
  };
  fetch(params.FUNCS_URL + '/core/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',},
      body: JSON.stringify(data),
  })
  .then((response) => response.json())
  .then((data) => { 
      console.log(data)
  });
}

function getLoggedAsCookie() {
  return getCookieValue('loggedAs');
}

function getUserRoleCookie() {
  return getCookieValue('userRole');
}

function getCookieValue(cookieName) {
  let cookie = document.cookie;
  let cookies = cookie.split('; ');
  let row = cookies.find(row => row.startsWith(`${cookieName}=`));
  if (!row) return;

  let value = row.split('=');
  if (value.length < 2) return;
  
  return value[1];
}

function addEditButton() {
  let editButton = document.createElement('button');
  editButton.setAttribute('id', 'edit_button');  
  editButton.addEventListener("click", editButtonClicked);
  editButton.innerText = EDIT_TEXT;
  let headerMenu = document.getElementById('headerright');
  headerMenu.prepend(editButton);
}

function addSaveButton() {
  let saveButton = document.getElementById('save_button');
  if (saveButton!==null) return;
  let headerMenu = document.getElementById('headerright');
  saveButton = document.createElement('button');
  saveButton.setAttribute('id', 'save_button');
  saveButton.onclick = save;
  saveButton.innerText = SAVE_TEXT;
  headerMenu.prepend(saveButton);
}

function initTinyMCE(target_id) {
  let mainContainer = document.getElementById(target_id).parentNode;
  editor = document.createElement('textarea');
  let editor_id = target_id + '_editor';
  editor.setAttribute('id', editor_id);
  mainContainer.prepend(editor);
  editor.innerHTML = document.getElementById(target_id).innerHTML;
  editor.style.display = 'none';
  tinymce.init({
    selector: '#'+editor_id,
    height: '85vh',
    style_formats : [
      { title : 'Normal text', block: 'p'},
      { title : 'Title Big', block: 'h1'},
      { title : 'Title Mid', block: 'h2'},
      { title : 'Title Small', block: 'h3'},
    ],
    menubar: false,
    promotion: false,
    plugins: ['save', 'autolink', 'wordcount', 'code', 'image', 'link'],
    statusbar: true,
    toolbar: [
      {name: 'elements', items: ['styles', 'h1', 'h2', 'h3', 'link', 'image']},
      {name: 'formatting', items: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript']},
      {name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify']},
      {name: 'indentation', items: ['outdent', 'indent']},
      {name: 'nerd', items: ['fontselect', 'code']},
      {name: 'history', items: ['undo', 'redo', 'cancel']},
    ],
    content_css: "/main.css",

    // IMAGE UPLOAD
    images_upload_handler: image_upload_handler,
    images_file_types: 'jpg,jpeg,avif,webp',
  });
}

const image_upload_handler = (blobInfo, progress) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = function() {
    const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
    const filename = blobInfo.filename();
    const source_dir = document.querySelector("meta[name='sourceDir']").getAttribute('content');
    const jwt = get_jwt();
    const data = {
      "blob": base64String,
      "filename": filename,
      "source_dir": source_dir,
      "token": jwt,
    };
    
    fetch(params.FUNCS_URL + '/core/image_upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',},
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
      resolve(data.location);
    });
  }
  reader.readAsDataURL(blobInfo.blob());
});

function enterEditorMode(event, target_id) {
  let editor_id = target_id + '_editor';
  let editor = document.getElementById(editor_id);
  editor = document.getElementById(editor_id);
  editor.style.display = 'block';
  event.target.innerText = PREVIEW_TEXT;
  document.getElementById(target_id).innerHTML = '';
  document.getElementById(target_id).style.display = 'none';
  tinymce.get(editor_id).show();
}

function enterPreviewMode(event, target_id) {
  let editor_id = target_id + '_editor';
  console.log(editor_id)
  tinymce.get(editor_id).hide();
  let editor = document.getElementById(editor_id);
  editor.style.display = 'none';
  event.target.innerText = EDIT_TEXT;
  document.getElementById(target_id).innerHTML = tinymce.get(editor_id).getContent();
  document.getElementById(target_id).style.display = 'block';
  addSaveButton();
}

