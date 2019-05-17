export function isObject(a) {
  return (!!a) && (a.constructor === Object);
}

export function downloadFile(content: string, filename: string) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:application/octet-stream;charset=utf-8;base64,' + btoa(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
