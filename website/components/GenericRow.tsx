import classNames from "classnames";

export const GenericRow = ({ children, ...props }: any) => {
  return (
    <div
      className={classNames(
        "shadow-inner flex flex-col bg-[#E0B779] rounded-xl px-4 py-1 text-black cursor-pointer",
        { "hover:shadow-2xl hover:scale-[101%]": props.onClick != null }
      )}
      {...props}
    >
      {children}
    </div>
  );
};
