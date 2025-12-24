import React from "react";

export default function CategoriesSidebar({ categories = [], activeCategoryId, onSelect }) {
  return (
    <div className="categories-sidebar hidden md:block w-56 ml-6">
      <div className="bg-white rounded-lg border p-4">
        <h4 className="text-sm font-semibold mb-3">Categories</h4>
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full text-left text-sm py-2 rounded ${activeCategoryId === null ? "bg-primary/10 text-primary" : "hover:bg-gray-100"}`}
              onClick={() => onSelect(null)}
            >
              All Categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => onSelect(cat.id)}
                className={`w-full text-left text-sm py-2 rounded ${activeCategoryId === cat.id ? "bg-primary/10 text-primary" : "hover:bg-gray-100"}`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
