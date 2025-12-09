"use client"
import { useState } from 'react';
import { Plus, X, Upload, Image, MoveUp, MoveDown, Save, Eye, Loader2 } from 'lucide-react';
import { createDataImageSlideShow } from '@/actions/admin/images-slideshow/images-slideshow';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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

export function FormCreateImagesSlideShow() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [slides, setSlides] = useState([
    { id: Date.now(), title: '', image: '', desc: '', order: 1 }
  ]);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [isUploading, setIsUploading] = useState({});

  const createMutation = useMutation({
    mutationFn: createDataImageSlideShow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images-slideshow"] });
      toast.success("Data images slideshow created successfully");
      router.push("/admin/images-slideshow");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      title: '',
      image: '',
      desc: '',
      order: slides.length + 1
    };
    setSlides([...slides, newSlide]);
  };

  const removeSlide = (id) => {
    if (slides.length === 1) {
      toast.error('Minimal harus ada 1 slide!');
      return;
    }
    const updatedSlides = slides.filter(slide => slide.id !== id)
      .map((slide, index) => ({ ...slide, order: index + 1 }));
    setSlides(updatedSlides);
  };

  const updateSlide = (id, field, value) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, [field]: value } : slide
    ));
  };

  const handleImageUpload = async (e, slideId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [slideId]: true }));

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (PNG, JPG, JPEG)");
      setIsUploading(prev => ({ ...prev, [slideId]: false }));
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      toast.error(`File size should not exceed ${MAX_FILE_SIZE_MB} MB.`);
      setIsUploading(prev => ({ ...prev, [slideId]: false }));
      return;
    }

    try {
      const fileUrl = await uploadImage(file);
      
      if (fileUrl) {
        updateSlide(slideId, 'image', fileUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error('Gagal mengupload gambar. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal mengupload gambar. Silakan coba lagi.');
    } finally {
      setIsUploading(prev => ({ ...prev, [slideId]: false }));
    }
  };

  const moveSlide = (index, direction) => {
    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    
    const reorderedSlides = newSlides.map((slide, idx) => ({
      ...slide,
      order: idx + 1
    }));
    
    setSlides(reorderedSlides);
  };

  const isAnyImageUploading = Object.values(isUploading).some(loading => loading);

  async function onSubmit() {
    const hasEmptyFields = slides.some(slide => 
      !slide.title.trim() || !slide.image.trim() || !slide.desc.trim()
    );
    
    if (hasEmptyFields) {
      toast.error('Semua field harus diisi!');
      return;
    }

    const dataToSubmit = {
      data_slider: JSON.stringify(slides)
    };

    await createMutation.mutateAsync(dataToSubmit);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Kelola Slideshow</h1>
              <p className="text-gray-400 text-sm">Tambah dan atur slide untuk homepage</p>
            </div>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{previewMode ? 'Edit Mode' : 'Preview Mode'}</span>
            </button>
          </div>

          {previewMode ? (
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Preview Slideshow</h2>
              <div className="relative">
                {slides.length > 0 && slides[currentPreviewIndex] && (
                  <div className="space-y-4">
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-700">
                      {slides[currentPreviewIndex].image ? (
                        <img 
                          src={slides[currentPreviewIndex].image} 
                          alt={slides[currentPreviewIndex].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-16 h-16 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{slides[currentPreviewIndex].title || 'No Title'}</h3>
                      <p className="text-gray-400">{slides[currentPreviewIndex].desc || 'No Description'}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setCurrentPreviewIndex(prev => prev > 0 ? prev - 1 : slides.length - 1)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-400">
                        {currentPreviewIndex + 1} / {slides.length}
                      </span>
                      <button
                        onClick={() => setCurrentPreviewIndex(prev => prev < slides.length - 1 ? prev + 1 : 0)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-4">
                {slides.map((slide, index) => (
                  <div 
                    key={slide.id} 
                    className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
                          {slide.order}
                        </span>
                        <h3 className="font-semibold">Slide {slide.order}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveSlide(index, 'up')}
                          disabled={index === 0}
                          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Pindah ke atas"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSlide(index, 'down')}
                          disabled={index === slides.length - 1}
                          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Pindah ke bawah"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSlide(slide.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                          title="Hapus slide"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Judul Slide
                        </label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                          placeholder="Masukkan judul slide..."
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Gambar Slide
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={slide.image}
                              onChange={(e) => updateSlide(slide.id, 'image', e.target.value)}
                              placeholder="URL gambar atau upload file..."
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                            />
                          </div>
                          <label 
                            className={`px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                              isUploading[slide.id] ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {isUploading[slide.id] ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                <span>Upload</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg"
                              onChange={(e) => handleImageUpload(e, slide.id)}
                              className="hidden"
                              disabled={isUploading[slide.id]}
                            />
                          </label>
                        </div>
                        {slide.image && (
                          <div className="mt-3 rounded-lg overflow-hidden border border-gray-600">
                            <img 
                              src={slide.image} 
                              alt="Preview" 
                              className="w-full h-40 object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          JPG, PNG atau GIF. Maksimal {MAX_FILE_SIZE_MB}MB
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Deskripsi
                        </label>
                        <textarea
                          value={slide.desc}
                          onChange={(e) => updateSlide(slide.id, 'desc', e.target.value)}
                          placeholder="Masukkan deskripsi slide..."
                          rows={3}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addSlide}
                className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl hover:border-indigo-500 hover:bg-indigo-500/10 transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-indigo-400"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Slide Baru</span>
              </button>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/admin/images-slideshow")}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={createMutation.isPending || isAnyImageUploading}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Simpan Slideshow
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-sm text-blue-400">
              <strong>Tips:</strong> Gunakan tombol ↑↓ untuk mengatur urutan slide. Data akan disimpan dalam format JSON ke database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}