"use client";

import { useState } from "react";
import Image from "next/image";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  // react-hook-form이 errors.email 등으로 넘겨주는 에러 객체 (없으면 undefined)
  error?: FieldError;
  // register("name", {...})의 반환값 - onChange/onBlur/name/ref가 들어있음
  registration: UseFormRegisterReturn;
}

// 로그인/회원가입 공통 입력 필드 (라벨 + input + 에러메시지).
// type="password"면 눈 모양 토글 버튼을 내부에서 자동 처리한다.
// registration: react-hook-form의 register("name", {...}) 반환값을 그대로 넘긴다.
export default function AuthInput({
  id,
  label,
  type = "text",
  placeholder,
  error,
  registration,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  // 비밀번호일 때만 토글에 따라 실제 input type을 바꾼다
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-4">
      <label
        htmlFor={id}
        className="text-base font-bold text-gray-800 md:text-lg"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          {...registration}
          className={`h-14 w-full rounded-xl bg-gray-100 px-6 text-base outline-none focus:ring-2 focus:ring-brand-blue ${
            isPassword ? "pr-14" : ""
          } ${error ? "ring-2 ring-red-500" : ""}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            <Image
              src={
                showPassword
                  ? "/icons/auth/eye_open.svg"
                  : "/icons/auth/eye_closed.svg"
              }
              alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              width={24}
              height={24}
            />
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
