'use client';

import { useState, useEffect } from 'react';

interface ApiRoute {
  path: string;
  methods: string[];
  description: string;
  params?: string[];
  queryParams?: string[];
}

interface ApiTree {
  [key: string]: {
    name: string;
    children: ApiTree;
    methods: string[];
  };
}

export default function ApiExplorer() {
  const [apiRoutes, setApiRoutes] = useState<ApiRoute[]>([]);
  const [apiTree, setApiTree] = useState<ApiTree>({});
  const [selectedRoute, setSelectedRoute] = useState<ApiRoute | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('GET');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStructure, setLoadingStructure] = useState(true);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState<string>('');

  useEffect(() => {
    fetchApiStructure();
    // Refresh structure every 5 seconds
    const interval = setInterval(fetchApiStructure, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchApiStructure = async () => {
    try {
      const res = await fetch('/api/structure');
      if (res.ok) {
        const data = await res.json();
        setApiRoutes(data.routes);
        setApiTree(data.tree);
      }
    } catch (error) {
      console.error('Failed to fetch API structure:', error);
    } finally {
      setLoadingStructure(false);
    }
  };

  const executeRequest = async () => {
    if (!selectedRoute) return;

    setLoading(true);
    setResponse(null);

    try {
      let url = selectedRoute.path;
      
      // Replace path parameters
      if (selectedRoute.params) {
        selectedRoute.params.forEach(param => {
          url = url.replace(`[${param}]`, queryParams[param] || '1');
        });
      }

      // Add query parameters
      const queryString = Object.entries(queryParams)
        .filter(([key, value]) => value && !selectedRoute.params?.includes(key))
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      if (queryString) {
        url += '?' + queryString;
      }

      const options: RequestInit = {
        method: selectedMethod,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (selectedMethod !== 'GET' && requestBody) {
        try {
          options.body = JSON.stringify(JSON.parse(requestBody));
        } catch {
          options.body = requestBody;
        }
      }

      const res = await fetch(url, options);
      const data = await res.json();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: data,
        url: url
      });
    } catch (error) {
      setResponse({
        error: error instanceof Error ? error.message : 'Failed to fetch',
        url: selectedRoute.path
      });
    } finally {
      setLoading(false);
    }
  };

  const renderApiTree = (tree: ApiTree, level = 0): React.ReactNode => {
    return Object.entries(tree).map(([key, node]) => (
      <div key={key} style={{ paddingLeft: `${level * 20}px` }} className="text-gray-900 mb-2">
        <div className="flex items-center gap-3">
          <span className="font-medium">{level === 0 ? '📁' : '├─ 📁'} {node.name}</span>
          {node.methods.length > 0 && (
            <div className="flex gap-2">
              {node.methods.map(method => (
                <span key={method} className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded-lg font-semibold">
                  {method}
                </span>
              ))}
            </div>
          )}
        </div>
        {Object.keys(node.children).length > 0 && renderApiTree(node.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Explorer</h1>
          <p className="text-gray-600">
            Interactive REST API documentation and testing tool • 
            <span className="text-green-600"> Live updating</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Routes List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Available Endpoints</h2>
                {loadingStructure && (
                  <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              <div className="space-y-3">
                {apiRoutes.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedRoute(route);
                      setSelectedMethod(route.methods[0] || 'GET');
                      setQueryParams({});
                      setRequestBody('');
                      setResponse(null);
                    }}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      selectedRoute?.path === route.path
                        ? 'bg-blue-50 border-blue-500 border-2'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      {route.methods.map(method => (
                        <span key={method} className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                          method === 'GET' ? 'bg-green-100 text-green-800' :
                          method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          method === 'DELETE' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {method}
                        </span>
                      ))}
                      <span className="font-mono text-base text-gray-900 flex-1 font-medium">{route.path}</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{route.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* API Structure */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">API Structure</h2>
              <div className="font-mono text-base">
                {Object.keys(apiTree).length > 0 ? (
                  renderApiTree(apiTree)
                ) : (
                  <p className="text-gray-600 text-base">Loading structure...</p>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-6 font-medium">
                This structure updates automatically as new endpoints are added.
              </p>
            </div>
          </div>

          {/* Request Builder & Response */}
          <div className="lg:col-span-2">
            {selectedRoute ? (
              <div className="space-y-6">
                {/* Request Builder */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900">Request Builder</h2>
                  
                  <div className="mb-6">
                    <label className="block text-base font-semibold text-gray-900 mb-3">Method & Endpoint</label>
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedMethod}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-base focus:border-blue-500 focus:outline-none"
                      >
                        {selectedRoute.methods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={selectedRoute.path}
                        disabled
                        className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg font-mono text-base text-gray-700"
                      />
                    </div>
                  </div>

                  {/* Path Parameters */}
                  {selectedRoute.params && selectedRoute.params.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-base font-semibold text-gray-900 mb-3">Path Parameters</label>
                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        {selectedRoute.params.map(param => (
                          <div key={param} className="flex items-center gap-3">
                            <span className="font-mono text-base font-medium text-gray-900 w-28">{param}:</span>
                            <input
                              type="text"
                              value={queryParams[param] || ''}
                              onChange={(e) => setQueryParams({...queryParams, [param]: e.target.value})}
                              placeholder={`Enter ${param}`}
                              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Query Parameters */}
                  {selectedRoute.queryParams && selectedRoute.queryParams.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-base font-semibold text-gray-900 mb-3">Query Parameters</label>
                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        {selectedRoute.queryParams.map(param => (
                          <div key={param} className="flex items-center gap-3">
                            <span className="font-mono text-base font-medium text-gray-900 w-32">{param}:</span>
                            <input
                              type="text"
                              value={queryParams[param] || ''}
                              onChange={(e) => setQueryParams({...queryParams, [param]: e.target.value})}
                              placeholder={`Optional`}
                              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none placeholder-gray-400"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Request Body */}
                  {selectedMethod !== 'GET' && (
                    <div className="mb-6">
                      <label className="block text-base font-semibold text-gray-900 mb-3">Request Body (JSON)</label>
                      <textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        placeholder='{"key": "value"}'
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-base focus:border-blue-500 focus:outline-none placeholder-gray-400"
                        rows={6}
                      />
                    </div>
                  )}

                  <button
                    onClick={executeRequest}
                    disabled={loading}
                    className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-semibold text-base"
                  >
                    {loading ? 'Sending Request...' : 'Send Request'}
                  </button>
                </div>

                {/* Response */}
                {response && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900">Response</h2>
                    
                    {response.error ? (
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                        <p className="text-red-800 font-bold text-lg mb-2">Error</p>
                        <p className="text-red-700 text-base">{response.error}</p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-6">
                          <div className="flex items-center gap-4 text-base flex-wrap">
                            <span className="font-bold text-gray-900">Status:</span>
                            <span className={`px-3 py-2 rounded-lg font-semibold ${
                              response.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {response.status} {response.statusText}
                            </span>
                            <span className="text-gray-700 font-medium">URL: {response.url}</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
                          <pre className="text-sm leading-relaxed">
                            {JSON.stringify(response.data, null, 2)}
                          </pre>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <p className="text-gray-600">Select an endpoint to start testing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}