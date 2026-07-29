export async function GET(req) {
  try {
    const token = req.headers.get('authorization');
    const url = new URL(req.url);
    const group = url.searchParams.get('group');

    let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings`;
    if (group) apiUrl += `?group=${encodeURIComponent(group)}`;

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

export async function PUT(req) {
  try {
    const token = req.headers.get('authorization');
    const url = new URL(req.url);
    const group = url.searchParams.get('group') || 'general';
    const body = await req.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings?group=${encodeURIComponent(group)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '',
      },
      body: JSON.stringify(body),
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
