import { DataImagesSlideshowList } from "@/features/admin/images-slideshow/data-images-slideshow-list";

export default async function page() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <DataImagesSlideshowList/>
        </div>
    )
}