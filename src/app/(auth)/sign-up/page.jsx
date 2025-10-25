"use client";
import { useState } from 'react';
import { Eye, EyeOff, Gamepad2, CalendarIcon, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { authClient } from '@/utils/auth-client';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Form Schema - Only for active fields
const registerSchema = z.object({
  name: z.string().min(3, {
    message: "Nama harus minimal 3 karakter.",
  }),
  email: z.string().email({
    message: "Email tidak valid.",
  }),
  password: z.string().min(8, {
    message: "Password harus minimal 8 karakter.",
  }),
});

// Full schema untuk nanti (commented out fields)
// const registerSchemaFull = z.object({
//   name: z.string().min(3, {
//     message: "Nama harus minimal 3 karakter.",
//   }),
//   email: z.string().email({
//     message: "Email tidak valid.",
//   }),
//   password: z.string().min(8, {
//     message: "Password harus minimal 8 karakter.",
//   }),
//   confirmPassword: z.string(),
//   whatsapp: z.string().min(10, {
//     message: "Nomor WhatsApp tidak valid.",
//   }).regex(/^(\+62|62|0)[0-9]{9,12}$/, {
//     message: "Format nomor WhatsApp tidak valid.",
//   }),
//   gender: z.enum(["male", "female"], {
//     required_error: "Pilih jenis kelamin.",
//   }),
//   tempat_lahir: z.string().min(2, {
//     message: "Tempat lahir harus diisi.",
//   }),
//   tanggal_lahir: z.date({
//     required_error: "Tanggal lahir harus diisi.",
//   }),
//   alamat: z.string().min(10, {
//     message: "Alamat harus minimal 10 karakter.",
//   }),
//   image: z.any().optional(),
//   terms: z.boolean().refine((val) => val === true, {
//     message: "Anda harus menyetujui syarat dan ketentuan.",
//   }),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Password tidak cocok.",
//   path: ["confirmPassword"],
// });

export default function RegisterPage() {
  const route = useRouter()
  const [darkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [imagePreview, setImagePreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      // confirmPassword: "",
      // whatsapp: "",
      // gender: undefined,
      // tempat_lahir: "",
      // tanggal_lahir: undefined,
      // alamat: "",
      // image: null,
      // terms: false,
    },
  });

  // const handleImageChange = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     // Validate file type
  //     if (!file.type.startsWith('image/')) {
  //       alert('File harus berupa gambar');
  //       return;
  //     }
  //     // Validate file size (max 2MB)
  //     if (file.size > 2 * 1024 * 1024) {
  //       alert('Ukuran gambar maksimal 2MB');
  //       return;
  //     }
  //     
  //     form.setValue('image', file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const removeImage = () => {
  //   form.setValue('image', null);
  //   setImagePreview(null);
  // };

  const { isSubmitting } = form.formState;

  async function onSubmit(data) {
    await authClient.signUp.email(
      { ...data, callbackURL: "/" },
      {
        onSuccess: () => {
          toast.success("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.");
          route.push("/sign-in")
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Gagal mendaftar. Silakan coba lagi.");
        }
      }
    );
  }

  return (
    <div className={`min-h-screen flex bg-gray-900`}>
      <Toaster />
      
      {/* Left Section - Image */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-purple-600 to-indigo-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4">Bergabung dengan GameVault</h2>
          <p className="text-lg text-purple-100 mb-8">
            Nikmati pengalaman top up game yang mudah, cepat, dan aman dengan berbagai promo menarik
          </p>
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-left">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold mb-1">Proses Cepat</h3>
              <p className="text-sm text-purple-200">Diamond masuk dalam 1-5 menit</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-left">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-bold mb-1">100% Aman</h3>
              <p className="text-sm text-purple-200">Transaksi terjamin dan terpercaya</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-left">
              <div className="text-2xl mb-2">💎</div>
              <h3 className="font-bold mb-1">Harga Terbaik</h3>
              <p className="text-sm text-purple-200">Dapatkan bonus dan promo setiap hari</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-bold text-white`}>
              GameVault
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 text-white`}>
              Buat Akun Baru
            </h1>
            <p className="text-gray-400">
              Daftar untuk mulai top up game favorit Anda
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Profile Image Upload - COMMENTED */}
              {/* <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Foto Profil <span className="text-gray-500">(Opsional)</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <div className={`w-24 h-24 rounded-full overflow-hidden border-2 ${
                          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-100'
                        } flex items-center justify-center`}>
                          {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <Upload className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                              darkMode
                                ? 'border-gray-700 hover:bg-gray-800'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Upload Foto</span>
                          </label>
                          
                          {imagePreview && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeImage}
                              className="ml-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Hapus
                            </Button>
                          )}
                          
                          <p className="text-xs text-gray-500 mt-2">
                            JPG, PNG atau GIF. Maksimal 2MB.
                          </p>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Nama Lengkap
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama lengkap"
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

              {/* WhatsApp - COMMENTED */}
              {/* <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Nomor WhatsApp
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="08123456789 atau +628123456789"
                        className={`${
                          darkMode
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-300'
                        }`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Format: 08xxx atau +628xxx
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

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
                          placeholder="Minimal 8 karakter"
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

              {/* Confirm Password - COMMENTED */}
              {/* <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Konfirmasi Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Ulangi password"
                          className={`${
                            darkMode
                              ? 'bg-gray-800 border-gray-700 text-white'
                              : 'bg-white border-gray-300'
                          }`}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Gender - COMMENTED */}
              {/* <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Jenis Kelamin
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className={`${
                            darkMode
                              ? 'bg-gray-800 border-gray-700 text-white'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Laki-laki</SelectItem>
                        <SelectItem value="female">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Tempat Lahir - COMMENTED */}
              {/* <FormField
                control={form.control}
                name="tempat_lahir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Tempat Lahir
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Jakarta"
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
              /> */}

              {/* Tanggal Lahir - COMMENTED */}
              {/* <FormField
                control={form.control}
                name="tanggal_lahir"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Tanggal Lahir
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                              darkMode
                                ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                                : 'bg-white border-gray-300'
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: id })
                            ) : (
                              <span>Pilih tanggal lahir</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          captionLayout="dropdown-buttons"
                          fromYear={1940}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Alamat - COMMENTED */}
              {/* <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Alamat Lengkap
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan alamat lengkap Anda"
                        className={`resize-none ${
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
              /> */}

              {/* Terms - COMMENTED */}
              {/* <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-gray-600"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Saya menyetujui{' '}
                        <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">
                          Syarat & Ketentuan
                        </Link>
                        {' '}dan{' '}
                        <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">
                          Kebijakan Privasi
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              /> */}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
              </Button>
            </form>
          </Form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Sudah punya akun?{' '}
            <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}