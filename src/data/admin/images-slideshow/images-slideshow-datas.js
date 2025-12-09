import { getDataImageSlideShow, getImageSlideShow } from "@/actions/admin/images-slideshow/images-slideshow";
import { useQuery } from "@tanstack/react-query";

export function useGetImageSlideShow(page, pageSize) {
  return useQuery({
    queryFn: async () => getImageSlideShow(page, pageSize),
    queryKey: ["images-slideshow", page, pageSize],
  });
}
