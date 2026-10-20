// components/layout/AdminLayoute/BrandManagement/BrandManagementPage.tsx
import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Search,
  Globe,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  useGetAllBrandsQuery,
  useDeleteBrandMutation,
  useToggleBrandStatusMutation,
} from "@/redux/features/brand/brand.api";
import BrandFormDialog from "./BrandFormDialog";

export default function BrandManagementPage() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

const { data: brands = [], isLoading, refetch } = useGetAllBrandsQuery({
  activeOnly: "false",
});

  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();
  const [toggleStatus] = useToggleBrandStatusMutation();

  const filtered = brands.filter((b: any) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBrand(deleteId).unwrap();
      toast.success("Brand deleted successfully");
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete brand");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success("Status updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const openCreate = () => {
    setEditingBrand(null);
    setFormOpen(true);
  };

  const openEdit = (brand: any) => {
    setEditingBrand(brand);
    setFormOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Brand Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage brands shown on the homepage slider
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {/* Table */}
      <Card className="border-border/40">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No brands found. Click "Add Brand" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Logo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Website</TableHead>
                    <TableHead className="hidden sm:table-cell">Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((brand: any) => (
                    <TableRow key={brand._id}>
                      <TableCell>
                        <GripVertical className="w-4 h-4 text-muted-foreground/40" />
                      </TableCell>
                      <TableCell>
                        <div className="w-16 h-10 rounded-md bg-stone-100 dark:bg-stone-900 flex items-center justify-center overflow-hidden p-1">
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{brand.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            /{brand.slug}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {brand.website ? (
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Globe className="w-3 h-3" />
                            Visit
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-xs font-mono">
                          {brand.displayOrder ?? 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            brand.isActive
                              ? "bg-emerald-100 text-emerald-700 border-0"
                              : "bg-stone-200 text-stone-600 border-0"
                          }
                        >
                          {brand.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggle(brand._id)}
                            className="h-8 w-8"
                            title={brand.isActive ? "Deactivate" : "Activate"}
                          >
                            {brand.isActive ? (
                              <Eye className="w-4 h-4 text-emerald-500" />
                            ) : (
                               <EyeOff className="w-4 h-4 text-amber-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(brand)}
                            className="h-8 w-8"
                          >
                            <Pencil className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(brand._id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <BrandFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingBrand(null);
          refetch();
        }}
        brand={editingBrand}
      />

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o:any) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this brand?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The brand logo will also be removed
              from Cloudinary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}