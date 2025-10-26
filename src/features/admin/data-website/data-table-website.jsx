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

export function DataTableDataWebsite({
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
                <TableHead>logo</TableHead>
                <TableHead>title web</TableHead>
                <TableHead>slogan web</TableHead>
                <TableHead>description web</TableHead>
                <TableHead>url wa</TableHead>
                <TableHead>url ig</TableHead>
                <TableHead>url tt</TableHead>
                <TableHead>url yt</TableHead>
                <TableHead>url fb</TableHead>
                <TableHead>Sign In Image</TableHead>
                <TableHead>Sign Up Image</TableHead>
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
                          src={item?.logo}
                          alt="logo"
                          width={100}
                          height={100}
                          unoptimized
                          className="object-contain w-full h-full"
                        />
                      </TableCell>
                      <TableCell>{item.title_web}</TableCell>
                      <TableCell>{item.slogan_web}</TableCell>
                      <TableCell>{item.desc_web}</TableCell>
                      <TableCell>{item.url_wa}</TableCell>
                      <TableCell>{item.url_ig}</TableCell>
                      <TableCell>{item.url_tt}</TableCell>
                      <TableCell>{item.url_yt}</TableCell>
                      <TableCell>{item.url_fb}</TableCell>
                      <TableCell>
                        <Image
                          src={item?.signin_image}
                          alt="signin"
                          width={100}
                          height={100}
                          unoptimized
                          className="object-contain w-full h-full rounded-md"
                        />
                      </TableCell>

                      <TableCell>
                        <Image
                          src={item?.signup_image}
                          alt="signup"
                          width={100}
                          height={100}
                          unoptimized
                          className="object-contain w-full h-full rounded-md"
                        />
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
