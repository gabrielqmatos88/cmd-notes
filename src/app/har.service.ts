import { Injectable } from '@angular/core';

export function encode(val) {
  val = val || '';
  return encodeURIComponent(val).replace(/'/g, '%27').replace(/'"'/g, '%22');
}
export function decode(val) {
  val = val || '';
  return decodeURIComponent(val.replace(/\+/g,  ' '));
}
export function extractParams(entry) {
  let result = [];
  if (!!entry && !!entry.request && entry.request.postData && !!entry.request.postData.params) {
    result = entry.request.postData.params.map( p => {
      const decoded = decode(p.value);
      return {
        name: p.name,
        valueTxt: decoded,
        value: JSON.parse(decoded),
      };
    });
  }
  return result;
}
export function getRequestValue(action, replyAction) {
  if (/getvalue/i.test(action.method)) {
    return !!replyAction && replyAction.callbacks && replyAction.callbacks[0] && replyAction.callbacks[0].parameters ?
      replyAction.callbacks[0].parameters.value : null;
  }
  return !!action && !!action.parameters ? action.parameters.value : null;
}
export function parseResults(params, response): any[] {
  const results = [];
  const request = params && params[0] && params[0].value && params[0].value.request ? params[0].value.request : '';
  const reply = !!response && !!response.value && response.value.reply ? response.value.reply : '';
  if (!(!!request && !!reply && !!request.actions)) {
  } else {
    for (let i = 0; i < request.actions.length; i++) {
      const action = request.actions[i];
      const replyAction = reply.actions[i];
      const value = getRequestValue(action, replyAction);
      const rs = {
        id: action.id,
        method: action.method,
        xpath: action.xpath,
        errorCode: replyAction.error.code,
        error: replyAction.error.code !== 16777238 ? replyAction.error : null,
        value: value
      };
      results.push(rs);
    }
  }
  return results;
}

export interface IHarResult {
  url: string;
  date: any;
  time: number;
  timeTx: string;
  queryString: string;
  method: string;
  params: any[];
  response: any;
  result: any[];
  errors?: any[];
  resource: string;
}
function roundToTwo(num: number) {
  return +(Math.round(parseFloat(num + 'e+2'))  + 'e-2');
}
export function getTimeTx(time: number) {
  if (time <= 100) {
    return 'fast';
  }
  if (time <= 300) {
    return 'slow';
  }

  if (time <= 3000) {
    return 'slowest';
  }
  return 'critical';
}
const parseEntries = function(entry): any {
  if (!/json\-req/i.test(entry.request.url)) {
    return {
      date: entry.startedDateTime,
      time: roundToTwo(entry.time),
      timeTx: getTimeTx(entry.time),
      queryString: entry.queryString,
      method: entry.request.method,
      params: {},
      response: {},
      result: [],
      resource: entry.request.url,
    };
  }
  const params = extractParams(entry);
  const response = {
    status: entry.response.status,
    valueTxt: entry.response.content.text,
    value: JSON.parse(entry.response.content.text || null)
  };
  const r: any = {
    date: entry.startedDateTime,
    time: roundToTwo(entry.time),
    timeTx: getTimeTx(entry.time),
    queryString: entry.queryString,
    method: entry.request.method,
    params: params,
    response: response,
    result: parseResults(params, response)
  };
  r.errors = r.result ? r.result.filter( res => !!res.error) : null;
  r.result = r.result ? r.result.filter( res => !res.error) : [];
  return r;
};


@Injectable({
  providedIn: 'root'
})
export class HarService {
  constructor() {}
  public parse(content: string): { url: string, results: IHarResult[] } {
      const data = JSON.parse(content);
      let url = '';
      let entries = [];
      if (!!data && !!data.log) {
        url = data.log.pages && data.log.pages[0] && data.log.pages[0].title ? data.log.pages[0].title : '';
        entries = data.log.entries ? data.log.entries : [];
      }
      const result = entries.map(parseEntries)
        .sort((a, b) => b.time - a.time);
      return {
        url: url,
        results: result
      };
  }
}
