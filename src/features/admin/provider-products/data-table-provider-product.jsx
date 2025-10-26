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

export function DataTableProviderProduct({
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
                <TableHead>Name</TableHead>
                <TableHead>Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length > 0 ? (
                data.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.is_active === 1 ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell>
                        <ActionMenu
                          isDelete={true}
                          isEdit={true}
                          onEdit={() => onEdit(item)}
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
