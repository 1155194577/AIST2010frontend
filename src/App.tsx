import React, { useState } from 'react';
import './App.css'; // 引入样式

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [musicName, setMusicName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSearch = () => {
    if (selectedFile) {
      setMusicName("Recognized Music Name: Example Song");
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
    </div>
  );
};

export default App;

