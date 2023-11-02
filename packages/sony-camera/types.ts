export type Callback<CallbackResponse> = (err: Error | null, result?: CallbackResponse) => void;
export type Status = 'UNKNOWN' | 'IDLE' | 'NotReady';

export type EventTypes =
  | {
      type: 'availableApiList';
      names: string[];
    }
  | {
      type: 'cameraStatus';
      status: Status;
    }
  | {
      type: 'zoomInformation';
      zoomPositionCurrentBox: 0;
      zoomIndexCurrentBox: 0;
      zoomNumberBox: 0;
      zoomPosition: 0;
    }
  | { type: 'liveviewStatus'; liveviewStatus: boolean }
  | {
      type: 'storageInformation';
      storageDescription: string;
      numberOfRecordableImages: number;
      storageID: string;
      recordTarget: boolean;
      recordableTime: number;
    }
  | {
      type: 'cameraFunction';
      cameraFunctionCandidates: ['Contents Transfer', 'Remote Shooting'];
      currentCameraFunction: 'Remote Shooting';
    }
  | {
      type: 'exposureMode';
      exposureModeCandidates: [];
      currentExposureMode: 'Intelligent Auto';
    }
  | {
      type: 'postviewImageSize';
      postviewImageSizeCandidates: ['Original', '2M'];
      currentPostviewImageSize: '2M';
    }
  | {
      type: 'selfTimer';
      currentSelfTimer: 0;
      selfTimerCandidates: [0, 2, 10];
    }
  | {
      type: 'shootMode';
      shootModeCandidates: ['still'];
      currentShootMode: 'still';
    }
  | {
      minExposureCompensation: 0;
      type: 'exposureCompensation';
      stepIndexOfExposureCompensation: 0;
      maxExposureCompensation: 0;
      currentExposureCompensation: 0;
    }
  | {
      type: 'flashMode';
      flashModeCandidates: [];
      currentFlashMode: 'off';
    }
  | {
      type: 'fNumber';
      fNumberCandidates: [];
      currentFNumber: `${number}.${number}`;
    }
  | {
      type: 'focusMode';
      focusModeCandidates: ['AF-S', 'DMF', 'MF'];
      currentFocusMode: 'AF-S';
    }
  | {
      type: 'isoSpeedRate';
      isoSpeedRateCandidates: [];
      currentIsoSpeedRate: 'AUTO';
    }
  | {
      type: 'programShift';
      isShifted: boolean;
    }
  | {
      type: 'shutterSpeed';
      shutterSpeedCandidates: [];
      currentShutterSpeed: '1/60';
    }
  | {
      type: 'whiteBalance';
      currentColorTemperature: -1;
      checkAvailability: true;
      currentWhiteBalanceMode: 'Auto WB';
    }
  | {
      type: 'touchAFPosition';
      currentTouchCoordinates: [];
      currentSet: false;
    };
