// Simple API endpoint for Vercel serverless functions
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'GET') {
    res.status(200).json({
      message: 'TruthOS API is running',
      timestamp: new Date().toISOString(),
      endpoints: {
        '/api/status': 'API status',
        '/api/health': 'Health check',
        '/': 'Frontend interface'
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}