import { ActionMenu } from "@/components/global/table/action-menu";
import PaginationBar from "@/components/global/table/pagination-bar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export function DataTableImagesSlideshow({
  data,
  pageCount,
  page,
  pageIndex,
  pageSize,
  onPerPageChange,
  onPageChange,
  resPerPage,
  onEdit,
  onDelete,
  onView,
}) {
  console.log("data", data);
  
  return (
    <div className="grid grid-cols-1">
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data Slider</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length > 0 ? (
                data.map((item) => {
                  const sliders = JSON.parse(item.data_slider); // ⬅️ parse JSON

                  return sliders.map((slide) => (
                    <TableRow key={slide.id}>
                      <TableCell>
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          width={120}
                          height={70}
                          unoptimized
                          className="object-cover rounded-md"
                        />
                      </TableCell>

                      <TableCell>{slide.title}</TableCell>
                      <TableCell>{slide.desc}</TableCell>
                      <TableCell>{slide.order}</TableCell>

                      <TableCell>
                        <ActionMenu
                          isDelete={true}
                          isEdit={true}
                          isView={false}
                          onEdit={() => onEdit(item.id)}
                          onDelete={() => onDelete(item.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ));
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={12} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <PaginationBar
        pageSize={pageSize}
        page={page}
        handlePerPage={onPerPageChange}
        pageCount={pageCount}
        pageIndex={pageIndex}
        handlePage={onPageChange}
        resPerPage={resPerPage}
      />
    </div>
  );
}
