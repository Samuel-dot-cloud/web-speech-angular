import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { defaultLanguage, languages } from '../shared/model/languages';
import { SpeechError } from '../shared/model/speech-error';
import { SpeechEvent } from '../shared/model/speech-event';
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
  totalTranscript?: string; // The variable to accumulate all the recognized texts

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

  ckeditorContent: any;

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

  private initRecognition(): void {

    // "transcript$" now will receive every text(interim result) from the Speech API.
    //  Also, for every "Final Result"(from the speech), the code will append that text to the existing Text Area component.
    this.transcript$ = this.speechRecognizer.onResult().pipe(
      tap((notification) => {
        if (notification.event === SpeechEvent.FinalContent) {
          this.totalTranscript = this.totalTranscript
            ? `${this.totalTranscript}\n${notification.content?.trim()}` : notification.content;
        }
      }),
      map((notification) => notification.content || '')
    );

    // "listening$" will receive 'true' when the Speech API starts and 'false' when it's finished.
    this.listening$ = merge(
      this.speechRecognizer.onStart(),
      this.speechRecognizer.onEnd()
    ).pipe(
      map((notification) => notification.event === SpeechEvent.Start)
    );

    // "errorMessage$" will receive any error from Speech API and it will map that value to a meaningful message for the user
    this.errorMessage$ = merge(
      this.speechRecognizer.onError(),
      this.defaultError$
    ).pipe(
      map((data) => {
        if (data === undefined) {
          return '';
        }
        let message;
        switch (data.error) {
          case SpeechError.NotAllowed:
            message = `Cannot run the demo. 
            Your browser is not authorized to access your microphone. 
            Verify that your browser has access to your microphone and try again.`;
            break;

          case SpeechError.NoSpeech:
            message = `No sppech has been detected. Please try again.`;
            break;

          case SpeechError.AudioCapture:
            message = `Microphone is not available. Please verify the connection of your microphone and try again.`;
            break;

          default:
            message = '';
            break;
        }
        return message;
      })
    );
  }

}
