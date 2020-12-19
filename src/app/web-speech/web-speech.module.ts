import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSpeechComponent } from './web-speech.component';
import { MaterialModule } from '../shared/material/material.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [WebSpeechComponent],
  imports: [
    CommonModule,
    MaterialModule,
    CKEditorModule,
    FormsModule
  ]
})
export class WebSpeechModule { }
