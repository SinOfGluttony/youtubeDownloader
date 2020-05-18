export const UPDATE_PATH = 'UPDATE_PATH';

export function updatePath(path: string) {
  return {
    type: UPDATE_PATH,
    path
  };
}
