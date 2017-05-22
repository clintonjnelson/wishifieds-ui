import { Injectable } from '@angular/core';

@Injectable()

export class GuestService {
  constructor() {}

  createAndSetGuid() {
    const guid = window.crypto.getRandomValues(new Uint32Array(3)).toString().replace(/,/g, '-');
    console.log("GUID GENERATED AS: ", guid);

    window.localStorage.setItem('guid', guid);
  }
}
