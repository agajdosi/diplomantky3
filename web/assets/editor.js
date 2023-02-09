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
