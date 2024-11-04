import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [musicName, setMusicName] = useState<string>('');
  const [recognizedAudioURL, setRecognizedAudioURL] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setMusicName(''); // 清除之前的音乐名称
      setRecognizedAudioURL(null); // 清除之前的识别结果
    }
  };

  const handleSearch = () => {
    if (selectedFile) {
      setMusicName("Recognized Music Name: Example Song");
  
      const audioUrl = 'https://aist2010.s3.amazonaws.com/task1.wav?AWSAccessKeyId=AKIAQ3EGSQAXAXG3ELBF&Signature=B5EMN8eZBYTG6xjdA3LaUUW3Ia8%3D&Expires=1761923151';
      setRecognizedAudioURL(audioUrl);
      console.log("Recognized Audio URL:", audioUrl);
    }
  };

  return (
    <div className="container">
      <h1>Music Recognition App</h1>
      
      {/* 图片区域 */}
      <div className="image-area">
        <p>Image Area</p>
      </div>

      {/* 上传音乐的链接键 */}
      <input
        type="file"
        accept="audio/*"
        style={{ display: 'none' }}
        id="file-upload"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="upload-button">
        Upload Music
      </label>

      {/* 搜索按钮 */}
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>

      {/* 显示识别到的音乐名字 */}
      {musicName && (
        <div className="music-name">
          {musicName}
        </div>
      )}

      {/* 音频播放器（播放识别出来的音频） */}
      {recognizedAudioURL && (
        <div className="audio-player">
          <h2>Your recognized music...</h2>
          <audio controls src={recognizedAudioURL} style={{ width: '100%', borderRadius: '8px', backgroundColor: '#f5f5f5', display: 'block' }}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default App;


