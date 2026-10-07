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
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import BackButton from "../common/back-button"
import { AuthService } from "@/services/auth-service"
import { getErrorMessage } from "@/utils/error-helper"
import { AppRoutes } from "@/constants/routes/app-routes"
import { emailRegex } from "@/constants/regex/regex"

export function WorkerForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const validate = () => {
        if (!email.trim()) {
            setError("Email is required");
            return false;
        }
        if (!emailRegex.validEmail.test(email)) {
            setError("Enter a valid email address");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true);

        try {
            const result = await AuthService.workerForgotPassword({ email: email.trim() });

            if (result.data.success) {
                setIsSent(true);
                toast.success(result.data.message || "Reset link sent");
            } else {
                toast.error(result.data.message || "Something went wrong");
            }
        } catch (err) {
            console.error("Worker forgot password error:", err);
            toast.error(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <BackButton />
                    <CardTitle>Forgot your password?</CardTitle>
                    <CardDescription>
                        {isSent
                            ? "Check your inbox"
                            : "Enter your worker email and we'll send you a link to reset your password"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSent ? (
                        <div className="flex flex-col gap-4 text-sm">
                            <p>
                                If an approved worker account exists for <b>{email}</b>, a reset link has
                                been sent. The link expires in 10 minutes.
                            </p>
                            <Button variant="outline" onClick={() => setIsSent(false)}>
                                Use a different email
                            </Button>
                            <Button onClick={() => navigate(AppRoutes.WORKER.LOGIN)}>
                                Back to login
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError("");
                                        }}
                                        placeholder="worker@example.com"
                                    />
                                    {error && <p className="text-xs text-red-800">{error}</p>}
                                </Field>

                                <Field>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? "Sending..." : "Send reset link"}
                                    </Button>
                                </Field>
                            </FieldGroup>

                            <div className="mt-7 text-center text-sm">
                                Remembered your password?{" "}
                                <a
                                    className="underline underline-offset-4 cursor-pointer"
                                    onClick={() => navigate(AppRoutes.WORKER.LOGIN)}
                                >
                                    Login
                                </a>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}