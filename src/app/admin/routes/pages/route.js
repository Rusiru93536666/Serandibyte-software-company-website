export async function GET(req) {
  try {
    const token = req.headers.get('authorization');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    console.log(`[Pages API] Fetching all pages`);
    
    const response = await fetch(`${apiUrl}/api/admin/pages`, {
      method: 'GET',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      { 
        status: response.status, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error('Error fetching pages:', error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}