import { Injectable } from '@angular/core';

@Injectable()

export class HelpersService {

  isEqualStrInt(strInt1: any, strInt2: any) {
    try { return ( Number(strInt1).toString() === Number(strInt2).toString() ); }
    catch (e) { return false; }
  }

  urlWithoutProtocol(url) {
    if(url) {
      const checkFormatUrl = url.toLowerCase();
      if(checkFormatUrl.includes('http://') || checkFormatUrl.includes('https://')) {
        return url.split('//')[1];  // split on // and take 2nd half
      }
      return url;
    }
  }

  verifyOrAddProtocolToUrl(url: string) {
    if(url) {
      const checkFormatUrl = url.toLowerCase().trim();
      if(checkFormatUrl.includes('http://') || checkFormatUrl.includes('https://')) {
        return url.trim();
      }
      else {
        return 'http://' + url.trim();
      }
    }
  }

  // Display zone-formatted time
  // TODO: incorporate time zone! If exists, convert to zoned datetime first, then calc


  // Turns times into an amount of time ago. Eg: two days ago, one month ago, two minutes ago, now
  userDisplayTimeAgo(timestampString: string) {
    if(!timestampString) {
      return 'tbd';
    }

    try {
      const now = new Date()
      const nowMillis = now.getTime();
      const stamp = new Date(timestampString)
      const stampMillis = stamp.getTime();

      console.log("timestamp coming in is: ", timestampString);
      console.log("TIME now is: ", now, "msg timestamp is: ", stamp);

      const nowDays = nowMillis / 86400000;
      const stampDays = stampMillis / 86400000;
      const daysDiff = Math.floor(nowDays - stampDays);

      let yearDiff = 0;
      if(daysDiff > 365) {
        yearDiff = now.getUTCFullYear() - stamp.getUTCFullYear();
        return (yearDiff < 2 ? (yearDiff + ' year ago') : (yearDiff + ' years ago'));
      }

      let monthDiff = 0;
      if(daysDiff > 30) {
        monthDiff = now.getUTCMonth() - stamp.getUTCMonth();
        return (monthDiff < 2 ? (monthDiff + ' month ago') : (monthDiff + ' months ago'));
      }

      if(daysDiff < 1) {

        // Hours first
        const nowHours = nowMillis / 3600000;
        const stampHours = stampMillis / 3600000;
        const hoursDiff = Math.floor(nowHours - stampHours);
        if(hoursDiff > 0) {
          return (hoursDiff < 2 ? (hoursDiff + ' hour ago') : (hoursDiff + ' hours ago'));
        }

        // Minutes Next
        const nowMins = nowMillis / 60000;
        const stampMins = stampMillis / 60000;
        const minutesDiff = Math.floor(nowHours - stampHours);
        if(minutesDiff > 0) {
          return (minutesDiff < 2 ? (minutesDiff + ' minute ago') : (minutesDiff + ' minutes ago'));
        }

        else {
          return 'just now';
        }
      }

      // Else, it's day(s) ago
      else {
        return (daysDiff < 2 ? (daysDiff + ' day ago') : (daysDiff + ' days ago'));
      }
    }
    catch(e) {
      // just return the timestamp if fails in processing. Better than nothing.
      return timestampString
    }
  }

  // Phone Formatter Function?
}
