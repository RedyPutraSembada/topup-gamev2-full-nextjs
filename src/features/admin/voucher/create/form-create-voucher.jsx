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
import { createVoucher } from "@/actions/admin/voucher/voucher";

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

export function FormCreateVoucher() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "percent",
      total: "",
      kuota: "",
      is_active: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: createVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voucher"] });
      toast.success("Voucher created successfully");
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
      total_use: "0", // Initialize dengan 0
    };

    await createMutation.mutateAsync(submitData);
  }

  const watchType = form.watch("type");

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Create Voucher</h1>
          <p className="text-gray-400 mt-1">Buat voucher baru untuk promo atau diskon</p>
        </div>

        <Form {...form}>
          <div className="space-y-6">
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      min="1"
                      placeholder="Masukkan jumlah kuota voucher"
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Jumlah maksimal voucher yang dapat digunakan
                  </FormDescription>
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
                    {form.watch("kuota") || "0"} / {form.watch("kuota") || "0"}
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
                      Voucher akan langsung aktif dan dapat digunakan
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

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
                    <li>• Total use akan otomatis bertambah saat voucher digunakan</li>
                    <li>• Voucher tidak dapat digunakan jika total use mencapai kuota</li>
                    <li>• Type percent maksimal 100%</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={createMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Voucher"
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}