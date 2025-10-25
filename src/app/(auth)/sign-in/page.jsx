"use client";
import { useState } from 'react';
import { Eye, EyeOff, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { authClient } from '@/utils/auth-client';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// Form Schema
const loginSchema = z.object({
  email: z.string().email({
    message: "Email tidak valid.",
  }),
  password: z.string().min(1, {
    message: "Password harus diisi.",
  }),
  rememberMe: z.boolean().default(false).optional(),
});

export default function LoginPage() {
  const [darkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data) {
    
    const { data: session, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
    if (error) {
      toast.error(error.message || "Email atau password salah.");
      return;
    }
    if (session?.user) {
      // Get fresh session data from database
      const freshSession = await authClient.getSession({ 
        disableCookieCache: true 
      });
      
      const userRole = freshSession?.user?.role || 'user';
      
      toast.success("Login berhasil!");
      
      // Redirect based on role
      if (userRole === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      toast.error("Gagal mendapatkan data session.");
    }
  }

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social(
        {
          provider: "google",
        },
        {
          onSuccess: async (ctx) => {
            toast.success("Login dengan Google berhasil!");
            
            // Get user session to check role
            const session = await authClient.getSession();
            
            if (session?.user) {
              const userRole = session.user.role || 'user';
              
              // Redirect based on role
              if (userRole === 'admin') {
                router.push('/admin');
              } else {
                router.push('/');
              }
            } else {
              router.push('/');
            }
          },
          onError: (ctx) => {
            toast.error("Gagal login dengan Google.");
          }
        }
      );
    } catch (error) {
      toast.error("Terjadi kesalahan saat login dengan Google.");
    }
  };

  // Handle Facebook Sign In (jika sudah dikonfigurasi)
  // const handleFacebookSignIn = async () => {
  //   try {
  //     await authClient.signIn.social(
  //       {
  //         provider: "facebook",
  //       },
  //       {
  //         onSuccess: async (ctx) => {
  //           toast.success("Login dengan Facebook berhasil!");
  //           
  //           const session = await authClient.getSession();
  //           
  //           if (session?.user) {
  //             const userRole = session.user.role || 'user';
  //             
  //             if (userRole === 'admin') {
  //               router.push('/admin');
  //             } else {
  //               router.push('/');
  //             }
  //           } else {
  //             router.push('/');
  //           }
  //         },
  //         onError: (ctx) => {
  //           toast.error("Gagal login dengan Facebook.");
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     toast.error("Terjadi kesalahan saat login dengan Facebook.");
  //   }
  // };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Toaster />
      
      {/* Left Section - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              GameVault
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Selamat Datang Kembali
            </h1>
            <p className="text-gray-400">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="nama@email.com"
                        className={`${
                          darkMode
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-300'
                        }`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className={`${
                            darkMode
                              ? 'bg-gray-800 border-gray-700 text-white'
                              : 'bg-white border-gray-300'
                          }`}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-gray-600"
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-gray-400 font-normal cursor-pointer">
                        Ingat saya
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <Link href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300">
                  Lupa password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Masuk...' : 'Masuk'}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
            <span className="text-sm text-gray-400">atau</span>
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className={`flex items-center justify-center gap-2 ${
                darkMode 
                  ? 'border-gray-700 hover:bg-gray-800 text-white' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium">Google</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              disabled
              className={`flex items-center justify-center gap-2 opacity-50 cursor-not-allowed ${
                darkMode 
                  ? 'border-gray-700 bg-gray-800 text-white' 
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              <span className="text-sm font-medium">Facebook</span>
            </Button>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Belum punya akun?{' '}
            <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-indigo-600 to-purple-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4">Top Up Game Favorit Anda</h2>
          <p className="text-lg text-indigo-100 mb-8">
            Dapatkan diamond, voucher, dan item game dengan cepat, aman, dan terpercaya
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold mb-1">500K+</div>
              <div className="text-sm text-indigo-200">Transaksi</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold mb-1">100+</div>
              <div className="text-sm text-indigo-200">Games</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold mb-1">50K+</div>
              <div className="text-sm text-indigo-200">Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}