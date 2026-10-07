import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { AuthService } from "@/services/auth-service"
import { getErrorMessage } from "@/utils/error-helper"
import { AppRoutes } from "@/constants/routes/app-routes"

export function WorkerResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
    const [errors, setErrors] = useState({ newPassword: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = { newPassword: "", confirmPassword: "" };
        let isValid = true;

        if (!form.newPassword) {
            newErrors.newPassword = "Password is required";
            isValid = false;
        } else if (form.newPassword.length < 6) {
            newErrors.newPassword = "Password must be at least 6 characters";
            isValid = false;
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (form.confirmPassword !== form.newPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error("Invalid reset link");
            return;
        }
        if (!validate()) return;
        setIsLoading(true);

        try {
            const result = await AuthService.workerResetPassword(token, {
                newPassword: form.newPassword,
            });

            if (result.data.success) {
                toast.success(result.data.message || "Password reset successfully");
                navigate(AppRoutes.WORKER.LOGIN);
            } else {
                toast.error(result.data.message || "Failed to reset password");
            }
        } catch (err) {
            console.error("Worker reset password error:", err);
            toast.error(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Reset your password</CardTitle>
                    <CardDescription>Enter a new password for your worker account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="newPassword">New password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={form.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="text-xs text-red-800">{errors.newPassword}</p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter new password"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-800">{errors.confirmPassword}</p>
                                )}
                            </Field>

                            <Field>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Resetting..." : "Reset password"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}