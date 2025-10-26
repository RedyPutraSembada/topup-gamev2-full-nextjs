"use client";

import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { DataTableTypeProduct } from "./data-table-type-product";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { useGetTypeProduct } from "@/data/admin/type-product/type-product-datas";
import {
  createTypeProduct,
  deleteTypeProduct,
  updateTypeProduct,
} from "@/actions/admin/type-product/data-type-product";

const formSchema = z.object({
  name: z.string().min(1),
  is_active: z.string(),
});

export function TypeProductList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [idTypeProduct, setIdTypeProduct] = useState(0);
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

  const { data, error, isLoading, refetch } = useGetTypeProduct(
    {
      ...filter,
      name: debouncedName,
    },
    page,
    pageSize
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      is_active: "0",
    },
  });

  const { watch, setValue, clearErrors, setError, reset } = form;

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

  const createMutation = useMutation({
    mutationFn: createTypeProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["type-product"] });
      setOpen(false);
      reset();
      toast.success("Type Product created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTypeProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["type-product"] });
      setOpen(false);
      setIdTypeProduct(0);
      reset();
      toast.success("Type Product updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTypeProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["type-product"] });
      setDeleteConfirm(null);
      toast.success("Type Product deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleEdit = (values) => {
    setIdTypeProduct(values.id);
    setValue("name", values.name);
    setValue("is_active", `${values.is_active}`);
    setOpen(true);
  };

  const handleDelete = (values) => {
    setDeleteConfirm({ id: values });
  };

  async function onSubmit(values) {
    const payload = {
      ...values,
      is_active: values.is_active === "1" ? 1 : 0,
    };
    try {
      await createMutation.mutateAsync(payload);
    } catch (error) {
      console.error("Failed to create Type Product:", error);
    }
  }

  async function onUpdate(values) {
    const payload = {
      ...values,
      id: idTypeProduct,
      is_active: values.is_active === "1" ? 1 : 0, // Ubah is_active menjadi 1 atau 0
    };

    try {
      await updateMutation.mutateAsync(payload);
    } catch (error) {
      console.error("Failed to update Type Product:", error);
    }
  }

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
                    placeholder="Filter title..."
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Type Product</DialogTitle>
                <DialogDescription>
                  Make changes to your type here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(
                      idTypeProduct !== 0 ? onUpdate : onSubmit
                    )}
                    className="space-y-8 "
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="input name"
                              type=""
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is your public display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Active</SelectItem>
                              <SelectItem value="0">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            status type product.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <AlertDialogFooter>
                      <Button type="submit">Save changes</Button>
                    </AlertDialogFooter>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <>
        <DataTableTypeProduct
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
