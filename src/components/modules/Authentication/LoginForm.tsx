import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form"
import { useLoginMutation } from "@/redux/features/auth/auth.api"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { Flower2, Sparkles } from "lucide-react"

// ✅ Redux imports
import { useAppDispatch } from "@/redux/hook"
import { setUser } from "@/redux/features/auth/auth.slice"
import { SocialLogin } from "./RegisterForm"

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {

  const form = useForm();
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  
  // ✅ dispatch নিন
  const dispatch = useAppDispatch();

  

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await login(data).unwrap();
      
      console.log("📥 Login Response:", res);
      
      // ✅ Response থেকে user এবং token নিন
      const userData = res?.data?.user;
      const token = res?.data?.token || res?.data?.accessToken;
      
      console.log("👤 User Data:", userData);
      console.log("🔑 Token:", token);
      
      if (!userData || !token) {
        toast.error("Login response is invalid");
        return;
      }
      
      // ✅ Redux store এ সেভ করুন - এটাই মূল ফিক্স!
      dispatch(setUser({ 
        user: userData, 
        token: token 
      }));
      
      toast.success("Welcome back! ✨", {
        description: `Logged in as ${userData?.email}`,
      })
      
      // ✅ রোল অনুযায়ী নেভিগেট করুন
      if (userData.role === "ADMIN" || userData.role === "SUPER_ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      
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

        <div className="relative text-center text-sm">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-pink-200/30 dark:border-pink-800/20" />
          </div>
          {/* <span className="relative z-10 bg-background px-4 text-muted-foreground text-xs uppercase tracking-wider">
            Or continue with
          </span> */}
        </div>

         <SocialLogin/>
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