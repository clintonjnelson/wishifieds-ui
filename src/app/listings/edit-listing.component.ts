import { Component, ViewChild, Input, Output, OnInit, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';   // Remove if no validation logic
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';  // USING EVENT??? IF NO, REMOVE IT. KEPT JUST IN CASE NEED DURING CODING.
import { MatBadgeModule } from '@angular/material';
import { IconService } from '../core/services/icon.service';
import { HelpersService } from '../shared/helpers/helpers.service';
import { ApiTagsService } from '../core/api/api-tags.service';
import { ApiImagesService } from '../core/api/api-images.service';
import { ApiListingsService } from '../core/api/api-listings.service';
import { ApiLocationsService }  from '../core/api/api-locations.service';
import { ApiUsersService } from '../core/api/api-users.service';
import { WishifiedsApi }       from '../core/api/wishifieds-api.service';
import { FileUploader, FileUploaderOptions, FileDropDirective } from 'ng2-file-upload';
import { DragulaService } from 'ng2-dragula';
import { Listing } from './listing.model';
import { takeUntil } from 'rxjs/operators';
import { Location } from '../shared/models/location.model';
import { GeoInfo } from '../shared/models/geo-info.model';
import { hasImages } from '../shared/validators/has-images.directive';
import { Tag } from '../tags/tag.model';

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
  styleUrls: ['edit-listing.component.css'],
  viewProviders: [DragulaService]
})
export class EditListingComponent implements OnInit, AfterViewInit, OnDestroy {
  listingForm: FormGroup;  // THIS WILL LATER JUST BE THE listingForm. NOTE: Can call .valid on this group to see if any validation errors.
  @ViewChild('listingForm') currentForm: FormGroup;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @Input() listing: Listing;  // TODO: GET THIS FROM NGONINIT, NOT INPUT
  @Output() saveEE    = new EventEmitter<any>();
  @Output() destroyEE = new EventEmitter<any>();
  @Output() editingEE = new EventEmitter<boolean>();
  tempListing: Listing;
  hideAdvanced: boolean = true;

  // DELETE
  userLocations: any;
  defaultUserLocation: any;  // Stores the user's default location
  userLocationsSub: Subscription;
  userLocationsEmit: Subject<any> = new Subject<any>();

  // DELETE
  locationTASearch: string = '';  // The search string for the typeahead
  locationTAId: string = '';
  locationTypeaheads: any[];
  locTypeaheadSub: Subscription;
  locTypeaheadEmit: Subject<any[]> = new Subject<any[]>();
  // location: any = {};  // Not managed by form controls. FIXME: Should be tempListing.location

  // Dropzone Upload Management
  hasBaseDropZoneOver: boolean = false;
  imagesUploader: FileUploader;
  uploadedImagesSub: Subscription;
  uploadedImagesEmit: Subject<any> = new Subject<any>();
  uploadedImageUrls: string[] = [];
  externalImageUrls: string[] = [];
  paginatedImageUrls: string[] = [];  // Temporary holder for image urls
  showLoadMoreImages: boolean = false;
  allImages: string[] = [];
  imagesLoadPageSize = 10;

  allImagesSub: Subscription;
  allImagesEmit: Subject<any> = new Subject<any>();
  imageLoadingSpinner: boolean = false;
  hints: any = {};

  private timeToDestroy: Subject<any> = new Subject();
  forListingCreation  = false;  // TODO: CARRYOVER FROM SIGNPOST; DETERMINE IF NEED

  constructor(private icons:          IconService,
              private helpers:        HelpersService,
              private formBuilder:    FormBuilder,
              private apiTags:        ApiTagsService,
              private apiImages:      ApiImagesService,
              private apiListings:    ApiListingsService,
              private apiUsers:       ApiUsersService,
              private wishifiedsApi:  WishifiedsApi,
              private dragulaService: DragulaService,
              private locationService:ApiLocationsService,) {
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
    // Prep the object - existing or new
    this.resetTempListing();  // FIXME: THIS SHOULD BE BEFORE REFORESH_ALL_IMAGES & BUILD_IMAGES

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
    // DELETE
    this.userLocationsSub = this.userLocationsEmit.subscribe((newLocs: any) => {
      that.userLocations = newLocs;  // These are the queried user userLocations for dropdown selector
      that.defaultUserLocation = newLocs.find(function(loc) { return loc.isDefault; });
      // Set the default found or the listing value that came in.
      if(!that.listing.location) {
        that.tempListing.location = that.defaultUserLocation;
        that.tempListing.location.geoInfo = that.tempListing.location.geoInfo as GeoInfo;
      }
      else {
        that.tempListing.location = that.listing.location;
      }
    });
    // DELETE
    this.locTypeaheadSub = this.locTypeaheadEmit.subscribe( (newTypeaheads: any[]) => {
      console.log("SETTING TYPEAHEAD Locations: ", newTypeaheads);
      that.locationTypeaheads = newTypeaheads;
      console.log("TYPEAHEADS IS NOW", this.locationTypeaheads);
    });

    this.getUserLocations();
    // Prep the form (reset displays, reset errors, etc); removes image selections
    this.resetForm();
    // Takes the list of allImages and turns them into the form images
    this.resetAllImages();  // FIXME: VERIFY combined refreshAllImages & buildCheckboxImages OR Break out separately
    // Bootstrap the Drag/Drop Upload Functionaltiy
    this.setupImageUploader();
  }

  ngAfterViewInit() {
    const that = this;
    // This subscription updates the images by scraping the example site for its images
    // Works as an onBlur update of the URL after it's typed in
    this.listingForm.controls['linkUrl']
      .valueChanges
      .pipe(takeUntil(this.timeToDestroy))  // Prevents observable leaks
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
    this.timeToDestroy.next();
    this.timeToDestroy.complete();
    this.userLocationsSub.unsubscribe();
    this.locTypeaheadSub.unsubscribe();
    this.uploadedImagesSub.unsubscribe();
    this.allImagesSub.unsubscribe();
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
      title: ['', Validators.required],
      description: ['', Validators.required],
      linkUrl: ['', {updateOn: 'blur'}],  // Subscription valueChange triggered only on blur
      images: this.formBuilder.array([], hasImages),
      price: ['', Validators.required],
      tags: this.formBuilder.array([])
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

  // Filter for ONLY selected (checked) images; used to filter for hero image options list.
  keepTruthyFilter(item: any) {
    return item.controls['checked'].value;  // TODO: Fix? THIS GETS CALLED A L-O-T.
  }

  // Call API for updates
  save() {
    const that = this;

    // Set location info if not already set to a valid value
    if(!hasLocationInfo()) { that.tempListing.location = this.defaultUserLocation; }

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
              // DO LOGIC TO ADD IT TO THE displayedValidationErrors
              // OR just trigger an error from the validationErrorMsgs object.
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

    function hasLocationInfo() {
      try {
        return (
            that.tempListing['location']['locationId'] &&
            Number(that.tempListing['location']['locationId']) &&
            Number(that.tempListing['location']['locationId']) > 0
          ) ||
          (
            that.tempListing['location']['geoInfo'] &&
            that.tempListing['location']['geoInfo']['latitude'] &&
            that.tempListing['location']['geoInfo']['longitude']
          );
      } catch (e) {
        return false;
      }
    }

    // Critical pre-save checks
    function passesCriticalValidations() {
      const checks = that.listingForm.get('title').value &&
        that.listingForm.get('price').value &&
        hasLocationInfo() &&  // Should have it by now - custom or default
        that.listingForm.get('images')['length'];

      return !!checks;
    }

    function buildListingSaveObject() {
      let saveObj = Object.assign({}, that.listingForm.value);
      console.log("THE INITIAL SAVEOBJECT FROM LISTINGFORM IS: ", saveObj);
      console.log("THE FORM MODEL IS: ", that.tempListing);

      // Get only selected images
      const correctImages = that.listingForm.get('images') as FormArray;
      console.log("THE IMAGES FORM ARRAY IS: ", correctImages);
      let selectedImages = correctImages.controls
        .map(item => item.value)       // get all value objects
        .filter(item => item.checked)  // keep only checked ones
        .map(item => item.url)         // get their urls
      saveObj.images = selectedImages;  // set on the save object

      // Set the non-form values
      saveObj.id = that.listing.id;
      saveObj.userId = that.listing.userId;  // TODO: UPDATE TO GET OFF OF THE AUTH OBJECT????
      saveObj.location = that.tempListing.location;  // Add this, as NOT part of form

      console.log("THE saveObj IS:", saveObj);
      return saveObj;
    }
  }

  // DELETE
  getUserLocations() {
    const that = this;
    this.apiUsers.getLocationsByUserId(that.listing.userId)
      .subscribe(
        res => {
          // console.log("Respons with userLocations returned is: ", res);
          console.log("Respons with userLocations returned is: ", res.locations);
          that.userLocationsEmit.next(res.locations);  // May need subscription for different load times....
        },
        error => {
          console.log("ERROR GETTING LOCATIONS: ", error);
        }
      )
  }

  // TODO: EXTRACT THESE OUT TO A SINGLE COMPONENT FOR LOCATION TYPEAHEAD
  // DELETE
  getLocationTypeaheads() {
    const that = this;
    var cityStatePostal = this.parseLocation(); // {postal: '', city: '', stateCode: ''};

    console.log("INPUT TRIGGERED TYPEAHEAD CHANGES TO GET NEW RESULTS: ", cityStatePostal);
    if(this.locationTASearch.length > 2) {
      const maxResults = '7';
      this.locationService
        .locationTypeahead(cityStatePostal['postal'], cityStatePostal['city'], cityStatePostal['stateCode'], maxResults)
        .subscribe(
          results => {
            console.log("SUCCESS GETTING TYPEAHEAD RESULTS: ", results);
            that.locTypeaheadEmit.next(results.locations);
          },
          error => {
            console.log("ERROR GETTING TYPEAHEAD RESULTS: ", error);
          });
    }
  }
  // DELETE
  selectLocationTA(event) {
    const that = this;
    // Only reload with changes AFTER initial search
    const selectedTypeahead = this.locationTypeaheads.find(function(ta) {
        return (ta['id'] == (event['option'] && event['option']['value']));  //
      });  // get the geoInfo object off of the result. Worst case is null.
    if(selectedTypeahead && selectedTypeahead['geoInfo']) {
      this.tempListing['location'] = {
        locationId: selectedTypeahead['id'],
        description: '',
        postal: selectedTypeahead['postal'],
        status: undefined,
        isDefault: undefined,
        geoInfo: {
          latitude: selectedTypeahead['geoInfo'][0],
          longitude: selectedTypeahead['geoInfo'][1],
        }
      };
      this.locationTASearch = selectedTypeahead['typeaheadText'];
    }
  }

  // Get the image group. Helpful in UI for displaying the selector options
  getImageGroup() {
    return <FormArray>this.listingForm.get('images');
  }

  // Grabs images & loads into the images array in paginated batches
  // Note: Slice has an inclusive start & exclusive end, so ending at index 10 will really grab 10 (0-9);
  loadMoreImages() {
    const that = this;
    // >10, load just 10 more images
    if(this.paginatedImageUrls.length >= this.imagesLoadPageSize) {
      this.allImagesEmit.next(
        { urls: that.paginatedImageUrls.slice(0, this.imagesLoadPageSize), isSelected: false }
      );
      this.paginatedImageUrls = this.paginatedImageUrls.slice(this.imagesLoadPageSize);
      this.showLoadMoreImages = true;
    }
    // Load the rest
    else {
      this.allImagesEmit.next({urls: that.paginatedImageUrls.slice(0), isSelected: false});
      this.paginatedImageUrls = [];
      this.showLoadMoreImages = false;
    }
  }

  imagesDropUpdate(newImagesIndexOrder: any) {
    const that = this;
    // [0,1,2,3] --> [3,0,1,2]
    // [0,1,2,3] --> [1,0,2,3]
    // If the new index is same as old, go to the next one
    // If new index is different than the old, take this index FROM the old and insert it here via insert (splices it in)
    // DONE (because it auto-shifts everything after)
    // Then reset the total array starting at zero for dragImagesIndexes

    // "insert() is the same as "splice" for form arrays, according to issue desc
    // Process:
    //    Do nothing to those before
    //    Take 3 (moved) & put it in 0
    //    Increment all after
    //      Take 0 & put it in 1
    //      Take 1 & put it in 2
    //      Take 2 & put it in 3
    let currImagesFormArray = this.listingForm.get('images') as FormArray;
    let done = false;
    if(this.buildBasicIndexList().join(",") == newImagesIndexOrder.join(",")) {
      return;
    }
    else {
      newImagesIndexOrder.forEach(function(fromIdx, toIdx) {
        console.log("HERE ARE THE TWO INDEXEs. PROPOSED,ORIG:", fromIdx, toIdx);
        if(!done && (fromIdx != toIdx)) {
          done = true;

          console.log("FORM_ARRAY BEFORE MOVE CONTROL: ", currImagesFormArray);
          let controlToMove = currImagesFormArray.at(fromIdx) as AbstractControl;
          currImagesFormArray.insert(toIdx, controlToMove);
          console.log("FORM_ARRAY AFTER INSERT CONTROL: ", currImagesFormArray);
          currImagesFormArray.removeAt(fromIdx+1);
          console.log("FORM_ARRAY AFTER REMOVE CONTROL: ", (that.listingForm.get('images') as FormArray));
        }
      })
    }
  }

  // Iterate over array of length to match FormArray length
  // Example for six images: [0,1,2,3,4,5];
  private buildBasicIndexList() {
    return Array(this.getImageGroup().length).map(function(elem, ind) {return ind;});
  }

  updateTags(allTags: Tag[]) {
    const that = this;
    console.log("HIT THE TAGS UPDATE FUNCTION...");
    console.log("...WILL WANT TO UPDATE THE FORM ARRAY FOR TAGS SOMEHOW. Received: ", allTags);
    // const updatedFormArr = this.formBuilder.array(allTags)};
    // console.log("new array is ", updatedFormArr);
    this.listingForm.setControl('tags', that.formBuilder.array(allTags));
    this.tempListing.tags = allTags;  // TODO: Make sure this is accurate
    console.log("LISTING FORM AFTER TAGS UPATE IS NOW: ", this.listingForm);
  }

  // DELETE
  updateLocationViaMarker(geoInfo) {
    console.log("UPDATE LOCATION COORDS WAS HIT WITH: ", geoInfo);
    this.tempListing.location = {
      locationId: "-1",  // Set to invalid, so API triggers creation of new Location
      description: '',
      postal: undefined,
      status: undefined,
      isDefault: undefined,
      geoInfo: {
        latitude: geoInfo.lat,
        longitude: geoInfo.lng,
      }
    };
    this.locationTASearch = '';  // reset the textbox
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
        title:       this.listing.title,
        description: this.listing.description,
        linkUrl:     this.listing.linkUrl,
        images:      (this.listing.images || []),
        price:       this.listing.price,
        // tags:        (this.listing.tags || [])
      });
      this.listingForm.setControl('tags', that.formBuilder.array(this.listing.tags));
      // this.listingForm.setControl('images', this.formBuilder.array(that.listing.images || []));
      // Reset images as well, but have to do so with built object, so use reset function
      this.listingForm.get('images').reset();
      this.refreshTempListingImages();
    }
  }

  // Creates List of Image Urls from only Selected Images
  private refreshTempListingImages() {
    const imagesFormArr = this.listingForm.get('images') as FormArray;
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

  // DELETE: Used by Location Typeahead
  private parseLocation() {
    const cityStatePostal: any = {};

    try {
      const postal = parseInt(this.locationTASearch);
      // Postal NOT an int? Use city/state
      if(Number.isNaN(postal)) {
        const parsedCityState = this.locationTASearch.split(',');
        cityStatePostal['city'] = parsedCityState[0];
        cityStatePostal['stateCode'] = (parsedCityState.length > 1 ? parsedCityState[1].trim() : '');
      }
      // Postal is an int - use it
      else {
        cityStatePostal['postal'] = postal;
      }
    }
    catch(e) {
      console.log("Could not use provided location. Error: ", e);
    }

    return cityStatePostal;
  }

  private getExternalImages(urlToScrape) {
    const that = this;
    that.imageLoadingSpinner = true;
    this.apiImages.getExternalImages(urlToScrape)
      .subscribe(
        newImageUrls => {
          that.imageLoadingSpinner = false;
          console.log("EDIT GOT IMAGES: ", newImageUrls);
          that.paginatedImageUrls = newImageUrls;
          that.loadMoreImages();
        },
        error => {
          that.imageLoadingSpinner = false;
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
  private createImageFormControl(url: string, checked: boolean = false): FormGroup {
    return this.formBuilder.group({
      url: url,
      checked: checked
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
    console.log("TEMP LISTING IS NOW: ", this.tempListing);
    this.resetHints();
  }

  resetHints() {
    this.hints = {
      title: false,
      description: false,
      linkUrl: false,
      images: false,
      price: false,
      location: false,
    };
    console.log("HINTS REST TO: ", this.hints);
  }




  // ********** CONSIDER BREAKING OUT TO A SERVICE *************
  // ******************** CUSTOM VALIDATIONS HERE **************************
  // These are the custom error messages for each type of input > validation error (control.errors)
  // TODO: There HAS to be a simpler & more scalable way to do this...
  validationErrorMessages: any = {
    title: {
      required: "Title cannot be blank."
    },
    description: {
      required: "Description cannot be blank."
    },
    linkUrl: {
      required: "A website link is needed."
    },
    images: {
      // See has-images.directive.ts to see how this works
      hasImages: "Images are kind of a big deal, so we require at least one."
    },
    price: {
      required: "Price cannot be left empty."
    },
    location: {
      required: "Gotta pick a location... quantom particles have a hard time purchasing."
    },
  };
  displayedValidationErrors: any = {
    title: '', //bad title
    description: '', //bad desc
    linkUrl: '', //bad url
    images: '', //bad img
    price: '', //bad price
    location: '', //bad loc
  };

  ngAfterViewChecked() {
    this.formChangedCheck();
  }

  // Only trigger EMPTY errors for these inputs
  private triggerEmptyInputValidations() {
    const form = this.listingForm;
    const inputChecks = ['title', 'linkUrl', 'images', 'price'];
    inputChecks.forEach(function(input) {
      if(input == "images") {
        console.log("IMAGES INPUT IS: ", form.get(input));
      }
      if(form.get(input) !== null) {
        form.get(input).markAsDirty();
      }
    });
    this.onValueChanged(null);
  }

//
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
        const msgs = this.validationErrorMessages[inputName];  // get custom error messages for each type
        for(const error in control.errors) {  // example: "required"
          console.log("ERROR TO DISPLAY IS: ",error);
          this.displayedValidationErrors[inputName] += msgs[error] + ' '; // Combine total errors
        }
      }
    }
  }
}
