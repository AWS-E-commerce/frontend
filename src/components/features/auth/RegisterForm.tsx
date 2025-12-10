// src/components/features/auth/RegisterForm.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, UserPlus, AlertCircle } from "lucide-react";
import { useRegister } from "@/queries/useAuth";
import { Button } from "@/components/common/Button/Button";
import type { RegisterRequest } from "@/types";
import { Gender, Role } from "@/types";
import { useTranslation } from "react-i18next";

const RegisterForm = () => {
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const password = watch("password");

  const onSubmit = async (data: RegisterRequest) => {
    try {
      // Ensure role is MEMBER for regular registration
      const registrationData: RegisterRequest = {
        ...data,
        role: Role.MEMBER,
      };
      await registerMutation.mutateAsync(registrationData);
    } catch (error: any) {
      // Error is handled in mutation
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t("auth:register.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("auth:register.subtitle")}
          </p>
        </div>

        {/* Error Message */}
        {registerMutation.isError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {t("auth:register.error")}
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {registerMutation.error?.response?.data?.message ||
                  t("auth:register.errorMessage")}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("auth:register.username")} *
              </label>
              <input
                type="text"
                {...register("username", {
                  required: t("auth:register.validation.usernameRequired"),
                  minLength: {
                    value: 3,
                    message: t("auth:register.validation.usernameMinLength"),
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: t("auth:register.validation.usernamePattern"),
                  },
                })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:border-transparent transition-all`}
                placeholder={t("auth:register.usernamePlaceholder")}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("auth:register.fullName")} *
              </label>
              <input
                type="text"
                {...register("fullName", {
                  required: t("auth:register.validation.fullNameRequired"),
                  minLength: {
                    value: 2,
                    message: t("auth:register.validation.fullNameMinLength"),
                  },
                })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:border-transparent transition-all`}
                placeholder={t("auth:register.fullNamePlaceholder")}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("auth:register.email")} *
              </label>
              <input
                type="email"
                {...register("email", {
                  required: t("auth:register.validation.emailRequired"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("auth:register.validation.emailInvalid"),
                  },
                })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:border-transparent transition-all`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("auth:register.phoneNumber")} *
              </label>
              <input
                type="tel"
                {...register("phoneNumber", {
                  required: t("auth:register.validation.phoneRequired"),
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: t("auth:register.validation.phoneInvalid"),
                  },
                })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.phoneNumber
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:border-transparent transition-all`}
                placeholder="0123456789"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("auth:register.password")} *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: t("auth:register.validation.passwordRequired"),
                    minLength: {
                      value: 6,
                      message: t("auth:register.validation.passwordMinLength"),
                    },
                  })}
                  className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:border-transparent transition-all`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("auth:register.age")} *
              </label>
              <input
                type="number"
                {...register("age", {
                  required: t("auth:register.validation.ageRequired"),
                  min: {
                    value: 13,
                    message: t("auth:register.validation.ageMin"),
                  },
                  max: {
                    value: 120,
                    message: t("auth:register.validation.ageMax"),
                  },
                  valueAsNumber: true,
                })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.age
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:border-transparent transition-all`}
                placeholder="18"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.age.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("auth:register.gender")} *
              </label>
              <select
                {...register("gender", {
                  required: t("auth:register.validation.genderRequired"),
                })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.gender
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:border-transparent transition-all`}
              >
                <option value="">{t("auth:register.selectGender")}</option>
                <option value="MALE">{t("auth:register.male")}</option>
                <option value="FEMALE">{t("auth:register.female")}</option>
                <option value="UNISEX">{t("auth:register.other")}</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("auth:register.address")} *
              </label>
              <input
                type="text"
                {...register("address", {
                  required: t("auth:register.validation.addressRequired"),
                  minLength: {
                    value: 10,
                    message: t("auth:register.validation.addressMinLength"),
                  },
                })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.address
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:border-transparent transition-all`}
                placeholder={t("auth:register.addressPlaceholder")}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 mt-6"
          >
            {registerMutation.isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {t("auth:register.creatingAccount")}
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                {t("auth:register.createAccount")}
              </>
            )}
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {t("auth:register.haveAccount")}{" "}
            <Link
              to="/auth/login"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
            >
              {t("auth:register.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
