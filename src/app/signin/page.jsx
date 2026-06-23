"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 이미 로그인된 상태면 /items로 리다이렉트
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) router.replace("/items");
  }, [router]);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/items");
    } catch (err) {
      const msg = err?.message ?? "";
      if (msg.includes("이메일") || msg.includes("email")) {
        setEmailError("이메일을 확인해 주세요.");
      } else if (msg.includes("비밀번호") || msg.includes("password")) {
        setPasswordError("비밀번호를 확인해 주세요.");
      } else {
        setModalMessage(
          "로그인에 실패했어요. 이메일 또는 비밀번호를 확인해 주세요.",
        );
      }
    } finally {
      setLoading(false);
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
          onSubmit={handleSubmit}
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              className={`h-14 rounded-xl bg-gray-100 px-6 text-base outline-none focus:ring-2 focus:ring-brand-blue ${emailError ? "ring-2 ring-red-500" : ""}`}
            />
            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                className={`h-14 w-full rounded-xl bg-gray-100 px-6 pr-14 text-base outline-none focus:ring-2 focus:ring-brand-blue ${passwordError ? "ring-2 ring-red-500" : ""}`}
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
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="h-14 rounded-full bg-brand-blue text-xl font-semibold text-white disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
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
