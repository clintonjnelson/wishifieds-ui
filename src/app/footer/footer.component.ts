import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HelpersService } from '../shared/helpers/helpers.service';
import 'rxjs/add/operator/switchMap';

export class NavLink {
  icon:    String;
  url:     String;
  bgColor: String;
};

const SOCIAL_LINKS: NavLink[] = [
  {icon: 'facebook-official', url: '/some/link/to/facebook',  bgColor: '#3b5998'},
  {icon: 'twitter',           url: '/some/link/to/twitter',   bgColor: '#007bb5'},
  {icon: 'google',            url: '/some/link/to/google',    bgColor: '#007bb5'},
];


@Component({
  moduleId: module.id,
  selector: 'signpost-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css'],
})

export class FooterComponent implements OnInit {
  currentUser: String;
  socialSharingLinks = SOCIAL_LINKS;
  showSharingLinks: boolean = false;

  constructor(private helpers: HelpersService,
              private route:   ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
        .switchMap( (params: Params) => this.currentUser = params['username']);
          // ALSO GET THE OTHER USER INFO OFF OF HERE & USE TO BUILD SOCISL SHARING ROUTES
  }

  toggleShowSharingLinks(input: any = null): void {
    if(typeof(input) === 'boolean') { this.showSharingLinks = input; }
    else { this.showSharingLinks = !this.showSharingLinks; }
    console.log("SHARING LINKS IS NOW: ", this.showSharingLinks);
  }
}

