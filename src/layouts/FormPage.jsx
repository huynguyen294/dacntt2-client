const SimplePage = ({ children, title }) => {
  return (
    <div className="px-2 sm:px-10 overflow-y-auto pb-10">
      {title && <p className="text-2xl font-bold pl-1 mb-3">{title}</p>}
      {children}
    </div>
  );
};

export default SimplePage;
