import { useQuery } from '@tanstack/react-query';

export const useCustomQuery = ({ queryFn, queryKey, ...queryProps }) =>
  useQuery({ queryFn, queryKey, ...queryProps });

export default useCustomQuery;
