export const classTuitionBreadcrumbItems = [
  { label: ({ pathname }) => (pathname.includes("class-tuition") ? "Học phí lớp học" : "Quản lý học phí"), path: -1 },
];
export const addTuitionBreadcrumbItems = [...classTuitionBreadcrumbItems, { label: "Thêm học phí" }];
export const editTuitionBreadcrumbItems = [...classTuitionBreadcrumbItems, { label: "Sửa học phí" }];

export const tuitionDiscountBreadcrumbItems = [{ label: "Miễn giảm học phí", path: "/tuition-discount" }];
export const addTuitionDiscountBreadcrumbItems = [...tuitionDiscountBreadcrumbItems, { label: "Thêm miễn giảm" }];
export const editTuitionDiscountBreadcrumbItems = [...tuitionDiscountBreadcrumbItems, { label: "Sửa miễn giảm" }];
