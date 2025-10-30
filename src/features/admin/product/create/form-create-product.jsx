"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { createProduct } from "@/actions/admin/product/product";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  type_product_id: z.string().min(1, "Type product harus dipilih"),
  kode: z.string().optional(),
  title: z.string().min(1, "Title harus diisi"),
  slug: z.string().min(1, "Slug harus diisi"),
  description: z.string().optional(),
  best_seller: z.boolean().default(false),
  is_active: z.boolean().default(true),
  is_check_username: z.boolean().default(false),
  image_thumbnail: z.string().optional(),
  image_cover: z.string().optional(),
  data_input: z.string().optional(),
  type_data_product: z.string().optional(),
});

const uriUpload = process.env.NEXT_PUBLIC_UPLOAD_URI;
const MAX_FILE_SIZE_MB = process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB;

// function generateUUID() {
//   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
//     const r = (Math.random() * 16) | 0;
//     const v = c === "x" ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// }

function generateUUID() {
  return uuidv4();
}

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

export function FormCreateProduct({ typeProducts }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [thumbnailPrev, setThumbnailPrev] = useState(null);
  const [coverPrev, setCoverPrev] = useState(null);

  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);

  const [dataInputs, setDataInputs] = useState([
    { id: generateUUID(), name: "", label: "", placeholder: "" },
  ]);

  const [typeDataProducts, setTypeDataProducts] = useState([
    { id: generateUUID(), name: "", order: 1 },
  ]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type_product_id: "",
      kode: "",
      title: "",
      slug: "",
      description: "",
      best_seller: false,
      is_active: true,
      is_check_username: false,
      image_thumbnail: "",
      image_cover: "",
      data_input: "",
      type_data_product: "",
    },
  });

  const title = form.watch("title");

  useEffect(() => {
    const newSlug = slugify(title || "");
    form.setValue("slug", newSlug);
  }, [title, form]);

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success("Product created successfully");
      router.push("/admin/product");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // hapus karakter selain huruf/angka/space
      .replace(/\s+/g, "-") // ganti spasi jadi "-"
      .replace(/--+/g, "-") // hapus double "-"
      .trim();
  }

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

  const addDataInput = () => {
    setDataInputs([
      ...dataInputs,
      { id: generateUUID(), name: "", label: "", placeholder: "" },
    ]);
  };

  const removeDataInput = (index) => {
    if (dataInputs.length > 1) {
      setDataInputs(dataInputs.filter((_, i) => i !== index));
    }
  };

  const updateDataInput = (index, field, value) => {
    const newInputs = [...dataInputs];
    newInputs[index][field] = value;
    setDataInputs(newInputs);
  };

  const addTypeDataProduct = () => {
    const newOrder = typeDataProducts.length + 1;
    setTypeDataProducts([
      ...typeDataProducts,
      { id: generateUUID(), name: "", order: newOrder },
    ]);
  };

  const removeTypeDataProduct = (index) => {
    if (typeDataProducts.length > 1) {
      const newTypes = typeDataProducts.filter((_, i) => i !== index);
      // Reorder
      const reordered = newTypes.map((item, idx) => ({
        ...item,
        order: idx + 1,
      }));
      setTypeDataProducts(reordered);
    }
  };

  const updateTypeDataProduct = (index, field, value) => {
    const newTypes = [...typeDataProducts];
    newTypes[index][field] = value;
    setTypeDataProducts(newTypes);
  };

  const moveTypeDataProduct = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === typeDataProducts.length - 1)
    ) {
      return;
    }

    const newTypes = [...typeDataProducts];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    [newTypes[index], newTypes[targetIndex]] = [
      newTypes[targetIndex],
      newTypes[index],
    ];

    // Update order numbers
    const reordered = newTypes.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));
    setTypeDataProducts(reordered);
  };

  async function onSubmit(values) {
    // Convert dataInputs to JSON
    const dataInputJson = dataInputs
      .filter((input) => input.name.trim() !== "")
      .map(({ id, name, label, placeholder }) => ({
        id,
        name,
        label,
        placeholder,
      }));

    // Convert typeDataProducts to JSON
    const typeDataProductJson = typeDataProducts
      .filter((type) => type.name.trim() !== "")
      .map(({ name, order }) => ({
        name,
        order,
      }));

    const submitData = {
      ...values,
      type_product_id: parseInt(values.type_product_id),
      best_seller: values.best_seller ? 1 : 0,
      is_active: values.is_active ? 1 : 0,
      is_check_username: values.is_check_username ? 1 : 0,
      data_input: JSON.stringify(dataInputJson),
      type_data_product: JSON.stringify(typeDataProductJson),
    };

    await createMutation.mutateAsync(submitData);
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto p-6">
        <Form {...form}>
          <div className="space-y-6">
            {/* Type Product */}
            <FormField
              control={form.control}
              name="type_product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Type Product <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Pilih type product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeProducts?.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kode */}
            <FormField
              control={form.control}
              name="kode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Kode <span className="text-gray-500">(Opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan kode produk..."
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan title produk..."
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
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Slug
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Slug akan otomatis diisi..."
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      {...field}
                      readOnly // user tidak bisa ketik manual
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Description{" "}
                    <span className="text-gray-500">(Opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan deskripsi produk..."
                      className="resize-none min-h-[100px] bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Thumbnail */}
            <FormField
              control={form.control}
              name="image_thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Image Thumbnail{" "}
                    <span className="text-gray-500">(Opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="w-full rounded-lg overflow-hidden border-2 border-gray-700 bg-gray-800/50 flex items-center justify-center max-w-sm">
                        {thumbnailLoading ? (
                          <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
                        ) : thumbnailPrev ? (
                          <img
                            src={thumbnailPrev}
                            alt="Thumbnail Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-8">
                            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              Thumbnail Image
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
                              "image_thumbnail",
                              setThumbnailPrev,
                              setThumbnailLoading
                            )
                          }
                          className="hidden"
                          id="thumbnail-upload"
                          disabled={thumbnailLoading}
                        />
                        <label
                          htmlFor="thumbnail-upload"
                          className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 cursor-pointer transition-colors ${
                            thumbnailLoading
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          Upload Foto
                        </label>

                        {thumbnailPrev && !thumbnailLoading && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeImage("image_thumbnail", setThumbnailPrev)
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

            {/* Image Cover */}
            <FormField
              control={form.control}
              name="image_cover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Image Cover{" "}
                    <span className="text-gray-500">(Opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-700 bg-gray-800/50 flex items-center justify-center">
                        {coverLoading ? (
                          <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
                        ) : coverPrev ? (
                          <img
                            src={coverPrev}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-8">
                            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Cover Image</p>
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
                              "image_cover",
                              setCoverPrev,
                              setCoverLoading
                            )
                          }
                          className="hidden"
                          id="cover-upload"
                          disabled={coverLoading}
                        />
                        <label
                          htmlFor="cover-upload"
                          className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 cursor-pointer transition-colors ${
                            coverLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          Upload Foto
                        </label>

                        {coverPrev && !coverLoading && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeImage("image_cover", setCoverPrev)
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

            {/* Data Input Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium text-gray-300">
                  Data Input{" "}
                  <span className="text-gray-500">(Form Fields)</span>
                </FormLabel>
                <Button
                  type="button"
                  size="sm"
                  onClick={addDataInput}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Input
                </Button>
              </div>

              <div className="space-y-3">
                {dataInputs.map((input, index) => (
                  <div
                    key={input.id}
                    className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        Input #{index + 1}
                      </span>
                      {dataInputs.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeDataInput(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                          Name (Field Name)
                        </label>
                        <Input
                          placeholder="e.g., uid, zone"
                          value={input.name}
                          onChange={(e) =>
                            updateDataInput(index, "name", e.target.value)
                          }
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                          Label (Display Name)
                        </label>
                        <Input
                          placeholder="e.g., User ID, Zone ID"
                          value={input.label}
                          onChange={(e) =>
                            updateDataInput(index, "label", e.target.value)
                          }
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                          Placeholder
                        </label>
                        <Input
                          placeholder="e.g., Enter your ID"
                          value={input.placeholder}
                          onChange={(e) =>
                            updateDataInput(
                              index,
                              "placeholder",
                              e.target.value
                            )
                          }
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Type Data Product Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium text-gray-300">
                  Type Data Product{" "}
                  <span className="text-gray-500">(Categories)</span>
                </FormLabel>
                <Button
                  type="button"
                  size="sm"
                  onClick={addTypeDataProduct}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Category
                </Button>
              </div>

              <div className="space-y-3">
                {typeDataProducts.map((type, index) => (
                  <div
                    key={type.id}
                    className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => moveTypeDataProduct(index, "up")}
                          disabled={index === 0}
                          className="h-6 px-2 text-gray-400 hover:text-white disabled:opacity-30"
                        >
                          <GripVertical className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => moveTypeDataProduct(index, "down")}
                          disabled={index === typeDataProducts.length - 1}
                          className="h-6 px-2 text-gray-400 hover:text-white disabled:opacity-30"
                        >
                          <GripVertical className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-16">
                          <label className="text-xs text-gray-400 mb-1 block">
                            Order
                          </label>
                          <Input
                            type="number"
                            value={type.order}
                            readOnly
                            className="bg-gray-900 border-gray-700 text-white text-center"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-400 mb-1 block">
                            Category Name
                          </label>
                          <Input
                            placeholder="e.g., promo, topup"
                            value={type.name}
                            onChange={(e) =>
                              updateTypeDataProduct(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                          />
                        </div>
                      </div>

                      {typeDataProducts.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeTypeDataProduct(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
              <FormField
                control={form.control}
                name="best_seller"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 rounded border-gray-700 bg-gray-900"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal text-gray-300 cursor-pointer">
                      Best Seller
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
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

              <FormField
                control={form.control}
                name="is_check_username"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 rounded border-gray-700 bg-gray-900"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal text-gray-300 cursor-pointer">
                      Check Username
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={
                createMutation.isPending || thumbnailLoading || coverLoading
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
