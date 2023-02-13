import * as params from '@params';

window.onload = documentLoaded;

function documentLoaded() {
  let canEditURL = getCanEditURLCookie();
  if (!canEditURL) {
    console.log('getCanEditURLCookie is False');
    return;
  }

  addEditButton();
}


function editButtonClicked(event){
  console.log(event);
  event.target.innerText = 'PREVIEW'
  addEditorTextArea();
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

function save() {
  let jwt = document.cookie.split('; ').find(row => row.startsWith('jwt=')).split('=')[1];
  let data = {
      "token": jwt,
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

function getCanEditURLCookie() {
  let cookie = document.cookie;
  let cookies = cookie.split('; ');
  let row = cookies.find(row => row.startsWith('canEditURL='));
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

function addEditorTextArea() {
  let editor = document.getElementById('editor');
  if (editor) return;

  let mainContainer = document.getElementById('main');
  editor = document.createElement('textarea');
  editor.setAttribute('id', 'editor');
  mainContainer.prepend(editor);
  editor.innerHTML = content.innerHTML;
}

function enterEditorMode() {

}

function enterPreviewMode() {

}



