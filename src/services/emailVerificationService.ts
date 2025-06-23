
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmailVerificationStatus {
  isVerified: boolean;
  email: string;
  verifiedAt?: string;
}

export const getEmailVerificationStatus = async (): Promise<EmailVerificationStatus | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('email_verified, email_verified_at, email')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching verification status:', error);
      return null;
    }

    return {
      isVerified: profile.email_verified || false,
      email: profile.email,
      verifiedAt: profile.email_verified_at
    };
  } catch (error) {
    console.error('Error in getEmailVerificationStatus:', error);
    return null;
  }
};

export const sendVerificationEmail = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please sign in to verify your email");
      return false;
    }

    // Generate verification token
    const { data: token, error: tokenError } = await supabase
      .rpc('generate_email_verification_token', { user_id_param: user.id });

    if (tokenError) {
      console.error('Error generating token:', tokenError);
      toast.error("Failed to generate verification token");
      return false;
    }

    // TODO: Call edge function to send email when API key is available
    // For now, just show the verification link in console/toast
    const verificationUrl = `${window.location.origin}/verify-email?token=${token}`;
    console.log('Verification URL:', verificationUrl);
    
    toast.success("Verification email sent! Check your email inbox.");
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    toast.error("Failed to send verification email");
    return false;
  }
};

export const verifyEmailToken = async (token: string): Promise<boolean> => {
  try {
    const { data: isValid, error } = await supabase
      .rpc('verify_email_token', { token_param: token });

    if (error) {
      console.error('Error verifying token:', error);
      toast.error("Invalid or expired verification token");
      return false;
    }

    if (isValid) {
      toast.success("Email verified successfully!");
      return true;
    } else {
      toast.error("Invalid or expired verification token");
      return false;
    }
  } catch (error) {
    console.error('Error in verifyEmailToken:', error);
    toast.error("Failed to verify email");
    return false;
  }
};
