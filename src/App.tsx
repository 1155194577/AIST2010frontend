import React, { useState } from 'react';
import './App.css';
import { getQueryResult} from './service/server';
// 定义正确的接口结构

interface Match {
  id: string;
  score: number;
  values: any[]; // 如果 values 是数组且类型未知，可以使用 any[]
  metadata: {
    audioUrl: string;
  };
}

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<Match[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setResults([]); // Clear previous results when a new file is uploaded
    }
  };
 
  const handleSearch = async () => {
    if (!selectedFile) {
      console.log("请先上传一个文件");
      return;
    }
    try {
      const simulatedResponse = await getQueryResult(
        {
          values: [1, 2, 3, 4, 5, 6],
          top_k: 5,
          include_metadata: true,
          include_values: false,
        }
      )
      console.log("sim data:", simulatedResponse);
      setResults(simulatedResponse.data.matches);
    } catch (error) {
      console.error('Error during search:', error);
    }
    // 使用新的模拟数据进行测试
  
    // const simulatedResponse = {
    //   matches: [
    //     {
    //       id: "song2",
    //       score: 315.312469,
    //       values: [],
    //       metadata: {
    //         audioUrl: "https://aist2010.s3.amazonaws.com/task1.wav?AWSAccessKeyId=AKIAQ3EGSQAXAXG3ELBF&Signature=B5EMN8eZBYTG6xjdA3LaUUW3Ia8%3D&Expires=1761923151",
    //       },
    //     },
    //     {
    //       id: "song1",
    //       score: 155.427185,
    //       values: [],
    //       metadata: {
    //         audioUrl: "https://aist2010.s3.amazonaws.com/task1.wav?AWSAccessKeyId=AKIAQ3EGSQAXAXG3ELBF&Signature=B5EMN8eZBYTG6xjdA3LaUUW3Ia8%3D&Expires=1761923151",
    //       },
    //     },
    //   ],
    //   namespace: "embedding",
    //   usage: {
    //     read_units: 6,
    //   },
    // };
  };

  return (
    <div className="container">
      <h1>Music Search Engine</h1>

      <div className="image-area">
        <img
          src="/flowChart.jpeg"
          alt="Image Area"
          style={{ width: '400px', height: '300px', borderRadius: '8px' }}
        />
      </div>

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

      <div className="results">
        <h2>Search Results</h2>
        {results.length === 0 && <p>No results found.</p>}
        {results.map((result) => (
          <div key={result.id} className="result-item">
            <p><strong>Song ID:</strong> {result.id}</p>
            <p><strong>Score:</strong> {result.score.toFixed(2)}</p>
            {/* 从 metadata 中提取 audioUrl */}
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


