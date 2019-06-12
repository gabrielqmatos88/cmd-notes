import { saveAs } from 'file-saver';

export function isObject(a) {
  return (!!a) && (a.constructor === Object);
}

export function downloadFile(content: string, filename: string) {
  const blob = new Blob([ content ], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, filename);
}
