"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/providers/AuthProvider";
import SocialLogin from "@/app/(auth)/_components/SocialLogin";
import AuthInput from "@/app/(auth)/_components/AuthInput";

// 회원가입 폼이 다루는 필드 (useForm 제네릭에 넘겨 register/errors까지 타입이 이어짐)
interface SignupFormValues {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
}

function ErrorModal({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
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

export default function SignupPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth(); // rhf register와 충돌 피해 별칭

  const [modalMessage, setModalMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupFormValues>({ mode: "onChange" });

  // 비밀번호 확인 일치 검사용 - 현재 password 값을 추적
  const password = watch("password");

  // 이미 로그인된 상태면 /items로 리다이렉트
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) router.replace("/items");
  }, [router]);

  // 검증 통과 시에만 호출됨
  const onSubmit = async ({
    email,
    nickname,
    password,
    passwordConfirmation,
  }: SignupFormValues) => {
    try {
      await registerUser(email, nickname, password, passwordConfirmation);
      router.push("/items");
    } catch (err) {
      // catch의 err는 unknown이라 Error인지 좁힌 뒤 메시지를 꺼낸다
      setModalMessage(
        err instanceof Error
          ? err.message
          : "회원가입에 실패했어요. 다시 시도해주세요.",
      );
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
            id="nickname"
            label="닉네임"
            type="text"
            placeholder="닉네임을 입력해주세요"
            error={errors.nickname}
            registration={register("nickname", {
              required: "닉네임을 입력해 주세요.",
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

          <AuthInput
            id="passwordConfirmation"
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            error={errors.passwordConfirmation}
            registration={register("passwordConfirmation", {
              required: "비밀번호를 다시 입력해 주세요.",
              validate: (value) =>
                value === password || "비밀번호가 일치하지 않아요.",
            })}
          />

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="h-14 rounded-full bg-brand-blue text-xl font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? "가입 중..." : "회원가입"}
          </button>
        </form>

        {/* 소셜 로그인 */}
        <SocialLogin />

        {/* 로그인 링크 */}
        <p className="mt-6 text-sm font-medium text-gray-900">
          이미 회원이신가요?{" "}
          <Link
            href="/signin"
            className="font-semibold text-brand-blue underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </>
  );
}
