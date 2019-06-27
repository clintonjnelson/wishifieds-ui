import { Component, ElementRef, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Subscription, Subject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
export class AddTagsComponent implements OnInit {
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
        }))
      .subscribe();
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  add(event: MatChipInputEvent): void {
    // Add tag only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    console.log("MAT AUTOCOMPLETE OPEN BEFORE ADDING IS: ", this.matAutocomplete.isOpen);
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our tag
      if ((value || '').trim()) {
        this.tags.push( { id: '-1', name: value.trim() } );
        this.selectedTagsEE.emit(this.tags);
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
    this.tags.push(this.typeaheadTags.find(tag => tag.name === event.option.viewValue));
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }
}


// WHY DOES THIS RETURN A FULL ARRAY OF STRINGS & NOT JUST ONE?
  // OH, IS IT FILTERING THE MAIN ARRAY FOR EACH ONE PASSED???
  // SO IT ITERATES THE ENTIRE ARRAY FOR EACH VALUE PASSED???? DUMB.
  // private filterDupTags(tagName: string): string[] {
  //   const name = tagName.toLowerCase();

  //   return this.typeaheadTags.filter(tag => tag.toLowerCase().indexOf(name) === 0);
  // }
