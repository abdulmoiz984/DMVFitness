import { useMutation } from '@tanstack/react-query';
import { formatBackendErrors } from '../utils';

export const useCustomMutation = ({
  mutationFn,
  mutationKey = null,
  onSuccess,
  onError,
  on422Error,
  ...mutationProps
}) =>
  useMutation({
    mutationKey,
    mutationFn,
    onError: (error, variables, context) => {
      const response = error?.response;
      if (response?.status === 422) {
        const parsedErrors = formatBackendErrors(response.data?.errors);
        on422Error?.(parsedErrors, response.data?.message);
      }
      onError?.(error, variables, context);
    },
    onSuccess: (response, reqData) => {
      onSuccess?.(response, reqData);
    },
    ...mutationProps,
  });

export default useCustomMutation;
