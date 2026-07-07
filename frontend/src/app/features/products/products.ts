import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import {
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  LucideAngularModule,
  Package,
  Pencil,
  Plus,
  Power,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
  Tag,
  Trash2
} from 'lucide-angular';

import { ProductCategory } from '../../core/models/category.model';
import {
  DiscountType,
  Product,
  ProductCreate,
  ProductFieldEntry,
  ProductUpdate
} from '../../core/models/product.model';
import { Supplier } from '../../core/models/supplier.model';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { SupplierService } from '../../core/services/supplier.service';
import { ToastService } from '../../core/services/toast.service';
import { BadgeComponent } from '../../shared/components/badge/badge';
import { DrawerComponent } from '../../shared/components/drawer/drawer';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

type CatalogFilter = 'all' | 'featured' | 'on-offer';

interface ProductMediaAsset {
  url: string;
  publicId: string | null;
}

interface ProductCatalogFormData {
  name: string;
  sku: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  image_public_id: string | null;
  image_urls: string[];
  image_public_ids: Array<string | null>;
  category_id: number | null;
  supplier_id: number | null;
  release_year: number | null;
  is_featured: boolean;
  purchase_price: number;
  selling_price: number;
  discount_type: DiscountType;
  discount_value: number;
  offer_starts_on: string | null;
  offer_ends_on: string | null;
  tax_rate: number;
  shipping_fee: number;
  additional_cost: number;
  attributes: ProductFieldEntry[];
  specifications: ProductFieldEntry[];
}

@Component({
  selector: 'app-products',
  imports: [
    BadgeComponent,
    DrawerComponent,
    EmptyStateComponent,
    FormsModule,
    LoadingStateComponent,
    LucideAngularModule,
    PageHeaderComponent
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class ProductsComponent implements OnInit {
  protected searchTerm = '';
  protected statusFilter = 'all';
  protected catalogFilter: CatalogFilter = 'all';

  protected products: Product[] = [];
  protected categories: ProductCategory[] = [];
  protected suppliers: Supplier[] = [];

  protected isLoading = false;
  protected isSubmitting = false;
  protected errorMessage = '';
  protected formError = '';

  protected isFormOpen = false;
  protected editingProduct: Product | null = null;

  protected productName = '';
  protected sku = '';
  protected shortDescription = '';
  protected description = '';
  protected primaryImage: ProductMediaAsset | null = null;
  protected galleryImages: ProductMediaAsset[] = [];
  protected isUploadingMedia = false;
  protected mediaError = '';
  protected categoryId = '';

  private transientMediaPublicIds = new Set<string>();
  protected supplierId = '';
  protected releaseYear: number | null = null;
  protected productIsFeatured = false;
  protected purchasePrice: number | null = 0;
  protected sellingPrice: number | null = 0;
  protected discountType: DiscountType = 'none';
  protected discountValue: number | null = 0;
  protected offerStartsOn = '';
  protected offerEndsOn = '';
  protected taxRate: number | null = 0;
  protected shippingFee: number | null = 0;
  protected additionalCost: number | null = 0;
  protected currentStock: number | null = 0;
  protected lowStockThreshold: number | null = 0;
  protected attributes: ProductFieldEntry[] = [];
  protected specifications: ProductFieldEntry[] = [];
  protected productIsActive = true;

  protected readonly plusIcon = Plus;
  protected readonly searchIcon = Search;
  protected readonly filterIcon = SlidersHorizontal;
  protected readonly productIcon = Package;
  protected readonly imageIcon = ImageIcon;
  protected readonly starIcon = Star;
  protected readonly tagIcon = Tag;
  protected readonly editIcon = Pencil;
  protected readonly deactivateIcon = Power;
  protected readonly restoreIcon = RotateCcw;
  protected readonly deleteIcon = Trash2;
  protected readonly alertIcon = AlertTriangle;
  protected readonly activeIcon = CheckCircle2;

  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly supplierService: SupplierService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPageData();
  }

  protected loadPageData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      products: this.productService.getProducts(),
      categories: this.categoryService.getProductCategories(),
      suppliers: this.supplierService.getSuppliers()
    }).subscribe({
      next: ({ products, categories, suppliers }) => {
        this.products = products;
        this.categories = categories;
        this.suppliers = suppliers;
        this.isLoading = false;
      },
      error: () => {
        this.products = [];
        this.categories = [];
        this.suppliers = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load products.';
      }
    });
  }

  protected openCreateForm(): void {
    this.isFormOpen = true;
    this.editingProduct = null;
    this.resetProductForm();
  }

  protected openEditForm(product: Product): void {
    this.isFormOpen = true;
    this.editingProduct = product;
    this.productName = product.name;
    this.sku = product.sku;
    this.shortDescription = product.short_description || '';
    this.description = product.description || '';
    this.primaryImage = product.image_url
      ? { url: product.image_url, publicId: product.image_public_id || null }
      : null;
    this.galleryImages = (product.image_urls || []).map((url, index) => ({
      url,
      publicId: product.image_public_ids?.[index] || null
    }));
    this.transientMediaPublicIds.clear();
    this.mediaError = '';
    this.categoryId = product.category_id ? String(product.category_id) : '';
    this.supplierId = product.supplier_id ? String(product.supplier_id) : '';
    this.releaseYear = product.release_year;
    this.productIsFeatured = product.is_featured;
    this.purchasePrice = Number(product.purchase_price);
    this.sellingPrice = Number(product.selling_price);
    this.discountType = product.discount_type;
    this.discountValue = Number(product.discount_value);
    this.offerStartsOn = product.offer_starts_on || '';
    this.offerEndsOn = product.offer_ends_on || '';
    this.taxRate = Number(product.tax_rate);
    this.shippingFee = Number(product.shipping_fee);
    this.additionalCost = Number(product.additional_cost);
    this.currentStock = product.current_stock;
    this.lowStockThreshold = product.low_stock_threshold;
    this.attributes = this.cloneFieldEntries(product.attributes);
    this.specifications = this.cloneFieldEntries(product.specifications);
    this.productIsActive = product.is_active;
    this.formError = '';
  }

  protected closeForm(): void {
    this.discardTransientUploads();
    this.isFormOpen = false;
    this.editingProduct = null;
    this.formError = '';
    this.mediaError = '';
  }

  protected clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.catalogFilter = 'all';
  }

  protected onPrimaryImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) {
      return;
    }

    this.uploadMediaFile(file, (uploadedImage) => {
      const previousPrimaryImage = this.primaryImage;
      this.primaryImage = uploadedImage;
      this.deleteTransientImage(previousPrimaryImage);
    });
  }

  protected onGalleryImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    input.value = '';

    if (!files.length) {
      return;
    }

    const remainingSlots = 5 - this.galleryImages.length;

    if (files.length > remainingSlots) {
      this.mediaError = `You can upload ${remainingSlots} more gallery image${remainingSlots === 1 ? '' : 's'}.`;
      return;
    }

    this.uploadGalleryFiles(files);
  }

  protected removePrimaryImage(): void {
    const previousPrimaryImage = this.primaryImage;
    this.primaryImage = null;
    this.deleteTransientImage(previousPrimaryImage);
  }

  protected removeGalleryImage(index: number): void {
    const [removedImage] = this.galleryImages.splice(index, 1);
    this.deleteTransientImage(removedImage);
  }

  protected addAttribute(): void {
    this.attributes.push({ name: '', value: '' });
  }

  protected removeAttribute(index: number): void {
    this.attributes.splice(index, 1);
  }

  protected addSpecification(): void {
    this.specifications.push({ name: '', value: '' });
  }

  protected removeSpecification(index: number): void {
    this.specifications.splice(index, 1);
  }

  protected handleDiscountTypeChange(): void {
    if (this.discountType === 'none') {
      this.discountValue = 0;
      this.offerStartsOn = '';
      this.offerEndsOn = '';
    }
  }

  protected handleSubmit(): void {
    this.formError = '';

    if (this.isUploadingMedia) {
      this.mediaError = 'Wait for the image upload to finish before saving the product.';
      return;
    }

    const catalogData = this.buildCatalogFormData();

    if (!catalogData) {
      return;
    }

    if (
      this.currentStock === null ||
      this.lowStockThreshold === null ||
      this.currentStock < 0 ||
      this.lowStockThreshold < 0
    ) {
      this.formError = 'Inventory values must be zero or greater.';
      return;
    }

    this.isSubmitting = true;

    if (this.editingProduct) {
      const payload: ProductUpdate = {
        version: this.editingProduct.version,
        ...catalogData,
        low_stock_threshold: this.lowStockThreshold,
        is_active: this.productIsActive
      };

      this.productService.updateProduct(this.editingProduct.id, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.markUploadedMediaAsPersisted();
          this.toastService.success('Product updated', 'Product catalogue details were updated successfully.');
          this.closeForm();
          this.loadPageData();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.formError = error?.error?.detail || 'Unable to update product.';
          this.toastService.error('Update failed', this.formError);
        }
      });

      return;
    }

    const payload: ProductCreate = {
      ...catalogData,
      current_stock: this.currentStock,
      low_stock_threshold: this.lowStockThreshold
    };

    this.productService.createProduct(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.markUploadedMediaAsPersisted();
        this.toastService.success('Product created', 'New product was added to the catalogue successfully.');
        this.closeForm();
        this.loadPageData();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError = error?.error?.detail || 'Unable to create product.';
        this.toastService.error('Create failed', this.formError);
      }
    });
  }

  protected deactivateProduct(product: Product): void {
    const confirmed = confirm(`Deactivate product "${product.name}"?`);

    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(product.id, product.version).subscribe({
      next: () => {
        this.toastService.success('Product deactivated', `${product.name} is now inactive.`);
        this.loadPageData();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to deactivate product.';
        this.toastService.error('Deactivate failed', this.errorMessage);
      }
    });
  }

  protected restoreProduct(product: Product): void {
    const confirmed = confirm(`Restore product "${product.name}"?`);

    if (!confirmed) {
      return;
    }

    this.productService.updateProduct(product.id, {
      version: product.version,
      is_active: true
    }).subscribe({
      next: () => {
        this.toastService.success('Product restored', `${product.name} is active again.`);
        this.loadPageData();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Unable to restore product.';
        this.toastService.error('Restore failed', this.errorMessage);
      }
    });
  }

  protected get activeCategories(): ProductCategory[] {
    return this.categories.filter((category) => category.is_active);
  }

  protected get activeSuppliers(): Supplier[] {
    return this.suppliers.filter((supplier) => supplier.is_active);
  }

  protected get filteredProducts(): Product[] {
    const searchValue = this.searchTerm.trim().toLowerCase();

    return this.products.filter((product) => {
      const isLowStock = product.current_stock <= product.low_stock_threshold;

      const matchesSearch =
        product.name.toLowerCase().includes(searchValue) ||
        product.sku.toLowerCase().includes(searchValue) ||
        (product.short_description || '').toLowerCase().includes(searchValue) ||
        this.getCategoryName(product.category_id).toLowerCase().includes(searchValue) ||
        this.getSupplierName(product.supplier_id).toLowerCase().includes(searchValue);

      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'active' && product.is_active && !isLowStock) ||
        (this.statusFilter === 'low-stock' && product.is_active && isLowStock) ||
        (this.statusFilter === 'inactive' && !product.is_active);

      const matchesCatalog =
        this.catalogFilter === 'all' ||
        (this.catalogFilter === 'featured' && product.is_featured) ||
        (this.catalogFilter === 'on-offer' && this.isProductOfferActive(product));

      return matchesSearch && matchesStatus && matchesCatalog;
    });
  }

  protected get activeProductCount(): number {
    return this.products.filter((product) => product.is_active).length;
  }

  protected get lowStockCount(): number {
    return this.products.filter(
      (product) => product.is_active && product.current_stock <= product.low_stock_threshold
    ).length;
  }

  protected get featuredProductCount(): number {
    return this.products.filter((product) => product.is_featured && product.is_active).length;
  }

  protected get activeOfferCount(): number {
    return this.products.filter((product) => this.isProductOfferActive(product)).length;
  }

  protected get currentDraftPrice(): number {
    const price = Number(this.sellingPrice || 0);
    const discount = Number(this.discountValue || 0);

    if (this.discountType === 'percentage') {
      return Math.max(0, price * (1 - discount / 100));
    }

    if (this.discountType === 'fixed') {
      return Math.max(0, price - discount);
    }

    return price;
  }

  protected getCategoryName(categoryId: number | null): string {
    return this.categories.find((category) => category.id === categoryId)?.name || 'Uncategorized';
  }

  protected getSupplierName(supplierId: number | null): string {
    return this.suppliers.find((supplier) => supplier.id === supplierId)?.name || 'No supplier';
  }

  protected getProductStatus(product: Product): string {
    if (!product.is_active) {
      return 'Inactive';
    }

    if (product.current_stock <= product.low_stock_threshold) {
      return 'Low stock';
    }

    return 'Active';
  }

  protected getProductTone(product: Product): 'success' | 'warning' | 'neutral' {
    if (!product.is_active) {
      return 'neutral';
    }

    if (product.current_stock <= product.low_stock_threshold) {
      return 'warning';
    }

    return 'success';
  }

  protected getProductInitial(name: string): string {
    return name.trim().charAt(0).toUpperCase() || 'P';
  }

  protected isLowStock(product: Product): boolean {
    return product.is_active && product.current_stock <= product.low_stock_threshold;
  }

  protected isProductOfferActive(product: Product): boolean {
    if (!product.is_active || product.discount_type === 'none' || Number(product.discount_value) <= 0) {
      return false;
    }

    const today = this.getLocalDate();
    const startDate = this.toLocalDate(product.offer_starts_on);
    const endDate = this.toLocalDate(product.offer_ends_on);

    return (!startDate || startDate <= today) && (!endDate || endDate >= today);
  }

  protected getEffectiveSellingPrice(product: Product): number {
    const sellingPrice = Number(product.selling_price || 0);
    const discountValue = Number(product.discount_value || 0);

    if (product.discount_type === 'percentage') {
      return Math.max(0, sellingPrice * (1 - discountValue / 100));
    }

    if (product.discount_type === 'fixed') {
      return Math.max(0, sellingPrice - discountValue);
    }

    return sellingPrice;
  }

  protected getOfferLabel(product: Product): string {
    if (product.discount_type === 'percentage') {
      return `${Number(product.discount_value)}% off`;
    }

    if (product.discount_type === 'fixed') {
      return `${this.formatCurrency(product.discount_value)} off`;
    }

    return '';
  }

  protected getImageCount(product: Product): number {
    return (product.image_url ? 1 : 0) + (product.image_urls?.length || 0);
  }

  protected formatCurrency(value: string | number): string {
    const numericValue = Number(value ?? 0);

    return `৳ ${numericValue.toLocaleString('en-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  }

  private resetProductForm(): void {
    this.productName = '';
    this.sku = '';
    this.shortDescription = '';
    this.description = '';
    this.primaryImage = null;
    this.galleryImages = [];
    this.isUploadingMedia = false;
    this.mediaError = '';
    this.transientMediaPublicIds.clear();
    this.categoryId = '';
    this.supplierId = '';
    this.releaseYear = null;
    this.productIsFeatured = false;
    this.purchasePrice = 0;
    this.sellingPrice = 0;
    this.discountType = 'none';
    this.discountValue = 0;
    this.offerStartsOn = '';
    this.offerEndsOn = '';
    this.taxRate = 0;
    this.shippingFee = 0;
    this.additionalCost = 0;
    this.currentStock = 0;
    this.lowStockThreshold = 0;
    this.attributes = [];
    this.specifications = [];
    this.productIsActive = true;
    this.formError = '';
  }

  private buildCatalogFormData(): ProductCatalogFormData | null {
    if (!this.productName.trim() || !this.sku.trim()) {
      this.formError = 'Product name and SKU are required.';
      return null;
    }

    const numericValues = [
      this.purchasePrice,
      this.sellingPrice,
      this.discountValue,
      this.taxRate,
      this.shippingFee,
      this.additionalCost
    ];

    if (numericValues.some((value) => value === null || value < 0)) {
      this.formError = 'Price, tax, shipping, additional cost, and offer values must be zero or greater.';
      return null;
    }

    if (this.releaseYear !== null && (!Number.isInteger(this.releaseYear) || this.releaseYear < 1900 || this.releaseYear > 2100)) {
      this.formError = 'Release year must be between 1900 and 2100.';
      return null;
    }

    if (this.taxRate !== null && this.taxRate > 100) {
      this.formError = 'Tax rate cannot exceed 100%.';
      return null;
    }

    if (this.discountType === 'none') {
      if (this.discountValue !== 0 || this.offerStartsOn || this.offerEndsOn) {
        this.formError = 'Clear the offer value and dates, or select a percentage or fixed offer.';
        return null;
      }
    } else {
      if (this.discountValue === null || this.discountValue <= 0) {
        this.formError = 'Offer value must be greater than zero.';
        return null;
      }

      if (this.discountType === 'percentage' && this.discountValue > 100) {
        this.formError = 'Percentage discount cannot exceed 100%.';
        return null;
      }

      if (
        this.discountType === 'fixed' &&
        this.sellingPrice !== null &&
        this.discountValue > this.sellingPrice
      ) {
        this.formError = 'Fixed discount cannot exceed the selling price.';
        return null;
      }

      if (this.offerStartsOn && this.offerEndsOn && this.offerStartsOn > this.offerEndsOn) {
        this.formError = 'Offer end date must be on or after the start date.';
        return null;
      }
    }

    const primaryImageUrl = this.primaryImage?.url || null;
    const primaryImagePublicId = this.primaryImage?.publicId || null;
    const additionalImageUrls = this.galleryImages.map((image) => image.url);
    const additionalImagePublicIds = this.galleryImages.map((image) => image.publicId);

    const attributes = this.normalizeFieldEntries(this.attributes, 'Attributes');
    const specifications = this.normalizeFieldEntries(this.specifications, 'Specifications');

    if (attributes === null || specifications === null) {
      return null;
    }

    return {
      name: this.productName.trim(),
      sku: this.sku.trim().toUpperCase(),
      short_description: this.shortDescription.trim() || null,
      description: this.description.trim() || null,
      image_url: primaryImageUrl,
      image_public_id: primaryImagePublicId,
      image_urls: additionalImageUrls,
      image_public_ids: additionalImagePublicIds,
      category_id: this.categoryId ? Number(this.categoryId) : null,
      supplier_id: this.supplierId ? Number(this.supplierId) : null,
      release_year: this.releaseYear,
      is_featured: this.productIsFeatured,
      purchase_price: Number(this.purchasePrice),
      selling_price: Number(this.sellingPrice),
      discount_type: this.discountType,
      discount_value: Number(this.discountValue),
      offer_starts_on: this.offerStartsOn || null,
      offer_ends_on: this.offerEndsOn || null,
      tax_rate: Number(this.taxRate),
      shipping_fee: Number(this.shippingFee),
      additional_cost: Number(this.additionalCost),
      attributes,
      specifications
    };
  }

  private normalizeFieldEntries(
    entries: ProductFieldEntry[],
    label: string
  ): ProductFieldEntry[] | null {
    const normalized = entries
      .map((entry) => ({
        name: entry.name.trim(),
        value: entry.value.trim()
      }))
      .filter((entry) => entry.name || entry.value);

    if (normalized.some((entry) => !entry.name || !entry.value)) {
      this.formError = `${label} require both a name and a value.`;
      return null;
    }

    const normalizedNames = normalized.map((entry) => entry.name.toLocaleLowerCase());

    if (new Set(normalizedNames).size !== normalizedNames.length) {
      this.formError = `${label} cannot contain duplicate names.`;
      return null;
    }

    return normalized;
  }

  private cloneFieldEntries(entries: ProductFieldEntry[] | null | undefined): ProductFieldEntry[] {
    return (entries || []).map((entry) => ({ name: entry.name, value: entry.value }));
  }

  private uploadGalleryFiles(files: File[], index = 0): void {
    if (index >= files.length) {
      return;
    }

    this.uploadMediaFile(
      files[index],
      (uploadedImage) => {
        this.galleryImages.push(uploadedImage);
        this.uploadGalleryFiles(files, index + 1);
      },
      () => {
        // Stop the queue after the first failure so the user can fix the reported file problem.
      }
    );
  }

  private uploadMediaFile(
    file: File,
    onSuccess: (uploadedImage: ProductMediaAsset) => void,
    onError?: () => void
  ): void {
    const clientValidationError = this.getImageFileValidationError(file);

    if (clientValidationError) {
      this.mediaError = clientValidationError;
      onError?.();
      return;
    }

    this.mediaError = '';
    this.isUploadingMedia = true;

    this.productService.uploadProductImage(file).subscribe({
      next: (uploadedImage) => {
        this.isUploadingMedia = false;

        const mediaAsset: ProductMediaAsset = {
          url: uploadedImage.url,
          publicId: uploadedImage.public_id
        };

        this.transientMediaPublicIds.add(uploadedImage.public_id);
        onSuccess(mediaAsset);
      },
      error: (error) => {
        this.isUploadingMedia = false;
        this.mediaError = error?.error?.detail || 'Image upload failed. Choose a JPG, PNG, or WebP image up to 5 MB.';
        onError?.();
      }
    });
  }

  private getImageFileValidationError(file: File): string | null {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maximumBytes = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return 'Use a JPG, PNG, or WebP image.';
    }

    if (file.size > maximumBytes) {
      return 'Image must be 5 MB or smaller.';
    }

    return null;
  }

  private deleteTransientImage(image: ProductMediaAsset | null | undefined): void {
    if (!image?.publicId || !this.transientMediaPublicIds.has(image.publicId)) {
      return;
    }

    this.transientMediaPublicIds.delete(image.publicId);
    this.productService.deleteProductImages([image.publicId]).subscribe({
      error: () => {
        // Keep the UI responsive. A failed storage cleanup does not invalidate the product form.
      }
    });
  }

  private discardTransientUploads(): void {
    const publicIds = Array.from(this.transientMediaPublicIds);
    this.transientMediaPublicIds.clear();

    if (!publicIds.length) {
      return;
    }

    this.productService.deleteProductImages(publicIds).subscribe({
      error: () => {
        // Product records are untouched; only a cancelled, unused upload could remain in storage.
      }
    });
  }

  private markUploadedMediaAsPersisted(): void {
    this.transientMediaPublicIds.clear();
  }

  private getLocalDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  private toLocalDate(value: string | null): Date | null {
    if (!value) {
      return null;
    }

    const [year, month, day] = value.split('-').map(Number);

    if (!year || !month || !day) {
      return null;
    }

    return new Date(year, month - 1, day);
  }
}
