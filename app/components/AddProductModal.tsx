import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createProduct, fetchUniqueValues } from "../actions/adminActions";

type AddProductModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  onProductAdded: () => Promise<void>;
};

type FormDataType = {
  name?: string;
  price?: number;
  sale_price?: number | null;
  category?: string;
  color?: string;
  material?: string;
  collection?: string;
  designer?: string;
  brand?: string;
  size?: string;
  pattern?: string;
  length?: number | null;
  frontImage?: File;
  backImage?: File;
};

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onRequestClose,
  onProductAdded,
}) => {
  const [productType, setProductType] = useState<"garment" | "fabric">(
    "garment"
  );
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({});
  const [uniqueValues, setUniqueValues] = useState<Record<string, string[]>>(
    {}
  );

  useEffect(() => {
    fetchUniqueValues().then((data) => {
      const finalData = {
        ...data,
        material: data.material.filter((item): item is string => item !== null),
      };
      setUniqueValues(finalData);
    });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (value === "other") {
      const newValue = prompt(`Enter new ${name}:`);
      if (newValue) {
        setFormData((prev) => ({ ...prev, [name]: newValue }));
        setUniqueValues((prev) => ({
          ...prev,
          [name]: [...(prev[name] || []), newValue],
        }));
      }
    } else {
      const numericFields = ["price", "sale_price", "length"];
      const newValue = numericFields.includes(name) ? Number(value) : value;
      setFormData((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    console.log("form data", formData);

    try {
      const submitFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (value instanceof File) {
            submitFormData.append(key, value, value.name);
          } else if (typeof value === "boolean") {
            submitFormData.append(key, (value as string).toString());
          } else {
            submitFormData.append(key, String(value));
          }
        }
      });
      submitFormData.append("productType", productType);

      console.log(
        "Form data being sent to backend:",
        Object.fromEntries(submitFormData)
      );

      const result = await createProduct(submitFormData);
      //console.log("Result from createProduct:", result);

      if (result) {
        toast.success("Product created successfully");
        onRequestClose();
        await onProductAdded();
      } else {
        throw new Error("Failed to create product");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create product");
      }
      //console.error("Error creating product:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const renderDropdown = (name: string, options: string[]) => (
    <select
      name={name}
      value={(formData[name as keyof FormDataType] as string) || ""}
      onChange={handleInputChange}
      className="select select-bordered w-full"
      required
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
    <dialog
      id="add-product-modal"
      className={`modal ${isOpen ? "modal-open" : ""}`}
      open={isOpen}
    >
      <div className="modal-box bg-base-300">
        <h3 className="font-bold text-lg">
          {isCreating ? "Creating Product..." : "Add New Product"}
        </h3>
        {isCreating ? (
          <div className="py-4 flex justify-center">
            <span className="loading loading-infinity loading-lg text-success"></span>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Product Type</span>
                <div>
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2">Garment</span>
                    <input
                      type="radio"
                      name="product-type"
                      className="radio radio-primary"
                      checked={productType === "garment"}
                      onChange={() => setProductType("garment")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2">Fabric</span>
                    <input
                      type="radio"
                      name="product-type"
                      className="radio radio-primary"
                      checked={productType === "fabric"}
                      onChange={() => setProductType("fabric")}
                    />
                  </label>
                </div>
              </label>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                className="input input-bordered w-full"
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="input input-bordered w-full"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="number"
                name="sale_price"
                placeholder="Sale Price (optional)"
                className="input input-bordered w-full"
                onChange={handleInputChange}
              />
              {renderDropdown("category", uniqueValues.category || [])}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {renderDropdown("color", uniqueValues.color || [])}
              {renderDropdown("material", uniqueValues.material || [])}
            </div>

            {productType === "garment" && (
              <>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderDropdown("collection", uniqueValues.collection || [])}
                  {renderDropdown("designer", uniqueValues.designer || [])}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  {renderDropdown("brand", uniqueValues.brand || [])}
                  {renderDropdown("size", uniqueValues.size || [])}
                </div>
              </>
            )}

            {productType === "fabric" && (
              <>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderDropdown("pattern", uniqueValues.pattern || [])}
                  <input
                    type="number"
                    name="length"
                    placeholder="Length"
                    className="input input-bordered w-full"
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <label className="block mb-2">Front Image</label>
                <input
                  type="file"
                  name="frontImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Back Image</label>
                <input
                  type="file"
                  name="backImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                  required
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isCreating}
              >
                Create
              </button>
              <button
                type="button"
                className="btn"
                onClick={onRequestClose}
                disabled={isCreating}
              >
                Close
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
};

export default AddProductModal;
