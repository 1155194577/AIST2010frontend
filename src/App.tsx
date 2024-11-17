import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

interface Match {
  id: string;
  score: number;
  values: any[];
  metadata: {
    audioUrl: string;
  };
}

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<Match[]>([]);
  const [topK, setTopK] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setResults([]);
    }
  };

  const handleTopKChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTopK(Number(event.target.value));
  };

  const handleSearch = async () => {
    if (!selectedFile) {
      console.log("请先上传一个文件");
      return;
    }

    try {
      setLoading(true);

      // 1. 上传文件到 embedding API 并获取向量
      const formData = new FormData();
      formData.append('file', selectedFile);

      const embeddingResponse = await axios.post(
        'http://ec2-18-234-78-89.compute-1.amazonaws.com:5000/api/v1/embedding/',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      console.log("Embedding Response:", embeddingResponse.data);
      const embedding = embeddingResponse.data.embedding;

      // 2. 使用返回的向量调用 getQueryResult
      const queryResponse = await axios.post(
        'http://ec2-18-234-78-89.compute-1.amazonaws.com:5000/api/v1/vector/aist2010/embedding/search',
        {
          values: embedding, // 传入 embedding
          top_k: topK,
          include_metadata: true,
          include_values: false,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log("Query Response:", queryResponse.data);
      setResults(queryResponse.data.matches); // 设置结果
    } catch (error) {
      console.error("搜索出错:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Music Recognition App</h1>

      {/* 图片区域 */}
      <div className="image-area">
        <img
          src="public\flowChart.jpeg"
          alt="Image Area"
          style={{ width: '400px', height: '300px', borderRadius: '8px' }}
        />
      </div>

      {/* 操作按钮和下拉框 */}
      <div className="action-controls">
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

        <button className="search-button" onClick={handleSearch}>
          Search
        </button>

        <div className="top-k-selector">
          <label htmlFor="top-k" className="top-k-label">Top-K:</label>
          <select id="top-k" value={topK} onChange={handleTopKChange}>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 搜索结果 */}
      <div className="results">
        <h2>Search Results</h2>
        {results.length === 0 && <p>No results found.</p>}
        {results.map((result) => (
          <div key={result.id} className="result-item">
            <p><strong>Song ID:</strong> {result.id}</p>
            <p><strong>Score:</strong> {result.score.toFixed(2)}</p>
            <audio controls src={result.metadata.audioUrl} style={{ width: '100%', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
