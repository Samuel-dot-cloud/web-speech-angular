import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { defaultLanguage, languages } from '../shared/model/languages';
import { SpeechRecognizerService } from '../shared/services/web-apis/speech-recognizer.service';

@Component({
  selector: 'wsa-web-speech',
  templateUrl: './web-speech.component.html',
  styleUrls: ['./web-speech.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebSpeechComponent implements OnInit {
  languages: string[] = languages;
  currentLanguage: string = defaultLanguage; //Set the default language
  totalTranscription!: string; // The variable to accumulate all the recognized texts

  transcript$!: Observable<string>; // Shows the transcript in "real-time"
  listening$!: Observable<boolean>; // Changes to 'true'/'false' when the recognizer starts/stops
  errorMessage$!: Observable<string>; // An error from the Speech Recognizer
  defaultError$ = new Subject<undefined>(); // Clean-up of the previous errors
  

  constructor(private speechRecognizer: SpeechRecognizerService) { }

  ngOnInit(): void {
    // Initialize the speech recognizer with the default language
    this.speechRecognizer.initialize(this.currentLanguage);
    // Prepare observables to 'catch' events, results and errors.
    this.initRecognition();
  }

  start(): void {
    if (this.speechRecognizer.isListening) {
      this.stop();
      return;
    }

    this.defaultError$.next(undefined);
    this.speechRecognizer.start();
  }

  stop(): void {
    this.speechRecognizer.stop();
  }

  selectLanguage(language: string): void {
    if (this.speechRecognizer.isListening) {
      this.stop();
    }
    this.currentLanguage = language;
    this.speechRecognizer.setLanguage(this.currentLanguage);
  }

}
