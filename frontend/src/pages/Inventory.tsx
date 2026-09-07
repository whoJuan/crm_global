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
  BadgePercent,
  CheckCircle2,
  AlertCircle,
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
    name: "Sillón Lounge de Diseño Editorial",
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
  const debouncedSearch = useDebounce(search, 350); // Consulta 1 a 1
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
    // Dispara 1 sola consulta cuando el usuario pausa la escritura
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

  // Manejo de archivo local desde el dispositivo
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
      {/* Cabecera Editorial */}
      <header className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-ink-100 gap-6">
        <div>
          <span className="editorial-tag text-brass-600">Catálogo Universal · Bienes & Servicios</span>
          <h1 className="font-serif text-4xl font-normal text-ink-950 mt-1">
            Catálogo <span className="italic font-light text-brass-600">&</span> Servicios
          </h1>
          <p className="text-sm text-ink-600 mt-2 font-light max-w-xl">
            Gestión de productos, servicios, precios de venta y control de inventario con carga directa desde tu dispositivo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-canvas-alt border border-ink-200 p-0.5 flex items-center">
            <button
              onClick={() => setViewMode("lookbook")}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                viewMode === "lookbook" ? "bg-surface text-ink-950 shadow-xs" : "text-ink-500 hover:text-ink-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Lookbook
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                viewMode === "table" ? "bg-surface text-ink-950 shadow-xs" : "text-ink-500 hover:text-ink-900"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Tabla Técnica
            </button>
          </div>

          <Button variant="primary" size="md" onClick={() => handleOpenModal()}>
            <Plus className="w-3.5 h-3.5 mr-2" /> Agregar al Catálogo
          </Button>
        </div>
      </header>

      {/* Barra de Filtros & Búsqueda con Debounce 1 a 1 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-ink-100">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="editorial-tag text-[9px] mr-2 text-ink-400">Línea:</span>
          {collections.map((col) => (
            <button
              key={col}
              onClick={() => setSelectedCategory(col)}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                selectedCategory === col
                  ? "bg-ink-950 text-canvas font-semibold"
                  : "bg-surface border border-ink-100 text-ink-600 hover:border-ink-400"
              }`}
            >
              {col}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar (consulta 1 a 1)..."
            className="w-full bg-canvas-alt border border-ink-100 pl-8 pr-3 py-1.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500 font-mono"
          />
        </div>
      </div>

      {/* VISTA 1: LOOKBOOK VISUAL EDITORIAL */}
      {viewMode === "lookbook" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((item) => {
            const isLowStock = item.stock <= item.minStock;
            return (
              <article
                key={item.id}
                className="editorial-card group hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Imagen */}
                  <div className="relative aspect-[4/3] bg-canvas-alt overflow-hidden border-b border-ink-100">
                    <img
                      src={item.imageUrl || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                    <span className="absolute top-3 left-3 bg-surface/95 px-2.5 py-1 text-[10px] font-mono text-ink-900 border border-ink-200">
                      {item.sku}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-ink-950 text-canvas px-2.5 py-1 text-[11px] font-mono">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  {/* Ficha */}
                  <div className="p-6 space-y-3">
                    <div>
                      <span className="editorial-tag text-brass-600">{item.collection}</span>
                      <h3 className="font-serif text-xl font-medium text-ink-950 mt-0.5 group-hover:text-brass-600 transition-colors">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-ink-600 mt-1 font-light leading-relaxed">{item.description}</p>
                      )}
                    </div>

                    {item.materials && (
                      <p className="text-[11px] text-ink-500 italic">
                        Especificación: {item.materials}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-ink-100 mt-4 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-ink-400 uppercase block">Inventario</span>
                    <strong className={isLowStock ? "text-clay-600 font-bold" : "text-ink-900"}>
                      {item.stock} unids {isLowStock && "(Bajo stock)"}
                    </strong>
                  </div>

                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-1.5 text-ink-400 hover:text-ink-950 hover:bg-canvas-alt border border-ink-200"
                    title="Editar Ficha"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* VISTA 2: TABLA TÉCNICA */
        <div className="editorial-card overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-ink-100 text-[10px] font-mono text-ink-400 uppercase bg-canvas-alt/50">
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Nombre & Línea</th>
                <th className="p-4 font-medium">Especificación</th>
                <th className="p-4 font-medium text-center">Stock</th>
                <th className="p-4 font-medium text-right">Costo / Margen</th>
                <th className="p-4 font-medium text-right">Precio de Venta</th>
                <th className="p-4 font-medium text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filteredProducts.map((p) => {
                const margin = p.cost
                  ? Math.round(((Number(p.price) - Number(p.cost)) / Number(p.price)) * 100)
                  : 50;
                return (
                  <tr key={p.id} className="hover:bg-canvas-alt/40 transition-colors">
                    <td className="p-4 font-mono font-semibold text-ink-900">{p.sku}</td>
                    <td className="p-4">
                      <p className="font-serif text-sm font-medium text-ink-950">{p.name}</p>
                      <span className="editorial-tag text-brass-600 text-[9px]">{p.collection}</span>
                    </td>
                    <td className="p-4 text-ink-600 text-xs italic">{p.materials || "—"}</td>
                    <td className="p-4 text-center font-mono">
                      <span
                        className={`font-semibold ${
                          p.stock <= p.minStock ? "text-clay-600 bg-clay-50 px-2 py-0.5 border border-clay-200" : "text-ink-900"
                        }`}
                      >
                        {p.stock} unids
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-ink-500">
                      {p.cost ? formatCurrency(p.cost) : "—"}
                      <span className="block text-[10px] text-sage-600 font-bold">{margin}% Margen</span>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-ink-950">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleOpenModal(p)}
                        className="p-1 text-ink-400 hover:text-ink-950 hover:bg-canvas-alt"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para Crear / Editar Producto con Carga de Archivo Local */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Editar Ítem del Catálogo" : "Nuevo Ítem / Servicio"}
        subtitle="Configura precios, especificaciones y sube la imagen desde tu dispositivo"
      >
        <form onSubmit={handleSaveProduct} className="space-y-5 text-xs font-sans">
          {/* Zona de Subida de Imagen desde el Dispositivo */}
          <div>
            <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1.5">
              Fotografía de Catálogo (Subir desde tu dispositivo)
            </label>

            {imagePreview ? (
              <div className="relative border border-ink-200 bg-canvas-alt p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover border border-ink-200"
                  />
                  <div>
                    <span className="editorial-tag text-sage-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Imagen Seleccionada
                    </span>
                    <p className="text-xs text-ink-800 mt-0.5">
                      {selectedFile ? selectedFile.name : "Imagen actual del catálogo"}
                    </p>
                    {selectedFile && (
                      <span className="text-[10px] font-mono text-ink-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 text-ink-400 hover:text-clay-600 hover:bg-clay-50 transition-colors"
                  title="Eliminar y seleccionar otra"
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
                className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-brass-600 bg-brass-50/50"
                    : "border-ink-200 bg-canvas-alt hover:border-brass-500 hover:bg-canvas"
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
                  <div className="w-10 h-10 bg-surface border border-ink-200 flex items-center justify-center text-brass-600">
                    <ImagePlus className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-ink-900 block">
                      Haz clic para buscar en tu dispositivo o arrastra la imagen aquí
                    </span>
                    <span className="text-[10px] text-ink-400 font-mono">
                      Formatos compatibles: JPG, PNG o WEBP (máx. 5 MB)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                SKU / Código *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 font-mono focus:outline-none focus:border-brass-500"
              />
            </div>

            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Nombre del Ítem / Servicio *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Sillón Lounge / Consultoría A"
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Línea / Categoría
              </label>
              <input
                type="text"
                value={formData.collection}
                onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                placeholder="Ej. Línea Signature / Servicios"
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>

            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Especificaciones / Atributos
              </label>
              <input
                type="text"
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                placeholder="Ej. Formato, materiales o descripción corta..."
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Precio Venta (COP) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>

            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Costo Base
              </label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>

            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Inventario
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>

            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Mínimo Alerta
              </label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-ink-100 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {editingProduct ? "Actualizar Ítem" : "Guardar en Catálogo"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
