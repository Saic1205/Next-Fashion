import React, { useState, useEffect } from "react";
import { ProductStatus } from "@prisma/client";
import { Product } from "../types/types";
import { toast } from "react-toastify";
import {
  updateGarment,
  updateFabric,
  deleteProduct,
  fetchUniqueValues,
} from "../actions/adminActions";
import { GarmentUpdateInput, FabricUpdateInput } from "../types/types";

interface AdminProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const AdminProductDetails: React.FC<AdminProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [editedProduct, setEditedProduct] = useState<Product | null>(product);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [uniqueValues, setUniqueValues] = useState<Record<string, string[]>>(
    {}
  );

  useEffect(() => {
    setEditedProduct(product);
    setChangedFields(new Set());
    fetchUniqueValues().then((data) => {
      const finalData = {
        ...data,
        material: data.material.filter((item): item is string => item !== null),
      };
      setUniqueValues(finalData);
    });
  }, [product]);

  if (!isOpen || !product || !editedProduct) return null;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (value === "other") {
      const newValue = prompt(`Enter new ${name}:`);
      if (newValue) {
        setEditedProduct((prev) =>
          prev ? { ...prev, [name]: newValue } : null
        );
        setUniqueValues((prev) => ({
          ...prev,
          [name]: [...(prev[name] || []), newValue],
        }));
      }
    } else {
      const numericFields = ["price", "sale_price", "length"];
      const newValue = numericFields.includes(name) ? Number(value) : value;
      setEditedProduct((prev) => (prev ? { ...prev, [name]: newValue } : null));
    }
    setChangedFields((prev) => new Set(prev).add(name));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditedProduct((prev) => (prev ? { ...prev, [name]: checked } : null));
    setChangedFields((prev) => new Set(prev).add(name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedProduct) return;

    try {
      const { id, createdAt, type, ...updateData } = editedProduct;
      let updatedData;
      if (type === "Garment") {
        updatedData = {
          ...updateData,
          sale_price:
            updateData.sale_price !== null ? updateData.sale_price : undefined,
        };
        await updateGarment(parseInt(id), updatedData as GarmentUpdateInput);
      } else {
        updatedData = {
          ...updateData,
          sale_price:
            updateData.sale_price !== null ? updateData.sale_price : undefined,
        };
        await updateFabric(parseInt(id), updatedData as FabricUpdateInput);
      }
      onUpdate();
      toast.success(updatedData.name + " updated successfully");
      onClose();
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleDelete = async () => {
    if (!editedProduct) return;

    try {
      await deleteProduct(parseInt(editedProduct.id), editedProduct.type);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const inputClassName = (fieldName: string) =>
    `input input-bordered w-full max-w-xs ${
      changedFields.has(fieldName) ? "input-primary" : ""
    }`;

  const renderDropdown = (name: string, options: string[]) => (
    <select
    title="name"
      name={name}
      value={(editedProduct[name as keyof Product] as string) || ""}
      onChange={handleInputChange}
      className={`select ${inputClassName(name)}`}
    >
      <option value="" disabled>
        Select {name}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
      <option value="other">Other</option>
    </select>
  );

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">{editedProduct.name} Details</h3>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={editedProduct.name}
                onChange={handleInputChange}
                className={inputClassName("name")}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Price</span>
              </label>
              <input
                type="number"
                name="price"
                value={editedProduct.price}
                onChange={handleInputChange}
                className={inputClassName("price")}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Sale Price</span>
              </label>
              <input
                type="number"
                name="sale_price"
                value={editedProduct.sale_price || ""}
                onChange={handleInputChange}
                className={inputClassName("sale_price")}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                title="status"
                name="status"
                value={editedProduct.status}
                onChange={handleInputChange}
                className={`select ${inputClassName("status")}`}
              >
                <option value={ProductStatus.LISTED}>Listed</option>
                <option value={ProductStatus.UNLISTED}>Unlisted</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Sale</span>
              </label>
              <input
                type="checkbox"
                name="sale"
                checked={editedProduct.sale}
                onChange={handleCheckboxChange}
                className="toggle toggle-primary"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Color</span>
              </label>
              {renderDropdown("color", uniqueValues.color || [])}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              {renderDropdown("category", uniqueValues.category || [])}
            </div>
            {editedProduct.type === "Garment" && (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Collection</span>
                  </label>
                  {renderDropdown("collection", uniqueValues.collection || [])}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Designer</span>
                  </label>
                  {renderDropdown("designer", uniqueValues.designer || [])}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Size</span>
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={editedProduct.size || ""}
                    onChange={handleInputChange}
                    className={inputClassName("size")}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Brand</span>
                  </label>
                  {renderDropdown("brand", uniqueValues.brand || [])}
                </div>
              </>
            )}
            {editedProduct.type === "Fabric" && (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Pattern</span>
                  </label>
                  {renderDropdown("pattern", uniqueValues.pattern || [])}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Length</span>
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={editedProduct.length || ""}
                    onChange={handleInputChange}
                    className={inputClassName("length")}
                  />
                </div>
              </>
            )}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Material</span>
              </label>
              {renderDropdown("material", uniqueValues.material || [])}
            </div>
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-primary btn-outline">
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-error btn-outline"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              Delete Product
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
      {showDeleteConfirmation && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm delete</h3>
            <p className="py-4">
              Are you sure you want to delete this product?
            </p>
            <div className="modal-action">
              <button className="btn btn-error btn-outline" onClick={handleDelete}>
                Yes
              </button>
              <button
                className="btn"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductDetails;
