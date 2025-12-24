import { useEffect } from "react";

interface Category {
  id: number;
  name: string;
}

const CourseSidebar = ({
  categories = [],
  activeCategoryId,
  setActiveCategoryId,
}: {
  categories?: Category[];
  activeCategoryId?: number;
  setActiveCategoryId: (id: number) => void;
}) => {
  useEffect(() => {
    // DEBUG: remove when stable
    // eslint-disable-next-line no-console
    console.log("CourseSidebar categories:", categories);
  }, [categories]);

  // Defensive: ensure categories is an array
  const cats: Category[] = Array.isArray(categories) ? categories : [];

  // Handler that sets active category id (0 = All)
  const handleSelect = (id: number) => {
    setActiveCategoryId(id);
  };

  return (
    <div className="col-xl-3 col-lg-4">
      <aside className="courses__sidebar">
        {/* CATEGORY FILTER */}
        <div className="courses-widget">
          <h4 className="widget-title">Categories</h4>

          <div className="courses-cat-list">
            <ul className="list-wrap">
              {/* All Courses option */}
              <li>
                <div
                  className="form-check"
                  onClick={() => handleSelect(0)}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={activeCategoryId === 0}
                    readOnly
                    id={`cat_all`}
                  />
                  <label className="form-check-label" htmlFor={`cat_all`}>
                    All Courses
                  </label>
                </div>
              </li>

              {cats.length === 0 ? (
                // show placeholder when no categories
                <li>
                  <div className="form-check">
                    <span style={{ color: "#777" }}>No categories available</span>
                  </div>
                </li>
              ) : (
                cats.map((cat) => (
                  <li key={cat.id}>
                    <div
                      className="form-check"
                      onClick={() => handleSelect(cat.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={activeCategoryId === cat.id}
                        readOnly
                        id={`cat_${cat.id}`}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`cat_${cat.id}`}
                      >
                        {cat.name}
                      </label>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CourseSidebar;
