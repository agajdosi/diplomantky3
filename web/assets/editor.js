import * as params from '@params';

window.onload = documentLoaded;
document.getElementById("edit_button").onclick = edit;
document.getElementById("save_button").onclick = save;

function documentLoaded() {
  let canEditURL = getCanEditURLCookie();
  if (!canEditURL) {
    return;
  }
}

function edit(){
  addEditorTextArea();
  tinymce.init({
    selector: 'textarea#editor',
    height: 500,
    menubar: false,
    plugins: [
      'autolink',
      'wordcount'
    ],
    toolbar: 'undo redo | formatselect | ' +
    'bold italic backcolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | help',
    content_css: "/main.css",
    //content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
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

function addEditorTextArea() {
  let editor = document.getElementById('editor');
  if (editor) return;

  let mainContainer = document.getElementById('main');
  editor = document.createElement('textarea');
  editor.setAttribute('id', 'editor');
  mainContainer.prepend(editor);
  editor.innerHTML = content.innerHTML;
}


