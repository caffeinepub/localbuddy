import { useState } from 'react';
import { useGetCallerVendorProfile } from '../../hooks/queries/useVendors';
import { useAddMenuItem, useUpdateMenuItem, useRemoveMenuItem } from '../../hooks/mutations/useVendorMutations';
import { type MenuItem } from '../../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Plus, Edit, Trash2 } from 'lucide-react';
import LoadingState from '../states/LoadingState';
import EmptyState from '../states/EmptyState';
import { toast } from 'sonner';

export default function MenuItemsEditor() {
  const { data: vendorProfile, isLoading } = useGetCallerVendorProfile();
  const addMenuItem = useAddMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const removeMenuItem = useRemoveMenuItem();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true,
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', isAvailable: true });
    setEditingItem(null);
  };

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        isAvailable: item.isAvailable,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (editingItem) {
      // Update existing item
      updateMenuItem.mutate(
        {
          id: editingItem.id,
          name: formData.name.trim(),
          description: formData.description.trim(),
          price,
          isAvailable: formData.isAvailable,
        },
        {
          onSuccess: () => {
            toast.success('Menu item updated!');
            setIsDialogOpen(false);
            resetForm();
          },
          onError: (error) => {
            toast.error(`Failed to update item: ${error.message}`);
          },
        }
      );
    } else {
      // Add new item
      addMenuItem.mutate(
        {
          id: BigInt(0), // Backend will assign ID
          name: formData.name.trim(),
          description: formData.description.trim(),
          price,
          isAvailable: formData.isAvailable,
        },
        {
          onSuccess: () => {
            toast.success('Menu item added!');
            setIsDialogOpen(false);
            resetForm();
          },
          onError: (error) => {
            toast.error(`Failed to add item: ${error.message}`);
          },
        }
      );
    }
  };

  const handleDelete = (itemId: bigint) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      removeMenuItem.mutate(itemId, {
        onSuccess: () => {
          toast.success('Menu item deleted');
        },
        onError: (error) => {
          toast.error(`Failed to delete item: ${error.message}`);
        },
      });
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading your menu..." />;
  }

  const menuItems = vendorProfile?.menu || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Menu Items</CardTitle>
            <CardDescription>Add and manage your menu items</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Update the details of your menu item' : 'Add a new item to your menu'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name *</Label>
                  <Input
                    id="itemName"
                    placeholder="e.g., Chicken Taco"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemDescription">Description *</Label>
                  <Textarea
                    id="itemDescription"
                    placeholder="Describe the item..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemPrice">Price ($) *</Label>
                  <Input
                    id="itemPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 5.99"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="itemAvailable"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                  />
                  <Label htmlFor="itemAvailable" className="cursor-pointer">
                    Available for customers
                  </Label>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={addMenuItem.isPending || updateMenuItem.isPending}
                    className="flex-1"
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {menuItems.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="No Menu Items"
            description="Add your first menu item to let customers know what you offer"
          />
        ) : (
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.id.toString()}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <Badge variant={item.isAvailable ? 'default' : 'secondary'}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <p className="text-lg font-semibold text-primary">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                      disabled={removeMenuItem.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
