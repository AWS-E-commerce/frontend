import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";
import { useLogin } from "@/queries/useAuth";
import type { LoginRequest } from "@/types";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = (data: LoginRequest) => {
    console.log("Called auth LoginForm onSubmit with:", data);
    login(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Email"
        type="text"
        placeholder="Enter your e=username"
        register={register("username", {
          required: "Username is required",
          pattern: {
            value: /^[A-Z0-9._+\- ]+$/i,
            message: "Invalid username address",
          },
        })}
        error={errors.username}
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        register={register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        error={errors.password}
        required
      />

      <Button type="submit" className="w-full" isLoading={isPending}>
        Login
      </Button>
    </form>
  );
};
