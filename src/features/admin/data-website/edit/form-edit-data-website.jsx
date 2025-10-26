"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Loader2 } from "lucide-react";
import { updateDataWebsite } from "@/actions/admin/data-website/data-website";

const formSchema = z.object({
  id: z.number(),
  title_web: z.string().min(1, "Title harus diisi"),
  slogan_web: z.string().min(1, "Slogan harus diisi"),
  desc_web: z.string().min(1, "Deskripsi harus diisi"),
  url_wa: z.string().optional(),
  url_ig: z.string().optional(),
  url_tt: z.string().optional(),
  url_yt: z.string().optional(),
  url_fb: z.string().optional(),
  logo: z.string().optional(),
  signin_image: z.string().optional(),
  signup_image: z.string().optional(),
});

const uriUpload = process.env.NEXT_PUBLIC_UPLOAD_URI;
const MAX_FILE_SIZE_MB = process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB || 2;

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const url = `${uriUpload}/upload`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.fileUrl || "";
  } catch (error) {
    toast.error("Failed to upload image");
    return "";
  }
}

export function FormEditDataWebsite({ data }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [logoPrev, setLogoPrev] = useState(data?.logo || null);
  const [signinPrev, setSigninPrev] = useState(data?.signin_image || null);
  const [signupPrev, setSignupPrev] = useState(data?.signup_image || null);

  const [logoLoading, setLogoLoading] = useState(false);
  const [signinLoading, setSigninLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data.id,
      title_web: data?.title_web || "",
      slogan_web: data?.slogan_web || "",
      desc_web: data?.desc_web || "",
      url_wa: data?.url_wa || "",
      url_ig: data?.url_ig || "",
      url_tt: data?.url_tt || "",
      url_yt: data?.url_yt || "",
      url_fb: data?.url_fb || "",
      logo: data?.logo || "",
      signin_image: data?.signin_image || "",
      signup_image: data?.signup_image || "",
    },
  });

  // Reset form when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        id: data.id,
        title_web: data.title_web || "",
        slogan_web: data.slogan_web || "",
        desc_web: data.desc_web || "",
        url_wa: data.url_wa || "",
        url_ig: data.url_ig || "",
        url_tt: data.url_tt || "",
        url_yt: data.url_yt || "",
        url_fb: data.url_fb || "",
        logo: data.logo || "",
        signin_image: data.signin_image || "",
        signup_image: data.signup_image || "",
      });
      setLogoPrev(data.logo || null);
      setSigninPrev(data.signin_image || null);
      setSignupPrev(data.signup_image || null);
    }
  }, [data, form]);

  const updateMutation = useMutation({
    mutationFn: updateDataWebsite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-website"] });
      toast.success("Data website updated successfully");
      router.push("/admin/data-website");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleImageUpload = async (e, fieldName, setPreview, setLoading) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    if (!file.type.startsWith("image/")) {
      form.setError(fieldName, {
        type: "manual",
        message: "File harus berupa gambar",
      });
      setLoading(false);
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      form.setError(fieldName, {
        type: "manual",
        message: `File size should not exceed ${MAX_FILE_SIZE_MB} MB.`,
      });
      setLoading(false);
      return;
    }

    form.clearErrors(fieldName);

    const fileUrl = await uploadImage(file);
    if (fileUrl) {
      form.setValue(fieldName, fileUrl);
      const imagePreviewUrl = URL.createObjectURL(file);
      setPreview(imagePreviewUrl);
    }

    setLoading(false);
  };

  const removeImage = (fieldName, setPreview) => {
    form.setValue(fieldName, "");
    setPreview(null);
  };

  async function onSubmit(values) {
    const data = {
      ...values,
    };
    await updateMutation.mutateAsync(data);
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-2xl mx-auto p-6">
        <Form {...form}>
          <div className="space-y-6">
            {/* Logo Website */}
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Logo Website{" "}
                    <span className="text-gray-500">(Opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-700 bg-gray-800/50 flex items-center justify-center">
                        {logoLoading ? (
                          <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                        ) : logoPrev ? (
                          <img
                            src={logoPrev}
                            alt="Logo Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-gray-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">Logo (1:1)</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              "logo",
                              setLogoPrev,
                              setLogoLoading
                            )
                          }
                          className="hidden"
                          id="logo-upload"
                          disabled={logoLoading}
                        />
                        <label
                          htmlFor="logo-upload"
                          className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 cursor-pointer transition-colors ${
                            logoLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          Upload Foto
                        </label>

                        {logoPrev && !logoLoading && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage("logo", setLogoPrev)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <p className="text-xs text-gray-500">
                        JPG, PNG atau GIF. Maksimal {MAX_FILE_SIZE_MB}MB
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sign In Image */}
            <FormField
              control={form.control}
              name="signin_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Sign In Image{" "}
                    <span className="text-gray-500">(Opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-700 bg-gray-800/50 flex items-center justify-center">
                        {signinLoading ? (
                          <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
                        ) : signinPrev ? (
                          <img
                            src={signinPrev}
                            alt="Sign In Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-8">
                            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              Image (16:9 atau 3:4)
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              "signin_image",
                              setSigninPrev,
                              setSigninLoading
                            )
                          }
                          className="hidden"
                          id="signin-upload"
                          disabled={signinLoading}
                        />
                        <label
                          htmlFor="signin-upload"
                          className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 cursor-pointer transition-colors ${
                            signinLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          Upload Foto
                        </label>

                        {signinPrev && !signinLoading && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeImage("signin_image", setSigninPrev)
                            }
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <p className="text-xs text-gray-500">
                        JPG, PNG atau GIF. Maksimal {MAX_FILE_SIZE_MB}MB
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sign Up Image */}
            <FormField
              control={form.control}
              name="signup_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Sign Up Image{" "}
                    <span className="text-gray-500">(Opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-700 bg-gray-800/50 flex items-center justify-center">
                        {signupLoading ? (
                          <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
                        ) : signupPrev ? (
                          <img
                            src={signupPrev}
                            alt="Sign Up Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-8">
                            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              Image (16:9 atau 3:4)
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              "signup_image",
                              setSignupPrev,
                              setSignupLoading
                            )
                          }
                          className="hidden"
                          id="signup-upload"
                          disabled={signupLoading}
                        />
                        <label
                          htmlFor="signup-upload"
                          className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 cursor-pointer transition-colors ${
                            signupLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          Upload Foto
                        </label>

                        {signupPrev && !signupLoading && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeImage("signup_image", setSignupPrev)
                            }
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <p className="text-xs text-gray-500">
                        JPG, PNG atau GIF. Maksimal {MAX_FILE_SIZE_MB}MB
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title Website */}
            <FormField
              control={form.control}
              name="title_web"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Title Website
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan title website..."
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slogan Website */}
            <FormField
              control={form.control}
              name="slogan_web"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Slogan Website
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan slogan..."
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Website */}
            <FormField
              control={form.control}
              name="desc_web"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Description Website
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan deskripsi website..."
                      className="resize-none min-h-[100px] bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL WhatsApp */}
            <FormField
              control={form.control}
              name="url_wa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    URL WhatsApp
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://wa.me/..."
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Social Media URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="url_ig"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      URL Instagram
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://instagram.com/..."
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url_tt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      URL TikTok
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://tiktok.com/@..."
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url_yt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      URL YouTube
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://youtube.com/@..."
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url_fb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      URL Facebook
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://facebook.com/..."
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={
                updateMutation.isPending ||
                logoLoading ||
                signinLoading ||
                signupLoading
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Data"
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
