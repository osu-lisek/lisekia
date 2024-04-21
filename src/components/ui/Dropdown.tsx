
interface IDropdownProps {
    children?: React.ReactNode[],
    title: string,
    icon: any,
}

export default function Dropdown({ children, icon, title }: IDropdownProps) {
    return (<div className="h-full group sm:relative">
        <div className={`px-4 text-xl duration-[400ms] ease-in-out gap-2 sm:hover:bg-white/20 h-full flex items-center cursor-pointer`}>
            {/* <Users /> Community */}
            {icon} <span className="hidden sm:block">{title}</span>
        </div>
        <div className="left-0 absolute shadow-md w-full min-h-[50px] bg-[#2B2B2B] opacity-0 -translate-y-[140%] sm:translate-y-12 pointer-events-none duration-[200ms] group-hover:opacity-100 sm:group-hover:translate-y-0 group-hover:pointer-events-auto sm:rounded-b-xl flex flex-col items-center py-[12px] px-[4px] gap-2 ease-in-out">
            {children}
        </div>
    </div>)
}