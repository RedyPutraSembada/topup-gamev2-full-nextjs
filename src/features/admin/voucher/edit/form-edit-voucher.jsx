"use client";
import { useState } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Percent, DollarSign } from "lucide-react";
import { updateVoucher } from "@/actions/admin/voucher/voucher";

const formSchema = z.object({
  name: z.string().min(1, "Name harus diisi"),
  type: z.enum(["percent", "amount"], {
    required_error: "Type harus dipilih",
  }),
  total: z.string().min(1, "Total harus diisi"),
  kuota: z.string().min(1, "Kuota harus diisi"),
  is_active: z.boolean().default(true),
}).refine((data) => {
  const totalNum = parseFloat(data.total);
  if (isNaN(totalNum) || totalNum <= 0) {
    return false;
  }
  if (data.type === "percent" && totalNum > 100) {
    return false;
  }
  return true;
}, {
  message: "Total tidak valid. Untuk percent max 100%",
  path: ["total"],
}).refine((data) => {
  const kuotaNum = parseInt(data.kuota);
  return !isNaN(kuotaNum) && kuotaNum > 0;
}, {
  message: "Kuota harus berupa angka positif",
  path: ["kuota"],
});

export function FormEditVoucher({ data }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || "",
      type: data?.type || "percent",
      total: data?.total || "",
      kuota: data?.kuota || "",
      is_active: Boolean(data?.is_active),
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voucher"] });
      toast.success("Voucher updated successfully");
      router.push("/admin/voucher");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function onSubmit(values) {
    const submitData = {
      ...values,
      is_active: values.is_active ? 1 : 0,
      id: data.id,
    };

    await updateMutation.mutateAsync(submitData);
  }

  const watchType = form.watch("type");
  const totalUse = parseInt(data?.total_use || "0");
  const kuota = parseInt(form.watch("kuota") || "0");
  const remainingQuota = Math.max(0, kuota - totalUse);
  const usagePercentage = kuota > 0 ? (totalUse / kuota) * 100 : 0;

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Edit Voucher</h1>
          <p className="text-gray-400 mt-1">ID: {data?.id}</p>
        </div>

        <Form {...form}>
          <div className="space-y-6">
            {/* Usage Statistics */}
            <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg space-y-3">
              <h3 className="text-sm font-medium text-gray-300">Statistik Penggunaan</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total Digunakan:</span>
                  <span className="text-white font-semibold">{data?.total_use || "0"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Sisa Kuota:</span>
                  <span className="text-white font-semibold">{remainingQuota}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      usagePercentage >= 100 
                        ? "bg-red-500" 
                        : usagePercentage >= 80 
                        ? "bg-yellow-500" 
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{usagePercentage.toFixed(1)}% terpakai</span>
                  {usagePercentage >= 100 && (
                    <span className="text-red-400 font-medium">Kuota Habis</span>
                  )}
                </div>
              </div>
            </div>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Voucher Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama voucher (e.g., DISKON50K, PROMO20)"
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Nama voucher yang akan digunakan pelanggan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Pilih type voucher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percent">
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4" />
                          <span>Percent (Persentase)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="amount">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>Amount (Nominal)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-gray-500">
                    Pilih jenis diskon: persentase atau nominal tetap
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total */}
            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Total {watchType === "percent" ? "(Persentase)" : "(Nominal)"}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        step={watchType === "percent" ? "1" : "0.01"}
                        min="0"
                        max={watchType === "percent" ? "100" : undefined}
                        placeholder={
                          watchType === "percent" 
                            ? "Masukkan persentase (0-100)" 
                            : "Masukkan nominal"
                        }
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 pr-12"
                        {...field}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {watchType === "percent" ? (
                          <Percent className="w-4 h-4" />
                        ) : (
                          <span className="text-sm">Rp</span>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    {watchType === "percent" 
                      ? "Masukkan nilai persentase diskon (maksimal 100%)"
                      : "Masukkan nominal potongan harga dalam Rupiah"
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kuota */}
            <FormField
              control={form.control}
              name="kuota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Kuota <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={totalUse}
                      placeholder="Masukkan jumlah kuota voucher"
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Jumlah maksimal voucher yang dapat digunakan. Minimal {totalUse} (sudah terpakai)
                  </FormDescription>
                  {parseInt(field.value) < totalUse && (
                    <p className="text-xs text-yellow-500 mt-1">
                      ⚠️ Kuota tidak boleh kurang dari total penggunaan ({totalUse})
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview Card */}
            <div className="p-4 bg-linear-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Preview Voucher</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Name:</span>
                  <span className="text-sm text-white font-mono">
                    {form.watch("name") || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Type:</span>
                  <span className="text-sm text-white capitalize">
                    {watchType === "percent" ? "Persentase" : "Nominal"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Discount:</span>
                  <span className="text-sm text-white font-semibold">
                    {form.watch("total") ? (
                      watchType === "percent" 
                        ? `${form.watch("total")}%`
                        : `Rp ${parseFloat(form.watch("total")).toLocaleString('id-ID')}`
                    ) : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Kuota:</span>
                  <span className="text-sm text-white">
                    {data?.total_use || "0"} / {form.watch("kuota") || "0"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Status:</span>
                  <span className={`text-sm font-medium ${form.watch("is_active") ? "text-green-400" : "text-red-400"}`}>
                    {form.watch("is_active") ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Is Active */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal text-gray-300 cursor-pointer">
                      Active
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500">
                      Voucher akan aktif dan dapat digunakan
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Warning Box */}
            {usagePercentage >= 80 && usagePercentage < 100 && (
              <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                <div className="flex gap-3">
                  <div className="shrink-0">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-yellow-300 mb-1">Peringatan</h4>
                    <p className="text-xs text-gray-400">
                      Kuota voucher hampir habis. Pertimbangkan untuk menambah kuota jika diperlukan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {usagePercentage >= 100 && (
              <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                <div className="flex gap-3">
                  <div className="shrink-0">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-300 mb-1">Kuota Habis</h4>
                    <p className="text-xs text-gray-400">
                      Voucher ini tidak dapat digunakan lagi karena kuota sudah habis. Tambah kuota untuk mengaktifkan kembali.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
              <div className="flex gap-3">
                <div className="shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-300 mb-1">Informasi</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Total use tidak dapat diubah secara manual</li>
                    <li>• Kuota tidak boleh kurang dari total use yang sudah ada</li>
                    <li>• Ubah status menjadi inactive untuk menonaktifkan voucher sementara</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            {data?.created_at && (
              <div className="p-4 bg-gray-800/20 border border-gray-700 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Created At:</span>
                  <span className="text-gray-300">
                    {new Date(data.created_at).toLocaleString('id-ID')}
                  </span>
                </div>
                {data?.updated_at && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Updated At:</span>
                    <span className="text-gray-300">
                      {new Date(data.updated_at).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={updateMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Voucher"
                )}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}