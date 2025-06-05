// src/components/AuthGuard.js
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/authStore";

// eslint-disable-next-line react/prop-types
export const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user.token) {
      navigate("/auth/login", { replace: true });
    }
  }, [user, navigate]);

  return user.token ? children : null;
};
