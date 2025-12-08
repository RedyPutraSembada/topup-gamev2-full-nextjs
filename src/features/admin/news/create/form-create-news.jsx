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
import { Upload, X, Loader2, Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { createNews } from "@/actions/admin/news/news";
import { Editor } from "@/components/editor/DynamicEditor";

const formSchema = z.object({
  title: z.string().min(1, "Title harus diisi"),
  slug: z.string().min(1, "Slug harus diisi"),
  image_hero: z.string().optional(),
  date: z.string().min(1, "Date harus diisi"),
  content: z.any().refine((val) => {
    return Array.isArray(val) && val.length > 0;
  }, "Content required."),
  tags: z.string().optional(),
  is_active: z.boolean().default(true),
});

const uriUpload = process.env.NEXT_PUBLIC_UPLOAD_URI;
const MAX_FILE_SIZE_MB = process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB || 5;

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

export function FormCreateNews() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [heroPrev, setHeroPrev] = useState(null);
  const [heroLoading, setHeroLoading] = useState(false);

  const [tags, setTags] = useState([
    { id: generateUUID(), name: "", order: 1 },
  ]);

  const initialContentDefault = [
    {
      "type": "paragraph",
      "content": "Insert your content here!"
    }]

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      image_hero: "",
      date: "",
      content: initialContentDefault,
      tags: "",
      is_active: true,
    },
  });

  const { watch, setValue } = form;
  const title = watch("title");
  const initialContent = watch("content");

  useEffect(() => {
    const newSlug = slugify(title || "");
    setValue("slug", newSlug);
  }, [title, setValue]);

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  }

  const createMutation = useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("News created successfully");
      router.push("/admin/news");
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
      setPreview(fileUrl);
    }

    setLoading(false);
  };

  const removeImage = (fieldName, setPreview) => {
    form.setValue(fieldName, "");
    setPreview(null);
  };

  const addTag = () => {
    const newOrder = tags.length + 1;
    setTags([...tags, { id: generateUUID(), name: "", order: newOrder }]);
  };

  const removeTag = (index) => {
    if (tags.length > 1) {
      const newTags = tags.filter((_, i) => i !== index);
      const reordered = newTags.map((item, idx) => ({
        ...item,
        order: idx + 1,
      }));
      setTags(reordered);
    }
  };

  const updateTag = (index, value) => {
    const newTags = [...tags];
    newTags[index].name = value;
    setTags(newTags);
  };

  async function onSubmit(values) {
    try {
      console.log("Form submitted with values:", values);
      
      // Convert tags to JSON
      const tagsJson = tags
        .filter((tag) => tag.name.trim() !== "")
        .map(({ name, order }) => ({
          name,
          order,
        }));

      const submitData = {
        ...values,
        is_active: values.is_active ? 1 : 0,
        content: JSON.stringify(values.content || []),
        tags: JSON.stringify(tagsJson),
      };

      await createMutation.mutateAsync(submitData);
    } catch (error) {
      console.error("Submit error:", error);
    }
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Create News</h1>
          <p className="text-gray-400 mt-1">Buat berita baru untuk website</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      placeholder="Masukkan title berita..."
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
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
                      readOnly
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Slug otomatis dibuat dari title
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Date <span className="text-red-500">*</span>
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

            {/* Image Hero */}
            <FormField
              control={form.control}
              name="image_hero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Image Hero{" "}
                    <span className="text-gray-500">(Opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-700 bg-gray-800/50 flex items-center justify-center">
                        {heroLoading ? (
                          <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
                        ) : heroPrev ? (
                          <img
                            src={heroPrev}
                            alt="Hero Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-8">
                            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Hero Image</p>
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
                              "image_hero",
                              setHeroPrev,
                              setHeroLoading
                            )
                          }
                          className="hidden"
                          id="hero-upload"
                          disabled={heroLoading}
                        />
                        <label
                          htmlFor="hero-upload"
                          className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 cursor-pointer transition-colors ${
                            heroLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          Upload Foto
                        </label>

                        {heroPrev && !heroLoading && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeImage("image_hero", setHeroPrev)
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

            {/* Content Editor */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="flex items-center justify-between text-white">
                    Content <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div 
                      className="border border-dashed border-gray-700 w-full rounded-md p-4 bg-gray-900/50"
                      onClick={(e) => {
                        // Prevent form submission when clicking inside editor
                        e.stopPropagation();
                      }}
                      onMouseDown={(e) => {
                        // Prevent any button in editor from submitting form
                        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Editor
                        initialContent={initialContent}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium text-gray-300">
                  Tags <span className="text-gray-500">(Keywords)</span>
                </FormLabel>
                <Button
                  type="button"
                  size="sm"
                  onClick={addTag}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Tag
                </Button>
              </div>

              <div className="space-y-3">
                {tags.map((tag, index) => (
                  <div
                    key={tag.id}
                    className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16">
                        <label className="text-xs text-gray-400 mb-1 block">
                          Order
                        </label>
                        <Input
                          type="number"
                          value={tag.order}
                          readOnly
                          className="bg-gray-900 border-gray-700 text-white text-center"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">
                          Tag Name
                        </label>
                        <Input
                          placeholder="e.g., game, promo, update"
                          value={tag.name}
                          onChange={(e) => updateTag(index, e.target.value)}
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>

                      {tags.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeTag(index)}
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

            {/* Is Active Checkbox */}
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
                      Berita akan langsung aktif dan dapat dilihat
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className='flex justify-end'>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create News"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}