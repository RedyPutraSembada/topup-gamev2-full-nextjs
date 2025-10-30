"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { X } from "lucide-react";
import { DataTableVoucher } from "./data-table-voucher";
import { useGetVoucher } from "@/data/admin/voucher/voucher-datas";
import { deleteVoucher } from "@/actions/admin/voucher/voucher";

export function DataVoucherList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [resetSignal, setResetSignal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const resPerPage = [5, 10, 20, 50];

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const initialFilterState = {
    name: "",
  };

  const [filter, setFilter] = useState(initialFilterState);

  const [debouncedName] = useDebounce(filter.name, 1000);

  const { data, error, isLoading, refetch } = useGetVoucher(
    {
      ...filter,
      name: debouncedName,
    },
    page,
    pageSize
  );

  const handleNameChange = (value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      name: value,
    }));
  };

  const handleResetFilter = () => {
    setFilter(initialFilterState);
    setResetSignal(true);
    setTimeout(() => setResetSignal(false), 0);
  };

  const isFilterActive = Object.entries(filter).some(
    ([key, value]) =>
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === "string" && value !== "")
  );

  const handlePerPageChange = (value) => {
    const newPageSize = value === "all" ? -1 : Number(value);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setPage(1);
    }
  };

  const handlePageChange = (value) => {
    setPage(value);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voucher"] });
      setDeleteConfirm(null);
      toast.success("Voucher deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleEdit = (values) => {
    router.push("/admin/voucher/" + values + "/edit");
  };

  const handleDelete = (values) => {
    setDeleteConfirm({ id: values });
  };

  // const { data, error, isLoading, refetch } = useGetEvents(
  //     {
  //     ...filter,
  //     categories: debouncedCategories,
  //     title: debouncedTitle,
  //     status: debouncedStatus,
  //     },
  //     page,
  //     pageSize
  // )
  return (
    <div className="container mx-auto py-10 pt-0">
      <div className="flex justify-between items-center mb-6">
        {/* Filter */}
        <div>
          <div className="hidden md:flex md:flex-1 md:items-center md:space-x-2">
            <Input
              placeholder="Filter name..."
              value={filter.name}
              onChange={(event) => handleNameChange(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
            {isFilterActive && (
              <Button
                variant="destructive"
                onClick={handleResetFilter}
                className="h-8 px-2 lg:px-3"
              >
                Reset
                <X />
              </Button>
            )}
          </div>
          <div className="flex md:hidden">
            <Credenza>
              <CredenzaTrigger asChild>
                <Button>Filter</Button>
              </CredenzaTrigger>
              <CredenzaContent>
                <CredenzaHeader>
                  <CredenzaTitle>Filter</CredenzaTitle>
                  <CredenzaDescription>Filter News.</CredenzaDescription>
                </CredenzaHeader>
                <CredenzaBody className="flex flex-col space-y-2">
                  <Input
                    placeholder="Filter name..."
                    value={filter.name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    className="h-8 "
                  />
                  {isFilterActive && (
                    <Button
                      variant="destructive"
                      onClick={handleResetFilter}
                      className="h-8 px-2 lg:px-3"
                    >
                      Reset
                    </Button>
                  )}
                </CredenzaBody>
                <CredenzaFooter>
                  <CredenzaClose asChild>
                    <Button>Close</Button>
                  </CredenzaClose>
                </CredenzaFooter>
              </CredenzaContent>
            </Credenza>
          </div>
        </div>
        <div>
          <Link
            href="/admin/voucher/create"
            className={buttonVariants({ variant: "default" })}
          >
            Add
          </Link>
        </div>
      </div>
      <>
        <DataTableVoucher
          data={data?.data}
          pageCount={Math.ceil((data?.total || 0) / pageSize)}
          page={page}
          pageIndex={page - 1}
          pageSize={pageSize}
          onPerPageChange={handlePerPageChange}
          onPageChange={handlePageChange}
          resPerPage={resPerPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <ConfirmationDialog
          open={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="Are you sure?"
          description={`This action cannot be undone. This will permanently delete data.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteMutation.isPending}
          onConfirm={() => {
            if (deleteConfirm) {
              deleteMutation.mutate(deleteConfirm.id);
            }
          }}
        />
      </>
    </div>
  );
}
