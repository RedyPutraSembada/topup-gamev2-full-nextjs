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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Loader2 } from "lucide-react";
import { createProductInProvider } from "@/actions/admin/product-in-provider/product-in-provider";

const formSchema = z.object({
  product_provider_id: z.string().min(1, "Product provider harus dipilih"),
  product_id: z.string().min(1, "Product harus dipilih"),
  type: z.string().min(1, "Type harus dipilih"),
  product_id_from_provider: z.string().optional(),
  code: z.string().optional(),
  modal: z.string().optional(),
  name: z.string().optional(),
  amount_member: z.string().optional(),
  amount_seller: z.string().optional(),
  flash_sale: z.boolean().default(false),
  title_flash_sale: z.string().optional(),
  amount_flash_sale: z.string().optional(),
  expired_flash_sale: z.string().optional(),
  is_active: z.boolean().default(true),
  product_icon: z.string().optional(),
  banner_flash_sale: z.string().optional(),
});

const uriUpload = process.env.NEXT_PUBLIC_UPLOAD_URI;
const MAX_FILE_SIZE_MB = process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB;

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

export function FormCreateProductInProvider({ products, providerProducts }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [iconPrev, setIconPrev] = useState(null);
  const [bannerPrev, setBannerPrev] = useState(null);

  const [iconLoading, setIconLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);

  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_provider_id: "",
      product_id: "",
      type: "",
      product_id_from_provider: "",
      code: "",
      modal: "",
      name: "",
      amount_member: "",
      amount_seller: "",
      flash_sale: false,
      title_flash_sale: "",
      amount_flash_sale: "",
      expired_flash_sale: "",
      is_active: true,
      product_icon: "",
      banner_flash_sale: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createProductInProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-in-providers"] });
      toast.success("Product in provider created successfully");
      router.push("/admin/product-in-provider");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Watch product_id changes
  const watchProductId = form.watch("product_id");

  useEffect(() => {
    if (watchProductId) {
      const product = products.find(
        (p) => p.value.toString() === watchProductId
      );
      if (product) {
        setSelectedProduct(product);

        // Parse type_data_product
        try {
          const typeData = product.type_data_product
            ? JSON.parse(product.type_data_product)
            : [];
          // Sort by order
          const sortedTypes = typeData.sort((a, b) => a.order - b.order);
          setTypeOptions(sortedTypes);

          // Reset type field
          form.setValue("type", "");
        } catch (error) {
          console.error("Error parsing type_data_product:", error);
          setTypeOptions([]);
        }
      }
    } else {
      setSelectedProduct(null);
      setTypeOptions([]);
      form.setValue("type", "");
    }
  }, [watchProductId, products]);

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
    const submitData = {
      ...values,
      product_provider_id: parseInt(values.product_provider_id),
      product_id: parseInt(values.product_id),
      flash_sale: values.flash_sale ? 1 : 0,
      is_active: values.is_active ? 1 : 0,
      expired_flash_sale: values.expired_flash_sale || null,
    };

    await createMutation.mutateAsync(submitData);
  }

  const watchFlashSale = form.watch("flash_sale");

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto p-6">
        <Form {...form}>
          <div className="space-y-6">
            {/* Product Provider */}
            <FormField
              control={form.control}
              name="product_provider_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Product Provider <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Pilih product provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {providerProducts.map((provider) => (
                        <SelectItem
                          key={provider.value}
                          value={provider.value.toString()}
                        >
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product */}
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Product <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Pilih product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem
                          key={product.value}
                          value={product.value.toString()}
                        >
                          {product.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!watchProductId || typeOptions.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue
                          placeholder={
                            !watchProductId
                              ? "Pilih product terlebih dahulu"
                              : typeOptions.length === 0
                                ? "Tidak ada type tersedia"
                                : "Pilih type"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeOptions.map((type, index) => (
                        <SelectItem key={index} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedProduct && typeOptions.length === 0 && (
                    <p className="text-xs text-yellow-500 mt-1">
                      Product ini belum memiliki type_data_product
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="input name" type="" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product ID From Provider */}
            <FormField
              control={form.control}
              name="product_id_from_provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Product ID From Provider{" "}
                    <span className="text-gray-500">(Opsional)</span>
                    <span className="text-gray-500">Jika M#####d maka isi (categoryid,kodeproduct,qty)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan product ID dari provider..."
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Code <span className="text-gray-500">(Opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan kode produk (e.g., ML10, NETFLIX1BULAN)..."
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pricing Section */}
            <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg space-y-4">
              <h3 className="text-sm font-medium text-gray-300">Harga</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="modal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Modal <span className="text-gray-500">(Opsional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
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
                  name="amount_member"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Amount Member{" "}
                        <span className="text-gray-500">(Opsional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
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
                  name="amount_seller"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Amount Seller{" "}
                        <span className="text-gray-500">(Opsional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Flash Sale Checkbox */}
            <FormField
              control={form.control}
              name="flash_sale"
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
                  <FormLabel className="text-sm font-normal text-gray-300 cursor-pointer">
                    Flash Sale
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Flash Sale Details - Conditional */}
            {watchFlashSale && (
              <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg space-y-4">
                <h3 className="text-sm font-medium text-gray-300">
                  Flash Sale Details
                </h3>

                <FormField
                  control={form.control}
                  name="title_flash_sale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Title Flash Sale{" "}
                        <span className="text-gray-500">(Opsional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan judul flash sale..."
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
                  name="amount_flash_sale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Amount Flash Sale{" "}
                        <span className="text-gray-500">(Opsional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
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
                  name="expired_flash_sale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Expired Flash Sale{" "}
                        <span className="text-gray-500">(Opsional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          className="bg-gray-900 border-gray-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Banner Flash Sale */}
                <FormField
                  control={form.control}
                  name="banner_flash_sale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Banner Flash Sale{" "}
                        <span className="text-gray-500">(Opsional)</span>
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-700 bg-gray-800/50 flex items-center justify-center max-w-md">
                            {bannerLoading ? (
                              <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
                            ) : bannerPrev ? (
                              <img
                                src={bannerPrev}
                                alt="Banner Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center p-8">
                                <Upload className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">
                                  Banner Image
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
                                  "banner_flash_sale",
                                  setBannerPrev,
                                  setBannerLoading
                                )
                              }
                              className="hidden"
                              id="banner-upload"
                              disabled={bannerLoading}
                            />
                            <label
                              htmlFor="banner-upload"
                              className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 cursor-pointer transition-colors ${
                                bannerLoading
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <Upload className="w-4 h-4" />
                              Upload Banner
                            </label>

                            {bannerPrev && !bannerLoading && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeImage(
                                    "banner_flash_sale",
                                    setBannerPrev
                                  )
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
              </div>
            )}

            {/* Product Icon */}
            <FormField
              control={form.control}
              name="product_icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Product Icon{" "}
                    <span className="text-gray-500">(Opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-700 bg-gray-800/50 flex items-center justify-center">
                        {iconLoading ? (
                          <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                        ) : iconPrev ? (
                          <img
                            src={iconPrev}
                            alt="Icon Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-gray-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">Icon</p>
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
                              "product_icon",
                              setIconPrev,
                              setIconLoading
                            )
                          }
                          className="hidden"
                          id="icon-upload"
                          disabled={iconLoading}
                        />
                        <label
                          htmlFor="icon-upload"
                          className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 cursor-pointer transition-colors ${
                            iconLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          Upload Icon
                        </label>

                        {iconPrev && !iconLoading && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeImage("product_icon", setIconPrev)
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
                  <FormLabel className="text-sm font-normal text-gray-300 cursor-pointer">
                    Active
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={
                createMutation.isPending || iconLoading || bannerLoading
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
