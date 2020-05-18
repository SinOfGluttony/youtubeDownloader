export const UPDATE_URL = 'UPDATE_URL';

export function updateUrl(url: string) {
  return {
    type: UPDATE_URL,
    url
  };
}
