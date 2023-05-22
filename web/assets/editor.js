import * as params from '@params';

const EDITED_DIV_ID = 'bio';
window.addEventListener('load', editorPageLoaded);

function editorPageLoaded() {
  let loggedAs = getLoggedAsCookie();
  if (!loggedAs) return;
  let pageOwner = document.querySelector("meta[name='owner']").getAttribute('content');
  if (!pageOwner) return;
  if (loggedAs !== pageOwner) return;
  addEditButton();
  initTinyMCE();
}

function editButtonClicked(event){
  let currentText = event.target.innerText;
  if (currentText === 'EDIT') {
    enterEditorMode(event);
    return;
  }
  if (currentText === 'PREVIEW') {
    enterPreviewMode(event);
    return;
  }
}

function save() {
  let jwt = document.cookie.split('; ').find(row => row.startsWith('jwt=')).split('=')[1];
  let content = tinymce.activeEditor.getContent();
  let sourceFile = document.querySelector("meta[name='sourceFile']").getAttribute('content');
  let sourceDir = document.querySelector("meta[name='sourceDir']").getAttribute('content');
  let data = {
      "token": jwt,
      "content": content,
      "sourceFile": sourceFile,
      "sourceDir": sourceDir,
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
  let cookie = document.cookie;
  let cookies = cookie.split('; ');
  let row = cookies.find(row => row.startsWith('loggedAs='));
  if (!row) return;

  let value = row.split('=');
  if (value.length < 2) return;
  
  return value[1];
}

function addEditButton() {
  let editButton = document.createElement('button');
  editButton.setAttribute('id', 'edit_button');  
  editButton.addEventListener("click", editButtonClicked);
  editButton.innerText = 'EDIT';
  let footerMenu = document.getElementById('header');
  footerMenu.append(editButton);
}

function addSaveButton() {
  let saveButton = document.getElementById('save_button');
  if (saveButton!==null) return;
  let headerMenu = document.getElementById('header');
  saveButton = document.createElement('button');
  saveButton.setAttribute('id', 'save_button');
  saveButton.onclick = save;
  saveButton.innerText = 'SAVE';
  headerMenu.append(saveButton);
}

function initTinyMCE() {
  let mainContainer = document.getElementById(EDITED_DIV_ID).parentNode;
  editor = document.createElement('textarea');
  editor.setAttribute('id', 'editor');
  mainContainer.prepend(editor);
  editor.innerHTML = document.getElementById(EDITED_DIV_ID).innerHTML;
  editor.style.display = 'none';
  tinymce.init({
    selector: 'textarea#editor',
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
  });
}

function enterEditorMode(event) {
  let editor = document.getElementById('editor');
  editor = document.getElementById('editor');
  editor.style.display = 'block';
  event.target.innerText = 'PREVIEW';
  document.getElementById(EDITED_DIV_ID).innerHTML = '';
  document.getElementById(EDITED_DIV_ID).style.display = 'none';
  tinymce.activeEditor.show();
}

function enterPreviewMode(event) {
  tinymce.activeEditor.hide();
  let editor = document.getElementById('editor');
  editor.style.display = 'none';
  event.target.innerText = 'EDIT';
  document.getElementById(EDITED_DIV_ID).innerHTML = tinymce.activeEditor.getContent();
  document.getElementById(EDITED_DIV_ID).style.display = 'block';
  addSaveButton();
}



