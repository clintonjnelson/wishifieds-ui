import { Component, ViewChild, Input, Output, OnInit, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';   // Remove if no validation logic
import { IconService } from '../core/services/icon.service';
import { HelpersService } from '../shared/helpers/helpers.service';
import { ApiEnumsService } from '../core/api/api-enums.service';
import { ApiImagesService } from '../core/api/api-images.service';
import { ApiListingsService } from '../core/api/api-listings.service';
import { ApiUsersService } from '../core/api/api-users.service';
import { WishifiedsApi }       from '../core/api/wishifieds-api.service';
import { Category } from '../shared/models/category.model';
import { Condition } from '../shared/models/condition.model';
import { FileUploader, FileUploaderOptions, FileDropDirective } from 'ng2-file-upload';
import { Listing } from './listing.model';
import { takeUntil } from 'rxjs/operators';
import { Location } from '../shared/models/location.model';

// TODO: The Form structure is losing it's getter correctness, so probably manually setting/pushing in controls instead
  // of using the proper setters. Look through & fix the direct setting of values so that things align better.


// Explain the image management process here
  // Look for images on the listing. Add them to total & show them as selectable in UI.
  // Look for images that have been uploaded. Add them as total & show them as selectable in UI.
  // Look for images at the imageURL endpoint. Load those & make selectable.
  // Every time a new URL is added, pull in those images & make them selectable.
  //


@Component({
  moduleId: module.id,
  selector: 'edit-listing',
  templateUrl: 'edit-listing.component.html',
  styleUrls: ['edit-listing.component.css']
})
export class EditListingComponent implements OnInit, AfterViewInit {
  listingForm: FormGroup;  // THIS WILL LATER JUST BE THE listingForm. NOTE: Can call .valid on this group to see if any validation errors.
  @ViewChild('listingForm') currentForm: FormGroup;
  @Input() listing: Listing;  // TODO: GET THIS FROM NGONINIT, NOT INPUT
  @Output() saveEE    = new EventEmitter<any>();
  @Output() destroyEE = new EventEmitter<any>();
  @Output() editingEE = new EventEmitter<boolean>();
  tempListing: Listing;
  categories: Category[];  // TODO: POPULATE WITH API PROVIDED CATEGORY LIST
  conditions: Condition[];  // TODO: POPULATE WITH API PROVIDED CATEGORY LIST
  hideAdvanced: boolean = true;
  locations: any;
  locationsSub: Subscription;
  locationsEmit: Subject<any> = new Subject<any>();


  // Dropzone Upload Management
  hasBaseDropZoneOver: boolean = false;
  imagesUploader: FileUploader;
  uploadedImagesSub: Subscription;
  uploadedImagesEmit: Subject<any> = new Subject<any>();
  uploadedImageUrls: string[] = [];
  externalImageUrls: string[] = [];
  allImages: string[] = [];

  allImagesSub: Subscription;
  allImagesEmit: Subject<any> = new Subject<any>();
  showImageSpinner: boolean = false;
  hints: any = {};


  private unsubscribe: Subject<any> = new Subject();
  forListingCreation  = false;  // TODO: CARRYOVER FROM SIGNPOST; DETERMINE IF NEED

  constructor(private icons:         IconService,
              private helpers:       HelpersService,
              private formBuilder:   FormBuilder,
              private apiEnums:      ApiEnumsService,
              private apiImages:     ApiImagesService,
              private apiListings:   ApiListingsService,
              private apiUsers:      ApiUsersService,
              private wishifiedsApi: WishifiedsApi) {
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
    const that = this;
    // Takes an object {urls: string[], isSelected: boolean}
    this.allImagesSub = this.allImagesEmit.subscribe((urlsAndSelected: any) => {
      const urls = urlsAndSelected.urls;
      const isSelected = urlsAndSelected.isSelected;

      console.log("NEW IMAGES TO ADD: ", urls, " and isSelected: ", isSelected);
      // Every image: added to all-list, turned into selectable image
      that.allImages = this.allImages.concat(urls);
      that.makeNewImagesSelectable(urls, isSelected);
      console.log("NEW IMAGES ADDED. allImages is now: ", this.allImages);
    });
    this.locationsSub = this.locationsEmit.subscribe((newLocs: any) => {
      // if(that.locations && that.locations.length == 1 && that.tempListing.userLocationId) {
      //   that.tempListing.userLocationId = newLocs[0][userLocationId];
      // }
      // else {
        that.locations = newLocs;
      // }
    });
    this.getUserLocations();
    // Prep the object - existing or new
    this.resetTempListing();  // FIXME: THIS SHOULD BE BEFORE REFORESH_ALL_IMAGES & BUILD_IMAGES
    // Prep the form (reset displays, reset errors, etc); removes image selections
    this.resetForm();
    // Takes the list of allImages and turns them into the form images
    this.resetAllImages();  // FIXME: VERIFY combined refreshAllImages & buildCheckboxImages OR Break out separately
    // Get enums for condition, etc. // TODO: MAY REMOVE
    this.getEnums();  // Gets category, condition, etc values.
    // Bootstrap the Drag/Drop Upload Functionaltiy
    this.setupImageUploader();
  }

  ngAfterViewInit() {
    const that = this;
    // This subscription updates the images by scraping the example site for its images
    // Works as an onBlur update of the URL after it's typed in
    this.listingForm.controls['linkUrl']
      .valueChanges
      .pipe(takeUntil(this.unsubscribe))  // Prevents observable leaks
      .subscribe( (newUrl: string) => {
        // TODO: Call API to scrape the newly updated address
        console.log("Changed the url: ", newUrl);
        if(newUrl && newUrl.trim()) {
          that.getExternalImages(newUrl);
        }
        // this.refreshAllImages();
      });

    this.refreshTempListingImages();  // FIXME - SEEMS HACKY. TO ENSURE IMAGES SHOW. EMITTER???????!!!!!
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  // Dropzone trigger show file drop class (border)
  fileOverBase(e: any): void { this.hasBaseDropZoneOver = e; }

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
      categoryId: ['1', Validators.required],  // TODO: Default to 1 here? On API?
      conditionId: ['1', Validators.required],  // TODO: Default to 1 here? On API?
      title: ['', Validators.required],
      description: ['', Validators.required],
      linkUrl: ['', {updateOn: 'blur'}],  // Subscription valueChange triggered only on blur
      images: this.formBuilder.array([]),
      hero: ['', Validators.required],
      price: ['', Validators.required],
      userLocationId: ['', Validators.required],
      keywords: ['']
    });
    // FIXME? MAY HAVE TO PUT THE LISTING_FORM LINK_URL SUBSCRIPTION DOWN HERE.
    // this.setLinkUrlSubscription();
  }

  // Avatar Uploading Stuff; maybe one-day a service that takes url & returns files
  setupImageUploader() {
    const that = this;
    // Uploader Options (essentially auth headers)
    const uploaderOptions: FileUploaderOptions = {};
    uploaderOptions.headers = [{name: 'eat', value: that.wishifiedsApi.getEatAuthCookie()}];
    console.log("Uploader options is: ", uploaderOptions);


    this.imagesUploader = new FileUploader({
      url: this.wishifiedsApi.routes['uploadListingImages'],
      itemAlias: 'listingimages',
      autoUpload: true,
    });
    this.imagesUploader.setOptions(uploaderOptions);

    // Handling file loading & uploading
    console.log("Uploader Options ARE: ", this.imagesUploader.options);
    this.imagesUploader.onAfterAddingFile = function(file) {file.withCredentials = false;};
    this.imagesUploader.onCompleteItem = function(item: any, response: any, status: any, headers: any) {
      console.log("ImageUpload:uploaded:", item, status, response);
      console.log("Response is: ", response);
      const savedImages = JSON.parse(response).savedImages;
      // ??that.uploadedImagesEmit.next({urls: savedImages, isSelected: true}); // Update this array???
      that.allImagesEmit.next({urls: savedImages, isSelected: true}); // auto-select uploaded images
    };
  }

  // QUESTION????vvvvvDOES THIS Reset all images with any change in the URL????
  // setLinkUrlSubscription() {
  //   const that = this;
  //   // This subscription updates the images by scraping the example site for its images
  //   // Works as an onBlur update of the URL after it's typed in
  //   this.listingForm.controls['linkUrl']
  //     .valueChanges
  //     .pipe(takeUntil(this.unsubscribe))  // Prevents observable leaks
  //     .subscribe( (newUrl: string) => {
  //       // TODO: Call API to scrape the newly updated address
  //       console.log("Changed the url: ", newUrl);
  //       if(newUrl && newUrl.trim()) {
  //         that.getExternalImages(newUrl);
  //       }
  //       // this.refreshAllImages();
  //     });
  // }

  // Filter for ONLY selected (checked) images; used to filter for hero image options list.
  keepTruthyFilter(item: any) {
    return item.controls['checked'].value;  // TODO: Fix? THIS GETS CALLED A L-O-T.
  }

  // Call API for updates
  save() {
    const that = this;

    // Find & set user's default location
    if(!that.listingForm.get('userLocationId').value) {
      const defaultLocation = that.locations.find(function(loc) { return loc.isDefault; });
      that.listingForm.patchValue({ userLocationId: defaultLocation.userLocationId });
      that.tempListing.userLocationId = defaultLocation.userLocationId;
    }

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
              this.saveEE.emit(listing);  // Emit to close add-listing FIXME: DOES NOT FLOW DOWN! Just reloads page currently.
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
      const checks = that.listingForm.get('title').value &&
        that.listingForm.get('price').value &&
        that.listingForm.get('userLocationId').value &&
        that.listingForm.get('hero').value &&
        that.listingForm.get('images')['length'];

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

      console.log("SELECTEDIMAGES before mvoe hero: ", selectedImages);
      console.log("HERO IS: ", saveObj.hero);
      // Set hero image first (could do in one line, but harder to read unless familiar with splice)
      selectedImages.splice(selectedImages.indexOf(saveObj.hero), 1);  // Remove hero from list
      selectedImages.splice(0, 0, saveObj.hero);  // Set hero first

      console.log("IMAGES AFTER MOVE HERO TO FRONT: ", selectedImages);
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

  getUserLocations() {
    const that = this;
    this.apiUsers.getLocationsByUserId(that.listing.userId)
      .subscribe(
        res => {
          // console.log("Respons with locations returned is: ", res);
          console.log("Respons with locations returned is: ", res.locations);

          that.locationsEmit.next(res.locations);  // May need subscription for different load times....
        },
        error => {
          console.log("ERROR GETTING LOCATIONS: ", error);
        }
      )
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

  // Get the image group. Helpful in UI for displaying the selector options
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

  toggleAdvanced(input: any = null): void {
    // If setting value directly, do that. Else, just toggle the value
    if(typeof(input) === 'boolean') { this.hideAdvanced = input; }
    else { this.hideAdvanced = !this.hideAdvanced; }
  }

  // THIS IS NOT WORKING< SO PROBABLY NEED TO DO DOM MANIPULAtion OF CSS VIA AN ID ON NG-SELECT
  getSelectedHero() {
    return this.listingForm.controls['hero'].value;
  }

  // TEMP: USED TO CHECK VALUES OF STUFF
  check() {
    console.log("DID IT SELECT? : ", this.listingForm.controls['images']['controls'].length);
  }

  cancel() {
    this.resetForm();
    this.resetTempListing();
    this.toggleEditing(false);
  }


  // Reset Functions
  resetForm() {
    const that = this;
    if(this && this.listingForm) {
      // Set all values to the original listing;
      this.listingForm.patchValue({
        categoryId:  this.listing.categoryId,
        conditionId: this.listing.conditionId,
        title:       this.listing.title,
        description: this.listing.description,
        linkUrl:     this.listing.linkUrl,
        hero:   ( this.listing.images[0] || ''),
        images:      (this.listing.images || []),
        price:       this.listing.price,
        userLocationId:  this.listing.userLocationId,
        keywords:    this.listing.keywords
      });

      // this.listingForm.setControl('images', this.formBuilder.array(that.listing.images || []));
      // Reset images as well, but have to do so with built object, so use reset function
      this.listingForm.get('images').reset();
      this.refreshTempListingImages();
    }
  }

  // Creates List of Image Urls from only Selected Images
  private refreshTempListingImages() {
    // TODO: ENSURE THE HERO IMAGE IS THE FIRST IMAGE
    const imagesFormArr = this.listingForm.get('images') as FormArray;
    // console.log("FORMARRAY: ", imagesFormArr.value);
    // console.log("IMAGECONTROLS: ", imagesFormArr.controls);
    // console.log("IMAGECONTROLS LENGTH IS: ", imagesFormArr.controls.length);
    imagesFormArr.controls.forEach( i => {console.log("ITEM IS: ", i);})
    const imageUrls = imagesFormArr.controls
      .filter( imageControl => { return imageControl.get("checked").value; })
      .map( imageControl => { return imageControl.get("url").value; });

    console.log("IMAGE URLS: ", imageUrls);
    this.tempListing.images = imageUrls;
  }

  // This is mostly for the selectable images right now. Maybe change name(s) later?
  // This requests the API to get all images from the linkURL & add them to allImages;
  // This does the following (WITHOUT duplication)
      // = RESET Images.
      // - Gets any images originally on the listing
      // - Adds all images from the linkUrl
      // - Adds any uploaded images
  resetAllImages() {
    const that = this;
    console.log("Resetting All Images...");
    this.allImages = [];
    // Add any listing images
    if(this.listing && this.listing.images) {
      console.log("Listing images found.... adding:", this.listing.images);
      this.allImagesEmit.next({urls: this.listing.images, isSelected: true});
    }
    // Add any uploaded images
    if(this.uploadedImageUrls.length) {
      console.log("Uploaded images found.... adding:", this.uploadedImageUrls);
      this.allImagesEmit.next({urls: that.uploadedImageUrls, isSelected: true});
    }
    // Scrape linkUrl and add those images
    if(this.tempListing && this.tempListing.linkUrl) {
      this.getExternalImages(this.tempListing.linkUrl);
      console.log("...done resetting allImages");
    }
  }

  private getExternalImages(urlToScrape) {
    const that = this;
    this.apiImages.getExternalImages(urlToScrape)
      .subscribe(
        newImageUrls => {
          console.log("EDIT GOT IMAGES: ", newImageUrls);
          that.allImagesEmit.next({urls: newImageUrls, isSelected: false});
        },
        error => {
          console.log("GOT AN ERROR GETTING LINKURL IMAGES. ERROR: ", error);
        });
  }

  // TODO: MAY NEED TO FILTER OUT EMPTY URL VALUES FROM LIST, AS RESET COULD CREATE THIS CONDITION IF NO PICTURES ARE FOUND
  // This builds the images into FormControls for displaying as checkboxes
  private makeNewImagesSelectable(urls, isSelected) {
    const imagesControls = this.listingForm.controls['images'] as FormArray;
    const imgCtrArr = imagesControls.value;

    // For the images requested, add the controls that are not already added
    urls.forEach( imgUrl => {
      // Note: "images" is a FormArray, which is an Array of FormGroups, which each has the Control properties we set in addImage
      if(-1 === imgCtrArr.findIndex(function urlExists(elem) {return elem.url === imgUrl; }))  {
        let images = this.listingForm.controls['images'] as FormArray;
        images.controls.push(this.createImageFormControl(imgUrl, isSelected));
      }
    });
    console.log("CHECKED SHOULD BE: ", isSelected);
    console.log("FINAL LISTING FORM GROUP IS: ", this.listingForm.controls['images']);
  }

  // Create the form controls for an image
  private createImageFormControl(url: string, checked: boolean = false, hero: boolean = false): FormGroup {
    return this.formBuilder.group({
      url: url,
      checked: checked,
      hero: hero
    });
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

  private resetTempListing() {
    this.tempListing = Object.assign({}, this.listing);  // Make a copy
    this.tempListing.hero = this.listing.hero;
    console.log("TEMP LISTING IS NOW: ", this.tempListing);
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
