import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form"
import { useLoginMutation } from "@/redux/features/auth/auth.api"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import config from "@/config"
import { Flower2, Sparkles } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {

  const form = useForm();
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const date = new Date();
    try {
      const res = await login(data).unwrap();
      navigate("/")
      toast.success("Welcome back! ✨", {
        description: `Logged in as ${res?.data?.user?.email}`,
      })
    } catch (err: any) {
      console.error(err)
      if (err.data?.message === "User does not exist") {
        toast.error("Account not found")
      } else if (err.data?.message === 'Password does not match') {
        toast.error("Incorrect password")
      } else if (err.data?.message === 'User is not verified') {
        toast.error("Please verify your email first")
        navigate("/verify", { state: data.email })
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Header with decorative elements */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-xl" />
          <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 rounded-full p-3 shadow-lg shadow-pink-500/20">
            <Flower2 className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          Welcome Back!
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Sign in to continue your beauty journey ✨
        </p>
      </div>

      <div className="grid gap-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground/80">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="hello@beauty.com"
                      {...field}
                      value={field.value || ""}
                      className="h-11 rounded-xl border-pink-200/50 dark:border-pink-800/30 focus:border-pink-500 focus:ring-pink-500/20 transition-all duration-200 bg-white/50 dark:bg-white/5 backdrop-blur-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground/80">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="on"
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      value={field.value || ""}
                      className="h-11 rounded-xl border-pink-200/50 dark:border-pink-800/30 focus:border-pink-500 focus:ring-pink-500/20 transition-all duration-200 bg-white/50 dark:bg-white/5 backdrop-blur-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-xs text-pink-500 hover:text-pink-600 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/35 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </form>
        </Form>

        {/* Divider */}
        <div className="relative text-center text-sm">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-pink-200/30 dark:border-pink-800/20" />
          </div>
          <span className="relative z-10 bg-background px-4 text-muted-foreground text-xs uppercase tracking-wider">
            Or continue with
          </span>
        </div>

        <Button
          type="button"
          onClick={() => window.open(`${config.baseUrl}/auth/google/`, "_self")}
          variant="outline"
          className="w-full h-11 rounded-xl border-pink-200/50 dark:border-pink-800/30 hover:bg-pink-50 dark:hover:bg-pink-900/10 hover:border-pink-300 transition-all duration-200 font-medium"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        New to Konebari?{" "}
        <Link to="/register" replace className="text-pink-500 hover:text-pink-600 font-medium hover:underline transition-colors">
          Create Account
        </Link>
      </div>
    </div>
  )
}