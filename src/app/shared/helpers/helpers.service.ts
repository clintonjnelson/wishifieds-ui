import { Injectable } from '@angular/core';

@Injectable()

export class HelpersService {

  urlWithoutProtocol(url) {
    let checkFormatUrl = url.toLowerCase();
    if(checkFormatUrl.includes('http://') || checkFormatUrl.includes('https://')) {
      return url.split('//')[1];  // split on // and take 2nd half
    }
    return url;
  }

  verifyOrAddProtocolToUrl(url: string) {
    let checkFormatUrl = url.toLowerCase().trim();
    if(checkFormatUrl.includes('http://') || checkFormatUrl.includes('http://')) {
      return url.trim();
    }
    else {
      return 'http://' + url.trim();
    }
  }

  // Phone Formatter Function?
}
