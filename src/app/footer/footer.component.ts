import { Component } from '@angular/core';

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

export class FooterComponent {
  socialSharingLinks = SOCIAL_LINKS;
}
