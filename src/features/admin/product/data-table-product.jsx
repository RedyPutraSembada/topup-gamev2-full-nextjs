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

export function DataTableProduct({
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
                <TableHead>Image Thumbnail</TableHead>
                <TableHead>Image Cover</TableHead>
                <TableHead>Best Seller</TableHead>
                <TableHead>Type Product</TableHead>
                <TableHead>Kode</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Data Input</TableHead>
                <TableHead>Type Data Product</TableHead>
                <TableHead>Check Username</TableHead>
                <TableHead>Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length > 0 ? (
                data.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Image
                          src={item?.image_thumbnail}
                          alt="thumbnail"
                          width={100}
                          height={100}
                          unoptimized
                          className="object-contain w-full h-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Image
                          src={item?.image_cover}
                          alt="cover"
                          width={100}
                          height={100}
                          unoptimized
                          className="object-contain w-full h-full"
                        />
                      </TableCell>
                      <TableCell>
                        {item.best_seller === 1 ? <Check /> : <X />}
                      </TableCell>
                      <TableCell>{item.type_product_name}</TableCell>
                      <TableCell>{item.kode}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {item.description}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          try {
                            const dataList = JSON.parse(item.data_input);
                            return (
                              <ul className="list-disc pl-5 space-y-1">
                                {dataList.map((field) => (
                                  <li key={field.id}>
                                    <strong>{field.label}:</strong>{" "}
                                    {field.placeholder}
                                  </li>
                                ))}
                              </ul>
                            );
                          } catch (error) {
                            return (
                              <span className="text-gray-500">
                                Invalid data
                              </span>
                            );
                          }
                        })()}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          try {
                            const dataList = JSON.parse(item.type_data_product);
                            return (
                              <ul className="list-disc pl-4 space-y-1">
                                {dataList.map((d, index) => (
                                  <li key={index}>
                                    {d.name} (order: {d.order})
                                  </li>
                                ))}
                              </ul>
                            );
                          } catch {
                            return (
                              <span className="text-gray-500">
                                Invalid data
                              </span>
                            );
                          }
                        })()}
                      </TableCell>

                      <TableCell>
                        {item.is_check_username === 1 ? <Check /> : <X />}
                      </TableCell>
                      <TableCell>
                        {item.is_active === 1 ? "Active" : "Inactive"}
                      </TableCell>
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
