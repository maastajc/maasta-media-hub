import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyRequest {
  orderId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { orderId }: VerifyRequest = await req.json();

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    // PhonePe API configuration
    const merchantId = "PGTESTPAYUAT";
    const salt = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"; // PhonePe test salt
    const apiEndpoint = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${orderId}`;

    // Create checksum for status check
    const checksumString = `/pg/v1/status/${merchantId}/${orderId}${salt}`;
    const encoder = new TextEncoder();
    const data_buffer = encoder.encode(checksumString);
    const hash = await crypto.subtle.digest("SHA-256", data_buffer);
    const checksum = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('') + "###1";

    // Check payment status with PhonePe
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId,
      }
    });

    const phonepeResponse = await response.json();
    
    if (!phonepeResponse.success) {
      throw new Error(`PhonePe status check failed: ${phonepeResponse.message}`);
    }

    const paymentData = phonepeResponse.data;
    let status = 'failed';
    
    if (paymentData.code === 'PAYMENT_SUCCESS') {
      status = 'success';
    } else if (paymentData.code === 'PAYMENT_PENDING') {
      status = 'pending';
    }

    // Update payment in database
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: updateData, error: updateError } = await supabaseService
      .from('payments')
      .update({
        status: status,
        transaction_id: paymentData.transactionId,
        updated_at: new Date().toISOString()
      })
      .eq('phonepe_order_id', orderId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error('Failed to update payment record');
    }

    console.log(`Payment ${orderId} verified with status: ${status}`);

    return new Response(
      JSON.stringify({
        success: true,
        payment: updateData,
        phonepeData: paymentData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Payment verification error:', error.message);
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