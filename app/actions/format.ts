export const UPDATE_FORMAT = 'UPDATE_FORMAT';

export function updateFormat(format: string) {
  return {
    type: UPDATE_FORMAT,
    format
  };
}
