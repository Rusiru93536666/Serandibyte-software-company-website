export async function GET(req) {
  try {
    const token = req.headers.get('authorization');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/verify`, {
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