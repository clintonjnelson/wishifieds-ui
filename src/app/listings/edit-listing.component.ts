import { Component, ViewChild, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Subscription }          from 'rxjs/Subscription';  // TODO: DETERMINE WHAT THIS IS FOR & IF WE NEED IT
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators }   from '@angular/forms';   // Remove if no validation logic
import { IconService } from '../core/services/icon.service';
import { HelpersService } from '../shared/helpers/helpers.service';
import { Listing } from './listing.model';


const CATEGORY_LIST = [
  { id: 1, icon: 'star', name: 'antiques' },
  { id: 2, icon: 'star', name: 'art' },
  { id: 3, icon: 'star', name: 'atv & off-road' },
  { id: 4, icon: 'star', name: 'autoparts' },
  { id: 5, icon: 'star', name: 'autos' },
  { id: 6, icon: 'star', name: 'baby & kids' },
  { id: 7, icon: 'star', name: 'bicycles & parts' },
  { id: 8, icon: 'star', name: 'boats & watercraft' },
  { id: 9, icon: 'star', name: 'books & magazines' },
  { id: 10, icon: 'star', name: 'camera & video' },
  { id: 11, icon: 'star', name: 'clothing & assessories' },
  { id: 12, icon: 'star', name: 'collectibles' },
  { id: 13, icon: 'star', name: 'computers' },
  { id: 14, icon: 'star', name: 'electronics' },
  { id: 15, icon: 'star', name: 'farm & agriculture' },
  { id: 16, icon: 'star', name: 'furniture' },
  { id: 17, icon: 'star', name: 'games & toys' },
  { id: 18, icon: 'star', name: 'gigs' },
  { id: 19, icon: 'star', name: 'health & beauty' },
  { id: 20, icon: 'star', name: 'housewares' },
  { id: 21, icon: 'star', name: 'housing & apartments' },
  { id: 22, icon: 'star', name: 'jewelery' },
  { id: 23, icon: 'star', name: 'lawn & garden' },
  { id: 24, icon: 'star', name: 'materials' },
  { id: 25, icon: 'star', name: 'motorcycles & scooters' },
  { id: 26, icon: 'star', name: 'musical goods' },
  { id: 27, icon: 'star', name: 'other' },
  { id: 28, icon: 'star', name: 'real estate' },
  { id: 29, icon: 'star', name: 'rentals' },
  { id: 30, icon: 'star', name: 'services & consulting' },
  { id: 31, icon: 'star', name: 'sporting goods' },
  { id: 32, icon: 'star', name: 'tickets & events' },
  { id: 33, icon: 'star', name: 'tools & equipment' },
  { id: 34, icon: 'star', name:'travel & accommodations'  }
];

// TODO: CHANGE THE ORDER OF THIS ARRANGEMENT. MAYBE CREATE AN ORDERING FIELD?
const CONDITION_LIST = [
  { id: 1, icon: 'star', name: 'any' },
  { id: 2, icon: 'star', name: 'as-is' },
  { id: 3, icon: 'star', name: 'poor' },
  { id: 4, icon: 'star', name: 'fair' },
  { id: 5, icon: 'star', name: 'good' },
  { id: 6, icon: 'star', name: 'excellent' },
  { id: 7, icon: 'star', name: 'new' },
  { id: 8, icon: 'star', name: 'not applicable' }
];

const UPLOADED_IMAGES = [
  'https://cdn.shopify.com/s/files/1/1083/5260/products/Wild_Things_Baby_Shoes_by_by_Sew_Darn_Ezy_for_Twig_and_Tale.jpg?v=1519893991',
  'https://cdn.shopify.com/s/files/1/1083/5260/products/Robyn_Deer.jpg?v=1519893991'
];

const SCRAPED_LINK_URL_SITE_IMAGES = [
  "https://cdn.shopify.com/s/files/1/1083/5260/products/Fox_Kate.jpg?v=1519893991",
  "https://cdn.shopify.com/s/files/1/1083/5260/products/Robyn_circle.jpg?v=1519893991"
];

export class Location {
  id: string;
  referenceName: string;
  description: string;
  address1: string;
  address2: string;
  city: string;
  zipcode: string;
  state: string;
  country: string;
}

const USER_MEETING_LOCATIONS = [
  {id: "1", referenceName: "home", description: "Starbucks Meeting Location", address1: "123 1st", address2: "#1", city: "Newcastle", zipcode: "98059", state: "WA", country: "USA"},
  {id: "2", referenceName: "vacation", description: "Vacation Starbucks Meeting Location", address1: "987 9st", address2: "#9", city: "Bend", zipcode: "97654", state: "OR", country: "USA"}
];


@Component({
  moduleId: module.id,
  selector: 'edit-listing',
  templateUrl: 'edit-listing.component.html',
  styleUrls: ['edit-listing.component.css']
})
export class EditListingComponent implements OnInit {
  listingForm: FormGroup;  // THIS WILL LATER JUST BE THE listingForm. NOTE: Can call .valid on this group to see if any validation errors.
  @ViewChild('listingForm') currentForm: FormGroup;
  @Input() listing: Listing;  // TODO: GET THIS FROM NGONINIT, NOT INPUT
  @Output() saveEE    = new EventEmitter<any>();
  @Output() destroyEE = new EventEmitter<any>();
  tempListing: Listing;
  categories = CATEGORY_LIST;  // TODO: POPULATE WITH API PROVIDED CATEGORY LIST
  conditions = CONDITION_LIST;  // TODO: POPULATE WITH API PROVIDED CATEGORY LIST
  locations = USER_MEETING_LOCATIONS;  // TODO: POPULATE WITH API OF USER"S INPUT LOCATIONS

  scrapedImages: string[] = SCRAPED_LINK_URL_SITE_IMAGES;
  uploadedImages: string[] = UPLOADED_IMAGES;
  allImages: string[];


  private unsubscribe: Subject<any> = new Subject();
  forListingCreation  = false;  // TODO: CARRYOVER FROM SIGNPOST; DETERMINE IF NEED

  constructor(private icons:       IconService,
              private helpers:     HelpersService,
              private formBuilder: FormBuilder) {
    // Creates a FormGroup of k/v pairs that specify the FormControls in the group. Value starts as default value.
    // This FG will get bound to the Form. We can do so in HTML with <form [formGroup]="myForm"

        // this.auth = authService.auth;
    // this._subscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => {
    //   this.auth = newVal;
    // });
    this.listingForm = this.formBuilder.group({  // FUTURE: LISTINGFORM
      category: ['', Validators.required],
      condition: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      linkUrl: [, {updateOn: 'blur'}],  // Subscription valueChange triggered only on blur
      images: this.formBuilder.array([]),
      heroImage: [''],
      price: ['', Validators.required],
      location: ['', Validators.required],
      keywords: ['']
    });
    console.log("LISTING FORM IS: ", this.listingForm);

    // This subscription updates the images by scraping the example site for its images
    // Works as an onBlur update of the URL after it's typed in
    this.listingForm.controls['linkUrl']
      .valueChanges
      .takeUntil(this.unsubscribe)  // Prevents observable leaks
      .subscribe( (newVal: string) => {
      // TODO: Call API to scrape the newly updated address
      console.log("Changed the url: ", newVal);
    })
  }

  ngOnInit() {
    this.allImages = this.refreshAllImages();
    this.buildImages();
    this.resetTempListing();
  }

  ngOnDestroy() {
    // this._subscription.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  // For the a-link href generation
  verifyOrAddProtocolToUrl(url: string) {
    return this.helpers.verifyOrAddProtocolToUrl(url)
  }

  // For the a-link href display
  urlWithoutPrototol(url: string) {
    return this.helpers.urlWithoutProtocol(url);
  }

  refreshAllImages() {
    // Combine all images from all places in here
    const allImageUrls = this.scrapedImages.concat(this.uploadedImages);
    console.log("ALL IMAGE URLS FOUND ARE:", allImageUrls);
    return allImageUrls;
  }


  // Maybe add all callback filters into a library object later?
  // THIS GETS CALLED A L-O-T.
  keepTruthyFilter(item: any) {
    return item.controls['checked'].value;
  }

  // TODO: UPDATE THESE CONTROL METHODS
  destroy(event: any) {
    console.log("SIGNCOMPONENT DESTROY EVENT IS EMITTING EVENT TO ADD-SIGN: ", event);
    this.destroyEE.emit(event);
  }

  // TODO: USE A SIMPLE PASS-UP FOR SAVING??
  save(event: any): void {
    // Listing preview
    if(event && event.preview === true) {
      this.listing = event.listing;
      return;
    }
    // Listing creation
    else {
      console.log("SIGN AT THE SIGN_COMPONENT LEVEL IS: ", event);
      this.saveEE.emit(event);    // keep passing the listing up
    }
  }

  // SAVE IT DIRECTLY AND PASS UP THE SAVED LISTING INFORMATION??
  save2(tempListing: Listing) {
    const that = this;
    // Create New Listing?
    if(this.forListingCreation) {

      // TODO: DO IMPORTANT VALIDATIONS OF STUFF HERE BEFORE ALLOWING SAVING
      // if(!tempListing.listingName ) { return this.triggerEmptyInputValidations(); }
      // if(tempListing.listingName === 'custom' && !tempListing.linkUrl) { return this.triggerEmptyInputValidations(); }

      console.log("CALLING THE CREATE SIGN ROUTE for this listing: ", tempListing);
      // this.apiListingsService.createListing(tempListing)
      //   .subscribe(
      //     listing => {
      //       console.log("SUCCESSFUL SIGN CREATION: ", listing);
      //       that.saveEE.emit(listing);  // pass the new listing up
      //       that.toggleEditing(false);
      //       that.resetTempListing();
      //     },
      //     error => {
      //       console.log("GOT AN ERROR CREATING SIGN. ERROR: ", error);
      //     });
    }
    // Else Update existing listing
    else {
      console.log("CALLING THE UPDATE SIGN ROUTE");
      // this.apiListingsService.updateListing(tempListing)
      //   .subscribe(
      //     success => {  // returns {error: false}
      //       console.log("SUCCESSFUL UPDATE. OBJECT IS: ", success);
      //       // After success, update the listing and then reset the temp listing
      //       that.listing = Object.assign({}, tempListing);
      //       that.saveEE.emit(tempListing);  // pass the new listing up
      //       that.resetTempListing();
      //     },
      //     error => {  // return {error: true, msg: }
      //       console.log("ERROR DURING UPDATE. ERROR IS: ", error);
      //       // SHOW SOME ERROR TO USER HERE
      //     });
    }
  }

  // ************* Form Methods *************
  addImage(url: string, checked: boolean = false, hero: boolean = false): FormGroup {
    return this.formBuilder.group({
      url: url,
      checked: checked,
      hero: hero
    });
  }

  buildImages() {
    // This should UPDATE OR ADD, NOT JUST ADD
    console.log("LISTING FORM FOR IMAGES IS: ", this.listingForm);
    this.allImages.forEach( img => {
      // Note: "images" is a FormArray, which is an Array of FormGroups, which each has the Control properties we set in addImage
      const images = this.listingForm.controls['images'] as FormArray;
      images.controls.push(this.addImage(img));
    });
    console.log("ALLIMAGES IS: ", this.allImages);
  }

  // TODO: if HERO image becomes unselected, then REMOVE HERO IMAGE URL FROM THE CONTROL VALUE ALSO
  toggleSelectImage(index: number) {
    console.log("INDEX FOR CHECKBOX IS: ", index);
    const imgUrl = this.allImages[index];

    const indexStr = index.toString();
    const checkbox = this.listingForm.get('images').get(indexStr).get('checked');
    console.log("checkvalue is: ", checkbox.value);
    checkbox.setValue(!checkbox.value);

    // Refresh the preview images to the checked ones
    this.refreshTempListingImages();
  }

  // THIS IS NOT WORKING< SO PROBABLY NEED TO DO DOM MANIPULAtion OF CSS VIA AN ID ON NG-SELECT
  getSelectedHero() {
    return this.listingForm.controls['heroImage'].value;
  }

  // TEMP: USED TO CHECK VALUES OF STUFF
  check() {
    console.log("DID IT SELECT? : ", this.listingForm.controls['images']['controls'].length);
  }

  cancel() {
    this.resetTempListing();

  }











  // ********** CONSIDER BREAKING OUT TO A SERVICE *************
  // Resets the buttons that are triggered by changes
  private resetFormDisplay() {
    const controls = this.listingForm.controls;
    Object.keys(controls).forEach(control => {
      console.log("CONTROL IS: ", control);
      controls[control].markAsPristine();
      controls[control].markAsUntouched();
    });
  }

  private refreshTempListingImages() {
    // TODO: ENSURE THE HERO IMAGE IS THE FIRST IMAGE

    const imagesFormArr = this.listingForm.get('images') as FormArray;
    console.log("IMAGECONTROLS: ", imagesFormArr);
    const imageUrls = imagesFormArr.controls
      .filter( imageControl => { return imageControl.get("checked").value; })
      .map( imageControl => { return imageControl.get("url").value });

    console.log("IMAGE URLS: ", imageUrls);
    this.tempListing.images = imageUrls;
  }

  private resetTempListing() {
    this.tempListing = Object.assign({}, this.listing);  // Make a copy
  }


  // ******************** CUSTOM VALIDATIONS HERE **************************
  // NOTE: validationErrorMessages are implemented in each listing content type
  validationErrorMessages: Object;
  displayedValidationErrors = {
    title: '',
    linkUrl: '',
    keywords: '',
    description: '',
    price: '',
    location: '',
    images: ''
  };

  ngAfterViewChecked() {
    this.formChangedCheck();
  }

  private triggerEmptyInputValidations() {
    const form = this.listingForm;
    const inputChecks = ['url', 'title', 'email', 'phone'];
    inputChecks.forEach(function(input) {
      if(form.get(input) !== null) {
        form.get(input).markAsDirty();
      }
    });
    this.onValueChanged(null);
  }

  private formChangedCheck() {
    if(this.currentForm === this.listingForm) { return; }

    // TODO: FIGURE OUT HOW TO SET CURRENT_FORM
    // this.listingForm = this.currentForm;

    if(this.listingForm) {
      this.listingForm.valueChanges.subscribe(data => this.onValueChanged(data));
    }
  }

  private onValueChanged(data?: any) {
    if(!this.listingForm) { return; }
    const form = this.listingForm;

    for(const inputName in this.displayedValidationErrors) {
      // clear previous error messages
      this.displayedValidationErrors[inputName] = '';
      const control = form.get(inputName);  // get value from input

      // If control inputName is dirtied & not valid, show all applicable errors
      if(control && control.dirty && !control.valid) {
        const msgs = this.validationErrorMessages[inputName];  // get all messages for each type
        for(const error in control.errors) {
          this.displayedValidationErrors[inputName] += msgs[error] + ' ';
        }
      }
    }
  }
}
