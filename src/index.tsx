import {
  NativeModules,
  Dimensions,
  NativeEventEmitter,
  Platform
} from 'react-native';


type RecordScreenConfigType = {
  width?: number;
  height?: number;
};

type RecordingSuccessResponse = {
  result: {
    videoUrl: string;
  };
};

type RecordingErrorResponse = {
  result: {
    videoUrl: string;
  };
};

type RecordingResponse = RecordingSuccessResponse | RecordingErrorResponse;

type RecordScreenType = {
  setup(config: RecordScreenConfigType): void;
  startRecording(config?: RecordScreenConfigType): Promise<void>;
  stopRecording(): Promise<RecordingResponse>;
  clean(): Promise<string>;
};

const {RecordScreen} = NativeModules;

const RS = RecordScreen as RecordScreenType;

const eventEmitter = Platform.OS === "ios" ? null : new NativeEventEmitter(NativeModules.RecordScreen);

class ReactNativeRecordScreenClass {
  private _screenWidth = Dimensions.get('window').width;
  private _screenHeight = Dimensions.get('window').height;
  private _eventEmitter

  constructor() {
    RS.setup({
      width: this._screenWidth,
      height: this._screenHeight,
    });
  }


  public onComplete(callback) {
    if (Platform.OS === "android") {
      this._eventEmitter = eventEmitter.addListener("onComplete", data => {
        callback(data)
      })
    }
  }

  public removeListener() {
    if (Platform.OS === "android" && this._eventEmitter) {
      this._eventEmitter.remove()
    }
  }

  async startRecording(): Promise<void> {
    return new Promise((resolve, reject) => {
      RS.startRecording().then(resolve).catch(reject);
    });
  }

  async stopRecording(): Promise<RecordingResponse> {
    return new Promise((resolve, reject) => {
      RS.stopRecording().then(resolve).catch(reject);
    });
  }

  clean(): Promise<string> {
    return new Promise((resolve, reject) => {
      RS.clean().then(resolve).catch(reject);
    });
  }
}

const ReactNativeRecordScreen = new ReactNativeRecordScreenClass();

export default ReactNativeRecordScreen;
