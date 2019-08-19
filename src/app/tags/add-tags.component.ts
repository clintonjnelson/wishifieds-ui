import { Component, ElementRef, ViewChild, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Subscription, Subject, Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ApiTagsService } from '../core/api/api-tags.service';
import { IconService }    from '../core/services/icon.service';
import { Tag } from './tag.model';

/**
 * @title Add Tags management module including autocomplete
 */
@Component({
  selector: 'add-tags',
  templateUrl: 'add-tags.component.html',
  styleUrls: ['add-tags.component.css'],
})
export class AddTagsComponent implements OnInit, OnDestroy {
  @Input() existingTags: Tag[];
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;  // , {static: false}
  @ViewChild('auto') matAutocomplete: MatAutocomplete;  // , {static: false}
  @Output() selectedTagsEE = new EventEmitter<Tag[]>();  // FIXME: CHANGE TO EMIT TAGS!!!!
  tagConfig = {
    visible: true,
    selectable: true,
    removable: true,
    addOnBlur: true,
    separatorKeysCodes: [ENTER, COMMA],  //separatorKeysCodes: number[] = [ENTER, COMMA];  // Refactor out to configs
  };
  tagCtrl = new FormControl();  // Our input. Can listen to this for changes => typeahead request
  tags: Tag[] = [];  // HERE ARE OUR TAGS LIST TO SEND UP VIA EVENT EMITTER TO PARENT PAGE
  // typeaheadTags: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];  // JUST TYPEAHEAD MATCHES!!!! RETURN VIA API
  typeaheadTags: Tag[];  // WOW, can we just update this & updates in UI?? No Sub/Emit stuff??
  typeaheadSub: Subscription;
  typeaheadEmit: Subject<Tag[]> = new Subject<Tag[]>();
  private timeToDestroy: Subject<any> = new Subject<any>();

  constructor(public tagsService: ApiTagsService, public icons: IconService) {
  }

  ngOnInit() {
    const that = this;
    // When the input changes,
    this.typeaheadSub = this.typeaheadEmit.subscribe( (newTags: Tag[]) => {
      console.log("SETTING TYPEAHEAD TAGS TO NEW TAGS: ", newTags);
      that.typeaheadTags = newTags;
      console.log("TYPEAHEAD TAGS IS NOW", this.typeaheadTags);
    });
    this.resetTags();

    this.tagCtrl.valueChanges
      .pipe(
        startWith(null),  // initial value of our input to compare against
        map( (tagInputStr: string | null) => {
          console.log("INPUT TRIGGERED TYPEAHEAD CHANGES TO GET NEW RESULTS");
          if(tagInputStr && tagInputStr.length > 2) {
            const tagQuery = tagInputStr.toLowerCase();
            const maxResults = '7';
            return that.tagsService.searchTags(tagQuery, maxResults)
              .subscribe(
                res => {
                  console.log("SUCCESS GETTING TYPEAHEAD RESULTS: ", res);
                  that.typeaheadEmit.next(res.tags);
                },
                error => {
                  console.log("ERROR GETTING TYPEAHEAD RESULTS: ", error);
                });
          }
        }),
        takeUntil(this.timeToDestroy))
      .subscribe();
  }

  ngOnDestroy() {
    this.typeaheadSub.unsubscribe();
    this.timeToDestroy.next();
    this.timeToDestroy.complete();
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  add(event: MatChipInputEvent): void {
    const that = this;
    console.log("EVENT WOULD BE NICE TO KNWO IF TRIGGERED: ", event);
    console.log("AUTOCOMPLETE MAY HAVE SOME INFO?:", this.matAutocomplete);
    // Add tag only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    console.log("MAT AUTOCOMPLETE OPEN BEFORE ADDING IS: ", this.matAutocomplete.isOpen);
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const tagName = (event.value || '').trim();

      if(this.isDuplicate(tagName)) { return; }

      // Add our tag
      console.log("TAG NAME WILL SOON BE CREATED: ", tagName);
      if (tagName) {
        // Create (or find) the typed tag
        console.log("ABOUT TO CREATE TAG NAME OF: ", tagName);
        this.tagsService.createTag(tagName)
          .subscribe(
            res => {
              console.log("SUCCESSFUL TAG CREATION. RES IS: ", res);
              if(res.tag) {
                let tag = {id: res.tag.id, name: res.tag.name}
                that.tags.push(tag);
                that.selectedTagsEE.emit(that.tags);  // Send only the IDs to the listing
              }
              else {
                console.log("NO TAG FOUND IN RES!");
              }
            },
            error => {
              console.log("Error creating tag. Error is: ", error);
            });
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.tagCtrl.setValue(null);
    }
  }

  remove(tagName: string): void {
    const index = this.tags.findIndex(function(tag, ind, orig) { return tag.name === tagName; });

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if(this.isDuplicate(event.option.viewValue)) { return; }

    this.tags.push(this.typeaheadTags.find(tag => tag.name === event.option.viewValue));
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    this.selectedTagsEE.emit(this.tags);  // Send updated tags
  }

  private resetTags() {
    this.tags = this.existingTags;
  }

  private isDuplicate(name) {
    const lcName = name.toLowerCase();
    return this.tags
      .map(function(tag) {return tag['name'].toLowerCase();})
      .indexOf(lcName) != -1;
  }
}
