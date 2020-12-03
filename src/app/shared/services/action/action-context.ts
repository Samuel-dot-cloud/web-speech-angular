import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { stringify } from "querystring";
import { SpeechSynthesizerService } from "../web-apis/speech-synthesizer.service";
import { ActionStrategy } from "./action-strategy";
import { ChangeThemeStrategy } from "./change-theme-strategy";
import { ChangeTitleStrategy } from "./change-title-strategy";

@Injectable({
    providedIn: 'root',
  })

export class ActionContext {
    private currentStrategy?: ActionStrategy;

    constructor(
        private changeThemeStrategy: ChangeThemeStrategy,
        private changeTitleStrategy: ChangeTitleStrategy,
        private titleService: Title,
        private speechSynthesizer: SpeechSynthesizerService
    ){
        this.changeTitleStrategy.titleService = titleService;
    }

    processMessage(message: string, language: string): void {
        const msg = message.toLowerCase();
        const hasChangedStrategy = this.hasChangedStrategy(msg, language);

        let isFinishSignal = false;
        if(!hasChangedStrategy){
            isFinishSignal = this.isFinishSignal(msg, language);
        }

        if (!hasChangedStrategy && !isFinishSignal) {
            this.runAction(message, language);
        }
    }

    runAction(input: string, language: string): void {
        if (this.currentStrategy) {
            this.currentStrategy.runAction(input, language);
        }
    }

    setStrategy(strategy:ActionStrategy | undefined): void {
        this.currentStrategy = strategy;
    }
}
