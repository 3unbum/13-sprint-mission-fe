"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/providers/AuthProvider";
import SocialLogin from "@/app/(auth)/_components/SocialLogin";
import AuthInput from "@/app/(auth)/_components/AuthInput";

// 로그인/회원가입 실패 시 띄우는 모달
function ErrorModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex w-[327px] flex-col items-center gap-6 rounded-2xl bg-white px-8 py-10 md:w-[540px]">
        <p className="text-center text-lg font-semibold text-gray-900">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full rounded-full bg-brand-blue py-3 text-base font-semibold text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default function SigninPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [modalMessage, setModalMessage] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: "onChange" });

  // 이미 로그인된 상태면 /items로 리다이렉트
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) router.replace("/items");
  }, [router]);

  // 검증 통과 시에만 호출됨 (data = { email, password })
  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      router.push("/items");
    } catch (err) {
      const msg = err?.message ?? "";
      if (msg.includes("이메일") || msg.includes("email")) {
        setError("email", { message: "이메일을 확인해 주세요." });
      } else if (msg.includes("비밀번호") || msg.includes("password")) {
        setError("password", { message: "비밀번호를 확인해 주세요." });
      } else {
        setModalMessage(
          "로그인에 실패했어요. 이메일 또는 비밀번호를 확인해 주세요.",
        );
      }
    }
  };

  return (
    <>
      {modalMessage && (
        <ErrorModal
          message={modalMessage}
          onClose={() => setModalMessage("")}
        />
      )}

      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        {/* 로고 */}
        <Link href="/" className="mb-8">
          <Image
            src="/logo/panda-logo.png"
            alt="판다마켓"
            width={396}
            height={132}
            className="hidden md:block"
          />
          <Image
            src="/logo/panda-logo.png"
            alt="판다마켓"
            width={198}
            height={66}
            className="md:hidden"
          />
        </Link>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full max-w-[343px] flex-col gap-6 md:max-w-[640px]"
        >
          <AuthInput
            id="email"
            label="이메일"
            type="email"
            placeholder="이메일을 입력해주세요"
            error={errors.email}
            registration={register("email", {
              required: "이메일을 입력해 주세요.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "잘못된 이메일 형식이에요.",
              },
            })}
          />

          <AuthInput
            id="password"
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            error={errors.password}
            registration={register("password", {
              required: "비밀번호를 입력해 주세요.",
              minLength: {
                value: 8,
                message: "비밀번호를 8자 이상 입력해 주세요.",
              },
            })}
          />

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="h-14 rounded-full bg-brand-blue text-xl font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 소셜 로그인 */}
        <SocialLogin />

        {/* 회원가입 링크 */}
        <p className="mt-6 text-sm font-medium text-gray-900">
          판다마켓이 처음이신가요?{" "}
          <Link
            href="/signup"
            className="font-semibold text-brand-blue underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </>
  );
}
