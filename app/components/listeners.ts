const { ipcRenderer } = require('electron');

export default function listeners(setErrorMessage, setInputValue,setDownloadProgress, setButtonText ) {
  ipcRenderer.on('error', (event, err) => {
    setErrorMessage(err);
  });

  ipcRenderer.on('input', (event, message) => {
    setInputValue(message);
  });

  ipcRenderer.on('downloadProgress', (event, progress) => {
    const cleanProgressInPercentages = Math.floor(progress); // Without decimal point
    setDownloadProgress(cleanProgressInPercentages);
    setButtonText(cleanProgressInPercentages.toString().concat(' %'));
    if (cleanProgressInPercentages === 100) setButtonText('Success !');
  });
}
