export async function GET(req) {
  try {
    const token = req.headers.get('authorization');
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const limit = url.searchParams.get('limit');
    const offset = url.searchParams.get('offset');
    
    let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/messages`;
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);
    if (params.toString()) apiUrl += `?${params.toString()}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': token || '',
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
    console.error('Error in API route:', error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}