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
import { Check, X } from "lucide-react";
import Image from "next/image";

export function DataTableNews({
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
  return (
    <div className="grid grid-cols-1">
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image Hero</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length > 0 ? (
                data.map((item, index) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell className={``}>
                        <Image
                          src={item?.image_hero}
                          alt="Immage Hero"
                          width={50}
                          height={50}
                          unoptimized
                          className="object-contain w-60 h-full"
                        />
                      </TableCell>
                      
                      <TableCell>{item.title}</TableCell>

                      <TableCell>
                        {(() => {
                          try {
                            const tags = JSON.parse(item.tags);
                            return (
                              <ul className="list-disc pl-4 space-y-1">
                                {tags.map((t, idx) => (
                                  <li key={idx}>{t.name} (order: {t.order})</li>
                                ))}
                              </ul>
                            );
                          } catch {
                            return <span className="text-gray-500">Invalid tags</span>;
                          }
                        })()}
                      </TableCell>

                      <TableCell>{item.is_active === 1 ? "Active" : "Inactive"}</TableCell>

                      <TableCell>
                        <ActionMenu
                          isDelete={true}
                          isEdit={true}
                          onEdit={() => onEdit(item.id)}
                          onDelete={() => onDelete(item.id)}
                          isView={false}
                        />
                      </TableCell>
                    </TableRow>
                  );
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
