import { ToastPreset, useToast } from '@ch-four-cuts/bezier-design-system';
import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { trpc } from '#/utils/trpc';

export function useSettingsQuery() {
  const { addToast } = useToast();

  // 카메라
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');

  const cameraConnected = trpc.camera.connected.useQuery();
  const cameraConnect = trpc.camera.connect.useMutation({
    onMutate() {
      if (cameraConnected.data) {
        throw new Error('카메라가 이미 연결되어 있습니다.');
      }
    },
    onError(error) {
      addToast(error.message, { preset: ToastPreset.Error });
    },
  });
  const cameraDisconnect = trpc.camera.disconnect.useMutation({
    onMutate() {
      if (!cameraConnected.data) {
        throw new Error('카메라가 연결되어있지 않습니다.');
      }
    },
    onError(error) {
      addToast(error.message, { preset: ToastPreset.Error });
    },
    onSuccess() {
      setPreviewDataUrl('');
    },
  });
  const cameraEnablePreview = trpc.camera.enablePreview.useMutation({
    onMutate() {
      if (!cameraConnected.data) {
        throw new Error('카메라가 연결되어있지 않습니다.');
      }
    },
    onError(error) {
      addToast(error.message, { preset: ToastPreset.Error });
    },
  });
  const cameraDisablePreview = trpc.camera.disablePreview.useMutation({
    onMutate() {
      if (!cameraConnected.data) {
        throw new Error('카메라가 연결되어있지 않습니다.');
      }
    },
    onError(error) {
      addToast(error.message, { preset: ToastPreset.Error });
    },
    onSuccess() {
      setPreviewDataUrl('');
    },
  });

  trpc.camera.preview.useSubscription(undefined, {
    enabled: !!cameraConnected.data,
    onData: _.throttle(setPreviewDataUrl, 100),
  });

  // 세션
  const [sessionId, setSessionId] = useState<string>('');

  const sessionList = trpc.session.sessionList.useQuery();
  const sessionDetail = trpc.session.sessionDetail.useQuery({ sessionId }, { enabled: !!sessionId });

  // 프린터
  const printerConnected = trpc.printer.connected.useQuery();
  const printerConnect = trpc.printer.connect.useMutation({
    onMutate() {
      if (printerConnected.data) {
        throw new Error('프린터가 이미 연결되어 있습니다.');
      }
    },
    onError(error) {
      addToast(error.message, { preset: ToastPreset.Error });
    },
  });
  const printerCount = trpc.session.printCount.useQuery();

  // 강제인쇄
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const forcePrintSession = trpc.printer.frame.useMutation({
    onMutate() {
      if (!printerConnected.data) {
        throw new Error('프린터가 연결되어있지 않습니다.');
      }
    },
    onError(error) {
      addToast(error.message, { preset: ToastPreset.Error });
    },
  });
  function handleClickThumbnail(image: string) {
    setSelectedImages((prev) => {
      if (prev.includes(image)) {
        return prev.filter((v) => v !== image);
      }
      return [...prev, image];
    });
  }
  const handleForcePrint = useCallback(() => {
    return forcePrintSession.mutate({ sessionId, selectedImages });
  }, [forcePrintSession, selectedImages, sessionId]);
  const handleSetSessionId = useCallback((sessionId: string) => {
    setSessionId(sessionId);
    setSelectedImages([]);
  }, []);

  return useMemo(
    () => ({
      previewDataUrl,

      sessionId,
      handleSetSessionId,

      cameraConnected,
      cameraConnect,
      cameraDisconnect,
      cameraEnablePreview,
      cameraDisablePreview,

      sessionList,
      sessionDetail,

      printerConnect,
      printerConnected,
      printerCount,

      selectedImages,
      handleClickThumbnail,
      handleForcePrint,
    }),
    [
      cameraConnect,
      cameraConnected,
      cameraDisablePreview,
      cameraDisconnect,
      cameraEnablePreview,
      handleForcePrint,
      handleSetSessionId,
      previewDataUrl,
      printerConnect,
      printerConnected,
      printerCount,
      selectedImages,
      sessionDetail,
      sessionId,
      sessionList,
    ],
  );
}
