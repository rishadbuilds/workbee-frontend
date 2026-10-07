import { WorkerResetPasswordForm } from "@/components/worker/WorkerResetPasswordForm"

export default function WorkerResetPasswordPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <WorkerResetPasswordForm />
            </div>
        </div>
    )
}