import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  eventId?: string;
  auditionId?: string;
  amount: number;
  returnUrl: string;
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

    const { eventId, auditionId, amount, returnUrl }: PaymentRequest = await req.json();

    if ((!eventId && !auditionId) || (eventId && auditionId)) {
      throw new Error("Either eventId or auditionId must be provided, but not both");
    }

    if (!amount || amount <= 0) {
      throw new Error("Valid amount is required");
    }

    // Create unique order ID
    const orderId = `ORDER_${Date.now()}_${user.id.substring(0, 8)}`;
    
    // PhonePe API configuration
    const merchantId = "PGTESTPAYUAT";
    const apiKey = Deno.env.get("PHONEPE_API_KEY") || "";
    const salt = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"; // PhonePe test salt
    const apiEndpoint = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    // Prepare payment request
    const paymentPayload = {
      merchantId,
      merchantTransactionId: orderId,
      merchantUserId: user.id,
      amount: amount * 100, // Convert to paise
      redirectUrl: returnUrl,
      redirectMode: "REDIRECT",
      callbackUrl: `${Deno.env.get("SUPABASE_URL")}/functions/v1/phonepe-webhook`,
      mobileNumber: "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    // Create base64 encoded payload
    const base64Payload = btoa(JSON.stringify(paymentPayload));
    
    // Create checksum
    const checksumString = base64Payload + "/pg/v1/pay" + salt;
    const encoder = new TextEncoder();
    const data_buffer = encoder.encode(checksumString);
    const hash = await crypto.subtle.digest("SHA-256", data_buffer);
    const checksum = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('') + "###1";

    // Make payment request to PhonePe
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const phonepeResponse = await response.json();
    
    if (!phonepeResponse.success) {
      throw new Error(`PhonePe API error: ${phonepeResponse.message}`);
    }

    // Store payment in database using service role key
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { error: insertError } = await supabaseService
      .from('payments')
      .insert({
        user_id: user.id,
        event_id: eventId || null,
        audition_id: auditionId || null,
        amount: amount,
        currency: 'INR',
        status: 'pending',
        phonepe_order_id: orderId,
        payment_method: 'phonepe'
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to store payment record');
    }

    console.log('Payment initiated successfully:', orderId);

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl: phonepeResponse.data.instrumentResponse.redirectInfo.url,
        orderId: orderId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Payment creation error:', error.message);
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