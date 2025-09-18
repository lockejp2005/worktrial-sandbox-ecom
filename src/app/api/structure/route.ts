import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ApiRoute {
  path: string;
  methods: string[];
  description: string;
  params?: string[];
  queryParams?: string[];
}

function scanApiDirectory(dir: string, basePath: string = ''): ApiRoute[] {
  const routes: ApiRoute[] = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Handle dynamic routes
        if (item.startsWith('[') && item.endsWith(']')) {
          const paramName = item.slice(1, -1);
          routes.push(...scanApiDirectory(fullPath, `${basePath}/${item}`).map(route => ({
            ...route,
            params: [...(route.params || []), paramName]
          })));
        } else {
          routes.push(...scanApiDirectory(fullPath, `${basePath}/${item}`));
        }
      } else if (item === 'route.ts' || item === 'route.js') {
        // Read the file to determine methods
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const methods: string[] = [];
        
        // Simple regex to find exported functions
        const methodRegex = /export\s+(?:async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH)/g;
        let match;
        while ((match = methodRegex.exec(fileContent)) !== null) {
          methods.push(match[1]);
        }
        
        if (methods.length > 0) {
          const apiPath = `/api${basePath}`;
          
          // Extract description from comments
          let description = '';
          const descRegex = /\/\/\s*@description\s+(.+)/;
          const descMatch = fileContent.match(descRegex);
          if (descMatch) {
            description = descMatch[1];
          } else {
            // Fallback descriptions based on path
            if (apiPath.includes('products')) {
              if (apiPath.includes('[id]')) {
                description = 'Get a specific product by ID';
              } else if (apiPath.includes('for-you')) {
                description = 'Get personalized product recommendations';
              } else {
                description = 'Get all products with pagination and filtering';
              }
            } else if (apiPath.includes('customers')) {
              description = 'Get all customers with pagination and filtering';
            } else if (apiPath.includes('utils')) {
              description = 'Utility endpoints for various operations';
            } else if (apiPath.includes('data')) {
              description = 'Access raw data files';
            } else {
              description = 'API endpoint';
            }
          }
          
          // Extract query params from code
          let queryParams: string[] = [];
          if (apiPath === '/api/products' && !apiPath.includes('[id]')) {
            queryParams = ['limit', 'offset', 'category', 'tag', 'minPrice', 'maxPrice', 'status', 'search', 'sortBy'];
          } else if (apiPath === '/api/customers') {
            queryParams = ['limit', 'offset', 'email', 'tag', 'search', 'sortBy'];
          }
          
          routes.push({
            path: apiPath,
            methods,
            description,
            queryParams: queryParams.length > 0 ? queryParams : undefined
          });
        }
      }
    }
  } catch (error) {
    console.error('Error scanning directory:', error);
  }
  
  return routes;
}

export async function GET() {
  try {
    const apiDir = path.join(process.cwd(), 'src', 'app', 'api');
    const routes = scanApiDirectory(apiDir);
    
    // Sort routes for better display
    routes.sort((a, b) => {
      // Sort by path segments
      const aSegments = a.path.split('/').length;
      const bSegments = b.path.split('/').length;
      if (aSegments !== bSegments) return aSegments - bSegments;
      
      // Then alphabetically
      return a.path.localeCompare(b.path);
    });
    
    // Build tree structure for visualization
    const tree = buildApiTree(routes);
    
    return NextResponse.json({
      routes,
      tree,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error scanning API structure:', error);
    return NextResponse.json(
      { error: 'Failed to scan API structure' },
      { status: 500 }
    );
  }
}

function buildApiTree(routes: ApiRoute[]) {
  const tree: any = {};
  
  routes.forEach(route => {
    const parts = route.path.split('/').filter(p => p);
    let current = tree;
    
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {
          name: part,
          children: {},
          methods: index === parts.length - 1 ? route.methods : []
        };
      } else if (index === parts.length - 1) {
        current[part].methods = route.methods;
      }
      current = current[part].children;
    });
  });
  
  return tree;
}