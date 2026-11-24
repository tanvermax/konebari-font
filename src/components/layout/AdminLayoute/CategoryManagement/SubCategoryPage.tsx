// components/layout/AdminLayoute/CategoryManagement/SubCategoryPage.tsx
import { useState, useMemo } from "react";
import { Plus, Trash2, Search, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useGetSubCategoriesQuery, useDeleteSubCategoryMutation } from "@/redux/features/subcategory/subcategory.api";
import { useGetCategoriesQuery } from "@/redux/features/category/category.api";
import SubCategoryFormDialog from "./SubCategoryFormDialog";

export default function SubCategoryPage() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: subCategories = [], isLoading, refetch } = useGetSubCategoriesQuery();
  const { data: mainCategories = [] } = useGetCategoriesQuery();
  const [deleteSubCategory, { isLoading: isDeleting }] = useDeleteSubCategoryMutation();

  // ✅ FIXED: Map parent name handling both populated object and raw ID string
  const getParentName = (categoryId: any) => {
    // 1. Jodi backend theke populate hoye object ashe (jemon: { _id: '...', name: 'Skin Care' })
    if (categoryId && typeof categoryId === 'object' && categoryId.name) {
      return categoryId.name;
    }
    
    // 2. Jodi sudhu string ID ashe
    const idString = typeof categoryId === 'object' ? categoryId._id : categoryId;
    const list = Array.isArray(mainCategories) ? mainCategories : [];
    return list.find((c: any) => c._id === idString)?.name || "Unknown";
  };

  const filtered = useMemo(() => {
    const list = Array.isArray(subCategories) ? subCategories : [];
    return list.filter((sub: any) => sub.name.toLowerCase().includes(search.toLowerCase()));
  }, [subCategories, search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSubCategory(deleteId).unwrap();
      toast.success("Sub-Category deleted");
      setDeleteId(null);
    } catch (err: any) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Sub-Categories</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage product sub-categories</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white gap-2">
          <Plus className="w-4 h-4" /> Add Sub-Category
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search sub-categories..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10" />
      </div>

      <Card className="border-border/40">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-rose-500" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">No sub-categories found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Sub-Category</TableHead>
                    <TableHead>Parent Category</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((sub: any) => (
                    <TableRow key={sub._id}>
                      <TableCell>
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden">
                          {sub.image ? <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-muted-foreground/40" />}
                        </div>
                      </TableCell>
                      <TableCell><p className="font-medium text-sm">{sub.name}</p></TableCell>
                      <TableCell>
                        <span className="text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                          {/* ✅ Ekhane fixed function call hobe */}
                          {getParentName(sub.categoryId)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(sub._id)} className="h-8 w-8 text-red-500">
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

      <SubCategoryFormDialog open={formOpen} onClose={() => { setFormOpen(false); refetch(); }} />
      
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2">Delete Sub-Category?</h3>
            <p className="text-sm text-muted-foreground mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}