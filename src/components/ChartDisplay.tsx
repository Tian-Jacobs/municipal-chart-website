
import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Code, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartData {
  chartType: string;
  data: any;
  title: string;
  totalRecords: number;
  sql?: string;
  dataPreview?: any[];
}

interface ChartDisplayProps {
  data: ChartData | null;
  isLoading: boolean;
  error: string | null;
}

const ChartDisplay = ({ data, isLoading, error }: ChartDisplayProps) => {
  const [showSQL, setShowSQL] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const handleExport = () => {
    console.log('Exporting chart...');
    // Implementation for chart export would go here
  };

  if (isLoading) {
    return (
      <div className="municipal-card">
        <div className="municipal-card-body">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="municipal-loading w-16 h-16 rounded-full mb-4 mx-auto"></div>
              <p className="text-slate-600">Generating your chart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="municipal-card border-red-200 bg-red-50">
        <div className="municipal-card-body">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠</span>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Unable to Generate Chart
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="text-sm text-red-700 bg-red-100 p-3 rounded-lg">
              <strong>Suggestions:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Try rephrasing your query</li>
                <li>Check for typos in category or field names</li>
                <li>Use one of the sample queries as a starting point</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="municipal-card">
        <div className="municipal-card-body">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              Ready to Generate Charts
            </h3>
            <p className="text-slate-500">
              Enter a natural language query above to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    const chartData = data.data;
    
    switch (data.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
      case 'doughnut':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={data.chartType === 'doughnut' ? 60 : 0}
                outerRadius={140}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="municipal-card">
        <div className="municipal-card-header flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {data.title}
            </h3>
            <p className="text-sm text-slate-600">
              {data.totalRecords} total records
            </p>
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="btn-municipal-outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="municipal-card-body">
          {renderChart()}
        </div>
      </div>

      {/* Data Preview */}
      {data.dataPreview && (
        <div className="municipal-card">
          <div className="municipal-card-header">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 text-left w-full hover:text-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="font-semibold">Data Preview</span>
              <span className="text-sm text-slate-500">
                (First {data.dataPreview.length} rows)
              </span>
            </button>
          </div>
          {showPreview && (
            <div className="municipal-card-body">
              <div className="overflow-x-auto">
                <table className="municipal-table">
                  <thead>
                    <tr>
                      {Object.keys(data.dataPreview[0] || {}).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.dataPreview.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value: any, i) => (
                          <td key={i}>{value?.toString() || 'N/A'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SQL Query */}
      {data.sql && (
        <div className="municipal-card">
          <div className="municipal-card-header">
            <button
              onClick={() => setShowSQL(!showSQL)}
              className="flex items-center space-x-2 text-left w-full hover:text-blue-700 transition-colors"
            >
              <Code className="w-4 h-4" />
              <span className="font-semibold">Generated SQL Query</span>
              <span className="text-sm text-slate-500">(Debug)</span>
            </button>
          </div>
          {showSQL && (
            <div className="municipal-card-body">
              <pre className="bg-slate-100 p-4 rounded-lg text-sm text-slate-700 overflow-x-auto">
                <code>{data.sql}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartDisplay;
