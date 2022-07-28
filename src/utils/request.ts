import got, { Agents } from 'got';
import * as tough from 'tough-cookie';
import { HttpProxyAgent, HttpsProxyAgent } from 'hpagent';
import workspaceConfiguration from './workspaceConfiguration';

interface cookiesConfig {
  url: string;
  cookie: string;
}

class Requset {
  cookieJar: tough.CookieJar;
  agent: Agents | undefined;

  constructor() {
    this.cookieJar = new tough.CookieJar();
    // this.setAgent('http://127.0.0.1:8888');
    this.reLoadCookie();
  }

  setAgent(proxy: string) {
    this.agent = {
      http: new HttpProxyAgent({
        proxy
      }),
      https: new HttpsProxyAgent({
        proxy
      })
    };
  }

  reLoadCookie() {
    this.cookieJar.removeAllCookiesSync();
    const cookies: cookiesConfig[] = workspaceConfiguration().get('cookies', []);
    if (typeof cookies === 'object') {
      cookies.forEach((cookie) => {
        cookie.cookie
          .split(';')
          .map((e) => tough.Cookie.parse(e))
          .forEach((e) => {
            e && this.cookieJar.setCookieSync(e, cookie.url);
          });
      });
    }
  }

  send(options: any) {
    if (typeof options === 'string') {
      return got({
        url: options,
        cookieJar: this.cookieJar,
        agent: this.agent
      });
    } else {
      return got({
        ...options,
        cookieJar: this.cookieJar,
        agent: this.agent
      });
    }
  }
}

export default new Requset();
