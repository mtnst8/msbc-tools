// MSBC QBO OAuth Token Exchange + API Proxy Worker

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://mtnst8.github.io',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const body = await request.json();
      const { action } = body;

      // Token Exchange
      if (action === 'token' || !action) {
        const { code, redirect_uri, client_id, client_secret } = body;
        const credentials = btoa(`${client_id}:${client_secret}`);
        const tokenResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri }),
        });
        const tokenData = await tokenResponse.json();
        return new Response(JSON.stringify(tokenData), {
          status: tokenResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // QBO API Proxy
      if (action === 'qbo_api') {
        const { access_token, realm_id, payload, environment } = body;
        const baseUrl = environment === 'production'
          ? 'https://quickbooks.api.intuit.com'
          : 'https://sandbox-quickbooks.api.intuit.com';
        const url = `${baseUrl}/v3/company/${realm_id}/estimate?minorversion=65`;
        const qboResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ Estimate: payload }),
        });
        const qboData = await qboResponse.json();
        return new Response(JSON.stringify(qboData), {
          status: qboResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: 'Unknown action' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
