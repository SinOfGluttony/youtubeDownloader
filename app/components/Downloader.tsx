import React, { useState } from 'react';
import { Circle } from 'rc-progress';
import listeners from './listeners';

type Props = {
  updateUrl: (value: any) => void;
  updateFormat: (value: any) => void;
  updatePath: (value: any) => void;
};

export default function Downloader(props: Props) {
  const { updateUrl, updateFormat, updatePath } = props;
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [buttonText, setButtonText] = useState('Download');
  listeners(setErrorMessage, setInputValue, setDownloadProgress, setButtonText);

  const handleRadioChange = (e: any) => {
    const { value } = e.target;
    updateFormat(value);
  };

  const updateURL = (url: string) => {
    updateUrl(url);
    setInputValue(url);
  };

  const handleUrlChange = (e: any) => {
    const { value } = e.target;
    updateURL(value);
  };

  const paste = () => {
    const { clipboard } = require('electron').remote;
    const url = clipboard.readText();
    updateURL(url);
  };

  const handleSubmit = async () => {
    const { dialog } = require('electron').remote;
    const path = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    setButtonText('Uploading');
    if (!path.canceled) {
      updatePath(path);
    }
  };
  return (
    <div className="container">
      <label>
        <input
          value={inputValue}
          onClick={paste}
          type="text"
          placeholder="Click here to paste the youtube URL here"
          onChange={handleUrlChange}
        />
      </label>

      <div className="format">
        <h4>Video</h4>
        <div className="formatBloc">
          <div>
            <input
              type="radio"
              id="MP4highest"
              name="format"
              value="mp4 highest"
              onChange={handleRadioChange}
            />
            <label htmlFor="MP4highest">
              <span />
              MP4 Highest
            </label>
          </div>

          <div>
            <input
              type="radio"
              id="MP4lowest"
              name="format"
              value="mp4 lowest"
              onChange={handleRadioChange}
            />
            <label htmlFor="MP4lowest">
              <span />
              MP4 Lowest
            </label>
          </div>
        </div>
        <h4>Audio Only</h4>

        <div className="formatBloc">
          <div>
            <input
              type="radio"
              id="MP3highest"
              name="format"
              value="mp3 highest"
              onChange={handleRadioChange}
            />
            <label htmlFor="MP3highest">
              <span />
              MP3 Highest
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="MP3lowest"
              name="format"
              value="mp3 lowest"
              onChange={handleRadioChange}
            />
            <label htmlFor="MP3lowest">
              <span />
              MP3 Lowest
            </label>
          </div>
        </div>
      </div>

      <div className="circleContainer">
        <Circle
          onClick={handleSubmit}
          id="circle"
          style={{ marginTop: 20 }}
          percent={downloadProgress}
          strokeWidth={3}
          strokeColor="#DC493A"
        />
        <h2 onClick={handleSubmit} id="submit">
          {buttonText}
        </h2>
      </div>
      <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>
    </div>
  );
}
