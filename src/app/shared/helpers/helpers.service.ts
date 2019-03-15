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

  // Use in component controller only; Actually pass injected router into here
  buildUserListingLink(router: any, username: string, listingId: string): string {
    return router.createUrlTree([username, 'listings', listingId]).toString();
  }

  miniPrice(price) {
    // Keep price a string for consistency
    const priceParts = price.toString().split('.');
    const corePrice = priceParts[0];
    const cents = priceParts[1];
    if( isOnlyCents(corePrice, cents) ) {
      return { display: `${corePrice}.${cents}`, symbol: '¢' };
    }
    if(corePrice.length > 0 && corePrice.length <= 3) {
      return { display: twoNumbers(price, 1), symbol: '$' };
    }
    if( isThousands(corePrice) ) {
      return { display: twoNumbers(corePrice, 1000), symbol: 'K' };
    }
    if( isMillions(corePrice) ) {
      return { display: twoNumbers(corePrice, 1000000), symbol: 'M' };
    }
    else {
      return { display: '$$$', symbol: '$' };
    }

    //--------- HELPERS ---------
    function isOnlyCents(core, cts) {
      return (
        !!cts &&
        corePrice === '0' &&
        cts.length > 0 &&
        cts.length < 3
      );
    }

    function isThousands(core) {
      return (
        corePrice.length > 3 &&
        corePrice.length <= 6
      );
    }

    function isMillions(core) {
      return (
        corePrice.length > 6 &&
        corePrice.length <= 9
      );
    }

    function twoNumbers(core, magnitude) {
      try {
        const small = (core / magnitude);

        // Show max 3 digits
        if(Math.ceil(small).toString().length >= 3) {
          return Math.round(small).toString();
        }
        else {
          return (Math.round(small * 10) / 10).toString();  // keeps only first decimal number
        }
      }
      catch(e) {
        return '???'
      }
    }
  }

  // Display zone-formatted time
  // TODO: incorporate time zone! If exists, convert to zoned datetime first, then calc


  // Turns times into an amount of time ago. Eg: two days ago, one month ago, two minutes ago, now
  userDisplayTimeAgo(timestampString: string) {
    if(!timestampString) {
      return 'preview';
    }

    try {
      const now = new Date()
      const nowMillis = now.getTime();
      const stamp = new Date(timestampString)
      const stampMillis = stamp.getTime();

      // console.log("timestamp coming in is: ", timestampString);
      // console.log("TIME now is: ", now, "msg timestamp is: ", stamp);

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

        if( now.getUTCFullYear() != stamp.getUTCFullYear() ) {
          monthDiff += 12;  // add one year of months
        }

        return (monthDiff < 2 ? (monthDiff + ' month ago') : (monthDiff + ' months ago'));
      }

      // console.log("DAYS DIFF IS: ", daysDiff);
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
        const minutesDiff = Math.floor(nowMins - stampMins);
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
