import * as params from '@params';

window.onload = documentLoaded;

function documentLoaded() {
  let canEditURL = getCanEditURLCookie();
  if (!canEditURL) {
    return;
  }

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


function getCanEditURLCookie() {
  let cookie = document.cookie;
  let cookies = cookie.split('; ');
  let row = cookies.find(row => row.startsWith('canEditURL='));
  if (!row) return;
  
  let value = row.split('=');
  if (value.length < 2) return;

  return value[1];
}


