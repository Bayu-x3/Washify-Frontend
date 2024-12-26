interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  
  declare let webkitSpeechRecognition: typeof SpeechRecognition;

  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
  }
  