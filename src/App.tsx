import React, { useState, useEffect } from 'react';
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
const namespaceImages: { [key: string]: string } = {
  S: "https://aistimage.s3.amazonaws.com/S.jpeg?AWSAccessKeyId=AKIAQ3EGSQAXKBQHHQR2&Signature=Kwja8yTH0cqbYOaZ2ELIqN5BjQA%3D&Expires=1764122279",
  M: "https://aistimage.s3.amazonaws.com/M.jpeg?AWSAccessKeyId=AKIAQ3EGSQAXKBQHHQR2&Signature=zpBJRA0uN9Y1ovSPab2YvhjPf6I%3D&Expires=1764122279",
  L: "https://aistimage.s3.amazonaws.com/L.jpeg?AWSAccessKeyId=AKIAQ3EGSQAXKBQHHQR2&Signature=yijYBoWfW0X9z2f%2F0h4uzK2fl8U%3D&Expires=1764122279",
  XL: "https://aistimage.s3.amazonaws.com/XL.jpeg?AWSAccessKeyId=AKIAQ3EGSQAXKBQHHQR2&Signature=gXuPqj4%2B%2F7q2qCHhnHIKFJjnb0w%3D&Expires=1764122279",
  XS: "https://aistimage.s3.amazonaws.com/XS.jpeg?AWSAccessKeyId=AKIAQ3EGSQAXKBQHHQR2&Signature=PBR7JmXg0GsGOvNWvMDEn1ghxD8%3D&Expires=1764122279",
};


const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<Match[]>([]);
  const [topK, setTopK] = useState<number>(5);
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [namespace, setNamespace] = useState<string>('embedding'); // 默认 namespace
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNamespaces = async () => {
      try {
        const response = await axios.get(
          'http://ec2-18-234-78-89.compute-1.amazonaws.com:5000/api/v1/indexes/aist2010/stats',
          { headers: { 'accept': 'application/json' } }
        );
        setNamespaces(response.data.namespaces.length > 0 ? response.data.namespaces : ['embedding']);

      } catch (error) {
        console.error('Failed to fetch namespaces:', error);
      }
    };

    fetchNamespaces();
  }, []);

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
      //setLoading(true);

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
        `http://ec2-18-234-78-89.compute-1.amazonaws.com:5000/api/v1/vector/aist2010/${namespace}/search`,
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
      setError('搜索出错，请稍后再试！');
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
          src={namespaceImages[namespace] ||'flowChart.jpeg'}
          alt="Namespace Image"
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

        <button className="search-button" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
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
        <div className="namespace-selector">
          <label htmlFor="namespace-select">Namespace:</label>
          <select
            id="namespace-select"
            value={namespace}
            onChange={(event) => setNamespace(event.target.value)}
          >
            {namespaces.map((ns) => (
              <option key={ns} value={ns}>
                {ns}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
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
