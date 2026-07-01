"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OTPField, OTPFieldInput } from "@/components/ui/otp-field";
import { AuthClientError, sendOtp, verifyOtp } from "@/lib/auth/client";
import { DEFAULT_APP_PATH } from "@/lib/auth/constants";

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const COUNTRY_CODE = "+91";

type MobileFormValues = { mobileNumber: string };

function MobileStep({ onSent }: { onSent: (mobileNumber: string) => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MobileFormValues>({ defaultValues: { mobileNumber: "" } });

  async function onSubmit(values: MobileFormValues) {
    setServerError(null);
    try {
      await sendOtp({ mobile_number: values.mobileNumber, country_code: COUNTRY_CODE });
      onSent(values.mobileNumber);
    } catch (error) {
      if (error instanceof AuthClientError) {
        setServerError(error.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="mobileNumber">Mobile number</Label>
        <div className="flex items-center gap-2">
          <span className="flex h-9 items-center rounded-lg border border-input px-3 text-sm text-muted-foreground">
            {COUNTRY_CODE}
          </span>
          <Input
            id="mobileNumber"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="9876543210"
            aria-invalid={errors.mobileNumber ? true : undefined}
            {...register("mobileNumber", {
              required: "Enter your mobile number",
              pattern: { value: MOBILE_REGEX, message: "Enter a valid 10-digit mobile number" },
            })}
          />
        </div>
        {errors.mobileNumber && (
          <p className="text-sm text-destructive">{errors.mobileNumber.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
        Send OTP
      </Button>
    </form>
  );
}

type OtpFormValues = { otpCode: string };

function OtpStep({ mobileNumber, onBack }: { mobileNumber: string; onBack: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<OtpFormValues>({ defaultValues: { otpCode: "" } });

  const otpCode = watch("otpCode");

  async function onSubmit(values: OtpFormValues) {
    setServerError(null);
    try {
      await verifyOtp({
        mobile_number: mobileNumber,
        country_code: COUNTRY_CODE,
        otp_code: values.otpCode,
      });
      const next = searchParams.get("next") ?? DEFAULT_APP_PATH;
      router.push(next);
      router.refresh();
    } catch (error) {
      if (error instanceof AuthClientError) {
        setServerError(error.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  }

  async function handleResend() {
    setServerError(null);
    setResendMessage(null);
    setResending(true);
    try {
      await sendOtp({ mobile_number: mobileNumber, country_code: COUNTRY_CODE });
      setResendMessage("A new OTP has been sent.");
    } catch (error) {
      if (error instanceof AuthClientError) {
        setServerError(error.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="otp-1">
          Enter the code sent to {COUNTRY_CODE} {mobileNumber}
        </Label>
        <OTPField
          length={6}
          autoSubmit
          value={otpCode}
          onValueChange={(value) => setValue("otpCode", value)}
        >
          <OTPFieldInput />
          <OTPFieldInput />
          <OTPFieldInput />
          <OTPFieldInput />
          <OTPFieldInput />
          <OTPFieldInput />
        </OTPField>
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      {resendMessage && <p className="text-sm text-muted-foreground">{resendMessage}</p>}

      <Button type="submit" disabled={isSubmitting || otpCode.length !== 6} className="w-full">
        {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
        Verify &amp; continue
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground underline-offset-4 hover:underline"
        >
          Change number
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-primary underline-offset-4 hover:underline disabled:opacity-50"
        >
          {resending ? "Resending..." : "Resend OTP"}
        </button>
      </div>
    </form>
  );
}

export function LoginForm() {
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);

  if (mobileNumber) {
    return <OtpStep mobileNumber={mobileNumber} onBack={() => setMobileNumber(null)} />;
  }

  return <MobileStep onSent={setMobileNumber} />;
}
