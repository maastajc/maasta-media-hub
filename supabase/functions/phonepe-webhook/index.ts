import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const base64Response = body.response;
    const receivedChecksum = req.headers.get('X-VERIFY');

    // Verify checksum with key index 1
    const salt = "1"; // Key index for test environment
    const checksumString = base64Response + "/pg/v1/status" + salt;
    const encoder = new TextEncoder();
    const data_buffer = encoder.encode(checksumString);
    const hash = await crypto.subtle.digest("SHA-256", data_buffer);
    const expectedChecksum = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (receivedChecksum !== expectedChecksum) {
      console.error('Checksum verification failed');
      throw new Error('Invalid checksum');
    }

    // Decode response
    const decodedResponse = JSON.parse(atob(base64Response));
    const { code, merchantTransactionId, transactionId } = decodedResponse;
    
    let status = 'failed';
    if (code === 'PAYMENT_SUCCESS') {
      status = 'success';
    } else if (code === 'PAYMENT_PENDING') {
      status = 'pending';
    }

    // Update payment in database
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { error: updateError } = await supabaseService
      .from('payments')
      .update({
        status: status,
        transaction_id: transactionId,
        updated_at: new Date().toISOString()
      })
      .eq('phonepe_order_id', merchantTransactionId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error('Failed to update payment record');
    }

    console.log(`Payment ${merchantTransactionId} updated to status: ${status}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Webhook error:', error.message);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});