"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/providers/AuthProvider";

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

export default function SignupPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth(); // rhf register와 충돌 피해 별칭

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: "onChange" });

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
  }) => {
    try {
      await registerUser(email, nickname, password, passwordConfirmation);
      router.push("/items");
    } catch (err) {
      setModalMessage(
        err?.message ?? "회원가입에 실패했어요. 다시 시도해주세요.",
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
          {/* 이메일 */}
          <div className="flex flex-col gap-4">
            <label
              htmlFor="email"
              className="text-base font-bold text-gray-800 md:text-lg"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              {...register("email", {
                required: "이메일을 입력해 주세요.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "잘못된 이메일 형식이에요.",
                },
              })}
              className={`h-14 rounded-xl bg-gray-100 px-6 text-base outline-none focus:ring-2 focus:ring-brand-blue ${errors.email ? "ring-2 ring-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* 닉네임 */}
          <div className="flex flex-col gap-4">
            <label
              htmlFor="nickname"
              className="text-base font-bold text-gray-800 md:text-lg"
            >
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              placeholder="닉네임을 입력해주세요"
              {...register("nickname", {
                required: "닉네임을 입력해 주세요.",
              })}
              className={`h-14 rounded-xl bg-gray-100 px-6 text-base outline-none focus:ring-2 focus:ring-brand-blue ${errors.nickname ? "ring-2 ring-red-500" : ""}`}
            />
            {errors.nickname && (
              <p className="text-sm text-red-500">{errors.nickname.message}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-4">
            <label
              htmlFor="password"
              className="text-base font-bold text-gray-800 md:text-lg"
            >
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요"
                {...register("password", {
                  required: "비밀번호를 입력해 주세요.",
                  minLength: {
                    value: 8,
                    message: "비밀번호를 8자 이상 입력해 주세요.",
                  },
                })}
                className={`h-14 w-full rounded-xl bg-gray-100 px-6 pr-14 text-base outline-none focus:ring-2 focus:ring-brand-blue ${errors.password ? "ring-2 ring-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                <Image
                  src={
                    showPassword
                      ? "/icons/eye_open.svg"
                      : "/icons/eye_closed.svg"
                  }
                  alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  width={24}
                  height={24}
                />
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col gap-4">
            <label
              htmlFor="passwordConfirmation"
              className="text-base font-bold text-gray-800 md:text-lg"
            >
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                id="passwordConfirmation"
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="비밀번호를 다시 입력해주세요"
                {...register("passwordConfirmation", {
                  required: "비밀번호를 다시 입력해 주세요.",
                  validate: (value) =>
                    value === password || "비밀번호가 일치하지 않아요.",
                })}
                className={`h-14 w-full rounded-xl bg-gray-100 px-6 pr-14 text-base outline-none focus:ring-2 focus:ring-brand-blue ${errors.passwordConfirmation ? "ring-2 ring-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label={
                  showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"
                }
              >
                <Image
                  src={
                    showPasswordConfirm
                      ? "/icons/eye_open.svg"
                      : "/icons/eye_closed.svg"
                  }
                  alt={
                    showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"
                  }
                  width={24}
                  height={24}
                />
              </button>
            </div>
            {errors.passwordConfirmation && (
              <p className="text-sm text-red-500">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

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
        <div className="mt-6 flex w-full max-w-[343px] items-center justify-between rounded-lg bg-[#e6f2ff] px-6 py-4 md:max-w-[640px]">
          <span className="text-base font-medium text-gray-900">
            간편 로그인하기
          </span>
          <div className="flex gap-4">
            <a
              href="https://www.google.com"
              target="_blank"
              rel="noreferrer"
              aria-label="구글로 로그인"
            >
              <Image
                src="/icons/ic_google.svg"
                alt="Google"
                width={42}
                height={42}
              />
            </a>
            <a
              href="https://www.kakaocorp.com/page"
              target="_blank"
              rel="noreferrer"
              aria-label="카카오로 로그인"
            >
              <Image
                src="/icons/ic_kakao.svg"
                alt="Kakao"
                width={42}
                height={42}
              />
            </a>
          </div>
        </div>

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
