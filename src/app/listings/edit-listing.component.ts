import { Component, ViewChild, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Subscription }          from 'rxjs/Subscription';  // TODO: DETERMINE WHAT THIS IS FOR & IF WE NEED IT
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators }   from '@angular/forms';   // Remove if no validation logic
import { IconService } from '../core/services/icon.service';
import { HelpersService } from '../shared/helpers/helpers.service';
import { ApiEnumsService } from '../core/api/api-enums.service';
import { ApiImagesService } from '../core/api/api-images.service';
import { ApiListingsService } from '../core/api/api-listings.service';
import { Category } from '../shared/models/category.model';
import { Condition } from '../shared/models/condition.model';
import { Listing } from './listing.model';

// TODO: The Form structure is losing it's getter correctness, so probably manually setting/pushing in controls instead
    // of using the proper setters. Look through & fix the direct setting of values so that things align better.


// const UPLOADED_IMAGES = [
//   'https://cdn.shopify.com/s/files/1/1083/5260/products/Wild_Things_Baby_Shoes_by_by_Sew_Darn_Ezy_for_Twig_and_Tale.jpg?v=1519893991',
//   'https://cdn.shopify.com/s/files/1/1083/5260/products/Robyn_Deer.jpg?v=1519893991'
// ];

export class Location {
  id: string;
  referenceName: string;
  description: string;
  address1: string;
  address2: string;
  city: string;
  location: string;
  state: string;
  country: string;
}

const USER_MEETING_LOCATIONS = [
  {id: "1", referenceName: "home", description: "Starbucks Meeting Location", address1: "123 1st", address2: "#1", city: "Newcastle", location: "98059", state: "WA", country: "USA"},
  {id: "2", referenceName: "vacation", description: "Vacation Starbucks Meeting Location", address1: "987 9st", address2: "#9", city: "Bend", location: "97654", state: "OR", country: "USA"}
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
  @Output() editingEE = new EventEmitter<boolean>();
  tempListing: Listing;
  categories: Category[];  // TODO: POPULATE WITH API PROVIDED CATEGORY LIST
  conditions: Condition[];  // TODO: POPULATE WITH API PROVIDED CATEGORY LIST
  locations = USER_MEETING_LOCATIONS;  // TODO: POPULATE WITH API OF USER"S INPUT LOCATIONS



  allImages: string[] = [];
  hints: any = {};


  private unsubscribe: Subject<any> = new Subject();
  forListingCreation  = false;  // TODO: CARRYOVER FROM SIGNPOST; DETERMINE IF NEED

  constructor(private icons:       IconService,
              private helpers:     HelpersService,
              private formBuilder: FormBuilder,
              private apiEnums:    ApiEnumsService,
              private apiImages:   ApiImagesService,
              private apiListings: ApiListingsService) {
    // Creates a FormGroup of k/v pairs that specify the FormControls in the group. Value starts as default value.
    // This FG will get bound to the Form. We can do so in HTML with <form [formGroup]="myForm"

    // this.auth = authService.auth;
    // this._subscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => {
    //   this.auth = newVal;
    // });
    const that = this;
    this.buildForm();
    console.log("LISTING FORM IS: ", this.listingForm);
  }

  ngOnInit() {
    this.resetTempListing();  // FIXME: THIS SHOULD BE BEFORE REFORESH_ALL_IMAGES & BUILD_IMAGES
    this.refreshAllImages();  // FIXME: VERIFY combined refreshAllImages & buildCheckboxImages OR Break out separately
    this.resetForm();
    this.getEnums();  // Gets category, condition, etc values.
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
    if(url) { return this.helpers.verifyOrAddProtocolToUrl(url); }
  }

  // For the a-link href display
  urlWithoutPrototol(url: string) {
    if(url) { return this.helpers.urlWithoutProtocol(url); }
  }

  // Builds or resets the form to its original basic values
  buildForm() {
    const that = this;
    this.listingForm = this.formBuilder.group({  // FUTURE: LISTINGFORM
      categoryId: ['', Validators.required],
      conditionId: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      linkUrl: ['', {updateOn: 'blur'}],  // Subscription valueChange triggered only on blur
      images: this.formBuilder.array([]),
      heroImage: ['', Validators.required],
      price: ['', Validators.required],
      locationId: ['', Validators.required],
      keywords: ['']
    });
    // FIXME? MAY HAVE TO PUT THE LISTING_FORM LINK_URL SUBSCRIPTION DOWN HERE.
    this.setLinkUrlSubscription();
  }

  setLinkUrlSubscription() {
    // This subscription updates the images by scraping the example site for its images
    // Works as an onBlur update of the URL after it's typed in
    this.listingForm.controls['linkUrl']
      .valueChanges
      .takeUntil(this.unsubscribe)  // Prevents observable leaks
      .subscribe( (newVal: string) => {
        // TODO: Call API to scrape the newly updated address
        console.log("Changed the url: ", newVal);
        this.refreshAllImages();
      });
  }

  // Filter for ONLY selected (checked) images; used to filter for hero image options list.
  keepTruthyFilter(item: any) {
    return item.controls['checked'].value;  // TODO: Fix? THIS GETS CALLED A L-O-T.
  }

  // Call API for updates
  save() {
    const that = this;

    // Final Form Data Check
    if(passesCriticalValidations()) {

      // Update Listing Flow (has ID)
      if(this.listing.id) {
        this.apiListings.updateListing(buildListingSaveObject())
          .subscribe(
            listing => {
              console.log("SUCCESSFUL Update WITH RESPONSE: ", listing);
              // TODO: SHOULD WE BUBBLE UP DATA TO PRIOR PAGES HERE, SO DON'T NEED TO RELOAD? PROBABLY.
              this.saveEE.emit(listing);
            },
            error => {
              console.log("ERROR DURING Update WITH ERROR: ", error);
              // TODO: PROPOGATE API ERRORS TO THE UI ERROR MESSAGES
            });
      }

      // Create Listing Flow (no ID)
      else {
        this.apiListings.createListing(buildListingSaveObject())
          .subscribe(
            listing => {
              console.log("SUCCESSFUL Create WITH RESPONSE: ", listing);
              // this.resetTempListing();  // FIXME: THIS SHOULD BE BEFORE REFORESH_ALL_IMAGES & BUILD_IMAGES
              // this.refreshAllImages();  // FIXME: VERIFY combined refreshAllImages & buildCheckboxImages OR Break out separately
              // this.resetForm();
              this.saveEE.emit(listing);  // Emit to close add-listing
              console.log("emitted to close window")
              // TODO: SHOULD WE BUBBLE UP DATA TO PRIOR PAGES HERE, SO DON'T NEED TO RELOAD? PROBABLY.
            },
            error => {
              console.log("ERROR DURING Create WITH ERROR: ", error);
              // TODO: PROPOGATE API ERRORS TO THE UI ERROR MESSAGES
            });
      }
    }
    // Form data failed - trigger errors
    else {
      this.triggerEmptyInputValidations();
    }

    // Critical pre-save checks
    function passesCriticalValidations() {
      const checks = that.listingForm.get('categoryId').value &&
        that.listingForm.get('title').value &&
        that.listingForm.get('price').value &&
        that.listingForm.get('locationId').value &&
        that.listingForm.get('heroImage').value;

      console.log("CHECKS IS: ", checks);
      return !!checks;
    }

    function buildListingSaveObject() {
      let saveObj = Object.assign({}, that.listingForm.value);

      console.log("THE FORM MODEL IS: ", that.tempListing);

      // Get only selected images
      const correctImages = that.listingForm.get('images') as FormArray;
      let selectedImages = correctImages.controls
        .map(item => item.value)       // get all value objects
        .filter(item => item.checked)  // keep only checked ones
        .map(item => item.url)         // get their urls

      // Set hero image first (could do in one line, but harder to read unless familiar with splice)
      selectedImages.splice(selectedImages.indexOf(saveObj.heroImage), 1);  // Remove hero from list
      selectedImages.splice(0, 0, saveObj.heroImage);  // Set hero first

      saveObj.images = selectedImages;  // set on the save object

      // Set the non-form values
      saveObj.id = that.listing.id;
      saveObj.userId = that.listing.userId;  // TODO: UPDATE TO GET OFF OF THE AUTH OBJECT????

      console.log("THE saveObj IS:", saveObj);
      return saveObj;
      // console.log("THE ORIG IMAGES ARE: ", correctImages);
      // console.log("THE FILTERED IMAGES ARE: ", selectedImages);
    }
  }

  // Getting stuff like Categories & Conditions from Api
  getEnums() {
    const that = this;
    this.apiEnums.getCategories()
        .subscribe(
          categories => {
            console.log("CATEGORIES RETURNED FROM GET: ", categories);
            //that.isProcessing = false;
            that.categories = categories;
          },
          error => {
            console.log("ERROR GETTING CATEGORIES: ", error);
          }
        );
    this.apiEnums.getConditions()
    .subscribe(
      conditions => {
        console.log("CONDITIONS RETURNED FROM GET: ", conditions);
        //that.isProcessing = false;
        that.conditions = conditions;
      },
      error => {
        console.log("ERROR GETTING CONDITIONS: ", error);
      }
    );
  }

  getImageGroup() {
    return <FormArray>this.listingForm.get('images');
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

  toggleHint(hint: string) {
    console.log("HINTS IS: ", this.hints);
    console.log("HINT IS: ", hint);
    console.log("HAS OWN PROPERTY ON HINT IS: ", this.hints.hasOwnProperty(hint));
    if(this.hints.hasOwnProperty(hint)) {
      this.hints[hint] = !this.hints[hint];
    }
  }

  toggleEditing(event: any) {
    console.log("IN edit-listing. BUBBLING editingEE up with this event: ", event);

    this.editingEE.emit(event);
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
    this.resetForm();
    this.resetTempListing();
  }





  // Reset Functions
  resetForm() {
    if(this && this.listingForm) {
      // Set all values to the original listing;
      this.listingForm.patchValue({
        categoryId:  this.listing.categoryId,
        conditionId: this.listing.conditionId,
        title:       this.listing.title,
        description: this.listing.description,
        linkUrl:     this.listing.linkUrl,
        heroImage:   ( this.listing.images[0] || ''),
        price:       this.listing.price,
        locationId:  this.listing.locationId,
        keywords:    this.listing.keywords
      });

      this.listingForm.get('images').reset();
      // Reset images as well, but have to do so with built object, so use reset function
      this.refreshTempListingImages();
    }
  }

  // This is mostly for the selectable images right now. Maybe change name(s) later.
  // This requests the API to get all images from the linkURL & add them to allImages;
  refreshAllImages() {
    const that = this;
    // Combine all images from all places in here
    if(this.tempListing && this.tempListing.linkUrl) {
      this.apiImages.getExternalImages(this.tempListing.linkUrl)
        .subscribe(
          urls => {
            console.log("SUCCESSFUL SIGN CREATION: ", urls);
            // TODO: DEDUP SIMILAR URLS FROM THE ARRAY
            that.allImages = urls.concat(that.listing.images);
            buildCheckboxImages();  // Builds into Checkboxes
          },
          error => {
            console.log("GOT AN ERROR CREATING SIGN. ERROR: ", error);
          });
    }
    else if(this.tempListing && this.tempListing.images) {
      this.allImages = this.tempListing.images;
    }
    else {
      this.allImages = [];
    }

    // TODO: MAY NEED TO FILTER OUT EMPTY URL VALUES FROM LIST, AS RESET COULD CREATE THIS CONDITION IF NO PICTURES ARE FOUND
    // This builds the images into FormControls for displaying as checkboxes
    function buildCheckboxImages() {
      const imagesControls = that.listingForm.controls['images'] as FormArray;
      const imgCtrArr = imagesControls.value;

      // Add all images to the controls
      that.allImages.forEach( imgUrl => {
        // Note: "images" is a FormArray, which is an Array of FormGroups, which each has the Control properties we set in addImage
        if(-1 === imgCtrArr.findIndex(function matchingUrl(elem) {return elem.url === imgUrl; }))  {
          let images = that.listingForm.controls['images'] as FormArray;
          images.controls.push(addImage(imgUrl));
        }
      });
    }

    // Create the form controls for an image
    function addImage(url: string, checked: boolean = false, hero: boolean = false): FormGroup {
      return that.formBuilder.group({
        url: url,
        checked: checked,
        hero: hero
      });
    }
  }

  // Resets the buttons that are triggered by changes
  private resetFormDisplay() {
    const controls = this.listingForm.controls;
    Object.keys(controls).forEach(control => {
      console.log("CONTROL IS: ", control);
      controls[control].markAsPristine();
      controls[control].markAsUntouched();
    });
  }

  // Creates List of Image Urls from only Selected Images
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
    this.resetHints();
  }

  resetHints() {
    this.hints = {
      category: false,
      condition: false,
      title: false,
      description: false,
      linkUrl: false,
      images: false,
      hero: false,
      price: false,
      location: false,
      keywords: false
    };
    console.log("HINTS REST TO: ", this.hints);
  }




  // ********** CONSIDER BREAKING OUT TO A SERVICE *************
  // ******************** CUSTOM VALIDATIONS HERE **************************
  // NOTE: validationErrorMessages are implemented in each listing content type
  validationErrorMessages: any = {};
  displayedValidationErrors: any = {
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
