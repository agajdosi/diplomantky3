import * as params from '@params';

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
  let footerMenu = document.getElementById('footer_menu');
  footerMenu.append(editButton);
}

function addSaveButton() {
  let footerMenu = document.getElementById('footer_menu');
  let saveButton = document.createElement('button');
  saveButton.setAttribute('id', 'save_button');  
  saveButton.onclick = save;
  saveButton.innerText = 'SAVE';
  footerMenu.append(saveButton);
}

function initTinyMCE() {
  let mainContainer = document.getElementById('main');
  editor = document.createElement('textarea');
  editor.setAttribute('id', 'editor');
  mainContainer.prepend(editor);
  let content = document.getElementById('content');
  editor.innerHTML = content.innerHTML;
  editor.style.display = 'none';
  tinymce.init({
    selector: 'textarea#editor',
    height: '80vh',
    menubar: false,
    promotion: false,
    menu: {
      file: { title: 'File', items: 'save cancel | restoredraft | preview ' },
      edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace' },
      view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen' },
      insert: { title: 'Insert', items: 'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime' },
      format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat' },
      tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | code wordcount' },
    },
    plugins: ['save', 'autolink', 'wordcount'],
    statusbar: true,
    toolbar: [
      {name: 'formatting', items: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript']},
      {name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify']},
      {name: 'indentation', items: ['outdent', 'indent']},
      {name: 'history', items: ['undo', 'redo', 'cancel']},
    ],
    content_css: "/main.css",
  });
}

function enterEditorMode(event) {
  let editor = document.getElementById('editor');
  let content = document.getElementById('content');
  editor = document.getElementById('editor');
  editor.style.display = 'block';
  event.target.innerText = 'PREVIEW';
  content.innerHTML = '';
  tinymce.activeEditor.show();
}

function enterPreviewMode(event) {
  tinymce.activeEditor.hide();
  let editor = document.getElementById('editor');
  let content = document.getElementById('content');
  editor.style.display = 'none';
  event.target.innerText = 'EDIT';
  content.innerHTML = tinymce.activeEditor.getContent();
  addSaveButton();
}



