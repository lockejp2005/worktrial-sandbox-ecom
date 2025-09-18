'use client';

import { useState, useEffect } from 'react';

interface FileInfo {
  name: string;
  size: number;
  modified: string;
  recordCount: number;
}

export default function DataBrowser() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fileData, setFileData] = useState<any>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set([
    '.address', '.preferences', '.customerScore', '.browsingBehavior'
  ]));

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      fetchFileData(selectedFile);
    }
  }, [selectedFile]);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/data');
      const data = await res.json();
      setFiles(data.files || []);
      if (data.files?.length > 0 && !selectedFile) {
        setSelectedFile(data.files[0].name);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFileData = async (fileName: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/data?file=${fileName}`);
      const data = await res.json();
      setFileData(data);
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        setSelectedRecord(data.data[0]);
      } else if (data.data && !Array.isArray(data.data)) {
        setSelectedRecord(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch file data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const togglePath = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const renderValue = (value: any, path: string = '', depth: number = 0): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">null</span>;
    }

    if (typeof value === 'boolean') {
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? '✓ true' : '✗ false'}
        </span>
      );
    }

    if (typeof value === 'number') {
      // Format currency for common price/value fields
      const key = path.split('.').pop() || '';
      if (key.match(/price|cost|value|amount|total|spent/i)) {
        return (
          <span className="font-mono text-green-700 font-medium">
            ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </span>
        );
      }
      return <span className="font-mono text-blue-600">{value.toLocaleString()}</span>;
    }

    if (typeof value === 'string') {
      // Date detection and formatting
      if (value.match(/^\d{4}-\d{2}-\d{2}(T|\s)/)) {
        const date = new Date(value);
        return (
          <span className="text-purple-600" title={value}>
            📅 {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </span>
        );
      }
      
      // Email detection
      if (value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return <span className="text-blue-600 underline">✉️ {value}</span>;
      }
      
      // Phone detection
      if (value.match(/^\+?\d[\d\s-().]+$/)) {
        return <span className="text-gray-700">📞 {value}</span>;
      }
      
      // Status values
      const key = path.split('.').pop() || '';
      if (key.match(/status|state|tier/i)) {
        const colors: Record<string, string> = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-gray-100 text-gray-800',
          enabled: 'bg-green-100 text-green-800',
          disabled: 'bg-red-100 text-red-800',
          platinum: 'bg-purple-100 text-purple-800',
          gold: 'bg-yellow-100 text-yellow-800',
          silver: 'bg-gray-100 text-gray-800',
          bronze: 'bg-orange-100 text-orange-800'
        };
        const color = colors[value.toLowerCase()] || 'bg-gray-100 text-gray-800';
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
            {value}
          </span>
        );
      }
      
      return <span className="text-gray-800">{value}</span>;
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedPaths.has(path);
      const key = path.split('.').pop() || '';
      
      // Special handling for purchase history
      if (key === 'purchaseHistory') {
        return (
          <div className="space-y-2">
            <button
              onClick={() => togglePath(path)}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1"
            >
              <span>{isExpanded ? '▼' : '▶'}</span>
              <span className="text-blue-600">{value.length} purchases</span>
            </button>
            {isExpanded && (
              <div className="space-y-2 ml-4">
                {value.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded p-3 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{item.orderId || `Order ${index + 1}`}</span>
                      <span className="text-green-700 font-medium">${item.total || item.totalAmount || 0}</span>
                    </div>
                    {renderValue(item, `${path}[${index}]`, depth + 1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
      
      return (
        <div className="inline-block">
          <button
            onClick={() => togglePath(path)}
            className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center gap-1"
          >
            <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
            <span className="text-blue-600">[{value.length} items]</span>
          </button>
          {isExpanded && (
            <div className="ml-6 mt-2 space-y-1">
              {value.map((item, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-3 py-1">
                  <span className="text-gray-500 text-xs font-mono mr-2">{index}:</span>
                  {renderValue(item, `${path}[${index}]`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      const isExpanded = expandedPaths.has(path);
      const key = path.split('.').pop() || '';
      
      if (depth === 0) {
        return (
          <div className="space-y-4">
            {keys.map((key) => (
              <div key={key} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-purple-600">▸</span>
                  {key}:
                </div>
                <div className="ml-6">
                  {renderValue(value[key], `${path}.${key}`, depth + 1)}
                </div>
              </div>
            ))}
          </div>
        );
      }

      // Special formatting for address objects
      if (key === 'address' && value.street && value.city) {
        return (
          <div className="inline-block">
            <button
              onClick={() => togglePath(path)}
              className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1"
            >
              <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
              <span className="text-gray-700">📍 {value.city}, {value.state || value.province}</span>
            </button>
            {isExpanded && (
              <div className="ml-6 mt-2 bg-gray-50 rounded p-3 space-y-1">
                {keys.map((key) => (
                  <div key={key}>
                    <span className="text-gray-600 text-sm">{key}:</span>{' '}
                    <span className="text-gray-800">{value[key]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      // Show a preview of object contents
      const preview = keys.slice(0, 2).map(k => `${k}: ${
        typeof value[k] === 'string' ? value[k].substring(0, 20) + (value[k].length > 20 ? '...' : '') : 
        typeof value[k] === 'number' ? value[k] : 
        typeof value[k] === 'object' ? '{...}' : value[k]
      }`).join(', ');

      return (
        <div className="inline-block">
          <button
            onClick={() => togglePath(path)}
            className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center gap-1"
          >
            <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
            <span className="text-blue-600">{keys.length} fields</span>
            {!isExpanded && preview && (
              <span className="text-gray-500 text-xs ml-2">({preview}{keys.length > 2 ? ', ...' : ''})</span>
            )}
          </button>
          {isExpanded && (
            <div className="ml-6 mt-2 space-y-2">
              {keys.map((k) => (
                <div key={k} className="flex items-start gap-2">
                  <span className="text-purple-700 font-medium min-w-fit">{k}:</span>
                  <div className="flex-1">
                    {renderValue(value[k], `${path}.${k}`, depth + 1)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <span>{String(value)}</span>;
  };

  const getFilteredData = () => {
    if (!fileData?.data || !searchTerm) return fileData?.data;
    
    const term = searchTerm.toLowerCase();
    const data = fileData.data;
    
    if (Array.isArray(data)) {
      return data.filter(item => 
        JSON.stringify(item).toLowerCase().includes(term)
      );
    }
    
    return data;
  };

  const filteredData = getFilteredData();

  if (loading && files.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading data browser...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Browser</h1>
              <p className="text-sm text-gray-600 mt-1">
                Browse and inspect JSON data files
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {files.length} data {files.length === 1 ? 'source' : 'sources'} available
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* File List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">Data Sources</h2>
              </div>
              <div className="p-2">
                {files.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFile(file.name)}
                    className={`w-full text-left p-3 rounded-md mb-2 transition-colors ${
                      selectedFile === file.name 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {file.name.replace('.json', '')}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {file.recordCount} records
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Data Display Area */}
          <div className="lg:col-span-3">
            {fileData && (
              <div className="bg-white rounded-lg shadow-md">
                {/* File Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedFile.replace('.json', '')}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {fileData.recordCount} {fileData.isArray ? 'records' : 'fields'}
                      </p>
                    </div>
                    {fileData.isArray && (
                      <div className="w-64">
                        <input
                          type="text"
                          placeholder="Search records..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  {/* Records List */}
                  {fileData.isArray && (
                    <div className="lg:col-span-1 border-r border-gray-200">
                      <div className="p-2 max-h-[700px] overflow-y-auto">
                        {(filteredData || []).map((record: any, index: number) => {
                          let displayName = record.name || record.title || record.email || record.id || `Record ${index + 1}`;
                          
                          // Special handling for customer names
                          if (record.firstName && record.lastName) {
                            displayName = `${record.firstName} ${record.lastName}`;
                          }
                          
                          return (
                            <button
                              key={index}
                              onClick={() => setSelectedRecord(record)}
                              className={`w-full text-left p-3 rounded mb-2 transition-colors ${
                                selectedRecord === record 
                                  ? 'bg-blue-50 border border-blue-200' 
                                  : 'hover:bg-gray-50 border border-gray-100'
                              }`}
                            >
                              <div className="font-medium text-gray-900 truncate">
                                {displayName}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {Object.keys(record).length} fields
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Record Details */}
                  <div className={`${fileData.isArray ? 'lg:col-span-2' : 'lg:col-span-3'} p-6`}>
                    {selectedRecord ? (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800 mb-4">
                          {fileData.isArray ? 'Record Details' : 'Data Structure'}
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                          {renderValue(selectedRecord)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-12">
                        Select a record to view details
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}