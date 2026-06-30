"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getMe, signIn, signUp } from "@/lib/api";
const AuthContext = createContext(null);

// useAuth 훅 - AuthProvider 밖에서 쓰면 에러를 던져요
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있어요.");
  }
  return context;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 로그인 - accessToken을 로컬스토리에 저장하고 유저 정보를 상태에 반영해요
  const login = async (email, password) => {
    const data = await signIn(email, password);
    localStorage.setItem("access_token", data.accessToken);
    setUser(data.user);
  };

  // 로그아웃 - 토큰 제거 후 유저 상태 초기화
  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  // 회원가입 - 성공하면 바로 로그인 상태로 전환해요
  const register = async (email, nickname, password, passwordConfirmation) => {
    const data = await signUp(email, nickname, password, passwordConfirmation);
    localStorage.setItem("access_token", data.accessToken);
    setUser(data.user);
  };

  // 새로고침해도 로그인 유지 - 토큰이 있으면 유저 정보를 서버에서 다시 받아와요
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    getMe()
      .then((userData) => setUser(userData))
      .catch(() => {
        // 토큰이 만료됐거나 유효하지 않으면 조용히 로그아웃 처리
        localStorage.removeItem("access_token");
        setUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
