import axios from 'axios';
import EventEmitter from 'events';
import { request } from 'http';
import { lt } from 'semver';
import { Callback, Status } from './types';

const SECOND = 1000;
const MIN_VERSION = '2.1.4';

const COMMON_HEADER_SIZE = 8;
const PAYLOAD_HEADER_SIZE = 128;
const JPEG_SIZE_POSITION = 4;
const PADDING_SIZE_POSITION = 7;

class SonyCamera extends EventEmitter {
  debug = false;

  url = '192.168.122.1';
  port = 8080;
  path = '/sony/camera';
  method = 'old';

  rpcReq = {
    id: 1,
    version: '1.0',
    method: '',
    params: [],
  };

  params = {};
  status: Status = 'UNKNOWN';
  photosRemaining = 0;

  ready = false;
  connecting = false;
  connected = false;
  eventPending = false;

  availableApiList = [];

  constructor({ url, port, path, debug }: { url?: string; port?: number; path?: string; debug?: boolean }) {
    super();
    this.url = url || '192.168.122.1';
    this.port = port || 8080;
    this.path = path || '/sony/camera';

    this.debug = debug || false;
  }

  private debugLog(...args: unknown[]) {
    if (this.debug) {
      console.debug('[SonyCamera:debug] :', ...args);
    }
  }

  private log(...args: unknown[]) {
    console.log('[SonyCamera:log] :', ...args);
  }

  private getAppVersion(callback?: Callback<string>) {
    this.call<unknown[]>('getApplicationInfo', null, (error, response) => {
      this.debugLog('getAppVersion', error, response);
      if (error) {
        return callback?.(error);
      }
      if (!response) {
        return callback?.(new Error('No response'));
      }
      if (response.length > 1) {
        return callback?.(null, response[1] as string);
      }
    });
  }

  processEvents(waitForChange = false, callback?: Callback<never>) {
    this.eventPending = true;
    this.call<{ type: string; [key: string]: unknown }[]>('getEvent', [waitForChange], (error, response) => {
      this.eventPending = false;
      this.debugLog('getEvent', error, response);
      if (error) {
        return callback?.(error);
      }

      response.forEach((event) => {
        let eventItem = event;

        if (Array.isArray(event)) {
          if (event.length === 0) {
            return;
          }
          eventItem = {
            type: event[0].type,
            events: event,
          };
        }

        if (!eventItem) return;

        if (eventItem.type === 'cameraStatus') {
          const { cameraStatus } = eventItem;
          this.status = cameraStatus as Status;

          if (this.status !== cameraStatus) {
            this.debugLog('cameraStatus', cameraStatus);
            this.emit('cameraStatus', cameraStatus);
          }

          if (this.status === 'NotReady') {
            this.connected = false;
            this.log('disconnected, trying to reconnect');
            setTimeout(this.connect, 2.5 * SECOND);
            return;
          }

          if (this.status === 'IDLE') {
            this.ready = true;
            this.emit('ready');
            return;
          }

          if (this.status === 'UNKNOWN') {
            this.ready = false;
            return;
          }

          this.log('unexpected cameraStatus', cameraStatus);
          callback?.(new Error(`unexpected cameraStatus ${cameraStatus}`));
          return;
        }

        if (eventItem.type === 'storageInformation') {
          const { events: storageInfomations } = eventItem;
          (storageInfomations as { numberOfRecordableImages: number }[]).forEach((storageInfomation) => {
            this.photosRemaining = storageInfomation.numberOfRecordableImages || 0;
          });
          return;
        }

        if (eventItem.type == 'availableApiList') {
          this.availableApiList = (eventItem.names as string[]) ?? [];
          return;
        }

        if (eventItem[`${eventItem.type}Candidates`]) {
          const { type } = eventItem;
          const oldVal = this.params[type]?.current;
          this.params[type] = {
            current: eventItem['current' + type.charAt(0).toUpperCase() + type.slice(1)],
            available: eventItem[type + 'Candidates'],
          };
          if (oldVal !== this.params[type].current) {
            this.emit('update', type, this.params[type]);
          }
          return;
        }

        this.debugLog('unhandled event', eventItem);
      });
    });
  }

  private call<Response>(method, params: unknown[], callback?: Callback<Response>) {
    this.rpcReq.method = method;
    this.rpcReq.params = params || [];

    const body = JSON.stringify(this.rpcReq);
    axios
      .post(`http://${this.url}:${this.port}${this.path}`, body, {
        timeout: 15 * SECOND,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
        },
      })
      .then((response) => {
        const { result, error } = response.data;
        this.debugLog('call', method, params, error, result);
        if (!error) {
          callback?.(null, result);
          return;
        }

        if (error[0] == 1 && method === 'getEvent') {
          this.call(method, params, callback);
          return;
        }

        callback?.(error);
      })
      .catch((error) => {
        if (error.code) {
          this.log('network appears to be disconnected', error.message);
          this.emit('disconnected');
        }
        callback?.(error);
      });
  }

  connect(callback?: Callback<void>) {
    if (this.connecting) {
      return callback?.(new Error('Already trying to connect'));
    }
    this.log('connecting to camera');
    this.connecting = true;
    this.getAppVersion((error, version) => {
      this.debugLog('getAppVersion', error, version);

      if (error) {
        this.connecting = false;
        callback?.(error);
        return;
      }

      if (lt(version, MIN_VERSION)) {
        callback?.(
          new Error(
            `Could not connect to camera -- remote control application must be updated (currently installed: ${version}, should be ${MIN_VERSION} or newer)`,
          ),
        );
        return;
      }

      this.call('startRecMode', null, (error) => {
        if (error || this.connected) {
          this.connecting = false;
          this.debugLog('error while startRecMode', error);
          callback?.(error);
          return;
        }

        this.connected = true;
        const checkEvents = (error?: Error) => {
          if (error) {
            setTimeout(checkEvents, 5000);
            return;
          }

          if (this.connected) {
            this.processEvents(true, checkEvents);
            return;
          }

          this.log('disconnected, stopping event poll');
          return;
        };

        this.processEvents(false, () => {
          this.connecting = false;
          callback?.(error);
          checkEvents();
        });
      });
    });
  }

  disconnect(callback?: Callback<void>) {
    this.call('stopRecMode', null, (error) => {
      this.debugLog('stopRecMode', error);
      if (!error) {
        this.connected = false;
      }
      callback?.(error);
    });
  }

  startViewfinder() {
    this.call('startLiveview', null, (error, response) => {
      this.debugLog('startLiveview', error, response);
      const liveViewUrl = response[0];

      let jpegSize = 0;
      let paddingSize = 0;
      let bufferIndex = 0;

      const req = request(liveViewUrl, (response) => {
        let imageBuffer;

        let buffer = Buffer.alloc ? Buffer.alloc(0) : new Buffer(0);

        response.on('data', (chunk) => {
          if (jpegSize === 0) {
            buffer = Buffer.concat([buffer, chunk]);

            if (buffer.length < COMMON_HEADER_SIZE + PAYLOAD_HEADER_SIZE) {
              return;
            }

            jpegSize =
              buffer.readUInt8(COMMON_HEADER_SIZE + JPEG_SIZE_POSITION) * 65536 +
              buffer.readUInt16BE(COMMON_HEADER_SIZE + JPEG_SIZE_POSITION + 1);

            imageBuffer = Buffer.alloc(jpegSize);

            paddingSize = buffer.readUInt8(COMMON_HEADER_SIZE + PADDING_SIZE_POSITION);

            buffer = buffer.slice(8 + 128);
            if (buffer.length == 0) {
              return;
            }

            buffer.copy(imageBuffer, bufferIndex, 0, buffer.length);
            bufferIndex += buffer.length;
            return;
          }

          chunk.copy(imageBuffer, bufferIndex, 0, chunk.length);
          bufferIndex += chunk.length;

          if (chunk.length < jpegSize) {
            jpegSize -= chunk.length;
            return;
          }

          this.emit('liveviewJpeg', imageBuffer);
          buffer = chunk.slice(jpegSize + paddingSize);
          jpegSize = 0;
          bufferIndex = 0;
        });

        response.on('end', () => {
          this.debugLog('End');
        });

        response.on('close', () => {
          this.debugLog('Close');
        });
      }).on('error', (error) => {
        this.debugLog('Error: ', error);
      });

      req.end();
    });
  }

  stopViewfinder(callback?: Callback<void>) {
    this.call('stopLiveview', null, callback);
  }

  capture(
    enableDoubleCallback: Callback<string> | boolean = false,
    _callback?: (error: Error, photoName: string, imageBuffer: Buffer) => void,
  ) {
    let callback: ((error: Error, photoName?: string, imageBuffer?: Buffer) => void) | undefined = _callback;
    if (!callback && typeof enableDoubleCallback == 'function') {
      callback = enableDoubleCallback;
      enableDoubleCallback = false;
    }
    if (this.status != 'IDLE') {
      return callback?.(new Error('camera not ready'));
    }
    this.ready = false;

    const handleActTakePicture = (error: Error, response: unknown) => {
      this.debugLog('actTakePicture', error, response);

      if (error) {
        if (error[0] === 40403) {
          this.call('awaitTakePicture', null, handleActTakePicture);
          return;
        }
        callback?.(error);
        return;
      }

      const url = response[0][0];

      const parts = url.split('?')[0].split('/');
      const photoName = parts[parts.length - 1];
      this.debugLog('photoName', photoName);

      if (enableDoubleCallback) {
        callback?.(null, photoName);
      }

      axios
        .get(url, { responseType: 'arraybuffer' })
        .then((response) => {
          if (response.status !== 200) {
            callback?.(new Error(`request failed, statusCode : ${response.status}`));
            return;
          }

          callback?.(null, photoName, Buffer.concat([Buffer.from(response.data)]));
        })
        .catch((error) => {
          this.debugLog('error while get photo', error);
          callback?.(error);
        });
    };

    this.call('actTakePicture', null, handleActTakePicture);
  }

  zoomIn(callback?: Callback<ReturnType<typeof this.call>>) {
    this.call('actZoom', ['in', 'start'], callback);
  }

  zoomOut(callback?: Callback<ReturnType<typeof this.call>>) {
    this.call('actZoom', ['out', 'start'], callback);
  }

  set(param: string, value, callback?: Callback<void>) {
    if (this.status != 'IDLE') {
      callback?.(new Error('camera not ready'));
      return;
    }

    const action = `set${param.charAt(0).toUpperCase()}${param.slice(1)}`;
    if (this.availableApiList.indexOf(action) === -1 || !this.params[param]) {
      callback?.(new Error('param not available'));
      return;
    }

    if (this.params[param].available.indexOf(value) === -1) {
      callback?.(new Error('value not available'));
      return;
    }

    this.call(action, [value], callback);
  }
}

export default SonyCamera;
