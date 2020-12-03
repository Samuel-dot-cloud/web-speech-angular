import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognizerService {
  recognition!: SpeechRecognition;
  language!: string;
  isListening = false;

  constructor() { }

  initialize(language: string): void {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.setLanguage(language);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.recognition.lang = language;
  }

  start(): void {
    this.recognition.start();
    this.isListening = true;
  }

  stop(): void {
    this.recognition.stop();
  }
}
