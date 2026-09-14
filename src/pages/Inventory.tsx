import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Search,
  ImagePlus,
  UploadCloud,
  X,
  Edit3,
  Trash2,
  Boxes,
  FileSpreadsheet,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import { formatCurrency } from "../utils/format";
import useDebounce from "../utils/useDebounce";
import api from "../api/axios";
import { Product } from "../types";

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    sku: "ART-001",
    name: "Sillón Lounge de Diseño",
    collection: "Línea Signature",
    description: "Diseño ergonómico premium con tapicería noble y estructura sólida.",
    materials: "Textil Italiano & Base en Madera Maciza",
    dimensions: "90 x 95 x 82 cm",
    price: 3450000,
    cost: 1800000,
    stock: 8,
    minStock: 2,
    inShowroom: true,
    isActive: true,
    categoryId: 1,
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    sku: "SRV-001",
    name: "Paquete de Consultoría & Diseño Integral",
    collection: "Servicios Profesionales",
    description: "Asesoría comercial personalizada, levantamiento técnico y especificación de proyecto.",
    materials: "Servicio Profesional Llave en Mano",
    dimensions: "Modalidad Presencial & Digital",
    price: 4500000,
    cost: 1200000,
    stock: 99,
    minStock: 5,
    inShowroom: true,
    isActive: true,
    categoryId: 2,
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    sku: "ART-002",
    name: "Mesa Monolítica de Centro",
    collection: "Línea Minimalista",
    description: "Superficie de acabado satinado y ensamble de alta precisión.",
    materials: "Piedra Natural & Base en Nogal",
    dimensions: "120 x 70 x 42 cm",
    price: 2890000,
    cost: 1450000,
    stock: 3,
    minStock: 2,
    inShowroom: true,
    isActive: true,
    categoryId: 1,
    imageUrl: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    sku: "ART-003",
    name: "Lámpara de Pie Escultórica",
    collection: "Iluminación de Acento",
    description: "Cuerpo metálico con difusor opalino y luz cálida regulable.",
    materials: "Latón Cepillado & Vidrio Soplado",
    dimensions: "Alt: 165 cm · Base: 32 cm",
    price: 1350000,
    cost: 650000,
    stock: 5,
    minStock: 2,
    inShowroom: true,
    isActive: true,
    categoryId: 3,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
  },
];

export const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [viewMode, setViewMode] = useState<"lookbook" | "table">("lookbook");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [selectedCategory, setSelectedCategory] = useState("TODAS");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Estados de carga de imagen local desde el dispositivo
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    collection: "Línea Signature",
    description: "",
    materials: "",
    dimensions: "",
    price: "",
    cost: "",
    stock: "",
    minStock: "3",
    inShowroom: true,
    categoryId: 1,
  });

  const fetchProducts = async (searchTerm: string) => {
    try {
      const res = await api.get(`/products?search=${encodeURIComponent(searchTerm)}`);
      if (res.data?.data && res.data.data.length > 0) {
        setProducts(res.data.data);
      }
    } catch {
      // Usar mock local en caso de desconexión
    }
  };

  useEffect(() => {
    fetchProducts(debouncedSearch);
  }, [debouncedSearch]);

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (p.materials && p.materials.toLowerCase().includes(debouncedSearch.toLowerCase()));

    const matchCategory =
      selectedCategory === "TODAS" || p.collection === selectedCategory;

    return matchSearch && matchCategory;
  });

  const collections = ["TODAS", ...Array.from(new Set(products.map((p) => p.collection || "General")))];

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        sku: product.sku,
        name: product.name,
        collection: product.collection || "General",
        description: product.description || "",
        materials: product.materials || "",
        dimensions: product.dimensions || "",
        price: product.price.toString(),
        cost: product.cost ? product.cost.toString() : "",
        stock: product.stock.toString(),
        minStock: product.minStock.toString(),
        inShowroom: product.inShowroom,
        categoryId: product.categoryId,
      });
      setImagePreview(product.imageUrl || null);
      setSelectedFile(null);
    } else {
      setEditingProduct(null);
      setFormData({
        sku: `REF-${Math.floor(100 + Math.random() * 900)}`,
        name: "",
        collection: "Línea Signature",
        description: "",
        materials: "",
        dimensions: "",
        price: "",
        cost: "",
        stock: "10",
        minStock: "2",
        inShowroom: true,
        categoryId: 1,
      });
      setImagePreview(null);
      setSelectedFile(null);
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append("sku", formData.sku);
    dataToSend.append("name", formData.name);
    dataToSend.append("collection", formData.collection);
    dataToSend.append("description", formData.description);
    dataToSend.append("materials", formData.materials);
    dataToSend.append("dimensions", formData.dimensions);
    dataToSend.append("price", formData.price);
    if (formData.cost) dataToSend.append("cost", formData.cost);
    dataToSend.append("stock", formData.stock);
    dataToSend.append("minStock", formData.minStock);
    dataToSend.append("categoryId", formData.categoryId.toString());
    if (selectedFile) {
      dataToSend.append("image", selectedFile);
    } else if (imagePreview) {
      dataToSend.append("imageUrl", imagePreview);
    }

    if (editingProduct) {
      try {
        await api.put(`/products/${editingProduct.id}`, dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch {
        // Optimistic
      }
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...formData,
                imageUrl: imagePreview || p.imageUrl,
                price: Number(formData.price),
                cost: formData.cost ? Number(formData.cost) : null,
                stock: Number(formData.stock),
                minStock: Number(formData.minStock),
              }
            : p
        )
      );
    } else {
      try {
        const res = await api.post("/products", dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data?.data) {
          setProducts((prev) => [res.data.data, ...prev]);
        }
      } catch {
        const newP: Product = {
          id: Date.now(),
          sku: formData.sku,
          name: formData.name,
          collection: formData.collection,
          description: formData.description,
          materials: formData.materials,
          dimensions: formData.dimensions,
          price: Number(formData.price),
          cost: formData.cost ? Number(formData.cost) : null,
          stock: Number(formData.stock),
          minStock: Number(formData.minStock),
          inShowroom: formData.inShowroom,
          isActive: true,
          categoryId: formData.categoryId,
          imageUrl: imagePreview || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
          createdAt: new Date().toISOString(),
        };
        setProducts((prev) => [newP, ...prev]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Cabecera Neumórfica */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset-sm border border-white/20">
              Catálogo & Stock
            </span>
            <span className="w-2 h-2 rounded-full bg-neu-success shadow-neu-glow-success animate-pulse" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-neu-text-dark">
            Catálogo <span className="text-neu-accent">&</span> Servicios
          </h1>
          <p className="text-xs text-neu-text-sub mt-1">
            Gestión de artículos, servicios, precios de venta y control de existencias con carga local.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Selector de Modo Lookbook / Tabla con estilo Neumórfico */}
          <div className="p-1.5 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20 flex items-center gap-1">
            <button
              onClick={() => setViewMode("lookbook")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "lookbook"
                  ? "bg-neu-surface shadow-neu-raised-xs text-neu-accent"
                  : "text-neu-text-muted hover:text-neu-text-dark"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Lookbook
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "table"
                  ? "bg-neu-surface shadow-neu-raised-xs text-neu-accent"
                  : "text-neu-text-muted hover:text-neu-text-dark"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Tabla
            </button>
          </div>

          <Button variant="accent" size="md" onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" /> Agregar Ítem
          </Button>
        </div>
      </header>

      {/* Barra de Filtros & Búsqueda */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-neu-surface shadow-neu-raised-sm border border-white/60">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-neu">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neu-text-muted px-2">
            Línea:
          </span>
          {collections.map((col) => (
            <button
              key={col}
              onClick={() => setSelectedCategory(col)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all duration-200 border ${
                selectedCategory === col
                  ? "bg-neu-surface shadow-neu-inset border-white/20 text-neu-accent font-bold"
                  : "bg-neu-surface shadow-neu-raised-xs border-white/60 text-neu-text-sub hover:text-neu-text-dark hover:shadow-neu-raised-sm"
              }`}
            >
              {col}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neu-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por nombre o SKU..."
            className="neu-input-search"
          />
        </div>
      </div>

      {/* VISTA 1: LOOKBOOK VISUAL NEUMÓRFICO */}
      {viewMode === "lookbook" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => {
            const isLowStock = item.stock <= item.minStock;
            return (
              <article
                key={item.id}
                className="neu-card p-5 group hover:shadow-neu-raised-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Marco de Imagen con Relieve Hundido */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neu-surface shadow-neu-inset border border-white/20 p-1">
                    <img
                      src={item.imageUrl || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <span className="absolute top-3 left-3 bg-neu-surface/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-mono font-bold text-neu-text-dark shadow-neu-raised-xs border border-white/40">
                      {item.sku}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-neu-surface/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-mono font-extrabold text-neu-accent shadow-neu-raised-xs border border-white/40">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  {/* Ficha Descriptiva */}
                  <div className="p-3 pt-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-2.5 py-0.5 rounded-full shadow-neu-inset-sm border border-white/20">
                      {item.collection}
                    </span>
                    <h3 className="font-display text-base font-bold text-neu-text-dark group-hover:text-neu-accent transition-colors">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-neu-text-sub line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    {item.materials && (
                      <p className="text-[11px] text-neu-text-muted italic">
                        {item.materials}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pie con Estado de Inventario y Botón de Edición Táctil */}
                <div className="p-3 pt-3 border-t border-neu-surfaceDark/50 mt-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-neu-text-muted block">
                      Existencias
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        isLowStock ? "text-neu-danger" : "text-neu-text-dark"
                      }`}
                    >
                      {item.stock} unidades {isLowStock && "(Bajo stock)"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenModal(item)}
                    className="w-9 h-9 rounded-full bg-neu-surface shadow-neu-raised-xs flex items-center justify-center text-neu-text-sub hover:text-neu-accent hover:shadow-neu-inset active:scale-95 transition-all border border-white/60"
                    title="Editar Ítem"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* VISTA 2: TABLA TÉCNICA NEUMÓRFICA */
        <div className="neu-card p-6 md:p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neu-surfaceDark/40 text-[10px] font-bold uppercase tracking-wider text-neu-text-muted">
                  <th className="pb-3 pl-3">SKU</th>
                  <th className="pb-3">Nombre & Línea</th>
                  <th className="pb-3">Especificación</th>
                  <th className="pb-3 text-center">Stock</th>
                  <th className="pb-3 text-right">Costo / Margen</th>
                  <th className="pb-3 text-right">Precio de Venta</th>
                  <th className="pb-3 text-center pr-3">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neu-surfaceDark/30">
                {filteredProducts.map((p) => {
                  const margin = p.cost
                    ? Math.round(((Number(p.price) - Number(p.cost)) / Number(p.price)) * 100)
                    : 50;
                  return (
                    <tr key={p.id} className="hover:bg-white/40 transition-colors">
                      <td className="py-4 pl-3 font-mono font-bold text-neu-text-dark">{p.sku}</td>
                      <td className="py-4">
                        <p className="font-bold text-neu-text-dark">{p.name}</p>
                        <span className="text-[10px] text-neu-accent font-semibold">{p.collection}</span>
                      </td>
                      <td className="py-4 text-neu-text-sub text-xs italic">{p.materials || "—"}</td>
                      <td className="py-4 text-center font-mono">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            p.stock <= p.minStock
                              ? "bg-neu-danger-light text-neu-danger shadow-neu-inset-sm"
                              : "bg-neu-surface text-neu-text-dark shadow-neu-inset-sm"
                          }`}
                        >
                          {p.stock} unids
                        </span>
                      </td>
                      <td className="py-4 text-right font-mono text-neu-text-sub">
                        {p.cost ? formatCurrency(p.cost) : "—"}
                        <span className="block text-[10px] text-neu-success font-bold">{margin}% Margen</span>
                      </td>
                      <td className="py-4 text-right font-mono font-extrabold text-neu-text-dark text-sm">
                        {formatCurrency(p.price)}
                      </td>
                      <td className="py-4 text-center pr-3">
                        <button
                          onClick={() => handleOpenModal(p)}
                          className="w-8 h-8 rounded-full bg-neu-surface shadow-neu-raised-xs inline-flex items-center justify-center text-neu-text-sub hover:text-neu-accent hover:shadow-neu-inset transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para Crear / Editar Producto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Editar Ítem del Catálogo" : "Nuevo Ítem / Servicio"}
        subtitle="Configura precios, especificaciones y sube la imagen desde tu dispositivo"
      >
        <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
          {/* Zona de Subida de Imagen desde el Dispositivo */}
          <div>
            <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
              Fotografía de Catálogo (Subir desde tu dispositivo)
            </label>

            {imagePreview ? (
              <div className="p-4 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover shadow-neu-raised-xs border border-white/40"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-neu-success uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Imagen Cargada
                    </span>
                    <p className="text-xs font-bold text-neu-text-dark mt-0.5">
                      {selectedFile ? selectedFile.name : "Imagen actual del producto"}
                    </p>
                    {selectedFile && (
                      <span className="text-[10px] font-mono text-neu-text-muted">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="w-8 h-8 rounded-full bg-neu-surface shadow-neu-raised-xs flex items-center justify-center text-neu-text-sub hover:text-neu-danger hover:shadow-neu-inset transition-all"
                  title="Eliminar imagen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-neu-accent bg-neu-accent/5 shadow-neu-inset"
                    : "border-neu-surfaceDark bg-neu-surface shadow-neu-inset hover:border-neu-accent"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-neu-surface shadow-neu-raised-xs flex items-center justify-center text-neu-accent">
                    <ImagePlus className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neu-text-dark block">
                      Haz clic para examinar o arrastra la foto aquí
                    </span>
                    <span className="text-[10px] text-neu-text-muted font-mono">
                      Formatos compatibles: JPG, PNG o WEBP (máx. 5 MB)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                SKU / Código *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="neu-input font-mono"
              />
            </div>

            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                Nombre del Ítem / Servicio *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Sillón Lounge / Consultoría A"
                className="neu-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                Línea / Categoría
              </label>
              <input
                type="text"
                value={formData.collection}
                onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                placeholder="Ej. Línea Signature / Servicios"
                className="neu-input"
              />
            </div>

            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                Especificaciones / Atributos
              </label>
              <input
                type="text"
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                placeholder="Ej. Formato, materiales o especificaciones..."
                className="neu-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1 font-sans">
                Precio Venta *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="neu-input"
              />
            </div>

            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1 font-sans">
                Costo Base
              </label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="neu-input"
              />
            </div>

            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1 font-sans">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="neu-input"
              />
            </div>

            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1 font-sans">
                Mín. Alerta
              </label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                className="neu-input"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neu-surfaceDark/50 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="accent">
              {editingProduct ? "Actualizar Ítem" : "Guardar en Catálogo"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
