import { ToastPreset, useToast } from '@ch-four-cuts/bezier-design-system';
import { trpc } from '#/utils/trpc';

export function useAppSettingsQuery() {
  const { addToast } = useToast();

  const printerList = trpc.settings.printerList.useQuery();
  const applyConfig = trpc.settings.applyConfig.useMutation({
    onMutate(formState) {
      if (!formState.printerType) {
        throw new Error('프린터 연결 방식을 선택해주세요.');
      }
      if (formState.printerType === 'NETWORK' && (!formState.printerIp || !formState.printerPort)) {
        throw new Error('프린터 IP와 포트를 입력해주세요.');
      }
      if (formState.printerType === 'USB' && !formState.printerName) {
        throw new Error('프린터를 선택해주세요.');
      }
      return formState;
    },
    onError(error) {
      addToast(error.data?.code || error.message, { preset: ToastPreset.Error });
    },
    onSuccess() {
      window.location.reload();
    },
  });

  return { printerList, applyConfig };
}
