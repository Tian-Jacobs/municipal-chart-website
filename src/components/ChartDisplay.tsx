
import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Code, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

  // Enhanced color palette with better variety and accessibility
  const COLORS = [
    'hsl(221, 83%, 53%)',   // Blue
    'hsl(142, 76%, 36%)',   // Green
    'hsl(32, 95%, 44%)',    // Orange
    'hsl(348, 83%, 47%)',   // Red
    'hsl(262, 83%, 58%)',   // Purple
    'hsl(193, 95%, 68%)',   // Cyan
    'hsl(84, 81%, 44%)',    // Lime
    'hsl(25, 95%, 53%)',    // Deep Orange
    'hsl(316, 73%, 52%)',   // Pink
    'hsl(231, 48%, 48%)',   // Indigo
    'hsl(291, 64%, 42%)',   // Violet
    'hsl(173, 58%, 39%)',   // Teal
    'hsl(43, 96%, 56%)',    // Yellow
    'hsl(14, 100%, 57%)',   // Red Orange
    'hsl(204, 94%, 94%)',   // Light Blue
  ];

  // Chart color configuration
  const chartColors = {
    primary: 'hsl(221, 83%, 53%)',
    secondary: 'hsl(142, 76%, 36%)',
    accent: 'hsl(32, 95%, 44%)',
    grid: 'hsl(215, 20%, 65%)',
    text: 'hsl(215, 25%, 27%)',
    background: 'hsl(0, 0%, 100%)',
    border: 'hsl(214, 32%, 91%)'
  };

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
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                stroke={chartColors.text} 
                fontSize={12}
                tick={{ fill: chartColors.text }}
              />
              <YAxis 
                stroke={chartColors.text} 
                fontSize={12}
                tick={{ fill: chartColors.text }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: chartColors.background, 
                  border: `1px solid ${chartColors.border}`,
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  color: chartColors.text
                }} 
              />
              <Legend wrapperStyle={{ color: chartColors.text }} />
              <Bar 
                dataKey="value" 
                fill={chartColors.primary} 
                radius={[6, 6, 0, 0]}
                stroke={chartColors.border}
                strokeWidth={1}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                stroke={chartColors.text}
                fontSize={12}
                tick={{ fill: chartColors.text }}
              />
              <YAxis 
                stroke={chartColors.text}
                fontSize={12}
                tick={{ fill: chartColors.text }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: chartColors.background, 
                  border: `1px solid ${chartColors.border}`,
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  color: chartColors.text
                }} 
              />
              <Legend wrapperStyle={{ color: chartColors.text }} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={chartColors.primary} 
                strokeWidth={3}
                dot={{ 
                  fill: chartColors.primary, 
                  strokeWidth: 2, 
                  r: 6,
                  stroke: chartColors.background
                }}
                activeDot={{ 
                  r: 8, 
                  fill: chartColors.secondary,
                  stroke: chartColors.background,
                  strokeWidth: 2
                }}
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
                innerRadius={data.chartType === 'doughnut' ? 70 : 0}
                outerRadius={150}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                labelLine={false}
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke={chartColors.background}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: chartColors.background, 
                  border: `1px solid ${chartColors.border}`,
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  color: chartColors.text
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                stroke={chartColors.text}
                fontSize={12}
                tick={{ fill: chartColors.text }}
              />
              <YAxis 
                stroke={chartColors.text}
                fontSize={12}
                tick={{ fill: chartColors.text }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: chartColors.background, 
                  border: `1px solid ${chartColors.border}`,
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  color: chartColors.text
                }} 
              />
              <Legend wrapperStyle={{ color: chartColors.text }} />
              <Bar 
                dataKey="value" 
                fill={chartColors.primary} 
                radius={[6, 6, 0, 0]}
                stroke={chartColors.border}
                strokeWidth={1}
              />
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
            <h3 className="text-xl font-bold text-slate-800 mb-1">
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
            className="btn-municipal-outline shadow-sm hover:shadow-md transition-shadow"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="municipal-card-body">
          {renderChart()}
        </div>
      </div>

      {/* Enhanced Data Preview */}
      {data.dataPreview && (
        <div className="municipal-card">
          <div className="municipal-card-header">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-3 text-left w-full hover:text-blue-700 transition-colors group"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Eye className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <span className="font-semibold text-slate-800">Data Preview</span>
                <p className="text-sm text-slate-500 mt-0.5">
                  Showing up to 25 rows from {data.totalRecords} total records
                </p>
              </div>
              <div className="ml-auto">
                <div className={`transform transition-transform ${showPreview ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
          {showPreview && (
            <div className="municipal-card-body p-0">
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-slate-50 z-10">
                    <TableRow>
                      <TableHead className="w-12 text-center font-medium text-slate-600 bg-slate-50">
                        #
                      </TableHead>
                      {Object.keys(data.dataPreview[0] || {}).map((key) => (
                        <TableHead key={key} className="font-medium text-slate-700 bg-slate-50 capitalize">
                          {key.replace(/_/g, ' ')}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.dataPreview.slice(0, 25).map((row, index) => (
                      <TableRow 
                        key={index} 
                        className={`hover:bg-slate-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                        }`}
                      >
                        <TableCell className="text-center text-xs font-medium text-slate-500 border-r border-slate-100">
                          {index + 1}
                        </TableCell>
                        {Object.values(row).map((value: any, i) => (
                          <TableCell key={i} className="text-slate-700 font-medium">
                            <div className="max-w-48 truncate" title={value?.toString() || 'N/A'}>
                              {value !== null && value !== undefined ? value.toString() : 
                                <span className="text-slate-400 italic">N/A</span>
                              }
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {data.dataPreview.length > 25 && (
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 text-center">
                  <p className="text-sm text-slate-600">
                    Showing 25 of {data.dataPreview.length} rows. 
                    <span className="ml-1 text-blue-600 font-medium">
                      Export for full dataset
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Enhanced SQL Query Display */}
      {data.sql && (
        <div className="municipal-card">
          <div className="municipal-card-header">
            <button
              onClick={() => setShowSQL(!showSQL)}
              className="flex items-center space-x-3 text-left w-full hover:text-blue-700 transition-colors group"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Code className="w-4 h-4 text-green-700" />
              </div>
              <div>
                <span className="font-semibold text-slate-800">Generated SQL Query</span>
                <p className="text-sm text-slate-500 mt-0.5">
                  View the database query used to generate this chart
                </p>
              </div>
              <div className="ml-auto">
                <div className={`transform transition-transform ${showSQL ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
          {showSQL && (
            <div className="municipal-card-body">
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-green-400 font-mono leading-relaxed">
                  <code>{data.sql}</code>
                </pre>
              </div>
              <div className="mt-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                <strong>Note:</strong> This SQL query was automatically generated from your natural language prompt.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartDisplay;
