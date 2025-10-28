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

export function DataTableProductInProvider({
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
                <TableHead>Product Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Provider Product</TableHead>
                <TableHead>Product ID From Provider</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Modal</TableHead>
                <TableHead>Amount Member</TableHead>
                <TableHead>Amount Seller</TableHead>
                <TableHead>Flash Sale</TableHead>
                <TableHead>Title Flash Sale</TableHead>
                <TableHead>Amount Flash Sale</TableHead>
                <TableHead>Expired Flash Sale</TableHead>
                <TableHead>Banner Flash Sale</TableHead>
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
                          src={item?.product_icon}
                          alt="product_icon"
                          width={100}
                          height={100}
                          unoptimized
                          className="object-contain w-full h-full"
                        />
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.product_title}</TableCell>
                      <TableCell>{item.provider_product_name}</TableCell>
                      <TableCell>{item.product_id_from_provider}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.modal}</TableCell>
                      <TableCell>{item.amount_member}</TableCell>
                      <TableCell>{item.amount_seller}</TableCell>
                      <TableCell>
                        {item.flash_sale === 1 ? <Check /> : <X />}
                      </TableCell>
                      <TableCell>{item.title_flash_sale}</TableCell>
                      <TableCell>{item.amount_flash_sale}</TableCell>
                      <TableCell>
                        {item.expired_flash_sale
                          ? new Date(item.expired_flash_sale).toLocaleString(
                              "id-ID"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Image
                          src={item?.banner_flash_sale}
                          alt="icon"
                          width={100}
                          height={100}
                          unoptimized
                          className="object-contain w-full h-full"
                        />
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
                  <TableCell colSpan={16} className="h-24 text-center">
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
